import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const supabase = createSupabaseServerClient();
  let query = supabase.from("plants").select("*, plant_photos(*), care_schedules(*)").order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ plants: data ?? [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = ["user_id", "nickname", "species", "location"];
    for (const key of required) {
      if (!body[key]) return NextResponse.json({ error: `${key} is required` }, { status: 400 });
    }
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("plants").insert({
      user_id: body.user_id,
      nickname: body.nickname,
      species: body.species,
      common_name_hindi: body.common_name_hindi ?? null,
      location: body.location
    }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ plant: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "plant create failed" }, { status: 500 });
  }
}
