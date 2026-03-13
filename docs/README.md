# Documentation Index

This folder contains the architecture, development specifications, and operational documentation for the **Ukraine Aid International (UAI)** website project.

The documentation is organized by responsibility areas to make navigation easier for developers and maintainers.

---

# Architecture

Core architectural decisions and system design documents.

- **PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md**
  Full system architecture and entity definitions.

- **TECH_STACK_NEXTJS.md**
  Technology stack and architectural principles.

- **RENDERING_DECISIONS.md**
  Defines how each route is rendered (SSG, ISR, SSR, client-side).

- **IMAGE_STRATEGY_BASELINE.md**
  Rules for image handling and rendering.

---

# API

Defines the backend API surface and operational behavior.

- **API_CONTRACT_NEXTJS.md**
  REST API contract between the frontend and backend.

- **ERROR_HANDLING_POLICY.md**
  Standard error handling rules and response structure.

---

# Backend

Backend implementation specifications.

- **PHASE_1_BACKEND_SPEC.md**
  Backend architecture, validation rules, service layers, and security baseline.

---

# Frontend

Next.js frontend architecture and migration documentation.

- **PHASE_2_NEXTJS_FRONTEND_SPEC.md**
  Implementation plan for the Next.js frontend.

- **FRONTEND_ARCHITECTURE.md**
  Frontend rendering model, component structure, and data fetching strategy.

- **FRONTEND_MIGRATION_GUIDE_NEXTJS.md**
  Migration guide from the static HTML prototype to the Next.js App Router architecture.

---

# Admin Panel

Admin panel behavior and architecture.

- **ADMIN_PANEL_ARCHITECTURE_NEXTJS.md**
  Content management logic and admin UI structure.

- **ADMIN_WORKFLOW.md**
  Admin user workflows and operational behavior.

---

# SEO

Search engine optimization baseline and indexing rules.

- **SEO_BASELINE.md**
  SEO requirements, sitemap strategy, metadata rules, and indexing policies.

---

# Deployment

Environment configuration and deployment rules.

- **ENVIRONMENT_BASELINE.md**
  Environment variables and environment behavior.

- **DEPLOYMENT.md**
  Deployment instructions and hosting architecture.

---

# Development

Guides for developers working on the project.

- **DEVELOPMENT_SETUP.md**
  Local development setup.

- **DEVELOPER_GUIDE.md**
  High-level overview of the system for new developers.

---

# Product Vision

Product goals and project scope.

- **PRODUCT_VISION_NEXTJS.md**
  Defines the purpose of the website, audience, and project goals.

---

# Important Architectural Principles

1. **Backend-first development**
2. **Frontend consumes backend via REST API**
3. **Public pages are server-rendered for SEO**
4. **Admin routes are client-side only**
5. **Only `status=published` AND `visibility=public` content is publicly visible**

---

# Project Phase Order

1. Phase 0 — Architecture & System Design
2. Phase 1 — Backend Implementation
3. Phase 2 — Next.js Frontend Implementation
4. Phase 3 — Testing & Stabilization
5. Phase 4 — Production & Security
