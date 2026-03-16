# AI Context (UAI)

This document is a fast, machine-readable context primer for AI tools (ChatGPT, Copilot, Claude).
It summarizes the authoritative architecture so implementation work stays aligned.

Primary sources:

- [../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
- [../api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)
- [../backend/PHASE_1_BACKEND_SPEC.md](../backend/PHASE_1_BACKEND_SPEC.md)
- [../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
- [../frontend/FRONTEND_ARCHITECTURE.md](../frontend/FRONTEND_ARCHITECTURE.md)
- [../deployment/ENVIRONMENT_BASELINE.md](../deployment/ENVIRONMENT_BASELINE.md)

---

## Recommended Reading Order

Fast onboarding reading order:

1. [../DOCS_INDEX.md](../DOCS_INDEX.md)
2. [AI_CONTEXT.md](AI_CONTEXT.md)
3. [../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
4. [../api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)
5. [../backend/PHASE_1_BACKEND_SPEC.md](../backend/PHASE_1_BACKEND_SPEC.md)
6. [../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

Architecture authority order is defined in:
[AI_IMPLEMENTATION_AUTHORITY.md](AI_IMPLEMENTATION_AUTHORITY.md)

---

## 1) Project Overview

UAI is a small nonprofit, content-driven website with an admin panel.
The public site publishes posts (categorized using the canonical Post category set) and events, and collects contact messages and newsletter signups.
SEO is a baseline requirement: public pages must ship indexable HTML + correct metadata.

---

## 2) System Architecture

```text
Internet
 ↓
Next.js Frontend (App Router)
 ↓ REST API
Express Backend
 ↙           ↘
MongoDB       Cloudinary (media storage)
	(stores media URLs only)
```

The backend enforces publishing/visibility rules and provides the REST API.
The frontend is responsible for rendering public pages (SSG/ISR) and providing a client-only admin UI.

---

## Architecture Lock Summary

Locked decisions (must remain intact):

- Frontend: Next.js App Router
- Backend: Node.js + Express REST API
- Database: MongoDB
- Media storage: Cloudinary
- Admin authentication: JWT stored in HttpOnly cookies
- Frontend/backend separation must remain intact (no backend business logic in Next.js API routes)

Reference: [../ARCHITECTURE_LOCK.md](../ARCHITECTURE_LOCK.md)

---

## 3) Technology Stack

- Frontend: Next.js (App Router), React Server Components + Client Components
- Backend: Node.js + Express (separate service)
- Database: MongoDB (Mongoose)
- Validation: Zod (runtime validation, before controllers)
- Auth: JWT for admin routes (stored in HttpOnly cookies)
- Media storage: Cloudinary (MongoDB stores URLs only)

---

## 4) Core Entities

- Posts: core content items (canonical categories) stored as Markdown + metadata; slug-based URLs.
- Events: time-based content with `startDate` and optional `endDate`.
- Contact Messages: stored submissions with a simple status (pending/responded).
- Newsletter Subscribers: email addresses collected for export to an external email platform.
- Admin Users: small trusted set; password hashes stored; used to access admin API/UI.

---

## 5) Rendering Strategy

Public routes are server-rendered for SEO; admin routes are client-side only.
Baseline rendering matrix:

- `/` → SSG
- `/mission-updates` → ISR
- `/mission-updates/[slug]` → SSG + ISR
- `/sister-cities` → SSG
- `/sister-cities/[slug]` → SSG
- `/admin/*` → client-side only

---

## 6) API Boundary

The Next.js app is not the backend.
Next.js must consume the Express API over HTTP using `NEXT_PUBLIC_API_BASE_URL`.
Do not move business logic into Next.js API routes/Route Handlers.

---

## 7) Public Content Rules

Public endpoints and public pages must only expose content where:

- `status = published` AND `visibility = public`

Non-public content must behave as if it does not exist (return 404 for public reads).


## Core Architecture Invariants

These are the non-negotiable invariants AI tools should assume:

- Public content rule: only `status=published AND visibility=public` is public.
- Slug immutability after publication.
- Media lifecycle cleanup is required (no orphaned Cloudinary assets).
- Backend is the authority for business rules and filtering semantics.

Reference: [../architecture/ARCHITECTURAL_INVARIANTS.md](../architecture/ARCHITECTURAL_INVARIANTS.md)

---

## Lifecycle Management

Content and media lifecycle behavior is defined in:

[../architecture/LIFECYCLE_MANAGEMENT.md](../architecture/LIFECYCLE_MANAGEMENT.md)

This document explains how Posts, Events, media assets, and contact messages behave over time.

---

## 8) Security Model

- Admin authentication only (no public user accounts).
- Admin passwords are stored as hashes (bcrypt).
- JWT is used to protect admin endpoints and is stored in an HttpOnly cookie (`SameSite=Lax`, `Secure` in production).
- Input validation is required via Zod before controller logic.
- Rate limiting applies at least to `POST /api/contact`, `POST /api/newsletter`, and `POST /api/admin/login`.

---

## 9) Deployment Model

- Frontend and backend deploy as separate services.
- MongoDB is typically hosted on Atlas.
- Environments: development, staging (optional), production.
- CORS is required only when frontend and API are on different origins; same-origin reverse proxy is allowed.

---

## AI Context Anchors

AI_CONTEXT_ANCHOR: BACKEND_BOUNDARY
The backend remains a separate Express REST API service; do not implement backend logic in Next.js API routes.

AI_CONTEXT_ANCHOR: RENDERING_STRATEGY
Public pages use SSG/ISR (and SSR only if needed); `/admin/*` is client-side only and not indexable.

AI_CONTEXT_ANCHOR: PUBLIC_FILTERING_RULE
Public API and public rendering must enforce `status=published AND visibility=public`; otherwise return 404 (no content leakage).

AI_CONTEXT_ANCHOR: SLUG_IMMUTABILITY
Once a record is published, its slug must never change (URL/SEO stability).

AI_CONTEXT_ANCHOR: CONTENT_FORMAT
Post bodies are stored as Markdown strings; raw HTML is not accepted as content (render safely on the frontend).

AI_CONTEXT_ANCHOR: ADMIN_SCOPE
Admin UI exists only under `/admin/*` and is not SEO-targeted; admin endpoints are protected via JWT.

AI_CONTEXT_ANCHOR: API_PAGINATION_MODEL
List endpoints use offset pagination via `page` (1-based) and `limit` (max 50) and return `{ data, pagination }`.
