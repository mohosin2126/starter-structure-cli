import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[var(--color-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
            Designed to turn ideas into launch-ready websites fast
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Build a polished product site before momentum disappears.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)] md:text-xl">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent-strong)]"
              href="#cta"
            >
              Launch the Starter
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--color-sun)] hover:text-[var(--color-sun)]"
              href="#features"
            >
              Explore Structure
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(139,242,204,0.2),_transparent_55%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  Starter Preview
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">
                  {siteConfig.name}
                </p>
              </div>
              <div className="rounded-full bg-[rgba(139,242,204,0.12)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                App Router
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {siteConfig.previewCards.map((card) => (
                <div
                  className="rounded-2xl border border-[var(--color-line)] bg-[rgba(255,255,255,0.03)] p-4"
                  key={card.title}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--color-muted)]">{card.eyebrow}</p>
                      <h2 className="mt-1 text-lg font-semibold text-white">{card.title}</h2>
                    </div>
                    <div className="rounded-full bg-[rgba(255,211,110,0.12)] px-3 py-1 text-xs font-semibold text-[var(--color-sun)]">
                      {card.badge}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{card.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
