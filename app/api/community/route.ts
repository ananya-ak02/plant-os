import { NextRequest, NextResponse } from "next/server";
import { createCommunityDiagnosisPost } from "@/lib/agents/communityAgent";
import { createSupabaseServerClient } from "@/lib/supabase";
import { uploadPlantImage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  const supabase = createSupabaseServerClient();
  let query = supabase.from("community_posts").select("*, community_replies(*)").order("created_at", { ascending: false }).limit(50);
  if (city) query = query.eq("city", city);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const image = form.get("image");
    const city = form.get("city")?.toString() || "Bengaluru";
    const description = form.get("description")?.toString() || "";
    const userId = form.get("userId")?.toString() || null;
    if (!(image instanceof File)) return NextResponse.json({ error: "image file is required" }, { status: 400 });
    if (description.trim().length < 10) return NextResponse.json({ error: "description must be at least 10 characters" }, { status: 400 });
    const { publicUrl, buffer } = await uploadPlantImage(image, "community");
    const post = await createCommunityDiagnosisPost({ userId, city, description, imageUrl: publicUrl, imageBuffer: buffer, mimeType: image.type });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "community post failed" }, { status: 500 });
  }
}
