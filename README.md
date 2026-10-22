# Joshua Y. Paclibar: MERN Portfolio

A responsive, dark-themed portfolio for a third-year BSIT student, built with **MongoDB, Express, React (Vite) and Node.js**. The visual style (black background, purple glow, white cards) and the content come from the original Figma-style screens; the portfolio is now a real full-stack app.

## Features

- One-page React site: Hero, About, Skills, Education, Projects, Contact, Footer
- Responsive navbar (hamburger menu on mobile), active-section highlight, skip link, keyboard-friendly
- Projects loaded from the API (MongoDB). If the API is down, sample projects are shown **with a visible notice**
- Contact form with frontend + backend validation, loading, success and error states; messages saved in MongoDB
- Express REST API with validation, centralized error handling, Helmet, CORS limited to your frontend, rate limiting
- All personal content in one file: `frontend/src/data/profile.js`

## Tech stack

| Part | Tools |
| ---- | ----- |
| Frontend | React 18, Vite 5, plain CSS (variables, Grid, Flexbox), lucide-react icons |
| Backend | Node.js, Express 4, Mongoose 8, dotenv, cors, helmet, express-rate-limit |
| Tooling | npm, ESLint, Node's built-in test runner |

## Folder structure

```text
my-portfolio/
├── frontend/
│   ├── public/ (favicon.svg, images/)
│   ├── src/
│   │   ├── components/   Navbar, Footer, SectionTitle, SocialLinks, ProjectCard
│   │   ├── sections/     Hero, About, Skills, Education, Projects, Contact
│   │   ├── data/         profile.js (your content), projects.js (fallback samples)
│   │   ├── services/     api.js (the only file that calls the backend)
│   │   ├── styles/       global.css (design tokens), navbar.css, components.css
│   │   ├── App.jsx, main.jsx
│   ├── .env.example, eslint.config.js, vite.config.js, package.json
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/  projectController.js, contactController.js
│   │   ├── models/       Project.js, Contact.js
│   │   ├── routes/       projectRoutes.js, contactRoutes.js
│   │   ├── middleware/   errorHandler, notFound, requireDb, rateLimiter
│   │   ├── utils/validate.js
│   │   ├── data/projects.js   (seed data)
│   │   ├── app.js, server.js
│   ├── scripts/seed.js
│   ├── tests/
│   ├── .env.example, eslint.config.js, package.json
├── docs/API.md
├── .claude/skills/mern-portfolio/SKILL.md
├── AGENTS.md
├── README.md
└── .gitignore
```

**Differences from the suggested structure (and why):** added `backend/src/utils/validate.js` (validation shared by route and controller, easy to test), `backend/src/middleware/requireDb.js` and `rateLimiter.js` (503 when the DB is down; contact rate limit), `backend/scripts/seed.js` and `backend/src/data/projects.js` (put starting projects in MongoDB), `backend/tests/`, `frontend/src/data/` (editable content), and `components/SocialLinks.jsx`. React Router was **not** added because this is a one-page site and the navbar scrolls to sections.

## Prerequisites

- [Node.js](https://nodejs.org) 18 or newer (check with `node -v`)
- MongoDB: either installed locally (MongoDB Community Server) **or** a free MongoDB Atlas account
- Git (optional)

## Installation (Windows PowerShell)

```powershell
cd my-portfolio

# Backend
cd backend
npm install
Copy-Item .env.example .env
cd ..

# Frontend
cd frontend
npm install
Copy-Item .env.example .env
cd ..
```

> If PowerShell says *running scripts is disabled*, run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then reopen PowerShell.

## Environment variables

`backend/.env`

| Variable | Purpose | Default in `.env.example` |
| -------- | ------- | ------------------------- |
| `PORT` | API port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/portfolio_db` |
| `FRONTEND_URL` | Exact frontend origin allowed by CORS (no trailing slash) | `http://localhost:5173` |
| `NODE_ENV` | `development` or `production` | `development` |
| `SMTP_USER` | Gmail address that sends the contact emails | `joshuapaclibar37@gmail.com` |
| `SMTP_PASS` | Gmail **App Password** (16 characters, not your normal password) | *(empty, you fill it in)* |
| `CONTACT_TO` | Inbox that receives the messages (defaults to `SMTP_USER`) | `joshuapaclibar37@gmail.com` |

`frontend/.env`

| Variable | Purpose |
| -------- | ------- |
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api` |

**Proxy vs `VITE_API_URL`:** if `VITE_API_URL` is set, the browser calls that URL directly (so CORS and `FRONTEND_URL` must match). If it is empty or missing, the app calls `/api/...` on the Vite dev server (port 5173) and `vite.config.js` proxies it to `http://localhost:5000`. Restart `npm run dev` after changing `.env`.

Never commit real `.env` files. Only `VITE_` variables reach the browser, so never put secrets in the frontend `.env`.

## Email setup (contact form → your Gmail)

The contact form emails every message to `CONTACT_TO`. Gmail needs an *App Password*:

1. Turn on 2-Step Verification: <https://myaccount.google.com/security>
2. Create an App Password: <https://myaccount.google.com/apppasswords> (name it "Portfolio").
3. In `backend/.env` set `SMTP_USER=joshuapaclibar37@gmail.com` and `SMTP_PASS=<the 16 characters, no spaces>`.
4. Restart the backend (`npm run dev`) and send a test message from the site. Reply-To is set to the visitor's email.

Never commit `.env` or share the app password. If email is not configured, messages are only saved to MongoDB (when it is running); if neither works, the visitor sees an error, not a fake success.

## MongoDB setup

**Option A: Local**

1. Install MongoDB Community Server (choose "Run as a Service").
2. Keep `MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_db`.

**Option B: MongoDB Atlas (cloud)**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. *Database Access*: create a user and password.
3. *Network Access*: add your IP address (use `0.0.0.0/0` only for testing).
4. *Connect → Drivers*: copy the connection string into `backend/.env`:
   `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio_db?retryWrites=true&w=majority`
   (URL-encode special characters in the password).

## Running the project (two terminals)

Terminal 1, backend:

```powershell
cd my-portfolio\backend
npm run seed     # once: adds the two starting projects to MongoDB
npm run dev      # API on http://localhost:5000
```

Terminal 2, frontend:

```powershell
cd my-portfolio\frontend
npm run dev      # site on http://localhost:5173
```

Check the API: open <http://localhost:5000/api/health>. `"database": "connected"` means MongoDB works.

### Scripts

| Folder | Script | What it does |
| ------ | ------ | ------------ |
| backend | `npm run dev` | Start API with auto-restart (`node --watch`) |
| backend | `npm start` | Start API (production) |
| backend | `npm run seed` | Add/update projects from `src/data/projects.js` |
| backend | `npm run lint` / `npm test` | ESLint / tests |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Production build into `dist/` |
| frontend | `npm run preview` | Preview the production build |
| frontend | `npm run lint` | ESLint |

## API endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/api/health` | Health + database state |
| GET | `/api/projects` | All projects |
| GET | `/api/projects/:id` | One project |
| POST | `/api/contact` | Validate, email to your Gmail, and save a copy |

Details and examples: [docs/API.md](docs/API.md).

## Personalizing the portfolio

1. **Text, skills, education, contacts:** edit `frontend/src/data/profile.js`. Replace every `[ADD ...]` placeholder or set it to `''` to hide it. (The birth date and hospital from the original About screen were intentionally left out for privacy. Add them back to `about.background` if you want them.)
2. **Social links:** put your GitHub / LinkedIn / Facebook URLs in `profile.js`; icons appear only when a URL exists.
3. **Photos:** replace `frontend/public/images/profile.png`, `devify.png`, `cashier.png`. The current files were cropped from your screenshots, so use the originals for sharper images.
4. **Projects:** edit `backend/src/data/projects.js` (add technologies, GitHub and demo URLs), then run `npm run seed` again. Keep `frontend/src/data/projects.js` (fallback) in sync.
5. **Colors and spacing:** change the variables at the top of `frontend/src/styles/global.css`.
6. **Phone number:** it is shown publicly on the site. Remove it from `profile.js` if you prefer not to share it.

## Troubleshooting

| Problem | What to check |
| ------- | ------------- |
| Projects show a yellow "sample projects" notice | The API is unreachable or MongoDB is down. Open `/api/health`, read the notice text and the backend terminal. |
| `[db] MongoDB connection failed` | Is MongoDB running? Is `MONGODB_URI` correct? For Atlas: IP allow-list, user/password, URL-encoded password. |
| CORS error in browser console | `FRONTEND_URL` must exactly equal the browser origin (`http://localhost:5173`). Restart the backend. Or empty `VITE_API_URL` to use the proxy. |
| "unexpected response" / `Unexpected token <` | The frontend got an HTML page: wrong `VITE_API_URL`, backend not running, or wrong port. |
| Contact form says "could not be delivered" | Neither email nor MongoDB worked. Check `SMTP_USER` / `SMTP_PASS` (App Password!) in `backend/.env` and the backend terminal for `[contact] Email failed: ...`. |
| `429 Too many messages` | Rate limit (10 per 15 minutes per IP). Wait or restart the backend while testing. |
| `npm` blocked in PowerShell | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Port already in use | Change `PORT` in `backend/.env` (and the proxy target in `vite.config.js` / `VITE_API_URL`). |

## Build

```powershell
cd my-portfolio\frontend
npm run build      # output in frontend\dist
npm run preview    # optional: test the build locally
```

## Deployment guidance

1. **Database:** use MongoDB Atlas. Allow your host's outbound IPs (or `0.0.0.0/0` while learning).
2. **Backend** (Render, Railway, Fly.io, ...): root directory `backend`, build `npm install`, start `npm start`. Set `MONGODB_URI`, `FRONTEND_URL` (your deployed site URL, no trailing slash), `NODE_ENV=production`. Run `npm run seed` once against the Atlas database.
3. **Frontend** (Vercel, Netlify, Cloudflare Pages, ...): root directory `frontend`, build `npm run build`, output `dist`. Set `VITE_API_URL=https://<your-backend-host>/api` **before** building.
4. After deploying, open `<backend>/api/health` and send a test message from the live site.

## Working with Claude Code

- `AGENTS.md` holds project rules for AI coding agents.
- `.claude/skills/mern-portfolio/SKILL.md` is a project-local Claude Code skill. Claude Code discovers skills in `.claude/skills/<name>/SKILL.md` when you start it inside this project. Run `claude` in the project folder and type `/mern-portfolio` (or just describe a portfolio task and it may load automatically). To use it in every project, copy the `mern-portfolio` folder to `%USERPROFILE%\.claude\skills\`.

## Verification status (what was and was not tested)

Tested in the build environment:

- All backend files pass `node --check`; 14 dependency-free tests pass (`tests/validate.test.js`, `tests/errorHandler.test.js`): validation rules, NoSQL-operator rejection, error-handler status codes.
- The whole React app rendered on the server with the real components and data (icons stubbed): all sections and key content present.
- `frontend/src/services/api.js` tested with a mocked `fetch` (success, HTML response, network failure, validation error, POST contact).

**Not tested** (the build environment could not reach the npm registry, so dependencies could not be installed, and no MongoDB was available):

- `npm install`, `npm run lint`, `npm run build`, `npm run dev` in either folder
- `tests/api.test.js` (written, needs `npm install` first): routes, 404/503/400 handling, CORS and Helmet through real Express
- Saving contact messages and reading projects from a live MongoDB; `npm run seed`
- Rendering in a real browser (responsive layout, hamburger menu, scroll highlighting, form interaction) and any deployment

Please run these locally after `npm install` and tell Claude Code about any failures.
#   P o r t f o l i o - 3 r d - y e a r  
 