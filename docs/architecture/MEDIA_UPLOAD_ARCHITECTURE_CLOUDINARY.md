# Media Upload Architecture (Cloudinary)

This document defines the production media upload architecture for the UAI system.

It extends the URL-only approach in `IMAGE_STRATEGY_BASELINE.md` and updates the earlier Phase 1 baseline that intentionally omitted uploads. The key invariant remains: **MongoDB stores URLs only**.

**System context**

- Frontend: Next.js (App Router)
- Backend: Node.js + Express REST API
- Database: MongoDB (Mongoose)
- Admin panel: authenticated admin users create/edit content
- Media provider: Cloudinary

**Non-negotiable constraints**

- Images are **NOT stored in MongoDB**.
- MongoDB stores **URLs only**.
- The **backend** uploads images to Cloudinary.
- The admin panel receives the returned URL and includes it in content payloads.
- File ingestion uses Express middleware (`multer`).

---

## Architectural Invariants

This document follows the system invariants defined in:

ARCHITECTURAL_INVARIANTS.md

These invariants define non-negotiable rules for:

- public content visibility
- slug immutability
- media lifecycle
- API filtering behavior

---

## 1) Overview of the media strategy

The system uses an **external media CDN** (Cloudinary) for all uploaded images.

- The admin panel uploads image files to the Express API.
- The Express API validates and streams the image to Cloudinary.
- Cloudinary returns a secure CDN URL.
- The API returns that URL to the admin panel.
- The admin panel stores that URL on the Post/Event record via normal JSON CRUD.

This design keeps the core application focused on content management and avoids turning the backend into a media storage service.

---

## 2) Why Cloudinary was chosen

Cloudinary is chosen because it provides:

- **CDN-hosted delivery** for fast global image load times
- **Reliability and storage offload** (no server disk management)
- **On-the-fly transformations** (resize/crop/format) using URL-based parameters
- **Automatic format and quality optimization** (`f_auto`, `q_auto`) when desired
- **Simple Node.js SDK** integration for backend-managed uploads

This aligns with the project constraint: URLs are stored, not raw media.

---

## 3) How media upload works in the system

### 3.1 Request/response flow

1. Admin user selects an image in the admin UI.
2. Admin UI creates a `multipart/form-data` request.
3. Request is sent to the Express API upload endpoint with admin auth.
4. Express uses `multer` to parse the incoming file into memory.
5. Express streams the file bytes to Cloudinary.
6. Cloudinary returns a secure CDN URL (e.g., `https://res.cloudinary.com/.../image/upload/...`).
7. Express returns JSON containing the URL.
8. Admin UI includes the URL in the subsequent create/update payload for the Post/Event.
9. MongoDB persists the URL string(s).

### 3.2 Boundaries (what happens where)

- Admin panel:
    - sends the raw file
    - receives URL
    - uses URL in content payloads
- Express API:
    - authenticates admin user
    - validates file type/size
    - uploads to Cloudinary
    - returns URL
- MongoDB:
    - stores URLs only
    - never stores images/blobs/buffers

---

## 4) Backend implementation steps

The backend should follow the repo’s standard layering:

`routes → controllers → services → Cloudinary SDK`

### Step-by-step

1. Install dependencies
    - `multer`
    - `cloudinary`
2. Add Cloudinary config module
    - read env vars
    - configure `cloudinary.v2`
3. Add upload middleware
    - use `multer.memoryStorage()`
    - enforce file size limits
    - enforce allowed MIME types
4. Add admin-protected upload route
    - e.g., `POST /api/admin/media/images`
    - protect with existing auth middleware
5. Implement controller + service
    - controller: accept parsed file, call service
    - service: stream buffer to Cloudinary, return URL
6. Return a stable API response shape
    - success: `{ "data": { "url": "..." } }`
    - errors: follow `ERROR_HANDLING_POLICY.md`
7. Update content create/update flows
    - posts/events payloads store URL string(s)

### Suggested Cloudinary config module

```js
// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
```

---

## 5) Required environment variables

Backend (Express) requires the following:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Recommended (optional) variables:

- `CLOUDINARY_FOLDER` (example: `uai`) — keeps assets organized
- `UPLOAD_MAX_BYTES` (example: `5242880` for 5MB) — server-side enforcement

Important rule:

- Cloudinary secrets are **backend-only**. They must never be exposed to the admin panel.

---

## 6) Example Express upload endpoint structure

This example demonstrates the intended structure (route → controller → service) using `multer` and Cloudinary streaming.

### Route

```js
// src/routes/admin.media.routes.js
import { Router } from "express";
import multer from "multer";
import { requireAdminAuth } from "../middlewares/auth.js";
import { uploadImage } from "../controllers/media.controller.js";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024),
    },
    fileFilter: (req, file, cb) => {
        const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
        if (!allowed.has(file.mimetype)) {
            return cb(new Error("Unsupported file type"));
        }
        cb(null, true);
    },
});

router.post(
    "/media/images",
    requireAdminAuth,
    upload.single("image"),
    uploadImage
);

export default router;
```

### Controller

```js
// src/controllers/media.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImageToCloudinary } from "../services/media.service.js";

export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Missing required file field: image",
            },
        });
    }

    const result = await uploadImageToCloudinary({
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
    });

    res.status(201).json({
        data: {
            url: result.url,
        },
    });
});
```

### Service

```js
// src/services/media.service.js
import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "uai";

export const uploadImageToCloudinary = async ({ buffer, originalName }) => {
    // Upload from memory buffer; do not write to disk.
    const url = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: CLOUDINARY_FOLDER,
                resource_type: "image",
                overwrite: false,
                unique_filename: true,
                use_filename: false,
                // Optional: restrict to known formats
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
                // Optional: apply safe defaults
                // transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
                context: originalName
                    ? `original_name=${originalName}`
                    : undefined,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );

        uploadStream.end(buffer);
    });

    return { url };
};
```

Notes:

- This endpoint is intentionally **admin-only**.
- This example returns only a URL to comply with the “URLs only in MongoDB” constraint.
- In production, ensure `multer` errors (file too large, invalid type) are mapped to `400` with `code: VALIDATION_ERROR`, and Cloudinary failures map to `502`/`500` without leaking vendor details.

---

## 7) How the admin panel sends images

The admin panel sends images as `multipart/form-data`.

Example (Next.js admin client-side action):

```ts
async function uploadImage(file: File) {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/media/images`,
        {
            method: "POST",
            // Admin auth is cookie-based (JWT in HttpOnly cookie).
            // Ensure requests include credentials when calling cross-origin.
            credentials: "include",
            body: form,
        }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error?.message || "Upload failed");
    }

    const json = await res.json();
    return json.data.url as string;
}
```

Important rules:

- The admin panel must **not** use Cloudinary credentials.
- The admin panel must not upload directly to Cloudinary in this architecture.

---

## 8) How URLs are stored in MongoDB

MongoDB stores **only string URLs** returned from Cloudinary.

Recommended patterns:

- Single image: `featuredImage: string`
- Gallery: `gallery: string[] | undefined`

The URLs are treated as user content references.

- The backend may validate that the URL is a well-formed HTTPS URL.
- The backend should not attempt to download or re-verify images during normal CRUD operations.

---

## 9) Example Post model fields using Cloudinary URLs

This example illustrates URL-only storage. It avoids storing image blobs and avoids storing Cloudinary secrets.

```js
// src/models/Post.js (fields excerpt)
const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },

        // Media (Cloudinary)
        featuredImage: { type: String, required: true },
        gallery: { type: [String], default: undefined },

        // Content
        summary: { type: String },
        content: { type: String, required: true },

        visibility: {
            type: String,
            enum: ["public", "internal", "archived"],
            required: true,
        },
        status: { type: String, enum: ["draft", "published"], required: true },
        publishedAt: { type: Date },
    },
    { timestamps: true }
);
```

Deletion/cleanup of images is required by the system invariants. This is achieved without storing blobs in MongoDB: the backend can derive the Cloudinary `public_id` from the stored URL at delete/replace time (URLs only remain the persisted reference).

---

## 10) Optional image optimization strategy

Optimization can be implemented without changing storage rules by using Cloudinary URL transformations at render time.

### 10.1 Store the original Cloudinary `secure_url`

- Store the returned URL as-is.
- Apply transformations when generating the image `src` for the frontend.

### 10.2 Apply transformations via Cloudinary URL parameters

Common defaults:

- `f_auto` (automatic format selection)
- `q_auto` (automatic quality)
- width/height/crop as needed per layout

Example conceptual output URL:

- Base stored URL: `https://res.cloudinary.com/<cloud>/image/upload/v123/uai/abc.jpg`
- Transformed render URL: `.../image/upload/f_auto,q_auto,w_1200,c_fill/...`

### 10.3 Next.js rendering

Public pages should continue to use `next/image` per the baseline image strategy.

- Ensure the Cloudinary domain is allowed by Next.js remote image configuration.
- Prefer setting explicit `width/height` (or `fill`) to avoid layout shift.

---

## 11) Security considerations

### 11.1 Authentication and authorization

- Upload endpoints must require admin authentication (`401` if missing/invalid).
- Consider role checks if roles exist (`403` when authenticated but not allowed).

### 11.2 Input validation

- Enforce file size limits with `multer` (`limits.fileSize`).
- Restrict MIME types (`image/jpeg`, `image/png`, `image/webp`).
- Reject empty uploads.

### 11.3 Operational protections

- Apply rate limiting on upload routes (even for admin) to reduce abuse risk.
- Configure CORS to allow only known admin origins.

### 11.4 Cloudinary account hygiene

- Keep Cloudinary API secret in backend environment only.
- Upload into a dedicated folder (e.g., `uai/`) to keep assets organized.
- Use non-overwriting uploads (`overwrite: false`) to avoid accidental replacement.

### 11.5 Data leakage and metadata

- Consider stripping metadata (EXIF/IPTC) if photos may contain sensitive info.
- If metadata stripping is required, enforce it through Cloudinary transformations/presets.

### 11.6 Error handling

- Do not return raw Cloudinary errors to clients.
- Return consistent error shapes per `ERROR_HANDLING_POLICY.md`.
- Log error details server-side for debugging.
