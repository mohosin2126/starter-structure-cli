import { Button } from "@/components/ui/button";
import StatsPanel from "@/components/stats-panel";

const workstreams = [
  { name: "Onboarding", state: "Ready", tone: "text-emerald-600" },
  { name: "Billing", state: "Draft", tone: "text-amber-600" },
  { name: "Insights", state: "Review", tone: "text-sky-600" }
];

export default function App() {
  const appName = import.meta.env.VITE_APP_NAME || "__APP_NAME__";

  return (
    <main className="px-5 py-8 md:px-10">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/85 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="space-y-8">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-900">
                shadcn/ui-style React starter
              </span>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                  {appName} starts with reusable UI primitives instead of one-off markup.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[var(--muted-foreground)]">
                  Use a button primitive, utility helpers, CSS variables, and a dashboard-style page shell
                  as the base for admin panels, internal tools, or product dashboards.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg">Create project</Button>
              <Button size="lg" variant="secondary">Preview components</Button>
            </div>

            <div className="grid gap-3 rounded-3xl bg-[var(--muted)] p-4">
              {workstreams.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-950">{item.name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Current module status</p>
                  </div>
                  <span className={`text-sm font-semibold ${item.tone}`}>{item.state}</span>
                </div>
              ))}
            </div>
          </div>

          <StatsPanel />
        </div>
      </section>
    </main>
  );
}
