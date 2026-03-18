import {
  confirm,
  isCancel,
  select,
  text
} from "@clack/prompts";

import { PACKAGE_MANAGER_OPTIONS } from "./constants.js";
import {
  getAvailableCategories,
  getAvailableFeatureValues,
  humanizeCategory,
  humanizeToken
} from "./catalog.js";
import { FILTER_GROUPS, sortFilterValues } from "./matching.js";

export async function promptForProjectName(validateProjectName) {
  const projectName = await text({
    message: "Project folder name?",
    placeholder: "my-app",
    defaultValue: "my-app",
    validate: validateProjectName
  });

  if (isCancel(projectName)) {
    return undefined;
  }

  return projectName;
}

export async function chooseCategory(templates) {
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

export async function chooseByFeatures(templates) {
  let candidates = [...templates];

  for (const group of FILTER_GROUPS) {
    const values = sortFilterValues(group.key, getAvailableFeatureValues(candidates, group));
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

export async function chooseTemplate(templates) {
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

export async function choosePackageManager(suggested) {
  const packageManager = await select({
    message: "Choose a package manager:",
    options: PACKAGE_MANAGER_OPTIONS.map((value) => ({
      value,
      label: value
    })),
    initialValue: suggested
  });

  if (isCancel(packageManager)) {
    return undefined;
  }

  return packageManager;
}

export async function confirmInstallDependencies() {
  const shouldInstall = await confirm({
    message: "Install dependencies now?",
    initialValue: false
  });

  if (isCancel(shouldInstall)) {
    return undefined;
  }

  return shouldInstall;
}
