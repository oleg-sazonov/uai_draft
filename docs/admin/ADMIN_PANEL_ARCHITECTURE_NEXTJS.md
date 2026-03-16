# Admin Panel Architecture & Content Management

## Overview

The admin panel is the content management interface for Ukraine Aid International's website. It allows authorized users to create, edit, and manage content that appears on the public-facing site.

The panel currently exists as a **static HTML prototype** that demonstrates the intended user experience and content workflows. This document describes the logical architecture and content management principles.

**Frontend Architecture Decision:** The production frontend (including admin UI) will be implemented using **Next.js (App Router)**. The backend remains a separate Express API service.

---

## Architectural Invariants

This document follows the system invariants defined in:

architecture/ARCHITECTURAL_INVARIANTS.md

These invariants define non-negotiable rules for:

- public content visibility
- slug immutability
- media lifecycle
- API filtering behavior

---

## Lifecycle Management

Content and media lifecycle behavior is defined in:

[architecture/LIFECYCLE_MANAGEMENT.md](../architecture/LIFECYCLE_MANAGEMENT.md)

This document explains how Posts, Events, media assets, and contact messages behave over time.

---

## Managed Content Types

The admin panel manages four primary content entities:

1. **Posts** - Core content items published on the public site
2. **Events** - Fundraisers, galas, community gatherings, and awareness events
3. **Forms** - Contact form submissions from the public website
4. **Newsletter** - Email subscription list management

Each entity has its own dedicated management interface with appropriate creation, editing, or viewing capabilities.

---

## Posts Management

### What Are Posts?

Posts represent the primary content type on the website.

Canonical Post categories (authoritative):

- **Field Mission**
- **Sister City & Sister State Partnerships**
- **Events & Community**
- **Organizational Updates**
- **Media & Press**

All categories share the same content structure and are managed through a unified interface.

### Post Fields

**Required Fields:**

- Title
- Category (one of the canonical categories listed above)
- Content (main body text; stored as Markdown)
- Featured image (Cloudinary URL)
- Visibility (Public | Internal | Archived)

**Optional Fields:**

- Summary
- Gallery images (Cloudinary URLs)
- Video URL
- Aid type
- Partnership
- Location

### Media Handling (Cloudinary)

- The admin UI uploads images to the backend API.
- The backend uploads to Cloudinary and returns URLs.
- MongoDB stores URL references only.
- The admin UI MUST NOT upload directly to Cloudinary in this architecture.

### Likes Counter (Read-Only)

Posts and Events include a numeric `likes` counter.

- Admin users cannot manually edit likes.
- Likes are managed exclusively through public interaction endpoints.
- Admin tables may display the likes count for reference.

### Content Visibility vs Status

Posts have two independent concepts that control their display:

**Visibility (Required):**

- **Public** - Appears on the public website
- **Internal** - Visible only to authorized users (not implemented publicly)
- **Archived** - Hidden from public view but preserved

**Status (Implicit / Backend-Driven):**

- **Published** - Content is complete and live
- **Draft** - Content is incomplete or unpublished

Public API rules must still enforce: only `status=published` AND `visibility=public` posts are publicly visible.

### Optional Metadata Behavior

**Aid Type(s):**

- Optional array field used for filtering on the public Mission Updates page
- Multiple values allowed (no duplicates)
- If not specified, the post is still valid and will appear in "All" views

**Partnership:**

- Optional field associating content with a specific partnership
- If not specified, the post is considered organization-wide

**Location:**

- Optional field for geographic context
- If not specified, the post is still valid

**Video URL:**

- Optional field for linking to a related video
- If not specified, the post is still valid

### Editing and Deletion

- **Edit** - Modify any post field and republish
- **Delete** - Permanently remove a post (no soft delete at this stage)
- **Preview** - View post before publishing (future feature)

Posts table shows:

- Title
- Category
- Aid type (if specified)
- Partnership (if specified)
- Publication date
- Current status
- Action buttons (Edit | Delete)

---

## Events Management

Events are a distinct content type from Posts. They are time-sensitive and include structured fields like `startDate`/`endDate` and location.

Core actions:

- Create
- Publish
- Edit
- Archive

---

## Contact Forms Management

### Purpose

The Forms section displays messages submitted through the public **Contact Us** form. This is a **read-only interface**—no content creation happens here.

### Form Submission Fields

Each submission includes:

- Date received
- Submitter name
- Email address
- Subject (selected from predefined options, if applicable)
- Message body
- Status (Pending | Responded)

### Workflow

**Pending:**

- Form has been received but not yet addressed
- Administrator reviews the message
- Response happens outside the system (via email, phone, etc.)

**Responded:**

- Administrator marks the form as "Responded" after taking action
- This is a manual status update, not automated

**Archive:**

- Removes the form from the active view
- Preserves the record for historical purposes

---

## Newsletter Subscribers Management

### Purpose

The Newsletter section displays a list of email addresses collected through the public newsletter signup form.

### Subscriber Fields

- Email address
- Subscription date

### Supported Actions

- View subscriber list
- Export CSV for import into an external email platform

### Architectural Boundary (Authoritative)

This website is NOT an email platform.

- It does not send emails.
- It does not manage unsubscribe lifecycle.
- It does not store subscription status.

Subscription lifecycle (unsubscribe, suppression, deliverability rules) is handled entirely by the external email platform, which is the single source of truth.

---

## Routing Concept (Next.js App Router)

### Current State (Prototype)

The HTML prototype uses **tab-based navigation** controlled by JavaScript. Clicking "Posts," "Events," "Forms," or "Newsletter" switches the visible content section.

### Production State (Next.js)

The production admin UI uses **Next.js App Router** with **file-based routing**. Routes are bookmarkable, shareable, and support direct navigation.

#### Expected Admin Routes

- `/admin` → Redirect/landing
- `/admin/posts` → Posts list view
- `/admin/posts/new` → Create new post
- `/admin/posts/:id/edit` → Edit existing post
- `/admin/events` → Events list view
- `/admin/events/new` → Create new event
- `/admin/events/:id/edit` → Edit existing event
- `/admin/forms` → Forms list view
- `/admin/forms/:id` → View individual form submission
- `/admin/newsletter` → Newsletter subscriber list
- `/admin/newsletter/export` → Export CSV (optional route)

#### App Router File Structure (Illustrative)

```
app/
  admin/
    page.jsx
    posts/
      page.jsx
      new/
        page.jsx
      [id]/
        edit/
          page.jsx
    events/
      page.jsx
      new/
        page.jsx
      [id]/
        edit/
          page.jsx
    forms/
      page.jsx
      [id]/
        page.jsx
    newsletter/
      page.jsx
```

### Client Components in Admin

Admin pages typically require:

- Form state
- Table interactions
- Authenticated calls (JWT)

Therefore, most admin screens will be implemented as **Client Components** (via `"use client"`), calling the separate Express API (using Axios where needed).

---

## Authentication & Authorization Baseline (Phase 1)

This is a small nonprofit website. Phase 1 authentication is intentionally minimal and focused on protecting the admin surface.

### Admin authentication model

- Admin authentication uses **JWT**.
- The backend issues a JWT on successful admin login.
- The admin UI relies on the browser sending the JWT cookie on requests to protected admin endpoints.

### JWT storage strategy (cookie-based)

- JWT is stored in an **HttpOnly cookie**.
- JWT expiration must be defined and enforced by the backend.
- JWT signing secret is provided via environment variable: `JWT_SECRET`.

### Cookie security requirements

Cookie baseline:

- `HttpOnly: true`
- `Secure: true` in production
- `SameSite: Lax` (baseline)

### Admin endpoint protection rules

- All `/api/admin/*` endpoints require a valid JWT.
- Public endpoints must never rely on JWT.
- If authentication fails, backend returns:
    - **401** for missing/invalid token
    - **403** for authenticated but unauthorized access (future-proof wording)

### CSRF Consideration (Baseline)

Because authentication is cookie-based, the `SameSite` policy provides baseline CSRF mitigation in Phase 1.

**Explicit rule:** No dedicated CSRF token system is implemented in Phase 1.

### Explicitly Out of Scope (Phase 1)

- No role-based access control
- No multi-user permission tiers
- No refresh token system
- No session revocation system
- No device tracking
- No 2FA
- No audit logging

## Out of Scope

The following features are **not part of the current admin panel architecture** and will be addressed in future development phases:

### Authentication & Authorization

- User login/logout UX (beyond basic flow)
- Role-based permissions (Admin, Editor, Viewer)
- Session management
- Password reset

### Email Functionality

- Automated email sending
- Newsletter campaigns
- Form submission notifications
- Unsubscribe links

### Analytics & Reporting

- Content performance metrics
- User engagement tracking
- Form submission analytics
- Newsletter open/click rates

### Advanced Content Features

- Content versioning
- Scheduled publishing
- Multi-author support
- Content approvals/workflows

### Search & Filtering

- Full-text search across content
- Advanced filtering options
- Bulk actions (delete, archive, change status)

### Media Management

- Image library
- File uploads beyond basic forms
- Image editing/cropping
- Media organization

---

## Key Principles

### Content Architecture

- **Posts** are the primary content type (categorized by the canonical Post category set)
- **Events** are structurally different and time-sensitive
- **Forms** are read-only submissions
- **Newsletter** is a simple subscriber list

### Metadata is Optional

- Optional fields (summary, gallery images, video URL, aid type, partnership, location) do not affect content validity
- Posts without these fields are still publishable
- Filtering on the public site handles missing values gracefully

### Visibility Controls Display

- **Public** = visible on the public website
- **Internal** = visible only to authorized users (future)
- **Archived** = hidden but preserved

### Backend Remains Separate

- The backend remains an Express API service.
- The Next.js admin UI consumes backend endpoints over HTTP.
- Do not move backend rules into Next.js API routes.

---

## Assumptions

This architecture assumes:

1. Posts, events, forms, and newsletter subscribers are distinct entities
2. Content editors understand the difference between "visibility" and "status"
3. Optional fields (aid type, partnership, location, summary, gallery images, video URL) are used for filtering/grouping, not validation
4. Forms and newsletters are managed outside the admin panel (email tools)
5. The admin panel is implemented in Next.js (App Router) before backend integration is finalized

---

## Getting Started

For developers working on this admin panel:

1. **Review the HTML prototype** - Open `admin.html` to see the intended UX
2. **Understand entity relationships** - Posts ≠ Events, Forms are read-only
3. **Use route-based pages** - Implement `/admin/...` via Next.js App Router
4. **Respect optional fields** - Summary, gallery images, video URL, aid type, partnership, and location are not required
5. **Follow backend-first sequencing** - Integrate only after APIs and rules are stable
