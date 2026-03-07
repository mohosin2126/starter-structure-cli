import { ensureTemplatesReady, validateTemplates } from "../lib/template-builder.js";

ensureTemplatesReady();

const { templateDirs, emptyTemplates } = validateTemplates();

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

console.log(`Template validation passed for ${templateDirs.length} templates.`);
