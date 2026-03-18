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
    }
    console.log("");
  }
}

export function formatTemplateSummary(templates) {
  return templates.map((template) => `- ${template.id}`).join("\n");
}
