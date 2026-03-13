# Developer Guide

This guide helps a new developer understand the project quickly.

Project type: **content-driven nonprofit website** (Ukraine Aid International).

## 1) Project Purpose

The website exists to:

- Publish posts in a consistent format across the canonical categories
- Announce events and community activities
- Collect contact messages from supporters/partners
- Build a newsletter subscriber list

The primary goal is **trust + transparency** through fast, SEO-friendly public pages.

---

## 2) High-Level Architecture

The system is intentionally split into **two services**:

- **Frontend:** Next.js (App Router)
- **Backend:** Node.js + Express REST API
- **Database:** MongoDB (Atlas recommended)

Simple architecture diagram:

```text
Internet
  ↓
Next.js Frontend (App Router)
  ↓  (REST over HTTP)
Express API (Node.js)
  ↓
MongoDB (Atlas)
```

Why this split matters:

- The backend enforces business rules (publishing, visibility, auth)
- The frontend focuses on server-rendered pages + UX
- Services can deploy and scale independently

Important rule: this is **not** a monolithic Next.js API project. Do **not** introduce Next.js API routes.

---

## 3) Backend Responsibilities

The Express backend is responsible for:

- API endpoints (public + admin)
- Request validation (Zod)
- Authentication (JWT for admin)
- Database access (MongoDB via Mongoose)
- Business rules (slug generation/immutability, visibility/status enforcement, etc.)

Key idea: controllers should stay thin; business logic belongs in services.

---

## 4) Frontend Responsibilities

The Next.js frontend is responsible for:

- Public, **server-rendered** pages for SEO (SSG/ISR/SSR)
- File-based routing using the App Router (`app/`)
- SEO metadata (`metadata` / `generateMetadata`) and sitemap/robots policies
- Admin UI under `/admin/*` (client-rendered, not indexable)

Key idea: public routes should render meaningful HTML without relying on client-side fetching.

---

## 5) API Communication

The frontend communicates with the backend via HTTP requests.

- Base URL is provided by `NEXT_PUBLIC_API_BASE_URL`
- Public endpoints are used by public pages (server-rendered)
- Admin endpoints are protected by JWT and used by admin screens (client-rendered)

Public vs admin endpoints (conceptual):

- Public examples: `GET /api/posts`, `GET /api/posts/:slug`
- Admin examples: `GET /api/admin/...`, `POST /api/admin/...`

Important rule: public endpoints must only return content where `status=published` AND `visibility=public`.

---

## 6) Rendering Model

Rendering choices are route-driven:

- **SSG**: stable public pages (fast, SEO-friendly)
- **ISR**: public content that changes over time without full rebuilds
- **SSR**: reserved for pages that must be always-fresh (if/when needed)
- **Client rendering**: `/admin/*` pages (interactive admin UI; not SEO-targeted)

If you’re new to App Router, focus first on the difference between Server Components (default) and Client Components (`"use client"`).

---

## 7) Development Workflow

Typical local workflow:

- Start MongoDB (local or Atlas)
- Run the Express API service
- Run the Next.js dev server
- Make changes in backend routes/services/models and/or frontend pages/components
- Validate end-to-end by loading public pages and exercising admin flows

Two helpful starting docs:

- Local setup: [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)
- Frontend architecture details: [frontend/FRONTEND_ARCHITECTURE.md](../frontend/FRONTEND_ARCHITECTURE.md)

---

## 8) Deployment Overview

Production deploys **separate services**:

- Next.js frontend deployed as its own web service
- Express API deployed as its own web service
- MongoDB hosted on Atlas

Deployment guide:

- Render deployment: [deployment/DEPLOYMENT.md](../deployment/DEPLOYMENT.md)
