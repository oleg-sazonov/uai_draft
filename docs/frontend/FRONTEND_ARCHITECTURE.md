# Frontend Architecture (Next.js App Router)

This document explains how the **Next.js frontend** works in this project.

**Non-negotiable architecture rules**

- The frontend is **Next.js (App Router)**.
- The backend is a **separate Express API service**.
- The frontend consumes the backend via **REST over HTTP** using `NEXT_PUBLIC_API_BASE_URL`.
- Public pages are **server-rendered** for SEO (SSG/ISR/SSR). `/admin/*` is not SEO-targeted.
- This is **not** a monolithic Next.js API project—do **not** introduce Next.js API routes.

---

## 1) Overview

The frontend is built with **Next.js App Router**, which provides:

- **File-based routing** via the `app/` directory
- **Server Components by default** (rendered on the server)
- First-class support for **SSG / ISR / SSR**
- Route-level SEO metadata via `metadata` / `generateMetadata`

### How this differs from a React SPA

A traditional React SPA typically:

- Ships a mostly-empty HTML shell
- Fetches data in the browser after hydration
- Relies heavily on client-side routing

In this project, public pages are designed to be **server-rendered**:

- HTML is produced on the server (build-time or request-time)
- Search engines can index meaningful content
- Metadata is available without waiting for client-side JS

---

## 2) Rendering Strategy

This project uses a mix of rendering modes depending on the route’s needs:

- **SSG (Static Site Generation):** rendered at build time
    - Example: `/` (stable marketing content), `/sister-cities`

- **ISR (Incremental Static Regeneration):** static pages that periodically revalidate
    - Example: `/mission-log` (content list changes over time)
    - Example: `/mission-log/[slug]` (individual posts update occasionally)

- **SSR (Server-Side Rendering):** rendered on each request (always-fresh)
    - Example: any future public route that must never be stale

- **Client-side rendering (admin pages):** rendered in the browser
    - Example: `/admin/*` (interactive UI, not indexable)

Rule of thumb:

- If the page is **public and SEO-relevant**, it should be **SSG/ISR/SSR**.
- If the page is **admin-only**, it can be **client-rendered**.

---

## 3) Server Components

### What they are

- **Server Components run on the server** (Node runtime) and do not ship their code to the browser.
- They are the default in App Router.
- They are ideal for **public pages**: they can fetch data securely/server-side and output HTML.

### Data fetching approach

- Use **native `fetch()`** from Server Components.
- Call the Express API using `NEXT_PUBLIC_API_BASE_URL`.

### Example: server-rendered mission log list (ISR)

```tsx
// app/mission-log/page.tsx

export default async function MissionLogPage() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${apiBaseUrl}/api/posts`, {
        // ISR: revalidate this page periodically
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error("Failed to load posts");
    }

    const { data: posts, pagination } = await response.json();

    return (
        <main>
            <h1>Mission Log</h1>
            <ul>
                {posts.map((post: { slug: string; title: string }) => (
                    <li key={post.slug}>
                        <a href={`/mission-log/${post.slug}`}>{post.title}</a>
                    </li>
                ))}
            </ul>
        </main>
    );
}
```

Notes:

- The API is responsible for enforcing public visibility rules.
- If you need SSR (always-fresh) instead of ISR, use `cache: "no-store"`.

---

## 4) Client Components

### What they are

- Client Components run in the browser.
- They are used for:
    - interactive UI (forms, stateful widgets)
    - admin pages (`/admin/*`)
- They must start with the directive: `"use client"`.

### Example: client-side admin widget (Axios)

```tsx
// app/admin/components/AdminPostList.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Post = { _id: string; title: string };

export function AdminPostList() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        axios
            .get(`${apiBaseUrl}/api/admin/posts`, {
                // Admin auth is cookie-based (JWT in HttpOnly cookie).
                // When calling the API cross-origin, include credentials.
                withCredentials: true,
            })
            .then((res) => setPosts(res.data.data))
            .catch(() => setPosts([]));
    }, []);

    return (
        <section>
            <h2>Admin Posts</h2>
            <ul>
                {posts.map((p) => (
                    <li key={p._id}>{p.title}</li>
                ))}
            </ul>
        </section>
    );
}
```

---

## 5) Data Fetching (Frontend → Express API)

The frontend calls the backend using HTTP requests to the Express API base URL:

- Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL`

Example public endpoints:

- `GET /api/posts`
- `GET /api/posts/:slug`

Important rule: **public filtering is enforced by the API**.

- Public pages must only display content where `status=published` AND `visibility=public`.
- The frontend should assume the backend will not return draft/internal content for public endpoints.

---

## 6) Folder Structure (App Router)

Next.js App Router uses **file-based routing** in the `app/` directory.

Example structure (simplified):

```text
app/
  layout.tsx
  page.tsx
  mission-log/
    page.tsx
    [slug]/
      page.tsx
  admin/
    page.tsx
    components/
      AdminPostList.tsx
```

How routing works:

- `app/page.tsx` maps to `/`
- `app/mission-log/page.tsx` maps to `/mission-log`
- `app/mission-log/[slug]/page.tsx` maps to `/mission-log/:slug`
- `app/admin/page.tsx` maps to `/admin`

`[slug]` indicates a **dynamic route segment**.

---

## 7) Markdown Rendering

Post content is stored in MongoDB as a **Markdown string** (source of truth). The frontend converts Markdown to HTML when rendering public pages.

Guidelines:

- Treat the Markdown as content, not code.
- If your Markdown renderer supports embedded HTML, disable it or sanitize output to prevent injection.

Conceptual example:

```tsx
// app/mission-log/[slug]/page.tsx

function renderMarkdownToHtml(markdown: string): string {
    // Use the project’s chosen Markdown pipeline (e.g., remark/rehype) in real code.
    return markdown; // placeholder
}

export default function PostBody({ markdown }: { markdown: string }) {
    const html = renderMarkdownToHtml(markdown);

    return <article dangerouslySetInnerHTML={{ __html: html }} />;
}
```

---

## 8) Image Rendering

Public pages should render images using **Next.js `next/image`** (`<Image />`) rather than raw `<img>`.

Baseline requirements:

- Always provide meaningful `alt` text (or `alt=""` for decorative images)
- Prevent layout shift by providing `width`/`height` or using `fill` with a sized container

Example:

```tsx
import Image from "next/image";

export function FeaturedImage({ src, alt }: { src: string; alt: string }) {
    return <Image src={src} alt={alt} width={1200} height={630} priority />;
}
```

If images are hosted on external domains, ensure Next.js is configured to allow those image sources (via `next.config.js`).
