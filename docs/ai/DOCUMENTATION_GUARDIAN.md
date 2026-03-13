# Documentation Guardian

This document defines the process for verifying documentation consistency.

AI tools should verify that documentation files remain synchronized.

## Responsibilities

Verify that:

1. DOCS_INDEX.md references all new documentation files.
2. AI_CONTEXT.md remains consistent with the architecture reading order.
3. SPEC_SYNC_RULES.md reflects any new architectural rules.
4. Core architecture documents remain synchronized.

## Architecture checks (must verify)

Architecture files that must be verified:

- ../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
- ../architecture/ARCHITECTURAL_INVARIANTS.md
- ../api/API_CONTRACT_NEXTJS.md
- ../backend/PHASE_1_BACKEND_SPEC.md
- ../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md

The guardian must verify that:

- API endpoints in API_CONTRACT match backend specs
- Backend rules align with Phase 0 architecture
- Frontend expectations align with API contract
- Architectural invariants remain consistent across docs

## When to run

Documentation Guardian should be used:

- when a new documentation file is added
- before committing documentation changes
- after architectural changes

## Output format

AI tools should output:

DOCUMENTATION_SYSTEM_REPORT

Each issue must include:

issue
file
explanation
recommended fix

Example:

```text
DOCUMENTATION_SYSTEM_REPORT

issue: API contract and backend spec drift
file: docs/api/API_CONTRACT_NEXTJS.md
explanation: API_CONTRACT declares GET /api/posts supports category filtering, but PHASE_1_BACKEND_SPEC does not include it.
recommended fix: Update the backend spec and implementation checklist (or revise the API contract) so they match.
```
