import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (!body.content || body.content.trim().length < 2) return NextResponse.json({ error: "content is required" }, { status: 400 });
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("community_replies").insert({
      post_id: params.id,
      user_id: body.userId ?? null,
      content: body.content,
      is_ai_generated: Boolean(body.is_ai_generated)
    }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ reply: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "reply failed" }, { status: 500 });
  }
}
