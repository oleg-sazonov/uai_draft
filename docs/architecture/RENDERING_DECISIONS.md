# Rendering Decisions (Next.js App Router)

This document defines how each route is rendered and why.

Definitions:

- **SSG**: Static Site Generation at build time
- **ISR**: Incremental Static Regeneration (static + periodic revalidation)
- **Client-side only**: Rendered in the browser (not SEO-indexed)

---

## Rendering matrix

| Route                 | Rendering Mode   | Reason                                                                          |
| --------------------- | ---------------- | ------------------------------------------------------------------------------- |
| `/`                   | SSG              | Stable marketing content; fastest load; best baseline SEO.                      |
| `/mission-log`        | ISR              | Content changes over time; list view should update without full rebuild.        |
| `/mission-log/[slug]` | SSG + ISR        | Pre-render known posts for speed/SEO; allow updates/new posts via revalidation. |
| `/sister-cities`      | SSG              | Relatively stable; best performance and SEO.                                    |
| `/sister-cities/[slug]` | SSG            | Static content detail pages; best performance and SEO.                          |
| `/admin/*`            | Client-side only | Not indexable; relies on browser-only interactivity; avoids SEO concerns.       |

---

## Notes (baseline constraints)

- Public pages must be server-rendered (SSG/ISR/SSR). See: [seo/SEO_BASELINE.md](../seo/SEO_BASELINE.md)
- All public data must follow: `status=published` AND `visibility=public`
- Admin routes must be blocked from indexing via robots policy
