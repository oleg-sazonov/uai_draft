# AI Navigation Guide

## Purpose

This guide helps AI assistants (Copilot, ChatGPT, Claude) quickly understand the repository architecture and find authoritative documentation.

## Quick Architecture Reading Order

1. [../DOCS_INDEX.md](../DOCS_INDEX.md)
2. [AI_CONTEXT.md](AI_CONTEXT.md)
3. [../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
4. [../api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)
5. [../backend/PHASE_1_BACKEND_SPEC.md](../backend/PHASE_1_BACKEND_SPEC.md)
6. [../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

## Architectural Source of Truth

If documentation conflicts occur, resolve in this order:

1. [../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
2. [../api/API_CONTRACT_NEXTJS.md](../api/API_CONTRACT_NEXTJS.md)
3. [../backend/PHASE_1_BACKEND_SPEC.md](../backend/PHASE_1_BACKEND_SPEC.md)
4. [../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

## AI Safety Rules

- Backend remains a separate Express REST API.
- Public content rule: status=published AND visibility=public.
- Slugs are immutable after publication.
- Public pages must be server-rendered.
- Admin routes must remain under /admin/\* and must not be indexed.
