# ADMIN_UI_SPEC.md

Admin Panel UI Specification  
Ukraine Aid International CMS

This document defines the canonical UX structure for the Admin Panel.
AI tools must follow this specification when generating or modifying admin UI.

Authority:
Phase 0 architecture defines the data model.
This document defines the UX layout for editing that data.

---

# 1. ADMIN PANEL GOALS

The admin panel is designed for non-technical administrators.

Primary goals:

• Publish mission updates  
• Manage events  
• Upload media (images)  
• Manage communications (contact / newsletter)

The UI must prioritize **simplicity and clarity**.

---

# 2. ADMIN NAVIGATION STRUCTURE

Sidebar navigation:

Dashboard

Content
• Posts
• Events

Communication
• Contact Messages
• Newsletter Subscribers

---

# 3. POST EDITOR STRUCTURE

The Post Editor is the most important UI in the system.

Editor layout order MUST be:

1. Title
2. Category / Status
3. Summary
4. Content Editor
5. Media
6. Metadata
7. Publish Actions

---

# 4. POST EDITOR UI

## Title

Text input.

Required.

---

## Category

Select field.

Values must match Phase 0 categories:

• Field Mission
• Sister City & Sister State Partnerships
• Events & Community
• Organizational Updates
• Media & Press

---

## Summary

Short description.

Textarea.

Recommended length: 200–300 characters.

---

## Content Editor

The content editor uses **Markdown**.

Raw HTML must not be allowed.

Toolbar must support:

Bold  
Italic  
Heading 2  
Heading 3  
List  
Quote  
Link

Editor layout:

Toolbar

Large textarea

Minimum editor height:

350px

---

# 5. MEDIA SECTION

Media section appears after the content editor.

Fields:

Featured Image (required)

Gallery Images (optional)

Video URL (optional)

Image uploads are local preview only in the prototype.

Real upload pipeline:

Admin UI → Express API → Cloudinary → MongoDB stores URL.

---

# 6. METADATA

Metadata section contains optional structured fields.

Aid Type  
Partnership  
Location  
Visibility

Aid Type may allow multiple selections.

---

# 7. STATUS

Status options:

draft  
published

Visibility options:

public  
internal  
archived

---

# 8. EVENTS EDITOR

Events are a separate entity from posts.

Fields:

Title  
Description  
Start Date  
End Date (optional)  
Location  
Featured Image  
Registration Link (optional)  
Status  
Visibility

---

# 9. FEATURED IMAGE RULE

Featured image is required for Posts.

The UI must clearly mark this field as required.

---

# 10. CONTENT FIRST PRINCIPLE

The content editor must be the largest UI element.

Editors spend most of their time writing content.

The interface must prioritize writing over metadata.

---

# 11. PROTOTYPE REQUIREMENTS

Prototype HTML must include:

• toolbar buttons
• large editor
• file upload preview
• logical form grouping

Prototype does NOT implement backend logic.

---

# 12. AI GENERATION RULE

AI tools modifying admin UI must NOT:

• remove the content editor toolbar
• reduce editor size
• move metadata above content
• add fields not present in Phase 0
