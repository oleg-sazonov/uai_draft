# Product Vision

## 1. Purpose of the Website

This project is a content-driven website for **Ukraine Aid International**. Its purpose is to:

- Share mission reports, news, and updates in a clear, consistent format
- Announce events and community activities
- Collect messages from supporters and partners
- Build a newsletter subscriber list

The website should help the organization communicate impact, build trust, and make it easy for the public to stay informed and get involved.

## 2. Target Audience

### Public Website Users

- Supporters and donors who want updates and transparency
- Volunteers and community members looking for ways to help
- Partner organizations and city/state partners
- Journalists and anyone looking for verified mission information

### Admin Panel Users

- Internal staff or trusted volunteers who publish posts and events
- A small number of admins (not a broad set of user roles)

## 3. Primary Use Cases

- **Publish mission reports** (most important): tell stories, show impact, share photos
- **Announce events**: promote fundraisers, awareness events, and gatherings
- **Collect contact messages**: route general inquiries to the organization
- **Collect newsletter subscriptions**: grow an email list for outreach

## 4. Admin Panel Goals

The admin panel should be **simple and low-friction**. It must make it easy to:

- Create a post/event without technical steps
- **Save as Draft** while writing
- **Publish** when ready
- **Archive** content that should no longer appear publicly

The system should feel like “fill out a form and publish,” not like operating a complex CMS.

## 5. Non-Goals

This system is **not** trying to be:

- A full CMS platform with plugins, themes, and workflows
- A media management system (no image library, cropping tools)
- An automation engine (no scheduled publishing, no email campaigns, no notifications)
- A multi-role editorial platform (no editor/reviewer approval flows)

---

## 6. SEO as a Core Architectural Requirement

This website is content-driven (mission reports, updates, events). That means SEO is not optional: it directly affects how supporters, partners, and journalists discover and verify our work.

Baseline requirements:

- Public pages must be **server-rendered** in Next.js (SSG/ISR/SSR), not client-only.
- **Slugs are immutable after publication** to keep URLs stable and avoid breaking external links.
- Every public page must include basic metadata: **title + description**.
- Sitemaps and robots rules must ensure only **published + public** content is indexable.

See: [SEO_BASELINE.md](SEO_BASELINE.md)

## 7. Frontend Architecture Decision: Next.js (App Router)

The frontend will be built with **Next.js (App Router)** instead of a React SPA.

### Why Next.js

- **SEO & discoverability:** Mission reports and updates must be indexable and shareable with correct metadata.
- **Performance:** Supports SSG and ISR for fast content pages while still enabling SSR where needed.
- **Content-first routing:** File-based routing aligns naturally with slug-based content URLs (e.g., `/mission-log/[slug]`).
- **Server-rendered metadata:** Page titles, descriptions, and social previews are generated server-side.

### Backend-First Remains the Core Approach

- The backend remains a **separate Express API service**.
- Content rules (status/visibility enforcement, slug immutability) are enforced by the backend.
- The Next.js frontend consumes the backend API over HTTP and does not replace backend services.
