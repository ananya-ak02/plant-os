"use client";

import { CloudSun, Droplets, MapPin, Sun } from "lucide-react";
import { WeatherSnapshot } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function WeatherWidget({ weather }: { weather: WeatherSnapshot }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newCity, setNewCity] = useState(weather.city);
  const router = useRouter();

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCity.trim() && newCity !== weather.city) {
      router.push(`/dashboard?city=${encodeURIComponent(newCity.trim())}`);
    }
    setIsEditing(false);
  };

  return (
    <section className="rounded-3xl bg-cream p-5 shadow-organic">
      <div className="flex items-center justify-between">
        <div>
          {isEditing ? (
            <form onSubmit={handleCitySubmit} className="mb-1 flex items-center gap-2">
              <input
                autoFocus
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-32 rounded-lg border border-forest/20 bg-cream px-2 py-0.5 text-sm text-forest focus:outline-none focus:ring-1 focus:ring-leaf"
              />
            </form>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-sm text-forest/60 hover:text-forest"
            >
              <MapPin className="h-3 w-3" />
              Weather in {weather.city}
            </button>
          )}
          <h2 className="font-display text-4xl text-forest">{Math.round(weather.temperatureC)}°C</h2>
        </div>
        <CloudSun className="h-12 w-12 text-earth" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-forest">
        <span className="flex items-center gap-1"><Droplets className="h-4 w-4" />{weather.humidity}%</span>
        <span className="flex items-center gap-1"><Sun className="h-4 w-4" />UV {weather.uvIndex}</span>
        <span>{weather.rainfallMm} mm rain</span>
      </div>
    </section>
  );
}
