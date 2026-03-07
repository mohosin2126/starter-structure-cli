import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[rgba(7,17,29,0.82)] backdrop-blur">
      <div className="shell flex items-center justify-between py-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] text-lg font-semibold text-[var(--color-accent)]">
            {siteConfig.brandMark}
          </span>
          <div>
            <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Launch Kit
            </p>
            <p className="text-sm font-medium text-white">{siteConfig.name}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] md:flex">
          {siteConfig.navItems.map((item) => (
            <a className="transition hover:text-white" href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          className="rounded-full border border-[var(--color-line)] bg-[var(--color-panel)] px-4 py-2 text-sm font-medium text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          href="#cta"
        >
          Start Now
        </Link>
      </div>
    </header>
  );
}
