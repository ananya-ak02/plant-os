import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select("*, plant_photos(*), care_logs(*), diagnoses(*), care_schedules(*)")
    .eq("id", params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ plant: data });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("plants").update({
      nickname: body.nickname,
      species: body.species,
      common_name_hindi: body.common_name_hindi,
      location: body.location
    }).eq("id", params.id).select("*").single();
    if (error) throw error;
    return NextResponse.json({ plant: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "plant update failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("plants").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
