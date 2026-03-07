# __APP_NAME__

Express + Mongoose + JWT starter API.

## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT authentication middleware
- MongoDB connection with Mongoose
- Structured route/controller/model layout
- Standard API response helpers

## Project structure

```text
.
├── config/
├── controllers/
├── middleware/
├── models/
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
npm run dev
```

## API endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
