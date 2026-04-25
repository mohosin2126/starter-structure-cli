import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseArgs } from "../lib/cli/args.js";
import { discoverTemplates, serializeTemplateList } from "../lib/cli/catalog.js";
import { createDoctorReport, formatDoctorReport } from "../lib/cli/doctor.js";
import { createDryRunPreview, formatDryRunPreview } from "../lib/cli/preview.js";
import { validateProjectName } from "../lib/cli/scaffold.js";
import { createTemplateInfo, formatTemplateInfo } from "../lib/cli/template-info.js";
import { resolveTemplateSelection } from "../lib/cli/workflow.js";
import { templatesRoot } from "../lib/template-builder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const cliPath = path.join(repoRoot, "bin", "starter-structure-cli.js");

function collectTextFiles(dir, collected = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectTextFiles(entryPath, collected);
      continue;
    }

    const content = fs.readFileSync(entryPath);
    if (!content.includes(0)) {
      collected.push(entryPath);
    }
  }

  return collected;
}

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

test("parseArgs parses the doctor flag", () => {
  const args = parseArgs(["--doctor"]);

  assert.equal(args.doctor, true);
});

test("parseArgs parses the json flag", () => {
  const args = parseArgs(["--list", "--json"]);

  assert.equal(args.list, true);
  assert.equal(args.json, true);
});

test("parseArgs accepts bun as a package manager value", () => {
  const args = parseArgs(["my-app", "--package-manager", "bun"]);

  assert.equal(args.projectName, "my-app");
  assert.equal(args.packageManager, "bun");
});

test("parseArgs parses a custom output directory", () => {
  const args = parseArgs(["my-app", "--output", "./apps/my-app"]);

  assert.equal(args.projectName, "my-app");
  assert.equal(args.outputDir, "./apps/my-app");
});

test("parseArgs parses template-info references", () => {
  const args = parseArgs(["--template-info", "single/react-vite-ts-tailwind"]);

  assert.equal(args.templateInfoRef, "single/react-vite-ts-tailwind");
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

test("createDryRunPreview returns serializable dry-run data", () => {
  const templates = discoverTemplates(templatesRoot);
  const template = templates.find(
    (item) => item.id === "single/react-vite-ts-tailwind"
  );

  assert.ok(template, "expected react vite ts template to be available");

  const preview = createDryRunPreview({
    template,
    projectName: "my-app",
    targetDir: path.join(os.tmpdir(), "starter-structure-cli-preview-my-app"),
    packageManager: "npm",
    comboTokens: ["react", "vite", "ts"]
  });

  assert.equal(preview.template.id, "single/react-vite-ts-tailwind");
  assert.deepEqual(preview.matchedTokens.map((item) => item.token), ["react", "vite", "ts"]);
  assert.ok(preview.files.includes("package.json"));
  assert.doesNotThrow(() => JSON.stringify(preview));
});

test("serializeTemplateList returns JSON-safe template data", () => {
  const templates = discoverTemplates(templatesRoot);
  const serialized = serializeTemplateList(templates);

  assert.ok(serialized.templates.length > 0);
  assert.equal(serialized.templates[0].absolutePath, undefined);
  assert.equal(typeof serialized.templates[0].description, "string");
  assert.ok(serialized.templates[0].description.length > 0);
  assert.ok(Array.isArray(serialized.templates[0].tokens));
  assert.doesNotThrow(() => JSON.stringify(serialized));
});

test("discovered templates include useful descriptions", () => {
  const templates = discoverTemplates(templatesRoot);
  const template = templates.find(
    (item) => item.id === "single/react-vite-ts-tailwind"
  );

  assert.ok(template, "expected react vite ts template to be available");
  assert.match(template.description, /React/);
  assert.match(template.description, /Vite/);
  assert.match(template.description, /TypeScript/);
  assert.match(template.description, /Tailwind CSS/);
});

test("template info includes metadata and file details", () => {
  const templates = discoverTemplates(templatesRoot);
  const template = templates.find(
    (item) => item.id === "single/react-vite-ts-tailwind"
  );

  assert.ok(template, "expected react vite ts template to be available");

  const info = createTemplateInfo(template);
  const formatted = formatTemplateInfo(template);

  assert.equal(info.template.id, "single/react-vite-ts-tailwind");
  assert.equal(info.suggestedPackageManager, "npm");
  assert.ok(info.files.includes("package.json"));
  assert.match(formatted, /Suggested package manager: npm/);
  assert.match(formatted, /Files \(/);
  assert.doesNotThrow(() => JSON.stringify(info));
});

test("doctor report passes for the committed template catalog", () => {
  const report = createDoctorReport();
  const formatted = formatDoctorReport(report);

  assert.equal(report.ok, true, formatted);
  assert.match(formatted, /starter-structure-cli doctor/);
  assert.match(formatted, /Doctor passed/);
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

test("cli scaffolds a project and replaces app name placeholders", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "starter-structure-cli-scaffold-"));
  const projectName = "scaffold-smoke-app";
  const targetDir = path.join(tempDir, projectName);
  const command = process.execPath;

  try {
    const result = spawnSync(
      command,
      [
        cliPath,
        projectName,
        "--template",
        "single/react-vite-ts-tailwind",
        "--no-install"
      ],
      {
        cwd: tempDir,
        encoding: "utf8"
      }
    );

    const combinedOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

    assert.equal(result.status, 0, combinedOutput);
    assert.ok(fs.existsSync(path.join(targetDir, "package.json")));
    assert.ok(fs.existsSync(path.join(targetDir, "README.md")));
    assert.ok(fs.existsSync(path.join(targetDir, "src", "main.tsx")));

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(targetDir, "package.json"), "utf8")
    );
    const readme = fs.readFileSync(path.join(targetDir, "README.md"), "utf8");
    const textFiles = collectTextFiles(targetDir);
    const filesWithPlaceholders = textFiles.filter((filePath) =>
      fs.readFileSync(filePath, "utf8").includes("__APP_NAME__")
    );

    assert.equal(packageJson.name, projectName);
    assert.match(readme, new RegExp(`# ${projectName}`));
    assert.deepEqual(filesWithPlaceholders, []);
    assert.match(combinedOutput, /Created scaffold-smoke-app/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
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
