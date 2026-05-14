"use client";

import { FormEvent, useState } from "react";
import { AnalysisResult } from "@/components/plants/AnalysisResult";
import { PlantUploader } from "@/components/plants/PlantUploader";
import { TreatmentPlan } from "@/components/plants/TreatmentPlan";
import { PlantAnalysis } from "@/lib/types";

export default function NewPlantPage() {
  const [file, setFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("Bengaluru balcony");
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.set("image", file);
    form.set("language", "english");
    try {
      const response = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Plant analysis failed. Please try another clear photo.");
        setAnalysis(null);
        return;
      }
      setAnalysis(data.analysis);
    } catch {
      setError("PlantOS could not reach the analysis service. Please check the dev server and try again.");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }

  async function savePlant() {
    if (!analysis) return;
    await fetch("/api/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: process.env.NEXT_PUBLIC_DEMO_USER_ID,
        nickname: nickname || analysis.species.split("/")[0].trim(),
        species: analysis.species,
        common_name_hindi: analysis.common_name_hindi,
        location
      })
    });
    window.location.href = "/dashboard";
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="font-display text-6xl text-forest">Add a Plant</h1>
      <p className="mt-2 text-forest/70">Start with one photo. PlantOS will build the first living profile.</p>
      <form onSubmit={analyze} className="mt-8 grid gap-6">
        <PlantUploader onFile={setFile} />
        <div className="grid gap-4 md:grid-cols-2">
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-forest" placeholder="Nickname" />
          <input value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-forest" placeholder="Location" />
        </div>
        <button disabled={!file || loading} className="rounded-2xl bg-forest px-5 py-4 font-semibold text-cream disabled:opacity-50">{loading ? "Reading leaves..." : "Analyze plant"}</button>
      </form>
      {error && <div className="mt-6 rounded-3xl bg-earth/10 p-5 font-semibold text-earth">{error}</div>}
      {analysis && (
        <div className="mt-8 space-y-6">
          <AnalysisResult analysis={analysis} />
          <TreatmentPlan steps={analysis.treatment_plan} />
          <button onClick={savePlant} className="rounded-2xl bg-leaf px-6 py-4 font-bold text-forest">Save living profile</button>
        </div>
      )}
    </main>
  );
}
