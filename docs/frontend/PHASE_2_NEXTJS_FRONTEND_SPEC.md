# Phase 2 Next.js Frontend Spec (App Router)

This document defines how we implement the frontend in Phase 2.

Context:

- Frontend: Next.js (App Router)
- Backend: separate Express API service (REST)
- Must align with: [api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)
- Must follow: [seo/SEO_BASELINE.md](../seo/SEO_BASELINE.md) and [architecture/RENDERING_DECISIONS.md](../architecture/RENDERING_DECISIONS.md)

Goals:

- Preserve the approved UX from the HTML prototype
- Implement server-rendered public pages with correct metadata
- Keep admin pages client-side only (not indexable)

Non-goals:

- No redesign
- No new features
- No enterprise state management

---

## 1) App Router structure (baseline)

Recommended structure:

```
app/
  layout.tsx (or layout.jsx)
  page.tsx                     // /
  mission-log/
    page.tsx                   // /mission-log
    [slug]/
      page.tsx                 // /mission-log/[slug]
  sister-cities/
    page.tsx                   // /sister-cities
  admin/
    layout.tsx                 // admin shell (client)
    page.tsx                   // redirect or landing
    posts/
      page.tsx
      new/
        page.tsx
      [id]/
        edit/
          page.tsx
    events/...
    forms/...
    newsletter/...
  sitemap.ts                   // sitemap generation
  robots.ts                    // robots policy
```

Notes:

- Public pages use Server Components by default
- Admin pages are Client Components (see Section 3)

---

## 2) Data fetching strategy (fetch vs Axios)

### 2.1 Server Components: use `fetch`

**Rule:** In Server Components (public pages), use the built-in `fetch`:

- Works with Next.js caching + revalidation
- Keeps dependencies minimal

Baseline:

- Define a small API utility for building URLs to the Express API
- Use `next: { revalidate: 60 }` for ISR pages (see Section 6)
- Public list endpoints return a paginated response shape: `{ data, pagination }` (see the API contract)

### 2.3 API Pagination Model (Frontend Expectation)

**Rule:** List endpoints return a consistent paginated response shape:

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

Frontend requirements:

- Components must render records from `data`.
- Pagination UI must be driven by the `pagination` object (not inferred from `data.length`).
- Pagination behavior (page is 1-based; limit max; total/totalPages semantics) must remain consistent with the API contract.

Reference: [api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)

### 2.2 Client Components: Axios allowed (optional)

If admin screens are client-side and you want a convenient client:

- Axios is acceptable for browser requests
- Keep usage limited to `/admin/*`

**Do not** introduce complex API clients or code generation.

---

## 3) Server vs Client Components rules

### 3.1 Public routes (server-rendered)

- Use Server Components by default
- Only add `"use client"` when needed for UI interactions (filters, accordions)

### 3.2 Admin routes (client-only)

**Rule:** Everything under `/admin/*` is client-side only.

- Mark top-level admin pages/components with `"use client"`
- Do not rely on SEO metadata for admin pages
- Ensure robots blocks `/admin/` (see [seo/SEO_BASELINE.md](../seo/SEO_BASELINE.md))

---

## 4) Metadata: `generateMetadata` (required on public pages)

**Rule:** Every public route must set `title` and `description`.

### 4.1 Static pages

- `/` and `/sister-cities` can use static metadata

### 4.2 Dynamic post page: `/mission-log/[slug]`

Use `generateMetadata` to fetch the post and generate:

- `title`: `${post.title} | Ukraine Aid International`
- `description`: `post.summary` (preferred)
- Open Graph fields where practical (optional baseline)

**Important:** If the API returns 404 (not published/public), return notFound.

This supports:

- SEO indexing
- correct social previews

---

## 5) Static generation: `generateStaticParams`

### 5.1 Why we need it

To pre-render mission post pages, Next.js needs the list of slugs.

### 5.2 Endpoint dependency

We rely on an API endpoint that returns slugs for **published + public** posts:

- `GET /api/posts/slugs` (added to the API contract)

### 5.3 Behavior

- `generateStaticParams` fetches slugs and returns `{ slug }[]`
- Pages still use ISR revalidation so new posts can appear without a full redeploy (see Section 6)

---

## 6) ISR baseline: `revalidate = 60`

Baseline revalidation:

- `/mission-log` (list): revalidate every 60 seconds
- `/mission-log/[slug]`: revalidate every 60 seconds

Reason:

- Nonprofit content updates are occasional but should appear quickly
- Avoids rebuilding on every content change
- Keeps implementation simple

Implementation options:

- Route segment config (`export const revalidate = 60`)
- Or per-request fetch config (`fetch(url, { next: { revalidate: 60 } })`)

Use one consistent approach.

---

## 7) Rendering modes (must match decisions)

Follow: [architecture/RENDERING_DECISIONS.md](../architecture/RENDERING_DECISIONS.md)

- `/` → SSG
- `/mission-log` → ISR
- `/mission-log/[slug]` → SSG + ISR
- `/sister-cities` → SSG
- `/admin/*` → Client-side only

---

## 8) Public filtering rule (must be preserved)

**Rule:** The frontend must only render public content that is:

- `status=published` AND `visibility=public`

Practical implications:

- If `/api/posts/:slug` returns 404 for non-public content, Next.js page must show 404
- Sitemap generation must only include published/public slugs
- Mission log list must only show published/public posts

See: [seo/SEO_BASELINE.md](../seo/SEO_BASELINE.md)

### 8.1 Public post rendering: sorting + display date

Mission Log list pages must treat `publishedAt` as the primary publication date.

- Sorting: mission-log list pages must render posts sorted by `publishedAt` **descending** (newest first).
- Display: use `publishedAt` as the visible publication date.
- Legacy safety: if `publishedAt` is null, fall back to `createdAt` for display and ordering.

### 8.2 Event rendering: sorting + date display

Event lists must use `startDate` and `endDate` (the Events model no longer uses a single `date` field).

- Sorting: event lists must render events sorted by `startDate` **ascending** (upcoming first).
- Display:
    - If `endDate` exists, display a date range: `StartDate – EndDate`.
    - If `endDate` is null, display only `StartDate`.

---

## 9) Minimal checklist for Phase 2 completion

- [ ] App Router routes created for public pages + admin shell
- [ ] Public pages server-rendered with correct metadata
- [ ] `generateStaticParams` uses `GET /api/posts/slugs`
- [ ] ISR revalidation set to 60s on mission routes
- [ ] `/admin/*` client-side only
- [ ] `app/sitemap.ts` and `app/robots.ts` implemented

---

## 10) Likes UI Behavior (Client Component Only)

Likes functionality is implemented as a Client Component.

### Requirements

- Display:
    - Heart icon
    - Numeric counter
- On click:
    - Call POST /api/posts/:slug/like
    - Update UI optimistically
    - Change icon color to active state
- On second click:
    - Call DELETE /api/posts/:slug/like
    - Update UI
    - Reset icon color

### Local State

Frontend stores liked state per visitor using:

- localStorage OR cookie

This prevents multiple increments from a single session.

### Rendering Strategy

- Likes UI must not break SSG/ISR.
- Counter value is hydrated client-side.
- Server-rendered HTML includes initial `likes` value.
