# AI Workflow

This document defines standard prompt prefixes for AI-assisted development.

## FEATURE_PLANNING

Use before implementing a new feature.

Purpose:
Ensure the feature aligns with architecture before development.

Prompt prefix (paste at top of the chat/request):

```text
FEATURE_PLANNING

Goal:
- <one sentence goal>

Non-goals:
- <what is explicitly not being built>

Constraints (must follow):
- Follow DOCS_INDEX.md → Architecture → API contract → Phase specs.
- Do not introduce new architecture unless explicitly requested.
- Preserve invariant rules (published/public visibility; immutable slugs; Express backend).

Docs to consult:
- ../DOCS_INDEX.md
- AI_CONTEXT.md
- ../architecture/PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
- ../api/API_CONTRACT_NEXTJS.md
- ../backend/PHASE_1_BACKEND_SPEC.md (if backend)
- ../frontend/PHASE_2_NEXTJS_FRONTEND_SPEC.md (if frontend)

Questions:
- <up to 3 clarifying questions if needed>

Plan:
- <step-by-step plan>
```

## SAFE_IMPLEMENTATION

Use when generating implementation code.

Purpose:
Ensure generated code follows architecture rules and specs.

Prompt prefix (paste at top of the chat/request):

```text
SAFE_IMPLEMENTATION

Scope:
- Files/components/endpoints to change: <list>

Hard rules:
- Keep backend as separate Express REST API.
- Enforce public-content rule: status=published AND visibility=public.
- Slugs are immutable after publication.
- Do not implement business logic in Next.js API routes.

Quality bar:
- Minimal, targeted changes.
- Update docs only when behavior/contracts change.
- Add/adjust tests when the repo has adjacent tests.

Deliverable:
- Provide code changes plus a short verification checklist.
```

## PRE_COMMIT_REVIEW

Use before committing changes.

Purpose:
Check for architecture drift and API inconsistencies.

Prompt prefix (paste at top of the chat/request):

```text
PRE_COMMIT_REVIEW

Change summary:
- <what changed>

Review checklist:
- No architecture drift vs PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md
- API responses still match API_CONTRACT_NEXTJS.md
- Error behavior matches ERROR_HANDLING_POLICY.md
- Rendering/SEO rules preserved (RENDERING_DECISIONS.md, SEO_BASELINE.md)
- Docs updated where needed (DOCS_INDEX.md, SPEC_SYNC_RULES.md)

Output:
- Risks/edge cases
- Any follow-up tasks
```

## DOCS_SYNC_CHECK

Use when documentation changes.

Purpose:
Verify documentation files remain synchronized.

Prompt prefix (paste at top of the chat/request):

```text
DOCS_SYNC_CHECK

Docs changed:
- <list>

Sync checks:
- DOCS_INDEX.md references new/changed docs
- ai/AI_CONTEXT.md remains consistent with the architecture reading order (ai/AI_NAVIGATION.md)
- SPEC_SYNC_RULES.md updated if new rules/invariants were introduced
- Core architecture docs remain synchronized (see ai/DOCUMENTATION_GUARDIAN.md)

Output format:
- DOCUMENTATION_SYSTEM_REPORT (see ai/DOCUMENTATION_GUARDIAN.md)
```

## ARCHITECTURE_REVIEW

Use when modifying architecture.

Purpose:
Ensure invariants and API contracts remain valid.

Prompt prefix (paste at top of the chat/request):

```text
ARCHITECTURE_REVIEW

Proposed change:
- <describe the change>

Must preserve:
- Core invariants (ARCHITECTURAL_INVARIANTS.md)
- Phase 0 architecture intent (PHASE_0_ARCHITECTURE_V3_NEXTJS_EDITION.md)
- API contract stability (API_CONTRACT_NEXTJS.md)

Required outputs:
- Updated architecture docs
- Updated API contract if endpoints/shapes change
- Migration notes and risk assessment
```
