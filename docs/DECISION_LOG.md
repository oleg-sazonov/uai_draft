# Architecture Decision Log (ADR)

Project: Ukraine Aid International Website
Architecture style: Next.js Frontend + Express API Backend
Status: Active

---

# ADR-001 — Backend remains a separate Express service

Status: Accepted

The backend is implemented as a standalone **Node.js + Express REST API**.

The Next.js frontend communicates with the backend via HTTP using REST endpoints.

Next.js API routes are explicitly **not used** for core backend functionality.

Rationale:

- Clear separation of concerns
- Easier scaling and deployment
- Backend rules remain centralized

---

# ADR-002 — Content is stored as Markdown

Status: Accepted

Post content is stored in the database as **Markdown strings**.

Markdown is rendered to HTML on the frontend.

Raw HTML input is not accepted.

Rationale:

- Simple and portable content format
- Easier editing workflow
- Reduced XSS surface
- Content remains human-readable

---

# ADR-003 — Slugs are immutable after publication

Status: Accepted

Slugs are automatically generated from the post or event title.

Once a record transitions to `status = published`, the slug **must never change**.

Rationale:

- Preserves SEO indexing
- Prevents broken external links
- Ensures URL stability

---

# ADR-004 — Sister Cities are static pages

Status: Accepted

Sister City partnership pages are implemented as **static Next.js pages**.

They are **not stored in MongoDB** and are **not editable via the admin panel**.

Rationale:

- Content changes infrequently
- Avoids unnecessary backend complexity
- Improves SEO and performance (SSG)

---

# ADR-005 — Public API filtering rule

Status: Accepted

Public API endpoints must return only records where:

status = published
AND
visibility = public

All other records must behave as if they do not exist.

Rationale:

- Prevent draft or internal content leakage
- Simplifies frontend logic
- Ensures SEO correctness

---

# ADR-006 — Pagination model

Status: Accepted

All list endpoints use **offset-based pagination**.

Query parameters:

page (1-based)
limit (default 10, max 50)

Response shape:

{
"data": [],
"pagination": {
"page": 1,
"limit": 10,
"total": 0,
"totalPages": 0
}
}

Rationale:

- Simple implementation
- Compatible with admin tables
- Easy to reason about in API responses

---

# ADR-007 — Authentication model

Status: Accepted

Admin authentication uses **JWT stored in HttpOnly cookies**.

Admin endpoints are protected under `/api/admin/*`.

Rationale:

- Simpler security model
- Compatible with browser-based admin UI
- Avoids exposing tokens to client JavaScript

---

# ADR-008 — Images stored as URLs

Status: Accepted

The backend stores **image URLs only**.

Admin media upload exists and is implemented via Cloudinary.

Finalized architecture decision:

- Admin uploads media by sending multipart uploads to the backend.
- Backend uploads media to Cloudinary.
- MongoDB stores **media URLs only** (no blobs/buffers).
- Backend is responsible for lifecycle cleanup (delete replaced/removed assets; prevent orphaned Cloudinary assets).

Rationale:

- Keeps MongoDB focused on domain data (URLs only)
- Offloads storage and delivery to a media CDN (Cloudinary)
- Centralizes lifecycle cleanup rules in the backend (no orphaned assets)

---

# ADR-009 — Backend-first development

Status: Accepted

Development order:

Phase 1 → Backend implementation
Phase 2 → Next.js frontend implementation

Rationale:

- Stabilizes API contract
- Reduces frontend rework
- Ensures backend rules are authoritative

---

# ADR-010 — Newsletter system scope

Status: Accepted

The system **only collects email addresses**.

It does not:

- send emails
- manage unsubscribe lifecycle
- run campaigns

Email marketing is handled by an external platform (e.g., Mailchimp).

Rationale:

- Avoid building an internal email platform
- Keeps system scope minimal
