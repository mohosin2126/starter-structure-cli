export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center gap-6 px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Authentication</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">NextAuth + Prisma starter</h1>
        <p className="mt-4 text-slate-600">
          This template wires Auth.js credentials auth with Prisma. Register a user through
          <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-sm">/api/auth/register</code>
          and then sign in from your preferred UI.
        </p>
      </div>
    </main>
  );
}
