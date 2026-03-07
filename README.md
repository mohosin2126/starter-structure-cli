# starter-structure-cli

Scaffold your own starter templates from a stack combination such as `react vite ts tailwind express prisma mysql`, `nextjs tailwind mongoose mongodb`, or `vue vite ts tailwind express mongoose`.

The CLI discovers templates directly from your local `templates/` folder, so you only maintain the template code once. Naming the template folder with stack tokens is enough for the generator to match it.

## Template layout

Put each starter inside:

```text
templates/
  fullstack/
    react-vite-ts-tailwind-express-prisma-mysql/
    react-vite-ts-tailwind-express-sequelize-mysql/
    nextjs-tailwind-mongoose-mongodb/
  single/
    react-vite-ts-tailwind/
    vue-vite-ts-tailwind/
  backend-only/
    express-mongoose-jwt/
  monorepo-client-server/
    react-vite-ts-express-mongoose/
  monorepo-turbo-pnpm/
    nextjs-api-express-prisma/
```

Your folder names become the searchable stack tokens.

## Usage

Interactive:

```bash
npx starter-structure-cli my-app
```

Direct stack query:

```bash
npx starter-structure-cli my-pos react vite ts tailwind express sequelize mysql
```

With explicit flags:

```bash
npx starter-structure-cli my-saas --category fullstack --frontend react --backend express --orm prisma --database mysql --styling tailwind
```

Exact template:

```bash
npx starter-structure-cli my-gym --template fullstack/react-vite-ts-tailwind-express-sequelize-mysql
```

List discovered templates:

```bash
npx starter-structure-cli --list
```

## Supported filters

- `--category`: `fullstack`, `frontend-only`, `single`, `backend-only`, `monorepo`, `turbo`
- `--frontend`: `react`, `nextjs`, `vue`
- `--backend`: `express`, `nestjs`, `fastify`
- `--styling`: `tailwind`, `shadcn`
- `--orm`: `prisma`, `mongoose`, `sequelize`
- `--database`: `mongodb`, `mysql`, `postgres`
- `--auth`: `jwt`, `nextauth`
- `--language`: `ts`, `js`

## Placeholder replacement

The CLI replaces `__APP_NAME__` in copied file contents and file/folder names.

## Publish to npm

```bash
npm install
npm publish
```

`prepack` validates that every template directory contains at least one file. This prevents publishing a package that ships no starter templates.

## Development

```bash
npm install
node ./scripts/check-templates.js
node ./bin/starter-structure-cli.js --list
```
