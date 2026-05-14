import { GrowthTimeline } from "@/components/plants/GrowthTimeline";
import { PlantStoryCard } from "@/components/plants/PlantStoryCard";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function GrowthJournalPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: plant } = await supabase.from("plants").select("*, plant_photos(*), diagnoses(*)").eq("id", params.id).single();
  if (!plant) return <main className="p-8 text-forest">Plant not found.</main>;
  const photos = (plant.plant_photos ?? []).sort((a: any, b: any) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime());
  const scores = photos.map((p: any) => p.health_score);
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-earth">Growth Journal</p>
        <h1 className="font-display text-6xl text-forest">{plant.nickname}</h1>
        <p className="mt-2 text-forest/70">Weekly photos become a visible memory of recovery, growth, and care.</p>
      </div>
      <GrowthTimeline photos={photos} />
      <PlantStoryCard stats={{ plantName: plant.nickname, species: plant.species, daysTracked: Math.max(1, Math.ceil((Date.now() - new Date(plant.created_at).getTime()) / 86400000)), healthImprovement: Math.max(0, (scores.at(-1) ?? 0) - (scores[0] ?? 0)), diseasesSurvived: (plant.diagnoses ?? []).filter((d: any) => d.resolved_at).length, bestHealthScore: scores.length ? Math.max(...scores) : 78 }} />
    </main>
  );
}
