import { NextRequest, NextResponse } from "next/server";
import { cachedJson } from "@/lib/redis";
import { fetchWeather } from "@/lib/weather";

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get("city") || "Bengaluru";
    const weather = await cachedJson(`weather:${city.toLowerCase()}`, 60 * 20, () => fetchWeather(city));
    return NextResponse.json({ weather });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "weather failed" }, { status: 500 });
  }
}
