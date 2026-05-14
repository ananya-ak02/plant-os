import { NextRequest, NextResponse } from "next/server";
import { analyzePlantImage } from "@/lib/agents/visionAgent";
import { uploadPlantImage } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("image");
    const plantId = form.get("plantId")?.toString();
    const language = form.get("language")?.toString() as "hindi" | "english" | undefined;
    if (!(file instanceof File)) return NextResponse.json({ error: "image file is required" }, { status: 400 });
    const { publicUrl, buffer } = await uploadPlantImage(file, "plant-photos");
    const analysis = await analyzePlantImage({ buffer, mimeType: file.type, publicUrl, plantId, language });
    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "analysis failed" }, { status: 500 });
  }
}
