import fs from "node:fs";
import path from "node:path";

import { CATEGORY_LABELS, FILTER_GROUPS, TOKEN_LABELS } from "./constants.js";
import { normalizeToken, tokenize } from "./matching.js";

export function humanizeToken(token) {
  return TOKEN_LABELS[token] ?? token.toUpperCase();
}

export function humanizeCategory(category) {
  return CATEGORY_LABELS[category] ?? category;
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

function joinLabels(values) {
  const labels = values.filter(Boolean).map(humanizeToken);

  if (labels.length === 0) {
    return "";
  }

  if (labels.length === 1) {
    return labels[0];
  }

  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}

function getTemplateFocus(tokens) {
  const focusTokens = [
    "admin",
    "dashboard",
    "landing",
    "seo",
    "pos",
    "gym",
    "crm",
    "ecommerce"
  ].filter((token) => tokens.has(token));

  return joinLabels(focusTokens);
}

function buildBackendDescription(features) {
  const backend = humanizeToken(features.backend ?? "api");
  const dataStack = joinLabels([features.orm, features.database]);
  const auth = features.auth ? ` with ${humanizeToken(features.auth)} auth` : "";
  const data = dataStack ? ` backed by ${dataStack}` : "";

  return `${backend} API starter${data}${auth}.`;
}

function buildFrontendDescription(category, features, tokens) {
  const frontend = humanizeToken(features.frontend ?? "frontend");
  const tooling = features.frontendTool ? ` with ${humanizeToken(features.frontendTool)}` : "";
  const language = features.language ? ` in ${humanizeToken(features.language)}` : "";
  const styling = features.styling ? ` styled with ${humanizeToken(features.styling)}` : "";
  const focus = getTemplateFocus(tokens);
  const focusText = focus ? ` for ${focus.toLowerCase()} screens` : "";
  const shape = category === "single" ? "Single-app" : "Frontend";

  return `${shape} ${frontend} starter${tooling}${language}${styling}${focusText}.`;
}

function buildTemplateDescription(category, features, tokens) {
  if (category === "backend-only") {
    return buildBackendDescription(features);
  }

  if (category === "frontend-only" || category === "single") {
    return buildFrontendDescription(category, features, tokens);
  }

  if (category === "fullstack") {
    const frontend = humanizeToken(features.frontend ?? "frontend");
    const backend = humanizeToken(features.backend ?? "backend");
    const styling = features.styling ? `, ${humanizeToken(features.styling)} UI` : "";
    const dataStack = joinLabels([features.orm, features.database]);
    const data = dataStack ? `, and ${dataStack}` : "";
    const auth = features.auth ? ` with ${humanizeToken(features.auth)} auth` : "";

    return `Fullstack ${frontend} and ${backend} starter${styling}${data}${auth}.`;
  }

  if (category === "monorepo-client-server") {
    const frontend = humanizeToken(features.frontend ?? "client");
    const backend = humanizeToken(features.backend ?? "server");
    const dataStack = joinLabels([features.orm, features.database]);
    const data = dataStack ? ` with ${dataStack}` : "";

    return `Client/server monorepo pairing a ${frontend} app with a ${backend} API${data}.`;
  }

  if (category === "monorepo-turbo-pnpm") {
    const frontend = humanizeToken(features.frontend ?? "web");
    const backend = humanizeToken(features.backend ?? "API");
    const dataStack = joinLabels([features.orm, features.database]);
    const data = dataStack ? ` and ${dataStack}` : "";

    return `Turborepo pnpm workspace with ${frontend}, ${backend}${data}.`;
  }

  return `${humanizeCategory(category)} starter template.`;
}

export function discoverTemplates(rootDir) {
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
      const features = Object.fromEntries(
        FILTER_GROUPS.map((group) => [group.key, getFeatureValue(tokenSet, group.tokens)])
      );

      templates.push({
        id: `${category}/${slug}`,
        category,
        slug,
        absolutePath,
        tokens: tokenSet,
        features,
        label: `${displayParts.join(" + ")} (${humanizeCategory(category)})`,
        description: buildTemplateDescription(category, features, tokenSet)
      });
    }
  }

  return templates.sort((left, right) => left.id.localeCompare(right.id));
}

export function getAvailableCategories(templates) {
  return [...new Set(templates.map((template) => template.category))];
}

export function getAvailableFeatureValues(templates, group) {
  return [
    ...new Set(
      templates
        .map((template) => template.features[group.key])
        .filter(Boolean)
    )
  ];
}

export function listTemplates(templates) {
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
      console.log(`    ${template.description}`);
    }
    console.log("");
  }
}

export function serializeTemplate(template) {
  return {
    id: template.id,
    category: template.category,
    slug: template.slug,
    label: template.label,
    description: template.description,
    features: template.features,
    tokens: [...template.tokens].sort((left, right) => left.localeCompare(right))
  };
}

export function serializeTemplateList(templates) {
  return {
    templates: templates.map(serializeTemplate)
  };
}

export function formatTemplateSummary(templates) {
  return templates.map((template) => `- ${template.id}`).join("\n");
}
