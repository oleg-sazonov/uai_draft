# Ukraine Aid International - Frontend Migration Guide

## Project Overview

This repository contains the frontend codebase for **Ukraine Aid International**, a nonprofit organization facilitating aid to Ukrainian cities through sister city partnerships with American and European communities.

The project currently exists as a **static HTML/CSS/JavaScript prototype**. This prototype is not temporary scaffolding—it represents the **approved UX structure, content hierarchy, and data flow** for the production application.

The next phase involves migrating this prototype to a **React-based architecture** to enable dynamic content, component reusability, and scalable state management, while preserving the existing UX and visual design.

---

## Current Project State (HTML Prototype)

### Public Pages

- **index.html** - Homepage with hero, impact stats, latest posts, and sister cities geography
- **mission-log.html** - Mission reports and news feed with filtering
- **mission-log-post.html** - Single post view with content sections, gallery, and related posts sidebar
- **sister-cities.html** - Overview of all sister city partnerships
- **stamford-kramatorsk.html** - Individual city pair detail page
- **contact-us.html** - Contact form
- **donate-now.html** - Donation options and payment methods
- **login.html** - Admin login page

### Admin Panel

- **admin.html** - Content management interface with tab-based navigation:
    - **Mission Reports** - Create/edit posts with optional filtering metadata
    - **Events** - Create/edit events
    - **Forms** - View contact form submissions
    - **Newsletter** - Manage email subscriptions

### Key Characteristics

- **No backend** - All content is static
- **No authentication** - Admin panel is a UI draft
- **No data persistence** - Forms do not submit anywhere
- **Pure frontend structure** - Demonstrates navigation, layout, and content patterns

---

## Goals of Migration to React

### Why Migrate?

1. **Dynamic Content** - Enable content to be fetched from a backend API
2. **Component Reusability** - Avoid duplicating headers, footers, cards, and forms across pages
3. **State Management** - Handle filters, form state, and UI interactions systematically
4. **Scalability** - Support future features (authentication, search, multilingual support) without architectural refactoring

### Non-Goals

- **Visual redesign** - The existing layout and styling must be preserved
- **Backend implementation** - This guide focuses only on frontend architecture
- **Feature expansion** - No new features should be introduced during migration

---

## Mapping HTML Pages to React Components

### Public Pages → Page Components

| HTML File                  | React Component        | Route                |
| -------------------------- | ---------------------- | -------------------- |
| `index.html`               | `HomePage.jsx`         | `/`                  |
| `mission-log.html`         | `MissionLogPage.jsx`   | `/mission-log`       |
| `mission-log-post.html`    | `MissionPostPage.jsx`  | `/mission-log/:slug` |
| `sister-cities.html`       | `SisterCitiesPage.jsx` | `/sister-cities`     |
| `stamford-kramatorsk.html` | `CityPairPage.jsx`     | `/cities/:slug`      |
| `contact-us.html`          | `ContactPage.jsx`      | `/contact`           |
| `donate-now.html`          | `DonatePage.jsx`       | `/donate`            |
| `login.html`               | `LoginPage.jsx`        | `/login`             |

### Admin Panel → Nested Components

| HTML Section        | React Component           | Route               |
| ------------------- | ------------------------- | ------------------- |
| `admin.html` layout | `AdminLayout.jsx`         | `/admin`            |
| Mission Reports tab | `AdminPostsPage.jsx`      | `/admin/posts`      |
| Events tab          | `AdminEventsPage.jsx`     | `/admin/events`     |
| Forms tab           | `AdminFormsPage.jsx`      | `/admin/forms`      |
| Newsletter tab      | `AdminNewsletterPage.jsx` | `/admin/newsletter` |

### Reusable UI Components

Extract these from repeated HTML patterns:

**Layout Components**

- `Header.jsx` - Site navigation and logo
- `Footer.jsx` - Footer with links, contact info, and social media
- `AdminHeader.jsx` - Admin-specific header with logout button
- `AdminSidebar.jsx` - Quick stats (informational only, no navigation)

**Content Components**

- `PostCard.jsx` - Post preview card (used in grids)
- `SidebarPostCard.jsx` - Compact post card for related posts
- `CityCard.jsx` - Sister city preview card
- `ImpactCard.jsx` - Statistics card (homepage impact section)
- `EventCard.jsx` - Event preview card

**Form Components**

- `FilterBar.jsx` - Mission log filters (category, city, aid type, date)
- `ContactForm.jsx` - Contact form
- `PostForm.jsx` - Admin post creation/editing form
- `EventForm.jsx` - Admin event creation/editing form

**Utility Components**

- `Pagination.jsx` - Pagination controls
- `Accordion.jsx` - Mobile accordion for state maps
- `NewsletterSignup.jsx` - Newsletter subscription form

---

## Component-Based Architecture Principles

### Separation of Concerns

- **Layout Components** - Handle page structure (header, footer, sidebars)
- **Page Components** - Contain page-specific logic and layout
- **Content Components** - Display data (cards, tables, lists)
- **Form Components** - Handle user input and validation

### Reusability Rules

- Components should accept props for dynamic content
- Avoid hard-coding data inside components
- Use composition over configuration when possible

### Container vs Presentational Pattern

- **Container Components** - Fetch data, manage state, pass props down
- **Presentational Components** - Receive props, render UI, emit events

This pattern is optional but recommended for complex pages like `MissionLogPage` (container) + `PostCard` (presentational).

---

## Routing Strategy (React Router)

### Public Routes

```
/ → HomePage
/mission-log → MissionLogPage
/mission-log/:slug → MissionPostPage
/sister-cities → SisterCitiesPage
/cities/:slug → CityPairPage
/contact → ContactPage
/donate → DonatePage
/login → LoginPage
```

### Admin Routes (Protected)

```
/admin → Redirect to /admin/posts
/admin/posts → AdminPostsPage
/admin/posts/new → PostForm (create mode)
/admin/posts/:id/edit → PostForm (edit mode)
/admin/events → AdminEventsPage
/admin/events/new → EventForm (create mode)
/admin/events/:id/edit → EventForm (edit mode)
/admin/forms → AdminFormsPage
/admin/forms/:id → FormDetailPage
/admin/newsletter → AdminNewsletterPage
```

### Key Routing Notes

- Admin routes will require authentication in the future (not part of this migration)
- Single entity routing pattern: `/admin/:entity` for lists, `/admin/:entity/:id/edit` for editing
- Creation and editing happen at the route level, not via tabs
- Sidebar navigation in HTML is replaced by React Router's `<Link>` components

---

## State Management Strategy

### Local Component State

Use React's `useState` for:

- Form input values
- UI toggles (modals, accordions, dropdowns)
- Pagination state
- Tab visibility (admin panel)

### Shared State (Filters)

Mission log filters (category, city, aid type, date) should be:

- Managed at the `MissionLogPage` level
- Passed down to `FilterBar` and `PostCard` components
- Synced with URL query parameters (optional but recommended)

### Global State (Future)

When backend integration begins:

- Authentication state (user, token)
- Global notifications/toasts
- Application-wide settings

**Do not introduce Redux, Zustand, or Context API unless explicitly needed.** Start with local state and lift state up as needed.

---

## Admin Panel Migration Notes

### Entity-Based Structure

The admin panel manages four entities:

1. **Posts** (Mission Reports, News, Updates)
2. **Events** (Fundraisers, Galas, Community Events)
3. **Forms** (Contact form submissions)
4. **Newsletter** (Email subscribers)

### Tab vs Route Navigation

- **HTML prototype** - Uses tabs (`data-tab="mission-reports"`) controlled by JavaScript
- **React version** - Uses React Router (`/admin/posts`, `/admin/events`, etc.)
- Tabs are replaced by sidebar links or top navigation

### Filtering Fields (Optional)

Posts and Events have optional metadata fields:

- **Aid Type** - Optional, used for filtering on the public site
- **Sister City** - Optional, associates content with a city pair
- **Visibility** - Required (Public, Internal, Archived)

These fields **do not affect validity**. A post is valid even if Aid Type and Sister City are not specified.

### Forms and Newsletter (Read-Only)

- **Forms** - Display submissions, mark as processed (no creation)
- **Newsletter** - Display subscribers, export to CSV (no manual entry)

---

## Styling Strategy

### Current Approach

The HTML prototype uses a **centralized CSS architecture**:

- `styles/draft.css` - Main stylesheet importing all modules
- `styles/base/` - Reset, variables, typography
- `styles/components/` - Buttons, cards, forms, maps, newsletter
- `styles/layout/` - Container, header, footer, navigation
- `styles/pages/` - Page-specific styles (home, blog, admin, etc.)
- `styles/utilities/` - Responsive breakpoints

### Migration Options

**Option 1: Global CSS (Recommended for Initial Migration)**

- Import `styles/draft.css` into React app
- Use existing class names in JSX (`className="post-card"`)
- Minimal changes required
- Preserves existing visual design exactly

**Option 2: CSS Modules**

- Convert CSS files to `.module.css`
- Scope styles per component
- Better for long-term maintainability
- Requires refactoring class names

**Option 3: Styled Components / CSS-in-JS**

- Not recommended unless explicitly required
- Increases migration complexity
- Does not align with current architecture

### Responsive Design

All responsive breakpoints are defined in `styles/utilities/responsive.css`. These must be preserved during migration.

---

## Migration Phases

### Phase 1: React Project Setup

1. Initialize React app (Vite or Create React App)
2. Install React Router
3. Set up folder structure:
    ```
    src/
      components/
        layout/
        common/
        forms/
      pages/
        public/
        admin/
      styles/
      utils/
    ```
4. Copy existing CSS files into `src/styles/`
5. Import `draft.css` into `App.jsx`

### Phase 2: Public Pages Migration

1. Migrate static pages to React components:
    - Start with `HomePage`
    - Then `MissionLogPage` and `MissionPostPage`
    - Finally `SisterCitiesPage`, `CityPairPage`, `ContactPage`, `DonatePage`
2. Extract reusable components (`Header`, `Footer`, `PostCard`, etc.)
3. Implement routing with React Router
4. Test responsive behavior on all pages

### Phase 3: Admin Panel Migration

1. Migrate `AdminLayout` with header and sidebar
2. Migrate admin pages:
    - `AdminPostsPage` with creation/editing forms
    - `AdminEventsPage` with creation/editing forms
    - `AdminFormsPage` (read-only table)
    - `AdminNewsletterPage` (read-only table)
3. Implement nested routing (`/admin/posts/new`, `/admin/posts/:id/edit`)
4. Test tab-to-route conversion

### Phase 4: Backend Integration (Future)

- Connect to REST API or GraphQL
- Implement authentication
- Add real data fetching with `useEffect` or React Query
- Handle loading states and errors

---

## What Is Explicitly Out of Scope

The following are **not part of this migration**:

### Backend & Infrastructure

- API design and implementation
- Database schema
- Authentication and authorization
- User roles and permissions
- Email sending (newsletter, contact form)
- File uploads and storage

### Features Not Yet Defined

- Search functionality
- User accounts and profiles
- Comments and moderation
- Multilingual support (i18n)
- Analytics and reporting

### Deployment

- Hosting configuration
- CI/CD pipelines
- Domain setup
- SSL certificates

These will be addressed in future phases after the frontend migration is complete.

---

## Key Principles for Migration

1. **Preserve UX** - The HTML prototype defines the approved user experience. Do not redesign during migration.
2. **Incremental Migration** - Migrate one page at a time, test thoroughly before moving to the next.
3. **No Scope Creep** - Do not add new features or change data models.
4. **Component Reusability** - Extract reusable components early to avoid duplication.
5. **Routing Over Tabs** - Admin panel uses routes, not tabs.
6. **Optional Fields Stay Optional** - Aid Type and Sister City are optional metadata, not required fields.

---

## Getting Started

### For Developers Beginning Migration

1. **Review the HTML prototype** - Open `index.html`, `mission-log.html`, and `admin.html` in a browser to understand the UX.
2. **Audit existing CSS** - Review `styles/draft.css` and its imports to understand the styling architecture.
3. **Map components** - Use the tables in this README to plan which components to extract.
4. **Start with Phase 1** - Set up the React project and import existing styles.
5. **Migrate incrementally** - Start with `HomePage`, then move to `MissionLogPage`, etc.

### Questions?

If architectural decisions need clarification:

- Refer to this README
- Review the HTML prototype
- Check existing CSS structure

Do not make assumptions about features not explicitly defined.

---
