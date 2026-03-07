type DashboardTitleProps = {
  title?: string;
  description?: string;
  items?: string[];
};

const defaultItems = [
  "Wire up real API calls",
  "Replace placeholder copy",
  "Connect this module to your route tree"
];

export default function DashboardTitle({
  title = "Dashboard Title",
  description = "Starter implementation for the dashboard title module.",
  items = defaultItems
}: DashboardTitleProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Dashboard Title
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
