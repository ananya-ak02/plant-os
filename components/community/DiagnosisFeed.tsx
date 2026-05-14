"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { CreatePostModal } from "./CreatePostModal";
import { PostCard } from "./PostCard";

export function DiagnosisFeed({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [open, setOpen] = useState(false);
  async function refresh() {
    const response = await fetch("/api/community");
    const data = await response.json();
    setPosts(data.posts ?? []);
  }
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase.channel("community-feed").on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, refresh).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-5xl text-forest">Community Diagnosis</h1>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-forest px-4 py-3 font-semibold text-cream"><Plus className="h-4 w-4" />Post</button>
      </div>
      <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
        {posts.map((post) => <div key={post.id} className="mb-6"><PostCard post={post} /></div>)}
      </div>
      <CreatePostModal open={open} onClose={() => setOpen(false)} onCreated={refresh} />
    </section>
  );
}
