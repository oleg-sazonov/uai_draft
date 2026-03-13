# Documentation Index (Master Map)

This file is the **master documentation map** for the Ukraine Aid International (UAI) website project.

Purpose:

- Keep the system understandable even when AI tooling has strict context limits.
- Provide a stable “table of contents” across product, architecture, backend, frontend, admin, API, infrastructure, policies, and phase planning.

Conventions:

- Links are **relative to `/docs`**.
- The ≤25 file constraint applies only to AI context injection systems.
  The repository itself may contain a full documentation set.

---

## AI Navigation

This repository is designed to support **AI-assisted navigation** (Copilot/ChatGPT/Claude) for faster onboarding and implementation.

Start here:

- [DOCS_INDEX.md](DOCS_INDEX.md)
- [ai/AI_CONTEXT.md](ai/AI_CONTEXT.md)

If you need the architecture in under ~30 seconds, read these files in order:

1. [DOCS_INDEX.md](DOCS_INDEX.md)
2. [ai/AI_CONTEXT.md](ai/AI_CONTEXT.md)
3. [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
4. [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
5. [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

## AI Infrastructure

The repository includes documentation designed to support AI-assisted development.

These files help tools like GitHub Copilot, ChatGPT, and Claude understand the system architecture.

Location:

docs/ai/

Files:

- [ai/AI_CONTEXT.md](ai/AI_CONTEXT.md)
  Machine-readable project overview for AI assistants.

- [ai/AI_WORKFLOW.md](ai/AI_WORKFLOW.md)
  Standard prompt prefixes for planning, implementation, and reviews.

- [ai/AI_NAVIGATION.md](ai/AI_NAVIGATION.md)
  Recommended architecture reading order for AI tools.

- [ai/DOCUMENTATION_GUARDIAN.md](ai/DOCUMENTATION_GUARDIAN.md)
  Automated documentation consistency checks.

- [ai/AI_FILE_MAP.md](ai/AI_FILE_MAP.md)
  Machine-readable map of the full documentation set (AI discoverability).

- [ai/AI_BRIDGE_PROMPT.md](ai/AI_BRIDGE_PROMPT.md)
  Bridge prompt format for transferring repo-aware analysis between AI tools.

- [ai/AI_COLLABORATION_PROTOCOL.md](ai/AI_COLLABORATION_PROTOCOL.md)
  Collaboration rules for multi-AI workflows.

These files help prevent architecture drift and improve AI-assisted development workflows.

---

## Project Summary

This project is a content-driven website for **Ukraine Aid International**.
It exists to publish posts in a clear, consistent format (using the canonical Post category set) and to announce events.
It also collects contact messages from supporters/partners and builds a newsletter subscriber list.

Primary users:

- Public visitors: supporters/donors, volunteers, partners, journalists, and anyone verifying mission information.
- Admin users: a small set of trusted staff/volunteers who create drafts, publish, and archive content.

Core product goals:

- Communicate impact and build trust through fast, indexable public pages.
- Keep content management low-friction (“fill out a form and publish”), not a complex CMS.
- Treat SEO as a baseline requirement (server-rendered pages, stable slugs, sitemap/robots).

Reference: [product/PRODUCT_VISION_NEXTJS.md](product/PRODUCT_VISION_NEXTJS.md)

---

## System Architecture

High-level diagram:

```text
Internet
 ↓
Next.js Frontend (App Router)
 ↓ REST API
Express Backend
 ↓
MongoDB
 ↓
Cloudinary (media storage)
```

Architectural rules (authoritative intent):

- Backend remains a **separate Express REST API** service.
- Frontend consumes backend via **REST endpoints over HTTP** (base URL via `NEXT_PUBLIC_API_BASE_URL`).
- Public pages are **server-rendered** (SSG/ISR/SSR) for SEO.
- `/admin/*` routes are **client-side only** (not SEO-targeted).
- Public content rule: only records with `status=published` **AND** `visibility=public` are visible/indexable.
- Slugs are **immutable after publication**.

## System Boundaries

Clearly documented architectural separation between services.

### Frontend (Next.js)

Responsibilities:

- Server-render public pages
- Render SEO metadata
- Implement ISR/SSG rendering
- Provide client-only admin UI under `/admin/*`
- Consume backend via REST API

Must NOT:

- Implement business logic
- Access the database directly
- Replace backend endpoints

### Backend (Express API)

Responsibilities:

- Enforce business rules
- Validate input (Zod)
- Control publishing/visibility logic
- Manage authentication
- Interact with MongoDB
- Handle media uploads (Cloudinary)

### Database (MongoDB)

Stores:

- Posts
- Events
- Contact Messages
- Newsletter Subscribers
- Admin Users

Important rule:

MongoDB stores **media URLs only**.
Actual files are stored in **Cloudinary**.

### External Services

- Cloudinary → media storage
- Mailchimp (or similar) → newsletter campaign management

The website itself only collects subscriber emails.

## Lifecycle Management

Content and media lifecycle behavior is defined in:

[architecture/LIFECYCLE_MANAGEMENT.md](architecture/LIFECYCLE_MANAGEMENT.md)

This document explains how Posts, Events, media assets, and contact messages behave over time.

Primary reference: [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)

---

## Core Entities

- **Posts**: core content items (canonical categories); stored as Markdown + metadata; published via admin.
- **Events**: upcoming/community events with dates and location; published via admin.
- **Contact Messages**: contact form submissions tracked with a simple status (pending/responded).
- **Newsletter Subscribers**: email addresses collected for export to an external email platform.
- **Admin Users**: authenticated users who manage content and operational inboxes.

Primary reference: [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)

---

## API Surface (High-Level)

Most important endpoints (see contract for full details and response shapes):

Public:

- `GET /api/posts`
- `GET /api/posts/:slug`
- `GET /api/events`
- `POST /api/posts/:slug/like`
- `DELETE /api/posts/:slug/like`

Admin:

- `POST /api/admin/login`
- `POST /api/admin/media/images`
- `GET /api/admin/posts`
- `POST /api/admin/posts`
- `PATCH /api/admin/posts/:id`
- `DELETE /api/admin/posts/:id`

Primary reference: [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)

---

## Rendering Strategy

Rendering model summary:

- `/` → **SSG**
- `/mission-log` → **ISR**
- `/mission-log/[slug]` → **SSG + ISR**
- `/sister-cities` → **SSG**
- `/sister-cities/[slug]` → **SSG**
- `/admin/*` → **client-side only**

Primary reference: [architecture/RENDERING_DECISIONS.md](architecture/RENDERING_DECISIONS.md)

---

## Where to Find Things

## Product Vision

- [product/PRODUCT_VISION_NEXTJS.md](product/PRODUCT_VISION_NEXTJS.md)
  Defines the project goals, target users, success criteria, and the scope boundaries for a small nonprofit content site.

---

## Architecture

- [architecture/ARCHITECTURE_ENTRYPOINT.md](architecture/ARCHITECTURE_ENTRYPOINT.md)
  30-second architecture overview and links to authoritative specs.

- [architecture/SYSTEM_BOUNDARIES.md](architecture/SYSTEM_BOUNDARIES.md)
  Clear separation of responsibilities between Next.js frontend, Express backend, MongoDB, and external services.

- [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
  Authoritative system design: entities, publishing/visibility rules, routes, and phase order.

- [architecture/ARCHITECTURAL_INVARIANTS.md](architecture/ARCHITECTURAL_INVARIANTS.md)
  Non-negotiable invariants that must remain consistent across implementations and specs.

- [architecture/RENDERING_DECISIONS.md](architecture/RENDERING_DECISIONS.md)
  Route-by-route rendering matrix (SSG/ISR/SSR/client-only) and the reasoning behind it.

- [architecture/TECH_STACK_NEXTJS.md](architecture/TECH_STACK_NEXTJS.md)
  Declares the intended stack (Next.js App Router + Express + MongoDB) and key architectural principles.

- [architecture/LIFECYCLE_MANAGEMENT.md](architecture/LIFECYCLE_MANAGEMENT.md)
  Content and media lifecycle behavior (publish/archive expectations, visibility rules over time).

- [architecture/MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md](architecture/MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md)
  Media upload pipeline architecture (Cloudinary).

---

## Backend

- [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
  Implementation guide for the Express API: layering (validators/controllers/services/models), core rules, auth, rate limiting, and CORS.

- [backend/BACKEND_IMPLEMENTATION_CHECKLIST.md](backend/BACKEND_IMPLEMENTATION_CHECKLIST.md)
  Step-by-step checklist to implement Phase 1 safely and consistently.

- [backend/BACKEND_STRUCTURE.md](backend/BACKEND_STRUCTURE.md)
  Backend folder structure and conventions.

- [backend/EXPRESS_BACKEND_PATTERNS.md](backend/EXPRESS_BACKEND_PATTERNS.md)
  Standard patterns for Express backend implementations.

---

## Frontend

- [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
  Phase 2 implementation guide: App Router structure, server/client component rules, metadata, ISR, and sitemap/robots requirements.

- [frontend/FRONTEND_ARCHITECTURE.md](frontend/FRONTEND_ARCHITECTURE.md)
  How the Next.js frontend consumes the API, how rendering works, and the rules that keep public pages SEO-friendly.

- [frontend/FRONTEND_STRUCTURE.md](frontend/FRONTEND_STRUCTURE.md)
  Frontend structure conventions.

- [frontend/FRONTEND_MIGRATION_GUIDE_NEXTJS.md](frontend/FRONTEND_MIGRATION_GUIDE_NEXTJS.md)
  Guidance for migrating from the static HTML prototype to the Next.js App Router implementation.

---

## Admin Panel

- [admin/ADMIN_PANEL_ARCHITECTURE_NEXTJS.md](admin/ADMIN_PANEL_ARCHITECTURE_NEXTJS.md)
  Admin panel information architecture, managed entities, and how the prototype maps to Next.js routes.

- [admin/ADMIN_WORKFLOW.md](admin/ADMIN_WORKFLOW.md)
  Practical editor/admin workflows: create/edit/publish/archive posts/events, review forms, export newsletter subscribers.

---

## API

- [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
  The API contract for Phase 1: public/admin endpoints, pagination rules, filtering, and expected response shapes.

---

## Infrastructure

- [deployment/ENVIRONMENT_BASELINE.md](deployment/ENVIRONMENT_BASELINE.md)
  Environment definitions (dev/staging/prod), required env vars, robots behavior per env, and CORS baseline expectations.

- [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md)
  Deployment guide (Render): service topology, required config, and how frontend connects to backend.

- [architecture/TECH_STACK_NEXTJS.md](architecture/TECH_STACK_NEXTJS.md)
  Stack declaration and high-level constraints that affect deploy/runtime assumptions.

---

## Policies

- [api/ERROR_HANDLING_POLICY.md](api/ERROR_HANDLING_POLICY.md)
  Shared error-handling policy: status codes, consistent JSON error shape, and frontend 404/non-leak behavior.

- [architecture/IMAGE_STRATEGY_BASELINE.md](architecture/IMAGE_STRATEGY_BASELINE.md)
  Historical image handling baseline (deprecated): early URL-only strategy and Next.js `<Image />` rendering rules.

- [seo/SEO_BASELINE.md](seo/SEO_BASELINE.md)
  SEO minimums: server-rendered public pages, metadata rules, sitemap strategy, and robots policy.

- [operations/POST_LAUNCH_SUPPORT_POLICY.md](operations/POST_LAUNCH_SUPPORT_POLICY.md)
  Lightweight support expectations after launch (triage philosophy and maintenance boundaries).

- [operations/UAI_INCIDENT_RESPONSE_RUNBOOK.md](operations/UAI_INCIDENT_RESPONSE_RUNBOOK.md)
  Simple incident response guidance (what to check, how to mitigate, and what to document).

---

## Architecture Governance

- [ARCHITECTURE_LOCK.md](ARCHITECTURE_LOCK.md)
  Constraints that should not be changed without explicit decision.

- [DECISION_LOG.md](DECISION_LOG.md)
  Record of key decisions and rationale.

- [SPEC_SYNC_RULES.md](SPEC_SYNC_RULES.md)
  Rules for keeping specs synchronized and preventing drift.

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
  Project context and clarifying assumptions.

---

## Developer Documentation

- [IMPLEMENTATION_START_GUIDE.md](IMPLEMENTATION_START_GUIDE.md)
  How to begin implementation safely (developer + AI orientation).

- [development/DEVELOPMENT_SETUP.md](development/DEVELOPMENT_SETUP.md)
  Local dev instructions (env vars, ports, running both services, workflow expectations).

- [development/DEVELOPER_GUIDE.md](development/DEVELOPER_GUIDE.md)
  Developer responsibilities and rules across services.

- [README.md](README.md)
  Documentation folder overview.

---

## Historical / External Documents

These are archival documents created during Phase 0 planning:

- [PHASE 0 - CONTENT ARCHITECTURE RESOLUTION DOCUMEN.docx](PHASE%200%20-%20CONTENT%20ARCHITECTURE%20RESOLUTION%20DOCUMEN.docx)
- [Phase 0 Content Confirmation V1.0.rtf](Phase%200%20Content%20Confirmation%20V1.0.rtf)
- [Phase 0 Content Confirmation V1.1.rtf](Phase%200%20Content%20Confirmation%20V1.1.rtf)

---

## Phase Planning

- [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
  Phase 1 scope and sequence (backend-first).

- [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
  Phase 2 scope and sequence (Next.js App Router frontend implementation).

- [development/DEVELOPER_GUIDE.md](development/DEVELOPER_GUIDE.md)
  Quick-start overview of responsibilities and rules across services (good onboarding entrypoint).

- [development/DEVELOPMENT_SETUP.md](development/DEVELOPMENT_SETUP.md)
  Local dev instructions (env vars, ports, running both services, workflow expectations).

---

## Minimal AI Context Set (≤25 files)

If an AI context injection system must stay under **≤25** documentation files, use this minimal set to preserve end-to-end understanding.
The repository itself is not constrained; this section exists to support limited-context AI workflows.

1. [DOCS_INDEX.md](DOCS_INDEX.md)
   Master map and “what exists / what’s missing” index.

2. [product/PRODUCT_VISION_NEXTJS.md](product/PRODUCT_VISION_NEXTJS.md)
   Scope, goals, and non-goals.

3. [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
   Core domain model, publishing/visibility rules, and routing.

4. [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
   Backend/frontend handshake: endpoints + response shapes.

5. [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
   Backend build plan and the non-negotiable layering/rules.

6. [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
   Frontend build plan and rendering/SEO requirements.

7. [frontend/FRONTEND_ARCHITECTURE.md](frontend/FRONTEND_ARCHITECTURE.md)
   How Next.js consumes the API; server vs client boundaries.

8. [admin/ADMIN_PANEL_ARCHITECTURE_NEXTJS.md](admin/ADMIN_PANEL_ARCHITECTURE_NEXTJS.md)
   Admin panel scope and route map.

9. [admin/ADMIN_WORKFLOW.md](admin/ADMIN_WORKFLOW.md)
   Day-to-day content operations.

10. [architecture/RENDERING_DECISIONS.md](architecture/RENDERING_DECISIONS.md)
    Rendering matrix that drives SEO/perf.

11. [seo/SEO_BASELINE.md](seo/SEO_BASELINE.md)
    SEO must-haves and sitemap/robots rules.

12. [api/ERROR_HANDLING_POLICY.md](api/ERROR_HANDLING_POLICY.md)
    Error semantics and “never leak draft/private content” behavior.

13. [deployment/ENVIRONMENT_BASELINE.md](deployment/ENVIRONMENT_BASELINE.md)
    Required env vars and environment-specific behavior.

14. [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md)
    How it is deployed and wired in production.

15. [architecture/TECH_STACK_NEXTJS.md](architecture/TECH_STACK_NEXTJS.md)
    Tech stack declaration (single source of truth).

This list is intentionally redundant in a few places (e.g., rendering + SEO) because those requirements influence both backend and frontend decisions.

---

## Extended Documentation (Optional)

Swap these in when you need deeper detail, onboarding help, or operational maturity. They are useful, but not strictly required to start implementation.

- [backend/BACKEND_IMPLEMENTATION_CHECKLIST.md](backend/BACKEND_IMPLEMENTATION_CHECKLIST.md)
  Use during implementation to prevent missing critical requirements.

- [frontend/FRONTEND_MIGRATION_GUIDE_NEXTJS.md](frontend/FRONTEND_MIGRATION_GUIDE_NEXTJS.md)
  Use when porting prototype HTML/CSS/JS into Next.js.

- [architecture/IMAGE_STRATEGY_BASELINE.md](architecture/IMAGE_STRATEGY_BASELINE.md)
  Use when questions arise about image hosting, rendering, and whether uploads are in-scope.

- [operations/POST_LAUNCH_SUPPORT_POLICY.md](operations/POST_LAUNCH_SUPPORT_POLICY.md)
  Use when preparing for launch/maintenance ownership.

- [operations/UAI_INCIDENT_RESPONSE_RUNBOOK.md](operations/UAI_INCIDENT_RESPONSE_RUNBOOK.md)
  Use if uptime/support needs become more important.

- [development/DEVELOPER_GUIDE.md](development/DEVELOPER_GUIDE.md)
  Use for onboarding new contributors.

- [development/DEVELOPMENT_SETUP.md](development/DEVELOPMENT_SETUP.md)
  Use when setting up new machines or standardizing local dev.

---

## How to Use This Index

- Start with **Product Vision → Architecture → API → Phase 1/2 Specs**.
- If a document is missing, use this index to identify what to restore next.
- When making spec changes, treat these as the most “contract-sensitive” docs:
    - [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
    - [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
    - [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

---

## AI Instructions

When using AI tools (Copilot/ChatGPT) to implement or modify the system, follow these rules:

- Backend rules are authoritative for business logic and safety constraints.
- Public API must enforce: `status=published` AND `visibility=public`.
- Slugs are immutable after publication.
- Backend remains Express (do not move logic into Next.js API routes).
- Public pages must remain server-rendered for SEO (SSG/ISR/SSR; admin routes are client-only).

## AI Navigation Rules

This documentation index is intended to help AI assistants (Copilot, ChatGPT)
understand the project architecture quickly.

Important rules:

- Backend rules are authoritative.
- The backend remains a separate Express API service.
- Next.js must not implement business logic in API routes.
- Public pages must only render content where:
  status=published AND visibility=public.
- Slugs are immutable after publication.
- Admin routes (/admin/\*) are client-side only and must not be indexed.

When unsure about system behavior, consult:

1. PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
2. API_CONTRACT_NEXTJS.md
3. PHASE_1_BACKEND_SPEC.md
