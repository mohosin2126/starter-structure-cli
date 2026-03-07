import fs from "node:fs";
import path from "node:path";

const sourceRoots = [
  path.resolve("template-sources/bases"),
  path.resolve("template-sources/layers")
];

const codeExtensions = new Set([".js", ".jsx", ".ts", ".tsx", ".vue", ".d.ts"]);
const moduleDirectories = new Set([
  "config",
  "controllers",
  "middleware",
  "models",
  "utils",
  "lib",
  "components",
  "hooks",
  "context",
  "context-api",
  "layout",
  "routes",
  "view",
  "data",
  "types",
  "interface",
  "services",
  "database",
  "scripts"
]);
const keepBasenames = new Set([
  "index",
  "main",
  "App",
  "page",
  "layout",
  "route",
  "auth",
  "vite-env",
  "next-env"
]);
const resolveExtensions = [".js", ".jsx", ".ts", ".tsx", ".vue", ".d.ts"];
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".d.ts",
  ".env",
  ".example",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

function getExtension(filePath) {
  if (filePath.endsWith(".d.ts")) {
    return ".d.ts";
  }

  return path.extname(filePath);
}

function getBaseName(filePath) {
  const extension = getExtension(filePath);
  return path.basename(filePath, extension);
}

function walkFiles(dirPath, collected = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkFiles(entryPath, collected);
      continue;
    }

    collected.push(entryPath);
  }

  return collected;
}

function isTextFile(filePath) {
  return textExtensions.has(getExtension(filePath)) || [".gitignore", ".npmignore"].includes(path.basename(filePath));
}

function shouldRename(filePath) {
  const extension = getExtension(filePath);
  if (!codeExtensions.has(extension)) {
    return false;
  }

  const baseName = getBaseName(filePath);
  if (keepBasenames.has(baseName)) {
    return false;
  }

  const segments = filePath.split(path.sep);
  return segments.some((segment) => moduleDirectories.has(segment));
}

function getNewPath(filePath) {
  const extension = getExtension(filePath);
  const baseName = getBaseName(filePath);
  return path.join(path.dirname(filePath), baseName, `index${extension}`);
}

function resolveRelativeSpecifier(fileDir, specifier) {
  const absoluteBase = path.resolve(fileDir, specifier);

  if (fs.existsSync(absoluteBase) && fs.statSync(absoluteBase).isFile()) {
    return absoluteBase;
  }

  for (const extension of resolveExtensions) {
    const withExtension = `${absoluteBase}${extension}`;
    if (fs.existsSync(withExtension)) {
      return withExtension;
    }
  }

  return undefined;
}

function rewriteExplicitRelativeImports(filePath, renameMap) {
  if (!isTextFile(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const directory = path.dirname(filePath);

  content = content.replace(/(["'`])(\.{1,2}\/[^"'`]+?\.[a-z]+)\1/g, (match, quote, specifier) => {
    const resolved = resolveRelativeSpecifier(directory, specifier);
    if (!resolved) {
      return match;
    }

    const nextPath = renameMap.get(resolved);
    if (!nextPath) {
      return match;
    }

    let replacement = path.relative(directory, nextPath).replace(/\\/g, "/");
    if (!replacement.startsWith(".")) {
      replacement = `./${replacement}`;
    }

    changed = true;
    return `${quote}${replacement}${quote}`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function moveFile(oldPath, newPath) {
  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  fs.renameSync(oldPath, newPath);
}

function main() {
  const allFiles = sourceRoots.flatMap((rootDir) => walkFiles(rootDir));
  const renameTargets = allFiles.filter(shouldRename);
  const renameMap = new Map();

  for (const filePath of renameTargets) {
    const newPath = getNewPath(filePath);
    if (fs.existsSync(newPath)) {
      throw new Error(`Target already exists: ${newPath}`);
    }
    renameMap.set(filePath, newPath);
  }

  for (const [oldPath, newPath] of renameMap.entries()) {
    moveFile(oldPath, newPath);
  }

  const updatedFiles = sourceRoots.flatMap((rootDir) => walkFiles(rootDir));
  for (const filePath of updatedFiles) {
    rewriteExplicitRelativeImports(filePath, renameMap);
  }

  console.log(`Moved ${renameMap.size} authored app files into index-based folders.`);
}

main();
