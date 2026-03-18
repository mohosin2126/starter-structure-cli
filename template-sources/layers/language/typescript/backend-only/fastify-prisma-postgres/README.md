# __APP_NAME__

Fastify + Prisma + PostgreSQL starter API with TypeScript.

## Features

- TypeScript-first Fastify server setup
- Prisma ORM configured for PostgreSQL
- User listing and creation endpoints
- Structured `src/` layout for backend growth
- Ready-to-edit Prisma schema

## Project structure

```text
.
|-- prisma/
|-- src/
|   |-- config/
|   `-- routes/
|-- .env.example
|-- .gitignore
|-- package.json
`-- tsconfig.json
```

## API endpoints

- `GET /` - root status message
- `GET /api/health` - health check
- `GET /api/users` - list users
- `POST /api/users` - create a user

{{ include: components/readme/getting-started-prisma.md }}
