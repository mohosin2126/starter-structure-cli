import { Button } from "@/components/ui/button";

const summary = [
  { label: "Active seats", value: "1,284" },
  { label: "Weekly conversions", value: "18.4%" },
  { label: "Response time", value: "94 ms" }
] as const;

export default function StatsPanel() {
  return (
    <aside className="rounded-[1.75rem] border border-[var(--border)] bg-slate-950 p-6 text-slate-50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Overview</p>
          <h2 className="mt-3 text-2xl font-semibold">UI blocks ready for the next screen.</h2>
        </div>
        <Button variant="secondary" size="sm">Export</Button>
      </div>

      <div className="mt-8 grid gap-3">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
