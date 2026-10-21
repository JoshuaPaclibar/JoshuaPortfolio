# AGENTS.md — MERN Portfolio Project

## Project Overview
A full-stack portfolio website for Joshua Y. Paclibar, a third-year BSIT student, built with MongoDB, Express.js, React (Vite) and Node.js.

- `frontend/` — React + Vite + JSX + plain CSS (port 5173 in development)
- `backend/` — Node.js + Express + Mongoose REST API (port 5000 in development)
- `docs/API.md` — API reference
- `.claude/skills/mern-portfolio/SKILL.md` — project-local Claude Code skill (invoke with `/mern-portfolio`)

## General Rules
- Understand the existing folder structure (and read the files you plan to change) before editing anything.
- Preserve working functionality and avoid unnecessary rewrites.
- Keep frontend and backend code separated. Never import backend code into the frontend or vice versa.
- Use reusable React components and modular Express code (routes → controllers → models).
- Write clear, maintainable JavaScript that a third-year student can follow.
- Do not invent personal information, projects, achievements, links or skills. Use clearly marked placeholders such as `[ADD ...]`.
- Never hardcode credentials or expose secrets. Real `.env` files are never committed.
- Validate user input on the backend (frontend validation is only a convenience).
- Handle errors explicitly. Do not silently hide failures (for example database errors).
- Avoid unnecessary dependencies. Explain any dependency you add.
- Explain new files and significant architectural decisions in simple terms.

## Frontend Rules
- Reusable components live in `frontend/src/components/`; page sections in `frontend/src/sections/`; styles in `frontend/src/styles/`.
- Editable personal content lives in `frontend/src/data/profile.js` and `frontend/src/data/projects.js`. Prefer editing data over editing components.
- All backend calls go through `frontend/src/services/api.js`.
- Use CSS variables from `global.css` (colors, spacing, radius, typography). Keep contrast accessible.
- Use semantic HTML, labelled form fields and keyboard-friendly controls.
- Handle loading, empty, success and error states.

## Backend Rules
- Routes stay thin; logic lives in controllers; data shapes live in Mongoose models.
- Keep endpoints consistent with `frontend/src/services/api.js` and `docs/API.md`.
- Validate before saving, use correct HTTP status codes, and route errors through `middleware/errorHandler.js`.
- Keep CORS limited to `FRONTEND_URL`, keep Helmet and rate limiting enabled.

## Testing
- After every change, run the affected checks:
  - Backend: `npm run lint` and `npm test` inside `backend/`
  - Frontend: `npm run lint` and `npm run build` inside `frontend/`
- Test success and failure paths of any endpoint or form you touch.
- Never claim a feature works unless it was implemented and tested. Clearly say what could not be tested (for example, a live MongoDB or a deployment).

## Documentation
- Update `README.md` when commands, scripts, configuration or setup change.
- Update `docs/API.md` when endpoints, request bodies or responses change.

## Communication
Give beginner-friendly explanations. When setup or troubleshooting is needed, provide exact Windows PowerShell commands.
