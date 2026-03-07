import FeatureGrid from "./components/feature-grid";

const launchTracks = [
  "Landing page sections with clear content hierarchy",
  "Tailwind v4 styling with a warm editorial visual language",
  "Simple component structure that is easy to extend"
] as const;

const checklist = [
  { label: "Brand system", value: "Colors, voice, layout" },
  { label: "Core pages", value: "Home, feature, CTA blocks" },
  { label: "Launch speed", value: "Fast local edits with Vite" }
] as const;

export default function App() {
  const appName = import.meta.env.VITE_APP_NAME || "__APP_NAME__";

  return (
    <main className="px-6 py-8 md:px-10 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-10 rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-12">
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
              React + Vite + Tailwind starter
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                {appName} ships with a clean marketing shell, not a blank page.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                Start from a deliberate layout with strong spacing, textured color, and clear sections
                instead of rebuilding the same landing page structure on every project.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {launchTracks.map((item) => (
              <article
                key={item}
                className="rounded-3xl border border-white/70 bg-white/75 p-5 text-sm leading-7 text-slate-700 shadow-sm"
              >
                {item}
              </article>
            ))}
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-[1.75rem] bg-slate-950 p-6 text-slate-50 shadow-[0_20px_80px_rgba(15,23,42,0.3)]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Launch checklist</p>
            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-1 text-base font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-linear-to-br from-orange-400 via-amber-300 to-lime-200 p-[1px]">
            <div className="rounded-[calc(1.5rem-1px)] bg-slate-950/95 p-5">
              <p className="text-sm text-slate-400">Ready for the next template layer?</p>
              <p className="mt-2 text-lg font-medium">Add auth, CMS, or dashboard modules on top of this shell.</p>
            </div>
          </div>
        </aside>
      </section>

      <FeatureGrid />
    </main>
  );
}
