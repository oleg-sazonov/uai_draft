# AI Collaboration (UAI)

Purpose: keep AI-assisted work simple, consistent, and aligned with the stable architecture.

This project is often worked on by a solo developer using one or more AI assistants.
When multiple AIs are used (e.g., Copilot for repo inspection + another AI for reasoning), treat this document as the shared collaboration contract.

---

## Collaboration Principles

- Prefer **small, targeted changes** over broad refactors.
- Treat architecture documents as **constraints**, not suggestions.
- If a request conflicts with the architecture authority order, **flag it explicitly** and propose the smallest compliant alternative.
- Avoid creating new process/governance artifacts.

---

## Architecture Authority Order (Conflict Resolution)

If documents disagree, resolve conflicts in this order:

1. `docs/architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md` (authoritative architecture)
2. `docs/ARCHITECTURE_LOCK.md` (locked decisions)
3. `docs/architecture/ARCHITECTURAL_INVARIANTS.md` + `docs/architecture/SYSTEM_BOUNDARIES.md` (non-negotiables and boundaries)
4. `docs/api/API_CONTRACT_NEXTJS.md` (endpoints, request/response shapes)
5. `docs/backend/PHASE_1_BACKEND_SPEC.md` (backend implementation spec)
6. `docs/frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md` (frontend implementation spec)
7. Supporting docs (deployment, SEO, admin workflows, etc.)

---

## Cross-AI Handoff Template

Use this template when transferring repo-aware findings from one AI to another.

```text
CROSS_AI_HANDOFF

GOAL
- <one sentence>

ARCHITECTURE CONSTRAINTS (must preserve)
- <bullet list of invariants/locks relevant to the task>

AUTHORITY REFERENCES
- Phase 0: docs/architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
- API: docs/api/API_CONTRACT_NEXTJS.md
- Backend: docs/backend/PHASE_1_BACKEND_SPEC.md
- Frontend: docs/frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md
- Anti-drift rules: docs/SPEC_SYNC_RULES.md

REPO CONTEXT
- Key files:
  - <paths>
- Relevant snippets/behaviors:
  - <short notes>

FINDINGS
- <what is true today>

RISKS / CONTRADICTIONS
- <doc or code contradictions, if any>

PATCH PLAN
- <exact files to modify/create/delete>

QUESTIONS
- <up to 3 clarifying questions if truly needed>
```

---

## Reusable Response Structure (Recommended)

When producing implementation or doc changes, use a consistent structure:

- PROJECT_CONTEXT (what matters in the repo)
- ANALYSIS (what it means)
- ISSUES (drift/bugs/risks)
- RECOMMENDATIONS (minimal compliant change)
- PATCH_PLAN (exact files)

---

## Lightweight Prompt Prefixes (Optional)

If you want a short, repeatable way to keep AI outputs aligned, prefix requests with one of:

- FEATURE_PLANNING: goal + non-goals + constraints + plan
- SAFE_IMPLEMENTATION: files to change + hard rules + verification checklist
- PRE_COMMIT_REVIEW: change summary + drift checks vs Phase 0 + API contract
- DOCS_SYNC_CHECK: list docs changed + run the checks in `docs/SPEC_SYNC_RULES.md`
