import path from "node:path";

const TEXT_FILE_EXTENSIONS = new Set([
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
  ".npmrc",
  ".prisma",
  ".scss",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

const TEXT_FILE_NAMES = new Set([".env", ".gitignore", ".npmignore", ".npmrc"]);

export function isTextFile(filePath) {
  const baseName = path.basename(filePath).toLowerCase();
  const extension = path.extname(filePath).toLowerCase();

  return TEXT_FILE_NAMES.has(baseName) || TEXT_FILE_EXTENSIONS.has(extension);
}
