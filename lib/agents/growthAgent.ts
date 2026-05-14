import { generateGeminiJson, imagePartFromBuffer } from "../gemini";

export type GrowthAnalysis = {
  growth_percentage: number;
  observations: string[];
  milestone: string;
  health_trend: "improving" | "stable" | "declining";
};

export async function analyzeSequentialGrowth(previous: { buffer: Buffer; mimeType: string }, current: { buffer: Buffer; mimeType: string }) {
  return generateGeminiJson<GrowthAnalysis>(
    'Compare these two plant photos taken one week apart. Return strict JSON: {"growth_percentage":15,"observations":["new leaf cluster"],"milestone":"First flower detected","health_trend":"improving|stable|declining"}. Be conservative and practical.',
    [imagePartFromBuffer(previous.buffer, previous.mimeType), imagePartFromBuffer(current.buffer, current.mimeType)]
  );
}
