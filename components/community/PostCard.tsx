import { ArrowBigUp, BadgeCheck } from "lucide-react";
import { ReplyThread } from "./ReplyThread";

type Post = {
  id: string;
  anonymous_label: string;
  city: string;
  image_url: string;
  description: string;
  upvotes: number;
  created_at: string;
  ai_diagnosis_json: { species?: string; immediate_action?: string; health_score?: number };
  community_replies?: { id: string; content: string; is_ai_generated: boolean; created_at: string }[];
};

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="break-inside-avoid overflow-hidden rounded-3xl bg-cream shadow-organic">
      <img src={post.image_url} alt={post.description} className="h-64 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-forest">{post.anonymous_label}</p>
          <span className="flex items-center gap-1 rounded-full bg-leaf/20 px-3 py-1 text-xs font-semibold text-forest"><BadgeCheck className="h-3 w-3" />AI checked</span>
        </div>
        <p className="text-forest/80">{post.description}</p>
        <div className="rounded-2xl bg-forest p-4 text-cream">
          <p className="font-display text-xl">{post.ai_diagnosis_json?.species ?? "Plant diagnosis"}</p>
          <p className="mt-1 text-sm text-cream/75">{post.ai_diagnosis_json?.immediate_action ?? "PlantOS is reviewing this case."}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-forest/60">
          <span className="flex items-center gap-1"><ArrowBigUp className="h-4 w-4" />{post.upvotes}</span>
          <span>{new Date(post.created_at).toLocaleDateString("en-IN")}</span>
        </div>
        <ReplyThread replies={post.community_replies ?? []} />
      </div>
    </article>
  );
}
