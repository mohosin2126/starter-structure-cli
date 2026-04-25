import { humanizeCategory, humanizeToken, serializeTemplate } from "./catalog.js";
import { FILTER_GROUPS } from "./matching.js";
import { getSuggestedPackageManager, listTemplateFiles } from "./scaffold.js";

function formatFeatureLines(template) {
  return FILTER_GROUPS
    .map((group) => {
      const value = template.features[group.key];
      return value ? `  ${group.label}: ${humanizeToken(value)}` : undefined;
    })
    .filter(Boolean);
}

function formatFilePreview(files) {
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

export function createTemplateInfo(template) {
  const files = listTemplateFiles(template);

  return {
    template: serializeTemplate(template),
    categoryLabel: humanizeCategory(template.category),
    suggestedPackageManager: getSuggestedPackageManager(template),
    fileCount: files.length,
    files
  };
}

export function formatTemplateInfo(template) {
  const info = createTemplateInfo(template);

  return [
    `Template: ${info.template.id}`,
    `Category: ${info.categoryLabel}`,
    `Description: ${info.template.description}`,
    `Suggested package manager: ${info.suggestedPackageManager}`,
    "",
    "Features:",
    ...formatFeatureLines(template),
    "",
    `Files (${info.fileCount}):`,
    ...formatFilePreview(info.files)
  ].join("\n");
}
