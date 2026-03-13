# Environment Baseline (Phase 0)

This document defines the **minimum** environment configuration and deployment rules for Ukraine Aid International.

It is intentionally simple and avoids DevOps complexity.

---

## 1) Environments

We support three environments:

### 1.1 Development

- Used on a developer machine
- Fast iteration, local debugging
- Can use a local MongoDB or a shared dev database

### 1.2 Staging (optional but recommended)

- A production-like environment for review/testing
- Recommended to prevent indexing (see robots policy below)

### 1.3 Production

- Public website
- Must follow SEO rules (server-rendered pages, correct metadata, sitemap/robots behavior)

---

## 2) Required environment variables

### 2.1 Backend (Express API)

Required:

- `MONGODB_URI`  
  MongoDB connection string.

- `JWT_SECRET`  
  Secret used to sign/verify JWTs (admin auth). Must be strong and private.

- `NODE_ENV`  
  One of: `development` | `staging` | `production`.

- `PORT`  
  Port the API listens on (example: `4000`).

Notes:

- Do not commit `.env` files to the repository.
- Production secrets must not be shared with developers.

---

### 2.2 Frontend (Next.js)

Required:

- `NEXT_PUBLIC_API_BASE_URL`  
  Base URL of the Express API service used by the Next.js app.  
  Examples:
    - Development: `http://localhost:4000`
    - Production: `https://api.example.org`

- `NEXT_PUBLIC_SITE_URL`  
  The canonical public site URL used for sitemap and canonical links.  
  Example: `https://ukraineaidinternational.org`

- `NODE_ENV`  
  One of: `development` | `staging` | `production`.

Notes:

- `NEXT_PUBLIC_*` variables are exposed to the browser. Do not put secrets in them.

---

## 3) Robots behavior per environment

Robots behavior is enforced by the Next.js frontend (App Router), not the API.

### 3.1 Production robots policy

- Allow indexing of public routes
- Block admin routes

Minimum rules:

- Allow: `/`
- Disallow: `/admin/`

### 3.2 Staging robots policy

- Block indexing entirely to avoid duplicate/preview content in search engines

Minimum rule:

- Disallow: `/`

### 3.3 Development robots policy

- Not important for SEO (typically not publicly accessible)
- Recommended: block indexing if it is ever exposed publicly

Minimum rule:

- Disallow: `/`

---

## 4) Sitemap base URL source

**Rule:** The sitemap must build absolute URLs using:

- `NEXT_PUBLIC_SITE_URL`

This ensures:

- correct canonical domain in production
- staging/development can generate correct links when needed without hardcoding

---

## 5) Deployment baseline rules (no DevOps complexity)

- Backend and frontend are deployed as **separate services**.
- Environment variables are set per environment (dev/staging/prod).
- No special hosting assumptions are made in this document.

**Explicit statement:**

> No container orchestration, no CI/CD policy defined at this stage.

(Those decisions can be made later without changing the application architecture.)

---

## 6) CORS Behavior per Environment

**Rule:** CORS configuration belongs to the backend (Express API). The frontend may call the API, but only the API can decide which origins are allowed.

### 6.1 Development

In development, the frontend and backend run on different localhost ports (different origins), so CORS is required.

- Allow origin: `http://localhost:3000`

### 6.2 Production (separate domains)

If the frontend and backend are deployed on different domains, CORS is required.

- Allow only the known production frontend origin (example: `https://example.org`)
- Do **not** use wildcard `"*"`
- Allow credentials only if needed (for example, cookie-based auth)

### 6.3 Production (single-domain via reverse proxy)

If the frontend and API are served from the same origin via reverse proxy (same domain), CORS is not required.

- Same-origin architecture is preferred for simplicity when feasible
- CORS can be disabled (or omitted entirely) in this deployment mode
