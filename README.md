# starter-structure-cli

Scaffold starter projects from your own stack-based template folders.

The package now ships templates across these categories:

- `backend-only/*`
- `frontend-only/*`
- `single/*`
- `fullstack/*`
- `monorepo-client-server/*`
- `monorepo-turbo-pnpm/*`

The CLI scaffolds from the local `templates/` directory at runtime.

In this repo, `templates/` is generated output and should not be edited by hand. The source of truth lives in `template-sources/`, and `build:templates` composes the final publishable templates from shared bases, layers, and presets.

## Current templates

```text
templates/
  backend-only/
  frontend-only/
  fullstack/
  monorepo-client-server/
  monorepo-turbo-pnpm/
  single/
```

The catalog currently includes authored starter files for:

- `backend-only/express-mongoose-jwt`
- `backend-only/express-prisma-mysql-jwt`
- `backend-only/express-prisma-mysql-jwt-ts`
- `single/nextjs-tailwind`
- `single/nextjs-ts-tailwind`
- `single/react-vite-tailwind`
- `single/react-vite-ts-tailwind`
- `single/react-vite-shadcn-tailwind`
- `single/react-vite-ts-shadcn-tailwind`
- `single/react-vite-tailwind-landing`
- `single/react-vite-ts-tailwind-landing`
- `single/vue-vite-tailwind`
- `single/vue-vite-ts-tailwind`
- `frontend-only/react-admin-dashboard`
- `fullstack/nextjs-tailwind-mongoose-mongodb`
- `fullstack/nextjs-tailwind-nextauth-prisma`
- `fullstack/nextjs-tailwind-prisma-mysql`
- `fullstack/nextjs-tailwind-prisma-postgres`
- `fullstack/react-vite-ts-tailwind-express-mongoose`
- `fullstack/react-vite-ts-tailwind-express-prisma-mysql`
- `fullstack/react-vite-ts-tailwind-express-prisma-postgres`
- `fullstack/react-vite-ts-tailwind-express-sequelize-mysql`
- `fullstack/vue-vite-ts-tailwind-express-mongoose`
- `fullstack/vue-vite-ts-tailwind-express-prisma-mysql`
- `monorepo-client-server/nextjs-express-prisma`
- `monorepo-client-server/react-vite-ts-express-mongoose`
- `monorepo-client-server/react-vite-ts-express-prisma`
- `monorepo-client-server/vue-vite-ts-express-mongoose`
- `monorepo-turbo-pnpm/nextjs-api-express-prisma`
- `monorepo-turbo-pnpm/nextjs-api-nestjs-prisma`
- `monorepo-turbo-pnpm/react-vite-api-express-mongoose`

## Usage

Interactive:

```bash
npx starter-structure-cli my-app
```

Direct selection by template:

```bash
npx starter-structure-cli my-api --template backend-only/express-mongoose-jwt
```

Direct stack query:

```bash
npx starter-structure-cli my-api express mongoose jwt
```

If both JavaScript and TypeScript variants exist for the same stack, the CLI defaults to TypeScript unless you explicitly pass `--language js`.

List available templates:

```bash
npx starter-structure-cli --list
```

## Placeholder replacement

The generator replaces `__APP_NAME__` in copied file contents and file or folder names.

## Local development

```bash
npm install
node ./scripts/check-templates.js
node ./bin/starter-structure-cli.js --list
```

`check-templates` and the local CLI can regenerate `templates/` automatically when the generated output is missing or stale.

## Publish checks

Before publishing, verify:

```bash
npm.cmd install
node .\scripts\build-templates.js
node .\scripts\check-templates.js
node .\bin\starter-structure-cli.js --list
npm.cmd pack --dry-run
```

`prepack` runs template validation automatically and blocks publish if a template directory has no files.

## Publish to npm

You can publish locally:

```bash
npm.cmd publish
```

Or publish from GitHub Actions using the workflow in `.github/workflows/publish.yml`.

For GitHub Actions publishing, add a repository secret named `NPM_TOKEN` and use a granular npm token that has:

- publish or write access
- `bypass 2FA` enabled

Without `bypass 2FA`, npm will fail in CI with `EOTP`.

For a step-by-step beginner note based on how this package was actually published, see `NPM_PUBLISH_NOTE.md`.

## Add more templates

Add or update template source files under `template-sources/`, then generate the publishable output into `templates/`.

Example:

```text
template-sources/
  bases/
  layers/
  presets/
```

Then run:

```bash
npm run build:templates
```

Generated folder names under `templates/` become searchable stack tokens, so names like `react-vite-ts-tailwind-express-prisma-mysql` can be matched by queries such as:

```bash
npx starter-structure-cli my-app react vite ts tailwind express prisma mysql
```

## Reusable template sources

To reduce duplication, shared template code can be composed from:

- a base
- one or more layers
- a preset that defines the final output path

Current examples:

```text
template-sources/
  bases/
    backend-only/
      express-prisma-mysql-jwt/
        shared/
      express-mongoose-jwt/
        shared/
    fullstack/
      react-vite-ts-tailwind-express-mongoose/
        shared/
      nextjs-tailwind-prisma-mysql/
        shared/
    monorepo-client-server/
      react-vite-ts-express-mongoose/
        shared/
    monorepo-turbo-pnpm/
      react-vite-api-express-mongoose/
        shared/
    single/
      react-vite/
        shared/
      nextjs-tailwind/
        shared/
  layers/
    backend-only/
      express-prisma-mysql-jwt/
        javascript/
        typescript/
    frontend-only/
      react-admin-dashboard/
        javascript/
    single/
      nextjs-tailwind/
        javascript/
        typescript/
      react-vite-tailwind/
        shared/
        javascript/
        typescript/
      react-vite-shadcn-tailwind/
        shared/
        javascript/
        typescript/
  presets/
    backend-only/
      express-mongoose-jwt.json
      express-prisma-mysql-jwt.json
      express-prisma-mysql-jwt-ts.json
    frontend-only/
      react-admin-dashboard.json
    fullstack/
      *.json
    monorepo-client-server/
      *.json
    monorepo-turbo-pnpm/
      *.json
    single/
      nextjs-tailwind.json
      nextjs-ts-tailwind.json
      react-vite-shadcn-tailwind.json
      react-vite-tailwind-landing.json
      react-vite-tailwind.json
      react-vite-ts-shadcn-tailwind.json
      react-vite-ts-tailwind-landing.json
      react-vite-ts-tailwind.json
      vue-vite-tailwind.json
      vue-vite-ts-tailwind.json
```

Generate the publishable templates with:

```bash
npm run build:templates
```

This keeps `template-sources/` as the only authored source while `templates/` stays a generated scaffold output.

`prepack` runs `build:templates` before validation, so npm publish always packages the latest generated templates.

## Reusable components in source templates

You can keep small reusable blocks under `template-sources/components/` and include them inside text files from any base or layer.

Example:

```text
template-sources/
  components/
    readme/
      getting-started-vite.md
    styles/
      base-ui.css
```

Then call them inside a source file:

```text
{{ include: components/readme/getting-started-vite.md }}
```

You can also include relative files:

```text
{{ include: ./shared-snippet.md }}
```

This works for text files such as `.md`, `.css`, `.js`, `.ts`, `.json`, `.html`, and similar template source files.

## JavaScript and TypeScript variants

If you want both JavaScript and TypeScript versions of the same template, keep both folders for the same stack.

Example for `single/`:

```text
templates/
  single/
    nextjs-tailwind/
    nextjs-ts-tailwind/
    nextjs-tailwind-landing-seo/
    nextjs-ts-tailwind-landing-seo/
    react-vite-shadcn-tailwind/
    react-vite-ts-shadcn-tailwind/
    react-vite-tailwind/
    react-vite-ts-tailwind/
    react-vite-tailwind-landing/
    react-vite-ts-tailwind-landing/
    vue-vite-tailwind/
    vue-vite-ts-tailwind/
```

Rules:

- TypeScript templates should include `ts` in the folder name
- JavaScript templates can omit `ts`, or include `js` if you want to be explicit
- if both variants match the same stack, the CLI defaults to TypeScript
- users can force JavaScript with `--language js`
- users can force TypeScript with `--language ts`

Examples:

```bash
npx starter-structure-cli my-app react vite tailwind
npx starter-structure-cli my-app react vite tailwind --language js
npx starter-structure-cli my-app react vite tailwind --language ts
```
