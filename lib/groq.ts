import Groq from "groq-sdk";

function groqApiKey() {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is required");
  return key;
}

export function groqClient() {
  return new Groq({ apiKey: groqApiKey() });
}

export async function groqJson<T>(system: string, user: string): Promise<T> {
  const completion = await groqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty response");
  return JSON.parse(content) as T;
}
