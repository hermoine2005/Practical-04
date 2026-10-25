# Practical No. 04 - Server-Side Validation using NodeJS

A user-registration web app built with **NodeJS + Express** that validates every input **on the server**.

## Features
- GET `/` shows the form, POST `/register` validates input, GET `/users` lists users, GET `/api/health` returns JSON
- Server-side validation: name, email, phone (Indian 10-digit), age (18-100), strong password, confirm password, duplicate email
- Success page (HTTP 201) and error messages per field (HTTP 400); 404 and 500 handlers
- Output is HTML-escaped (protects against XSS)
- NodeJS concepts: modules (`require`/`module.exports`), routing (`express.Router`), middleware (body parser, logger), request/response handling

## Folder structure
```
practical04-nodejs/
  server.js                  entry point, middleware, error handlers
  routes/userRoutes.js       GET / , POST /register , GET /users , GET /api/health
  validators/userValidator.js  all validation rules
  store/userStore.js         in-memory storage
  views/render.js            HTML pages
  public/style.css
  tests/                     validator + HTTP tests
  package.json
```

## Run locally
```
npm install
npm start
```
Open http://localhost:3000

## Run tests
```
npm test
```

## Test cases to show in practical
| Input | Expected |
|---|---|
| Name `Shruti Rachmale`, email `shruti@example.com`, phone `9876543210`, age `21`, password `Str0ng@Pass` (both) | Success page |
| Empty form | Error for every field |
| Email `abc@` | Invalid email error |
| Phone `12345` | Phone error |
| Age `15` or `abc` | Age error |
| Password `short` | Password error |
| Confirm password different | Mismatch error |
| Same email twice | Already registered error |
| Name `<script>alert(1)</script>` | Rejected / escaped |

## Deploy on Render (free)
1. Push this folder to a GitHub repository.
2. Go to https://render.com, sign in with GitHub.
3. New + -> Web Service -> select your repository.
4. Settings: Runtime `Node`, Build Command `npm install`, Start Command `npm start`, Instance type `Free`.
5. Click Create Web Service. After the build you get a URL like `https://your-app.onrender.com`.

The app reads the port from `process.env.PORT`, so no code change is needed.
