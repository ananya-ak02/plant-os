import { AlertTriangle } from "lucide-react";
import { CareSchedule } from "@/lib/types";
import { CareTaskChecklist } from "./CareTaskChecklist";

export function CareScheduleCard({ plantName, schedule }: { plantName: string; schedule: CareSchedule }) {
  return (
    <section className="rounded-3xl bg-cream p-6 shadow-organic">
      <h2 className="font-display text-3xl text-forest">{plantName} Today</h2>
      <p className="mt-2 text-sm text-forest/70">{schedule.message_english}</p>
      <div className="mt-5"><CareTaskChecklist schedule={schedule} /></div>
      {schedule.warnings.length > 0 && (
        <div className="mt-5 space-y-2">
          {schedule.warnings.map((warning) => <p key={warning} className="flex gap-2 rounded-2xl bg-earth/10 p-3 text-sm text-earth"><AlertTriangle className="h-4 w-4" />{warning}</p>)}
        </div>
      )}
    </section>
  );
}
