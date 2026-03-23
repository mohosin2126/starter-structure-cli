#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import { cancel, intro, note, outro } from "@clack/prompts";
import pc from "picocolors";

import { parseArgs, printHelp } from "../lib/cli/args.js";
import { discoverTemplates, listTemplates } from "../lib/cli/catalog.js";
import {
  getTargetDirectoryError,
  getTemplateDirectoryError,
  installDependencies,
  scaffoldTemplate
} from "../lib/cli/scaffold.js";
import {
  hasExplicitSelectionInput,
  resolveInstallPreference,
  resolvePackageManagerChoice,
  resolveProjectName,
  resolveTemplateSelection
} from "../lib/cli/workflow.js";
import { ensureTemplatesReady, templatesRoot } from "../lib/template-builder.js";

function resolveStep(result) {
  if (!result.cancelled) {
    return result.value;
  }

  if (result.note) {
    note(result.note.body, result.note.title);
  }

  cancel(result.cancelMessage);
  return undefined;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  ensureTemplatesReady();
  const templates = discoverTemplates(templatesRoot);

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

  const explicitSelectionInput = hasExplicitSelectionInput(args);

  const projectName = resolveStep(await resolveProjectName(args));
  if (!projectName) {
    return;
  }

  const selectedTemplate = resolveStep(await resolveTemplateSelection(args, templates));
  if (!selectedTemplate) {
    return;
  }

  const packageManager = resolveStep(
    await resolvePackageManagerChoice(args, selectedTemplate, explicitSelectionInput)
  );
  if (!packageManager) {
    return;
  }

  const shouldInstall = resolveStep(
    await resolveInstallPreference(args, explicitSelectionInput)
  );
  if (shouldInstall === undefined) {
    return;
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
