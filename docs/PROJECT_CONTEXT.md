# Project Context

Repository: UAI Website

Architecture:

- Next.js frontend (App Router)
- Express backend (REST API)
- MongoDB database

Repository structure:

frontend/
backend/
docs/

Key architecture rules:

- Backend remains a separate Express REST API.
- Next.js consumes the API via HTTP using NEXT_PUBLIC_API_BASE_URL.
- Public pages must be server rendered (SSG / ISR / SSR).
- Admin routes (/admin/\*) are client-side only and must not be indexed.
- Public API must enforce:
  status = published AND visibility = public.

Documentation location:

All architecture documentation is located in:

docs/

Important documents include:

- architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
- api/API_CONTRACT_NEXTJS.md
- backend/PHASE_1_BACKEND_SPEC.md
- frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md
- frontend/FRONTEND_ARCHITECTURE.md
- seo/SEO_BASELINE.md

AI collaboration model:

ChatGPT:

- architecture reasoning
- documentation validation
- system design review

GitHub Copilot Chat:

- repository inspection
- code analysis
- implementation assistance

Human mediator:

- transfers context between AI systems
