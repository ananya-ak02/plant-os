import { DiagnosisFeed } from "@/components/community/DiagnosisFeed";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("community_posts").select("*, community_replies(*)").order("created_at", { ascending: false }).limit(50);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <DiagnosisFeed initialPosts={data ?? []} />
    </main>
  );
}
