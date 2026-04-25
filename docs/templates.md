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

## Template Catalog

| Category | Template | Best for |
| --- | --- | --- |
| Backend only | `backend-only/express-mongoose-jwt` | Express API with MongoDB, Mongoose, and JWT auth. |
| Backend only | `backend-only/express-prisma-mysql-jwt` | Express API with Prisma, MySQL, and JWT auth. |
| Backend only | `backend-only/express-prisma-mysql-jwt-ts` | TypeScript Express API with Prisma, MySQL, and JWT auth. |
| Backend only | `backend-only/fastify-prisma-postgres` | Fastify API with Prisma and PostgreSQL. |
| Backend only | `backend-only/fastify-prisma-postgres-ts` | TypeScript Fastify API with Prisma and PostgreSQL. |
| Frontend only | `frontend-only/react-admin-dashboard` | React admin/dashboard interface starter. |
| Fullstack | `fullstack/nextjs-tailwind-mongoose-mongodb` | Next.js + Tailwind app with MongoDB and Mongoose. |
| Fullstack | `fullstack/nextjs-tailwind-nextauth-prisma` | Next.js + Tailwind app with Prisma and NextAuth. |
| Fullstack | `fullstack/nextjs-tailwind-prisma-mysql` | Next.js + Tailwind app with Prisma and MySQL. |
| Fullstack | `fullstack/nextjs-tailwind-prisma-postgres` | Next.js + Tailwind app with Prisma and PostgreSQL. |
| Fullstack | `fullstack/react-vite-ts-shadcn-express-prisma-postgres` | React/Vite TypeScript client with shadcn/ui, Express, Prisma, and PostgreSQL. |
| Fullstack | `fullstack/react-vite-ts-tailwind-express-mongoose` | React/Vite TypeScript client with Tailwind, Express, MongoDB, and Mongoose. |
| Fullstack | `fullstack/react-vite-ts-tailwind-express-prisma-mysql` | React/Vite TypeScript client with Tailwind, Express, Prisma, and MySQL. |
| Fullstack | `fullstack/react-vite-ts-tailwind-express-prisma-postgres` | React/Vite TypeScript client with Tailwind, Express, Prisma, and PostgreSQL. |
| Fullstack | `fullstack/react-vite-ts-tailwind-express-sequelize-mysql` | React/Vite TypeScript client with Tailwind, Express, Sequelize, and MySQL. |
| Fullstack | `fullstack/vue-vite-ts-tailwind-express-mongoose` | Vue/Vite TypeScript client with Tailwind, Express, MongoDB, and Mongoose. |
| Fullstack | `fullstack/vue-vite-ts-tailwind-express-prisma-mysql` | Vue/Vite TypeScript client with Tailwind, Express, Prisma, and MySQL. |
| Fullstack | `fullstack/vue-vite-ts-tailwind-express-prisma-postgres` | Vue/Vite TypeScript client with Tailwind, Express, Prisma, and PostgreSQL. |
| Monorepo client/server | `monorepo-client-server/nextjs-express-prisma` | Separate Next.js client and Express/Prisma server apps. |
| Monorepo client/server | `monorepo-client-server/react-vite-ts-express-mongoose` | Separate React/Vite client and Express/Mongoose server apps. |
| Monorepo client/server | `monorepo-client-server/react-vite-ts-express-prisma` | Separate React/Vite client and Express/Prisma server apps. |
| Monorepo client/server | `monorepo-client-server/vue-vite-ts-express-mongoose` | Separate Vue/Vite client and Express/Mongoose server apps. |
| Monorepo Turbo + pnpm | `monorepo-turbo-pnpm/nextjs-api-express-prisma` | Turborepo workspace with Next.js web app and Express/Prisma API. |
| Monorepo Turbo + pnpm | `monorepo-turbo-pnpm/nextjs-api-nestjs-prisma` | Turborepo workspace with Next.js web app and NestJS/Prisma API. |
| Monorepo Turbo + pnpm | `monorepo-turbo-pnpm/react-vite-api-express-mongoose` | Turborepo workspace with React/Vite web app and Express/Mongoose API. |
| Single app | `single/nextjs-tailwind` | JavaScript Next.js app with Tailwind CSS. |
| Single app | `single/nextjs-ts-shadcn-tailwind` | TypeScript Next.js app with shadcn/ui and Tailwind CSS. |
| Single app | `single/nextjs-ts-tailwind` | TypeScript Next.js app with Tailwind CSS. |
| Single app | `single/react-vite-shadcn-tailwind` | JavaScript React/Vite app with shadcn/ui and Tailwind CSS. |
| Single app | `single/react-vite-tailwind` | JavaScript React/Vite app with Tailwind CSS. |
| Single app | `single/react-vite-tailwind-landing` | JavaScript React/Vite landing page starter with Tailwind CSS. |
| Single app | `single/react-vite-ts-shadcn-tailwind` | TypeScript React/Vite app with shadcn/ui and Tailwind CSS. |
| Single app | `single/react-vite-ts-tailwind` | TypeScript React/Vite app with Tailwind CSS. |
| Single app | `single/react-vite-ts-tailwind-landing` | TypeScript React/Vite landing page starter with Tailwind CSS. |
| Single app | `single/vue-vite-tailwind` | JavaScript Vue/Vite app with Tailwind CSS. |
| Single app | `single/vue-vite-ts-tailwind` | TypeScript Vue/Vite app with Tailwind CSS. |

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
Template labels and descriptions are derived from each template's category, slug,
and stack tokens, so new generated templates automatically appear in list and JSON
output with useful metadata.

Use:

```bash
npx starter-structure-cli --list
```

to see the currently available output set.

Use:

```bash
npx starter-structure-cli --list --json
```

to inspect template ids, descriptions, features, and tokens from scripts.
