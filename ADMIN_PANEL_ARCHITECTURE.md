# Admin Panel Architecture & Content Management

## Overview

The admin panel is the content management interface for Ukraine Aid International's website. It allows authorized users to create, edit, and manage content that appears on the public-facing site.

The panel currently exists as a **static HTML prototype** that demonstrates the intended user experience and content workflows. This README describes the logical architecture and content management principles, not the visual implementation.

---

## Managed Content Types

The admin panel manages four primary content entities:

1. **Posts** - Mission reports, news articles, and general updates
2. **Events** - Fundraisers, galas, community gatherings, and awareness events
3. **Forms** - Contact form submissions from the public website
4. **Newsletter** - Email subscription list management

Each entity has its own dedicated management interface with appropriate creation, editing, or viewing capabilities.

---

## Posts Management

### What Are Posts?

Posts represent the primary content type on the website. They include:

- **Mission Reports** - Stories from humanitarian missions and aid deliveries
- **News** - General organizational news and announcements
- **Updates** - Progress reports, community highlights, and project updates

All three types share the same content structure and are managed through a unified interface.

### Post Fields

**Required Fields:**

- Title
- Date
- Category (Mission Report | News | Update)
- Content (main body text)
- Visibility (Public | Internal | Archived)

**Optional Fields:**

- Subtitle
- Featured image
- Aid type (Water, Heat, Medical, Food, etc.)
- Sister city partnership (Kramatorsk-Stamford, etc.)
- Video URL
- Gallery images
- Tags

### Content Visibility vs Status

Posts have two independent concepts that control their display:

**Visibility (Required):**

- **Public** - Appears on the public website
- **Internal** - Visible only to authorized users (not implemented yet)
- **Archived** - Hidden from public view but preserved

**Status (Implicit):**

- **Published** - Content is complete and live
- **Draft** - Content is incomplete or unpublished (future feature)

Currently, the "Publish Post" action sets visibility to Public. The "Save as Draft" option is a placeholder for future implementation.

### Optional Metadata Behavior

**Aid Type:**

- Optional field used for filtering on the public Mission Log page
- If not specified, the post is still valid and will appear in "All" category views
- Does not restrict where the post can be displayed

**Sister City Partnership:**

- Optional field associating content with a specific city pair
- If not specified, the post is considered organization-wide
- Does not affect post validity or publication

### Editing and Deletion

- **Edit** - Modify any post field and republish
- **Delete** - Permanently remove a post (no soft delete at this stage)
- **Preview** - View post before publishing (future feature)

Posts table shows:

- Title
- Category
- Aid type (if specified)
- Publication date
- Current status
- Action buttons (Edit | Delete)

---

## Events Management

### Why Events Are Separate

Events differ from posts in the following ways:

1. **Time-sensitive** - Events occur on specific dates and have registration deadlines
2. **Structural differences** - Include location, time, event type, and registration links
3. **Display requirements** - Shown in event calendars and upcoming events sections

While events could technically be modeled as posts, keeping them separate provides:

- Clearer content organization for editors
- Specialized form fields (date, time, location, registration)
- Distinct filtering on the public site

### Event Fields

**Required:**

- Event title
- Event date
- Location
- Event type (Fundraiser | Awareness Event | Gala | Community Gathering | Other)
- Description
- Visibility

**Optional:**

- Event time
- Event image
- Registration link

### Event Lifecycle

Events follow the same visibility model as posts:

- **Public** - Visible on the public events page
- **Internal** - For authorized users only
- **Archived** - Hidden but preserved

Events remain in the system after their date has passed. Archiving is a manual process.

---

## Contact Forms Management

### Purpose

The Forms section displays messages submitted through the public **Contact Us** form. This is a **read-only interface**—no content creation happens here.

### Form Submission Fields

Each submission includes:

- Date received
- Submitter name
- Email address
- Subject (selected from predefined options)
- Message body
- Status (Pending | Responded)

### Workflow

**Pending:**

- Form has been received but not yet addressed
- Administrator reviews the message
- Response happens outside the system (via email, phone, etc.)

**Responded:**

- Administrator marks the form as "Responded" after taking action
- This is a manual status update, not automated

**Archive:**

- Removes the form from the active view
- Preserves the record for historical purposes

### Admin Responsibilities

- Review incoming messages
- Respond via email or other channels
- Mark forms as "Responded" or "Archive" them
- Export form data if needed (future feature)

---

## Newsletter Subscribers Management

### Purpose

The Newsletter section displays a list of email addresses collected through the **newsletter signup form** on the public website.

### Subscriber Fields

- Email address
- Subscription date
- Status (Active)

### Workflow

**Subscription:**

- Users subscribe via the public website form
- Email is added to the subscriber list automatically
- Status is set to "Active"

**Unsubscribe:**

- Administrator manually removes an email from the list
- No automated unsubscribe link exists at this stage

**Export:**

- "Export to CSV" button allows download of subscriber list
- Used for importing into external email marketing tools (Mailchimp, Constant Contact, etc.)

**Send Newsletter:**

- Placeholder button for future feature
- Actual email sending happens outside this system

### No Built-In Email Sending

This panel **does not send emails**. It only manages the subscriber list. Administrators export the list and use external services to send newsletters.

---

## Routing Concept (Future React Migration)

### Current State

The admin panel currently uses **tab-based navigation** controlled by JavaScript. Clicking "Mission Reports," "Events," "Forms," or "Newsletter" switches the visible content section.

### Expected React Routes

When migrated to React, the panel will use **route-based navigation**:

```
/admin → Redirect to /admin/posts
/admin/posts → Posts list view
/admin/posts/new → Create new post
/admin/posts/:id/edit → Edit existing post
/admin/events → Events list view
/admin/events/new → Create new event
/admin/events/:id/edit → Edit existing event
/admin/forms → Forms list view
/admin/forms/:id → View individual form submission
/admin/newsletter → Newsletter subscriber list
/admin/newsletter/export → Export CSV (optional route)
```

### Routing Principles

1. **List views** are the default for each entity (`/admin/posts`, `/admin/events`, etc.)
2. **Creation** happens at `/entity/new`
3. **Editing** happens at `/entity/:id/edit`
4. **Viewing** (for read-only entities like forms) happens at `/entity/:id`
5. **No nested tabs** - Each route represents a distinct view

### Why This Matters

- Tabs cannot be bookmarked or shared
- Routes provide direct access to specific content
- Browser navigation (back/forward) works correctly
- URL structure matches logical content hierarchy

The HTML prototype uses tabs as a **temporary navigation mechanism**. The React version will replace this with proper routing.

---

## Out of Scope

The following features are **not part of the current admin panel architecture** and will be addressed in future development phases:

### Authentication & Authorization

- User login/logout
- Role-based permissions (Admin, Editor, Viewer)
- Session management
- Password reset

### Email Functionality

- Automated email sending
- Newsletter campaigns
- Form submission notifications
- Unsubscribe links

### Analytics & Reporting

- Content performance metrics
- User engagement tracking
- Form submission analytics
- Newsletter open/click rates

### Advanced Content Features

- Content versioning
- Scheduled publishing
- Multi-author support
- Content approvals/workflows

### Search & Filtering

- Full-text search across content
- Advanced filtering options
- Bulk actions (delete, archive, change status)

### Media Management

- Image library
- File uploads beyond basic forms
- Image editing/cropping
- Media organization

---

## Key Principles

### Content Architecture

- **Posts** are the primary content type (mission reports, news, updates)
- **Events** are structurally different and time-sensitive
- **Forms** are read-only submissions
- **Newsletter** is a simple subscriber list

### Metadata is Optional

- Aid type and sister city fields do not affect content validity
- Posts without these fields are still publishable
- Filtering on the public site handles missing values gracefully

### Visibility Controls Display

- **Public** = visible on the public website
- **Internal** = visible only to authorized users (future)
- **Archived** = hidden but preserved

### No Real Backend Yet

- The HTML prototype does not persist data
- Form submissions do not save
- Actions (Publish, Delete, Edit) are UI demonstrations only

### Migration Path

- Current HTML structure informs React component design
- Tab navigation will become route-based
- Forms and tables will become data-driven components
- Backend integration happens after frontend migration

---

## Assumptions

This architecture assumes:

1. Posts, events, forms, and newsletter subscribers are distinct entities
2. Content editors understand the difference between "visibility" and "status"
3. Optional metadata fields (aid type, sister city) are used for filtering, not validation
4. Forms and newsletters are managed outside the admin panel (email tools)
5. The admin panel will be migrated to React before backend integration

---

## Getting Started

For developers working on this admin panel:

1. **Review the HTML prototype** - Open `admin.html` to see the intended UX
2. **Understand entity relationships** - Posts ≠ Events, Forms are read-only
3. **Follow routing principles** - Plan for route-based navigation in React
4. **Respect optional fields** - Aid type and sister city are not required
5. **Refer to FRONTEND_MIGRATION_GUIDE.md** - For React migration strategy

---
