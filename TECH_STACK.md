# Technical Stack

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Zod (runtime validation)
- JWT (future; for admin authentication)

## Frontend

- React
- React Router
- Axios

## Content Format

- Markdown is stored in the database (`posts.content` is a Markdown string)
- Markdown is converted to HTML on the frontend for display
- Raw HTML input is not accepted as content

## Architectural Principles

- Backend-first development (APIs and rules before React integration)
- Status and visibility are separate concepts
- Slugs are auto-generated from titles and must be unique per collection
- Slugs are immutable after publication (URL integrity)
- Public API filtering rule: only `status=published` AND `visibility=public`
