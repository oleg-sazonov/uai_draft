# Frontend Structure (Next.js App Router)

This document describes the **file structure of the Next.js frontend**.

It is an implementation map for Phase 2 and complements:

- PHASE_2_NEXTJS_FRONTEND_SPEC.md
- FRONTEND_ARCHITECTURE.md
- SEO_BASELINE.md

Architecture rules remain defined in those documents.

---

# Service Location

frontend/

The frontend is implemented using **Next.js App Router**.

Technology stack:

Next.js
React Server Components
React Client Components
Axios (admin API calls)
Native fetch (server-side data fetching)

---

# Frontend Folder Structure

frontend/

package.json
next.config.js
.env.example

app/

layout.jsx
page.jsx

mission-log/
page.jsx

mission-log/[slug]/
page.jsx

sister-cities/
page.jsx

sister-cities/[slug]/
page.jsx

contact/
page.jsx

donate/
page.jsx

login/
page.jsx

admin/
layout.jsx
page.jsx

admin/posts/
page.jsx

admin/events/
page.jsx

admin/forms/
page.jsx

admin/newsletter/
page.jsx

robots.ts
sitemap.ts

lib/
api.js

components/
LikesWidget.jsx

---

# Routing Overview

Next.js App Router maps files to routes.

Example mappings:

| File                            | Route              |
| ------------------------------- | ------------------ |
| app/page.jsx                    | /                  |
| app/mission-log/page.jsx        | /mission-log       |
| app/mission-log/[slug]/page.jsx | /mission-log/:slug |
| app/sister-cities/page.jsx      | /sister-cities     |
| app/sister-cities/[slug]/page.jsx | /sister-cities/[slug] |
| app/contact/page.jsx            | /contact           |
| app/donate/page.jsx             | /donate            |
| app/login/page.jsx              | /login             |

Admin routes:

| File                          | Route             |
| ----------------------------- | ----------------- |
| app/admin/page.jsx            | /admin            |
| app/admin/posts/page.jsx      | /admin/posts      |
| app/admin/events/page.jsx     | /admin/events     |
| app/admin/forms/page.jsx      | /admin/forms      |
| app/admin/newsletter/page.jsx | /admin/newsletter |

---

# Rendering Strategy

Rendering rules follow the architecture documentation.

Route rendering matrix:

/ → Static Site Generation (SSG)

/mission-log → Incremental Static Regeneration (ISR)

/mission-log/[slug] → SSG + ISR

/sister-cities → SSG

/sister-cities/[slug] → SSG

/admin/\* → client-side only

Admin routes must not be indexed by search engines.

---

# Server vs Client Components

Public pages use **Server Components** by default.

These components:

- fetch data from the Express API
- render HTML on the server
- support SSG / ISR

Note:

- Sister Cities pages (`/sister-cities` and `/sister-cities/[slug]`) are **static SSG pages**.
- They are **not served by the Express API**, are **not stored in MongoDB**, and are **not managed by the admin panel**.
- Sister City slugs are defined **manually in the frontend content source**.

Example usage:

fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`)

Admin pages use **Client Components** because they require:

- form state
- authenticated API requests
- interactive UI

Client components begin with:

"use client"

---

# API Communication

Frontend communicates with the backend using:

NEXT_PUBLIC_API_BASE_URL

Example:

fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`)

Admin interfaces may use Axios for authenticated requests.

Shared API utilities live in:

lib/api.js

---

# Sitemap and Robots

Next.js provides native support for:

robots.ts
sitemap.ts

sitemap.ts must fetch slugs from:

GET /api/posts/slugs

Only records with:

status = published
visibility = public

are included in the sitemap.

---

# Prototype Migration Rule

The existing static HTML prototype is the visual reference.

During migration:

- reuse the same HTML structure
- reuse existing CSS classes
- avoid redesigning layout

The goal is to reproduce the prototype using React components.

---

# Notes

This file documents **frontend structure only**.

Authoritative rules remain defined in:

PHASE_2_NEXTJS_FRONTEND_SPEC.md
FRONTEND_ARCHITECTURE.md
SEO_BASELINE.md
