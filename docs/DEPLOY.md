# Vercel Deployment Guide

## Steps

### 1. Push the website repo to GitHub

Create a new GitHub repository for this website (separate from `ratatoskur_backend` and `ratatoskur_ios`) and push the `build/ratatoskur-site` branch (or merge to `main` first).

```bash
git remote add origin https://github.com/<your-org>/ratatoskur-website.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and click **Add New Project**.
2. Select **Import Git Repository** and choose the website repo.
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `next build` (default — do not change).
5. Output directory: leave blank (Next.js default).
6. Root directory: repo root (no change needed).

### 3. Set environment variables

In **Project Settings → Environment Variables**, add:

| Name | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | From [resend.com](https://resend.com/api-keys). Required for the contact form to send email. Without it the form returns 503 and the UI shows a mailto fallback. |
| `CONTACT_TO_EMAIL` | `you@example.com` | Optional. Address that receives contact submissions. |
| `CONTACT_FROM_EMAIL` | `hello@yourdomain.com` | Optional. Must be a Resend-verified sender domain. Defaults to `onboarding@resend.dev` (Resend's shared sandbox address). |

### 4. Deploy

Click **Deploy**. Vercel will run `next build`, and the site goes live at the assigned `*.vercel.app` URL. No custom domain is configured at this stage.

Subsequent pushes to the tracked branch trigger automatic redeploys.

### 5. Notes

- **i18n routing:** the next-intl middleware (`src/middleware.ts`, exported as `proxy`) and the `[locale]` dynamic segment work on Vercel without any extra configuration. Vercel's edge network runs the middleware automatically.
- **Contact form:** test it after deploy by submitting a message and confirming the email arrives. If `RESEND_API_KEY` is missing or invalid, the `/api/contact` route returns HTTP 503; the UI then shows the mailto fallback link.
- **Icelandic copy:** the `/is` locale is a draft. Consider adding a `?draft=1` banner or equivalent before promoting Icelandic to the primary URL.
