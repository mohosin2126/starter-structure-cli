import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const packageJsonPath = path.resolve("package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const packageName = process.argv[2] ?? packageJson.name;

function requestJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          if (response.statusCode && response.statusCode >= 400) {
            reject(new Error(String(response.statusCode)));
            return;
          }

          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchDownloads(range) {
  const endpoint = `https://api.npmjs.org/downloads/point/${range}/${encodeURIComponent(packageName)}`;
  return requestJson(endpoint);
}

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

async function main() {
  let lastWeek;
  let lastMonth;

  try {
    [lastWeek, lastMonth] = await Promise.all([
      fetchDownloads("last-week"),
      fetchDownloads("last-month")
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === "404") {
      console.log(`Package: ${packageName}`);
      console.log("This package was not found in the npm downloads API.");
      console.log("Most likely reasons:");
      console.log("- it has not been published yet");
      console.log("- the package name is different on npm");
      console.log("");
      console.log(`Check manually: https://www.npmjs.com/package/${packageName}`);
      return;
    }

    throw error;
  }

  console.log(`Package: ${packageName}`);
  console.log(`Last week downloads : ${formatCount(lastWeek.downloads)}`);
  console.log(`Last month downloads: ${formatCount(lastMonth.downloads)}`);
  console.log(`Package page        : https://www.npmjs.com/package/${packageName}`);
  console.log("");
  console.log("Note: npm exposes download counts, not unique user counts.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
