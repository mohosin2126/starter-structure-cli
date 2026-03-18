# __APP_NAME__

Fullstack starter with a shadcn-style React client and an Express + Prisma PostgreSQL API.

## Structure

- `client/`: frontend app
- `server/`: API app

## Getting started

```bash
npm run setup
cp .env.example .env
npm run dev:server
npm run dev:client
```

Set the database values in `server/.env` or copy the root values into that app before running migrations or connecting the API.
