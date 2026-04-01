import https from "node:https";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

function fetchRegistryVersion(packageName, version) {
  const encodedName = packageName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const url = `https://registry.npmjs.org/${encodedName}/${encodeURIComponent(version)}`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const chunks = [];

        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");

          if (response.statusCode === 404) {
            resolve({ exists: false });
            return;
          }

          if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
            resolve({ exists: true, body });
            return;
          }

          reject(
            new Error(
              `Failed to query npm registry for ${packageName}@${version} (status ${response.statusCode ?? "unknown"}).`,
            ),
          );
        });
      })
      .on("error", reject);
  });
}

async function main() {
  const defaultPackageJsonPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../package.json",
  );
  const packageJsonPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : defaultPackageJsonPath;
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  const { name, version } = packageJson;

  const result = await fetchRegistryVersion(name, version);

  if (result.exists) {
    console.error(`Publish blocked: ${name}@${version} is already published on npm.`);
    console.error("Bump package.json version before retrying the publish workflow.");
    process.exit(1);
  }

  console.log(`Publish check passed: ${name}@${version} is not present on npm.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
