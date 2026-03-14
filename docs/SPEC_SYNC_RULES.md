# Spec Sync Rules (Anti-Drift)

Purpose: prevent documentation drift between the API contract, backend implementation spec, and frontend implementation spec.

This project is intentionally split into **two services**:

- Next.js frontend (App Router)
- Express backend (REST API)

Because multiple docs describe overlapping behavior, any change must keep these specs synchronized.

---

## Spec Groups That Must Stay Synchronized

### API (Contract)

- [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
  The canonical list of endpoints, query params, response shapes, and public/admin boundary behavior.

### Backend (Implementation)

- [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
  How the Express API is implemented (layers, validation, auth, business rules, CORS/rate limits).

- [backend/BACKEND_IMPLEMENTATION_CHECKLIST.md](backend/BACKEND_IMPLEMENTATION_CHECKLIST.md)
  Implementation checklist to prevent missing requirements.

### Frontend (Implementation)

- [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
  Next.js App Router implementation rules (rendering modes, metadata, data fetching expectations).

- [frontend/FRONTEND_ARCHITECTURE.md](frontend/FRONTEND_ARCHITECTURE.md)
  How the Next.js frontend consumes the Express API (fetching patterns, server vs client boundaries).

---

## Sync Rules (Non-Optional)

### Rule 1 — Endpoint changes must propagate

If **any API endpoint** is added/removed/renamed or its method changes:

- Update [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
- Update backend docs:
    - [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
    - [backend/BACKEND_IMPLEMENTATION_CHECKLIST.md](backend/BACKEND_IMPLEMENTATION_CHECKLIST.md)
- Update frontend docs:
    - [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)
    - [frontend/FRONTEND_ARCHITECTURE.md](frontend/FRONTEND_ARCHITECTURE.md)

### Rule 2 — Pagination response shape must remain consistent

List endpoints must consistently return the same envelope shape:

```json
{
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 0,
        "totalPages": 0
    }
}
```

If the pagination model or response shape changes, update **all** API, backend, and frontend specs and examples.

### Rule 3 — Public filtering rule must remain identical everywhere

The public website and public API must enforce the same rule:

- Only return/render records where `status=published` **AND** `visibility=public`.
- Public reads must treat non-public content as not existing (return 404; do not leak).

This rule must be consistent across:

- [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
- [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
- [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

### Rule 4 — Admin routes must remain under `/api/admin/*`

Admin endpoints must keep the `/api/admin/*` prefix.

Rationale:

- Prevents accidental public exposure.
- Keeps frontend admin calls predictable.
- Keeps routing policies (robots, caching, middleware) simple.

If an endpoint is admin-protected, it belongs under `/api/admin/*`.

### Rule 5 — Auth changes must update admin documentation

If authentication changes (JWT vs cookies, login routes, token storage, role checks, etc.), update:

- [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
- [admin/ADMIN_PANEL_ARCHITECTURE_NEXTJS.md](admin/ADMIN_PANEL_ARCHITECTURE_NEXTJS.md)
- [admin/ADMIN_WORKFLOW.md](admin/ADMIN_WORKFLOW.md)
- (and any frontend spec sections that describe admin behavior)

---

## Pre-Commit Checklist (Architecture/Spec Changes)

Before committing any architecture/spec changes, verify:

- [ ] The change is reflected in the API contract (if it touches endpoints/shapes).
- [ ] Backend spec and backend checklist are updated (if backend behavior is impacted).
- [ ] Frontend spec and frontend architecture docs are updated (if frontend expectations are impacted).
- [ ] Pagination examples still parse `{ data, pagination }` for list endpoints.
- [ ] Public filtering rule is unchanged and explicitly stated where relevant.
- [ ] Admin endpoints still use `/api/admin/*`.
- [ ] Any auth changes are reflected in admin panel docs and workflows.
- [ ] Docs examples match the contract (paths, methods, response shapes).

Optional but recommended sanity check:

- [ ] Search the docs for the changed endpoint string and update all occurrences.

---

## When In Doubt

If docs disagree, treat the following as the resolution order:

1. [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
2. [api/API_CONTRACT_NEXTJS.md](api/API_CONTRACT_NEXTJS.md)
3. [backend/PHASE_1_BACKEND_SPEC.md](backend/PHASE_1_BACKEND_SPEC.md)
4. [frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md](frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md)

---

## Documentation Integrity Checks

This section consolidates the project’s documentation consistency checks.
Use it whenever documentation is edited or whenever implementation work risks drifting from the stable architecture.

### Architecture consistency checks

Verify that these documents remain logically consistent (no contradictions):

- [architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md](architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
- [ARCHITECTURE_LOCK.md](ARCHITECTURE_LOCK.md)
- [architecture/ARCHITECTURAL_INVARIANTS.md](architecture/ARCHITECTURAL_INVARIANTS.md)
- [architecture/SYSTEM_BOUNDARIES.md](architecture/SYSTEM_BOUNDARIES.md)

Minimum checks:

- Next.js stays a **frontend**; Express stays a **separate backend service**.
- Public content rule is identical everywhere: `status=published AND visibility=public`.
- JWT auth model remains: JWT stored in **HttpOnly cookies** for admin auth.
- Media architecture remains Cloudinary + URL-only storage in MongoDB.

### Spec synchronization rules

These are the non-optional sync requirements:

- Endpoint/path/method changes must propagate across the API contract, backend spec, and frontend spec.
- Pagination stays consistent with the contract examples and with `{ data, pagination }` envelopes.
- Public filtering rule wording and behavior stays identical across all specs.

### API contract drift checks

When docs or code change:

- Search for the endpoint string across `docs/api/`, `docs/backend/`, and `docs/frontend/` and update all occurrences.
- Confirm request/response examples in the backend and frontend specs match the shapes in the API contract.
- Confirm “public vs admin” boundaries are consistent (especially `/api/admin/*`).

### Architecture lock checks

Before committing, re-check [ARCHITECTURE_LOCK.md](ARCHITECTURE_LOCK.md):

- No backend business logic moved into Next.js route handlers.
- Express remains the only place for backend business rules.
- Cloudinary remains the media storage system.

---

## AI Architecture Guardian

Reusable prompt for AI assistants to detect contradictions and drift across the documentation set.
Paste this prompt into an AI tool when reviewing changes.

```text
AI_ARCHITECTURE_GUARDIAN

You are the Architecture Guardian for the UAI project.

Goal:
- Detect contradictions and drift across the project documentation.
- Do NOT invent new architecture. Prefer the smallest edits that restore consistency.

Authority order (when docs conflict):
1) docs/architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
2) docs/ARCHITECTURE_LOCK.md
3) docs/architecture/ARCHITECTURAL_INVARIANTS.md and docs/architecture/SYSTEM_BOUNDARIES.md
4) docs/api/API_CONTRACT_NEXTJS.md
5) docs/backend/PHASE_1_BACKEND_SPEC.md
6) docs/frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md

Documents to check:
- docs/api/API_CONTRACT_NEXTJS.md
- docs/backend/PHASE_1_BACKEND_SPEC.md
- docs/frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md
- docs/architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
- docs/ARCHITECTURE_LOCK.md

Checks (must verify all):

1) Backend architecture (hard boundary)
- Express must remain a separate backend service.
- Next.js must not implement backend business logic (no moving rules/controllers into Next.js route handlers).

2) API contract consistency
- Endpoints, query params, and response shapes must match across:
  - docs/api/API_CONTRACT_NEXTJS.md
  - docs/backend/PHASE_1_BACKEND_SPEC.md
  - docs/frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md

3) Media architecture (Cloudinary pipeline)
- Cloudinary must remain the media storage system.
- The upload pipeline must remain:
  Admin UI → Express API → Cloudinary → MongoDB stores URL only

4) Authentication model
- Admin authentication must use JWT stored in HttpOnly cookies.

5) Public content filtering rule
- Public endpoints must enforce:
  status = published
  AND
  visibility = public

6) Pagination model
- Offset pagination must remain:
  - page (1-based)
  - limit (max 50)
- Response envelope must remain:
  {
    data: [],
    pagination: {}
  }

Method:
- For each check, locate the relevant statements/examples in each document.
- Report any contradiction or missing requirement.
- If contradictions exist, propose the smallest possible doc edits to bring all docs back into sync.

Output format:

ARCH_GUARDIAN_REPORT

status: PASS | FAIL

contradictions:
- check: <1-6>
  files: <list of docs>
  issue: <what conflicts or is missing>
  authority_resolution: <which document wins and why>
  minimal_fix: <what to change, and in which doc>

notes:
- <optional additional observations>
```
