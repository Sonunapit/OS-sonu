# SONU OS

An operating-system style developer portfolio for Sonu Kumar Napit.

- **Desktop and tablet (width 768px and up):** choose Windows, macOS or Linux.
- **Phones:** choose iPhone or Android.
- Every system opens the same portfolio apps (About, Projects, Skills, Education/Experience, Resume, Gallery, Terminal, Files, Contact, Notepad, System, Settings) in its own chrome.
- Private admin dashboard at `/admin` edits everything; only **published** content reaches the public API.

## Run locally

Requirements: Node 18+, a MongoDB Atlas (or local) database.

```bash
# 1. backend
cd backend
cp .env.example .env        # fill in the values (see below)
npm install
npm run seed                # creates your admin user + starter content
npm run dev                 # http://localhost:5000

# 2. frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173  (proxies /api to :5000)
```

Open `http://localhost:5173`, then `http://localhost:5173/admin` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Credentials you must provide (backend/.env)

| Variable | Where to get it |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas > Connect > Drivers |
| `JWT_SECRET` | 48+ random bytes: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Your choice (password 12+ characters) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary dashboard (images) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET` | Supabase project > Settings > API. Create a **public** bucket named `documents` (PDF resumes) |
| `CLIENT_ORIGIN` | Your frontend URL(s), comma separated |

Uploads return a clear 503 message until the Cloudinary / Supabase variables are set. The service-role key stays on the server only; never put it in the frontend.

## Tests

```bash
cd backend && npm test     # Supertest: auth and public/admin separation
cd frontend && npm test    # Vitest + React Testing Library: window manager, OS selector
```

## Deploy

1. **MongoDB Atlas:** create a cluster, allow your backend host's IP.
2. **Backend (Render / Railway / Fly):** root `backend`, start `npm start`, add all env vars, `NODE_ENV=production`, `CLIENT_ORIGIN=https://your-site.vercel.app`. Run `npm run seed` once.
3. **Frontend (Vercel):** root `frontend`, build `npm run build`, output `dist`, env `VITE_API_URL=https://your-api-host/api`. `vercel.json` already rewrites routes to `index.html`.

The admin cookie is `httpOnly`, `secure`, `sameSite=none` in production, so frontend and backend must both be served over HTTPS.

## Security notes

bcrypt password hashing, JWT in an httpOnly cookie, rate-limited login and contact form, Helmet, strict CORS with credentials, zod validation, upload size/type limits plus file-signature checks, a custom-header check on every admin write (CSRF defence), and a read-only public API that returns published records only.

## Structure

```
frontend/src
  os/        boot, selector, windows (window manager UI), macos, linux, iphone, android, shared
  apps/      registry.js + one component per portfolio app
  admin/     /admin dashboard
  store/     Zustand: osStore (windows, OS, theme), portfolioStore (content)
backend/src
  models/ controllers/ routes/ middleware/ services/ config/ tests/
```
