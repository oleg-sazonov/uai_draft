# DEPRECATION NOTICE

This document describes an early **URL-only** image strategy that predated the production media upload pipeline.

The current architecture includes:

- Admin media upload
- Express backend upload pipeline
- Cloudinary storage
- MongoDB storing **URLs only**

The canonical media architecture is defined in:

- [MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md](MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md)

---

# Image Strategy Baseline (Phase 0)

This document defines how images are handled in Phase 1 (backend) and Phase 2 (Next.js) without introducing a media system.

**Explicit statement:**

> This system is not a media management platform.

---

## 1) Backend (Phase 1) rules

### 1.1 Store image URLs only

- The backend stores image references as **strings** (URLs).
- Example fields:
    - `featuredImage: string | undefined`
    - `gallery: string[] | undefined`

### 1.2 No image upload system in Phase 1

This section reflected the initial Phase 0 baseline.

**Update:** Media uploads are now defined in `MEDIA_UPLOAD_ARCHITECTURE_CLOUDINARY.md`.

Rules that still apply:

- MongoDB stores **URLs only** (never raw images).
- The backend is responsible for upload and deletion lifecycle (no orphaned assets).

### 1.3 External hosting is allowed (temporary baseline)

- Images may be hosted externally (example: existing website/CDN links).
- This keeps Phase 1 focused on content + API correctness.

---

## 2) Frontend (Phase 2) rules (Next.js)

### 2.1 Next.js must render images using `<Image />`

**Rule:** Public pages rendered by Next.js must use `next/image` (`<Image />`) rather than raw `<img>`.

Why:

- performance improvements (responsive sizing)
- better page speed baseline

### 2.2 `alt` is required

- Every image must have an `alt` attribute.
- If an image is decorative, use `alt=""` and ensure it truly adds no informational value.

### 2.3 Avoid layout shift

To prevent layout shift (CLS), Next.js image rendering must include one of:

- explicit `width` and `height`, **or**
- `fill` with a sized parent container

---

## 3) What we are not defining yet (intentionally out of scope)

- No image transformation service defined yet (resizing pipeline, on-the-fly transforms, etc.)
- No internal media library
- No “asset manager” UI in admin
- No automatic EXIF handling, watermarking, or advanced optimization rules

These can be revisited after Phase 1 + Phase 2 are stable.
