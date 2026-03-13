# Architecture Lock (Non-Negotiable Decisions)

Purpose: define the project’s **locked** architectural decisions.

These rules are considered constraints for implementation work and for AI-assisted coding.
If a change is proposed that violates a locked rule, it is an **architecture change**, not an implementation detail.

Primary references:

- [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
- [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
- [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
- [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
- [frontend/FRONTEND_ARCHITECTURE.md](frontend/FRONTEND_ARCHITECTURE.md)
- [deployment/ENVIRONMENT_BASELINE.md](deployment/ENVIRONMENT_BASELINE.md)

---

## System Architecture

Locked decisions:

- The system is split into **two services**:
    - Next.js frontend (App Router)
    - Express backend (REST API)
- The frontend consumes the backend via **REST over HTTP** using `NEXT_PUBLIC_API_BASE_URL`.
- Do **not** implement backend business logic inside Next.js API routes/Route Handlers.

---

## Backend Architecture

Locked decisions:

- Backend is **Node.js + Express**.
- Database is **MongoDB** accessed via **Mongoose**.
- Runtime validation uses **Zod**, applied before controller logic.
- Admin authentication is required for protected routes and uses **JWT** stored in **HttpOnly cookies**.

Implementation constraint:

- Backend layering must remain: `validators → controllers → services → models`.

---

## Frontend Architecture

Locked decisions:

- Frontend is **Next.js (App Router)**.
- Public pages must be **server-rendered** for SEO (SSG/ISR/SSR depending on route).
- Admin routes (`/admin/*`) are **client-side only** and must not be indexed.

---

## Data Model Rules

Locked rules:

- Core entities exist as first-class collections/models:
    - Posts
    - Events
    - Contact Messages
    - Newsletter Subscribers
    - Admin Users
- Slugs are required for Posts/Events and are unique per collection.
- **Slug immutability after publication** is required.
- `publishedAt` is set when transitioning draft → published and must not change afterward.

---

## Content Rules

Locked rules:

- Post content is stored as **Markdown** (single string). The backend stores Markdown only.
- Raw HTML is not accepted as a content format.
- Images are stored as **URLs** in MongoDB; media uploads are supported via an admin upload pipeline (Express backend → Cloudinary).

Reference: [architecture/MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md](architecture/MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md)

---

## Security Model

Locked rules:

- Public endpoints must never leak draft/internal/archived content.
- Public filtering rule is mandatory:
    - Only records where `status=published` **AND** `visibility=public` are public.
- Admin endpoints are protected and must remain under `/api/admin/*`.
- Admin JWT is stored in HttpOnly cookies (Authorization header is not the baseline).
- Rate limiting is required at least for:
    - `POST /api/contact`
    - `POST /api/newsletter`
    - `POST /api/admin/login`

---

## Deployment Model

Locked decisions:

- Frontend and backend deploy as **separate services**.
- Environments are: development, staging (optional), production.
- CORS is configured on the backend and is only required when frontend/API are cross-origin.
- Same-origin deployment via reverse proxy (routing `/api/*` to Express) is allowed.

---

## Pagination Model

Locked rule:

- List endpoints use **offset pagination** (Phase 1):
    - `page` is **1-based**
    - `limit` has a maximum of **50**
    - Response shape is `{ data, pagination }`

Reference: [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)

---

## Change Control

If you need to break a locked rule:

- Update the primary references above (especially Phase 0 + API contract).
- Update [SPEC_SYNC_RULES.md](SPEC_SYNC_RULES.md) to prevent drift.
- Treat it as an explicit architecture revision (not a drive-by change).
