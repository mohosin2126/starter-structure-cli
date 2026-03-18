#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import { cancel, intro, note, outro } from "@clack/prompts";
import pc from "picocolors";

import { parseArgs, printHelp } from "../lib/cli/args.js";
import {
  discoverTemplates,
  formatTemplateSummary,
  listTemplates
} from "../lib/cli/catalog.js";
import {
  preferMinimalMatches,
  preferTypeScriptCandidates,
  filterTemplates,
  resolveTemplateByReference
} from "../lib/cli/matching.js";
import {
  chooseByFeatures,
  chooseCategory,
  choosePackageManager,
  chooseTemplate,
  confirmInstallDependencies,
  promptForProjectName
} from "../lib/cli/prompts.js";
import {
  getSuggestedPackageManager,
  getTargetDirectoryError,
  getTemplateDirectoryError,
  installDependencies,
  scaffoldTemplate,
  validateProjectName
} from "../lib/cli/scaffold.js";
import { SUPPORTED_PACKAGE_MANAGERS } from "../lib/cli/constants.js";
import { ensureTemplatesReady, templatesRoot } from "../lib/template-builder.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const hasExplicitSelectionInput = Boolean(
    args.templateRef ||
    args.category ||
    args.comboTokens.length > 0
  );
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
    projectName = await promptForProjectName(validateProjectName);
    if (!projectName) {
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
  candidates = preferMinimalMatches(candidates, args.comboTokens);

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
    packageManager =
      args.yes || hasExplicitSelectionInput
        ? suggested
        : await choosePackageManager(suggested);

    if (!packageManager) {
      return cancel("Cancelled.");
    }
  }

  if (!SUPPORTED_PACKAGE_MANAGERS.has(packageManager)) {
    return cancel(`Unsupported package manager: ${packageManager}`);
  }

  let shouldInstall = args.install;
  if (shouldInstall === undefined) {
    shouldInstall =
      args.yes || hasExplicitSelectionInput
        ? false
        : await confirmInstallDependencies();
    if (shouldInstall === undefined) {
      return cancel("Cancelled.");
    }
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  const targetError = getTargetDirectoryError(targetDir);
  if (targetError) {
    return cancel(targetError);
  }

  const templateError = getTemplateDirectoryError(selectedTemplate);
  if (templateError) {
    note(selectedTemplate.id, "Selected template directory is empty");
    return cancel(templateError);
  }

  scaffoldTemplate({
    template: selectedTemplate,
    targetDir,
    projectName
  });

  if (shouldInstall) {
    note(`${packageManager} install`, "Installing dependencies");
    installDependencies(targetDir, packageManager);
  }

  outro(
    [
      pc.green(`Created ${projectName}`),
      `Template: ${selectedTemplate.id}`,
      "Next:",
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
