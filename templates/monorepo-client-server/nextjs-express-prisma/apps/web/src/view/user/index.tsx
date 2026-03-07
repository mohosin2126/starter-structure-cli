const tasks = [
  "Connect the page to real data",
  "Replace starter metrics",
  "Hook up page-specific actions"
];

export default function UserPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          User
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">User Page</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Use this starter page as the first real implementation for the user section.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {tasks.map((task) => (
          <article key={task} className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-700">
            {task}
          </article>
        ))}
      </section>
    </main>
  );
}
