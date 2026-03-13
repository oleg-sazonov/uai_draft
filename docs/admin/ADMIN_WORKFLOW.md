# Admin Workflow

This document explains how the admin panel is expected to be used by content editors and admins.

## Creating a New Post

1. **Open Admin**
    - Go to the Admin panel and log in.
2. **Click “New Post”**
    - Choose to create a new Post and select a canonical category.
3. **Fill the basic fields**
    - Title
    - Category (Field Mission | Sister City & Sister State Partnerships | Events & Community | Organizational Updates | Media & Press)
    - Content
    - Featured image (required)
    - Visibility (Public / Internal / Archived)

    Optional fields:

    - Summary
    - Gallery images
    - Video URL
    - Aid type
    - Partnership
    - Location

4. **Write the content in Markdown**
    - The main `content` field is written as **Markdown** (not HTML).

5. **Upload media (Cloudinary via backend)**
    - The admin UI uploads images to the backend API.
    - The backend uploads to Cloudinary and returns URLs.
    - MongoDB stores URL references only.

6. **Save as Draft**
    - Use Draft while writing or waiting for approvals outside the system.

7. **Publish**
    - When ready, publish the post.
    - After publishing, the post URL slug becomes stable and should not change.

---

## Editing a Post

1. Open Admin → Posts list
2. Find the post and click **Edit**
3. Update fields as needed
4. Save changes
    - If the post is already published, the slug remains unchanged.

---

## Archiving a Post

1. Open Admin → Posts list
2. Select the post
3. Click **Archive**
4. Result:
    - Archived posts do not show on the public website.
    - Archived posts remain stored for recordkeeping.

---

## Creating an Event

1. Open Admin → Events
2. Click **New Event**
3. Fill required fields:
    - Title
    - startDate (required)
    - endDate (optional)
    - Location
    - Description
    - Visibility (Public / Internal / Archived)
4. Add optional fields if available
5. Save as Draft (if supported) or Publish when ready
6. Archived events are hidden from the public site but remain stored.

---

## Reviewing Contact Messages

1. Open Admin → Forms / Contact Messages
2. Review new messages (marked **Pending**)
3. Take action outside the system (reply via email, phone, etc.)
4. Update message status:
    - Mark as **Responded**
    - Archive to remove from default view

---

## Managing Newsletter Subscribers

1. Open Admin → Newsletter
2. View the subscriber list
3. Use **Export CSV** to download the full list

### Important Architectural Rule

This system **does not manage subscription lifecycle**.

- There is no local subscriber status.
- There is no unsubscribe logic inside this system.
- No emails are sent from this system.

Subscription management (unsubscribe, suppression lists, re-subscribe logic) is handled entirely by the external email platform (e.g., Mailchimp), which is the **single source of truth**.
