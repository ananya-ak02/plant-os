type Reply = { id: string; content: string; is_ai_generated: boolean; created_at: string };

export function ReplyThread({ replies }: { replies: Reply[] }) {
  return (
    <div className="mt-4 space-y-2">
      {replies.map((reply) => (
        <div key={reply.id} className="rounded-2xl bg-cream/70 p-3 text-sm text-forest">
          <p>{reply.content}</p>
          <p className="mt-1 text-xs text-forest/50">{reply.is_ai_generated ? "PlantOS AI" : "Gardener"} · {new Date(reply.created_at).toLocaleString("en-IN")}</p>
        </div>
      ))}
    </div>
  );
}
