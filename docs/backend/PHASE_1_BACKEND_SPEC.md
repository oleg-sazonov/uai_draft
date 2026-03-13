# Phase 1 Backend Spec (Express API)

This document is the practical implementation guide for Phase 1.

Tech:

- Node.js + Express
- MongoDB + Mongoose
- Zod (runtime validation)
- JWT auth (admin only)
- **No TypeScript**

Goals:

- Implement the API described in the contract
- Enforce slug + visibility/status rules
- Keep the codebase simple and testable (no overengineering)

---

## 1) Folder structure (recommended)

```
src/
  routes/
  controllers/
  services/
  models/
  validators/
  middlewares/
  utils/
  config/
  app.js
  server.js
```

Notes:

- `app.js` wires middleware + routes
- `server.js` starts the HTTP server (and connects DB)

---

## 2) Required layering (do not skip layers)

**Rule:** `validators -> controllers -> services -> models`

### 2.1 Validators (Zod)

- Validate `req.body`, `req.params`, and `req.query`
- Reject invalid payloads **before** controller logic
- Return **HTTP 400** with structured error output

### 2.2 Controllers

- Translate HTTP request → service call → HTTP response
- No database logic in controllers
- No business rules in controllers

### 2.3 Services

- Business rules live here:
    - slug generation + collision handling
    - slug immutability after publish
    - visibility/status enforcement for public endpoints
    - `publishedAt` initialization + immutability (authoritative)
        - On transition `status=draft` → `status=published`: if `publishedAt` is null, set it to the current timestamp
        - On edits to a published record: `publishedAt` must not change
        - On visibility changes (`public`/`internal`/`archived`): `publishedAt` must remain unchanged
- Services call models (Mongoose)

### 2.4 Models (Mongoose)

- Schemas + indexes (including unique slug index)
- Persistence only (no HTTP, minimal business logic)

---

## 3) Public vs Admin API separation

### 3.1 Public API

Must enforce:

- **Only** `status=published` **AND** `visibility=public`

### 3.1.1 List endpoint pagination response shape (required)

All list endpoints must return a **paginated response shape**.

This is required **even when** `page` and `limit` are not provided (defaults still apply).

Response must always include:

- `data`: array of records for the current page
- `pagination`: object describing paging metadata

Canonical response shape:

```json
{
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 0,
        "totalPages": 0
    }
}
```

Public endpoints (examples from contract):

- `GET /api/posts`
- `GET /api/posts/:slug`
- `GET /api/events`

### 3.1.2 Default sorting rules (public lists)

Default sorting must be applied **before pagination** on public list endpoints.

- Posts list (`GET /api/posts`): sort by `publishedAt` **descending** (newest published first)
- Events list (`GET /api/events`): upcoming events sorted by `startDate` **ascending** (soonest first)

### 3.2 Admin API (protected)

- Full access to draft/published + all visibility states (public/internal/archived)
- Requires JWT auth (stored in an HttpOnly cookie) + admin role check
- Route prefix recommendation:
    - `GET /api/admin/...`
    - `POST /api/admin/...`
    - etc.

### 3.3 MEDIA UPLOAD ENDPOINT

Endpoint (admin-only):

- `POST /api/admin/media/images`

Behavior:

- Receives a `multipart/form-data` request with a single file field: `image`.
- Validates file size + MIME type.
- Uploads the image to **Cloudinary** from the backend.
- Returns the Cloudinary `secure_url` to the admin UI.

Storage rule:

- MongoDB stores **URLs only** for media fields (no blobs/buffers).
- The returned URL is persisted when it is saved onto a Post/Event (`featuredImage`, `gallery`, etc.).

Success response (example):

```json
{
    "data": {
        "url": "https://res.cloudinary.com/.../image/upload/..."
    }
}
```

Error handling:

- Validation errors (missing file, wrong type, too large) → HTTP **400** using the standard error shape.
- Cloudinary failures → HTTP **502**/**500** with a non-vendor-leaking message.

Reference: `docs/architecture/MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md`

### 3.4 POST SCHEMA (Phase 0 authoritative)

This backend spec inherits the canonical Post fields from:

- `docs/architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md`

Required fields:

- `title`
- `category`
- `content` (Markdown)
- `featuredImage` (URL)
- `visibility` (`public | internal | archived`)

Optional fields:

- `summary`
- `gallery` (array of URL strings)
- `videoUrl`
- `aidType`
- `partnership`
- `location`

Lifecycle fields:

- `status` (`draft | published`)
- `slug`
- `publishedAt`

Note on “archived”:

- Posts are archived via `visibility=archived` (not a separate `status` value).

---

## 4) Slug generation rules (authoritative)

### 4.1 Base rules

- Slugs are generated from the title
- Slugs must be unique per collection (`posts` vs `events` independently)
- Collision handling uses numeric suffixes:
    - `winter-relief-mission`
    - `winter-relief-mission-1`
    - `winter-relief-mission-2`
- Slug is required (non-empty)

### 4.2 Slug immutability after publication

**Rule:** once `status=published`, slug must never change.

Practical enforcement pattern:

- Create:
    - Generate slug server-side
- Update:
    - If record is already `published`, reject any incoming `slug` changes (request fails)
    - If record is `draft`, allow slug regeneration only if you explicitly decide to (keep it simple; default is “do not change slug unless you must”)

### 4.3 Database enforcement

- Unique index on `slug` for `posts`
- Unique index on `slug` for `events`

---

## 5) Zod validation enforcement (required)

**Rule:** All request payloads are validated using Zod before reaching controllers.

Minimum rules:

- `title`: non-empty string
- `slug`: non-empty string (even if generated server-side, validate it)
- `content` (posts): non-empty string (Markdown)
- `visibility`: enum `public | internal | archived`
- `status`: enum `draft | published`

Date fields:

- `publishedAt` (posts + events): optional Date
- Events:
    - `startDate`: required Date
    - `endDate`: optional Date

Validation error response:

- HTTP 400
- Include Zod error details in a consistent shape

---

## 6) Security basics (baseline only)

### 6.1 Password hashing (admin users)

- Store `passwordHash` only
- Use bcrypt for hashing and comparison
- Never store plaintext passwords

### 6.2 JWT authentication (admin routes only)

- Login endpoint issues JWT
- Admin routes require:
    - JWT verification middleware
    - Admin role check middleware

JWT handling baseline:

- JWT is stored in an **HTTP-only cookie** (cookie-based auth).
- `SameSite=Lax` (baseline)
- `Secure=true` in production
- The `Authorization` header is **not used** in this baseline.

Operational notes:

- Cross-origin admin API calls must use `credentials: "include"` on the frontend.
- Backend CORS must allow credentials and must not use wildcard origins.

### 6.3 Public data safety

- Public endpoints must never leak draft/internal/archived records
- For `GET /api/posts/:slug`, return 404 if not `published + public`

---

## 7) Rate Limiting (Production Baseline)

This is a **baseline** protection to reduce spam and brute-force attempts. It is not an advanced security system.

### Library

- Use `express-rate-limit`

### Apply rate limiting to these endpoints

- `POST /api/contact`
- `POST /api/newsletter`
- `POST /api/admin/login`

### Baseline rules (per IP)

Public submission endpoints:

- **100 requests per 15 minutes per IP** for:
    - `POST /api/contact`
    - `POST /api/newsletter`

Login endpoint (stricter):

- **10 attempts per 15 minutes per IP** for:
    - `POST /api/admin/login`

### Notes

- `GET` public endpoints do **not** require rate limiting at this stage.
- Keep the implementation simple:
    - return standard HTTP **429 Too Many Requests** when the limit is exceeded
    - use a clear error message (do not expose internal details)

## 8) No TypeScript (explicit rule)

**Rule:** Phase 1 backend is JavaScript only.

- Use Zod for runtime safety
- Keep functions small and testable
- Add minimal unit tests where rules are easy to regress (slug collision, public filtering)

---

## 9) Likes (Posts + Events)

A simple public like counter is supported for both Posts and Events.

### Data Model

Both `posts` and `events` collections include:

| Field | Type   | Default | Rule                   |
| ----- | ------ | ------- | ---------------------- |
| likes | Number | 0       | Must never be negative |

---

### Public Endpoints

Posts:

- POST /api/posts/:slug/like
- DELETE /api/posts/:slug/like

Events:

- POST /api/events/:slug/like
- DELETE /api/events/:slug/like

---

### Rules

1. Endpoints only operate on records where:
    - `status=published`
    - `visibility=public`
      Otherwise return 404.

2. POST increments `likes` by 1.

3. DELETE decrements `likes` by 1.
    - Must not allow negative values.
    - If `likes = 0`, return 400.

4. Updates must be atomic (use MongoDB `$inc`).

---

### Response

Successful response:

```json
{
    "likes": 7
}
```

---

## 10) CORS Policy (Environment-Aware Baseline)

CORS is required when the frontend and backend are served from **different origins** (scheme + host + port). If the browser considers the request cross-origin, the API must explicitly allow it.

### Development (local split frontend + API)

In development, the frontend and backend run separately:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

Rules:

- Allow origin: `http://localhost:3000`
- Allow credentials **only if** JWT is stored in HTTP-only cookies (cookie-based auth)

### Production (strict allowlist)

Rules:

- Do **not** use `"*"` for `origin`
- Allow only the production frontend origin (example: `https://example.org`)
- Allow credentials **only if** cookie-based auth is used

### Same-origin deployment (reverse proxy)

If the frontend and backend are served from the **same origin** via reverse proxy (for example, the proxy routes `/api/*` to Express on the same domain), CORS is not required.

Rule:

- In same-origin deployments, CORS can be disabled (or omitted entirely).

### Express baseline (cors middleware)

Use the `cors` middleware in Express, and make configuration depend on `NODE_ENV`.

```js
const cors = require("cors");

const isProd = process.env.NODE_ENV === "production";
const allowedOrigin = isProd
    ? process.env.FRONTEND_ORIGIN
    : "http://localhost:3000";

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
);
```

---

## 11) Practical “done” checklist

- [ ] Folder structure created
- [ ] Zod validators in place for every write endpoint
- [ ] Public endpoints enforce `published + public`
- [ ] Admin endpoints protected with JWT middleware
- [ ] Slug uniqueness + collision handling implemented
- [ ] Slug immutability after publish enforced
- [ ] Unique slug indexes exist in MongoDB
