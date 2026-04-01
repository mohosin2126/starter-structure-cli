import { readFile } from "node:fs/promises";

const rootPackagePath = new URL("../package.json", import.meta.url);
const createPackagePath = new URL(
  "../packages/create-starter-structure-cli/package.json",
  import.meta.url,
);

async function readPackageJson(fileUrl) {
  return JSON.parse(await readFile(fileUrl, "utf8"));
}

async function main() {
  const rootPackage = await readPackageJson(rootPackagePath);
  const createPackage = await readPackageJson(createPackagePath);
  const dependencyVersion = createPackage.dependencies?.["starter-structure-cli"];
  const issues = [];

  if (createPackage.version !== rootPackage.version) {
    issues.push(
      `create package version ${createPackage.version} does not match root version ${rootPackage.version}.`,
    );
  }

  if (dependencyVersion !== rootPackage.version) {
    issues.push(
      `create package dependency starter-structure-cli@${dependencyVersion ?? "missing"} does not match ${rootPackage.version}.`,
    );
  }

  if (issues.length > 0) {
    console.error("Create package validation failed.");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    `Create package validation passed: create-starter-structure-cli@${createPackage.version} -> starter-structure-cli@${dependencyVersion}.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
