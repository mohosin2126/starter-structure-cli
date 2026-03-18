import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const launchTracks = [
  {
    title: "Starter UI kit",
    description: "Local button, badge, and card primitives are ready for the first real feature screen."
  },
  {
    title: "App Router structure",
    description: "The starter keeps the Next.js file layout small so feature routes can grow without friction."
  },
  {
    title: "Tailwind tokens",
    description: "CSS variables are already wired for theming, spacing rhythm, and surface hierarchy."
  }
] as const;

const checklist = [
  "Swap the placeholder copy for your product story",
  "Add your auth and data fetching layer",
  "Drop in more shadcn components as the app grows"
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col rounded-[2rem] border border-[var(--border)] bg-white/80 p-5 shadow-[0_30px_90px_rgba(76,81,191,0.12)] backdrop-blur sm:p-8">
        <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge>Next.js + shadcn + Tailwind</Badge>
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                Single app starter
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Build polished product surfaces without starting from a blank shell.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                This starter combines the Next.js App Router with local shadcn-style primitives so new
                screens can move from idea to implementation quickly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg">Open dashboard</Button>
            <Button size="lg" variant="secondary">Review setup</Button>
          </div>
        </header>

        <section className="grid gap-6 pt-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
            {launchTracks.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="bg-[linear-gradient(180deg,rgba(99,102,241,0.08),rgba(255,255,255,0.92))]">
            <CardHeader>
              <Badge variant="secondary">Ready next</Badge>
              <CardTitle className="mt-4">First-week checklist</CardTitle>
              <CardDescription>
                Keep the starter lean, then replace each placeholder with product-specific structure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-[var(--foreground)]">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
