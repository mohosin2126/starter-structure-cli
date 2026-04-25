#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import { cancel, intro, note, outro } from "@clack/prompts";
import pc from "picocolors";

import { parseArgs, printHelp } from "../lib/cli/args.js";
import {
  discoverTemplates,
  listTemplates,
  serializeTemplateList
} from "../lib/cli/catalog.js";
import { createDoctorReport, formatDoctorReport } from "../lib/cli/doctor.js";
import {
  getTargetDirectoryError,
  getTemplateDirectoryError,
  installDependencies,
  scaffoldTemplate
} from "../lib/cli/scaffold.js";
import {
  createDryRunPreview,
  formatDryRunPreview,
  formatTemplateExplanation
} from "../lib/cli/preview.js";
import {
  hasExplicitSelectionInput,
  resolveInstallPreference,
  resolvePackageManagerChoice,
  resolveProjectName,
  resolveTemplateSelection
} from "../lib/cli/workflow.js";
import { createTemplateInfo, formatTemplateInfo } from "../lib/cli/template-info.js";
import { resolveTemplateByReference } from "../lib/cli/matching.js";
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

  if (args.doctor) {
    const report = createDoctorReport();
    console.log(args.json ? JSON.stringify(report, null, 2) : formatDoctorReport(report));
    if (!report.ok) {
      process.exitCode = 1;
    }
    return;
  }

  ensureTemplatesReady();
  const templates = discoverTemplates(templatesRoot);

  if (templates.length === 0) {
    throw new Error(
      `No templates found in ${templatesRoot}. Build them with "npm run build:templates".`
    );
  }

  if (args.templateInfoRef) {
    const template = resolveTemplateByReference(templates, args.templateInfoRef);

    if (!template) {
      const message = `Template not found: ${args.templateInfoRef}`;
      if (args.json) {
        console.log(JSON.stringify({ ok: false, error: message }, null, 2));
        process.exitCode = 1;
        return;
      }

      throw new Error(message);
    }

    console.log(
      args.json
        ? JSON.stringify(createTemplateInfo(template), null, 2)
        : formatTemplateInfo(template)
    );
    return;
  }

  if (args.list) {
    if (args.json) {
      console.log(JSON.stringify(serializeTemplateList(templates), null, 2));
    } else {
      listTemplates(templates);
    }
    return;
  }

  if (!args.json) {
    intro(pc.cyan("starter-structure-cli"));
  }

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

  const targetDir = path.resolve(process.cwd(), args.outputDir ?? projectName);

  if (args.dryRun) {
    if (args.json) {
      console.log(
        JSON.stringify(
          createDryRunPreview({
            template: selectedTemplate,
            projectName,
            targetDir,
            packageManager,
            comboTokens: args.comboTokens
          }),
          null,
          2
        )
      );
      return;
    }

    note(
      formatDryRunPreview({
        template: selectedTemplate,
        projectName,
        targetDir,
        packageManager,
        comboTokens: args.comboTokens
      }),
      "No files were created"
    );
    outro(pc.green("Dry run complete."));
    return;
  }

  if (args.explain) {
    note(formatTemplateExplanation(selectedTemplate, args.comboTokens), "Template match");
  }

  const shouldInstall = resolveStep(
    await resolveInstallPreference(args, explicitSelectionInput)
  );
  if (shouldInstall === undefined) {
    return;
  }

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
