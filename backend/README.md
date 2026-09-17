# Coorg Cup backend

This directory contains the API service for products, authentication, carts, orders, payments, and admin operations.

## Run locally

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

The API runs at `http://localhost:4000`.

## API areas

- `GET /api/products` and `GET /api/products/:id` provide the storefront catalog.
- `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me` provide JWT authentication.
- `/api/cart` manages an authenticated user's cart.
- `POST /api/orders` and `GET /api/orders` create and list customer orders.
- `POST /api/payments/checkout` creates a Stripe Checkout session when `STRIPE_SECRET_KEY` is configured, otherwise returns a local setup response.
- `/api/admin/products` and `/api/admin/orders` provide admin product and order management.

The default local admin is `admin@coorgcup.in` with the password from `ADMIN_PASSWORD`. Change it in `.env` before using this outside local development.

Persistence currently uses `data/db.json` so the API can run without database setup. Replace `src/store.js` with a database adapter when moving to production.