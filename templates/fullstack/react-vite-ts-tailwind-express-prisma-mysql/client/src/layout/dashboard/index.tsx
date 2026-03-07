import type { PropsWithChildren } from "react";

type DashboardLayoutProps = PropsWithChildren<{
  heading?: string;
  summary?: string;
}>;

export default function DashboardLayout({
  heading = "Dashboard Layout",
  summary = "Starter layout wrapper for this workspace section.",
  children
}: DashboardLayoutProps) {
  return (
    <section className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <header className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Layout</p>
        <h1 className="mt-2 text-3xl font-semibold">{heading}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{summary}</p>
      </header>

      <div className="mx-auto mt-6 max-w-6xl">{children}</div>
    </section>
  );
}
