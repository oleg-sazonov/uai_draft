# SEO Baseline (Policy)

This document defines the minimum SEO requirements for the Ukraine Aid International website.

Scope:

- Next.js frontend (App Router) renders public pages
- Express API provides content (posts/events)
- We optimize for **indexable public pages** (mission updates + posts + sister cities)

Non-goals:

- No advanced SEO experiments
- No “growth hacks”
- No paid keyword tooling requirements

---

## 1) Server-side rendering is required (public pages)

**Rule:** All public pages must be server-rendered in Next.js (SSG / ISR / SSR) so:

- Search engines can index real HTML content
- Metadata is present at request/build time
- Social previews (Open Graph) work reliably

**Applies to:**

- `/`
- `/mission-updates`
- `/mission-updates/[slug]`
- `/events`
- `/events/[slug]`
- `/sister-cities`
- any future public content pages

**Exception:** `/admin/*` is not SEO-targeted and must not be indexed.

---

## 2) Slug immutability (critical for SEO)

**Rule:** Once a post/event is **published**, its `slug` must never change.

Why:

- Prevents broken links and lost search ranking
- Keeps URLs stable for press, partners, and social shares

Backend enforcement:

- Slug is generated from title
- Slug uniqueness is enforced
- Slug is immutable after `status=published`

Frontend assumption:

- The canonical URL for a post is always `/mission-updates/[slug]`
- The canonical URL for an event is always `/events/[slug]`

---

## 3) Metadata rules (title + description)

Every public page must define:

### 3.1 Title

- Must be meaningful and specific
- Suggested format:
    - Home: `Ukraine Aid International`
    - Mission updates list: `Mission Updates | Ukraine Aid International`
    - Post: `${post.title} | Ukraine Aid International`
- Avoid keyword stuffing

### 3.2 Description

- Must be a short, human-readable summary
- For posts, use `post.summary` (or the first ~160 characters of content as fallback)
- Keep it consistent and accurate

### 3.3 Canonical URL (recommended baseline)

- Each public page should emit a canonical URL pointing to itself
- This prevents duplicate indexing when query params exist (example: `?page=2`)

---

## 4) Sitemap strategy

**Goal:** Provide a complete sitemap for all indexable public routes.

### 4.1 What goes in the sitemap

Include:

- Static routes: `/`, `/mission-updates`, `/events`, `/sister-cities`, `/contact`, `/donate`
- Dynamic post routes: `/mission-updates/[slug]` for **published + public** posts only
- Dynamic event routes: `/events/[slug]` for **published + public** events only

Exclude:

- `/admin/*`
- Draft/internal/archived content

### 4.2 How we generate it (Next.js)

Use Next.js App Router’s sitemap support:

- `app/sitemap.ts` fetches slugs from the API endpoints:
    - `GET /api/posts/slugs` (for mission updates posts)
    - `GET /api/events/slugs` (for events)
- Build absolute URLs using the production site base URL

Clarification (pagination safety):

- Sitemap generation must **never** iterate paginated public list endpoints (e.g., `GET /api/posts?page=...`).
- It must use the dedicated slug endpoints (`GET /api/posts/slugs`, `GET /api/events/slugs`) to avoid pagination coupling and ensure completeness.

**Rule:** The sitemap must only include records that satisfy:

- `status=published` AND `visibility=public`

### 4.3 Sitemap revalidation

The sitemap must use ISR (`revalidate = 60`) so newly published slugs appear within one revalidation cycle. See: [architecture/RENDERING_DECISIONS.md — ISR revalidation strategy](../architecture/RENDERING_DECISIONS.md)

---

## 5) robots.txt policy

### 5.1 Production

- Allow indexing of public routes
- Disallow admin routes

Minimum policy:

- `Disallow: /admin/`

### 5.2 Staging / preview environments

- Recommended: block indexing to avoid duplicate content in search engines
- Use `Disallow: /` (or equivalent environment-based policy)

Implementation (Next.js):

- `app/robots.ts` should reflect the environment (production vs non-production)

---

## 6) Image optimization (required)

**Rule:** All content images on public pages must use Next.js `next/image` (`<Image />`) when rendered by Next.js.

Benefits:

- Automatic resizing and modern formats where supported
- Improved LCP and overall performance
- Better UX on mobile

Baseline requirements:

- Always provide `alt`
- Provide `width`/`height` or `fill` to avoid layout shift
- Use `priority` only for above-the-fold hero images

Note:

- Content may store image URLs in the backend; rendering still uses `<Image />` on the frontend.

---

## 7) Public filtering rule (indexing + privacy + correctness)

**Rule:** The public website must only display content where:

- `status=published` AND `visibility=public`

This rule must be enforced:

- In the **Express public API**
- And respected by **Next.js rendering** (including sitemap generation)

Rationale:

- Prevent draft/internal content from leaking
- Ensure only indexable content appears publicly

---

## 8) Practical checklist (minimum)

For every public route:

- [ ] Server-rendered HTML (SSG/ISR/SSR)
- [ ] `title` + `description` metadata
- [ ] Canonical URL (recommended)
- [ ] Uses `<Image />` for images
- [ ] Obeys `published + public` filtering
- [ ] Included in sitemap if indexable
- [ ] Not under `/admin/*`

## Likes and SEO

- Likes do not influence metadata.
- Likes do not affect canonical URLs.
- Likes do not change sitemap inclusion.
- Like endpoints must not be indexed.
