# Lifecycle Management

This document defines how system entities and media assets behave over time.

Lifecycle rules ensure that content remains consistent, media assets are not orphaned, and administrators have predictable workflows.

This document applies to:

- Posts
- Events
- Media assets (Cloudinary)
- Contact messages

Lifecycle management is intentionally simple to keep the system lightweight.

---

# 1 Content Lifecycle

Content entities (Posts and Events) follow a structured lifecycle.

Lifecycle states:

Draft → Published → Archived

In the current architecture:

- Draft/Published is controlled by `status` (draft/published)
- Archived is controlled by `visibility` (visibility=archived)

## Draft

Draft content:

- exists in the database
- is visible only in the admin panel
- is not accessible via public API endpoints

Draft content may be edited freely.

Draft records may be deleted without restrictions.

---

## Published

Published content:

- becomes visible on the public website
- is returned by public API endpoints if visibility = public
- receives a permanent slug-based URL

Once published:

- slug becomes immutable
- publishedAt timestamp is set
- title edits must not regenerate the slug

Published records may still be edited.

However, edits must not break slug stability.

---

## Archived

Archived content:

- remains stored in the database
- is hidden from public endpoints
- remains accessible in the admin panel

Purpose:

- historical record
- removal from public listings without deletion

Archived content may be restored by changing visibility.

Deletion of archived records is allowed but should be used cautiously.

---

# 2 Event Lifecycle

Events follow a slightly different lifecycle due to time-based behavior.

Event states:

Draft → Published → Past Event

Rules:

- Draft events behave like draft posts.
- Published events appear on the public Events page.
- When the event date passes, the event is automatically considered a **Past Event**.

Past events:

- remain publicly visible
- appear in the Past Events section
- remain part of the organization's historical record

Events are not automatically deleted.

---

# 3 Media Lifecycle (Cloudinary)

Media assets are stored in Cloudinary.

MongoDB stores URL references only.

Lifecycle stages:

Upload → Attached → Replaced/Removed → Deleted

---

## Upload

Media uploads occur through the admin panel.

Flow:

Admin UI → Express API → Cloudinary

Cloudinary returns a secure CDN URL.

The backend returns the URL to the admin panel.

At this stage the media asset is **temporary** until attached to content.

---

## Attached

Media becomes attached when its URL is stored on a Post or Event record.

Examples:

featuredImage  
gallery

Once attached:

- the asset is considered active
- the backend must track its usage through stored URLs

---

## Replaced or Removed

When an administrator replaces or removes media:

- the old Cloudinary asset must be deleted by the backend

This prevents orphaned assets.

---

## Record Deletion

When a Post or Event is deleted:

- all referenced Cloudinary assets must also be deleted

The backend is responsible for this cleanup.

---

## Abandoned Uploads

An upload may occur without the content being saved.

Example:

Admin uploads image → cancels editing.

The system must support an admin-only cleanup endpoint to delete such assets.

---

# 4 Contact Message Lifecycle

Contact messages represent incoming communication from website visitors.

States:

Pending → Responded

---

## Pending

A newly submitted contact message:

- appears in the admin panel
- is marked as Pending

Administrators review the message and respond using their normal email system.

---

## Responded

After replying externally:

- the administrator marks the message as Responded

Responded messages remain stored for reference.

Messages are not automatically deleted.

Deletion should only occur manually if necessary.

---

# 5 Lifecycle Simplicity Rule

This system intentionally avoids complex workflow systems.

Not included:

- multi-stage editorial approval
- automated moderation
- content scheduling
- workflow engines
- media asset libraries

The goal is to keep the system predictable and easy to operate for a small nonprofit team.
