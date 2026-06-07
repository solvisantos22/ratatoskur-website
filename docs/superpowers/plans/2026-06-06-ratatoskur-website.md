# Ratatoskur Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, bilingual (EN default / IS) Next.js project hub for Ratatoskur — a single scrolling home page plus Updates and Research pages, a Resend-backed contact form, deployed to Vercel.

**Architecture:** Next.js App Router + TypeScript, `[locale]` routing via `next-intl`, Tailwind v4 with a semantic OKLCH design-token layer derived from the existing app brand, MDX content for Updates/Research, and a serverless contact route handler. The visual build leans on the two installed design skills: `impeccable` (`.agents/skills/impeccable`) for crafting/polishing sections and `emil-design-eng` (`.agents/skills/emil-design-eng`) for motion decisions and review.

**Tech Stack:** Next.js (App Router), TypeScript (strict), Tailwind CSS v4, next-intl, next/font (Fraunces + Inter), MDX via `next-mdx-remote` + `gray-matter`, Resend, Zod, Vitest.

**Testing philosophy:** TDD for all logic (i18n key parity, contact validation schema, contact route handler, MDX post loader) — write the failing test first. Pure-presentational sections are verified visually (screenshots at mobile/tablet/desktop via the `run`/`verify` skills and `impeccable audit`/`critique`), not unit-tested, because snapshot tests of layout add noise without catching real bugs.

**Source-of-truth assets (read-only, on disk):**
- Brand logo: `C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/Ratatoskur/ratatoskur_ios/MathCoach/Resources/ratatoskur_logo.svg`
- App screenshot: `C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/Ratatoskur/grant_applications/frae_2026/deck/app_screenshot.png`
- More screenshots: `C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/Ratatoskur/presentations/ratatoskur_malstofa_en/`
- Product copy: `Ratatoskur/ratatoskur_backend/docs/PRODUCT_BRIEF.md`, `FRAE_SPROTI_STRATEGY.md`

**Brand tokens (target values):** espresso `#3C1D11`, orange `#ED8228`, rust `#A45124`, warm body bg ≈ `#EFE7D6` (identity-preserving, derived from the shipped app). CTAs brown-filled with cream text.

---

## Phase 0 — Repository & scaffold

### Task 0: Initialize repo and scaffold Next.js

**Files:**
- Create: entire Next.js project at the workspace root `C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/website`
- Preserve: `.agents/` (design skills), `docs/` (specs/plans), `skills-lock.json`, `.superpowers/`
- Delete: leftover `package.json`, `package-lock.json`, `node_modules` (the unused `unzip` dependency)

- [ ] **Step 1: Remove leftover node cruft and scaffold into a temp dir**

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal"
rm -rf "website/node_modules" "website/package.json" "website/package-lock.json"
npx create-next-app@latest website-scaffold \
  --ts --eslint --tailwind --app --src-dir \
  --import-alias "@/*" --use-npm --no-turbopack --yes
```
Expected: a new `website-scaffold/` folder containing `package.json`, `next.config.ts`, `src/app/`, `tsconfig.json`, `tailwind`/`postcss` config, etc.

- [ ] **Step 2: Move generated files into the project root, then drop the scaffold's git**

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal"
shopt -s dotglob
cp -a website-scaffold/* "website/"
shopt -u dotglob
rm -rf website-scaffold "website/.git"
```
Expected: `website/next.config.ts`, `website/package.json`, `website/src/app/` now exist alongside the preserved `.agents/`, `docs/`, `skills-lock.json`.

- [ ] **Step 3: Verify the move and install dependencies**

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/website"
ls next.config.ts src/app/layout.tsx .agents/skills/impeccable/SKILL.md docs/superpowers/specs
npm install
```
Expected: all listed paths print (no "No such file"), and `npm install` completes.

- [ ] **Step 4: Confirm the dev server boots**

Run (Bash tool, background): `npm run dev` then fetch `http://localhost:3000`.
Expected: the default Next.js starter page renders (HTTP 200). Stop the dev server after confirming.

- [ ] **Step 5: Initialize git, set ignore rules, and commit**

Create `.gitignore` additions (append if the keys are not already present):
```gitignore
# project-specific
.superpowers/
.agents/
.env
.env.local
.env*.local
```

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/website"
git init
git add -A
git commit -m "chore: scaffold Next.js app (App Router, TS, Tailwind v4)"
```
Expected: an initial commit is created. `.agents/` and `.superpowers/` are untracked.

---

### Task 1: Set up Vitest for logic tests

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install test tooling**

Run: `npm install -D vitest`

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

Add to the `"scripts"` object:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Add a smoke test to prove the runner works**

Create `src/lib/smoke.test.ts`:
```ts
import { test, expect } from 'vitest';

test('vitest runs', () => {
  expect(1 + 1).toBe(2);
});
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts package.json package-lock.json src/lib/smoke.test.ts
git commit -m "chore: add vitest for logic tests"
```

---

## Phase 1 — Design foundation

### Task 2: Establish design context and tokens (impeccable init)

**Files:**
- Create: `PRODUCT.md`, `DESIGN.md` (via the impeccable workflow), `src/styles/tokens.css`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Run the impeccable context script**

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/website"
node .agents/skills/impeccable/scripts/context.mjs
```
Expected: it prints `NO_PRODUCT_MD` (new project). If so, read `.agents/skills/impeccable/reference/init.md` and follow it to create `PRODUCT.md` and `DESIGN.md`. Use the spec at `docs/superpowers/specs/2026-06-06-ratatoskur-website-design.md` and the brand register `.agents/skills/impeccable/reference/brand.md` as inputs (this site is "design IS the product"). Because committed brand colors already exist, **identity-preservation wins** — do NOT run the palette seed script; use the brand tokens below.

- [ ] **Step 2: Create `src/styles/tokens.css` with the OKLCH design tokens**

```css
:root {
  /* Brand (identity-preserving, from the shipped app) */
  --espresso: oklch(0.27 0.05 48);     /* #3C1D11 */
  --orange:   oklch(0.72 0.16 55);     /* #ED8228 */
  --rust:     oklch(0.50 0.12 45);     /* #A45124 */

  /* Semantic surface + ink (no --cream/--parchment naming) */
  --bg:        oklch(0.93 0.018 75);   /* warm off-white, brand hue */
  --surface:   oklch(0.96 0.012 80);
  --surface-2: oklch(0.89 0.02 72);
  --ink:       var(--espresso);        /* headings */
  --ink-2:     oklch(0.38 0.04 50);    /* body; verified >=4.5:1 on --bg */
  --muted:     oklch(0.45 0.03 55);    /* secondary; must still clear 4.5:1 */

  --accent:    var(--orange);
  --accent-2:  var(--rust);
  --on-accent: oklch(0.96 0.012 80);   /* cream text on brown CTA */
  --cta:       oklch(0.30 0.045 45);   /* brown CTA fill */
  --cta-hover: oklch(0.34 0.05 45);

  /* Radii (cards 12-16px; no over-rounding) */
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-pill: 999px;

  /* Motion (emil-design-eng curves) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --dur-press: 160ms;
  --dur-ui: 220ms;
  --dur-reveal: 280ms;

  /* z-index scale */
  --z-nav: 100;
  --z-overlay: 200;
}
```

- [ ] **Step 3: Wire tokens + base typography into `src/app/globals.css`**

Replace the contents of `src/app/globals.css` with:
```css
@import "tailwindcss";
@import "../styles/tokens.css";

html { color-scheme: light; }

body {
  background: var(--bg);
  color: var(--ink-2);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1, h2, h3 { color: var(--ink); text-wrap: balance; letter-spacing: -0.02em; }
p { text-wrap: pretty; }

a { color: inherit; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: var(--r-sm); }

/* Reveal-on-scroll: content visible by default, motion is enhancement only */
[data-reveal] { transition: opacity var(--dur-reveal) var(--ease-out), transform var(--dur-reveal) var(--ease-out); }
[data-reveal="pre"] { opacity: 0; transform: translateY(10px); }

/* Press feedback */
.press { transition: transform var(--dur-press) var(--ease-out); }
.press:active { transform: scale(0.97); }

@media (prefers-reduced-motion: reduce) {
  [data-reveal] { transition: none; }
  [data-reveal="pre"] { opacity: 1; transform: none; }
  .press:active { transform: none; }
}
```

- [ ] **Step 4: Verify it builds**

Run: `npm run build`
Expected: build succeeds (the default page still renders; tokens compile).

- [ ] **Step 5: Commit**

```bash
git add PRODUCT.md DESIGN.md src/styles/tokens.css src/app/globals.css
git commit -m "feat: design tokens (OKLCH brand palette, motion curves) + impeccable context"
```

---

### Task 3: Fonts (Fraunces display + Inter body)

**Files:**
- Create: `src/app/fonts.ts`
- Modify: `src/app/layout.tsx`, `src/styles/tokens.css`

- [ ] **Step 1: Define self-hosted fonts via `next/font/google`**

Create `src/app/fonts.ts`:
```ts
import { Fraunces, Inter } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'], // latin-ext covers Icelandic glyphs
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz'],
});

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
});
```

- [ ] **Step 2: Apply font variables on `<html>` in the root layout**

In `src/app/layout.tsx`, import the fonts and add their `variable` classes to the `<html>` element's `className`:
```tsx
import { fraunces, inter } from './fonts';
// ...
<html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
```

- [ ] **Step 3: Map font variables to families in tokens**

Append to `:root` in `src/styles/tokens.css`:
```css
  --font-display-stack: var(--font-display), Georgia, 'Times New Roman', serif;
  --font-body-stack: var(--font-body), system-ui, -apple-system, sans-serif;
```
And append to `src/app/globals.css`:
```css
body { font-family: var(--font-body-stack); font-size: 1.0625rem; line-height: 1.6; }
h1, h2, h3 { font-family: var(--font-display-stack); }
```

- [ ] **Step 4: Verify the Icelandic glyphs render**

Run `npm run dev`, add a temporary heading `Hætti — ðæö þ` to `src/app/page.tsx`, load `http://localhost:3000`, screenshot, confirm Fraunces renders the Icelandic characters. Remove the temporary heading.

- [ ] **Step 5: Commit**

```bash
git add src/app/fonts.ts src/app/layout.tsx src/styles/tokens.css src/app/globals.css
git commit -m "feat: self-hosted Fraunces + Inter with Icelandic glyph coverage"
```

---

### Task 4: Logo asset + LogoMark + favicons

**Files:**
- Create: `public/ratatoskur-logo.svg`, `src/components/LogoMark.tsx`, `src/app/icon.svg`
- Source: copy from the iOS Resources path

- [ ] **Step 1: Copy the real logo into `public/`**

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/website"
cp "../Ratatoskur/ratatoskur_ios/MathCoach/Resources/ratatoskur_logo.svg" public/ratatoskur-logo.svg
cp public/ratatoskur-logo.svg src/app/icon.svg
```
Expected: both files exist. (`src/app/icon.svg` is auto-served as the favicon by Next.)

- [ ] **Step 2: Create the `LogoMark` component**

`src/components/LogoMark.tsx`:
```tsx
import Image from 'next/image';

export function LogoMark({ size = 28, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <Image src="/ratatoskur-logo.svg" alt="Ratatoskur" width={size} height={size} priority />
      {withWordmark && (
        <span style={{ fontFamily: 'var(--font-display-stack)', fontWeight: 600, fontSize: size * 0.62, color: 'var(--ink)' }}>
          Ratatoskur
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 3: Verify it renders**

Temporarily render `<LogoMark />` on the home page, screenshot at `http://localhost:3000`, confirm the diamond squirrel + wordmark appear crisp. Remove the temporary usage.

- [ ] **Step 4: Commit**

```bash
git add public/ratatoskur-logo.svg src/app/icon.svg src/components/LogoMark.tsx
git commit -m "feat: brand logo asset, LogoMark component, favicon"
```

---

## Phase 2 — Internationalization

### Task 5: next-intl routing + message files + parity test (TDD)

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `messages/en.json`, `messages/is.json`, `src/i18n/messages.test.ts`
- Modify: `next.config.ts`, move `src/app/layout.tsx` + `page.tsx` under `src/app/[locale]/`

- [ ] **Step 1: Write the failing i18n parity test**

Create `src/i18n/messages.test.ts`:
```ts
import { test, expect } from 'vitest';
import en from '../../messages/en.json';
import is from '../../messages/is.json';

function flatKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === 'object' && !Array.isArray(v)
      ? flatKeys(v as Record<string, unknown>, key)
      : [key];
  });
}

test('en and is message files have identical key sets', () => {
  expect(flatKeys(is).sort()).toEqual(flatKeys(en).sort());
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find `messages/en.json` / `messages/is.json`.

- [ ] **Step 3: Install next-intl and create message files**

Run: `npm install next-intl`

Create `messages/en.json`:
```json
{
  "nav": { "how": "How it works", "why": "Why", "research": "Research", "team": "Team", "updates": "Updates", "contact": "Contact us" },
  "hero": {
    "eyebrow": "AI math coach, in Icelandic",
    "title": "The math coach that reads your handwriting",
    "subtitle": "Upload a problem, solve it by hand, and get the right help: a hint, a check, or the full solution. Never the answer too soon.",
    "ctaContact": "Contact us",
    "ctaHow": "See how it works"
  },
  "footer": { "rights": "Ratatoskur", "github": "GitHub" }
}
```

Create `messages/is.json` (draft; flag for team review):
```json
{
  "nav": { "how": "Hvernig það virkar", "why": "Af hverju", "research": "Rannsóknir", "team": "Teymi", "updates": "Fréttir", "contact": "Hafðu samband" },
  "hero": {
    "eyebrow": "Stærðfræðiaðstoð með gervigreind, á íslensku",
    "title": "Aðstoðin sem les skriftina þína",
    "subtitle": "Hladdu upp dæmi, leystu það með skrift og fáðu rétta hjálp: vísbendingu, yfirferð eða fulla lausn. Aldrei svarið of snemma.",
    "ctaContact": "Hafðu samband",
    "ctaHow": "Sjá hvernig það virkar"
  },
  "footer": { "rights": "Ratatoskur", "github": "GitHub" }
}
```

- [ ] **Step 4: Run the parity test to verify it passes**

Run: `npm test`
Expected: PASS (both files have identical keys).

- [ ] **Step 5: Create the next-intl routing/navigation/request config**

`src/i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'is'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];
```

`src/i18n/navigation.ts`:
```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

`src/i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'en' | 'is')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

`src/middleware.ts`:
```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|is)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 6: Enable the plugin in `next.config.ts`**

Wrap the existing config:
```ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Move the app under the `[locale]` segment**

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/website/src/app"
mkdir -p "[locale]"
git mv page.tsx "[locale]/page.tsx"
```
Then create `src/app/[locale]/layout.tsx` (replacing the old root layout's locale-specific parts; keep the real root `src/app/layout.tsx` minimal):

`src/app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <NextIntlClientProvider>
      {children}
    </NextIntlClientProvider>
  );
}
```

Update the real root `src/app/layout.tsx` so `<html lang>` follows the locale param is handled at the locale layout; keep root layout as the html/body shell with font variables (from Task 3). Ensure `src/app/[locale]/page.tsx` uses `useTranslations`/`getTranslations` for the temporary content.

- [ ] **Step 8: Verify routing works**

Run `npm run dev`. Confirm:
- `http://localhost:3000/en` renders.
- `http://localhost:3000/is` renders.
- `http://localhost:3000` redirects to `/en`.
Run `npm test` (parity still passes) and `npm run build` (succeeds).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: next-intl [locale] routing, en/is messages, key-parity test"
```

---

### Task 6: LanguageToggle

**Files:**
- Create: `src/components/LanguageToggle.tsx`

- [ ] **Step 1: Build the toggle using locale-aware navigation**

`src/components/LanguageToggle.tsx`:
```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label="Language" style={{ display: 'inline-flex', gap: 2, border: '1px solid var(--surface-2)', borderRadius: 'var(--r-pill)', padding: 2 }}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-current={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
          className="press"
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--r-pill)',
            fontSize: 13,
            fontWeight: 600,
            background: l === locale ? 'var(--cta)' : 'transparent',
            color: l === locale ? 'var(--on-accent)' : 'var(--ink-2)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify switching preserves the current path**

Render it temporarily in `src/app/[locale]/page.tsx`, run dev, navigate to `/en`, click `IS`, confirm the URL becomes `/is` and content switches. Remove the temporary render.

- [ ] **Step 3: Commit**

```bash
git add src/components/LanguageToggle.tsx
git commit -m "feat: language toggle (EN/IS) preserving current path"
```

---

## Phase 3 — Shell & primitives

### Task 7: Nav and Footer

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Footer.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Build the Nav (sticky, anchor links, logo, language toggle, brown contact CTA)**

`src/components/Nav.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LogoMark } from './LogoMark';
import { LanguageToggle } from './LanguageToggle';

export function Nav() {
  const t = useTranslations('nav');
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 'var(--z-nav)' as unknown as number, background: 'color-mix(in oklch, var(--bg) 88%, transparent)', backdropFilter: 'saturate(120%) blur(8px)', borderBottom: '1px solid var(--surface-2)' }}>
      <nav style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 18, padding: '12px 22px' }}>
        <Link href="/"><LogoMark size={26} /></Link>
        <div style={{ display: 'flex', gap: 16, marginLeft: 14, fontSize: 14 }} className="nav-links">
          <a href="#how">{t('how')}</a>
          <a href="#why">{t('why')}</a>
          <Link href="/research">{t('research')}</Link>
          <a href="#team">{t('team')}</a>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <LanguageToggle />
          <a href="#contact" className="press" style={{ background: 'var(--cta)', color: 'var(--on-accent)', fontWeight: 600, fontSize: 14, padding: '8px 14px', borderRadius: 'var(--r-md)' }}>{t('contact')}</a>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Build the Footer (logo, links, public GitHub repos, toggle)**

`src/components/Footer.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { LogoMark } from './LogoMark';
import { LanguageToggle } from './LanguageToggle';

const GITHUB_BACKEND = 'https://github.com/solvisantos22/ratatoskur_backend';
const GITHUB_IOS = 'https://github.com/solvisantos22/ratatoskur_ios';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer style={{ borderTop: '1px solid var(--surface-2)', background: 'var(--surface)', marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 22px', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
        <LogoMark size={24} />
        <nav style={{ display: 'flex', gap: 16, fontSize: 14 }}>
          <a href={GITHUB_BACKEND} target="_blank" rel="noreferrer">{t('github')} (backend)</a>
          <a href={GITHUB_IOS} target="_blank" rel="noreferrer">{t('github')} (iOS)</a>
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
```
Note: the `GITHUB_*` constants point at the real public repos (`solvisantos22/ratatoskur_backend`, `solvisantos22/ratatoskur_ios`).

- [ ] **Step 3: Mount Nav + Footer in the locale layout**

In `src/app/[locale]/layout.tsx`, wrap `{children}` with `<Nav />` above and `<Footer />` below, inside `NextIntlClientProvider`.

- [ ] **Step 4: Verify and screenshot**

Run dev, load `/en` and `/is`, screenshot. Confirm sticky nav, working language toggle, footer renders. Confirm contrast of nav links (`--ink-2` on `--bg`) reads clearly.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Footer.tsx "src/app/[locale]/layout.tsx"
git commit -m "feat: sticky nav + footer shell with language toggle and repo links"
```

---

### Task 8: Primitives — Reveal, Button, SectionHeading, DeviceFrame

**Files:**
- Create: `src/components/Reveal.tsx`, `src/components/Button.tsx`, `src/components/SectionHeading.tsx`, `src/components/DeviceFrame.tsx`

- [ ] **Step 1: Reveal (content-visible-by-default, IntersectionObserver, reduced-motion safe)**

`src/components/Reveal.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  // 'idle' = SSR/no-JS default: fully visible (never ships blank).
  const [state, setState] = useState<'idle' | 'pre' | 'in'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('in');
      return;
    }
    setState('pre');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setState('in');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      data-reveal={state === 'in' ? undefined : state}
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </Component>
  );
}
```

- [ ] **Step 2: Button (link or button, brown primary / ghost secondary, press feedback)**

`src/components/Button.tsx`:
```tsx
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'ghost';

const base: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontWeight: 600, fontSize: 15, padding: '11px 18px', borderRadius: 'var(--r-md)',
  border: 'none', cursor: 'pointer', textDecoration: 'none',
};
const variants: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--cta)', color: 'var(--on-accent)' },
  ghost: { background: 'transparent', color: 'var(--accent-2)' },
};

export function Button({ variant = 'primary', style, ...props }: { variant?: Variant } & ComponentProps<'a'>) {
  return <a {...props} className="press" style={{ ...base, ...variants[variant], ...style }} />;
}
```

- [ ] **Step 3: SectionHeading**

`src/components/SectionHeading.tsx`:
```tsx
export function SectionHeading({ id, title, lead }: { id?: string; title: string; lead?: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: 90, maxWidth: '38ch', marginBottom: 28 }}>
      <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.1, margin: 0 }}>{title}</h2>
      {lead && <p style={{ color: 'var(--ink-2)', marginTop: 12, fontSize: '1.05rem' }}>{lead}</p>}
    </div>
  );
}
```

- [ ] **Step 4: DeviceFrame (iPhone-ish frame wrapping a screenshot)**

`src/components/DeviceFrame.tsx`:
```tsx
import Image from 'next/image';

export function DeviceFrame({ src, alt, width = 260 }: { src: string; alt: string; width?: number }) {
  return (
    <div style={{ width, background: '#1c0e07', borderRadius: 40, padding: 10, boxShadow: '0 30px 60px -24px oklch(0.27 0.05 48 / 0.5)' }}>
      <div style={{ borderRadius: 32, overflow: 'hidden', background: 'var(--surface)' }}>
        <Image src={src} alt={alt} width={width - 20} height={(width - 20) * 2} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify primitives compile and render**

Render each temporarily on `/en`, screenshot, confirm: Reveal children are visible on load and animate on scroll; Button shows press scale; DeviceFrame frames the screenshot. Remove temporary renders. Run `npm run build`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Reveal.tsx src/components/Button.tsx src/components/SectionHeading.tsx src/components/DeviceFrame.tsx
git commit -m "feat: UI primitives (Reveal, Button, SectionHeading, DeviceFrame)"
```

---

## Phase 4 — Home sections

> For each section: copy the relevant screenshot(s) into `public/` first, write a real baseline component, then refine it with the impeccable `craft` workflow and verify with a screenshot at mobile (390px) / tablet (768px) / desktop (1100px). Apply `emil-design-eng` motion rules through `Reveal` and `.press`.

### Task 9: Copy product images into public/

**Files:**
- Create: `public/app/mode-picker.png`, plus any presentation screenshots used.

- [ ] **Step 1: Copy screenshots**

Run (Bash tool):
```bash
cd "C:/Users/SolviSantos/OneDrive - evolv.is/Desktop/Personal/website"
mkdir -p public/app
cp "../Ratatoskur/grant_applications/frae_2026/deck/app_screenshot.png" public/app/mode-picker.png
cp "../Ratatoskur/presentations/ratatoskur_malstofa_en/Screenshot 2026-04-14 at 23.26.04.png" "public/app/screen-1.png"
cp "../Ratatoskur/presentations/ratatoskur_malstofa_en/Screenshot 2026-04-15 at 13.30.07.png" "public/app/screen-2.png"
```
Expected: files exist under `public/app/`. Inspect each with the Read tool to confirm content and pick the best ones for Hero/How-it-works.

- [ ] **Step 2: Commit**

```bash
git add public/app
git commit -m "chore: add product screenshots to public/"
```

---

### Task 10: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `messages/en.json`, `messages/is.json` (keys already added in Task 5 under `hero`)

- [ ] **Step 1: Baseline Hero**

`src/components/sections/Hero.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { Button } from '../Button';
import { DeviceFrame } from '../DeviceFrame';

export function Hero() {
  const t = useTranslations('hero');
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px 40px', display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)', gap: 40, alignItems: 'center' }}>
      <Reveal>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12, fontWeight: 600, color: 'var(--accent-2)' }}>{t('eyebrow')}</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.05, margin: '12px 0 0', letterSpacing: '-0.03em' }}>{t('title')}</h1>
        <p style={{ marginTop: 16, fontSize: '1.15rem', color: 'var(--ink-2)', maxWidth: '46ch' }}>{t('subtitle')}</p>
        <div style={{ marginTop: 26, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button href="#contact">{t('ctaContact')}</Button>
          <Button href="#how" variant="ghost">{t('ctaHow')} →</Button>
        </div>
      </Reveal>
      <Reveal delay={80} className="hero-device" >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DeviceFrame src="/app/mode-picker.png" alt="Ratatoskur mode picker: Hint, Check, Reveal" width={250} />
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Make it responsive**

Add to `src/app/globals.css`:
```css
@media (max-width: 820px) {
  section[data-hero] { grid-template-columns: 1fr !important; }
}
```
Add `data-hero` to the Hero `<section>`. Confirm the heading does not overflow at 390px (the impeccable "text overflows its container" ban).

- [ ] **Step 3: Refine with impeccable craft**

Read `.agents/skills/impeccable/reference/craft.md` and `reference/brand.md`, then refine Hero spacing, type rhythm, and the device presentation to production grade. Honor the absolute bans (no gradient text, no eyebrow on every section — this single eyebrow is allowed, no over-rounding).

- [ ] **Step 4: Verify at three breakpoints**

Use the `run`/`verify` skill to screenshot `/en` at 390 / 768 / 1100px. Confirm no overflow, correct contrast, device legible.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/app/globals.css
git commit -m "feat: hero section with device screenshot and brown CTA"
```

---

### Task 11: How it works (3 steps — earned numbering)

**Files:**
- Create: `src/components/sections/HowItWorks.tsx`
- Modify: `messages/en.json`, `messages/is.json` (add `how` content block)

- [ ] **Step 1: Add copy keys**

Add to `messages/en.json` (and Icelandic equivalents to `messages/is.json`, keeping key parity):
```json
"how": {
  "title": "How it works",
  "lead": "Three steps, in the student's own notebook.",
  "s1Title": "Upload the problem",
  "s1Body": "Snap a photo of the exercise or pick one from your library.",
  "s2Title": "Solve it by hand",
  "s2Body": "Write your full solution with Apple Pencil. Multiple pages, your own process.",
  "s3Title": "Get the right help",
  "s3Body": "Choose Hint, Check, or Reveal. If your handwriting is unclear, Ratatoskur asks before guessing."
}
```

- [ ] **Step 2: Baseline component (numbered because it is a real sequence)**

`src/components/sections/HowItWorks.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function HowItWorks() {
  const t = useTranslations('how');
  const steps = [
    { n: 1, title: t('s1Title'), body: t('s1Body') },
    { n: 2, title: t('s2Title'), body: t('s2Body') },
    { n: 3, title: t('s3Title'), body: t('s3Body') },
  ];
  return (
    <section id="how" style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 22px', scrollMarginTop: 80 }}>
      <SectionHeading title={t('title')} lead={t('lead')} />
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 60}>
            <div style={{ fontFamily: 'var(--font-display-stack)', fontSize: 40, color: 'var(--accent)', lineHeight: 1 }}>{s.n}</div>
            <h3 style={{ fontSize: '1.25rem', margin: '10px 0 6px' }}>{s.title}</h3>
            <p style={{ color: 'var(--ink-2)' }}>{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 3: Refine with impeccable craft + verify**

Refine per `reference/craft.md`; screenshot at three breakpoints. Confirm the stagger reveal fires and content is visible without JS.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HowItWorks.tsx messages/en.json messages/is.json
git commit -m "feat: How it works section (3-step sequence)"
```

---

### Task 12: Why it matters

**Files:**
- Create: `src/components/sections/WhyItMatters.tsx`
- Modify: `messages/*.json` (add `why` block)

- [ ] **Step 1: Add copy (from PRODUCT_BRIEF — no em dashes, no buzzwords)**

Add to `messages/en.json` and IS equivalent (keep parity):
```json
"why": {
  "title": "Feedback while you solve, not after",
  "p1": "Most tools solve the problem for you. Ratatoskur stays with your process: it reads the problem and your handwritten work, then responds at the level you ask for.",
  "p2": "Hints nudge without spoiling. Checks catch a wrong turn early. Reveal is there when you want the full path. The student keeps ownership of the solving.",
  "p3": "And it works in Icelandic, where good math-tutoring tools are scarce."
}
```

- [ ] **Step 2: Baseline component**

`src/components/sections/WhyItMatters.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function WhyItMatters() {
  const t = useTranslations('why');
  return (
    <section id="why" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--surface-2)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px' }}>
        <SectionHeading title={t('title')} />
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, maxWidth: 900 }}>
            <p style={{ color: 'var(--ink-2)' }}>{t('p1')}</p>
            <p style={{ color: 'var(--ink-2)' }}>{t('p2')}</p>
            <p style={{ color: 'var(--ink-2)' }}>{t('p3')}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Refine + verify (screenshots, contrast).** Commit:

```bash
git add src/components/sections/WhyItMatters.tsx messages/en.json messages/is.json
git commit -m "feat: Why it matters section"
```

---

### Task 13: Under the hood

**Files:**
- Create: `src/components/sections/UnderTheHood.tsx`
- Modify: `messages/*.json` (add `hood` block)

- [ ] **Step 1: Add copy**

Add to `messages/en.json` and IS equivalent:
```json
"hood": {
  "title": "Under the hood",
  "lead": "Built for real classrooms, with privacy in mind.",
  "i1Title": "Reads problem and handwriting",
  "i1Body": "The model sees both the exercise image and the student's multi-page solution.",
  "i2Title": "Mode-specific feedback",
  "i2Body": "Hint, Check, and Reveal are distinct behaviors, not one prompt with different labels.",
  "i3Title": "Consent-aware data",
  "i3Body": "Students choose what may be used for analytics and dataset work at registration.",
  "i4Title": "Future teacher insights",
  "i4Body": "With consent, attempts and feedback can help shape future tools for teachers and researchers."
}
```

- [ ] **Step 2: Baseline component (2x2 responsive grid; avoid identical-card-grid cliché — vary with the leading accent line of text)**

`src/components/sections/UnderTheHood.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function UnderTheHood() {
  const t = useTranslations('hood');
  const items = [
    { title: t('i1Title'), body: t('i1Body') },
    { title: t('i2Title'), body: t('i2Body') },
    { title: t('i3Title'), body: t('i3Body') },
    { title: t('i4Title'), body: t('i4Body') },
  ];
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px' }}>
      <SectionHeading title={t('title')} lead={t('lead')} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 50}>
            <h3 style={{ fontSize: '1.15rem', margin: '0 0 6px', color: 'var(--ink)' }}>{it.title}</h3>
            <p style={{ color: 'var(--ink-2)' }}>{it.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Refine + verify.** Commit:

```bash
git add src/components/sections/UnderTheHood.tsx messages/en.json messages/is.json
git commit -m "feat: Under the hood section"
```

---

### Task 14: Team

**Files:**
- Create: `src/components/sections/Team.tsx`
- Modify: `messages/*.json` (add `team` block)

- [ ] **Step 1: Add copy**

Add to `messages/en.json` and IS equivalent:
```json
"team": {
  "title": "The team",
  "lead": "Two builders working on Ratatoskur.",
  "m1Name": "Sölvi Santos",
  "m1Role": "Product & engineering",
  "m2Name": "Jóhannes Reykdal Einarsson",
  "m2Role": "Product & engineering"
}
```

- [ ] **Step 2: Baseline component**

`src/components/sections/Team.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function Team() {
  const t = useTranslations('team');
  const members = [
    { name: t('m1Name'), role: t('m1Role') },
    { name: t('m2Name'), role: t('m2Role') },
  ];
  return (
    <section id="team" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px', scrollMarginTop: 80 }}>
      <SectionHeading title={t('title')} lead={t('lead')} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        {members.map((m, i) => (
          <Reveal key={m.name} delay={i * 60}>
            <div style={{ minWidth: 220 }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--r-pill)', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display-stack)', fontSize: 22, color: 'var(--ink)' }}>{m.name.charAt(0)}</div>
              <h3 style={{ fontSize: '1.1rem', margin: '12px 0 2px' }}>{m.name}</h3>
              <p style={{ color: 'var(--muted)', margin: 0 }}>{m.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Refine + verify.** Commit:

```bash
git add src/components/sections/Team.tsx messages/en.json messages/is.json
git commit -m "feat: Team section"
```

---

### Task 15: Assemble the home page

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Compose all sections (Contact added in Task 18)**

`src/app/[locale]/page.tsx`:
```tsx
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { WhyItMatters } from '@/components/sections/WhyItMatters';
import { UnderTheHood } from '@/components/sections/UnderTheHood';
import { Team } from '@/components/sections/Team';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <WhyItMatters />
      <UnderTheHood />
      <Team />
      {/* <Contact /> added in Task 18 */}
    </main>
  );
}
```

- [ ] **Step 2: Add smooth anchor scrolling**

Add to `src/app/globals.css`:
```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

- [ ] **Step 3: Verify the full page**

Run dev, scroll `/en` and `/is` end to end, confirm each anchor (`#how`, `#why`, `#team`) lands correctly under the sticky nav, reveals fire once, no layout shift. Screenshot full page at 3 breakpoints. Run `npm run build`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/page.tsx" src/app/globals.css
git commit -m "feat: assemble home page with anchored sections"
```

---

## Phase 5 — Contact

### Task 16: Contact validation schema (TDD)

**Files:**
- Create: `src/lib/contact-schema.ts`, `src/lib/contact-schema.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/contact-schema.test.ts`:
```ts
import { test, expect } from 'vitest';
import { contactSchema } from './contact-schema';

const valid = { name: 'Anna', email: 'anna@school.is', organization: 'Menntaskóli', message: 'We would like a pilot.', website: '' };

test('accepts a valid submission', () => {
  expect(contactSchema.safeParse(valid).success).toBe(true);
});

test('rejects an invalid email', () => {
  expect(contactSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
});

test('rejects an empty message', () => {
  expect(contactSchema.safeParse({ ...valid, message: '' }).success).toBe(false);
});

test('rejects when honeypot is filled', () => {
  expect(contactSchema.safeParse({ ...valid, website: 'http://spam' }).success).toBe(false);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — `./contact-schema` not found.

- [ ] **Step 3: Implement the schema**

Run: `npm install zod`

`src/lib/contact-schema.ts`:
```ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email').max(200),
  organization: z.string().trim().min(1, 'Tell us your school or role').max(150),
  message: z.string().trim().min(10, 'Add a short message').max(2000),
  // Honeypot: real users leave this empty. Any content fails validation.
  website: z.string().max(0, 'Spam detected').optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: all contact-schema tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact-schema.ts src/lib/contact-schema.test.ts package.json package-lock.json
git commit -m "feat: contact form Zod schema with honeypot (TDD)"
```

---

### Task 17: Contact route handler (TDD)

**Files:**
- Create: `src/app/api/contact/route.ts`, `src/app/api/contact/route.test.ts`

- [ ] **Step 1: Write the failing test (mock Resend, toggle env per case)**

`src/app/api/contact/route.test.ts`:
```ts
import { test, expect, vi, beforeEach } from 'vitest';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

import { POST } from './route';

function req(body: unknown) {
  return { json: async () => body } as unknown as Parameters<typeof POST>[0];
}
const valid = { name: 'Anna', email: 'anna@school.is', organization: 'MS', message: 'We would like a pilot.', website: '' };

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
  delete process.env.RESEND_API_KEY;
});

test('400 on invalid body', async () => {
  const res = await POST(req({ name: '', email: 'x' }));
  expect(res.status).toBe(400);
  expect(sendMock).not.toHaveBeenCalled();
});

test('200 and no email when honeypot filled', async () => {
  process.env.RESEND_API_KEY = 'key';
  const res = await POST(req({ ...valid, website: 'spam' }));
  expect(res.status).toBe(200);
  expect(sendMock).not.toHaveBeenCalled();
});

test('503 when API key missing', async () => {
  const res = await POST(req(valid));
  expect(res.status).toBe(503);
});

test('200 and sends email when configured', async () => {
  process.env.RESEND_API_KEY = 'key';
  const res = await POST(req(valid));
  expect(res.status).toBe(200);
  expect(sendMock).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — `./route` not found.

- [ ] **Step 3: Implement the route handler**

Run: `npm install resend`

`src/app/api/contact/route.ts`:
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/contact-schema';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot filled: silently accept, send nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? 'hello@ratatoskur.is';
  const from = process.env.CONTACT_FROM_EMAIL ?? 'Ratatoskur <onboarding@resend.dev>';
  const { name, email, organization, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Ratatoskur contact: ${organization}`,
      text: `From: ${name} <${email}>\nOrganization / role: ${organization}\n\n${message}`,
    });
    if (error) return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: all route tests PASS.

- [ ] **Step 5: Document env vars**

Create `.env.example`:
```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@ratatoskur.is
CONTACT_FROM_EMAIL=Ratatoskur <onboarding@resend.dev>
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api/contact/route.ts src/app/api/contact/route.test.ts .env.example package.json package-lock.json
git commit -m "feat: Resend contact route handler with validation + honeypot (TDD)"
```

---

### Task 18: Contact section UI

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/app/[locale]/page.tsx`, `messages/*.json` (add `contact` block)

- [ ] **Step 1: Add copy**

Add to `messages/en.json` and IS equivalent (keep parity):
```json
"contact": {
  "title": "Bring Ratatoskur to your school",
  "lead": "We are running early pilots with schools and teachers. If that is you, get in touch.",
  "name": "Name",
  "email": "Email",
  "organization": "School or role",
  "message": "Message",
  "send": "Send message",
  "sending": "Sending…",
  "success": "Thanks. We will be in touch.",
  "error": "Something went wrong. Please email us directly.",
  "mailto": "Or email us at"
}
```

- [ ] **Step 2: Build the form (client component; mailto fallback always visible; accessible states)**

`src/components/sections/Contact.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionHeading } from '../SectionHeading';

const CONTACT_EMAIL = 'hello@ratatoskur.is';

export function Contact() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const field: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--surface-2)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 15 };
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 };

  return (
    <section id="contact" style={{ background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 22px' }}>
        <SectionHeading title={t('title')} lead={t('lead')} />
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }} noValidate>
          {/* honeypot, visually hidden */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
            <div><label style={label} htmlFor="name">{t('name')}</label><input style={field} id="name" name="name" required /></div>
            <div><label style={label} htmlFor="email">{t('email')}</label><input style={field} id="email" name="email" type="email" required /></div>
          </div>
          <div><label style={label} htmlFor="organization">{t('organization')}</label><input style={field} id="organization" name="organization" required /></div>
          <div><label style={label} htmlFor="message">{t('message')}</label><textarea style={{ ...field, minHeight: 120, resize: 'vertical' }} id="message" name="message" required /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button type="submit" className="press" disabled={status === 'sending'} style={{ background: 'var(--cta)', color: 'var(--on-accent)', fontWeight: 600, fontSize: 15, padding: '11px 20px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', opacity: status === 'sending' ? 0.7 : 1 }}>
              {status === 'sending' ? t('sending') : t('send')}
            </button>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>{t('mailto')} <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>{CONTACT_EMAIL}</a></span>
          </div>
          <p role="status" aria-live="polite" style={{ minHeight: 22, margin: 0, color: status === 'error' ? 'var(--accent-2)' : 'var(--ink)' }}>
            {status === 'ok' ? t('success') : status === 'error' ? t('error') : ''}
          </p>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount Contact on the home page**

In `src/app/[locale]/page.tsx`, import `Contact` and render `<Contact />` after `<Team />`.

- [ ] **Step 4: Verify end to end**

With `RESEND_API_KEY` unset: submit → expect the error state and the mailto fallback visible. (Optional, with a real key in `.env.local`: submit → success.) Confirm keyboard navigation and `aria-live` announcement. Screenshot at 3 breakpoints.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Contact.tsx "src/app/[locale]/page.tsx" messages/en.json messages/is.json
git commit -m "feat: contact section with form, states, and mailto fallback"
```

---

## Phase 6 — Updates & Research

### Task 19: MDX post loader (TDD)

**Files:**
- Create: `src/lib/updates.ts`, `src/lib/updates.test.ts`, `content/updates/2026-06-06-first-update.mdx`

- [ ] **Step 1: Write the failing test (uses a temp fixtures dir)**

`src/lib/updates.test.ts`:
```ts
import { test, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getAllPosts, getPostBySlug } from './updates';

let dir: string;

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'updates-'));
  fs.writeFileSync(path.join(dir, 'a.mdx'), `---\ntitle: A\ndate: 2026-01-01\nlocale: en\nsummary: first\n---\nBody A`);
  fs.writeFileSync(path.join(dir, 'b.mdx'), `---\ntitle: B\ndate: 2026-02-01\nlocale: en\nsummary: second\n---\nBody B`);
  fs.writeFileSync(path.join(dir, 'c.mdx'), `---\ntitle: C\ndate: 2026-03-01\nlocale: is\nsummary: thrid\n---\nBody C`);
});
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

test('lists en posts newest first', () => {
  const posts = getAllPosts('en', dir);
  expect(posts.map((p) => p.slug)).toEqual(['b', 'a']);
});

test('filters by locale', () => {
  expect(getAllPosts('is', dir).map((p) => p.slug)).toEqual(['c']);
});

test('reads a post body by slug', () => {
  const post = getPostBySlug('a', dir);
  expect(post?.title).toBe('A');
  expect(post?.content.trim()).toBe('Body A');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — `./updates` not found.

- [ ] **Step 3: Implement the loader**

Run: `npm install gray-matter`

`src/lib/updates.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DEFAULT_DIR = path.join(process.cwd(), 'content', 'updates');

export type PostMeta = { slug: string; title: string; date: string; locale: string; summary: string };
export type Post = PostMeta & { content: string };

export function getAllPosts(locale: string, dir: string = DEFAULT_DIR): PostMeta[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: String(data.title ?? ''),
        date: String(data.date ?? ''),
        locale: String(data.locale ?? ''),
        summary: String(data.summary ?? ''),
      };
    })
    .filter((p) => p.locale === locale)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string, dir: string = DEFAULT_DIR): Post | null {
  const file = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return {
    slug,
    title: String(data.title ?? ''),
    date: String(data.date ?? ''),
    locale: String(data.locale ?? ''),
    summary: String(data.summary ?? ''),
    content,
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: updates tests PASS.

- [ ] **Step 5: Seed one real post**

`content/updates/2026-06-06-first-update.mdx`:
```mdx
---
title: Ratatoskur enters validation
date: 2026-06-06
locale: en
summary: We are preparing a Tækniþróunarsjóður Fræ application and starting school pilots.
---

We are at the start of the validation phase: testing handwritten-math feedback with
students and teachers, designing consent and privacy, and shaping the product for a
later Sproti development step.
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/updates.ts src/lib/updates.test.ts content/updates/2026-06-06-first-update.mdx package.json package-lock.json
git commit -m "feat: MDX updates loader with frontmatter (TDD) + first post"
```

---

### Task 20: Updates index + post pages

**Files:**
- Create: `src/app/[locale]/updates/page.tsx`, `src/app/[locale]/updates/[slug]/page.tsx`

- [ ] **Step 1: Install the MDX renderer**

Run: `npm install next-mdx-remote`

- [ ] **Step 2: Updates index page**

`src/app/[locale]/updates/page.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllPosts } from '@/lib/updates';
import { SectionHeading } from '@/components/SectionHeading';

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('nav');
  const posts = getAllPosts(locale);
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '80px 22px' }}>
      <SectionHeading title={t('updates')} />
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 24 }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/updates/${p.slug}`} style={{ textDecoration: 'none' }}>
              <time style={{ color: 'var(--muted)', fontSize: 13 }}>{p.date}</time>
              <h3 style={{ margin: '4px 0 6px', color: 'var(--ink)' }}>{p.title}</h3>
              <p style={{ color: 'var(--ink-2)', margin: 0 }}>{p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 3: Post page**

`src/app/[locale]/updates/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug } from '@/lib/updates';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 22px' }}>
      <time style={{ color: 'var(--muted)', fontSize: 13 }}>{post.date}</time>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '6px 0 24px', lineHeight: 1.1 }}>{post.title}</h1>
      <article style={{ color: 'var(--ink-2)', lineHeight: 1.7 }}>
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run dev. Visit `/en/updates` (lists the seeded post) and `/en/updates/2026-06-06-first-update` (renders body). Visit a bad slug → 404. Run `npm run build`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/updates" package.json package-lock.json
git commit -m "feat: updates index and MDX post pages"
```

---

### Task 21: Research page

**Files:**
- Create: `content/research/en.mdx`, `content/research/is.mdx`, `src/app/[locale]/research/page.tsx`

- [ ] **Step 1: Write the research content (from FRAE_SPROTI_STRATEGY + PRODUCT_BRIEF; no em dashes)**

`content/research/en.mdx`:
```mdx
---
title: Research and approach
summary: How Ratatoskur reads handwritten work, evaluates feedback quality, and handles consent.
---

## Reading handwritten mathematics

Ratatoskur reads both the problem image and the student's handwritten solution. Handwriting brings
ambiguous symbols, partial reasoning, and multi-page work, so the system asks the student to confirm
unclear readings before responding.

## Feedback that fits the moment

The product gives mode-specific feedback: a hint that nudges, a check that catches a wrong turn, and a
reveal for the full solution. These are distinct behaviors, evaluated separately for quality.

## Consent and data

Students choose at registration what may be used for analytics and dataset work. Attempts and feedback
are stored so teachers and researchers can see recurring errors and whether help was useful.

## Funding path

Ratatoskur is preparing a Tækniþróunarsjóður Fræ application for validation and feasibility work, ahead
of a later Sproti development step.
```
Create `content/research/is.mdx` with the Icelandic translation (flag for team review) and matching frontmatter keys.

- [ ] **Step 2: Research page (loads MDX per locale, falls back to en)**

`src/app/[locale]/research/page.tsx`:
```tsx
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

function loadResearch(locale: string) {
  const dir = path.join(process.cwd(), 'content', 'research');
  const file = path.join(dir, `${locale}.mdx`);
  const fallback = path.join(dir, 'en.mdx');
  const target = fs.existsSync(file) ? file : fallback;
  return matter(fs.readFileSync(target, 'utf8'));
}

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { data, content } = loadResearch(locale);
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 22px' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '0 0 12px', lineHeight: 1.1 }}>{String(data.title)}</h1>
      {data.summary && <p style={{ color: 'var(--ink-2)', fontSize: '1.1rem', marginBottom: 28 }}>{String(data.summary)}</p>}
      <article style={{ color: 'var(--ink-2)', lineHeight: 1.7 }}>
        <MDXRemote source={content} />
      </article>
    </main>
  );
}
```

- [ ] **Step 3: Verify** `/en/research` and `/is/research` render; build passes. Commit:

```bash
git add content/research "src/app/[locale]/research"
git commit -m "feat: research page (MDX, per-locale with en fallback)"
```

---

## Phase 7 — Polish & verification

### Task 22: Motion pass (emil-design-eng review)

**Files:** touch components as needed for motion.

- [ ] **Step 1: Read the motion source of truth**

Read `.agents/skills/emil-design-eng/SKILL.md`. Apply its Animation Decision Framework to every animated element on the site.

- [ ] **Step 2: Audit each animation against the framework**

Produce the required Before/After markdown table for any change. Confirm: only `transform`/`opacity` animate; all UI transitions < 300ms; custom `--ease-out` curve used (no `ease-in`); reveals fire once and content is visible by default; buttons use `.press` (`scale(0.97)`). Verify there is no animation on keyboard-only actions and no mascot animation.

- [ ] **Step 3: Verify reduced motion**

In browser devtools, enable "prefers-reduced-motion: reduce". Confirm reveals show content with no movement and presses do not scale. Screenshot.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "polish: motion pass per emil-design-eng (easing, durations, reduced-motion)"
```

---

### Task 23: impeccable audit + polish + critique

**Files:** touch components as needed.

- [ ] **Step 1: Run the impeccable detector on the built UI**

Read `.agents/skills/impeccable/reference/audit.md` and `reference/polish.md`. Run the bundled detector over the source:
```bash
node .agents/skills/impeccable/scripts/detect.mjs --json src
```
Triage hits.

- [ ] **Step 2: Fix against the rule set**

Confirm and fix: body text contrast ≥ 4.5:1 (verify `--ink-2`/`--muted` on `--bg` and on `--surface`); no `transition: all`; card radii 12–16px; no ghost-card (1px border + ≥16px shadow); no gradient text; no side-stripe borders; no eyebrow on every section (only Hero has one); heading copy does not overflow at 390/768/1100px; semantic z-index only.

- [ ] **Step 3: Critique pass**

Read `reference/critique.md`; run the heuristic review on the home page and fix P0/P1 findings.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "polish: impeccable audit/critique fixes (contrast, radii, slop bans)"
```

---

### Task 24: Final verification + deploy notes

**Files:** Create `README.md`, `docs/DEPLOY.md`.

- [ ] **Step 1: Full quality gate**

Run, expecting all green:
```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 2: Verify public repo links**

Confirm the footer links resolve: `https://github.com/solvisantos22/ratatoskur_backend` and `https://github.com/solvisantos22/ratatoskur_ios`. Re-run `npm run build`.

- [ ] **Step 3: Lighthouse + manual run**

Use the `run`/`verify` skill: serve `npm run build && npm start`, run Lighthouse on `/en` and `/is`. Target accessibility ≥ 95, performance ≥ 90. Manually click through every nav link, the language toggle, all anchors, the contact form (error + mailto), `/updates`, a post, `/research`. Screenshot the full site at 3 breakpoints in both locales.

- [ ] **Step 4: Write README + deploy notes**

`README.md`: project summary, `npm run dev/test/build`, env vars (point to `.env.example`), content locations (`messages/`, `content/`).
`docs/DEPLOY.md`: Vercel steps — import the repo, set `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` env vars, no custom domain yet (use the Vercel URL), build command `next build`.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/DEPLOY.md src/components/Footer.tsx
git commit -m "docs: README + Vercel deploy notes; wire real repo links"
```

---

## Self-review checklist (completed by plan author)

**Spec coverage:** Hub purpose (Tasks 15, 18) · bilingual EN/IS (Tasks 5–6) · sitemap home + updates + research (Tasks 15, 20, 21) · all six home sections (Tasks 10–14, 18) · contact via Resend + mailto (Tasks 16–18) · Next.js/Tailwind/next-intl/MDX/fonts (Tasks 0–5, 19–20) · design tokens & identity-preserving palette (Task 2) · motion per emil + impeccable (Tasks 8, 22, 23) · logo/favicon (Task 4) · GitHub footer links (Tasks 7, 24) · verification incl. i18n parity, contrast, Lighthouse (Tasks 5, 23, 24). All spec sections map to a task.

**Placeholder scan:** No "TBD/implement later". The two `GITHUB_*` constants in Task 7 are explicitly resolved in Task 24 Step 2. IS copy is drafted (not blank) and flagged for team review per the spec.

**Type consistency:** `contactSchema`/`ContactInput`, `getAllPosts(locale, dir?)`/`getPostBySlug(slug, dir?)`, `PostMeta`/`Post`, `routing`/`Locale`, and the `Reveal`/`Button` props are used identically across the tasks that reference them.
