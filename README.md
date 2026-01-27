# TaskManager API (Netlify + Express)

## Overview

Serverless REST API built with Express, packaged for Netlify Functions via `serverless-http`. Provides user registration and login with JWT-based authentication, backed by a NeDB-promises datastore.

## Tech stack

- Node.js (CommonJS), Express 5
- Netlify Functions + `serverless-http`
- NeDB (file-backed), `nedb-promises`
- Auth: `bcryptjs` for hashing, `jsonwebtoken` for JWT
- Middleware: CORS, JSON body parsing

## Project structure

- mainEntryPonit/app.js
  Express app wiring, routes registration

- functions/index.js
  Netlify Function handler wrapping the app

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

- database
  NeDB datastore files (Users.db, Tasks.db)

## Local setup

1. Prerequisites: Node.js 18+, npm. Install Netlify CLI if you want local functions: `npm i -g netlify-cli`.
2. Install dependencies: `npm install`
3. Run locally with Netlify dev (recommended): `npm run dev`
   - Default URL: http://localhost:8888
   - Function mount: http://localhost:8888/.netlify/functions/index

## Environment configuration

- JWT secret is read from config/config.js (`secretKey`). For production, replace this with an environment variable and do not commit secrets.
- NeDB stores data in database/Users.db and database/Tasks.db (files are auto-created).

## API reference

Base URL (Netlify dev): http://localhost:8888/
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
http://localhost:8888/create
"Content-Type: application/json"
'{"username":"user@example.com","password":"strongpass","name":"User"}'

# Login

curl ==> POST
http://localhost:8888/login
"Content-Type: application/json"
'{"username":"user@example.com","password":"strongpass"}'

# Create a task

curl ==> POST
http://localhost:8888/createATask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task","taskDetails":"Task description","expairesDate":"2026-02-01"}'

# Get all tasks

curl ==> GET
http://localhost:8888/getAll
"Authorization: <JWT_TOKEN>"

# Get specific task

curl ==> GET
http://localhost:8888/getTask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task"}'

# Update a task (protected)

curl ==> PUT
http://localhost:8888/updatetask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task","taskDetails":"Updated description"}'

# Delete a task (protected)

curl ==> DELETE
http://localhost:8888/deletetask
"Content-Type: application/json"
"Authorization: <JWT_TOKEN>"
'{"taskTitle":"My Task"}'

## Development notes

- No automated tests are present.
- Task management system is fully implemented with CRUD operations for tasks.
- Each user can create, read, update, and delete their own tasks.
- Tasks are linked to users via userId and stored in the same Tasks.db datastore.

## Deployment

- Netlify configuration: see netlify.toml
- Build/run via Netlify:
