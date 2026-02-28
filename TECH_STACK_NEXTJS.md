# Technical Stack

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Zod (runtime validation)
- JWT (admin authentication; protected admin API)

## Frontend

- Next.js (**App Router**)
- React (**Server Components + Client Components**)
- Axios (client-side admin calls when needed)
- Native `fetch` (Server Components / server-side data fetching)

### Rendering Capabilities (Frontend)

The Next.js frontend must support:

- **SSG (Static Site Generation)** for content-driven pages that can be pre-rendered
- **ISR (Incremental Static Regeneration)** for published content that updates over time without full rebuilds
- **SSR (Server-Side Rendering)** for pages that need always-fresh data (or future personalization)

## Content Format

- Markdown is stored in the database (`posts.content` is a Markdown string)
- Markdown is converted to HTML on the frontend for display
- Raw HTML input is not accepted as content

## Architectural Principles

- Backend-first development (APIs and rules before frontend integration)
- Backend remains a separate Express API service (not moved into Next.js API routes)
- Status and visibility are separate concepts
- Slugs are auto-generated from titles and must be unique per collection
- Slugs are immutable after publication (URL integrity)
- Public API filtering rule: only `status=published` AND `visibility=public`
