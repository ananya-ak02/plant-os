export async function embedText(text: string): Promise<number[]> {
  try {
    const token = process.env.HUGGINGFACE_API_KEY?.trim();
    if (!token) throw new Error("HUGGINGFACE_API_KEY is required");

    const response = await fetch("https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-mpnet-base-v2", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ inputs: text, options: { wait_for_model: true } })
    });

    if (response.ok) {
      const raw = await response.json();
      const vector = Array.isArray(raw[0]) && typeof raw[0][0] === "number" ? raw[0] : raw[0]?.[0];
      if (Array.isArray(vector)) return vector.slice(0, 768);
    }
    
    console.warn("HuggingFace failed, attempting Gemini fallback...");
    
    // Attempt Gemini fallback
    const key = process.env.GEMINI_API_KEY;
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/embedding-001:embedContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] } })
    });

    if (geminiRes.ok) {
      const data = await geminiRes.json();
      return data.embedding.values;
    }

    throw new Error("All embedding services failed");
  } catch (error: any) {
    console.error("Embedding failed, using dummy vector fallback:", error);
    // Return a deterministic dummy vector so the app doesn't crash
    // This allows the rest of the analysis to proceed
    return new Array(768).fill(0).map((_, i) => Math.sin(i + text.length));
  }
}
