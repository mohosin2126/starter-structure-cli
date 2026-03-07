# __APP_NAME__

Client and server monorepo starter using npm workspaces.

## Workspace apps

- `apps/client`: frontend app (`web` workspace)
- `apps/server`: backend API (`api` workspace)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev:api
npm run dev:web
```

Prisma-based variants default to MySQL in the copied API app. Change the provider and `DATABASE_URL` if you want a different database.
