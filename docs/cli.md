# CLI Guide

`starter-structure-cli` helps you scaffold starter projects from stack combinations, template slugs, or interactive prompts.

## Core Usage

Interactive mode:

```bash
npx starter-structure-cli my-app
```

Exact template:

```bash
npx starter-structure-cli my-app --template fullstack/react-vite-ts-tailwind-express-prisma-mysql
```

Stack tokens:

```bash
npx starter-structure-cli my-app react vite ts tailwind express prisma mysql
```

Structured filters:

```bash
npx starter-structure-cli my-app --category fullstack --frontend react --backend express --orm prisma --database mysql
```

List templates:

```bash
npx starter-structure-cli --list
```

## Matching Rules

The CLI can resolve a starter in three main ways:

1. interactive prompts
2. exact template selection with `--template`
3. stack matching from freeform tokens or explicit filters

Common aliases are normalized automatically:

- `reactjs` -> `react`
- `vuejs` -> `vue`
- `next` -> `nextjs`
- `typescript` -> `ts`
- `javascript` -> `js`
- `tailwindcss` -> `tailwind`

Filler words like `project`, `template`, `starter`, `app`, and `with` are ignored during stack matching.

If both JavaScript and TypeScript variants match the same stack, TypeScript is preferred unless you pass `--language js`.

## Options

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

## Category Notes

Input categories accepted by the CLI:

- `fullstack`
- `frontend-only`
- `single`
- `backend-only`
- `monorepo`
- `turbo`

Generated template folders are organized under these output categories:

- `backend-only`
- `frontend-only`
- `fullstack`
- `monorepo-client-server`
- `monorepo-turbo-pnpm`
- `single`

## Install Behavior

If you omit `--install` and `--no-install`, the CLI asks whether dependencies should be installed after scaffolding.

Suggested package manager defaults:

- `pnpm` for Turbo-style templates
- `npm` for everything else
