# Express Backend Patterns (Implementation Guide)

This document defines practical implementation patterns for the Express backend used in the UAI project.

It complements the following documents:

- `PHASE_1_BACKEND_SPEC.md`
- `BACKEND_IMPLEMENTATION_CHECKLIST.md`
- `API_CONTRACT_NEXTJS.md`
- `ERROR_HANDLING_POLICY.md`

The goal of this document is to ensure **consistent backend structure, predictable error handling, and maintainable code**.

---

# 1. Recommended Backend Folder Structure

The backend should follow a layered architecture.

```
backend/
  src/
    routes/
    controllers/
    services/
    models/
    validators/
    middlewares/
    utils/
    config/
    app.js
    server.js
```

### Responsibilities

| Folder      | Responsibility               |
| ----------- | ---------------------------- |
| routes      | Define HTTP endpoints        |
| controllers | Handle request/response      |
| services    | Business logic               |
| models      | Database schemas (Mongoose)  |
| validators  | Zod validation schemas       |
| middlewares | Auth, error handling, etc.   |
| utils       | Small reusable helpers       |
| config      | Database, environment config |

---

# 2. Request Flow (Required Pattern)

All requests must follow this flow:

```
Route
 → Validator
 → Controller
 → Service
 → Model
 → Database
```

Example:

```
POST /api/admin/posts
```

Flow:

```
Route
→ validatePostInput
→ controller.createPost
→ service.createPost
→ PostModel.create()
```

**Important rule:**

Controllers must not contain business logic.

---

# 3. Async Error Handling Pattern

Express does not automatically catch errors thrown inside async functions.

To avoid repetitive `try/catch` blocks, use an async wrapper.

## asyncHandler utility

```
src/utils/asyncHandler.js
```

```js
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
```

## Controller usage

```js
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find();

    res.json(posts);
});
```

This ensures errors are passed to the global error middleware.

---

# 4. Global Error Middleware

Centralized error handling is required to comply with `ERROR_HANDLING_POLICY.md`.

```
src/middlewares/errorMiddleware.js
```

```js
export const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
    });
};
```

Register middleware **after routes**:

```js
app.use(errorMiddleware);
```

---

# 5. Standard API Response Structure

API responses should follow predictable structures.

### Success Response

```
{
  "data": {}
}
```

### Pagination Response

```
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Error Response

```
{
  "error": "Validation failed"
}
```

---

# 6. Validation Layer (Zod)

All request payloads must be validated **before reaching controllers**.

Example validator:

```
src/validators/postValidators.js
```

```js
import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    content: z.string().min(1),
});
```

Validation middleware:

```
src/middlewares/validate.js
```

```js
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Validation error",
            details: result.error.errors,
        });
    }

    req.validatedData = result.data;

    next();
};
```

---

# 7. Controller Pattern

Controllers should only:

- receive validated input
- call services
- return responses

Example:

```js
export const createPost = asyncHandler(async (req, res) => {
    const post = await postService.createPost(req.validatedData);

    res.status(201).json({
        data: post,
    });
});
```

Controllers must not contain:

- database queries
- complex business rules

---

# 8. Service Layer Pattern

Services contain business logic.

Example:

```
src/services/postService.js
```

```js
export const createPost = async (data) => {
    const post = await Post.create(data);

    return post;
};
```

Services may:

- enforce business rules
- transform data
- coordinate multiple models

---

# 9. Route Structure

Routes should be minimal.

Example:

```
src/routes/postRoutes.js
```

```js
router.post("/api/admin/posts", validate(createPostSchema), createPost);
```

Routes should not contain logic.

---

# 10. Environment Configuration

Environment variables must be stored in `.env`.

Example:

```
PORT=4000
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=development
```

Load using:

```
dotenv.config()
```

inside `server.js`.

---

# 11. Security Basics

Recommended middleware:

```
helmet
cors
express-rate-limit
```

Example:

```js
app.use(helmet());
app.use(cors());
app.use(express.json());
```

---

# 12. Logging

Use structured logging.

Simple approach:

```
console.log (development)
```

Better approach later:

```
pino
winston
```

---

# 13. Development Best Practices

Recommended workflow:

1. Implement one model at a time
2. Test endpoints using Postman
3. Validate request payloads
4. Confirm API responses match the API contract
5. Only then integrate frontend

---

# 14. Minimum First Implementation

Start with the simplest feature:

Posts.

Implement:

```
POST /api/admin/posts
GET /api/posts
GET /api/posts/:slug
```

Verify functionality before adding more features.

---

# Final Principle

The backend should prioritize:

- **clarity**
- **predictable structure**
- **consistent error handling**
- **strict validation**

Avoid premature optimization or unnecessary abstractions.
