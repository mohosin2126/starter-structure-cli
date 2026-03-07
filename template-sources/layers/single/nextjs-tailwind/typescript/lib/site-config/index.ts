type NavItem = {
  label: string;
  href: string;
};

type PreviewCard = {
  eyebrow: string;
  title: string;
  badge: string;
  copy: string;
};

type Feature = {
  tag: string;
  title: string;
  copy: string;
};

type SiteConfig = {
  name: string;
  brandMark: string;
  tagline: string;
  navItems: NavItem[];
  previewCards: PreviewCard[];
  features: Feature[];
};

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "__APP_NAME__",
  brandMark: "N",
  tagline:
    "A TypeScript-first Next.js starter with Tailwind CSS, a sharp landing page shell, and a project structure that stays readable as the app grows.",
  navItems: [
    { label: "Features", href: "#features" },
    { label: "CTA", href: "#cta" }
  ],
  previewCards: [
    {
      eyebrow: "Section 01",
      title: "Fast visual direction",
      badge: "Tailwind v4",
      copy: "A bold visual baseline with reusable sections so you can move straight into product positioning."
    },
    {
      eyebrow: "Section 02",
      title: "Simple file layout",
      badge: "TypeScript",
      copy: "Pages, components, config, and content live in the places most teams expect, with typed shared data."
    }
  ],
  features: [
    {
      tag: "Structure",
      title: "Organized without ceremony",
      copy: "The starter separates app routes, reusable sections, static assets, and site content without forcing a heavy architecture."
    },
    {
      tag: "Styling",
      title: "Tailwind without setup friction",
      copy: "Tailwind CSS v4 is configured with the recommended PostCSS plugin and ready for utility-driven component work."
    },
    {
      tag: "Shipping",
      title: "Good enough to launch from",
      copy: "The template is already shaped like a product page, so you spend time on your message instead of basic scaffolding."
    }
  ]
};
