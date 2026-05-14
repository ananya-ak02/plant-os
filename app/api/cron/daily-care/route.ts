import { NextRequest, NextResponse } from "next/server";
import { generateCareSchedule } from "@/lib/agents/careAgent";
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
  const { data: plants, error } = await supabase.from("plants").select("id, location, users(city)");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const results = [];
  for (const plant of plants ?? []) {
    const joinedUsers = (plant as any).users;
    const userCity = Array.isArray(joinedUsers) ? joinedUsers[0]?.city : joinedUsers?.city;
    const city = userCity || plant.location || "Bengaluru";
    try {
      results.push({ plantId: plant.id, ...(await generateCareSchedule(plant.id, city)) });
    } catch (error) {
      results.push({ plantId: plant.id, error: error instanceof Error ? error.message : "failed" });
    }
  }
  return NextResponse.json({ processed: results.length, results });
}
