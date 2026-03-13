# Architecture Entrypoint

## 1 — Purpose

This document provides a fast architectural overview of the UAI system (developer + AI assistant onboarding in under ~30 seconds).

Authoritative architecture documents (source of truth):

- [PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
- [../api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)
- [../backend/PHASE_1_BACKEND_SPEC.md](../backend/PHASE_1_BACKEND_SPEC.md)
- [../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
- [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md)

---

## 2 — System Overview

Component diagram (simplified):

```text
Internet
 ↓
Next.js Frontend (App Router)
 ↓ REST API
Express Backend
 ↓
MongoDB
 ↓
Cloudinary (media storage)
```

Key points:

- Frontend and backend are separate services.
- Backend exposes the REST API consumed by the Next.js frontend.
- MongoDB stores core domain data.
- Cloudinary stores media assets (MongoDB stores URLs only; media lifecycle rules apply).
- Admin media uploads flow: Admin UI → Express API → Cloudinary (backend returns secure URL).

System boundaries (responsibilities):

- Frontend (Next.js): server-render public pages + metadata; provide client-only admin UI; consume backend over REST.
- Backend (Express): enforce business rules; validate inputs; implement auth; query MongoDB; upload/delete media in Cloudinary.
- Database (MongoDB): persist core domain entities; store media references as URL strings only.
- External services: Cloudinary (media storage) and newsletter provider (Mailchimp or similar).

Reference: [SYSTEM_BOUNDARIES.md](SYSTEM_BOUNDARIES.md)

---

## 3 — Core Domain Entities

Core entities:

- Posts
- Events
- Contact Messages
- Newsletter Subscribers
- Admin Users

For canonical schemas and rules, see: [PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)

---

## 4 — Public Content Rule (Critical)

Public content must be filtered by the invariant:

```text
status = published
AND
visibility = public
```

Reference: [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md)

---

## 5 — Rendering Model

Rendering summary:

- `/` → SSG
- `/mission-log` → ISR
- `/mission-log/[slug]` → SSG + ISR
- `/admin/*` → client-side only

Reference: [RENDERING_DECISIONS.md](RENDERING_DECISIONS.md)

---

## 6 — Architecture Invariants

The invariants that must remain true:

1. Public content leakage must not happen.
2. Slugs are immutable after publish.
3. Media lifecycle cleanup is required.
4. Filtering is defined by the backend API.

Reference: [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md)

---

## 7 — Implementation Phases

Phase order:

- Phase 0 — Architecture
- Phase 1 — Backend
- Phase 2 — Frontend
- Phase 3 — Testing
- Phase 4 — Production

---

## 8 — Reading Order (Important)

Recommended reading order:

1. [../DOCS_INDEX.md](../DOCS_INDEX.md)
2. [ARCHITECTURE_ENTRYPOINT.md](ARCHITECTURE_ENTRYPOINT.md)
3. [PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
4. [../api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)
5. [../backend/PHASE_1_BACKEND_SPEC.md](../backend/PHASE_1_BACKEND_SPEC.md)
6. [../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

---

## 9 — AI Safety Rules

- Backend must remain Express.
- Next.js must not implement business logic.
- Public content rule must be enforced.
- Slugs are immutable.
- Admin routes are client-only.
