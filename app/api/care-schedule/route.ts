import { NextRequest, NextResponse } from "next/server";
import { generateCareSchedule } from "@/lib/agents/careAgent";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.plantId || !body.city) return NextResponse.json({ error: "plantId and city are required" }, { status: 400 });
    const result = await generateCareSchedule(body.plantId, body.city);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "care schedule failed" }, { status: 500 });
  }
}
