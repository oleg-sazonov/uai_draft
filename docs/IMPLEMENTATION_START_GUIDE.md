# Implementation Start Guide

This document explains **how to begin implementation safely** for the UAI Website project.

It provides a quick orientation for developers and AI assistants before coding begins.

Authoritative architecture rules are defined in:

- ai/AI_CONTEXT.md
- ARCHITECTURE_LOCK.md
- SPEC_SYNC_RULES.md
- DOCS_INDEX.md

---

# Current Repository State

The repository currently contains:

- a **static HTML prototype**
- full **architecture documentation**
- empty implementation directories

Structure:

```
frontend/
backend/
docs/
```

Prototype HTML files at the repository root serve as the **UI reference**.

---

# Implementation Order

Development follows a strict phase order.

Phase 0 — Architecture and documentation
Phase 1 — Backend implementation (Express API)
Phase 2 — Frontend implementation (Next.js App Router)
Phase 3 — Testing and stabilization
Phase 4 — Production hardening

Backend implementation must begin **before frontend development**.

---

# Phase 1 — Backend

Backend location:

```
backend/
```

Technology stack:

- Node.js
- Express
- MongoDB
- Mongoose
- Zod
- JWT authentication

Architecture layering is mandatory:

```
validators → controllers → services → models
```

Details are defined in:

- PHASE_1_BACKEND_SPEC.md
- API_CONTRACT_NEXTJS.md
- ERROR_HANDLING_POLICY.md

---

# Phase 2 — Frontend

Frontend location:

```
frontend/
```

Technology stack:

- Next.js (App Router)
- React Server Components
- React Client Components

Public pages must be **server-rendered**.

Rendering strategy:

| Route               | Rendering   |
| ------------------- | ----------- |
| /                   | SSG         |
| /mission-log        | ISR         |
| /mission-log/[slug] | SSG + ISR   |
| /sister-cities      | SSG         |
| /admin/\*           | client-only |

Rendering rules are defined in:

RENDERING_DECISIONS.md

---

# Backend API Boundary

The backend remains a **separate Express service**.

Next.js must communicate with the API using:

```
NEXT_PUBLIC_API_BASE_URL
```

Business logic must **never** be implemented inside Next.js API routes.

---

# Prototype Migration Rule

The static HTML prototype is the **approved UI reference**.

During migration to Next.js:

- reuse HTML structure
- reuse CSS classes
- avoid redesigning layout

---

# Public Content Rule

Public endpoints must only return content where:

```
status = published
visibility = public
```

Otherwise return **404**.

---

# Slug Rule

Once a post or event is published:

- its slug must never change

This rule protects SEO and stable URLs.

---

# Before Writing Code

Confirm the following documents are synchronized:

- API_CONTRACT_NEXTJS.md
- PHASE_1_BACKEND_SPEC.md
- PHASE_2_NEXTJS_FRONTEND_SPEC.md

If changes are made to endpoints or response shapes, update all related specs according to:

SPEC_SYNC_RULES.md
