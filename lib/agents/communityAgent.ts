import { groqJson } from "../groq";
import { generateGeminiJson, imagePartFromBuffer } from "../gemini";
import { upsertDiseasePatternFromAnalysis } from "../rag";
import { createSupabaseServerClient } from "../supabase";
import { PlantAnalysis } from "../types";

type Moderation = { allowed: boolean; reason: string; anonymous_label: string };

/*
PlantOS self-improving flywheel:
Every community diagnosis post is analyzed by Gemini Vision, converted into a disease pattern,
embedded into pgvector, and made retrievable for future plant analyses. Better retrieval produces
better diagnosis and treatment plans, which builds trust, which creates more community posts, which
expands the knowledge base again. The product becomes more locally intelligent as Indian gardeners
use it across cities, seasons, and plant varieties.
*/
export async function createCommunityDiagnosisPost(params: {
  userId?: string | null;
  city: string;
  description: string;
  imageUrl: string;
  imageBuffer: Buffer;
  mimeType: string;
}) {
  const moderation = await groqJson<Moderation>(
    "You moderate a plant diagnosis community. Reject spam, abuse, medical claims, and irrelevant posts. Return JSON.",
    `City: ${params.city}. Description: ${params.description}. Return {"allowed":true,"reason":"safe","anonymous_label":"A gardener from ${params.city}"}.`
  );
  if (!moderation.allowed) throw new Error(`Community post rejected: ${moderation.reason}`);

  const diagnosis = await generateGeminiJson<PlantAnalysis>(
    `Analyze this community plant problem. Return strict PlantOS analysis JSON with species, common_name_hindi, health_score, diseases_detected, deficiencies, pest_signs, growth_stage, immediate_action, treatment_plan, language. Include the user description in context: ${params.description}`,
    [imagePartFromBuffer(params.imageBuffer, params.mimeType)]
  );

  await Promise.all(
    diagnosis.diseases_detected.map((disease) =>
      upsertDiseasePatternFromAnalysis(
        disease.name,
        `${params.city} community case for ${diagnosis.species}: ${params.description}`,
        [...diagnosis.deficiencies, ...diagnosis.pest_signs],
        diagnosis.treatment_plan.join(" "),
        disease.severity
      )
    )
  );

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: params.userId ?? null,
      anonymous_label: moderation.anonymous_label || `A gardener from ${params.city}`,
      city: params.city,
      image_url: params.imageUrl,
      description: params.description,
      ai_diagnosis_json: diagnosis
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function generateWeeklyDigest(city: string) {
  const supabase = createSupabaseServerClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase.from("community_posts").select("city, description, ai_diagnosis_json, upvotes").eq("city", city).gte("created_at", since);
  if (error) throw error;
  return groqJson<{ title: string; problems: string[]; advice: string }>(
    "You summarize city-level plant disease trends for Indian gardeners. Return JSON.",
    `Create a weekly PlantOS digest for ${city}. Posts: ${JSON.stringify(data ?? [])}. Return top 5 plant problems and practical advice.`
  );
}
