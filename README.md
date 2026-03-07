# starter-structure-cli

Scaffold starter projects from your own stack-based template folders.

Right now the package ships with these backend templates:

- `backend-only/express-mongoose-jwt`
- `backend-only/express-prisma-mysql-jwt`
- `backend-only/express-prisma-mysql-jwt-ts`

The CLI discovers templates from the local `templates/` directory, so you can keep adding new starters by folder name instead of hardcoding each option.

## Current template

```text
templates/
  backend-only/
    express-mongoose-jwt/
```

This template generates an Express API starter with:

- MongoDB with Mongoose
- JWT authentication
- User register/login flow
- Auth middleware
- Basic controller, route, model, middleware, and utils structure

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

## Publish checks

Before publishing, verify:

```bash
npm.cmd install
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

Add new templates under `templates/<category>/<template-name>`.

Example:

```text
templates/
  fullstack/
    react-vite-ts-tailwind-express-prisma-mysql/
  single/
    react-vite-tailwind/
    react-vite-ts-tailwind/
  monorepo-client-server/
    nextjs-express-prisma/
```

Folder names become searchable stack tokens, so names like `react-vite-ts-tailwind-express-prisma-mysql` can be matched by queries such as:

```bash
npx starter-structure-cli my-app react vite ts tailwind express prisma mysql
```

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
