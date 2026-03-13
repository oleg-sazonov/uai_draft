# System Boundaries

Purpose: document the architectural separation between major system components so responsibilities and non-responsibilities remain unambiguous during implementation.

This project is intentionally split into separate services.

---

## Frontend (Next.js)

Responsibilities:

- Server-render public pages (SSG/ISR/SSR as defined in the rendering docs)
- Provide the admin UI under `/admin/*`
- Fetch data from the backend REST API
- Render SEO metadata in server-rendered HTML

Must NOT:

- Implement backend business logic
- Access MongoDB directly
- Bypass or replace backend endpoints for protected/admin behavior

---

## Backend (Express)

Responsibilities:

- Enforce business rules (publishing/visibility rules, slug immutability, etc.)
- Handle authentication and authorization for admin routes
- Manage media uploads (Cloudinary)
- Interact with MongoDB (persistence, queries, indexes)

---

## Database (MongoDB)

Stores:

- Posts
- Events
- Contact messages
- Newsletter subscribers
- Admin users

---

## Media Storage

- Cloudinary stores images
- MongoDB stores URLs only (no blobs/buffers)

---

## External Services

- Mailchimp for newsletter campaigns
