import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const presetsRoot = path.join(repoRoot, "template-sources", "presets");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(sourceDir, targetDir) {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
      continue;
    }

    ensureDir(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
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

  fs.rmSync(targetDir, { recursive: true, force: true });
  ensureDir(targetDir);

  for (const basePath of preset.base ?? []) {
    copyDir(resolveSource(basePath), targetDir);
  }

  for (const layerPath of preset.layers ?? []) {
    copyDir(resolveSource(layerPath), targetDir);
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
