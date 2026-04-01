#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveLocalCliPath() {
  return path.resolve(__dirname, "../../../bin/starter-structure-cli.js");
}

function resolveCliEntrypoint() {
  try {
    return require.resolve("starter-structure-cli/bin/starter-structure-cli.js");
  } catch {
    const localCliPath = resolveLocalCliPath();
    if (fs.existsSync(localCliPath)) {
      return localCliPath;
    }

    throw new Error(
      "Unable to resolve starter-structure-cli. Install starter-structure-cli or publish this wrapper with its dependency.",
    );
  }
}

await import(pathToFileURL(resolveCliEntrypoint()).href);
