# Ratatoskur — Project Hub Website

**EN:** This is the public-facing project hub for Ratatoskur, an AI math coach that grades handwritten student work. The site is built with Next.js (App Router) and serves as a bilingual (English / Icelandic) landing page, devlog, and research overview for the product.

**IS:** Þetta er opinbert kynningarvefsvæði fyrir Ratatoskur, gervigreindarkennara sem leiðréttir handskrifaðar stærðfræðilausnir nemenda. Vefurinn er tvítyngdur (enska / íslenska) og inniheldur kynningarsíður, þróunardagbók og rannsóknaryfirlit.

---

## Develop

```bash
npm run dev
```

Opens at `http://localhost:3000` (or the next free port). The dev server uses Turbopack for fast rebuilds.

## Test

```bash
npm test
```

Runs 13 Vitest tests covering: i18n key parity between `en.json` and `is.json`, contact form Zod schema, the `/api/contact` route handler (including honeypot and missing-key behaviour), and the MDX updates loader.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

---

## Environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes (for email) | API key from [resend.com](https://resend.com). Without it the contact form returns 503 and the UI falls back to a mailto link. |
| `CONTACT_TO_EMAIL` | No | Address that receives submissions. Defaults to the value baked into the route handler. |
| `CONTACT_FROM_EMAIL` | No | Sender address — must be a Resend-verified domain. Defaults to `onboarding@resend.dev`. |

---

## Content locations

| Content | Location |
|---|---|
| UI copy (EN) | `messages/en.json` |
| UI copy (IS) | `messages/is.json` |
| Devlog posts | `content/updates/*.mdx` (frontmatter: `title`, `date`, `summary`) |
| Research page | `content/research/en.mdx` and `content/research/is.mdx` |

Keys in `en.json` and `is.json` must stay in parity — this is enforced by a Vitest test that will fail the CI gate if they diverge.

---

## i18n

English is the default locale. Icelandic is available via the header language toggle. All page routes are under `/[locale]` (e.g. `/en`, `/is`, `/en/updates`). The next-intl middleware (`src/middleware.ts`) handles locale detection and redirection automatically.

> Note: the Icelandic copy is a draft and is pending review by a native speaker before launch.

---

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **next-intl** — i18n routing and translations
- **next-mdx-remote** + **gray-matter** — MDX content loading
- **Resend** — transactional email for the contact form
- **Zod** — contact form schema validation
- **Vitest** — unit and integration tests

Deployed to **Vercel**.

---

## Related repositories

- [ratatoskur_backend](https://github.com/solvisantos22/ratatoskur_backend) — API server
- [ratatoskur_ios](https://github.com/solvisantos22/ratatoskur_ios) — iOS app
