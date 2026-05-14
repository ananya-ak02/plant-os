import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const defaultModelName = "gemini-1.5-flash";

function apiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is required");
  return key;
}

export function geminiModel() {
  const modelName = process.env.GEMINI_MODEL || defaultModelName;
  return new GoogleGenerativeAI(apiKey()).getGenerativeModel({
    model: modelName,
    generationConfig: { temperature: 0.25, topP: 0.9, responseMimeType: "application/json" }
  });
}

export function geminiEmbeddingModel() {
  return new GoogleGenerativeAI(apiKey()).getGenerativeModel({ model: "embedding-001" });
}

export async function generateGeminiJson<T>(prompt: string, parts: Part[] = []): Promise<T> {
  const result = await geminiModel().generateContent([{ text: prompt }, ...parts]);
  const text = result.response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Gemini returned non-JSON response: ${text}`);
    return JSON.parse(match[0]) as T;
  }
}

export function imagePartFromBuffer(buffer: Buffer, mimeType: string): Part {
  return { inlineData: { data: buffer.toString("base64"), mimeType } };
}
