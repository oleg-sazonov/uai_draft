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

## Admin Endpoints

These endpoints are protected and only accessible to authenticated admin users.

### Posts

- POST /api/posts  
  Create a post (typically created as draft, then published).

- PATCH /api/posts/:id  
  Update a post.

- DELETE /api/posts/:id  
  Delete a post.

### Events

- POST /api/events  
  Create an event.

- PATCH /api/events/:id  
  Update an event.

## Admin Read/Update (Operational)

### Contact Messages (Forms)

- GET /api/admin/forms  
  List contact messages (includes pending/responded; archived handling is an admin concern).

- PATCH /api/admin/forms/:id  
  Update status (e.g., mark responded, archive).

### Newsletter Subscribers

- GET /api/admin/newsletter  
  List subscribers (active/unsubscribed).

- PATCH /api/admin/newsletter/:id  
  Update subscriber status (e.g., unsubscribe).

---

## Validation

- All request payloads are validated using **Zod** before reaching controllers.
- Invalid payloads return **HTTP 400** with validation error details.
