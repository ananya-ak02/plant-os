export type DiseaseSeverity = "low" | "medium" | "high";
export type GrowthStage = "seedling" | "juvenile" | "mature" | "flowering";
export type LanguagePreference = "hindi" | "english" | "hinglish";

export type DiseaseDetection = {
  name: string;
  confidence: number;
  severity: DiseaseSeverity;
};

export type PlantAnalysis = {
  species: string;
  common_name_hindi: string;
  health_score: number;
  diseases_detected: DiseaseDetection[];
  deficiencies: string[];
  pest_signs: string[];
  growth_stage: GrowthStage;
  immediate_action: string;
  treatment_plan: string[];
  language: "hindi" | "english";
  matched_cases?: RagDiseaseMatch[];
  public_image_url?: string;
};

export type RagDiseaseMatch = {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatment: string;
  severity: DiseaseSeverity;
  similarity: number;
};

export type WeatherSnapshot = {
  city: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  humidity: number;
  rainfallMm: number;
  uvIndex: number;
  windKph: number;
  fetchedAt: string;
};

export type CareSchedule = {
  watering: { needed: boolean; amount: string; reason: string };
  sunlight: { needed: "direct" | "indirect" | "shade"; hours: number; reason: string };
  fertilizer: { needed: boolean; next_date: string };
  warnings: string[];
  message_hindi: string;
  message_english: string;
};

export type PlantRecord = {
  id: string;
  user_id: string;
  nickname: string;
  species: string;
  common_name_hindi: string | null;
  location: string;
  created_at: string;
};
