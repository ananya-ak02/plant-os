type Photo = { id: string; storage_url: string; health_score: number; taken_at: string };

export function GrowthTimeline({ photos }: { photos: Photo[] }) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex min-w-max gap-4">
        {photos.map((photo) => (
          <figure key={photo.id} className="relative h-64 w-48 overflow-hidden rounded-3xl bg-cream shadow-organic">
            <img src={photo.storage_url} alt="Plant timeline" className="h-full w-full object-cover" />
            <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-forest/85 px-3 py-2 text-sm text-cream">
              {new Date(photo.taken_at).toLocaleDateString("en-IN")} · {photo.health_score}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
