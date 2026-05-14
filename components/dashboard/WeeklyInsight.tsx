import { Sparkles } from "lucide-react";

export function WeeklyInsight({ insight }: { insight: string }) {
  return (
    <section className="rounded-3xl bg-forest p-6 text-cream shadow-organic">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-leaf" />
        <p className="text-sm uppercase tracking-[0.2em] text-leaf">PlantOS Intelligence</p>
      </div>
      <p className="mt-4 font-display text-3xl leading-tight">{insight}</p>
    </section>
  );
}
