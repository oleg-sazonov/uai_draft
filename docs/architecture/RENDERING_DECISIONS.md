# Rendering Decisions (Next.js App Router)

This document defines how each route is rendered and why.

Definitions:

- **SSG**: Static Site Generation at build time
- **ISR**: Incremental Static Regeneration (static + periodic revalidation)
- **Client-side only**: Rendered in the browser (not SEO-indexed)

---

## Rendering matrix

| Route                     | Rendering Mode   | Reason                                                                          |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------- |
| `/`                       | SSG              | Stable marketing content; fastest load; best baseline SEO.                      |
| `/mission-updates`        | ISR              | Content changes over time; list view should update without full rebuild.        |
| `/mission-updates/[slug]` | SSG + ISR        | Pre-render known posts for speed/SEO; allow updates/new posts via revalidation. |
| `/events`                 | ISR              | Event listings change over time; must update without full rebuild.              |
| `/events/[slug]`          | SSG + ISR        | Pre-render known events for speed/SEO; allow updates via revalidation.          |
| `/sister-cities`          | SSG              | Relatively stable; best performance and SEO.                                    |
| `/sister-cities/[slug]`   | SSG              | Static content detail pages; best performance and SEO.                          |
| `/admin/*`                | Client-side only | Not indexable; relies on browser-only interactivity; avoids SEO concerns.       |

---

## Dynamic route behavior (SSG + ISR)

For routes using `generateStaticParams` (SSG + ISR):

- `/mission-updates/[slug]`
- `/events/[slug]`

The following Next.js configuration applies:

```ts
export const dynamicParams = true;
```

**Reason:** `dynamicParams = true` allows newly published posts and events to render on-demand via ISR without requiring a full site rebuild.

Behavior:

- `generateStaticParams` provides the initial set of slugs for static generation at build time.
- When a visitor requests a slug that was **not** pre-rendered, Next.js renders it on-demand and caches the result.
- This ensures new content is immediately accessible after publication.

---

## ISR revalidation strategy

### Baseline interval

All ISR routes use a **60-second** revalidation interval (`revalidate = 60`).

This means a cached page may be up to 60 seconds stale after a backend content change. This is acceptable for a nonprofit CMS where content updates are infrequent.

### Revalidation triggers

When an admin **publishes, updates, or unpublishes** a post or event through the admin panel, the following public routes may serve stale content until the next revalidation cycle:

| Admin action              | Affected public routes                        |
| ------------------------- | --------------------------------------------- |
| Publish / unpublish post  | `/mission-updates`, `/mission-updates/[slug]` |
| Publish / unpublish event | `/events`, `/events/[slug]`                   |
| Edit published post       | `/mission-updates/[slug]`                     |
| Edit published event      | `/events/[slug]`                              |

### On-demand revalidation (future enhancement)

Phase 1 relies on **time-based ISR only** (the 60-second interval). On-demand revalidation via `revalidatePath()` or `revalidateTag()` is a **planned future enhancement** that can be added when the admin panel calls a Next.js Route Handler after successful write operations.

When implemented:

- `revalidatePath("/mission-updates")` — purges the list page cache
- `revalidatePath("/mission-updates/[slug]")` — purges a specific post page
- `revalidatePath("/events")` — purges the events list page
- `revalidatePath("/events/[slug]")` — purges a specific event page

Until on-demand revalidation is added, the 60-second interval is the sole cache-busting mechanism.

### Sitemap revalidation

The sitemap (`app/sitemap.ts`) should also use ISR with `revalidate = 60` so that newly published slugs appear in the sitemap within one revalidation cycle.

---

## ISR pagination cache drift

### Problem

`/mission-updates` and `/events` are paginated ISR pages. When a new post or event is published (`draft → published`), the cached list page continues serving the previous result set until the 60-second revalidation interval expires.

This can cause:

- **Stale pagination results** — the first page of results does not include the newly published item.
- **Newly published posts not appearing in lists** — visitors (and SEO crawlers) see an outdated list.
- **SEO crawlers indexing outdated lists** — search engines may cache a list snapshot that omits recent content.

### Mitigation rule

Whenever a post or event becomes publicly visible (the effective transition is `draft → published` with `visibility=public`), the frontend **must** revalidate the corresponding list page to flush the stale cached version.

Recommended calls (when on-demand revalidation is implemented):

```ts
revalidatePath("/mission-updates");
revalidatePath("/events");
```

Until on-demand revalidation is available, the 60-second ISR interval is the sole mitigation. This is documented as an accepted operational risk for Phase 1.

### Scope

This risk applies only to **list pages**. Individual slug pages (`/mission-updates/[slug]`, `/events/[slug]`) are not affected because newly published slugs are rendered on-demand via `dynamicParams = true`.

---

## Lifecycle-triggered revalidation

### Problem

ISR caches previously rendered pages. If a published post or event undergoes a lifecycle change — such as archiving, deletion, or a visibility change (`public → internal`, `public → archived`) — the cached page may still serve the now-inaccessible content until the ISR interval expires.

This can cause:

- **Stale public pages** — a visitor sees content that should no longer be publicly available.
- **Archived content still visible** — content marked `archived` or `internal` remains served from cache.
- **Inconsistent sitemap results** — the sitemap may still list a slug whose page now returns stale or removed content.

### Mitigation rule

The following lifecycle actions **must** trigger revalidation of affected public routes:

| Lifecycle action                       | Required revalidation targets  |
| -------------------------------------- | ------------------------------ |
| **Publish** (`draft → published`)      | List page + new slug page      |
| **Archive** (`public → archived`)      | List page + archived slug page |
| **Delete** (record removed)            | List page + deleted slug page  |
| **Visibility change** (any transition) | List page + affected slug page |

Recommended calls (when on-demand revalidation is implemented):

```ts
// After any lifecycle change to a post:
revalidatePath("/mission-updates");
revalidatePath(`/mission-updates/${slug}`);

// After any lifecycle change to an event:
revalidatePath("/events");
revalidatePath(`/events/${slug}`);
```

### Phase 1 constraint

Phase 1 uses time-based ISR only. The 60-second revalidation interval is the sole cache-busting mechanism. This means lifecycle changes may take up to 60 seconds to reflect on public pages. This is an accepted operational risk.

When on-demand revalidation is added (see "On-demand revalidation" above), these lifecycle triggers should be wired into the admin write flow so that cached pages are purged immediately after the backend confirms the state change.

---

## Notes (baseline constraints)

- Public pages must be server-rendered (SSG/ISR/SSR). See: [seo/SEO_BASELINE.md](../seo/SEO_BASELINE.md)
- All public data must follow: `status=published` AND `visibility=public`
- Admin routes must be blocked from indexing via robots policy
