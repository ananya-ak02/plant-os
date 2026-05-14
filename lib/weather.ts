import { WeatherSnapshot } from "./types";

const geocodeFallback: Record<string, { latitude: number; longitude: number }> = {
  bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  bangalore: { latitude: 12.9716, longitude: 77.5946 },
  delhi: { latitude: 28.6139, longitude: 77.209 },
  mumbai: { latitude: 19.076, longitude: 72.8777 },
  pune: { latitude: 18.5204, longitude: 73.8567 },
  lucknow: { latitude: 26.8467, longitude: 80.9462 },
  kolkata: { latitude: 22.5726, longitude: 88.3639 },
  chennai: { latitude: 13.0827, longitude: 80.2707 },
  hyderabad: { latitude: 17.385, longitude: 78.4867 },
  jaipur: { latitude: 26.9124, longitude: 75.7873 },
  ahmedabad: { latitude: 23.0225, longitude: 72.5714 }
};

async function geocode(city: string) {
  const normalized = city.trim().toLowerCase();
  if (geocodeFallback[normalized]) return geocodeFallback[normalized];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) throw new Error(`Geocoding failed for ${city}`);
  const data = await response.json();
  const first = data.results?.[0];
  if (!first) return geocodeFallback.bengaluru;
  return { latitude: first.latitude as number, longitude: first.longitude as number };
}

export async function fetchWeather(city: string): Promise<WeatherSnapshot> {
  const { latitude, longitude } = await geocode(city);
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,rain,uv_index,wind_speed_10m",
    timezone: "Asia/Kolkata"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { next: { revalidate: 60 * 20 } });
  if (!response.ok) throw new Error(`Open-Meteo failed: ${response.status}`);
  const data = await response.json();
  const current = data.current;
  return {
    city,
    latitude,
    longitude,
    temperatureC: current.temperature_2m ?? 0,
    humidity: current.relative_humidity_2m ?? 0,
    rainfallMm: current.rain ?? 0,
    uvIndex: current.uv_index ?? 0,
    windKph: current.wind_speed_10m ?? 0,
    fetchedAt: new Date().toISOString()
  };
}
