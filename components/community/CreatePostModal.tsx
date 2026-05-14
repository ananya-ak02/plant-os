"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { PlantUploader } from "../plants/PlantUploader";

export function CreatePostModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [loading, setLoading] = useState(false);
  if (!open) return null;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.set("image", file);
    form.set("description", description);
    form.set("city", city);
    const response = await fetch("/api/community", { method: "POST", body: form });
    setLoading(false);
    if (response.ok) { onCreated(); onClose(); }
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest/70 p-4">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-3xl bg-cream p-6 shadow-organic">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-forest">Ask the Garden</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-forest hover:bg-forest/10"><X /></button>
        </div>
        <div className="mt-5 grid gap-4">
          <PlantUploader onFile={setFile} />
          <input value={city} onChange={(event) => setCity(event.target.value)} className="rounded-2xl border border-forest/15 bg-white px-4 py-3 text-forest" />
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="rounded-2xl border border-forest/15 bg-white px-4 py-3 text-forest" placeholder="Describe what you are seeing on the plant" />
          <button disabled={loading || !file || description.length < 10} className="rounded-2xl bg-forest px-5 py-3 font-semibold text-cream disabled:opacity-50">{loading ? "Analyzing..." : "Post anonymously"}</button>
        </div>
      </form>
    </div>
  );
}
