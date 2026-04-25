import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { isTextFile } from "../text-files.js";

const MAX_NPM_PACKAGE_NAME_LENGTH = 214;
const RESERVED_PROJECT_NAMES = new Set(["node_modules", "favicon.ico"]);
const NPM_SAFE_PROJECT_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;

function isEmptyDir(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const sourcePath = path.join(src, entry.name);
    const destinationPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, destinationPath);
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
}

function walkFiles(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(entryPath, callback);
      continue;
    }

    callback(entryPath);
  }
}

export function listTemplateFiles(template) {
  const files = [];
  walkFiles(template.absolutePath, (filePath) => {
    files.push(path.relative(template.absolutePath, filePath));
  });
  return files.sort((left, right) => left.localeCompare(right));
}

function walkPaths(dir, collected = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    collected.push(entryPath);

    if (entry.isDirectory()) {
      walkPaths(entryPath, collected);
    }
  }

  return collected;
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return;
  }

  if (!isTextFile(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  for (const [from, to] of Object.entries(replacements)) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

function renamePlaceholderPaths(rootDir, replacements) {
  const paths = walkPaths(rootDir).sort((left, right) => right.length - left.length);

  for (const currentPath of paths) {
    const baseName = path.basename(currentPath);
    let nextName = baseName;

    for (const [from, to] of Object.entries(replacements)) {
      nextName = nextName.split(from).join(to);
    }

    if (nextName === baseName) {
      continue;
    }

    fs.renameSync(currentPath, path.join(path.dirname(currentPath), nextName));
  }
}

export function validateProjectName(value) {
  if (!value || value.trim().length === 0) {
    return "Please enter a project name.";
  }

  if (value !== value.trim()) {
    return "Project name cannot start or end with spaces.";
  }

  if (value.includes("/") || value.includes("\\")) {
    return "Use a simple folder name without slashes.";
  }

  if (value.length > MAX_NPM_PACKAGE_NAME_LENGTH) {
    return `Project name must be ${MAX_NPM_PACKAGE_NAME_LENGTH} characters or fewer.`;
  }

  if (RESERVED_PROJECT_NAMES.has(value)) {
    return `Project name cannot be "${value}".`;
  }

  if (!NPM_SAFE_PROJECT_NAME_PATTERN.test(value)) {
    return "Use lowercase letters, numbers, dots, underscores, or hyphens without spaces.";
  }

  return undefined;
}

export function getTargetDirectoryError(targetDir) {
  if (fs.existsSync(targetDir) && !isEmptyDir(targetDir)) {
    return `Target directory is not empty: ${targetDir}`;
  }

  return undefined;
}

export function getTemplateDirectoryError(template) {
  if (isEmptyDir(template.absolutePath)) {
    return "Add your real template files before generating a project.";
  }

  return undefined;
}

export function scaffoldTemplate({ template, targetDir, projectName }) {
  copyDir(template.absolutePath, targetDir);
  renamePlaceholderPaths(targetDir, { "__APP_NAME__": projectName });
  walkFiles(targetDir, (filePath) => {
    replaceInFile(filePath, { "__APP_NAME__": projectName });
  });
}

export function installDependencies(targetDir, packageManager) {
  const result = spawnSync(packageManager, ["install"], {
    cwd: targetDir,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (result.status !== 0) {
    throw new Error(`${packageManager} install failed`);
  }
}

export function getSuggestedPackageManager(template) {
  if (template.tokens.has("pnpm")) {
    return "pnpm";
  }

  return "npm";
}
