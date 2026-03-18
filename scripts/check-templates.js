import {
  ensureTemplatesReady,
  getPresetDefinitions,
  validatePresetDefinitions,
  validateTemplates
} from "../lib/template-builder.js";

ensureTemplatesReady();

const presetDefinitions = getPresetDefinitions();
const {
  missingReferences,
  outputNameMismatches,
  duplicateOutputs
} = validatePresetDefinitions(presetDefinitions);
const {
  templateDirs,
  emptyTemplates,
  missingReadmes,
  missingPackageSignals,
  missingOutputDirs
} = validateTemplates(undefined, presetDefinitions);

const hasErrors =
  missingReferences.length > 0 ||
  outputNameMismatches.length > 0 ||
  duplicateOutputs.length > 0 ||
  missingOutputDirs.length > 0 ||
  emptyTemplates.length > 0 ||
  missingReadmes.length > 0 ||
  missingPackageSignals.length > 0;

if (hasErrors) {
  console.error("Template validation failed.");

  if (missingReferences.length > 0) {
    console.error("Missing referenced base/layer paths:");
    for (const issue of missingReferences) {
      console.error(`- ${issue.preset} -> missing ${issue.type}: ${issue.path}`);
    }
    console.error("");
  }

  if (outputNameMismatches.length > 0) {
    console.error("Preset output path/name mismatches:");
    for (const issue of outputNameMismatches) {
      console.error(`- ${issue.preset} -> name "${issue.presetName}" vs output "${issue.output}"`);
    }
    console.error("");
  }

  if (duplicateOutputs.length > 0) {
    console.error("Duplicate preset outputs:");
    for (const issue of duplicateOutputs) {
      console.error(`- ${issue.output} <- ${issue.presets.join(", ")}`);
    }
    console.error("");
  }

  if (missingOutputDirs.length > 0) {
    console.error("Preset outputs missing from templates/:");
    for (const output of missingOutputDirs) {
      console.error(`- ${output}`);
    }
    console.error("");
  }

  if (emptyTemplates.length > 0) {
    console.error("These template directories do not contain any files:");
    for (const templateDir of emptyTemplates) {
      console.error(`- ${templateDir}`);
    }
    console.error("");
  }

  if (missingReadmes.length > 0) {
    console.error("These built templates are missing README.md:");
    for (const templateDir of missingReadmes) {
      console.error(`- ${templateDir}`);
    }
    console.error("");
  }

  if (missingPackageSignals.length > 0) {
    console.error("These built templates are missing a package/app signal (package.json):");
    for (const templateDir of missingPackageSignals) {
      console.error(`- ${templateDir}`);
    }
    console.error("");
  }

  console.error("Fix the preset/source issues before publishing.");
  process.exit(1);
}

console.log(`Template validation passed for ${templateDirs.length} templates across ${presetDefinitions.length} presets.`);
