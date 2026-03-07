export function CalloutStrip() {
  return (
    <section className="py-16 md:py-24" id="cta">
      <div className="shell">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,_rgba(126,240,199,0.12),_rgba(255,211,110,0.08)_55%,_rgba(255,255,255,0.03))] p-8 md:p-12">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sun)]">
              Ready to adapt
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-white md:text-5xl">
              Swap the copy, adjust the palette, and ship a branded landing page in one sprint.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
              This starter is intentionally small, fast, and easy to reshape into a SaaS homepage,
              agency site, product launch page, or internal marketing shell.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
