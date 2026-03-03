import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { intro, outro, text, select, confirm, cancel, isCancel, note } from "@clack/prompts";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function isEmptyDir(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function walkFiles(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(p, cb);
    else cb(p);
  }
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) return;

  const base = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase();

  const textLikeExt = new Set([
    ".js", ".jsx", ".ts", ".tsx",
    ".json", ".md",
    ".yml", ".yaml",
    ".env", ".txt",
    ".cjs", ".mjs",
    ".html", ".css", ".scss",
    ".gitignore", ".npmrc"
  ]);

  const isTextLike =
    textLikeExt.has(ext) ||
    base === ".gitignore" ||
    base === ".env" ||
    base === ".env.example" ||
    base === "readme.md";

  if (!isTextLike) return;

  let content = fs.readFileSync(filePath, "utf8");
  for (const [k, v] of Object.entries(replacements)) {
    content = content.split(k).join(v);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

function resolveTemplateDir(templateRelativePath) {
  
  return path.resolve(__dirname, "..", templateRelativePath);
}


const TEMPLATES = {
  // 1) Fullstack: React/Vite + Node backend
  "fullstack-react-vite-ts-tailwind-express-mongoose": {
    label: "Fullstack: React(Vite)+TS+Tailwind + Express + MongoDB(Mongoose)",
    path: "templates/fullstack/react-vite-ts-tailwind-express-mongoose"
  },
  "fullstack-react-vite-ts-tailwind-express-prisma-postgres": {
    label: "Fullstack: React(Vite)+TS+Tailwind + Express + Prisma + Postgres",
    path: "templates/fullstack/react-vite-ts-tailwind-express-prisma-postgres"
  },
  "fullstack-react-vite-ts-tailwind-express-prisma-mysql": {
    label: "Fullstack: React(Vite)+TS+Tailwind + Express + Prisma + MySQL",
    path: "templates/fullstack/react-vite-ts-tailwind-express-prisma-mysql"
  },
  "fullstack-react-vite-ts-tailwind-express-sequelize-mysql": {
    label: "Fullstack: React(Vite)+TS+Tailwind + Express + Sequelize + MySQL (POS style)",
    path: "templates/fullstack/react-vite-ts-tailwind-express-sequelize-mysql"
  },

  // 2) Next.js
  "fullstack-nextjs-tailwind-prisma-postgres": {
    label: "Next.js: Tailwind + Prisma + Postgres (App Router)",
    path: "templates/fullstack/nextjs-tailwind-prisma-postgres"
  },
  "fullstack-nextjs-tailwind-prisma-mysql": {
    label: "Next.js: Tailwind + Prisma + MySQL",
    path: "templates/fullstack/nextjs-tailwind-prisma-mysql"
  },
  "fullstack-nextjs-tailwind-mongoose-mongodb": {
    label: "Next.js: Tailwind + MongoDB(Mongoose)",
    path: "templates/fullstack/nextjs-tailwind-mongoose-mongodb"
  },
  "fullstack-nextjs-tailwind-nextauth-prisma": {
    label: "Next.js: Tailwind + NextAuth + Prisma (Auth)",
    path: "templates/fullstack/nextjs-tailwind-nextauth-prisma"
  },

  // 3) Vue fullstack
  "fullstack-vue-vite-ts-tailwind-express-mongoose": {
    label: "Fullstack: Vue(Vite)+TS+Tailwind + Express + MongoDB(Mongoose)",
    path: "templates/fullstack/vue-vite-ts-tailwind-express-mongoose"
  },
  "fullstack-vue-vite-ts-tailwind-express-prisma-mysql": {
    label: "Fullstack: Vue(Vite)+TS+Tailwind + Express + Prisma + MySQL",
    path: "templates/fullstack/vue-vite-ts-tailwind-express-prisma-mysql"
  },

  // 4) Monorepo client/server
  "monorepo-client-server-react-vite-ts-express-mongoose": {
    label: "Monorepo client/server: React(Vite)+TS + Express + Mongoose",
    path: "templates/monorepo-client-server/react-vite-ts-express-mongoose"
  },
  "monorepo-client-server-react-vite-ts-express-prisma": {
    label: "Monorepo client/server: React(Vite)+TS + Express + Prisma",
    path: "templates/monorepo-client-server/react-vite-ts-express-prisma"
  },
  "monorepo-client-server-vue-vite-ts-express-mongoose": {
    label: "Monorepo client/server: Vue(Vite)+TS + Express + Mongoose",
    path: "templates/monorepo-client-server/vue-vite-ts-express-mongoose"
  },
  "monorepo-client-server-nextjs-express-prisma": {
    label: "Monorepo client/server: Next.js + Express + Prisma",
    path: "templates/monorepo-client-server/nextjs-express-prisma"
  },

  // 5) Monorepo turbo + pnpm
  "turbo-pnpm-nextjs-api-express-prisma": {
    label: "Turbo+pnpm: Next.js (apps/web) + Express API (apps/api) + Prisma",
    path: "templates/monorepo-turbo-pnpm/nextjs-api-express-prisma"
  },
  "turbo-pnpm-react-vite-api-express-mongoose": {
    label: "Turbo+pnpm: React(Vite) (apps/web) + Express API (apps/api) + Mongoose",
    path: "templates/monorepo-turbo-pnpm/react-vite-api-express-mongoose"
  },
  "turbo-pnpm-nextjs-api-nestjs-prisma": {
    label: "Turbo+pnpm (Pro): Next.js (apps/web) + NestJS API (apps/api) + Prisma",
    path: "templates/monorepo-turbo-pnpm/nextjs-api-nestjs-prisma"
  },

  // 6) Backend-only
  "api-express-mongoose-jwt": {
    label: "API: Express + MongoDB(Mongoose) + JWT Auth",
    path: "templates/backend-only/express-mongoose-jwt"
  },
  "api-express-prisma-mysql-jwt": {
    label: "API: Express + Prisma + MySQL + JWT Auth",
    path: "templates/backend-only/express-prisma-mysql-jwt"
  },
  "api-nestjs-prisma-postgres": {
    label: "API: NestJS + Prisma + Postgres",
    path: "templates/backend-only/nestjs-prisma-postgres"
  },
  "api-fastify-prisma-postgres": {
    label: "API: Fastify + Prisma + Postgres",
    path: "templates/backend-only/fastify-prisma-postgres"
  },

  // 7) Frontend-only
  "single-react-vite-ts-tailwind": {
    label: "Frontend: React(Vite)+TS+Tailwind",
    path: "templates/single/react-vite-ts-tailwind"
  },
  "single-react-vite-ts-tailwind-landing": {
    label: "Frontend: React(Vite)+TS+Tailwind (Landing Page)",
    path: "templates/single/react-vite-ts-tailwind-landing"
  },
  "single-react-vite-shadcn-tailwind": {
    label: "Frontend: React(Vite) + Tailwind + shadcn/ui",
    path: "templates/single/react-vite-shadcn-tailwind"
  },
  "single-nextjs-tailwind": {
    label: "Frontend: Next.js + Tailwind",
    path: "templates/single/nextjs-tailwind"
  },
  "single-nextjs-tailwind-landing-seo": {
    label: "Frontend: Next.js + Tailwind (Landing + SEO)",
    path: "templates/single/nextjs-tailwind-landing-seo"
  },
  "single-vue-vite-ts-tailwind": {
    label: "Frontend: Vue(Vite)+TS+Tailwind",
    path: "templates/single/vue-vite-ts-tailwind"
  },
  "frontend-react-admin-dashboard": {
    label: "Frontend: React Admin Dashboard (Tailwind + Sidebar + Protected Routes)",
    path: "templates/frontend-only/react-admin-dashboard"
  },

  // 8) Business
  "business-admin-dashboard-auth-rbac": {
    label: "Business: Admin Dashboard + Auth + Role/Permission (RBAC) starter",
    path: "templates/business/admin-dashboard-auth-rbac"
  },
  "business-pos-starter": {
    label: "Business: POS starter (inventory, invoices, routes skeleton)",
    path: "templates/business/pos-starter"
  },
  "business-gym-management-starter": {
    label: "Business: Gym Management starter (students, trainers, attendance skeleton)",
    path: "templates/business/gym-management-starter"
  },
  "business-ecommerce-admin-starter": {
    label: "Business: E-commerce Admin starter (products, orders, payments skeleton)",
    path: "templates/business/ecommerce-admin-starter"
  },
  "business-crm-starter": {
    label: "Business: CRM starter (customers, leads, notes, tasks skeleton)",
    path: "templates/business/crm-starter"
  }
};


const CATEGORIES = [
  {
    key: "fullstack",
    label: "Fullstack (Frontend + Backend)",
    filter: (k) => k.startsWith("fullstack-")
  },
  {
    key: "monorepo-client-server",
    label: "Monorepo (client/ + server/)",
    filter: (k) => k.startsWith("monorepo-client-server-")
  },
  {
    key: "monorepo-turbo-pnpm",
    label: "Monorepo (apps/web + apps/api) Turbo + pnpm",
    filter: (k) => k.startsWith("turbo-pnpm-")
  },
  {
    key: "backend-only",
    label: "Backend-only (API starters)",
    filter: (k) => k.startsWith("api-")
  },
  {
    key: "frontend-only",
    label: "Frontend-only",
    filter: (k) => k.startsWith("single-") || k.startsWith("frontend-")
  },
  {
    key: "business",
    label: "Business starters (POS/Gym/CRM...)",
    filter: (k) => k.startsWith("business-")
  }
];


async function main() {
  intro(pc.cyan("starter-structure-cli"));

  const projectName = await text({
    message: "Project folder name?",
    placeholder: "my-app",
    defaultValue: "my-app",
    validate: (v) => {
      if (!v || v.trim().length === 0) return "Please enter a project name.";
      if (v.includes("/") || v.includes("\\"))
        return "Use a simple folder name (no slashes).";
      return undefined;
    }
  });
  if (isCancel(projectName)) return cancel("Cancelled.");

  const category = await select({
    message: "Choose a category:",
    options: CATEGORIES.map((c) => ({ value: c.key, label: c.label }))
  });
  if (isCancel(category)) return cancel("Cancelled.");

  const cat = CATEGORIES.find((c) => c.key === category);
  const keysInCat = Object.keys(TEMPLATES).filter(cat.filter);

  const templateKey = await select({
    message: "Choose a template:",
    options: keysInCat.map((k) => ({ value: k, label: TEMPLATES[k].label }))
  });
  if (isCancel(templateKey)) return cancel("Cancelled.");

  const pkgManager = await select({
    message: "Select package manager:",
    options: [
      { value: "pnpm", label: "pnpm" },
      { value: "npm", label: "npm" },
      { value: "yarn", label: "yarn" }
    ]
  });
  if (isCancel(pkgManager)) return cancel("Cancelled.");

  const installNow = await confirm({
    message: "Install dependencies now?",
    initialValue: false
  });
  if (isCancel(installNow)) return cancel("Cancelled.");

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir) && !isEmptyDir(targetDir)) {
    return cancel(`Target directory is not empty:\n${targetDir}`);
  }

  const tpl = TEMPLATES[templateKey];
  const tplDir = resolveTemplateDir(tpl.path);

  if (!fs.existsSync(tplDir)) {
    note(
      `Create it: ${pc.yellow(tpl.path)}\nThen put a real starter project inside.`,
      pc.red("Template folder not found")
    );
    return cancel(`Missing template folder: ${tplDir}`);
  }


  copyDir(tplDir, targetDir);


  walkFiles(targetDir, (file) => {
    replaceInFile(file, {
      "__APP_NAME__": projectName
    });
  });


  if (installNow) {
 
    note(
      `Run this in your new project folder:\n` +
        `  cd ${projectName}\n` +
        `  ${pkgManager} install\n`,
      "Install"
    );
  }

  outro(
    pc.green(`✅ Created ${projectName}\n`) +
      `Template: ${tpl.label}\n\n` +
      `Next:\n` +
      `  cd ${projectName}\n` +
      `  ${pkgManager} install\n`
  );
}

main().catch((e) => {
  console.error(pc.red("❌ Error:"), e);
  process.exit(1);
});