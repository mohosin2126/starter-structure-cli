# starter-structure-cli

Generate starter projects from stack combinations like `react vite ts tailwind express prisma mysql`.

The CLI supports direct template selection, interactive prompts, and natural stack queries. It ships with frontend, backend, fullstack, and monorepo starter templates.

## Install

Run with `npx`:

```bash
npx starter-structure-cli my-app
```

Or install globally:

```bash
npm install -g starter-structure-cli
starter-structure-cli my-app
```

## Quick Start

Interactive mode:

```bash
npx starter-structure-cli my-app
```

Use an exact template:

```bash
npx starter-structure-cli my-app --template fullstack/react-vite-ts-tailwind-express-prisma-mysql
```

Use stack tokens:

```bash
npx starter-structure-cli my-app react vite ts tailwind express prisma mysql
```

Use natural stack words:

```bash
npx starter-structure-cli my-app reactjs tailwind css nodejs prisma mysql
```

List templates:

```bash
npx starter-structure-cli --list
```

## How Matching Works

You can select a starter in three ways:

1. interactive prompts
2. exact template path with `--template`
3. stack tokens like `react vite ts tailwind`

Common aliases are normalized automatically:

- `reactjs` -> `react`
- `vuejs` -> `vue`
- `next` -> `nextjs`
- `typescript` -> `ts`
- `javascript` -> `js`
- `tailwindcss` -> `tailwind`
- `nodejs` -> `node`

The matcher also ignores filler words like `css`, `project`, `template`, `app`, and `with`.

If both JavaScript and TypeScript variants exist, TypeScript is preferred unless you pass `--language js`.

## Common Commands

Choose by category and stack:

```bash
npx starter-structure-cli my-app --category fullstack --frontend react --backend express --orm prisma --database mysql
```

Force JavaScript:

```bash
npx starter-structure-cli my-app react vite tailwind --language js
```

Force TypeScript:

```bash
npx starter-structure-cli my-app react vite tailwind --language ts
```

Skip prompts when the match is clear:

```bash
npx starter-structure-cli my-app react vite ts tailwind -y
```

Install dependencies after generation:

```bash
npx starter-structure-cli my-app react vite ts tailwind --install
```

## CLI Options

```text
-h, --help
--list
-y, --yes
--install
--no-install
-p, --package-manager npm | pnpm | yarn
-c, --category fullstack | frontend-only | single | backend-only | monorepo | turbo
-t, --template <category/slug>
--stack, --combo "<tokens>"
--frontend react | nextjs | vue
--backend express | nestjs | fastify
--styling tailwind | shadcn
--orm prisma | mongoose | sequelize
--database mongodb | mysql | postgres
--auth jwt | nextauth
--language ts | js
```

## Template Categories

```text
backend-only
frontend-only
single
fullstack
monorepo-client-server
monorepo-turbo-pnpm
```

Examples of shipped templates:

```text
backend-only/express-mongoose-jwt
single/react-vite-ts-tailwind
fullstack/react-vite-ts-tailwind-express-prisma-mysql
fullstack/vue-vite-ts-tailwind-express-mongoose
monorepo-client-server/nextjs-express-prisma
monorepo-turbo-pnpm/react-vite-api-express-mongoose
```

## Generated Project Shapes

Fullstack:

```text
my-app/
  client/
  server/
```

Client/server monorepo:

```text
my-app/
  apps/
    client/
    server/
```

Turbo monorepo:

```text
my-app/
  apps/
    web/
    api/
```

Many templates include deeper starter structure for components, routes, views, hooks, services, controllers, and data modules.

## Placeholder Replacement

During generation the CLI replaces `__APP_NAME__` inside:

- file names
- folder names
- text file contents

## For Template Authors

Source folders:

```text
template-sources/
  bases/
  layers/
  presets/
  components/
```

Generated output:

```text
templates/
```

Author workflow:

```bash
npm install
npm run build:architecture-stubs
npm run build:templates
npm run check:templates
node ./bin/starter-structure-cli.js --list
```

Reusable include syntax in text files:

```text
{{ include: components/readme/getting-started-vite.md }}
{{ include: ./shared-snippet.md }}
```

## Publish

Before publishing:

```bash
npm install
npm run build:architecture-stubs
npm run build:templates
npm run check:templates
npm run check:publish-version
npm pack --dry-run
```

Publish from a new version only. If a version already exists on npm, update `package.json` first.

GitHub Actions publishing also requires a valid `NPM_TOKEN`.

## Usage Stats

npm does not provide unique user counts. What you can check reliably is download count.

Local command:

```bash
npm run stats:downloads
```

Direct script:

```bash
node ./scripts/check-package-usage.js starter-structure-cli
```

## Links

- GitHub: [https://github.com/mohosin2126/starter-structure-cli](https://github.com/mohosin2126/starter-structure-cli)
- Issues: [https://github.com/mohosin2126/starter-structure-cli/issues](https://github.com/mohosin2126/starter-structure-cli/issues)

## License

MIT
