import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const templateSourcesRoot = path.join(repoRoot, "template-sources");
const presetsRoot = path.join(repoRoot, "template-sources", "presets");
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
  return JSON.parse(fs.readFileSync(presetPath, "utf8"));
}

function resolveSource(relativePath) {
  return path.join(repoRoot, "template-sources", relativePath);
}

function buildPreset(preset) {
  const targetDir = path.join(repoRoot, preset.output);
  const variables = preset.variables ?? {};

  fs.rmSync(targetDir, { recursive: true, force: true });
  ensureDir(targetDir);

  for (const basePath of preset.base ?? []) {
    copyDir(resolveSource(basePath), targetDir, variables);
  }

  for (const layerPath of preset.layers ?? []) {
    copyDir(resolveSource(layerPath), targetDir, variables);
  }

  return targetDir;
}

function main() {
  const presetCategories = fs
    .readdirSync(presetsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(presetsRoot, entry.name));

  const presetFiles = presetCategories.flatMap(getPresetFiles);

  if (presetFiles.length === 0) {
    console.log("No template presets found.");
    return;
  }

  const builtTargets = [];

  for (const presetFile of presetFiles) {
    const preset = loadPreset(presetFile);
    const targetDir = buildPreset(preset);
    builtTargets.push(path.relative(repoRoot, targetDir));
  }

  console.log(`Built ${builtTargets.length} template presets.`);
  for (const target of builtTargets) {
    console.log(`- ${target}`);
  }
}

main();
