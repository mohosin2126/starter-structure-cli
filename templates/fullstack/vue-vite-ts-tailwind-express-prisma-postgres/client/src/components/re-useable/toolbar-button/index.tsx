type ToolbarButtonProps = {
  title?: string;
  description?: string;
  items?: string[];
};

const defaultItems = [
  "Wire up real API calls",
  "Replace placeholder copy",
  "Connect this module to your route tree"
];

export default function ToolbarButton({
  title = "Toolbar Button",
  description = "Starter implementation for the toolbar button module.",
  items = defaultItems
}: ToolbarButtonProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Toolbar Button
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <article key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}
