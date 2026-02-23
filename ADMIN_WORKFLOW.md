# Admin Workflow

This document explains how the admin panel is expected to be used by content editors and admins.

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
    - Visibility (Public / Internal / Archived)
4. **Write the content in Markdown**
    - The main `content` field is written as **Markdown** (not HTML).
5. **Save as Draft**
    - Use Draft while writing or waiting for approvals outside the system.
6. **Publish**
    - When ready, publish the post.
    - After publishing, the post URL slug becomes stable and should not change.

## Editing a Post

1. Open Admin → Posts list
2. Find the post and click **Edit**
3. Update fields as needed (title, summary, content, images, metadata)
4. Save changes
    - If the post is already published, the slug should remain unchanged.

## Archiving a Post

1. Open Admin → Posts list
2. Select the post
3. Click **Archive**
4. Result:
    - Archived posts do not show on the public website.
    - Archived posts remain in the admin system for recordkeeping.

## Creating an Event

1. Open Admin → Events
2. Click **New Event**
3. Fill required fields:
    - Title
    - Date
    - Location
    - Description
    - Visibility (Public / Internal / Archived)
4. Add optional fields if available:
    - Image
    - Registration link
5. Save as Draft (if supported for events) or Publish when ready
6. Archived events are hidden from the public site but remain stored.

## Reviewing Contact Messages

1. Open Admin → Forms / Contact Messages
2. Review new messages (typically marked **Pending**)
3. Take action outside the system (reply by email, follow up, etc.)
4. Update the message status:
    - Mark as **Responded** when handled
    - **Archive** to remove from the default view while keeping a record

## Managing Newsletter Subscribers

1. Open Admin → Newsletter
2. View the subscriber list
3. Actions:
    - **Export CSV** (if present) for use in an external email tool
    - **Unsubscribe** removes or marks an address as unsubscribed

No emails are sent by this system; it only stores the list.

---

## Markdown Quick Guide (for Post Content)

Markdown is a simple writing format that turns into styled content on the website.

### Common Formatting

Headings:

- `# Heading 1`
- `## Heading 2`
- `### Heading 3`

Bold:

- `**bold text**`

Lists:

- `- item one`
- `- item two`

Links:

- `[link text](https://example.com)`

### Formatting Buttons

If the editor includes buttons (Bold, Link, List, etc.), they **just insert Markdown syntax** for you. You can always type the Markdown directly.
