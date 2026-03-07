#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

import {
  cancel,
  confirm,
  intro,
  isCancel,
  note,
  outro,
  select,
  text
} from "@clack/prompts";
import pc from "picocolors";
import { ensureTemplatesReady, templatesRoot } from "../lib/template-builder.js";

const CATEGORY_LABELS = {
  fullstack: "Fullstack",
  "monorepo-client-server": "Monorepo (client/server)",
  "monorepo-turbo-pnpm": "Monorepo (Turbo + pnpm)",
  "backend-only": "Backend only",
  "frontend-only": "Frontend only",
  single: "Single app"
};

const CATEGORY_ALIASES = {
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

const TOKEN_LABELS = {
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

const FILTER_GROUPS = [
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

const ARG_TO_FILTER_TOKEN = {
  "--frontend": "frontend",
  "--backend": "backend",
  "--styling": "styling",
  "--orm": "orm",
  "--database": "database",
  "--auth": "auth",
  "--language": "language"
};

const TOKEN_ALIASES = {
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

const NOISE_TOKENS = new Set([
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

const SUPPORTED_PACKAGE_MANAGERS = new Set(["npm", "pnpm", "yarn"]);

function normalizeToken(value) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[\\/_]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const normalized = TOKEN_ALIASES[cleaned] ?? cleaned;
  if (!normalized || NOISE_TOKENS.has(normalized)) {
    return "";
  }

  return normalized;
}

function tokenize(value) {
  return value
    .split(/[\s,/:+|]+/g)
    .map(normalizeToken)
    .filter(Boolean);
}

function humanizeToken(token) {
  return TOKEN_LABELS[token] ?? token.toUpperCase();
}

function humanizeCategory(category) {
  return CATEGORY_LABELS[category] ?? category;
}

function isEmptyDir(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const sourcePath = path.join(src, entry.name);
    const destinationPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, destinationPath);
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
}

function walkFiles(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(entryPath, callback);
      continue;
    }

    callback(entryPath);
  }
}

function walkPaths(dir, collected = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    collected.push(entryPath);

    if (entry.isDirectory()) {
      walkPaths(entryPath, collected);
    }
  }

  return collected;
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return;
  }

  const base = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase();
  const textLikeExtensions = new Set([
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".md",
    ".yml",
    ".yaml",
    ".env",
    ".txt",
    ".cjs",
    ".mjs",
    ".html",
    ".css",
    ".scss",
    ".npmrc"
  ]);

  const isTextLike =
    textLikeExtensions.has(ext) ||
    base === ".gitignore" ||
    base === ".env" ||
    base === ".env.example" ||
    base === "readme.md";

  if (!isTextLike) {
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  for (const [from, to] of Object.entries(replacements)) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

function renamePlaceholderPaths(rootDir, replacements) {
  const paths = walkPaths(rootDir).sort((left, right) => right.length - left.length);

  for (const currentPath of paths) {
    const baseName = path.basename(currentPath);
    let nextName = baseName;

    for (const [from, to] of Object.entries(replacements)) {
      nextName = nextName.split(from).join(to);
    }

    if (nextName === baseName) {
      continue;
    }

    fs.renameSync(currentPath, path.join(path.dirname(currentPath), nextName));
  }
}

function resolveCategories(input) {
  if (!input) {
    return [];
  }

  const normalized = normalizeToken(input);
  if (CATEGORY_ALIASES[normalized]) {
    return CATEGORY_ALIASES[normalized];
  }

  return [normalized];
}

function addDerivedTokens(tokenSet, category) {
  tokenSet.add(category);

  if (!tokenSet.has("ts") && !tokenSet.has("js")) {
    tokenSet.add("js");
  }

  if (category === "fullstack") {
    tokenSet.add("frontend");
    tokenSet.add("backend");
  }

  if (category === "frontend-only" || category === "single") {
    tokenSet.add("frontend");
  }

  if (category === "backend-only") {
    tokenSet.add("backend");
    tokenSet.add("api");
  }

  if (category.startsWith("monorepo")) {
    tokenSet.add("monorepo");
  }

  if (category === "monorepo-client-server") {
    tokenSet.add("client");
    tokenSet.add("server");
  }

  if (category === "monorepo-turbo-pnpm") {
    tokenSet.add("turbo");
    tokenSet.add("pnpm");
  }

  if (tokenSet.has("mongoose")) {
    tokenSet.add("mongodb");
  }

  if (tokenSet.has("prisma") || tokenSet.has("mongoose") || tokenSet.has("sequelize")) {
    tokenSet.add("orm");
  }

  if (tokenSet.has("express") || tokenSet.has("nestjs") || tokenSet.has("fastify")) {
    tokenSet.add("backend");
    tokenSet.add("api");
  }

  if (tokenSet.has("react") || tokenSet.has("nextjs") || tokenSet.has("vue")) {
    tokenSet.add("frontend");
  }

  if (tokenSet.has("tailwind") || tokenSet.has("shadcn")) {
    tokenSet.add("styling");
  }

  if (tokenSet.has("jwt") || tokenSet.has("nextauth")) {
    tokenSet.add("auth");
  }
}

function getFeatureValue(tokens, allowedTokens) {
  for (const token of allowedTokens) {
    if (tokens.has(token)) {
      return token;
    }
  }

  return undefined;
}

function buildDisplayParts(slugTokens) {
  const parts = [];
  const seen = new Set();

  for (const token of slugTokens) {
    if (seen.has(token)) {
      continue;
    }

    const label = humanizeToken(token);
    if (label === token.toUpperCase() && token.length > 6) {
      parts.push(token);
      seen.add(token);
      continue;
    }

    parts.push(label);
    seen.add(token);
  }

  return parts;
}

function discoverTemplates(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const templates = [];
  const categories = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const category of categories) {
    const categoryDir = path.join(rootDir, category);
    const templateDirs = fs
      .readdirSync(categoryDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const slug of templateDirs) {
      const absolutePath = path.join(categoryDir, slug);
      const tokenSet = new Set([
        ...tokenize(category),
        ...slug.split("-").map(normalizeToken).filter(Boolean)
      ]);

      addDerivedTokens(tokenSet, category);

      const slugTokens = slug.split("-").map(normalizeToken).filter(Boolean);
      const displayParts = buildDisplayParts(slugTokens);

      templates.push({
        id: `${category}/${slug}`,
        category,
        slug,
        absolutePath,
        tokens: tokenSet,
        features: Object.fromEntries(
          FILTER_GROUPS.map((group) => [group.key, getFeatureValue(tokenSet, group.tokens)])
        ),
        label: `${displayParts.join(" + ")} (${humanizeCategory(category)})`
      });
    }
  }

  return templates.sort((left, right) => left.id.localeCompare(right.id));
}

function parseArgs(argv) {
  const args = {
    help: false,
    list: false,
    yes: false,
    install: undefined,
    packageManager: undefined,
    projectName: undefined,
    templateRef: undefined,
    category: undefined,
    comboTokens: [],
    positionals: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (current === "create" || current === "new") {
      continue;
    }

    if (current === "-h" || current === "--help") {
      args.help = true;
      continue;
    }

    if (current === "--list") {
      args.list = true;
      continue;
    }

    if (current === "-y" || current === "--yes") {
      args.yes = true;
      continue;
    }

    if (current === "--install") {
      args.install = true;
      continue;
    }

    if (current === "--no-install") {
      args.install = false;
      continue;
    }

    const [flag, inlineValue] = current.split("=", 2);
    const takesValue =
      flag === "--name" ||
      flag === "--project-name" ||
      flag === "--template" ||
      flag === "-t" ||
      flag === "--category" ||
      flag === "-c" ||
      flag === "--stack" ||
      flag === "--combo" ||
      flag === "--package-manager" ||
      flag === "-p" ||
      flag === "--frontend" ||
      flag === "--backend" ||
      flag === "--styling" ||
      flag === "--orm" ||
      flag === "--database" ||
      flag === "--auth" ||
      flag === "--language";

    if (!takesValue) {
      args.positionals.push(current);
      continue;
    }

    const value = inlineValue ?? argv[index + 1];
    if (!inlineValue) {
      index += 1;
    }

    if (!value) {
      throw new Error(`Missing value for ${flag}`);
    }

    if (flag === "--name" || flag === "--project-name") {
      args.projectName = value;
      continue;
    }

    if (flag === "--template" || flag === "-t") {
      args.templateRef = value;
      continue;
    }

    if (flag === "--category" || flag === "-c") {
      args.category = value;
      continue;
    }

    if (flag === "--stack" || flag === "--combo") {
      args.comboTokens.push(...tokenize(value));
      continue;
    }

    if (flag === "--package-manager" || flag === "-p") {
      args.packageManager = value.toLowerCase();
      continue;
    }

    if (ARG_TO_FILTER_TOKEN[flag]) {
      args.comboTokens.push(...tokenize(value));
    }
  }

  if (!args.projectName && args.positionals.length > 0) {
    args.projectName = args.positionals[0];
    args.comboTokens.push(...args.positionals.slice(1).flatMap(tokenize));
  }

  return args;
}

function printHelp() {
  console.log(`
starter-structure-cli

Usage:
  npx starter-structure-cli <project-name>
  npx starter-structure-cli <project-name> react vite ts tailwind express prisma mysql
  npx starter-structure-cli <project-name> --category fullstack --frontend react --backend express --orm prisma --database mysql
  npx starter-structure-cli <project-name> --template fullstack/react-vite-ts-tailwind-express-prisma-mysql
  npx starter-structure-cli --list

Options:
  -h, --help                 Show help
  --list                     List discovered templates
  -y, --yes                  Skip optional prompts when selection is already unambiguous
  --install                  Run package manager install after scaffold
  --no-install               Do not install dependencies
  -p, --package-manager      npm | pnpm | yarn
  -c, --category             fullstack | frontend-only | single | backend-only | monorepo | turbo
  -t, --template             Exact template slug or category/slug
  --stack, --combo           Freeform stack query, e.g. "nextjs tailwind prisma mysql"
  --frontend                 react | nextjs | vue
  --backend                  express | nestjs | fastify
  --styling                  tailwind | shadcn
  --orm                      prisma | mongoose | sequelize
  --database                 mongodb | mysql | postgres
  --auth                     jwt | nextauth
  --language                 ts | js
`.trim());
}

function listTemplates(templates) {
  const grouped = new Map();

  for (const template of templates) {
    if (!grouped.has(template.category)) {
      grouped.set(template.category, []);
    }
    grouped.get(template.category).push(template);
  }

  console.log("Available templates:\n");
  for (const [category, items] of grouped.entries()) {
    console.log(`${humanizeCategory(category)}:`);
    for (const template of items) {
      console.log(`  - ${template.id}`);
    }
    console.log("");
  }
}

function resolveTemplateByReference(templates, reference) {
  const normalizedReference = normalizeToken(reference.replace(/\\/g, "/").replace(/\//g, "-"));
  const exactMatches = templates.filter((template) => {
    const normalizedId = normalizeToken(template.id.replace(/\//g, "-"));
    const normalizedSlug = normalizeToken(template.slug);
    return normalizedId === normalizedReference || normalizedSlug === normalizedReference;
  });

  if (exactMatches.length === 1) {
    return exactMatches[0];
  }

  return undefined;
}

function filterTemplates(templates, categoryInput, comboTokens) {
  let matches = [...templates];

  const categories = resolveCategories(categoryInput);
  if (categories.length > 0) {
    matches = matches.filter((template) => categories.includes(template.category));
  }

  if (comboTokens.length > 0) {
    matches = matches.filter((template) =>
      comboTokens.every((token) => template.tokens.has(token))
    );
  }

  return matches;
}

function getAvailableCategories(templates) {
  return [...new Set(templates.map((template) => template.category))];
}

function getAvailableFeatureValues(templates, group) {
  return [
    ...new Set(
      templates
        .map((template) => template.features[group.key])
        .filter(Boolean)
    )
  ];
}

function hasExplicitLanguageSelection(comboTokens) {
  return comboTokens.includes("ts") || comboTokens.includes("js");
}

function getComparableTemplateSignature(template) {
  return JSON.stringify({
    category: template.category,
    frontend: template.features.frontend,
    frontendTool: template.features.frontendTool,
    styling: template.features.styling,
    backend: template.features.backend,
    orm: template.features.orm,
    database: template.features.database,
    auth: template.features.auth
  });
}

function preferTypeScriptCandidates(templates, comboTokens) {
  if (hasExplicitLanguageSelection(comboTokens) || templates.length <= 1) {
    return templates;
  }

  const languageValues = new Set(
    templates.map((template) => template.features.language).filter(Boolean)
  );

  if (!languageValues.has("ts") || !languageValues.has("js")) {
    return templates;
  }

  const signatures = new Set(templates.map(getComparableTemplateSignature));
  if (signatures.size !== 1) {
    return templates;
  }

  const tsTemplates = templates.filter((template) => template.features.language === "ts");
  return tsTemplates.length > 0 ? tsTemplates : templates;
}

async function chooseCategory(templates) {
  const categories = getAvailableCategories(templates);

  if (categories.length <= 1) {
    return categories[0];
  }

  const category = await select({
    message: "Choose a template category:",
    options: categories.map((value) => ({
      value,
      label: humanizeCategory(value)
    }))
  });

  if (isCancel(category)) {
    return undefined;
  }

  return category;
}

async function chooseByFeatures(templates) {
  let candidates = [...templates];

  for (const group of FILTER_GROUPS) {
    const values = getAvailableFeatureValues(candidates, group).sort((left, right) => {
      if (group.key === "language") {
        if (left === "ts") return -1;
        if (right === "ts") return 1;
      }

      return left.localeCompare(right);
    });
    if (values.length <= 1) {
      continue;
    }

    const initialValue =
      group.key === "language" && values.includes("ts")
        ? "ts"
        : values[0];

    const selection = await select({
      message: `Choose ${group.label.toLowerCase()}:`,
      options: [
        { value: "__skip__", label: `Skip ${group.label.toLowerCase()} filter` },
        ...values.map((value) => ({
          value,
          label: humanizeToken(value)
        }))
      ],
      initialValue
    });

    if (isCancel(selection)) {
      return undefined;
    }

    if (selection === "__skip__") {
      continue;
    }

    candidates = candidates.filter((template) => template.features[group.key] === selection);

    if (candidates.length <= 1) {
      break;
    }
  }

  return candidates;
}

async function chooseTemplate(templates) {
  if (templates.length === 1) {
    return templates[0];
  }

  const templateId = await select({
    message: "Choose a template:",
    options: templates.map((template) => ({
      value: template.id,
      label: template.label
    }))
  });

  if (isCancel(templateId)) {
    return undefined;
  }

  return templates.find((template) => template.id === templateId);
}

function getSuggestedPackageManager(template) {
  if (template.tokens.has("pnpm")) {
    return "pnpm";
  }

  return "npm";
}

function validateProjectName(value) {
  if (!value || value.trim().length === 0) {
    return "Please enter a project name.";
  }

  if (value.includes("/") || value.includes("\\")) {
    return "Use a simple folder name without slashes.";
  }

  return undefined;
}

function installDependencies(targetDir, packageManager) {
  const result = spawnSync(packageManager, ["install"], {
    cwd: targetDir,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (result.status !== 0) {
    throw new Error(`${packageManager} install failed`);
  }
}

function formatTemplateSummary(templates) {
  return templates.map((template) => `- ${template.id}`).join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureTemplatesReady();
  const templates = discoverTemplates(templatesRoot);

  if (args.help) {
    printHelp();
    return;
  }

  if (templates.length === 0) {
    throw new Error(
      `No templates found in ${templatesRoot}. Build them with "npm run build:templates".`
    );
  }

  if (args.list) {
    listTemplates(templates);
    return;
  }

  intro(pc.cyan("starter-structure-cli"));

  let projectName = args.projectName;
  if (!projectName) {
    projectName = await text({
      message: "Project folder name?",
      placeholder: "my-app",
      defaultValue: "my-app",
      validate: validateProjectName
    });
    if (isCancel(projectName)) {
      return cancel("Cancelled.");
    }
  } else {
    const validationError = validateProjectName(projectName);
    if (validationError) {
      return cancel(validationError);
    }
  }

  let selectedTemplate =
    args.templateRef ? resolveTemplateByReference(templates, args.templateRef) : undefined;

  if (args.templateRef && !selectedTemplate) {
    note(formatTemplateSummary(templates), "Available templates");
    return cancel(`Template not found: ${args.templateRef}`);
  }

  let candidates = selectedTemplate
    ? [selectedTemplate]
    : filterTemplates(templates, args.category, [...new Set(args.comboTokens)]);

  candidates = preferTypeScriptCandidates(candidates, args.comboTokens);

  if (!selectedTemplate && candidates.length === 0) {
    note(
      formatTemplateSummary(templates),
      "No template matched the requested combination"
    );
    return cancel("Adjust your stack filters or choose a template explicitly.");
  }

  if (!selectedTemplate) {
    const categoryWasSupplied = Boolean(args.category);

    if (!categoryWasSupplied) {
      const chosenCategory = await chooseCategory(candidates);
      if (!chosenCategory) {
        return cancel("Cancelled.");
      }
      candidates = candidates.filter((template) => template.category === chosenCategory);
      candidates = preferTypeScriptCandidates(candidates, args.comboTokens);
    }

    if (candidates.length > 1 && args.comboTokens.length === 0) {
      const narrowed = await chooseByFeatures(candidates);
      if (!narrowed) {
        return cancel("Cancelled.");
      }
      candidates = narrowed;
    }

    if (candidates.length > 1 && args.yes) {
      note(formatTemplateSummary(candidates), "Multiple templates still match");
      return cancel("Use --template or add more stack filters.");
    }

    selectedTemplate = await chooseTemplate(candidates);
    if (!selectedTemplate) {
      return cancel("Cancelled.");
    }
  }

  let packageManager = args.packageManager;
  if (!packageManager) {
    const suggested = getSuggestedPackageManager(selectedTemplate);

    if (args.yes) {
      packageManager = suggested;
    } else {
      packageManager = await select({
        message: "Choose a package manager:",
        options: ["pnpm", "npm", "yarn"].map((value) => ({
          value,
          label: value
        })),
        initialValue: suggested
      });
      if (isCancel(packageManager)) {
        return cancel("Cancelled.");
      }
    }
  }

  if (!SUPPORTED_PACKAGE_MANAGERS.has(packageManager)) {
    return cancel(`Unsupported package manager: ${packageManager}`);
  }

  let shouldInstall = args.install;
  if (shouldInstall === undefined) {
    if (args.yes) {
      shouldInstall = false;
    } else {
      shouldInstall = await confirm({
        message: "Install dependencies now?",
        initialValue: false
      });
      if (isCancel(shouldInstall)) {
        return cancel("Cancelled.");
      }
    }
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir) && !isEmptyDir(targetDir)) {
    return cancel(`Target directory is not empty: ${targetDir}`);
  }

  if (isEmptyDir(selectedTemplate.absolutePath)) {
    note(selectedTemplate.id, "Selected template directory is empty");
    return cancel("Add your real template files before generating a project.");
  }

  copyDir(selectedTemplate.absolutePath, targetDir);
  renamePlaceholderPaths(targetDir, { "__APP_NAME__": projectName });
  walkFiles(targetDir, (filePath) => {
    replaceInFile(filePath, { "__APP_NAME__": projectName });
  });

  if (shouldInstall) {
    note(`${packageManager} install`, "Installing dependencies");
    installDependencies(targetDir, packageManager);
  }

  outro(
    [
      pc.green(`Created ${projectName}`),
      `Template: ${selectedTemplate.id}`,
      `Next:`,
      `  cd ${projectName}`,
      shouldInstall ? "" : `  ${packageManager} install`
    ]
      .filter(Boolean)
      .join("\n")
  );
}

main().catch((error) => {
  console.error(pc.red("Error:"), error.message);
  process.exit(1);
});
