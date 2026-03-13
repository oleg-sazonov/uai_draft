# Development Setup (Local)

## 1) Project Overview

This repository is designed as **two separate services**:

- **Frontend:** Next.js (App Router)
- **Backend:** Node.js + Express REST API

**Important architecture rule:** the frontend and backend remain separate processes and communicate over **HTTP (REST)**. This is **not** a monolithic Next.js API project—do **not** add or use Next.js API routes.

---

## 2) Requirements

Install the following on your development machine:

- **Node.js:** **LTS** (recommended: Node.js **20.x LTS** or newer LTS)
- **MongoDB:**
    - Local MongoDB server **or**
    - MongoDB Atlas connection string
- **Package manager:** `npm` (ships with Node) or `yarn`

---

## 3) Repository Structure (example)

A typical layout for this project looks like:

```text
frontend/
backend/
docs/
```

- `frontend/` — Next.js App Router application (UI + server-rendered pages)
- `backend/` — Express API service (routes, auth, database models)
- `docs/` — architecture specs, API contract, and internal documentation

---

## 4) Installing Dependencies

Install dependencies **separately** for each service.

### Frontend

```bash
cd frontend
npm install
# or: yarn
```

### Backend

```bash
cd backend
npm install
# or: yarn
```

---

## 5) Environment Variables

Create environment files locally and **do not commit** them.

- Backend commonly uses: `backend/.env`
- Frontend commonly uses: `frontend/.env.local`

### Backend (Express API)

Required variables:

- `MONGODB_URI`
    - MongoDB connection string used by Mongoose.
    - Examples:
        - Local: `mongodb://127.0.0.1:27017/uai`
        - Atlas: `mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`

- `JWT_SECRET`
    - Secret used to sign and verify JWTs for admin authentication.
    - Must be strong and kept private.

- `PORT`
    - Port the Express API listens on.
    - Example: `4000`

- `NODE_ENV`
    - Environment mode.
    - Typical local value: `development`

Example `backend/.env`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/uai
JWT_SECRET=change-me-to-a-long-random-secret
PORT=4000
NODE_ENV=development
```

### Frontend (Next.js)

Required variables:

- `NEXT_PUBLIC_API_BASE_URL`
    - Base URL of the Express API used by the Next.js app.
    - Local example: `http://localhost:4000`

- `NEXT_PUBLIC_SITE_URL`
    - Canonical site URL used for absolute links/canonicals/sitemap logic.
    - Local example: `http://localhost:3000`

- `NODE_ENV`
    - Environment mode.
    - Typical local value: `development`

Example `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

Notes:

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser—**never** place secrets in them.
- Because the frontend and backend run on different localhost ports, the backend must allow the frontend origin via **CORS** in development.

---

## 6) Running the Development Servers

You run **two servers** in separate terminals: one for the backend API and one for the frontend.

### Start MongoDB

Use one of the following:

- **Local MongoDB:** ensure `mongod` is running (or start MongoDB as a Windows Service if installed that way).
- **Atlas:** ensure `MONGODB_URI` points to your Atlas cluster and that your IP/network access is allowed.

### Start the backend (Express)

From the backend folder:

```bash
cd backend
npm run dev
```

Backend example URL:

- Express API → `http://localhost:4000`

### Start the frontend (Next.js)

From the frontend folder:

```bash
cd frontend
npm run dev
```

Frontend example URL:

- Next.js → `http://localhost:3000`

---

## 7) Development Workflow

A typical workflow looks like this:

- Start MongoDB (local or Atlas)
- Run the **backend** API server
- Run the **frontend** Next.js dev server
- Implement UI changes in Next.js and make API calls to the Express backend using `NEXT_PUBLIC_API_BASE_URL`
- Verify behavior end-to-end by exercising pages and API endpoints
- Repeat: change backend routes/models, refresh frontend calls, test again

This workflow preserves the intended architecture: **Next.js consumes the Express REST API over HTTP**, and the backend remains a separate service.
