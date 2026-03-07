const proofPoints = [
  "Clear hero, benefits, and conversion sections",
  "Tailwind v4 styling with layered cards and gradients",
  "Simple React structure for quick content edits"
];

const offerColumns = [
  {
    name: "Launch",
    summary: "Use this when you need a polished MVP site quickly.",
    items: ["Hero and proof sections", "CTA-ready layout", "Fast local iteration"]
  },
  {
    name: "Scale",
    summary: "Extend the shell with product pages, blog routes, or forms.",
    items: ["Component-driven sections", "Reusable visual system", "Easy copy updates"]
  }
];

export default function App() {
  const appName = import.meta.env.VITE_APP_NAME || "__APP_NAME__";

  return (
    <main className="px-6 py-8 md:px-10 lg:px-12">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="grid gap-10 p-8 md:grid-cols-[1.15fr_0.85fr] md:p-12">
          <div className="space-y-8">
            <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900">
              Landing page starter
            </span>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                {appName} starts with a real marketing page, not a placeholder.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                Use this starter when you want a clean product or agency landing page with
                strong hierarchy, clear calls to action, and room to expand without redoing
                the basics.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {proofPoints.map((item) => (
                <article
                  key={item}
                  className="rounded-3xl border border-white/70 bg-white/75 p-5 text-sm leading-7 text-slate-700 shadow-sm"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.75rem] bg-slate-950 p-6 text-slate-50 shadow-[0_20px_80px_rgba(15,23,42,0.3)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Conversion flow</p>
            <div className="mt-5 space-y-4">
              {offerColumns.map((column) => (
                <section key={column.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-white">{column.name}</h2>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      Ready
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{column.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-200">
                    {column.items.map((item) => (
                      <li key={item} className="rounded-2xl bg-white/5 px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </aside>
        </div>

        <section className="border-t border-[var(--line)] px-8 py-8 md:px-12">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.75rem] bg-white/70 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Narrative</p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Replace the copy blocks with your positioning, customer pain points, and feature
                highlights.
              </p>
            </article>
            <article className="rounded-[1.75rem] bg-white/70 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Sections</p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Add testimonials, pricing, FAQs, or integrations without changing the visual
                system.
              </p>
            </article>
            <article className="rounded-[1.75rem] bg-white/70 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Next layer</p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Connect forms, CMS content, or auth flows once the landing shell is approved.
              </p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
