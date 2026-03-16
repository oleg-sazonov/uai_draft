# AI Implementation Rules

Strict implementation constraints for AI-assisted development (Copilot, ChatGPT, Claude).

**Purpose:** Prevent architecture drift during AI-assisted coding by defining rules that all generated code must follow. These rules are derived from the authoritative architecture documents and must not be overridden by AI suggestions.

Reference documents:

- [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
- [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
- [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
- [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
- [architecture/ARCHITECTURAL_INVARIANTS.md](architecture/ARCHITECTURAL_INVARIANTS.md)

---

## 1. Core Architecture Rules

### Backend stack

- Node.js
- Express
- MongoDB + Mongoose
- Zod (runtime validation)
- ES Modules (`"type": "module"` in `package.json`)
- No TypeScript
- JWT auth (HttpOnly cookie, admin only)

### Frontend stack

- Next.js (App Router)
- Server Components for public pages (default)
- Client Components for admin UI (`"use client"`)

### Separation rule

The backend is a **separate Express API service**. The Next.js frontend consumes it over HTTP. Do not move backend logic into Next.js API routes or Route Handlers (except for future on-demand revalidation triggers).

---

## 2. Backend Layering Rules (Mandatory)

All backend code must follow this order:

```
validators → controllers → services → models
```

### Validators (Zod)

- Validate `req.body`, `req.params`, and `req.query`
- Reject invalid payloads **before** controller logic
- Return HTTP 400 with structured error output
- The combination `status=draft` + `visibility=archived` must be rejected

### Controllers

- Translate HTTP request → service call → HTTP response
- **No business logic in controllers**
- **No database calls in controllers**
- No slug generation, no visibility checks, no lifecycle enforcement

### Services

- All business rules live here:
    - Slug generation + collision handling
    - Slug immutability after publish
    - Visibility/status enforcement for public endpoints
    - `publishedAt` initialization and immutability
- Services call models (Mongoose)

### Models (Mongoose)

- Schema definitions only
- MongoDB indexes (including unique slug indexes)
- No HTTP logic, no business rules

---

## 3. Slug Rules

- Slugs are generated **server-side** from the title
- Slugs must be **unique per collection** (`posts` and `events` independently)
- Slugs are **immutable after publish** (`status=published` → slug must never change)
- Title edits after publication must **not** regenerate the slug
- Collision handling uses numeric suffixes: `winter-relief`, `winter-relief-1`, `winter-relief-2`
- Concurrency safety: unique DB index + service-level E11000 retry logic

AI tools must never generate code that:

- Allows slug modification on published records
- Skips the unique index on slug fields
- Uses client-supplied slugs without server-side generation

---

## 4. Public Content Rule

All public API endpoints must return **only** records where:

```
status = published  AND  visibility = public
```

This rule must **never** be bypassed.

Enforcement:

- Backend queries must filter at the database level
- If a record exists but is not publicly visible, the API must return **404**
- Public pages must never call `/api/admin/*` endpoints
- Frontend must not rely on client-side hiding of draft/internal content

Reference: [architecture/ARCHITECTURAL_INVARIANTS.md — Invariant 1](architecture/ARCHITECTURAL_INVARIANTS.md)

---

## 5. Rendering Rules

Public pages use server rendering. Admin pages use client-side rendering.

| Route                     | Rendering Mode   |
| ------------------------- | ---------------- |
| `/mission-updates`        | ISR              |
| `/mission-updates/[slug]` | SSG + ISR        |
| `/events`                 | ISR              |
| `/events/[slug]`          | SSG + ISR        |
| `/`                       | SSG              |
| `/sister-cities`          | SSG              |
| `/sister-cities/[slug]`   | SSG              |
| `/admin/*`                | Client-side only |

Rules:

- ISR revalidation interval: `revalidate = 60`
- Dynamic routes must set `dynamicParams = true`
- `generateStaticParams` must use `/api/posts/slugs` and `/api/events/slugs`
- Admin routes must be blocked from indexing via robots policy

Reference: [architecture/RENDERING_DECISIONS.md](architecture/RENDERING_DECISIONS.md)

---

## 6. Media Rules

Images are uploaded through:

```
Admin UI → Express API → Cloudinary
```

Rules:

- MongoDB stores **URLs only** (no blobs, no buffers, no base64)
- The backend uploads to Cloudinary and returns `secure_url`
- The admin UI must **not** upload directly to Cloudinary
- When media is replaced or removed, the backend must delete the old Cloudinary asset
- When a Post or Event is deleted, associated media must also be deleted

AI tools must never generate code that:

- Stores image data in MongoDB
- Uploads from the frontend directly to Cloudinary
- Skips Cloudinary cleanup on media replacement or record deletion

Reference: [architecture/ARCHITECTURAL_INVARIANTS.md — Invariant 3](architecture/ARCHITECTURAL_INVARIANTS.md)

---

## 7. Like System Rules

Both Posts and Events include:

```
likes: Number (default: 0)
```

### Endpoints

- `POST /api/posts/:slug/like` — increment
- `DELETE /api/posts/:slug/like` — decrement
- `POST /api/events/:slug/like` — increment
- `DELETE /api/events/:slug/like` — decrement

### Rules

- Like endpoints only operate on records where `status=published` AND `visibility=public` (otherwise 404)
- Value must **never** be negative
- If `likes = 0` on decrement, return HTTP 400
- Updates must be atomic (use MongoDB `$inc`)
- User like history is **not** stored in the database
- Frontend manages per-user like state (e.g., localStorage)

AI tools must never generate code that:

- Stores per-user like records in MongoDB
- Allows negative like counts
- Operates on non-public records

---

## 8. API Response Shape

### List endpoints

All list endpoints must return:

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

This shape is required even when `page` and `limit` query parameters are not provided (defaults apply).

### Single-resource endpoints

Single-resource endpoints return:

```json
{
    "data": {}
}
```

### Like endpoints

Like endpoints return:

```json
{
    "likes": 7
}
```

AI tools must never generate code that returns raw arrays, unwrapped objects, or inconsistent response shapes.

---

## 9. AI Safety Rules

### AI tools must NOT

- Modify architecture decisions defined in Phase 0
- Introduce new database entities or collections
- Add new API endpoints not defined in the API contract
- Move business logic into controllers (must stay in services)
- Bypass Zod validation on any write endpoint
- Expose draft, internal, or archived content through public endpoints
- Use `require()` or `module.exports` (ES Modules only)
- Introduce TypeScript (backend is JavaScript only)
- Add Next.js API routes for backend business logic
- Use `Authorization: Bearer` header (auth uses HttpOnly cookies)

### AI tools must follow

The architecture authority order when documents conflict.

Authority order is defined in:
[ai/AI_IMPLEMENTATION_AUTHORITY.md](ai/AI_IMPLEMENTATION_AUTHORITY.md)

### When in doubt

If a requested change conflicts with any rule in this document:

1. **Flag the conflict explicitly**
2. Cite the specific rule and reference document
3. Propose the smallest compliant alternative
4. Do not proceed with the conflicting change
