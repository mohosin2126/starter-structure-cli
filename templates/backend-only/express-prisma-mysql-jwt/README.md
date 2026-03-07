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

## Getting started

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## API endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
