"use client";

import { useState } from "react";
import { CareSchedule } from "@/lib/types";

export function CareTaskChecklist({ schedule }: { schedule: CareSchedule }) {
  const tasks = [
    schedule.watering.needed ? `Water ${schedule.watering.amount}` : "Check soil moisture",
    `${schedule.sunlight.hours}h ${schedule.sunlight.needed} sunlight`,
    schedule.fertilizer.needed ? "Apply fertilizer" : `Next fertilizer ${schedule.fertilizer.next_date}`
  ];
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <label key={task} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white/70 p-3 text-forest">
          <input type="checkbox" checked={Boolean(done[task])} onChange={(event) => setDone({ ...done, [task]: event.target.checked })} className="h-5 w-5 accent-leaf" />
          <span className={done[task] ? "line-through opacity-60" : ""}>{task}</span>
        </label>
      ))}
    </div>
  );
}
