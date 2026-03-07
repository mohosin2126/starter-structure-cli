import { buildTemplates } from "../lib/template-builder.js";

const builtTargets = buildTemplates();

if (builtTargets.length === 0) {
  console.log("No template presets found.");
  process.exit(0);
}

console.log(`Built ${builtTargets.length} template presets.`);
for (const target of builtTargets) {
  console.log(`- ${target}`);
}
