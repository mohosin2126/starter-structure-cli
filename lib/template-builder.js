import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, "..");
export const templatesRoot = path.join(repoRoot, "templates");

const templateSourcesRoot = path.join(repoRoot, "template-sources");
const presetsRoot = path.join(templateSourcesRoot, "presets");
const buildManifestPath = path.join(templatesRoot, ".templates-manifest.json");
const includePattern = /\{\{\s*include:\s*([^\s}]+)\s*\}\}/g;
const textFileExtensions = new Set([
  ".cjs",
  ".css",
  ".d.ts",
  ".example",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".prisma",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);
const textFileNames = new Set([".gitignore", ".npmignore", ".env"]);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function removeDir(dirPath) {
  fs.rmSync(dirPath, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100
  });
}

function applyVariables(input, variables) {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.split(`__${key}__`).join(String(value)),
    input
  );
}

function isTextFile(filePath) {
  return textFileNames.has(path.basename(filePath)) || textFileExtensions.has(path.extname(filePath));
}

function resolveIncludePath(sourcePath, includePath) {
  if (includePath.startsWith("./") || includePath.startsWith("../")) {
    return path.resolve(path.dirname(sourcePath), includePath);
  }

  return path.join(templateSourcesRoot, includePath);
}

function renderTextFile(sourcePath, variables, activeStack = []) {
  const resolvedPath = path.resolve(sourcePath);

  if (activeStack.includes(resolvedPath)) {
    const cycle = [...activeStack, resolvedPath].map((item) => path.relative(repoRoot, item)).join(" -> ");
    throw new Error(`Include cycle detected: ${cycle}`);
  }

  const nextStack = [...activeStack, resolvedPath];
  const content = fs.readFileSync(resolvedPath, "utf8");

  const withIncludes = content.replace(includePattern, (_match, includePath) => {
    const includeSource = resolveIncludePath(resolvedPath, includePath);

    if (!fs.existsSync(includeSource)) {
      throw new Error(
        `Missing include "${includePath}" referenced from ${path.relative(repoRoot, resolvedPath)}`
      );
    }

    if (!isTextFile(includeSource)) {
      throw new Error(
        `Include "${includePath}" referenced from ${path.relative(repoRoot, resolvedPath)} must be a text file`
      );
    }

    return renderTextFile(includeSource, variables, nextStack);
  });

  return applyVariables(withIncludes, variables);
}

function copyFile(sourcePath, targetPath, variables) {
  ensureDir(path.dirname(targetPath));

  if (!isTextFile(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    return;
  }

  fs.writeFileSync(targetPath, renderTextFile(sourcePath, variables), "utf8");
}

function copyDir(sourceDir, targetDir, variables) {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetName = applyVariables(entry.name, variables);
    const targetPath = path.join(targetDir, targetName);

    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath, variables);
      continue;
    }

    copyFile(sourcePath, targetPath, variables);
  }
}

function getPresetFiles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(rootDir, entry.name));
}

function loadPreset(presetPath) {
  return {
    ...JSON.parse(fs.readFileSync(presetPath, "utf8")),
    sourcePath: presetPath,
    sourceRelativePath: path.relative(repoRoot, presetPath)
  };
}

function resolveSource(relativePath) {
  return path.join(templateSourcesRoot, relativePath);
}

function buildPreset(preset) {
  const targetDir = path.join(repoRoot, preset.output);
  const variables = preset.variables ?? {};

  removeDir(targetDir);
  ensureDir(targetDir);

  for (const basePath of preset.base ?? []) {
    copyDir(resolveSource(basePath), targetDir, variables);
  }

  for (const layerPath of preset.layers ?? []) {
    copyDir(resolveSource(layerPath), targetDir, variables);
  }

  return targetDir;
}

function collectLatestModifiedTime(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return 0;
  }

  let latest = fs.statSync(rootDir).mtimeMs;

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      latest = Math.max(latest, collectLatestModifiedTime(entryPath));
      continue;
    }

    latest = Math.max(latest, fs.statSync(entryPath).mtimeMs);
  }

  return latest;
}

function hasAnyFile(dir) {
  if (!fs.existsSync(dir)) {
    return false;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isFile()) {
      return true;
    }

    if (entry.isDirectory() && hasAnyFile(entryPath)) {
      return true;
    }
  }

  return false;
}

function writeBuildManifest(outputs) {
  ensureDir(templatesRoot);
  fs.writeFileSync(
    buildManifestPath,
    JSON.stringify(
      {
        builtAt: new Date().toISOString(),
        outputs
      },
      null,
      2
    ),
    "utf8"
  );
}

export function canBuildTemplates() {
  return fs.existsSync(templateSourcesRoot) && fs.existsSync(presetsRoot);
}

export function getPresetDefinitions() {
  if (!canBuildTemplates()) {
    return [];
  }

  const presetCategories = fs
    .readdirSync(presetsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(presetsRoot, entry.name));

  return presetCategories.flatMap(getPresetFiles).map((presetPath) => loadPreset(presetPath));
}

function hasNamedFile(rootDir, fileName) {
  if (!fs.existsSync(rootDir)) {
    return false;
  }

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const entryPath = path.join(rootDir, entry.name);

    if (entry.isFile() && entry.name === fileName) {
      return true;
    }

    if (entry.isDirectory() && hasNamedFile(entryPath, fileName)) {
      return true;
    }
  }

  return false;
}

function hasPackageSignal(rootDir) {
  return hasNamedFile(rootDir, "package.json");
}

function normalizePresetOutput(value) {
  return value.replace(/\\/g, "/");
}

function getPresetOutputSlug(output) {
  return normalizePresetOutput(output).split("/").at(-1) ?? "";
}

export function validatePresetDefinitions(presetDefinitions = getPresetDefinitions()) {
  const missingReferences = [];
  const outputNameMismatches = [];
  const duplicateOutputs = [];
  const outputsByPath = new Map();

  for (const preset of presetDefinitions) {
    const normalizedOutput = normalizePresetOutput(preset.output);
    const outputSlug = getPresetOutputSlug(normalizedOutput);

    if (outputSlug !== preset.name) {
      outputNameMismatches.push({
        preset: preset.sourceRelativePath,
        presetName: preset.name,
        output: normalizedOutput
      });
    }

    const existing = outputsByPath.get(normalizedOutput) ?? [];
    existing.push(preset.sourceRelativePath);
    outputsByPath.set(normalizedOutput, existing);

    for (const basePath of preset.base ?? []) {
      if (!fs.existsSync(resolveSource(basePath))) {
        missingReferences.push({
          preset: preset.sourceRelativePath,
          type: "base",
          path: basePath
        });
      }
    }

    for (const layerPath of preset.layers ?? []) {
      if (!fs.existsSync(resolveSource(layerPath))) {
        missingReferences.push({
          preset: preset.sourceRelativePath,
          type: "layer",
          path: layerPath
        });
      }
    }
  }

  for (const [output, presets] of outputsByPath.entries()) {
    if (presets.length > 1) {
      duplicateOutputs.push({
        output,
        presets
      });
    }
  }

  return {
    presetDefinitions,
    missingReferences,
    outputNameMismatches,
    duplicateOutputs
  };
}

function hasPresetDefinitionErrors(validation) {
  return (
    validation.missingReferences.length > 0 ||
    validation.outputNameMismatches.length > 0 ||
    validation.duplicateOutputs.length > 0
  );
}

function formatPresetDefinitionErrors(validation) {
  const lines = ["Preset validation failed."];

  if (validation.missingReferences.length > 0) {
    lines.push("Missing referenced base/layer paths:");
    for (const issue of validation.missingReferences) {
      lines.push(`- ${issue.preset} -> missing ${issue.type}: ${issue.path}`);
    }
  }

  if (validation.outputNameMismatches.length > 0) {
    lines.push("Preset output paths do not match preset names:");
    for (const issue of validation.outputNameMismatches) {
      lines.push(`- ${issue.preset} -> name "${issue.presetName}" does not match output "${issue.output}"`);
    }
  }

  if (validation.duplicateOutputs.length > 0) {
    lines.push("Duplicate template outputs detected:");
    for (const issue of validation.duplicateOutputs) {
      lines.push(`- ${issue.output} <- ${issue.presets.join(", ")}`);
    }
  }

  return lines.join("\n");
}

export function getTemplateDirs(rootDir = templatesRoot) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const templateDirs = [];
  const categories = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const category of categories) {
    const categoryDir = path.join(rootDir, category);
    const starters = fs
      .readdirSync(categoryDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(categoryDir, entry.name));

    templateDirs.push(...starters);
  }

  return templateDirs;
}

export function validateTemplates(rootDir = templatesRoot, presetDefinitions = getPresetDefinitions()) {
  const templateDirs = getTemplateDirs(rootDir);
  const emptyTemplates = templateDirs
    .filter((templateDir) => !hasAnyFile(templateDir))
    .map((templateDir) => path.relative(rootDir, templateDir));
  const missingReadmes = templateDirs
    .filter((templateDir) => !fs.existsSync(path.join(templateDir, "README.md")))
    .map((templateDir) => path.relative(rootDir, templateDir));
  const missingPackageSignals = templateDirs
    .filter((templateDir) => !hasPackageSignal(templateDir))
    .map((templateDir) => path.relative(rootDir, templateDir));
  const missingOutputDirs = presetDefinitions
    .map((preset) => normalizePresetOutput(preset.output))
    .filter((output) => !fs.existsSync(path.join(repoRoot, output)));

  return {
    templateDirs,
    emptyTemplates,
    missingReadmes,
    missingPackageSignals,
    missingOutputDirs
  };
}

export function buildTemplates() {
  const presetDefinitions = getPresetDefinitions();

  if (presetDefinitions.length === 0) {
    return [];
  }

  const presetValidation = validatePresetDefinitions(presetDefinitions);
  if (hasPresetDefinitionErrors(presetValidation)) {
    throw new Error(formatPresetDefinitionErrors(presetValidation));
  }

  removeDir(templatesRoot);
  ensureDir(templatesRoot);

  const builtTargets = [];

  for (const preset of presetDefinitions) {
    const targetDir = buildPreset(preset);
    builtTargets.push(path.relative(repoRoot, targetDir));
  }

  writeBuildManifest(builtTargets);
  return builtTargets;
}

export function hasCurrentTemplates() {
  const presetDefinitions = getPresetDefinitions();

  if (presetDefinitions.length === 0) {
    return getTemplateDirs().length > 0;
  }

  if (!fs.existsSync(buildManifestPath)) {
    return false;
  }

  for (const preset of presetDefinitions) {
    const outputDir = path.join(repoRoot, preset.output);
    if (!hasAnyFile(outputDir)) {
      return false;
    }
  }

  const manifestMtime = fs.statSync(buildManifestPath).mtimeMs;
  const latestSourceMtime = collectLatestModifiedTime(templateSourcesRoot);

  return manifestMtime >= latestSourceMtime;
}

export function ensureTemplatesReady() {
  if (hasCurrentTemplates()) {
    return {
      built: false,
      builtTargets: []
    };
  }

  if (!canBuildTemplates()) {
    return {
      built: false,
      builtTargets: []
    };
  }

  return {
    built: true,
    builtTargets: buildTemplates()
  };
}
