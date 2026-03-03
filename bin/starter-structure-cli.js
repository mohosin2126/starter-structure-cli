#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileSafe(filePath, content) {
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, content, "utf8");
  return true;
}

function isEmptyDir(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

const args = process.argv.slice(2);
const targetName = args[0] || "demo-project";
const targetDir = path.resolve(process.cwd(), targetName);

if (fs.existsSync(targetDir) && !isEmptyDir(targetDir)) {
  console.error(`❌ Target folder is not empty: ${targetDir}`);
  process.exit(1);
}

mkdirp(targetDir);
mkdirp(path.join(targetDir, "src"));
mkdirp(path.join(targetDir, "demo"));

const projectPkg = {
  name: targetName,
  version: "0.1.0",
  private: true,
  type: "module",
  scripts: {
    start: "node demo/demo.js"
  }
};

writeFileSafe(
  path.join(targetDir, "package.json"),
  JSON.stringify(projectPkg, null, 2) + "\n"
);

writeFileSafe(
  path.join(targetDir, "src", "index.js"),
  `export function greet(name = "world") {
  return \`Hello, \${name}!\`;
}
`
);

writeFileSafe(
  path.join(targetDir, "demo", "demo.js"),
  `import { greet } from "../src/index.js";

console.log(greet("demo"));
`
);

writeFileSafe(
  path.join(targetDir, "README.md"),
  `# ${targetName}

## Run demo
\`\`\`bash
npm install
npm run start
\`\`\`
`
);

console.log(`✅ Created project at: ${targetDir}`);
console.log(`Next:`);
console.log(`  cd ${targetName}`);
console.log(`  npm install`);
console.log(`  npm run start`);