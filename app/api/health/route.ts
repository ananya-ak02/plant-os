import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    app: "ok",
    gemini: Boolean(process.env.GEMINI_API_KEY),
    groq: Boolean(process.env.GROQ_API_KEY),
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    huggingface: Boolean(process.env.HUGGINGFACE_API_KEY),
    redis: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    time: new Date().toISOString()
  };
  const ok = checks.gemini && checks.groq && checks.supabase && checks.huggingface;
  return NextResponse.json(checks, { status: ok ? 200 : 503 });
}
