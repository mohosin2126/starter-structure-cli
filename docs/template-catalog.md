# Template Catalog

This is the current shipped catalog for `starter-structure-cli`.

## Categories

- `backend-only`
- `frontend-only`
- `fullstack`
- `monorepo-client-server`
- `monorepo-turbo-pnpm`
- `single`

## Shipped templates

### `backend-only`

- `backend-only/express-mongoose-jwt`
- `backend-only/express-prisma-mysql-jwt`
- `backend-only/express-prisma-mysql-jwt-ts`
- `backend-only/fastify-prisma-postgres`
- `backend-only/fastify-prisma-postgres-ts`

### `frontend-only`

- `frontend-only/react-admin-dashboard`

### `fullstack`

- `fullstack/nextjs-tailwind-mongoose-mongodb`
- `fullstack/nextjs-tailwind-nextauth-prisma`
- `fullstack/nextjs-tailwind-prisma-mysql`
- `fullstack/nextjs-tailwind-prisma-postgres`
- `fullstack/react-vite-ts-shadcn-express-prisma-postgres`
- `fullstack/react-vite-ts-tailwind-express-mongoose`
- `fullstack/react-vite-ts-tailwind-express-prisma-mysql`
- `fullstack/react-vite-ts-tailwind-express-prisma-postgres`
- `fullstack/react-vite-ts-tailwind-express-sequelize-mysql`
- `fullstack/vue-vite-ts-tailwind-express-mongoose`
- `fullstack/vue-vite-ts-tailwind-express-prisma-mysql`
- `fullstack/vue-vite-ts-tailwind-express-prisma-postgres`

### `monorepo-client-server`

- `monorepo-client-server/nextjs-express-prisma`
- `monorepo-client-server/react-vite-ts-express-mongoose`
- `monorepo-client-server/react-vite-ts-express-prisma`
- `monorepo-client-server/vue-vite-ts-express-mongoose`

### `monorepo-turbo-pnpm`

- `monorepo-turbo-pnpm/nextjs-api-express-prisma`
- `monorepo-turbo-pnpm/nextjs-api-nestjs-prisma`
- `monorepo-turbo-pnpm/react-vite-api-express-mongoose`

### `single`

- `single/nextjs-tailwind`
- `single/nextjs-ts-shadcn-tailwind`
- `single/nextjs-ts-tailwind`
- `single/react-vite-shadcn-tailwind`
- `single/react-vite-tailwind`
- `single/react-vite-tailwind-landing`
- `single/react-vite-ts-shadcn-tailwind`
- `single/react-vite-ts-tailwind`
- `single/react-vite-ts-tailwind-landing`
- `single/vue-vite-tailwind`
- `single/vue-vite-ts-tailwind`

## Recommended commands

List everything:

```bash
npx starter-structure-cli --list
```

Scaffold from a plain stack query:

```bash
npx starter-structure-cli my-app react vite ts tailwind
```

Scaffold from an exact template:

```bash
npx starter-structure-cli my-api --template backend-only/fastify-prisma-postgres-ts
```

Scaffold a single-app Next.js shadcn starter:

```bash
npx starter-structure-cli my-web --template single/nextjs-ts-shadcn-tailwind
```

Scaffold a new fullstack React shadcn starter:

```bash
npx starter-structure-cli my-platform --template fullstack/react-vite-ts-shadcn-express-prisma-postgres
```

Scaffold with structured filters:

```bash
npx starter-structure-cli my-app --category fullstack --frontend react --backend express --orm prisma --database postgres
```
