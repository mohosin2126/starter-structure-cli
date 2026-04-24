import path from "node:path";

import { FILTER_GROUPS } from "./matching.js";
import { humanizeCategory, humanizeToken } from "./catalog.js";
import {
  getTargetDirectoryError,
  getTemplateDirectoryError,
  listTemplateFiles
} from "./scaffold.js";

function uniqueValues(values) {
  return [...new Set(values)];
}

function formatFeatureLines(template) {
  return FILTER_GROUPS
    .map((group) => {
      const value = template.features[group.key];
      return value ? `  ${group.label}: ${humanizeToken(value)}` : undefined;
    })
    .filter(Boolean);
}

function formatMatchedTokenLines(template, comboTokens) {
  const matchedTokens = uniqueValues(comboTokens).filter((token) => template.tokens.has(token));

  if (matchedTokens.length === 0) {
    return ["  No stack tokens were provided."];
  }

  return matchedTokens.map((token) => `  ${token} -> ${humanizeToken(token)}`);
}

function formatFileLines(template) {
  const files = listTemplateFiles(template);

  if (files.length === 0) {
    return ["  No files found in this template."];
  }

  const visibleFiles = files.slice(0, 30).map((file) => `  ${file}`);
  const hiddenCount = files.length - visibleFiles.length;

  if (hiddenCount > 0) {
    visibleFiles.push(`  ...and ${hiddenCount} more`);
  }

  return visibleFiles;
}

export function formatTemplateExplanation(template, comboTokens) {
  return [
    `Selected: ${template.id}`,
    `Category: ${humanizeCategory(template.category)}`,
    "",
    "Matched tokens:",
    ...formatMatchedTokenLines(template, comboTokens),
    "",
    "Template features:",
    ...formatFeatureLines(template)
  ].join("\n");
}

export function formatDryRunPreview({
  template,
  projectName,
  targetDir,
  packageManager,
  comboTokens
}) {
  const targetError = getTargetDirectoryError(targetDir);
  const templateError = getTemplateDirectoryError(template);

  return [
    "Dry run preview",
    "",
    `Project: ${projectName}`,
    `Target: ${targetDir}`,
    `Template: ${template.id}`,
    `Package manager: ${packageManager}`,
    "",
    "Target status:",
    `  ${targetError ?? "Ready to create"}`,
    "",
    "Template status:",
    `  ${templateError ?? "Ready to scaffold"}`,
    "",
    formatTemplateExplanation(template, comboTokens),
    "",
    "Files to create:",
    ...formatFileLines(template),
    "",
    `Next command would start in: ${path.basename(targetDir)}`
  ].join("\n");
}
