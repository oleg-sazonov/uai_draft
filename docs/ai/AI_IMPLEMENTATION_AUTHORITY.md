# AI Implementation Authority

This document defines the authoritative order of architecture documents for AI-assisted development (Copilot, ChatGPT, Claude).

**Purpose:** Prevent specification conflicts when AI tools generate backend or frontend code. When two documents disagree, the document higher in the authority order is authoritative.

---

## 1. Authority Order

The following hierarchy governs all AI-generated code decisions:

| Priority | Document                                    | Scope                        |
| -------- | ------------------------------------------- | ---------------------------- |
| 1        | `PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md` | Authoritative system design  |
| 2        | `ARCHITECTURAL_INVARIANTS.md`               | Non-negotiable system rules  |
| 3        | `API_CONTRACT_NEXTJS.md`                    | Endpoint contract            |
| 4        | `PHASE_1_BACKEND_SPEC.md`                   | Backend implementation spec  |
| 5        | `PHASE_2_NEXTJS_FRONTEND_SPEC.md`           | Frontend implementation spec |
| 6        | `ADMIN_UI_SPEC.md`                          | Admin panel UI specification |

### Conflict resolution rule

If two documents conflict, the document with the **higher priority** (lower number) is authoritative.

### Example

If `API_CONTRACT_NEXTJS.md` (priority 3) conflicts with `PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md` (priority 1), the Phase 0 architecture document wins.

---

## 2. AI Behavior Rules

AI tools must:

- **Follow architecture invariants** — All four invariants (public content leakage, slug immutability, media lifecycle, filtering consistency) are non-negotiable. See: `ARCHITECTURAL_INVARIANTS.md`.
- **Not invent new entities** — Do not introduce database collections, content types, or data models not defined in Phase 0.
- **Not bypass API contracts** — All endpoints, request/response shapes, and status codes must match `API_CONTRACT_NEXTJS.md`. Do not add, remove, or alter endpoints without explicit authorization.
- **Not expose draft or internal content** — Public endpoints and public pages must only surface records where `status=published` AND `visibility=public`. No exceptions.

---

## 3. Implementation Safety

AI tools must never modify the following architectural constraints, regardless of the request:

### Slug immutability

- Slugs are immutable after `status=published`.
- Title edits on published records must not regenerate the slug.
- Generated code must never allow slug changes on published records.

### Public content filtering

- Public API queries must enforce `status=published` AND `visibility=public` at the database level.
- If a record exists but is not publicly visible, the API must return 404.
- This rule applies to all public endpoints without exception.

### Media pipeline

- Upload path: Admin UI → Express API → Cloudinary.
- MongoDB stores URLs only (no blobs, no buffers, no base64).
- Media replacement and record deletion must trigger Cloudinary cleanup.
- The frontend must never upload directly to Cloudinary.

### Lifecycle rules

- `status`: `draft` | `published`
- `visibility`: `public` | `internal` | `archived`
- The combination `status=draft` + `visibility=archived` is invalid and must be rejected.
- `publishedAt` is set once on first publish and must never change after that.

---

## Reference

- Implementation rules: [../AI_IMPLEMENTATION_RULES.md](../AI_IMPLEMENTATION_RULES.md)
- AI collaboration protocol: [AI_COLLABORATION.md](AI_COLLABORATION.md)
- Architecture lock: [../ARCHITECTURE_LOCK.md](../ARCHITECTURE_LOCK.md)
