import { generateGeminiJson, imagePartFromBuffer } from "../gemini";
import { searchDiseasePatterns, upsertDiseasePatternFromAnalysis } from "../rag";
import { createSupabaseServerClient } from "../supabase";
import { PlantAnalysis } from "../types";

const analysisSchema = `{
  "species": "Tulsi / Holy Basil",
  "common_name_hindi": "तुलसी",
  "health_score": 0,
  "diseases_detected": [{ "name": "string", "confidence": 0.0, "severity": "low|medium|high" }],
  "deficiencies": ["nitrogen deficiency"],
  "pest_signs": ["aphids"],
  "growth_stage": "seedling|juvenile|mature|flowering",
  "immediate_action": "string",
  "treatment_plan": ["step 1", "step 2"],
  "language": "hindi|english"
}`;

function validateMime(mimeType: string) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    throw new Error("Only JPEG, PNG, and WEBP plant photos are supported");
  }
}

export async function analyzePlantImage(params: {
  buffer: Buffer;
  mimeType: string;
  publicUrl?: string;
  plantId?: string;
  language?: "hindi" | "english";
}) {
  validateMime(params.mimeType);

  const firstPass = await generateGeminiJson<PlantAnalysis>(
    `You are PlantOS Vision, an expert Indian plant pathologist. Analyze the plant image and return strict JSON matching this schema: ${analysisSchema}. Prefer Indian common species names when appropriate. Keep treatment practical for balcony and home gardeners.`,
    [imagePartFromBuffer(params.buffer, params.mimeType)]
  );

  const diseaseQuery = [
    firstPass.species,
    ...firstPass.diseases_detected.map((d) => `${d.name} ${d.severity}`),
    ...firstPass.deficiencies,
    ...firstPass.pest_signs,
    firstPass.immediate_action
  ].join(". ");
  const matches = diseaseQuery.trim() ? await searchDiseasePatterns(diseaseQuery, 3) : [];

  const finalPass = await generateGeminiJson<PlantAnalysis>(
    `You are PlantOS Vision. Re-analyze the same image with this community RAG context from similar Indian plant cases: ${JSON.stringify(matches)}. Return only strict JSON matching ${analysisSchema}. Make the treatment plan specific, safe, and sequenced. Use ${params.language ?? firstPass.language ?? "english"} when choosing the language field.`,
    [imagePartFromBuffer(params.buffer, params.mimeType)]
  );

  const analysis: PlantAnalysis = { ...finalPass, matched_cases: matches, public_image_url: params.publicUrl };

  await Promise.all(
    analysis.diseases_detected.map((disease) =>
      upsertDiseasePatternFromAnalysis(
        disease.name,
        `${analysis.species}: ${analysis.immediate_action}`,
        [...analysis.deficiencies, ...analysis.pest_signs],
        analysis.treatment_plan.join(" "),
        disease.severity
      )
    )
  );

  if (params.plantId && params.publicUrl) {
    const supabase = createSupabaseServerClient();
    const { data: photo, error: photoError } = await supabase
      .from("plant_photos")
      .insert({ plant_id: params.plantId, storage_url: params.publicUrl, health_score: analysis.health_score, analysis_json: analysis })
      .select("id")
      .single();
    if (photoError) throw photoError;
    const { error: diagnosisError } = await supabase.from("diagnoses").insert({
      plant_id: params.plantId,
      photo_id: photo.id,
      gemini_analysis_json: analysis,
      treatment_plan: analysis.treatment_plan
    });
    if (diagnosisError) throw diagnosisError;
  }

  return analysis;
}
