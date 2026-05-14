import { Redis } from "@upstash/redis";

export function redis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function cachedJson<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
  const client = redis();
  if (!client) return load();
  const cached = await client.get<T>(key);
  if (cached) return cached;
  const value = await load();
  await client.set(key, value, { ex: ttlSeconds });
  return value;
}
