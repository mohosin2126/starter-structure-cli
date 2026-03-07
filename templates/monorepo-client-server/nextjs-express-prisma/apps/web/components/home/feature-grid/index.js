import { siteConfig } from "@/lib/site-config";

export function FeatureGrid() {
  return (
    <section className="py-8 md:py-12" id="features">
      <div className="shell">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Why this starter
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-white md:text-5xl">
            A clean structure you can extend without rewriting the basics.
          </h2>
        </div>

        <div className="card-grid mt-10">
          {siteConfig.features.map((feature) => (
            <article
              className="rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-6"
              key={feature.title}
            >
              <div className="mb-5 inline-flex rounded-2xl bg-[rgba(139,242,204,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {feature.tag}
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{feature.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
