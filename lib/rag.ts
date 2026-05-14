import { createSupabaseServerClient } from "./supabase";
import { embedText } from "./embeddings";
import { RagDiseaseMatch } from "./types";

export async function searchDiseasePatterns(query: string, count = 3): Promise<RagDiseaseMatch[]> {
  const embedding = await embedText(query);
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("match_disease_patterns", { query_embedding: embedding, match_count: count });
  if (error) throw error;
  return (data ?? []) as RagDiseaseMatch[];
}

export async function searchSpeciesCare(query: string, count = 3) {
  const embedding = await embedText(query);
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("match_species_care", { query_embedding: embedding, match_count: count });
  if (error) throw error;
  return data ?? [];
}

export async function upsertDiseasePatternFromAnalysis(name: string, description: string, symptoms: string[], treatment: string, severity: "low" | "medium" | "high") {
  const supabase = createSupabaseServerClient();
  const embedding = await embedText(`${name}. ${description}. ${symptoms.join(", ")}. ${treatment}`);
  const { error } = await supabase.from("disease_patterns").upsert(
    { name, description, symptoms, treatment, severity, embedding },
    { onConflict: "name" }
  );
  if (error) throw error;
}
