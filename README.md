# TaskManager API (Express + PostgreSQL)

## Overview

REST API built with Express. Provides user registration and login with JWT-based authentication, backed by PostgreSQL.

## Tech stack

- Node.js (CommonJS), Express 5
- PostgreSQL (`pg`) with SSL
- Auth: `bcryptjs` for hashing, `jsonwebtoken` for JWT
- Middleware: CORS, JSON body parsing
- Dev: `nodemon`

## Project structure

- mainEntryPonit/app.js
  Express app wiring, routes registration

- usersCreation/CreateAccount.js
  POST /create handler (signup)

- usersCreation/Login.js
  POST /login handler (signin)

- middlewares/Authenticate.js
  JWT verification middleware

- config/config.js
  secret key configuration

- userActions/Tasks.js
  Task CRUD operations (create, read, update, delete)

- database/db.js
  PostgreSQL connection + table initialization

## Local setup

1. Prerequisites: Node.js 18+, npm.
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

- Default URL: http://localhost:4000

## Environment configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000

# Database Configuration (PostgreSQL)
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Admin User Configuration
ADMIN_NAME=Admin User
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_ROLE=admin
ADMIN_STATUS=active

# JWT Secret Key
SECRET_KEY=your_secret_key_here
```

**Important Notes:**

- Copy `.env.example` to `.env` and fill in your actual values
- In production (Render, Heroku, etc.), set these as environment variables in your hosting platform
- Never commit `.env` to version control
- Make sure `DB_PORT` (default 5432) is different from server `PORT` (default 4000)

## API reference

Base URL (local): http://localhost:4000/
POST /create — Sign up

- Body (JSON): `username` (must contain `@`), `password` (min 8 chars), `name`
- Validations: missing fields → 403; password too short → 403; bad username format → 403; duplicate username → 403
- Success: 201 with `{ message, user: <id>, status: 201 }`
- Errors: 500 with `{ error }`

POST /login — Sign in

- Body (JSON): `username`, `password`
- Responses: missing credentials → 422; unknown user → 401; bad password → 403
- Success: 200 with `{ token, status: 200 }` (JWT expires in 1h)
- Errors: 500 with `{ error }`

POST /createATask — Create a new task (protected)

- Requires: `Authorization` header with JWT token
- Body (JSON): `taskTitle`, `taskDetails`, `expairesDate`
- Validations: missing fields → 422; duplicate task title → 409
- Success: 201 with `{ message, task: { title, createdAt, expairesAt }, status: 201 }`
- Errors: 401 (unauthorized), 500 with `{ error }`

GET /getAll — Get all user tasks (protected)

- Requires: `Authorization` header with JWT token
- Returns: 200 with array of `[{ title, task, createdAt, expairesAt }]`
- Responses: no tasks found → 404; unauthorized → 401
- Errors: 500 with `{ error }`

GET /getTask — Get a specific task (protected)

- Requires: `Authorization` header with JWT token
- Body (JSON): `taskTitle`
- Returns: 200 with `{ Tilte, task, createdAt, expairesAt }`
- Responses: task not found → 404; unauthorized → 401
- Errors: 500 with `{ error }`

DELETE /deletetask — Delete a task (protected)

- Requires: `Authorization` header with JWT token
- Body (JSON): `taskTitle`
- Success: 200 with `{ message: "Task deleted successfully" }`
- Responses: task not found → 404; unauthorized → 401
- Errors: 500 with `{ error }`

PUT /updatetask — Update a task (protected)

- Requires: `Authorization` header with JWT token
- Body (JSON): `taskTitle`, `taskDetails`
- Success: 200 with `{ message: "Task updated successfully" }`
- Responses: task not found → 404; unauthorized → 401
- Errors: 500 with `{ error }`

## Authentication

- Middleware expects `Authorization` header to contain the raw JWT (no `Bearer` prefix in current implementation).
- Verified user is attached as `req.user`.

## Usage examples

curl ==> POST
http://localhost:4000/create
"Content-Type: application/json"
'{"username":"user@example.com","password":"strongpass","name":"User"}'

# Login

curl ==> POST
http://localhost:4000/login
"Content-Type: application/json"
'{"username":"user@example.com","password":"strongpass"}'

# Create a task

curl ==> POST
http://localhost:4000/createATask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task","taskDetails":"Task description","expairesDate":"2026-02-01"}'

# Get all tasks

curl ==> GET
http://localhost:4000/getAll
"Authorization: <JWT_TOKEN>"

# Get specific task

curl ==> GET
http://localhost:4000/getTask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task"}'

# Update a task (protected)

curl ==> PUT
http://localhost:4000/updatetask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task","taskDetails":"Updated description"}'

# Delete a task (protected)

curl ==> DELETE
http://localhost:4000/deletetask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task"}'

## Development notes

- No automated tests are present.
- Task management system is fully implemented with CRUD operations for tasks.
- Each user can create, read, update, and delete their own tasks.
- Tasks are linked to users via userId and stored in PostgreSQL.

## Deployment

- Render: use `npm start` as the Start Command.
- Add env vars in Render dashboard: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, and `PORT` (Render usually sets `PORT`).
