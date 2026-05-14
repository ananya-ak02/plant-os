import Link from "next/link";
import { Plus } from "lucide-react";
import { AlertStrip } from "@/components/dashboard/AlertStrip";
import { GardenOverview } from "@/components/dashboard/GardenOverview";
import { WeeklyInsight } from "@/components/dashboard/WeeklyInsight";
import { CareScheduleCard } from "@/components/care/CareScheduleCard";
import { WeatherWidget } from "@/components/care/WeatherWidget";
import { createSupabaseServerClient } from "@/lib/supabase";
import { fetchWeather } from "@/lib/weather";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: { city?: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: plants } = await supabase.from("plants").select("*, plant_photos(*), care_schedules(*)").order("created_at", { ascending: false }).limit(12);
  
  const city = searchParams.city || "Bengaluru";
  const weather = await fetchWeather(city);
  const plantList = plants ?? [];
  const alerts = plantList.flatMap((plant: any) => {
    const latest = (plant.plant_photos ?? []).sort((a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())[0];
    return latest && latest.health_score < 65 ? [`${plant.nickname} needs attention`] : [];
  });
  const firstSchedule = plantList[0]?.care_schedules?.[0]?.schedule_json;
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-earth">PlantOS Dashboard</p>
          <h1 className="font-display text-5xl text-forest">Good morning, gardener</h1>
        </div>
        <Link href="/plants/new" className="inline-flex items-center gap-2 rounded-2xl bg-forest px-5 py-3 font-semibold text-cream"><Plus className="h-4 w-4" />Add plant</Link>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AlertStrip alerts={alerts} />
          <GardenOverview plants={plantList} />
        </div>
        <aside className="space-y-6">
          <WeatherWidget weather={weather} />
          {firstSchedule ? <CareScheduleCard plantName={plantList[0].nickname} schedule={firstSchedule} /> : <WeeklyInsight insight="Upload your first plant photo and PlantOS will turn weather, species, and history into today’s care rhythm." />}
          <section className="rounded-3xl bg-cream p-6 shadow-organic">
            <h2 className="font-display text-3xl text-forest">Community pulse</h2>
            <p className="mt-2 text-forest/70">Leaf spots and overwatering are trending in humid cities this week.</p>
            <Link href="/community" className="mt-4 inline-block font-semibold text-earth">Open feed</Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
