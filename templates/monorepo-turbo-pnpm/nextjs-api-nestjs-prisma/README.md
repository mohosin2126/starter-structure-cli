# __APP_NAME__

Turbo + pnpm monorepo starter with separate web and API apps.

## Workspace apps

- `apps/web`: frontend app
- `apps/api`: backend API

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Prisma-based variants default to MySQL in the copied API app. Change the provider and `DATABASE_URL` if you want a different database.
