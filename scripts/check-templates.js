import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesRoot = path.resolve(__dirname, "..", "templates");

function hasAnyFile(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
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

function getTemplateDirs(rootDir) {
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

const emptyTemplates = getTemplateDirs(templatesRoot)
  .filter((templateDir) => !hasAnyFile(templateDir))
  .map((templateDir) => path.relative(templatesRoot, templateDir));

if (emptyTemplates.length > 0) {
  console.error("Template validation failed.");
  console.error("These template directories do not contain any files:");
  for (const templateDir of emptyTemplates) {
    console.error(`- ${templateDir}`);
  }
  console.error("");
  console.error("Add the real starter files before publishing.");
  console.error("If a template intentionally contains only empty folders, add a .gitkeep file.");
  process.exit(1);
}

console.log(`Template validation passed for ${getTemplateDirs(templatesRoot).length} templates.`);
