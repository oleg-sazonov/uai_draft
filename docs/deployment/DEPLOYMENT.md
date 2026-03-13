# Deployment (Render)

## 1) Deployment Architecture

Production consists of **separate services** communicating over HTTP:

```text
Internet
  ↓
Next.js Frontend (App Router)
  ↓ (REST over HTTP)
Express API (Node.js)
  ↓
MongoDB (Atlas recommended)
```

**Why the backend is a separate API:**

- Keeps the system as a clean separation of concerns (frontend UI vs backend data/auth)
- Allows independent scaling/deployment of frontend and API
- Preserves the project’s architecture rule: **do not** merge services and do **not** introduce Next.js API routes

---

## 2) Render Services

This project is deployed as multiple services:

- **Service 1: Frontend** — Next.js (App Router) web service
- **Service 2: Backend** — Express API web service
- **Service 3: Database** — MongoDB Atlas (managed database)

Render hosts the frontend and backend as separate deploys; MongoDB is typically hosted on Atlas.

---

## 3) Backend Deployment (Express API)

### Create the Render service

1. In Render, create a **Web Service** connected to your Git repo.
2. Choose the backend’s **Root Directory** (commonly `backend/`).
3. Select a Node runtime.

### Commands

- **Build command**

```bash
npm install
```

- **Start command**

```bash
node src/server.js
```

(If your backend entrypoint differs, keep the same concept—Render should start the Express server process.)

### Required environment variables

Configure these in the Render service settings:

- `MONGODB_URI` — MongoDB connection string (Atlas recommended)
- `JWT_SECRET` — secret used for JWT signing/verifying (keep private)
- `NODE_ENV` — set to `production`
- `PORT` — the port Express listens on

Notes:

- On Render, `PORT` is often provided automatically; your server should read from `process.env.PORT`.
- Ensure your API binds to `0.0.0.0` (not only `localhost`) so Render can route traffic to it.

---

## 4) Frontend Deployment (Next.js)

### Create the Render service

1. Create another **Web Service** in Render for the frontend.
2. Choose the frontend’s **Root Directory** (commonly `frontend/`).
3. Select a Node runtime.

### Commands

- **Build command**

```bash
npm run build
```

- **Start command**

```bash
npm run start
```

### Required environment variables

Configure these in the Render frontend service settings:

- `NEXT_PUBLIC_API_BASE_URL` — the public base URL of your Express API on Render
    - Example: `https://uai-api.onrender.com`
- `NEXT_PUBLIC_SITE_URL` — the public URL of the deployed frontend
    - Example: `https://uai-frontend.onrender.com` (or your custom domain)
- `NODE_ENV` — set to `production`

---

## 5) Environment Variables (Frontend → Backend Connection)

The frontend connects to the backend via:

- `NEXT_PUBLIC_API_BASE_URL`

The Next.js app should use this value when making REST requests to the Express API (server-side `fetch` or client-side calls as appropriate).

---

## 6) CORS Behavior

CORS is configured on the **backend (Express API)**.

- **Development:** CORS is required because frontend and backend run on different origins.
- **Production:** CORS is required when frontend and backend are deployed on **separate domains**.
    - Allow only the deployed frontend origin (for example, `https://uai-frontend.onrender.com` or your custom domain).
    - Avoid wildcard `*` in production.

If you deploy both services behind a single domain (via reverse proxy), CORS may be unnecessary—but the default assumption on Render is separate service domains.

---

## 7) Production Checklist

- Environment variables configured in Render (frontend + backend)
- MongoDB Atlas cluster reachable from the backend (network access + credentials)
- Backend API is accessible via its Render URL
- Frontend is deployed and successfully calls the API using `NEXT_PUBLIC_API_BASE_URL`
