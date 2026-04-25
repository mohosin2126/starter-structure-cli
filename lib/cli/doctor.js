import fs from "node:fs";
import path from "node:path";

import pc from "picocolors";

import {
  canBuildTemplates,
  getPresetDefinitions,
  hasCurrentTemplates,
  repoRoot,
  templatesRoot,
  validatePresetDefinitions,
  validateTemplates
} from "../template-builder.js";
import { discoverTemplates } from "./catalog.js";

const manifestPath = path.join(templatesRoot, ".templates-manifest.json");
const createPackagePath = path.join(
  repoRoot,
  "packages",
  "create-starter-structure-cli",
  "package.json"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function tryReadJson(filePath) {
  try {
    return { value: readJson(filePath) };
  } catch (error) {
    return { error };
  }
}

function pass(label, detail) {
  return { status: "pass", label, detail };
}

function fail(label, detail) {
  return { status: "fail", label, detail };
}

function warn(label, detail) {
  return { status: "warn", label, detail };
}

function checkFileExists(label, filePath) {
  return fs.existsSync(filePath)
    ? pass(label, path.relative(repoRoot, filePath))
    : fail(label, `Missing ${path.relative(repoRoot, filePath)}`);
}

function checkPackageVersions() {
  const rootPackagePath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(createPackagePath)) {
    return fail("Create package metadata", "Missing packages/create-starter-structure-cli/package.json");
  }

  const rootPackageResult = tryReadJson(rootPackagePath);
  if (rootPackageResult.error) {
    return fail("Create package metadata", `Cannot read package.json: ${rootPackageResult.error.message}`);
  }

  const createPackageResult = tryReadJson(createPackagePath);
  if (createPackageResult.error) {
    return fail(
      "Create package metadata",
      `Cannot read packages/create-starter-structure-cli/package.json: ${createPackageResult.error.message}`
    );
  }

  const rootPackage = rootPackageResult.value;
  const createPackage = createPackageResult.value;
  const dependencyVersion = createPackage.dependencies?.["starter-structure-cli"];
  const issues = [];

  if (createPackage.version !== rootPackage.version) {
    issues.push(
      `create package version ${createPackage.version} does not match root ${rootPackage.version}`
    );
  }

  if (dependencyVersion !== rootPackage.version) {
    issues.push(
      `starter-structure-cli dependency ${dependencyVersion ?? "missing"} does not match root ${rootPackage.version}`
    );
  }

  return issues.length === 0
    ? pass("Create package metadata", `version ${createPackage.version} matches root package`)
    : fail("Create package metadata", issues.join("; "));
}

function checkTemplateManifest() {
  if (!fs.existsSync(manifestPath)) {
    return fail("Templates manifest", "Missing templates/.templates-manifest.json");
  }

  const manifestResult = tryReadJson(manifestPath);
  if (manifestResult.error) {
    return fail("Templates manifest", `Cannot read manifest: ${manifestResult.error.message}`);
  }

  const manifest = manifestResult.value;
  const outputs = Array.isArray(manifest.outputs) ? manifest.outputs : [];
  const missingOutputs = outputs.filter((output) => !fs.existsSync(path.join(repoRoot, output)));

  if (outputs.length === 0) {
    return fail("Templates manifest", "Manifest has no outputs");
  }

  if (missingOutputs.length > 0) {
    return fail(
      "Templates manifest",
      `Missing outputs: ${missingOutputs.slice(0, 5).join(", ")}${missingOutputs.length > 5 ? "..." : ""}`
    );
  }

  return pass("Templates manifest", `${outputs.length} outputs are present`);
}

function checkPresetDefinitions(presetDefinitions) {
  if (!canBuildTemplates()) {
    return warn("Preset sources", "template-sources or presets directory is not available");
  }

  const validation = validatePresetDefinitions(presetDefinitions);
  const issueCount =
    validation.missingReferences.length +
    validation.outputNameMismatches.length +
    validation.duplicateOutputs.length;

  if (issueCount === 0) {
    return pass("Preset definitions", `${presetDefinitions.length} presets are valid`);
  }

  return fail(
    "Preset definitions",
    `${validation.missingReferences.length} missing references, ${validation.outputNameMismatches.length} name mismatches, ${validation.duplicateOutputs.length} duplicate outputs`
  );
}

function checkBuiltTemplates(presetDefinitions) {
  const validation = validateTemplates(templatesRoot, presetDefinitions);
  const issueCount =
    validation.emptyTemplates.length +
    validation.missingReadmes.length +
    validation.missingPackageSignals.length +
    validation.missingOutputDirs.length;

  if (validation.templateDirs.length === 0) {
    return fail("Built templates", "No templates found");
  }

  if (issueCount === 0) {
    return pass("Built templates", `${validation.templateDirs.length} templates are complete`);
  }

  return fail(
    "Built templates",
    `${validation.emptyTemplates.length} empty, ${validation.missingReadmes.length} missing README, ${validation.missingPackageSignals.length} missing package.json, ${validation.missingOutputDirs.length} missing outputs`
  );
}

function checkTemplateFreshness() {
  if (!canBuildTemplates()) {
    return warn("Template freshness", "Cannot compare generated templates without template sources");
  }

  return hasCurrentTemplates()
    ? pass("Template freshness", "Generated templates are current")
    : fail("Template freshness", "Generated templates are missing or older than template sources");
}

function checkTemplateCatalog() {
  const templates = discoverTemplates(templatesRoot);

  return templates.length > 0
    ? pass("Template catalog", `${templates.length} templates discoverable by the CLI`)
    : fail("Template catalog", "No templates discoverable by the CLI");
}

export function createDoctorReport() {
  const presetDefinitions = getPresetDefinitions();
  const checks = [
    checkFileExists("Root package", path.join(repoRoot, "package.json")),
    checkFileExists("CLI entry", path.join(repoRoot, "bin", "starter-structure-cli.js")),
    checkFileExists("README", path.join(repoRoot, "README.md")),
    checkFileExists("Templates directory", templatesRoot),
    checkTemplateManifest(),
    checkTemplateCatalog(),
    checkPresetDefinitions(presetDefinitions),
    checkBuiltTemplates(presetDefinitions),
    checkTemplateFreshness(),
    checkPackageVersions()
  ];

  return {
    ok: checks.every((check) => check.status !== "fail"),
    checks
  };
}

function formatStatus(status) {
  if (status === "pass") {
    return pc.green("pass");
  }

  if (status === "warn") {
    return pc.yellow("warn");
  }

  return pc.red("fail");
}

export function formatDoctorReport(report) {
  const lines = ["starter-structure-cli doctor", ""];

  for (const check of report.checks) {
    lines.push(`[${formatStatus(check.status)}] ${check.label}`);
    if (check.detail) {
      lines.push(`  ${check.detail}`);
    }
  }

  lines.push("");
  lines.push(report.ok ? pc.green("Doctor passed.") : pc.red("Doctor found issues."));

  return lines.join("\n");
}
