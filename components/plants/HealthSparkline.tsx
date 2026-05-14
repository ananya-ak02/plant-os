"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

export function HealthSparkline({ data }: { data: { date: string; score: number }[] }) {
  const points = data.length ? data : [{ date: "Today", score: 72 }];
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #d9f99d" }} />
          <Line type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
