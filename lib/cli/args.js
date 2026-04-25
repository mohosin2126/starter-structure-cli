import { ARG_TO_FILTER_TOKEN } from "./constants.js";
import { tokenize } from "./matching.js";

const FLAGS_WITH_VALUES = new Set([
  "--name",
  "--project-name",
  "--output",
  "-o",
  "--template",
  "-t",
  "--category",
  "-c",
  "--stack",
  "--combo",
  "--package-manager",
  "-p",
  "--frontend",
  "--backend",
  "--styling",
  "--orm",
  "--database",
  "--auth",
  "--language"
]);

export function parseArgs(argv) {
  const args = {
    help: false,
    list: false,
    doctor: false,
    dryRun: false,
    explain: false,
    json: false,
    yes: false,
    install: undefined,
    packageManager: undefined,
    projectName: undefined,
    outputDir: undefined,
    templateRef: undefined,
    category: undefined,
    comboTokens: [],
    positionals: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (current === "create" || current === "new") {
      continue;
    }

    if (current === "-h" || current === "--help") {
      args.help = true;
      continue;
    }

    if (current === "--list") {
      args.list = true;
      continue;
    }

    if (current === "--doctor") {
      args.doctor = true;
      continue;
    }

    if (current === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (current === "--explain") {
      args.explain = true;
      continue;
    }

    if (current === "--json") {
      args.json = true;
      continue;
    }

    if (current === "-y" || current === "--yes") {
      args.yes = true;
      continue;
    }

    if (current === "--install") {
      args.install = true;
      continue;
    }

    if (current === "--no-install") {
      args.install = false;
      continue;
    }

    const [flag, inlineValue] = current.split("=", 2);
    const takesValue = FLAGS_WITH_VALUES.has(flag);

    if (!takesValue) {
      if (current.startsWith("-")) {
        throw new Error(`Unknown option: ${flag}`);
      }

      args.positionals.push(current);
      continue;
    }

    const value = inlineValue ?? argv[index + 1];
    if (!inlineValue) {
      index += 1;
    }

    if (!value) {
      throw new Error(`Missing value for ${flag}`);
    }

    if (flag === "--name" || flag === "--project-name") {
      args.projectName = value;
      continue;
    }

    if (flag === "--output" || flag === "-o") {
      args.outputDir = value;
      continue;
    }

    if (flag === "--template" || flag === "-t") {
      args.templateRef = value;
      continue;
    }

    if (flag === "--category" || flag === "-c") {
      args.category = value;
      continue;
    }

    if (flag === "--stack" || flag === "--combo") {
      args.comboTokens.push(...tokenize(value));
      continue;
    }

    if (flag === "--package-manager" || flag === "-p") {
      args.packageManager = value.toLowerCase();
      continue;
    }

    if (ARG_TO_FILTER_TOKEN[flag]) {
      args.comboTokens.push(...tokenize(value));
    }
  }

  if (!args.projectName && args.positionals.length > 0) {
    args.projectName = args.positionals[0];
    args.comboTokens.push(...args.positionals.slice(1).flatMap(tokenize));
  }

  return args;
}

export function printHelp() {
  console.log(`
starter-structure-cli

Usage:
  npx starter-structure-cli <project-name>
  npx starter-structure-cli <project-name> react vite ts tailwind express prisma mysql
  npx starter-structure-cli <project-name> --output ./apps/<project-name>
  npx starter-structure-cli <project-name> --category fullstack --frontend react --backend express --orm prisma --database mysql
  npx starter-structure-cli <project-name> --template fullstack/react-vite-ts-tailwind-express-prisma-mysql
  npx starter-structure-cli <project-name> react vite ts --dry-run --explain
  npx starter-structure-cli <project-name> react vite ts --dry-run --json
  npx starter-structure-cli --list
  npx starter-structure-cli --list --json
  npx starter-structure-cli --doctor
  npx starter-structure-cli --doctor --json

Options:
  -h, --help                 Show help
  --list                     List discovered templates
  --doctor                   Check template, package, and publish readiness
  --dry-run                  Preview the selected template without creating files
  --explain                  Show why the selected template matched
  --json                     Print JSON for --list, --doctor, or --dry-run
  -o, --output               Directory to create instead of ./<project-name>
  -y, --yes                  Skip optional prompts when selection is already unambiguous
  --install                  Run package manager install after scaffold
  --no-install               Do not install dependencies
  -p, --package-manager      npm | pnpm | yarn | bun
  -c, --category             fullstack | frontend-only | single | backend-only | monorepo | turbo
  -t, --template             Exact template slug or category/slug
  --stack, --combo           Freeform stack query, e.g. "nextjs tailwind prisma mysql"
  --frontend                 react | nextjs | vue
  --backend                  express | nestjs | fastify
  --styling                  tailwind | shadcn
  --orm                      prisma | mongoose | sequelize
  --database                 mongodb | mysql | postgres
  --auth                     jwt | nextauth
  --language                 ts | js
`.trim());
}
