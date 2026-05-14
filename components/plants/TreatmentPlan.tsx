import { CheckCircle2 } from "lucide-react";

export function TreatmentPlan({ steps }: { steps: string[] }) {
  return (
    <section className="rounded-3xl bg-cream p-6 shadow-organic">
      <h2 className="font-display text-3xl text-forest">Treatment Plan</h2>
      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3 rounded-2xl bg-white/70 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-leaf" />
            <p className="text-forest"><span className="font-semibold">Step {index + 1}:</span> {step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
