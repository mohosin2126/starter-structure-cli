import {
  chooseByFeatures,
  chooseCategory,
  choosePackageManager,
  chooseTemplate,
  confirmInstallDependencies,
  promptForProjectName
} from "./prompts.js";
import {
  preferMinimalMatches,
  preferTypeScriptCandidates,
  filterTemplates,
  resolveTemplateByReference
} from "./matching.js";
import { formatTemplateSummary } from "./catalog.js";
import { SUPPORTED_PACKAGE_MANAGERS } from "./constants.js";
import { getSuggestedPackageManager, validateProjectName } from "./scaffold.js";

function success(value) {
  return {
    cancelled: false,
    value
  };
}

function cancelled(cancelMessage, notePayload) {
  return {
    cancelled: true,
    cancelMessage,
    note: notePayload
  };
}

function getSelectionTokens(comboTokens) {
  return [...new Set(comboTokens)];
}

export function hasExplicitSelectionInput(args) {
  return Boolean(args.templateRef || args.category || args.comboTokens.length > 0);
}

export async function resolveProjectName(args) {
  if (!args.projectName) {
    const projectName = await promptForProjectName(validateProjectName);
    return projectName ? success(projectName) : cancelled("Cancelled.");
  }

  const validationError = validateProjectName(args.projectName);
  if (validationError) {
    return cancelled(validationError);
  }

  return success(args.projectName);
}

export async function resolveTemplateSelection(args, templates) {
  const comboTokens = getSelectionTokens(args.comboTokens);
  let selectedTemplate =
    args.templateRef ? resolveTemplateByReference(templates, args.templateRef) : undefined;

  if (args.templateRef && !selectedTemplate) {
    return cancelled(`Template not found: ${args.templateRef}`, {
      title: "Available templates",
      body: formatTemplateSummary(templates)
    });
  }

  let candidates = selectedTemplate
    ? [selectedTemplate]
    : filterTemplates(templates, args.category, comboTokens);

  candidates = preferTypeScriptCandidates(candidates, comboTokens);
  candidates = preferMinimalMatches(candidates, comboTokens);

  if (!selectedTemplate && candidates.length === 0) {
    return cancelled("Adjust your stack filters or choose a template explicitly.", {
      title: "No template matched the requested combination",
      body: formatTemplateSummary(templates)
    });
  }

  if (!selectedTemplate) {
    if (!args.category) {
      const chosenCategory = await chooseCategory(candidates);
      if (!chosenCategory) {
        return cancelled("Cancelled.");
      }

      candidates = candidates.filter((template) => template.category === chosenCategory);
      candidates = preferTypeScriptCandidates(candidates, comboTokens);
    }

    if (candidates.length > 1 && comboTokens.length === 0) {
      const narrowed = await chooseByFeatures(candidates);
      if (!narrowed) {
        return cancelled("Cancelled.");
      }
      candidates = narrowed;
    }

    if (candidates.length > 1 && args.yes) {
      return cancelled("Use --template or add more stack filters.", {
        title: "Multiple templates still match",
        body: formatTemplateSummary(candidates)
      });
    }

    selectedTemplate = await chooseTemplate(candidates);
    if (!selectedTemplate) {
      return cancelled("Cancelled.");
    }
  }

  return success(selectedTemplate);
}

export async function resolvePackageManagerChoice(
  args,
  selectedTemplate,
  hasExplicitSelection
) {
  let packageManager = args.packageManager;

  if (!packageManager) {
    const suggested = getSuggestedPackageManager(selectedTemplate);
    packageManager =
      args.yes || hasExplicitSelection
        ? suggested
        : await choosePackageManager(suggested);

    if (!packageManager) {
      return cancelled("Cancelled.");
    }
  }

  if (!SUPPORTED_PACKAGE_MANAGERS.has(packageManager)) {
    return cancelled(`Unsupported package manager: ${packageManager}`);
  }

  return success(packageManager);
}

export async function resolveInstallPreference(args, hasExplicitSelection) {
  if (args.install !== undefined) {
    return success(args.install);
  }

  const shouldInstall =
    args.yes || hasExplicitSelection
      ? false
      : await confirmInstallDependencies();

  if (shouldInstall === undefined) {
    return cancelled("Cancelled.");
  }

  return success(shouldInstall);
}
