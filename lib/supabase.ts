import { createClient } from "@supabase/supabase-js";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function serverRealtimeOptions() {
  if (typeof WebSocket !== "undefined") return {};
  const wsModule = require("ws");
  return { realtime: { transport: wsModule.WebSocket ?? wsModule } };
}

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase server environment variables");
  
  return createClient(url, key, {
    auth: { persistSession: false },
    ...serverRealtimeOptions()
  });
}

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase browser environment variables");

  return createClient(url, key);
}
