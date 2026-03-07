import { CalloutStrip } from "@/components/home/callout-strip";
import { FeatureGrid } from "@/components/home/feature-grid";
import { HeroSection } from "@/components/home/hero-section";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <SiteHeader />
      <HeroSection />
      <FeatureGrid />
      <CalloutStrip />
    </main>
  );
}
