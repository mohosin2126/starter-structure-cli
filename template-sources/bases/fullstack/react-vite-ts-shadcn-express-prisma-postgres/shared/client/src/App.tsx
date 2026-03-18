import FeatureGrid from "@/components/feature-grid";
import StatsPanel from "@/components/stats-panel";
import { Button } from "@/components/ui/button";

const workstreams = [
  { name: "Client shell", state: "Ready", tone: "text-emerald-600" },
  { name: "API auth", state: "Connected", tone: "text-sky-600" },
  { name: "Postgres schema", state: "Live", tone: "text-violet-600" }
] as const;

export default function App() {
  const appName = import.meta.env.VITE_APP_NAME || "__APP_NAME__";

  return (
    <main className="px-5 py-8 md:px-10">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/85 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-900">
                shadcn-style fullstack starter
              </span>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                  {appName} starts with reusable UI primitives and a PostgreSQL-ready backend.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[var(--muted-foreground)]">
                  Ship the React client with shadcn-style building blocks while the Express + Prisma API
                  handles auth, data access, and the enterprise structure layer on day one.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg">Launch workspace</Button>
              <Button size="lg" variant="secondary">Review API flow</Button>
            </div>

            <div className="grid gap-3 rounded-3xl bg-[var(--muted)] p-4">
              {workstreams.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-950">{item.name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Starter module status</p>
                  </div>
                  <span className={`text-sm font-semibold ${item.tone}`}>{item.state}</span>
                </div>
              ))}
            </div>
          </div>

          <StatsPanel />
        </div>
      </section>

      <FeatureGrid />
    </main>
  );
}
