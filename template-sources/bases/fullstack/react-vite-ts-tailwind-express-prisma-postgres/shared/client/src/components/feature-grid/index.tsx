const cards = [
  {
    title: "Intentional look",
    body: "Warm neutrals, sharp typography, and layered surfaces give the starter a point of view immediately."
  },
  {
    title: "Fast edits",
    body: "Sections are plain React components, so changing copy and layout stays straightforward."
  },
  {
    title: "Portable setup",
    body: "You can turn this into a SaaS page, agency site, waitlist, or docs front page without redoing the base."
  }
] as const;

export default function FeatureGrid() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.75rem] border border-[var(--line)] bg-white/70 p-6 shadow-sm"
          >
            <p className="text-lg font-semibold text-slate-900">{card.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
