export const CATEGORY_LABELS = {
  fullstack: "Fullstack",
  "monorepo-client-server": "Monorepo (client/server)",
  "monorepo-turbo-pnpm": "Monorepo (Turbo + pnpm)",
  "backend-only": "Backend only",
  "frontend-only": "Frontend only",
  single: "Single app"
};

export const CATEGORY_ALIASES = {
  frontend: ["frontend-only", "single"],
  frontendonly: ["frontend-only", "single"],
  single: ["single"],
  backend: ["backend-only"],
  backendonly: ["backend-only"],
  api: ["backend-only"],
  fullstack: ["fullstack"],
  monorepo: ["monorepo-client-server", "monorepo-turbo-pnpm"],
  turbo: ["monorepo-turbo-pnpm"],
  turborepo: ["monorepo-turbo-pnpm"],
  clientserver: ["monorepo-client-server"]
};

export const TOKEN_LABELS = {
  react: "React",
  nextjs: "Next.js",
  vue: "Vue",
  vite: "Vite",
  ts: "TypeScript",
  js: "JavaScript",
  tailwind: "Tailwind CSS",
  shadcn: "shadcn/ui",
  express: "Express",
  nestjs: "NestJS",
  fastify: "Fastify",
  prisma: "Prisma",
  mongoose: "Mongoose",
  sequelize: "Sequelize",
  mongodb: "MongoDB",
  mysql: "MySQL",
  postgres: "PostgreSQL",
  jwt: "JWT",
  nextauth: "NextAuth",
  admin: "Admin",
  dashboard: "Dashboard",
  landing: "Landing",
  seo: "SEO",
  pos: "POS",
  gym: "Gym",
  crm: "CRM",
  ecommerce: "E-commerce",
  auth: "Auth",
  rbac: "RBAC",
  api: "API",
  client: "Client",
  server: "Server",
  turbo: "Turborepo",
  pnpm: "pnpm"
};

export const FILTER_GROUPS = [
  {
    key: "frontend",
    label: "Frontend",
    tokens: ["react", "nextjs", "vue"]
  },
  {
    key: "frontendTool",
    label: "Frontend tooling",
    tokens: ["vite"]
  },
  {
    key: "language",
    label: "Language",
    tokens: ["ts", "js"]
  },
  {
    key: "styling",
    label: "Styling",
    tokens: ["tailwind", "shadcn"]
  },
  {
    key: "backend",
    label: "Backend",
    tokens: ["express", "nestjs", "fastify"]
  },
  {
    key: "orm",
    label: "ORM / ODM",
    tokens: ["prisma", "mongoose", "sequelize"]
  },
  {
    key: "database",
    label: "Database",
    tokens: ["mongodb", "mysql", "postgres"]
  },
  {
    key: "auth",
    label: "Auth",
    tokens: ["jwt", "nextauth"]
  }
];

export const ARG_TO_FILTER_TOKEN = {
  "--frontend": "frontend",
  "--backend": "backend",
  "--styling": "styling",
  "--orm": "orm",
  "--database": "database",
  "--auth": "auth",
  "--language": "language"
};

export const TOKEN_ALIASES = {
  "next.js": "nextjs",
  next: "nextjs",
  "next-js": "nextjs",
  reactjs: "react",
  "react-js": "react",
  "react.js": "react",
  vuejs: "vue",
  "vue-js": "vue",
  "vue.js": "vue",
  tailwindcss: "tailwind",
  "tailwind-css": "tailwind",
  typescript: "ts",
  javascript: "js",
  postgresql: "postgres",
  mongo: "mongodb",
  mongodb: "mongodb",
  node: "backend",
  nodejs: "backend",
  "node-js": "backend",
  mono: "monorepo",
  turborepo: "turbo",
  monorepo: "monorepo"
};

export const NOISE_TOKENS = new Set([
  "and",
  "app",
  "apps",
  "application",
  "boilerplate",
  "css",
  "database",
  "db",
  "for",
  "project",
  "repo",
  "stack",
  "starter",
  "template",
  "with"
]);

export const SUPPORTED_PACKAGE_MANAGERS = new Set(["npm", "pnpm", "yarn"]);
export const PACKAGE_MANAGER_OPTIONS = ["pnpm", "npm", "yarn"];
