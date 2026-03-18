# __APP_NAME__

Fastify + Prisma + PostgreSQL starter API.

## Features

- Fastify server with CORS enabled
- Prisma ORM configured for PostgreSQL
- User listing and creation endpoints
- Simple route-based project structure
- Ready-to-edit Prisma schema

## Project structure

```text
.
|-- config/
|-- prisma/
|-- routes/
|-- .env.example
|-- .gitignore
|-- index.js
`-- package.json
```

## API endpoints

- `GET /` - root status message
- `GET /api/health` - health check
- `GET /api/users` - list users
- `POST /api/users` - create a user

## Getting started

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

