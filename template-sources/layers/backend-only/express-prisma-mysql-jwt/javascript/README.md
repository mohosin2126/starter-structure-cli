# __APP_NAME__

Express + Prisma + MySQL + JWT starter API.

## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT authentication middleware
- Prisma ORM with MySQL
- Structured route/controller/middleware/utils layout
- Ready-to-edit Prisma schema

## Project structure

```text
.
├── config/
├── controllers/
├── middleware/
├── prisma/
├── routes/
├── utils/
├── .env.example
├── .gitignore
├── index.js
└── package.json
```

{{ include: components/readme/getting-started-prisma.md }}

{{ include: components/readme/api-endpoints-auth.md }}
