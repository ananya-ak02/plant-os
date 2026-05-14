import { AlertCircle } from "lucide-react";

export function AlertStrip({ alerts }: { alerts: string[] }) {
  if (!alerts.length) return <div className="rounded-3xl bg-leaf/20 p-4 text-forest">All plants are steady today. Keep the rhythm gentle.</div>;
  return (
    <div className="flex gap-3 overflow-x-auto rounded-3xl bg-earth/10 p-4">
      {alerts.map((alert) => <span key={alert} className="inline-flex min-w-fit items-center gap-2 rounded-2xl bg-cream px-4 py-2 text-earth"><AlertCircle className="h-4 w-4" />{alert}</span>)}
    </div>
  );
}
