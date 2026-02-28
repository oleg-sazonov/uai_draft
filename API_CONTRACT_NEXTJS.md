# API Contract (Draft)

This is a lightweight contract to guide Phase 1 backend implementation. It documents intended endpoints and key rules, not internal code structure.

## Public Endpoints

### GET /api/posts

Returns a list of posts for the public website.

**Rule:** only posts where `status=published` AND `visibility=public` are returned.

### GET /api/posts/:slug

Returns a single post by slug.

**Rule:** only returns the post if `status=published` AND `visibility=public`.  
If not available publicly, return 404 (do not leak internal/draft content).

### GET /api/events

Returns a list of events for the public website.

**Rule:** only events where `status=published` AND `visibility=public` are returned.

### GET /api/posts/slugs

Returns a list of slugs for posts that are eligible for static generation.

**Rule:** only posts where `status=published` AND `visibility=public` are returned.

Response shape (example):

```json
["winter-relief-mission", "medical-supplies-kostiantynivka"]
```

Notes:

- This endpoint exists to support Next.js `generateStaticParams`
- Do not include drafts/internal/archived posts

### POST /api/posts/:slug/like

Increment like counter for a published + public post.

Response:

```json
{
    "likes": 7
}
```

## Filtering

### GET /api/posts?tag=water

Returns **published + public** posts where the `tags` array includes the provided tag.

Notes:

- Tags are stored as lowercase strings; the API should normalize `tag` to lowercase before matching.
- Filtering does not change public visibility rules: results must still satisfy `status=published` AND `visibility=public`.

## Admin Endpoints

These endpoints are protected and only accessible to authenticated admin users.

### Posts

- POST /api/posts
  Create a post (typically created as draft, then published).
  Supports optional tags: `tags: string[]` (optional)

- PATCH /api/posts/:id
  Update a post.
  Supports optional tags: `tags: string[]` (optional)

- DELETE /api/posts/:id
  Delete a post.

### Events

- POST /api/events
  Create an event.

- PATCH /api/events/:id
  Update an event.

- DELETE /api/events/:id
  Delete an event (if supported) or archive via update (implementation detail).

## Pagination (Applies to list endpoints)

Pagination is supported for:

- `GET /api/posts`
- `GET /api/events`

### Pagination Model (Authoritative)

Pagination is **query-based offset pagination** in Phase 1.

- No cursor pagination in Phase 1.
- `page` is **1-based**.
- `limit` is capped at **50** (requests above 50 must be clamped to 50).
- Pagination is applied **after** filtering.

### Query Parameters

- `page` (default: `1`)
- `limit` (default: `10`, max: `50`)

Notes:

- `page` is 1-based.
- If `limit` is greater than 50, the API must cap it at 50.

Validation rules:

- `page` must be a positive integer (1-based). Non-numeric values return **HTTP 400**.
- `limit` must be a positive integer. Non-numeric values return **HTTP 400**.
- `page < 1` is treated as `page=1`.
- `limit < 1` defaults to `limit=10`.

### Response Shape

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

Where:

- `total` = total number of matching records **after filtering**
- `totalPages` = `ceil(total / limit)`

### Public Filtering Rule (Still Enforced)

Public list endpoints must still enforce:

- `status=published` AND `visibility=public`

**Important:** Pagination is applied **after** this filtering.  
That means `total` and `totalPages` reflect only the published + public dataset.

### Simple behavior for out-of-range pages

- If `page` exceeds `totalPages`, return an empty `data` array with a valid `pagination` object.
- No cursor pagination in Phase 1 (offset-based only).

## Sorting (Applies to list endpoints)

Default sorting is applied to list endpoints.

Sorting occurs **after** public filtering (`status=published` AND `visibility=public`) and **before pagination**.

- Posts (`GET /api/posts`): sort by `publishedAt` **descending** (newest published first)
- Events (`GET /api/events`): sort by `startDate` **ascending** (upcoming first)

---

## Admin Read/Update (Operational)

### Contact Messages (Forms)

- GET /api/admin/forms  
  List contact messages (includes pending/responded; archived handling is an admin concern).

- PATCH /api/admin/forms/:id  
  Update status (e.g., mark responded, archive).

### Newsletter Subscribers

- POST /api/newsletter  
  Create a subscriber if the email does not already exist.

- GET /api/admin/newsletter  
  List all collected subscriber email addresses.

Notes:

- The system does NOT manage subscription lifecycle.
- There is NO subscriber status field.
- The API does NOT support unsubscribe.
- Email delivery and unsubscribe handling are managed entirely by an external email platform (e.g., Mailchimp).
- The admin panel only supports viewing and exporting subscribers.

---

## Frontend Compatibility Notes (Next.js SSR/SSG/ISR)

This API contract is intentionally **frontend-framework-agnostic** and is compatible with:

- Server-rendered consumption (Next.js Server Components)
- Static generation flows (SSG/ISR) for public posts via slug-based routes
- Client-side admin pages making authenticated requests (Axios recommended)

**Important:** Public endpoints must remain safe to call from server rendering contexts and must never leak draft/internal/archived content.

---

## Validation

- All request payloads are validated using **Zod** before reaching controllers.
- Invalid payloads return **HTTP 400** with validation error details.
