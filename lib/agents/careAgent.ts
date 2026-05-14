import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { groqJson } from "../groq";
import { searchSpeciesCare } from "../rag";
import { createSupabaseServerClient } from "../supabase";
import { fetchWeather } from "../weather";
import { CareSchedule } from "../types";

export async function generateCareSchedule(plantId: string, city: string) {
  const supabase = createSupabaseServerClient();
  const { data: plant, error: plantError } = await supabase.from("plants").select("*").eq("id", plantId).single();
  if (plantError) throw plantError;

  const weatherFetcher = new DynamicStructuredTool({
    name: "weatherFetcher",
    description: "Fetches current Open-Meteo weather for an Indian city.",
    schema: z.object({ city: z.string() }),
    func: async ({ city }) => JSON.stringify(await fetchWeather(city))
  });
  const speciesLookup = new DynamicStructuredTool({
    name: "speciesLookup",
    description: "Retrieves species care requirements from pgvector.",
    schema: z.object({ species: z.string() }),
    func: async ({ species }) => JSON.stringify(await searchSpeciesCare(species, 3))
  });
  const historyAnalyzer = new DynamicStructuredTool({
    name: "historyAnalyzer",
    description: "Looks at the last 14 days of care logs for a plant.",
    schema: z.object({ plantId: z.string() }),
    func: async ({ plantId }) => {
      const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase.from("care_logs").select("*").eq("plant_id", plantId).gte("logged_at", since).order("logged_at", { ascending: false });
      if (error) throw error;
      return JSON.stringify(data ?? []);
    }
  });
  const careScheduleGenerator = new DynamicStructuredTool({
    name: "careScheduleGenerator",
    description: "Synthesizes weather, species requirements, and history into today's care instructions.",
    schema: z.object({ payload: z.string() }),
    func: async ({ payload }) => payload
  });

  const [weatherRaw, speciesRaw, historyRaw] = await Promise.all([
    weatherFetcher.invoke({ city }),
    speciesLookup.invoke({ species: plant.species }),
    historyAnalyzer.invoke({ plantId })
  ]);
  const synthesisPayload = await careScheduleGenerator.invoke({ payload: JSON.stringify({ plant, weather: JSON.parse(weatherRaw), speciesCare: JSON.parse(speciesRaw), recentCareLogs: JSON.parse(historyRaw) }) });

  const schedule = await groqJson<CareSchedule>(
    "You are PlantOS Care Agent, a practical Indian gardening expert. Return strict JSON only.",
    `Generate today's care schedule using this context: ${synthesisPayload}. Output exactly this shape: {"watering":{"needed":true,"amount":"150ml","reason":"Humidity low (45%), last watered 3 days ago"},"sunlight":{"needed":"indirect","hours":4,"reason":"Current UV index high"},"fertilizer":{"needed":false,"next_date":"2026-06-15"},"warnings":["Temperature dropping tonight - bring indoors"],"message_hindi":"Aaj aapke Tulsi ko paani chahiye...","message_english":"Your Tulsi needs water today..."}`
  );

  const weather = JSON.parse(weatherRaw);
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("care_schedules").upsert({
    plant_id: plantId,
    schedule_date: today,
    schedule_json: schedule,
    weather_snapshot_json: weather,
    completed_tasks: {}
  }, { onConflict: "plant_id,schedule_date" });
  if (error) throw error;

  return { schedule, weather };
}
