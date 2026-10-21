---
name: mern-portfolio
description: Build, maintain, debug and improve this student's MERN portfolio (React/Vite frontend, Express/Mongoose backend). Use when adding or changing sections, components, API routes, models, validation, styling, tests or docs, or when troubleshooting CORS, MongoDB connection, API URL or JSON parsing problems.
---

# MERN Portfolio Development Skill

## When to use this skill
Use it whenever you implement a feature, fix a bug, improve the UI, connect the frontend to the API, or update documentation for this repository. Invoke manually with `/mern-portfolio`, or let Claude Code load it automatically when a task matches the description above.

## Project architecture
```
frontend/   React + Vite (JSX, plain CSS)
  src/components/   reusable pieces (Navbar, Footer, SectionTitle, ProjectCard)
  src/sections/     page sections (Hero, About, Skills, Education, Projects, Contact)
  src/data/         editable content (profile.js) and fallback sample projects (projects.js)
  src/services/     api.js — the ONLY place that calls the backend
  src/styles/       global.css (design tokens), navbar.css, components.css
backend/    Node + Express + Mongoose (ES modules)
  src/config/       db.js — MongoDB connection
  src/models/       Project.js, Contact.js
  src/controllers/  request logic
  src/routes/       thin route files
  src/middleware/   errorHandler.js, notFound.js, requireDb.js, rateLimiter.js
  src/data/         seed projects
  tests/            node:test API tests
docs/API.md  README.md  AGENTS.md
```
Data flow: `Section component → services/api.js → /api/... → route → controller → model → MongoDB`.

## Repeatable workflow
1. **Inspect** – read the files involved and `AGENTS.md`; trace the problem through frontend → API → database.
2. **Plan** – state the root cause or feature, list files to change, avoid rewrites.
3. **Implement** – smallest change that works; follow existing conventions.
4. **Validate & secure** – run the checklists below.
5. **Test** – run lint, tests and build; exercise success and failure paths.
6. **Document** – update README/API docs when anything user-facing changed.
7. **Report** – short, beginner-friendly summary; say honestly what was not tested.

## Creating or updating a React component
- One component per file, PascalCase name, `.jsx` extension, default export.
- Put reusable UI in `components/`, page-level blocks in `sections/`, personal content in `data/`.
- Use semantic elements (`section`, `nav`, `ul`, `button`), labelled inputs, `aria-*` only where needed.
- Style with classes and CSS variables from `global.css`; never hardcode new colors.
- Components that fetch data must show loading, empty and error states.
- Never place secrets in the frontend; only `VITE_`-prefixed variables are exposed and they are public.

## Creating or updating an Express route, controller or model
1. **Model** (`models/`) – Mongoose schema with types, `required`, `trim`, `maxlength`, timestamps.
2. **Controller** (`controllers/`) – validate input, call the model, send JSON with the right status code, pass unexpected errors to `next(err)`.
3. **Route** (`routes/`) – map method + path to the controller; register in `app.js` under `/api`.
4. **Frontend** – add/adjust the function in `services/api.js` so the path, method and body match exactly.
5. **Docs** – update `docs/API.md`.
Responses use `{ success, data }` on success and `{ success: false, message, errors? }` on failure.

## API consistency rule
Every frontend call must match a backend route (method, path, body fields, response shape). When one changes, change the other and `docs/API.md` in the same task.

## Checklists
**Validation** – types checked (`typeof x === 'string'`), values trimmed, length limits enforced, email format checked, invalid ObjectIds rejected with 400, unknown fields ignored.
**Security** – secrets only in `.env`; `.env` git-ignored; Helmet on; CORS limited to `FRONTEND_URL`; rate limit on `/api/contact`; JSON body size limited; no raw user input in queries or HTML.
**Error handling** – 400 invalid input, 404 missing record/route, 429 rate limited, 503 database unavailable, 500 unexpected; one central error handler; no stack traces in production responses.
**Testing** – `npm run lint` and `npm test` in `backend/`; `npm run lint` and `npm run build` in `frontend/`; test both success and failure responses; state what could not be tested.

## Troubleshooting
- **CORS error** – `FRONTEND_URL` in `backend/.env` must equal the exact browser origin (e.g. `http://localhost:5173`, no trailing slash). Restart the backend after editing `.env`. In development you can also leave `VITE_API_URL` empty to use the Vite proxy.
- **MongoDB connection failed** – is MongoDB running (local) or is the Atlas IP allow-list/user/password correct? Check `MONGODB_URI`; special characters in passwords must be URL-encoded. `GET /api/health` shows the database state.
- **Wrong API URL** – compare `VITE_API_URL` / the Vite proxy target, the backend `PORT`, and the `/api` prefix. Restart Vite after editing `.env`.
- **"Unexpected token < in JSON"** – the frontend received an HTML page (usually wrong URL or backend not running). Open the URL in the browser and check status and content type.
- **Contact form fails** – check browser Network tab for the payload and status code, then the backend log, then `GET /api/health`.

## Completion criteria
A feature is done only when it is implemented, lint/tests/build pass, error paths were tried, and documentation is updated. Keep explanations short and beginner-friendly.
