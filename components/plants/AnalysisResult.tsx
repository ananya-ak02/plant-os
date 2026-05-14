import { PlantAnalysis } from "@/lib/types";

export function AnalysisResult({ analysis }: { analysis: PlantAnalysis }) {
  return (
    <section className="rounded-3xl bg-forest p-6 text-cream shadow-organic">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-leaf">AI Diagnosis</p>
          <h2 className="mt-1 font-display text-3xl">{analysis.species}</h2>
          <p className="text-cream/75">{analysis.common_name_hindi} · {analysis.growth_stage}</p>
        </div>
        <div className="rounded-2xl bg-leaf px-4 py-2 text-lg font-bold text-forest">{analysis.health_score}/100</div>
      </div>
      <p className="mt-5 rounded-2xl bg-cream/10 p-4">{analysis.immediate_action}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {analysis.diseases_detected.map((disease) => (
          <div key={disease.name} className="rounded-2xl bg-cream/10 p-4">
            <p className="font-semibold">{disease.name}</p>
            <p className="text-sm text-cream/70">{Math.round(disease.confidence * 100)}% · {disease.severity}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
