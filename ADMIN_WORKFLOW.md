# Admin Workflow

This document explains how the admin panel is expected to be used by content editors and admins.

---

## Creating a New Post

1. **Open Admin**
    - Go to the Admin panel and log in.
2. **Click “New Post”**
    - Choose to create a new post (Mission Report, News, or Update).
3. **Fill the basic fields**
    - Title
    - Category
    - Summary
    - Featured image (optional)
    - Gallery images (optional)
    - Aid type (optional)
    - Sister city partnership (optional)
    - Tags (optional; comma-separated)
    - Visibility (Public / Internal / Archived)

    Tags are simple labels used for grouping and filtering content.

    Example input:
    - `water, medical, winter`

4. **Write the content in Markdown**
    - The main `content` field is written as **Markdown** (not HTML).

5. **Save as Draft**
    - Use Draft while writing or waiting for approvals outside the system.

6. **Publish**
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
    - Date
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
