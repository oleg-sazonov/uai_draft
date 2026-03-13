# UAI Incident Response Runbook

Project: Ukraine Aid International  
Stack: Express API + MongoDB + Next.js (App Router)  
Purpose: Provide a structured response plan for production issues.

---

# 1. Principles

- Stay calm.
- Confirm the issue before acting.
- Identify whether the problem is:
    - Backend (Express API)
    - Frontend (Next.js)
    - Database (MongoDB)
    - Environment / Hosting
    - External service
- Never expose internal errors publicly.
- Document what happened after resolving the issue.

---

# 2. Incident Classification

## Critical

- Website completely unavailable
- API returns 500 for all requests
- Admin login broken
- Database connection failure

Target response time: Same day (ideally within hours)

## Major

- Some pages failing
- Posts not updating
- Newsletter or contact form failing

Target response time: Within 24–48 hours

## Minor

- Layout issue
- Metadata issue
- Small UI bug

Target response time: Next maintenance cycle

---

# 3. If Website Is Completely Down

## Step 1 — Confirm

- Open the website in browser.
- Test from another device or network.
- Use direct API endpoint (example: `/api/posts`).

## Step 2 — Check Hosting

- Log into hosting dashboard.
- Check service status.
- Restart service if necessary.

## Step 3 — Check Backend Logs

- Look for:
    - Unhandled exceptions
    - Port binding issues
    - Environment variable errors

## Step 4 — Check MongoDB

- Log into MongoDB Atlas.
- Verify cluster status.
- Check connection string.
- Confirm IP whitelist.
- Confirm storage limit not exceeded.

## Step 5 — Verify Environment Variables

Backend:

- MONGODB_URI
- JWT_SECRET
- NODE_ENV
- PORT

Frontend:

- NEXT_PUBLIC_API_BASE_URL
- NEXT_PUBLIC_SITE_URL

---

# 4. If API Returns 500 Errors

## Checklist

- Reproduce issue locally (if possible).
- Test specific endpoint manually.
- Check logs for stack trace.
- Confirm Mongo connection.
- Confirm slug uniqueness constraint not violated.
- Confirm Zod validation not failing unexpectedly.

If unknown cause:

- Roll back recent deployment (if applicable).
- Compare recent code changes.

---

# 5. If Content Not Appearing on Public Site

## Step 1 — Verify Data

In Admin:

- Confirm `status = published`
- Confirm `visibility = public`

## Step 2 — Test Public Endpoint

- GET `/api/posts`
- GET `/api/posts/:slug`
- GET `/api/posts/slugs`

Confirm:

- Correct filtering (`published + public`)
- Correct sorting by `publishedAt`

## Step 3 — Check ISR / Revalidation

- Confirm `revalidate = 60` (or defined value)
- Wait for revalidation window
- Redeploy frontend if necessary

---

# 6. If Admin Login Fails

## Checklist

- Test POST `/api/admin/login` manually.
- Confirm JWT_SECRET matches production.
- Check bcrypt password hash.
- Confirm rate limiting not blocking IP.
- Reset admin password if necessary.

---

# 7. If Contact or Newsletter Fails

## Contact Form

- Check POST `/api/contact`
- Confirm rate limit not exceeded
- Confirm database write working

## Newsletter

- Check POST `/api/newsletter`
- Confirm duplicate email handling
- Confirm Mongo insert succeeds

Note:
The system does NOT manage unsubscribe lifecycle.
External email platform is source of truth.

---

# 8. If SSL / Domain Issue Occurs

## Checklist

- Check SSL certificate expiration.
- Verify DNS records.
- Verify hosting provider status.
- Confirm HTTPS redirect working.

---

# 9. If Sitemap or SEO Issue Occurs

## Checklist

- Open `/sitemap.xml`
- Confirm slugs endpoint returns only `published + public`
- Verify canonical URL
- Verify robots.txt behavior per environment
- Confirm admin routes are blocked

---

# 10. Monthly Maintenance Checklist

- Run `npm audit`
- Update dependencies (minor/patch)
- Test build locally
- Check Mongo cluster health
- Verify SSL expiration date
- Check sitemap
- Check robots policy
- Confirm public filtering rule still enforced

---

# 11. Post-Incident Documentation

After resolving any major issue:

Document:

- What happened
- Root cause
- Fix applied
- Preventive measure (if any)
- Date and time

Store in:
`/docs/incidents/YYYY-MM-DD-description.md`

---

# 12. Golden Rule

If unsure:

- Reproduce
- Isolate
- Simplify
- Test
- Fix
- Verify

Never panic. Every issue is diagnosable.
