const stats = [
  { label: "Revenue", value: "$128,340", change: "+12.4%" },
  { label: "Orders", value: "1,284", change: "+7.1%" },
  { label: "Active users", value: "9,402", change: "+4.3%" },
  { label: "Refund rate", value: "1.8%", change: "-0.4%" }
];

const tasks = [
  { id: "INV-3912", customer: "Northwind LLC", status: "Pending", total: "$1,240" },
  { id: "INV-3913", customer: "Apex Labs", status: "Paid", total: "$890" },
  { id: "INV-3914", customer: "Sunset Retail", status: "Review", total: "$2,110" },
  { id: "INV-3915", customer: "Zenbyte", status: "Paid", total: "$640" }
];

const activity = [
  "New user segment synced from CRM",
  "Weekly revenue report exported",
  "Inventory alert: 3 products below threshold",
  "Payment retry succeeded for 6 subscriptions"
];

export default function App() {
  const appName = import.meta.env.VITE_APP_NAME || "__APP_NAME__";

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <h1 className="mt-3 text-2xl font-semibold">{appName}</h1>
          <nav className="mt-8 space-y-2 text-sm">
            {["Overview", "Orders", "Customers", "Reports", "Settings"].map((item) => (
              <a
                key={item}
                href="#"
                className="block rounded-xl px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <section className="space-y-4">
          <header className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
            <p className="mt-2 text-3xl font-semibold">Operations snapshot</p>
            <p className="mt-2 text-sm text-slate-400">
              Start with a clean admin shell and plug in real API data as your next step.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-emerald-300">{item.change}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold text-white">Recent invoices</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="pb-3">Invoice</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((row) => (
                      <tr key={row.id} className="border-t border-white/10 text-slate-200">
                        <td className="py-3">{row.id}</td>
                        <td className="py-3">{row.customer}</td>
                        <td className="py-3">{row.status}</td>
                        <td className="py-3 text-right">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold text-white">Activity</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {activity.map((item) => (
                  <li key={item} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
