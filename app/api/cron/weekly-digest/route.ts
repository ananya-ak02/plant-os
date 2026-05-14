import { NextRequest, NextResponse } from "next/server";
import { generateWeeklyDigest } from "@/lib/agents/communityAgent";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return !secret || request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("community_posts").select("city").gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const cities = [...new Set((data ?? []).map((row) => row.city).filter(Boolean))];
  const digests = [];
  for (const city of cities) {
    digests.push({ city, digest: await generateWeeklyDigest(city) });
  }
  return NextResponse.json({ digests });
}
