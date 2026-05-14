import { Part } from "@google/generative-ai";

const defaultModelName = "gemini-flash-latest";

function apiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is required");
  return key;
}

export async function generateGeminiJson<T>(prompt: string, parts: Part[] = []): Promise<T> {
  const primaryModel = process.env.GEMINI_MODEL || defaultModelName;
  const fallbackModels = [primaryModel, "gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash-lite"];
  
  let lastErrorText = "";
  let response;

  for (const model of fallbackModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey()}`;
    
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, ...parts] }],
        generationConfig: { temperature: 0.25, topP: 0.9 }
      })
    });

    if (response.ok) {
      break; // Successfully got a response!
    } else {
      lastErrorText = await response.text();
      console.warn(`Model ${model} failed, trying next...`);
    }
  }

  if (!response || !response.ok) {
    throw new Error(`All Gemini models failed. Last error: ${lastErrorText}`);
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
