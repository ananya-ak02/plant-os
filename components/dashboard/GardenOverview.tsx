import { PlantCard } from "../plants/PlantCard";

export function GardenOverview({ plants }: { plants: any[] }) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-earth">Living profiles</p>
          <h2 className="font-display text-4xl text-forest">Your Garden</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {plants.map((plant) => {
          const photos = plant.plant_photos ?? [];
          const latest = photos.sort((a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())[0];
          return <PlantCard key={plant.id} id={plant.id} nickname={plant.nickname} species={plant.species} location={plant.location} healthScore={latest?.health_score ?? 78} photoUrl={latest?.storage_url} history={photos.map((p: any) => ({ date: p.taken_at, score: p.health_score }))} />;
        })}
      </div>
    </section>
  );
}
