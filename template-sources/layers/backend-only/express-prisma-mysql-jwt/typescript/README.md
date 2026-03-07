# __APP_NAME__

Express + Prisma + MySQL + JWT starter API with TypeScript.

## Features

- TypeScript-first Express API setup
- Prisma ORM with MySQL
- User registration and login
- JWT authentication middleware
- Structured `src/` layout
- Ready-to-edit Prisma schema

## Project structure

```text
.
├── prisma/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

{{ include: components/readme/getting-started-prisma.md }}

{{ include: components/readme/api-endpoints-auth.md }}
