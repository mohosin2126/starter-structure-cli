# starter-structure-cli

CLI for scaffolding starter projects from stack-based templates.

It lets you generate projects by template name or by natural stack combinations such as `react vite ts tailwind express prisma mysql`.

## What It Generates

The package currently ships templates in these categories:

- `backend-only`
- `frontend-only`
- `single`
- `fullstack`
- `monorepo-client-server`
- `monorepo-turbo-pnpm`

Generated templates come from [template-sources](./template-sources). The [templates](./templates) folder is build output and should not be edited by hand.

## Install And Run

Use it directly with `npx`:

```bash
npx starter-structure-cli my-app
```

Or install it globally:

```bash
npm install -g starter-structure-cli
starter-structure-cli my-app
```

## Quick Start

Interactive mode:

```bash
npx starter-structure-cli my-app
```

Exact template:

```bash
npx starter-structure-cli my-app --template fullstack/react-vite-ts-tailwind-express-prisma-mysql
```

Stack query:

```bash
npx starter-structure-cli my-app react vite ts tailwind express prisma mysql
```

Natural language style query:

```bash
npx starter-structure-cli my-app reactjs tailwind css nodejs prisma mysql
```

List all templates:

```bash
npx starter-structure-cli --list
```

## How Template Matching Works

You can select templates in three ways:

1. Interactive prompts
2. Exact template path with `--template`
3. Stack tokens like `react vite ts tailwind`

The matcher also normalizes common aliases:

- `reactjs` -> `react`
- `vuejs` -> `vue`
- `next` -> `nextjs`
- `typescript` -> `ts`
- `javascript` -> `js`
- `tailwindcss` -> `tailwind`

It ignores filler words such as `css`, `app`, `project`, `template`, and `with`.

If both JavaScript and TypeScript variants exist for the same stack, the CLI prefers TypeScript unless you pass `--language js`.

## Common Commands

Choose category and features:

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

Skip prompts when the match is already clear:

```bash
npx starter-structure-cli my-app react vite ts tailwind -y
```

Install dependencies immediately:

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

## Current Template Catalog

```text
backend-only/
  express-mongoose-jwt
  express-prisma-mysql-jwt
  express-prisma-mysql-jwt-ts

frontend-only/
  react-admin-dashboard

single/
  nextjs-tailwind
  nextjs-ts-tailwind
  react-vite-tailwind
  react-vite-ts-tailwind
  react-vite-shadcn-tailwind
  react-vite-ts-shadcn-tailwind
  react-vite-tailwind-landing
  react-vite-ts-tailwind-landing
  vue-vite-tailwind
  vue-vite-ts-tailwind

fullstack/
  nextjs-tailwind-mongoose-mongodb
  nextjs-tailwind-nextauth-prisma
  nextjs-tailwind-prisma-mysql
  nextjs-tailwind-prisma-postgres
  react-vite-ts-tailwind-express-mongoose
  react-vite-ts-tailwind-express-prisma-mysql
  react-vite-ts-tailwind-express-prisma-postgres
  react-vite-ts-tailwind-express-sequelize-mysql
  vue-vite-ts-tailwind-express-mongoose
  vue-vite-ts-tailwind-express-prisma-mysql

monorepo-client-server/
  nextjs-express-prisma
  react-vite-ts-express-mongoose
  react-vite-ts-express-prisma
  vue-vite-ts-express-mongoose

monorepo-turbo-pnpm/
  nextjs-api-express-prisma
  nextjs-api-nestjs-prisma
  react-vite-api-express-mongoose
```

## Generated Project Structure

Depending on the chosen template, generated projects may look like:

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

Many templates now include deeper folder scaffolding with starter `index.tsx` files for modules such as components, routes, views, hooks, services, controllers, and data folders.

## Placeholder Replacement

During generation the CLI replaces `__APP_NAME__` inside:

- file contents
- file names
- folder names

## For Template Authors

Source of truth:

```text
template-sources/
  bases/
  layers/
  presets/
  components/
```

Build output:

```text
templates/
```

Workflow:

1. Edit files in `template-sources/`
2. Generate architecture stubs if needed
3. Build templates
4. Validate templates

Commands:

```bash
npm install
npm run build:architecture-stubs
npm run build:templates
npm run check:templates
node ./bin/starter-structure-cli.js --list
```

## Reusable Source System

Templates are composed from:

- `bases`: shared starter files
- `layers`: stack-specific or architecture-specific additions
- `presets`: mapping files that define final output paths

This keeps authored files small and lets multiple templates share the same structure blocks.

## Includes In Text Files

Text files in `template-sources/` can include reusable snippets:

```text
{{ include: components/readme/getting-started-vite.md }}
```

Relative includes also work:

```text
{{ include: ./shared-snippet.md }}
```

## Publishing

Before publishing:

```bash
npm install
npm run build:architecture-stubs
npm run build:templates
npm run check:templates
node ./bin/starter-structure-cli.js --list
npm pack --dry-run
```

Publish locally:

```bash
npm publish
```

For GitHub Actions publishing, configure `NPM_TOKEN` and make sure the token allows publish access.

## How To Check Usage

Important: npm does not give you true unique user counts. What you can measure reliably is download count.

Ways to check usage:

1. Open the npm package page and look at weekly downloads.
2. Run the local download stats script:

```bash
npm run stats:downloads
```

You can also check another package name:

```bash
node ./scripts/check-package-usage.js starter-structure-cli
```

The script prints:

- last week downloads
- last month downloads
- package page URL

If you want deeper analytics beyond downloads, use:

- GitHub traffic for repo clones and views
- a custom API or telemetry endpoint in the CLI
- issue counts, stars, and dependent repos as secondary signals

## Notes About User Counting

Download count is not the same as:

- unique developers
- unique companies
- active projects
- repeat usage

One developer can download many times, and CI pipelines can also increase the count.

## Development Notes

- Node.js `18+` is required
- `templates/` is generated output
- avoid editing generated templates directly
- use `npm run build:templates` after changing presets, bases, or layers

## License

MIT
