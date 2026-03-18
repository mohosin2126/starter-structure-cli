import {
  CATEGORY_ALIASES,
  FILTER_GROUPS,
  NOISE_TOKENS,
  TOKEN_ALIASES
} from "./constants.js";

export function normalizeToken(value) {
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

export function tokenize(value) {
  return value
    .split(/[\s,/:+|]+/g)
    .map(normalizeToken)
    .filter(Boolean);
}

export function resolveCategories(input) {
  if (!input) {
    return [];
  }

  const normalized = normalizeToken(input);
  if (CATEGORY_ALIASES[normalized]) {
    return CATEGORY_ALIASES[normalized];
  }

  return [normalized];
}

export function filterTemplates(templates, categoryInput, comboTokens) {
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

export function resolveTemplateByReference(templates, reference) {
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

export function preferTypeScriptCandidates(templates, comboTokens) {
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

export function preferMinimalMatches(templates, comboTokens) {
  if (templates.length <= 1 || comboTokens.length === 0) {
    return templates;
  }

  const queryTokens = new Set(comboTokens);
  const scoredTemplates = templates.map((template) => {
    const slugTokens = template.slug.split("-").map(normalizeToken).filter(Boolean);
    const extraTokens = slugTokens.filter((token) => !queryTokens.has(token));

    return {
      template,
      score: extraTokens.length
    };
  });

  const minimumScore = Math.min(...scoredTemplates.map((item) => item.score));
  return scoredTemplates
    .filter((item) => item.score === minimumScore)
    .map((item) => item.template);
}

export function sortFilterValues(groupKey, values) {
  return [...values].sort((left, right) => {
    if (groupKey === "language") {
      if (left === "ts") return -1;
      if (right === "ts") return 1;
    }

    return left.localeCompare(right);
  });
}

export { FILTER_GROUPS };
