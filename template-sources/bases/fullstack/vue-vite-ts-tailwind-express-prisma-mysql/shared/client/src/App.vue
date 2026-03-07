<script setup>
const appName = import.meta.env.VITE_APP_NAME || "__APP_NAME__";

const launchTracks = [
  "Landing page sections with clear content hierarchy",
  "Tailwind v4 styling with a warm editorial visual language",
  "Simple Vue structure that is easy to extend"
];

const checklist = [
  { label: "Brand system", value: "Colors, voice, layout" },
  { label: "Core pages", value: "Home, feature, CTA blocks" },
  { label: "Launch speed", value: "Fast local edits with Vite" }
];

const cards = [
  {
    title: "Intentional look",
    body: "Warm neutrals, sharp typography, and layered surfaces give the starter a point of view immediately."
  },
  {
    title: "Fast edits",
    body: "Sections are plain Vue markup, so changing copy and layout stays straightforward."
  },
  {
    title: "Portable setup",
    body: "You can turn this into a SaaS page, agency site, waitlist, or docs front page without redoing the base."
  }
];
</script>

<template>
  <main class="px-6 py-8 md:px-10 lg:px-12">
    <section class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-10 rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-12">
      <div class="flex flex-col justify-between gap-8">
        <div class="space-y-6">
          <span class="inline-flex w-fit rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
            Vue + Vite + Tailwind starter
          </span>
          <div class="space-y-4">
            <h1 class="max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              {{ appName }} ships with a clean marketing shell, not a blank page.
            </h1>
            <p class="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Start from a deliberate layout with strong spacing, textured color, and clear
              sections instead of rebuilding the same landing page structure on every project.
            </p>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <article
            v-for="item in launchTracks"
            :key="item"
            class="rounded-3xl border border-white/70 bg-white/75 p-5 text-sm leading-7 text-slate-700 shadow-sm"
          >
            {{ item }}
          </article>
        </div>
      </div>

      <aside class="flex flex-col justify-between rounded-[1.75rem] bg-slate-950 p-6 text-slate-50 shadow-[0_20px_80px_rgba(15,23,42,0.3)]">
        <div class="space-y-4">
          <p class="text-sm uppercase tracking-[0.24em] text-slate-400">Launch checklist</p>
          <div class="space-y-3">
            <div
              v-for="item in checklist"
              :key="item.label"
              class="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p class="text-sm text-slate-400">{{ item.label }}</p>
              <p class="mt-1 text-base font-medium text-white">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8 rounded-3xl bg-linear-to-br from-orange-400 via-amber-300 to-lime-200 p-[1px]">
          <div class="rounded-[calc(1.5rem-1px)] bg-slate-950/95 p-5">
            <p class="text-sm text-slate-400">Ready for the next template layer?</p>
            <p class="mt-2 text-lg font-medium">
              Add auth, CMS, or dashboard modules on top of this shell.
            </p>
          </div>
        </div>
      </aside>
    </section>

    <section class="mx-auto mt-10 max-w-6xl">
      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="card in cards"
          :key="card.title"
          class="rounded-[1.75rem] border border-[var(--line)] bg-white/70 p-6 shadow-sm"
        >
          <p class="text-lg font-semibold text-slate-900">{{ card.title }}</p>
          <p class="mt-3 text-sm leading-7 text-slate-600">{{ card.body }}</p>
        </article>
      </div>
    </section>
  </main>
</template>
