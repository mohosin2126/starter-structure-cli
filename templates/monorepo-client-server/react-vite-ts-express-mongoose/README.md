# __APP_NAME__

Client and server monorepo starter using npm workspaces.

## Workspace apps

- `apps/web`: frontend app
- `apps/api`: backend API

## Getting started

```bash
npm install
cp .env.example .env
npm run dev:api
npm run dev:web
```

Prisma-based variants default to MySQL in the copied API app. Change the provider and `DATABASE_URL` if you want a different database.
