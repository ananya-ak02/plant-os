import { Part } from "@google/generative-ai";

const defaultModelName = "gemini-1.5-flash";

function apiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is required");
  return key;
}

export async function generateGeminiJson<T>(prompt: string, parts: Part[] = []): Promise<T> {
  const modelName = process.env.GEMINI_MODEL || defaultModelName;
  const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey()}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, ...parts] }],
      generationConfig: { temperature: 0.25, topP: 0.9, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;

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
