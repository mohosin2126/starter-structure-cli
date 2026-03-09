# Templates

This repository publishes ready-to-generate starters under `templates/`.

## Categories

```text
backend-only
frontend-only
fullstack
monorepo-client-server
monorepo-turbo-pnpm
single
```

## Example Templates

Examples of shipped template slugs:

```text
backend-only/express-mongoose-jwt
backend-only/express-prisma-mysql-jwt
frontend-only/react-admin-dashboard
fullstack/react-vite-ts-tailwind-express-prisma-mysql
fullstack/vue-vite-ts-tailwind-express-mongoose
monorepo-client-server/nextjs-express-prisma
monorepo-client-server/react-vite-ts-express-prisma
monorepo-turbo-pnpm/nextjs-api-express-prisma
monorepo-turbo-pnpm/react-vite-api-express-mongoose
single/react-vite-ts-tailwind
single/nextjs-ts-tailwind
```

## Generated Project Shapes

Fullstack templates:

```text
my-app/
  client/
  server/
```

Client/server monorepos:

```text
my-app/
  apps/
    client/
    server/
```

Turbo monorepos:

```text
my-app/
  apps/
    web/
    api/
```

Single-app and backend-only templates keep a single project root.

## Template Discovery

The CLI discovers templates by walking the generated `templates/` directory.

Use:

```bash
npx starter-structure-cli --list
```

to see the currently available output set.
