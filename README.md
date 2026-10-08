# Apartment Care — MERN Property Maintenance Platform

A white-glove apartment management app: residents open maintenance tickets with
photos, staff chat/assign/resolve, parts and appointments are tracked, and lobby
packages notify residents. Four roles with full RBAC:

- **tenant** — opens requests, chats, sees own history + packages
- **superintendent** — triages/assigns/handles tickets for their building
- **management** — orders parts, books appointments, oversees the building
- **landlord** — read-only oversight across everything

Notifications fan out to **in-app + email** (SMS is stubbed behind an interface).

## Stack

- **client-api/** — Express + Mongoose (MongoDB), Redis (access-token store),
  JWT auth, Multer uploads, Nodemailer.
- **ticketsystem_mern/** — React 18 + Redux Toolkit, React Router, luxury
  glassmorphism theme.

---

## Run locally (one command, Docker)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API:      http://localhost:3001  (health: /health)

Seed demo data (4 role accounts + sample tickets/packages/notifications):

```bash
docker compose exec api npm run seed
```

**Demo logins** (password `Passw0rd!`):
`tenant@demo.com` · `super@demo.com` · `office@demo.com` · `owner@demo.com`

### Run without Docker

```bash
# backend (needs local MongoDB + Redis running)
cd client-api && cp .env.example .env && npm install && npm run seed && npm run dev
# frontend
cd ticketsystem_mern && npm install && npm start
```

---

## Deploy (production)

Recommended split: **frontend on Vercel**, **API + Redis on Render**,
**MongoDB on Atlas**.

### 1. Database — MongoDB Atlas
1. Create a free M0 cluster at https://www.mongodb.com/atlas.
2. Add a database user and allow network access (0.0.0.0/0 for managed hosts).
3. Copy the SRV connection string (you'll paste it as `MONGO_URL`).

### 2. API + Redis — Render (uses `render.yaml`)
1. Push this repo to GitHub.
2. Render → **New +** → **Blueprint** → select the repo. It provisions the
   Dockerized API and a Redis instance from `render.yaml`.
3. In the API service env, set:
   - `MONGO_URL` → your Atlas string
   - `CLIENT_ORIGIN` → your frontend URL (set after step 3, no trailing slash)
   - (`JWT_*` secrets are auto-generated; `REDIS_URL` is auto-wired.)
4. Seed once via the Render shell: `npm run seed`.
5. Note the API URL, e.g. `https://apartment-care-api.onrender.com`.

> Uploaded photos are written to disk. On free tier this is ephemeral; add a
> Render **Disk** mounted at `/app/uploads` (paid) or switch to cloud storage
> (S3/Cloudinary) for durable media.

### 3. Frontend — Vercel (uses `ticketsystem_mern/vercel.json`)
1. Vercel → **New Project** → import the repo, **Root Directory =
   `ticketsystem_mern`**.
2. Add env var `REACT_APP_API_ORIGIN` = your Render API URL.
3. Deploy. Then set Render's `CLIENT_ORIGIN` to this Vercel URL and redeploy the API.

### 4. Go live
- Point your custom domain at the Vercel project.
- You're ready to send Google Ads traffic to the landing page at `/`.

---

## Environment variables

See `client-api/.env.example` and `ticketsystem_mern/.env.example`.
