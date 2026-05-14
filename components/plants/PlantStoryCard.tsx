type StoryStats = {
  plantName: string;
  species: string;
  daysTracked: number;
  healthImprovement: number;
  diseasesSurvived: number;
  bestHealthScore: number;
};

export function PlantStoryCard({ stats }: { stats: StoryStats }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-forest p-8 text-cream shadow-organic">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-leaf/25" />
      <p className="text-sm uppercase tracking-[0.24em] text-leaf">Plant Story</p>
      <h2 className="mt-3 font-display text-5xl">{stats.plantName}</h2>
      <p className="mt-2 text-cream/75">{stats.species}</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div><p className="text-3xl font-bold">{stats.daysTracked}</p><p className="text-sm text-cream/70">days tracked</p></div>
        <div><p className="text-3xl font-bold">+{stats.healthImprovement}%</p><p className="text-sm text-cream/70">health lift</p></div>
        <div><p className="text-3xl font-bold">{stats.diseasesSurvived}</p><p className="text-sm text-cream/70">issues survived</p></div>
        <div><p className="text-3xl font-bold">{stats.bestHealthScore}</p><p className="text-sm text-cream/70">best score</p></div>
      </div>
    </section>
  );
}
