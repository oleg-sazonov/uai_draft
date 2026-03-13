# Error Handling Policy (Backend + Next.js)

This document defines a consistent error handling baseline.

Goals:

- predictable HTTP status codes
- consistent JSON errors from the API
- no leaking draft/internal content on the public site

Non-goals:

- no centralized logging system
- no monitoring stack
- no complex error frameworks

---

## 1) Backend (Express API)

### 1.1 Status code rules

- **Validation errors (Zod)** → **400**
- **Unauthorized** (missing/invalid auth) → **401**
- **Forbidden** (authenticated but not allowed) → **403**
- **Not found** → **404**
    - includes: unknown route, missing record
    - includes: attempts to access non-public content from public endpoints
- **Server error** (unexpected) → **500**

Public content rule reminder:

- Public endpoints must behave as if draft/internal/archived content does not exist.
- For example, `GET /api/posts/:slug` must return **404** if the post is not `published + public`.

---

### 1.2 Standard JSON error shape

All error responses should use a consistent shape:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid request payload",
        "details": [{ "path": ["title"], "message": "Required" }]
    }
}
```

Guidelines:

- `code`: stable string for clients/tests (examples below)
- `message`: short human-readable summary
- `details`: optional array for validation errors (Zod), can be omitted otherwise

Recommended `code` values:

- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `INTERNAL_SERVER_ERROR` (500)

---

### 1.3 Validation errors (Zod) → 400

- Validate inputs before controller logic.
- On Zod failure, return:
    - `status: 400`
    - `code: VALIDATION_ERROR`
    - `details`: derived from Zod issues

---

### 1.4 500 handling

- Return a generic message. Do not expose stack traces or internal DB errors to the client.
- It’s acceptable to log errors to console in Phase 1 (basic debugging only).

---

## 2) Frontend (Next.js App Router)

### 2.1 404 handling in dynamic routes

For dynamic public routes (example: `/mission-log/[slug]`):

- If the API returns 404, call `notFound()` in the page component.
- Treat non-public content the same as missing content:
    - do not render drafts/internal/archived content
    - do not show “you don’t have access” on public pages (just 404)

This prevents content leakage and keeps indexing correct.

---

### 2.2 Do not leak draft/internal content

Frontend must assume:

- Public pages only display `status=published` AND `visibility=public`
- Sitemap generation also follows this rule

If the backend enforces this correctly, the frontend’s main job is to:

- handle 404 with `notFound()`
- avoid caching private data in public rendering paths

---

### 2.3 Network error fallback UI (simple baseline)

If a public page cannot load data due to a network or server error:

- Show a basic fallback message like:
    - “We’re having trouble loading this content. Please try again.”
- Avoid displaying raw error details.

Keep it minimal:

- no global error system required
- no monitoring/alerting required in Phase 0

(Next.js route-level `error.tsx` can be used later, but the policy here is about behavior, not a framework mandate.)

---

### 2.4 Backend API unavailable behavior (authoritative)

When the backend API is unavailable (network/server error), the frontend must fail safely.

Public pages:

- Display a minimal fallback message (e.g., “We’re having trouble loading this content. Please try again.”)
- Do not expose raw error details (no stack traces, no internal messages)

Admin pages:

- Display a clear error state indicating the admin data could not be loaded
- Do not leak raw error details or stack traces

Phase 2 constraint:

- No retry loops are required in Phase 2 (keep behavior simple and predictable)
