# Backend Implementation Checklist

This checklist tracks the implementation of the Express API (Phase 1).

Stack:

- Node.js
- Express
- MongoDB
- Mongoose
- Zod
- JWT authentication

Architecture rule:
validators → controllers → services → models

---

## Project Setup

- [ ] Initialize Node.js project
- [ ] Install core dependencies
- [ ] Create base folder structure
- [ ] Setup Express app
- [ ] Setup MongoDB connection
- [ ] Setup environment configuration
- [ ] Add global error handler
- [ ] Configure CORS
- [ ] Configure rate limiting

---

## Core Infrastructure

- [ ] Base Express app (`app.js`)
- [ ] HTTP server bootstrap (`server.js`)
- [ ] Database connection (`config/db.js`)
- [ ] Environment loader (`config/env.js`)
- [ ] Global error middleware
- [ ] API router entrypoint

---

## Models

- [ ] Post model
- [ ] Event model
- [ ] ContactMessage model
- [ ] NewsletterSubscriber model
- [ ] AdminUser model

Verify:

- [ ] slug unique index
- [ ] likes default value
- [ ] timestamps enabled
- [ ] required fields enforced

---

## Validation (Zod)

- [ ] PostCreateSchema
- [ ] PostUpdateSchema
- [ ] EventCreateSchema
- [ ] EventUpdateSchema
- [ ] ContactSchema
- [ ] NewsletterSchema
- [ ] LoginSchema

Verify:

- [ ] visibility enum
- [ ] status enum
- [ ] date validation

---

## Services (Business Logic)

- [ ] Slug generation utility
- [ ] Slug collision handling
- [ ] Slug immutability enforcement
- [ ] Public filtering enforcement
- [ ] Pagination logic
- [ ] Sorting logic

Post service:

- [ ] createPost
- [ ] updatePost
- [ ] deletePost
- [ ] getPublicPosts
- [ ] getPostBySlug
- [ ] likePost
- [ ] unlikePost

Event service:

- [ ] createEvent
- [ ] updateEvent
- [ ] deleteEvent
- [ ] getPublicEvents
- [ ] likeEvent
- [ ] unlikeEvent

Contact service:

- [ ] createContactMessage
- [ ] listMessages
- [ ] updateStatus

Newsletter service:

- [ ] createSubscriber
- [ ] listSubscribers

Auth service:

- [ ] loginAdmin
- [ ] password verification
- [ ] JWT generation

---

## Controllers

- [ ] Post controller
- [ ] Event controller
- [ ] Contact controller
- [ ] Newsletter controller
- [ ] Auth controller

Verify:

- [ ] controllers contain no business logic
- [ ] controllers call services only

---

## Routes

Public routes:

- [ ] GET /api/posts
- [ ] GET /api/posts/:slug
- [ ] GET /api/posts/slugs
- [ ] POST /api/posts/:slug/like
- [ ] DELETE /api/posts/:slug/like

- [ ] GET /api/events
- [ ] POST /api/events/:slug/like
- [ ] DELETE /api/events/:slug/like

- [ ] POST /api/contact
- [ ] POST /api/newsletter

Admin routes:

- [ ] POST /api/admin/login

- [ ] POST /api/admin/media/images

- [ ] POST /api/admin/posts
- [ ] PATCH /api/admin/posts/:id
- [ ] DELETE /api/admin/posts/:id

- [ ] POST /api/admin/events
- [ ] PATCH /api/admin/events/:id
- [ ] DELETE /api/admin/events/:id

- [ ] GET /api/admin/forms
- [ ] GET /api/admin/forms/:id
- [ ] PATCH /api/admin/forms/:id

- [ ] GET /api/admin/newsletter

---

## Security

- [ ] bcrypt password hashing
- [ ] JWT signing
- [ ] JWT verification middleware
- [ ] admin route protection

---

## Rate Limiting

Apply to:

- [ ] POST /api/contact
- [ ] POST /api/newsletter
- [ ] POST /api/admin/login

---

## Final Backend Checks

- [ ] public endpoints enforce `published + public`
- [ ] pagination works
- [ ] sorting works
- [ ] slug immutability works
- [ ] error responses follow policy
