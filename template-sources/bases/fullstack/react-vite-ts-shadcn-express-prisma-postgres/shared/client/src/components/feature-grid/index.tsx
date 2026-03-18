const cards = [
  {
    title: "Shared UI foundation",
    body: "Use local primitives, CSS variables, and utility helpers instead of rebuilding button and card patterns."
  },
  {
    title: "Low-risk composition",
    body: "The client base stays small while the fullstack enterprise layer can add modules on top without collisions."
  },
  {
    title: "Postgres-ready API",
    body: "The Express + Prisma server already points at PostgreSQL so you can start migrations and auth flows immediately."
  }
] as const;

export default function FeatureGrid() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.75rem] border border-[var(--border)] bg-white/75 p-6 shadow-sm"
          >
            <p className="text-lg font-semibold text-slate-900">{card.title}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
