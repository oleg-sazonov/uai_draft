# Backend Structure (Express API)

This document describes the file structure of the Express backend service.

It is an implementation map for Phase 1 and complements:

- PHASE_1_BACKEND_SPEC.md
- API_CONTRACT_NEXTJS.md
- ERROR_HANDLING_POLICY.md

Architecture rules remain defined in those documents.

---

# Service Location

backend/

The backend is a standalone Express API service.

Technology stack:

Node.js  
Express  
MongoDB  
Mongoose  
Zod validation  
JWT authentication

---

# Backend Folder Structure

backend/

package.json  
.env.example

src/

config/  
env.js  
db.js

routes/  
public.js  
admin.js

controllers/  
posts.controller.js  
events.controller.js  
contact.controller.js  
newsletter.controller.js  
auth.controller.js

services/  
posts.service.js  
events.service.js  
contact.service.js  
newsletter.service.js  
auth.service.js

models/  
Post.js  
Event.js  
ContactMessage.js  
NewsletterSubscriber.js  
AdminUser.js

validators/  
posts.schemas.js  
events.schemas.js  
contact.schemas.js  
newsletter.schemas.js  
auth.schemas.js

middlewares/  
validate.js  
auth.js  
rateLimit.js  
errorHandler.js

utils/  
slugify.js  
pagination.js

entrypoints

app.js  
server.js

---

# Layer Responsibilities

Backend must follow this architecture:

validators → controllers → services → models

validators  
Validate request payloads using Zod.

controllers  
Handle HTTP request/response and call services.

services  
Contain business logic.

models  
Define database schemas and persistence logic.

---

# Important Middleware

validate.js  
Runs Zod validation before controllers.

auth.js  
Verifies JWT tokens for protected admin routes.

rateLimit.js  
Protects endpoints such as:

POST /api/contact  
POST /api/newsletter  
POST /api/admin/login

errorHandler.js  
Formats errors according to ERROR_HANDLING_POLICY.md.

---

# API Boundary

The backend is the only place where business logic exists.

Next.js must call the backend via HTTP using:

NEXT_PUBLIC_API_BASE_URL

Next.js API routes must not be used for backend logic.

---

# Phase 1 Scope

Backend implementation must support:

Posts  
Events  
Contact messages  
Newsletter subscribers  
Admin authentication

Public API endpoints must enforce:

status = published  
visibility = public

Otherwise the API returns 404.

---

# Notes

This file documents structure only.

Authoritative behavior rules remain defined in:

API_CONTRACT_NEXTJS.md  
PHASE_1_BACKEND_SPEC.md  
ERROR_HANDLING_POLICY.md
