# Coorg Cup ☕

A motion-driven, full-stack coffee storefront for small-batch coffee, spices, and honey from Coorg. Customers can browse the catalog, build a cart, create an account, sign in/out, and check out. Includes an admin account for managing products and orders.

> This README is the single reference for **how the project is built, how to run it locally, and how it is hosted**. Keep it updated as things change.

---

## 1. Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Lucide icons |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Auth | JWT (JSON Web Tokens) + bcrypt password hashing |
| Payments | Razorpay / Stripe (optional; demo mode without keys) |
| Hosting | Vercel (frontend) · Render (backend) · Neon (database) |

---

## 2. Project structure

```
coffee/
├── README.md                ← this file
├── render.yaml              ← Render blueprint for the backend
├── frontend/                ← React + Vite storefront
│   ├── vercel.json          ← SPA routing config for Vercel
│   ├── .env.example         ← frontend env template (VITE_API_URL)
│   └── src/
│       ├── api/             ← fetch wrappers (auth, cart, payments)
│       ├── components/      ← header, footer, layout
│       ├── features/        ← cart, checkout, home, products
│       └── pages/           ← Home, Shop, Story
└── backend/                 ← Express + Prisma API
    ├── .env.example         ← backend env template
    ├── prisma/
    │   ├── schema.prisma    ← database models
    │   └── seed.js          ← seeds admin user + products
    └── src/
        ├── app.js           ← Express app + CORS + routes
        ├── server.js        ← starts the HTTP server
        ├── config/env.js    ← environment variable loading
        ├── features/        ← auth, cart, orders, payments, products, admin
        ├── middleware/      ← auth guard, error handler
        └── lib/             ← Razorpay / Stripe clients
```

---

## 3. Prerequisites

- **Node.js 20+** and npm
- A **Neon** Postgres database (free) — see [Section 6](#6-hosting-guide)
- (Optional) **Razorpay** or **Stripe** account for real payments

---

## 4. Local setup

### 4.1 Clone

```powershell
git clone https://github.com/VidishaNanjappa/coffee.git
cd coffee
```

### 4.2 Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env    # then edit .env with your values (see Section 5)
npm run db:generate            # generate the Prisma client
npm run db:deploy              # apply migrations to your database
npm run db:seed                # create admin user + sample products
npm run dev                    # starts API at http://localhost:4000
```

### 4.3 Frontend (in a second terminal)

```powershell
cd frontend
npm install
npm run dev                    # starts the site at http://localhost:5173
```

The frontend dev server proxies `/api` calls to `http://localhost:4000`, so no frontend env file is needed locally.

Open **http://localhost:5173** in your browser.

---

## 5. Environment variables

### Backend (`backend/.env`)

> ⚠️ **Never commit this file.** It is gitignored. Use strong, unique values and rotate any secret that leaks.

| Variable | Description |
|---|---|
| `PORT` | API port (default `4000`) |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |
| `FRONTEND_URL` | Allowed CORS origin(s). Comma-separate multiple (e.g. local + Vercel) |
| `DATABASE_URL` | Neon Postgres connection string (app runtime) |
| `DIRECT_URL` | Neon **direct** (non-pooler) string used by Prisma Migrate |
| `STRIPE_SECRET_KEY` | Optional — enables Stripe checkout |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Optional — enables Razorpay checkout |

Template (`backend/.env.example`):

```dotenv
PORT=4000
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@coorgcup.in
ADMIN_PASSWORD=change-this-password
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### Frontend (`frontend/.env` — only needed in production)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend **including `/api`**, e.g. `https://coorg-cup-api.onrender.com/api` |

Locally you can skip this — the Vite dev proxy handles `/api`.

---

## 6. Hosting guide

The live app uses three free services. **Set them up in this order** because each step needs a value from the previous one.

```
Neon (database)  →  Render (backend API)  →  Vercel (frontend)
```

### Step 1 — Database on Neon

1. Go to **https://neon.tech** → sign up with GitHub.
2. **Create project** → name it `coorg-cup`, pick a region, **Create**.
3. Open **Connect / Connection Details** and copy the connection string:
   `postgresql://user:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require`
4. If offered **Pooled / Direct**, copy the **Direct** (unpooled) one. Use this same string for both `DATABASE_URL` and `DIRECT_URL`.

### Step 2 — Backend on Render

1. Go to **https://render.com** → sign up with GitHub and authorize the `coffee` repo.
2. **New + → Blueprint** → select the `coffee` repo. Render reads `render.yaml` and proposes the `coorg-cup-api` service.
3. **Apply**, then fill the environment variables:
   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | your Neon string |
   | `DIRECT_URL` | same Neon string |
   | `ADMIN_EMAIL` | your admin email |
   | `ADMIN_PASSWORD` | a strong password |
   | `FRONTEND_URL` | leave blank for now (added in Step 4) |
   | `JWT_SECRET` | leave blank — Render auto-generates it |
   | payment keys | leave blank for demo mode |
4. **Create / Deploy.** The build runs `prisma migrate deploy` + seeding automatically.
5. Copy the backend URL, e.g. `https://coorg-cup-api.onrender.com`.
6. Verify: open `https://coorg-cup-api.onrender.com/api/health` → should return `{"ok":true,...}`.

> Render's free tier sleeps after inactivity, so the first request after idle takes ~30–50s to wake. This is normal.

### Step 3 — Frontend on Vercel

1. Go to **https://vercel.com** → sign up with GitHub.
2. **Add New → Project** → import the `coffee` repo.
3. Set **Root Directory** to `frontend` (framework auto-detects as Vite).
4. Add an environment variable:
   - **Name:** `VITE_API_URL`
   - **Value:** your Render URL **with `/api`**, e.g. `https://coorg-cup-api.onrender.com/api`
5. **Deploy**, then copy your site URL, e.g. `https://coffee-xxxx.vercel.app`.

### Step 4 — Connect frontend to backend (CORS)

1. In **Render** → `coorg-cup-api` → **Environment**.
2. Set `FRONTEND_URL` to your Vercel URL (no trailing slash), e.g. `https://coffee-xxxx.vercel.app`.
3. Save — Render redeploys, and your API now accepts requests from the live site.

Share the Vercel URL — anyone can visit the store. 🎉

---

## 7. Payments

Checkout works in **demo mode** with no keys (shows a "no gateway configured" message instead of charging). To enable real payments, add keys and redeploy:

- **Razorpay:** set `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`
- **Stripe:** set `STRIPE_SECRET_KEY`

Add these in Render's **Environment** tab (production) or `backend/.env` (local). No code changes needed — the backend detects the keys and switches on hosted checkout automatically.

---

## 8. Admin account

The seed script creates one admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Sign in with those credentials to access admin product and order management via the `/api/admin/*` endpoints. Re-running `npm run db:seed` updates the admin password to match `.env` (it's idempotent).

---

## 9. Useful commands

### Backend (`backend/`)

```powershell
npm run dev         # start API with auto-reload
npm start           # start API (production)
npm run build       # migrate deploy + seed (used by Render)
npm run db:migrate  # create a new migration (development)
npm run db:deploy   # apply existing migrations
npm run db:generate # regenerate the Prisma client
npm run db:seed     # seed admin + products
npm run db:studio   # open Prisma Studio (visual DB browser)
```

### Frontend (`frontend/`)

```powershell
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # run Oxlint
```

---

## 10. How auth & sessions work

- Passwords are hashed with **bcrypt**; the DB never stores plain text.
- Login/register returns a **JWT** stored in the browser's `localStorage`.
- Protected routes use the `authRequired` middleware, which verifies the token **and** confirms the user still exists in the database. If the account was removed or the DB was reset, the stale token is rejected with `401`.
- On the frontend, an expired/invalid session **auto-signs-out** the user with a friendly message. A **Sign out** button in the header clears the session manually.

---

## 11. Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot reach the backend` in the UI | Backend isn't running (`npm run dev` in `backend/`) or `VITE_API_URL` is wrong |
| `Foreign key constraint violated: Cart_userId_fkey` | Stale token after a DB reset — sign out and sign back in (handled automatically now) |
| CORS error in the browser console | `FRONTEND_URL` on the backend must match your site's origin exactly (no trailing slash) |
| Prisma "table does not exist" | Run `npm run db:deploy` to apply migrations |
| Products don't show up | Run `npm run db:seed` |
| First request on the live site is slow | Render free tier is waking from sleep — normal, ~30–50s |

---

## 12. Security notes

- `.env` files are **gitignored** — never commit real secrets.
- Rotate any credential that is ever exposed (DB password, JWT secret, payment keys).
- Use a strong, unique `ADMIN_PASSWORD` and a long random `JWT_SECRET` in production.
