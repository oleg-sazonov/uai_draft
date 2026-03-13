# Architectural Invariants

These invariants define non-negotiable rules of the UAI system architecture.

If any invariant is violated, treat it as an **architecture bug**, not a feature tradeoff.

---

## Invariant 1 — Public content leakage MUST NOT happen

Public endpoints and public pages must only expose content where:

status = published  
AND  
visibility = public

Rules:

- Backend queries MUST enforce this filtering at the database level.
- Frontend must not rely on hiding draft or internal content.
- If a record exists but is not publicly visible, the API MUST return **404**.
- Public pages must never call `/api/admin/*` endpoints.

---

## Invariant 2 — Slug instability MUST NOT happen

Once a Post or Event is published, its slug becomes immutable.

Rules:

- Slugs are generated automatically from the title.
- Once `status=published`, the slug MUST NOT change.
- Title edits after publication MUST NOT regenerate the slug.
- Backend update attempts that change a published slug MUST fail.

---

## Invariant 3 — Media lifecycle MUST NOT create orphaned Cloudinary assets

Media files are stored in Cloudinary. MongoDB stores only URLs.

Rules:

- MongoDB MUST store URL strings only.
- The backend uploads media to Cloudinary.
- When media is replaced or removed, the backend MUST delete the old Cloudinary asset.
- When a Post or Event is deleted, associated media MUST also be deleted.
- The system MUST support cleanup of abandoned uploads.

---

## Invariant 4 — Filtering MUST be consistent

Filtering behavior must always be defined by the backend API.

Rules:

- Backend API query parameters define filtering semantics.
- Frontend filters must map 1:1 to API parameters.
- Client-side filtering must not diverge from backend results.
- Pagination and sorting must occur after filtering.
