# UAI Website

# Phase 0 -- Architecture & System Design Specification (Updated)

---

# 1. Overview

**Phase 0 defines architecture decisions only.** No backend or frontend implementation occurs in Phase 0.

This phase includes:

- Definition of all core entities
- Authentication model
- Full routing structure
- Draft & visibility logic
- Admin panel behavior
- Backend scope definition (Phase 1 preparation)
- Frontend scope sequencing (Phase 2 preparation)
- Testing and production hardening sequencing (Phases 3–4 preparation)

The goal is to eliminate structural uncertainty before development.

## 1.1 Updated Project Phase Order (Authoritative)

Replace all previous phase ordering with the following:

- **Phase 0 – Architecture & System Design** (this document)
    - Architecture decisions only (entities, routes, rules, constraints)
- **Phase 1 – Backend Implementation**
    - Backend-first development: database models, validation, auth, APIs
- **Phase 2 – Frontend Implementation (React)**
    - UI built after backend APIs exist
- **Phase 3 – Testing & Stabilization**
    - Dedicated QA phase (integration tests, regression, bug fixes)
- **Phase 4 – Production & Security**
    - Production readiness and security hardening (rate limiting, logging, secrets, etc.)

---

# 2. Core Entities

The system includes five primary entities:

1.  Posts\
2.  Events\
3.  Contact Messages (Forms)\
4.  Newsletter Subscribers\
5.  Admin Users

---

# 2.1 Posts Entity

Posts represent:

- Mission Reports
- News
- Updates

Collection: `posts`

## Fields

Field Type Description

---

\_id ObjectId Unique identifier
title String Post title
slug String Unique URL identifier (**required**)
category Enum mission-report / news / update
summary String Short preview text
content String (Markdown) Main content body (Markdown)
featuredImage String (URL) Main image
gallery Array Additional images (optional)
aidType String Humanitarian aid category
sisterCity String Related sister city (optional)
status Enum draft / published
visibility Enum public / internal / archived
createdAt Date Creation timestamp
updatedAt Date Last update

## 2.1.1 Content Field (Markdown) — Formal Definition

The `content` field is **a Markdown string**.

### Rationale (Why Markdown)

- **Simple, predictable storage**: a single string avoids complex “block-based” content schemas.
- **Easier editing workflow**: Markdown is widely supported and can be edited in basic text areas or lightweight editors.
- **Portability**: Markdown content is easy to move between systems and environments.

### Rendering Model

- Markdown will be **converted to HTML on the frontend** (Phase 2).
- The backend stores Markdown only (source of truth), not generated HTML.

### Security / Input Constraints

- **Raw HTML input is not allowed** in `content`.
    - Do not accept HTML payloads intended to be rendered directly.
    - If a Markdown parser supports embedded HTML, the frontend must render with HTML disabled or sanitized to prevent injection.

### Structured Media Fields Remain Separate

- `featuredImage` and `gallery` remain **separate structured fields**.
- Images are not embedded as rich blocks in `content`; they are handled as:
    - `featuredImage`: primary hero/preview image
    - `gallery`: additional images (optional)

---

# 2.2 Events Entity

Collection: `events`

## Fields

Field Type Description

---

\_id ObjectId Unique ID
title String Event title
slug String URL identifier (**required**)
description Text Event details
date Date Event date
location String Location
featuredImage String Main image
status Enum draft / published
visibility Enum public / internal / archived
createdAt Date Creation timestamp
updatedAt Date Last update

---

# 2.3 Contact Messages (Forms)

Collection: `contact_messages`

## Fields

Field Type Description

---

\_id ObjectId Unique ID
name String Sender name
email String Sender email
message Text Message content
status Enum pending / responded
createdAt Date Submission date

---

# 2.4 Newsletter Subscribers

Collection: `newsletter_subscribers`

## Fields

Field Type Description

---

\_id ObjectId Unique ID
email String Subscriber email
status Enum active / unsubscribed
subscribedAt Date Subscription date

---

# 2.5 Admin Users Entity

Collection: `admins`

Purpose: Secure access to the admin panel.

## Fields

Field Type Description

---

\_id ObjectId Unique ID
email String (unique) Login email
passwordHash String Hashed password
role Enum admin
isActive Boolean Account status
createdAt Date Creation date
updatedAt Date Last update

Passwords are stored as hashes (bcrypt).\
Authentication will be handled via JWT or secure HTTP-only cookies.

---

# 3. Slug Strategy & URL Integrity

This section defines **authoritative slug rules** for **Posts** and **Events**.

## 3.1 Rules

1.  **Slugs are automatically generated from the title.**
2.  **Slugs must be unique within the collection** (`posts` and `events` independently).
3.  **Collision handling uses numeric suffixes** appended to the base slug:

    Example:
    - `winter-relief-mission`
    - `winter-relief-mission-1`
    - `winter-relief-mission-2`

4.  **Slugs are immutable after publication.**
    - Once `status=published`, the slug must not change.
    - Title edits after publication must not regenerate the slug.
5.  **Slug uniqueness must be enforced at the database level.**
    - Unique index on `slug` for `posts`
    - Unique index on `slug` for `events`
6.  **Slug is required** for both Posts and Events (no null/empty slugs).

## 3.2 Why Slug Immutability Matters

- **SEO**: stable URLs preserve search engine ranking and indexing.
- **Stable URLs**: users can reliably bookmark and revisit content.
- **External linking safety**: prevents broken links from partners, press, and social shares.

---

# 4. Draft & Visibility Logic

The system separates:

- Status (editorial state)
- Visibility (display rule)

---

# 4.1 Status

Values:

- draft
- published

Draft: - Exists in database - Not visible publicly - Editable in admin
panel

Published: - Ready for display

---

# 4.2 Visibility

Values:

- public
- internal
- archived

Public: - Visible on website

Internal: - Visible only in admin panel

Archived: - Hidden from public - Hidden from default admin view

---

# 4.3 Combined Logic

Status Visibility Result

---

draft internal Only in admin
published public Visible publicly
published internal Not public
published archived Hidden

## 4.4 API Enforcement Rule (Backend обязательное поведение)

Backend filtering must enforce:

- **Public API:** only records with **`status=published` AND `visibility=public`** are visible.
- **Admin API (protected):** may access drafts and internal content.
    - Archived content is accessible to admins but should be excluded from “default” list views unless explicitly requested (e.g., `?includeArchived=true`).

---

# 5. Routing Structure

## 5.1 Public Routes

/\
/mission-log\
/mission-log/:slug\
/sister-cities\
/sister-cities/:slug\
/sister-states\
/about\
/about/our-work\
/about/meet-the-team\
/about/partners\
/press\
/contact\
/donate\
/faq

---

## 5.2 Authentication Routes

/login\
/logout

---

## 5.3 Admin Routes (Protected)

/admin\
/admin/posts\
/admin/posts/new\
/admin/posts/:id/edit\
/admin/events\
/admin/events/new\
/admin/events/:id/edit\
/admin/forms\
/admin/forms/:id\
/admin/newsletter

All admin routes require authentication.

---

# 6. Admin Panel Logic

Posts: - Create - Save as draft - Publish - Edit - Archive

Events: - Create - Publish - Archive

Forms: - View - Mark responded - Archive

Newsletter: - View - Export CSV - Unsubscribe

Authentication: - Login required - JWT verification middleware - Role
check (admin only)

---

# 7. Phase 1 -- Backend Implementation (Scope & Architecture)

Phase 1 is **backend-first**. Frontend work (React) begins only after the backend APIs and rules are implemented and stable.

## 7.1 Recommended Folder Structure

```
src/
  routes/
  controllers/
  services/
  models/
  validators/
  middlewares/
  utils/
```

## 7.2 Separation of Concerns (Required Flow)

Enforce the following layering:

1.  **Validation** (runtime)
    - Validates request payloads and params before business logic runs
2.  **Controller**
    - Handles request/response, calls services, returns appropriate status codes
3.  **Service**
    - Business rules (status/visibility enforcement, slug rules, etc.)
4.  **Model**
    - Database schema and persistence (MongoDB collections as defined)

**Rule:** `validators -> controller -> service -> model` (no skipping layers).

## 7.3 Public API vs Admin API Separation

Backend must clearly separate public and admin surfaces:

- **Public API**
    - Enforces: only `status=published` + `visibility=public`
    - No access to drafts/internal/archived
- **Admin API (protected)**
    - Allows managing draft/published and all visibility states
    - Must require authentication + admin role

(Exact route prefixes are implementation detail, but separation must be explicit and testable.)

## 7.4 Backend Language & Validation (No TypeScript)

- Backend will **NOT** use TypeScript.
- Runtime validation will be implemented using **Zod**.
- **All request payloads must be validated before reaching controllers.**
- Validation errors must return **HTTP 400** with a structured error response.

### 7.4.1 Zod Schema Example (Pseudo-code)

```js
// Example shape only (pseudo-code)
const PostCreateSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1), // generated server-side, still validated
    category: z.enum(["mission-report", "news", "update"]),
    summary: z.string().min(1),
    content: z.string().min(1), // Markdown string
    featuredImage: z.string().url().optional(),
    gallery: z.array(z.string().url()).optional(),
    aidType: z.string().optional(),
    sisterCity: z.string().optional(),
    status: z.enum(["draft", "published"]),
    visibility: z.enum(["public", "internal", "archived"]),
});
```

---

# 8. Phase 0 Completion Criteria

Phase 0 is complete when:

- All entities confirmed
- Authentication model confirmed
- Routing confirmed
- Visibility & draft logic confirmed (including public API enforcement rule)
- Slug strategy confirmed (generation, uniqueness, immutability, DB enforcement)
- Admin logic confirmed
- Backend implementation scope defined (Phase 1)
- No structural changes pending

Then development moves to **Phase 1 (Backend Implementation)**, followed by **Phase 2 (Frontend Implementation - React)**, then **Phase 3 (Testing & Stabilization)**, and finally **Phase 4 (Production & Security)**.
