import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseArgs } from "../lib/cli/args.js";
import { discoverTemplates } from "../lib/cli/catalog.js";
import { formatDryRunPreview } from "../lib/cli/preview.js";
import { validateProjectName } from "../lib/cli/scaffold.js";
import { resolveTemplateSelection } from "../lib/cli/workflow.js";
import { templatesRoot } from "../lib/template-builder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

test("parseArgs parses supported flags and stack tokens", () => {
  const args = parseArgs([
    "my-app",
    "--category",
    "fullstack",
    "--package-manager",
    "pnpm",
    "react",
    "vite",
    "ts"
  ]);

  assert.equal(args.projectName, "my-app");
  assert.equal(args.category, "fullstack");
  assert.equal(args.packageManager, "pnpm");
  assert.equal(args.dryRun, false);
  assert.equal(args.explain, false);
  assert.deepEqual(args.comboTokens, ["react", "vite", "ts"]);
});

test("parseArgs parses dry-run and explain flags", () => {
  const args = parseArgs(["my-app", "react", "vite", "--dry-run", "--explain"]);

  assert.equal(args.projectName, "my-app");
  assert.equal(args.dryRun, true);
  assert.equal(args.explain, true);
  assert.deepEqual(args.comboTokens, ["react", "vite"]);
});

test("parseArgs rejects unknown flags", () => {
  assert.throws(
    () => parseArgs(["my-app", "--pakage-manager", "pnpm"]),
    /Unknown option: --pakage-manager/
  );
});

test("formatDryRunPreview describes the selected template without scaffolding", () => {
  const templates = discoverTemplates(templatesRoot);
  const template = templates.find(
    (item) => item.id === "single/react-vite-ts-tailwind"
  );

  assert.ok(template, "expected react vite ts template to be available");

  const preview = formatDryRunPreview({
    template,
    projectName: "my-app",
    targetDir: path.join(os.tmpdir(), "starter-structure-cli-preview-my-app"),
    packageManager: "npm",
    comboTokens: ["react", "vite", "ts"]
  });

  assert.match(preview, /Dry run preview/);
  assert.match(preview, /Template: single\/react-vite-ts-tailwind/);
  assert.match(preview, /react -> React/);
  assert.match(preview, /Files to create:/);
});

test("validateProjectName accepts npm-safe names and rejects invalid ones", () => {
  assert.equal(validateProjectName("my-app"), undefined);
  assert.equal(validateProjectName("demo_app"), undefined);
  assert.match(validateProjectName("My App"), /lowercase letters/);
  assert.match(validateProjectName(" node-app"), /start or end with spaces/);
  assert.match(validateProjectName("node_modules"), /cannot be "node_modules"/);
});

test("resolveTemplateSelection resolves exact and stack-based template matches", async () => {
  const templates = discoverTemplates(templatesRoot);

  assert.ok(templates.length > 0, "expected committed templates to be available");

  const exactMatch = await resolveTemplateSelection(
    {
      templateRef: "single/react-vite-ts-tailwind",
      category: undefined,
      comboTokens: [],
      yes: true
    },
    templates
  );

  assert.equal(exactMatch.cancelled, false);
  assert.equal(exactMatch.value.id, "single/react-vite-ts-tailwind");

  const stackMatch = await resolveTemplateSelection(
    {
      templateRef: undefined,
      category: "fullstack",
      comboTokens: ["react", "vite", "ts", "tailwind", "express", "prisma", "mysql"],
      yes: true
    },
    templates
  );

  assert.equal(stackMatch.cancelled, false);
  assert.equal(stackMatch.value.id, "fullstack/react-vite-ts-tailwind-express-prisma-mysql");
});

test("publish smoke test includes the postinstall script in the tarball", () => {
  const npmCacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "starter-structure-cli-npm-cache-"));
  const command = process.platform === "win32" ? "cmd" : "npm";
  const args =
    process.platform === "win32"
      ? ["/c", "npm", "pack", "--dry-run", "--ignore-scripts"]
      : ["pack", "--dry-run", "--ignore-scripts"];

  try {
    const result = spawnSync(command, args, {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        npm_config_cache: npmCacheDir
      }
    });

    const combinedOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

    assert.equal(result.status, 0, combinedOutput);
    assert.match(combinedOutput, /scripts\/postinstall-message\.js|scripts\\postinstall-message\.js/);
  } finally {
    fs.rmSync(npmCacheDir, { recursive: true, force: true });
  }
});
