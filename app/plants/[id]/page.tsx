import Link from "next/link";
import { GrowthTimeline } from "@/components/plants/GrowthTimeline";
import { PlantStoryCard } from "@/components/plants/PlantStoryCard";
import { TreatmentPlan } from "@/components/plants/TreatmentPlan";
import { CareScheduleCard } from "@/components/care/CareScheduleCard";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PlantProfilePage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: plant } = await supabase.from("plants").select("*, plant_photos(*), diagnoses(*), care_schedules(*), care_logs(*)").eq("id", params.id).single();
  if (!plant) return <main className="p-8 text-forest">Plant not found.</main>;
  const photos = (plant.plant_photos ?? []).sort((a: any, b: any) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime());
  const latestDiagnosis = (plant.diagnoses ?? []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  const scores = photos.map((p: any) => p.health_score);
  const best = scores.length ? Math.max(...scores) : 0;
  const first = scores[0] ?? best;
  const latest = scores[scores.length - 1] ?? best;
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Link href="/dashboard" className="text-sm font-semibold text-earth">Back to dashboard</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-earth">{plant.species}</p>
            <h1 className="font-display text-6xl text-forest">{plant.nickname}</h1>
            <p className="mt-2 text-forest/70">{plant.common_name_hindi} · {plant.location}</p>
          </div>
          <GrowthTimeline photos={photos} />
          <PlantStoryCard stats={{ plantName: plant.nickname, species: plant.species, daysTracked: Math.max(1, Math.ceil((Date.now() - new Date(plant.created_at).getTime()) / 86400000)), healthImprovement: Math.max(0, latest - first), diseasesSurvived: (plant.diagnoses ?? []).filter((d: any) => d.resolved_at).length, bestHealthScore: best || 78 }} />
        </section>
        <aside className="space-y-6">
          {plant.care_schedules?.[0]?.schedule_json && <CareScheduleCard plantName={plant.nickname} schedule={plant.care_schedules[0].schedule_json} />}
          {latestDiagnosis?.treatment_plan && <TreatmentPlan steps={latestDiagnosis.treatment_plan} />}
          <Link href={`/plants/${plant.id}/journal`} className="block rounded-3xl bg-leaf/20 p-5 font-semibold text-forest">Open growth journal</Link>
        </aside>
      </div>
    </main>
  );
}
