# Ratatoskur Website — Design Spec

**Date:** 2026-06-06
**Status:** Approved direction, pending spec review
**Author:** Sölvi Santos (with Claude)

## 1. Overview

A polished, bilingual **project hub** for Ratatoskur — an AI math coach for handwritten student work. The site gives a curious public, funders, school decision-makers, and researchers a clear picture of the product and routes the right people to get in touch.

It is **not** a sales funnel and has no hard conversion goal. The single recurring action is **Contact us**, framed for school administrators / decision-makers who could bring Ratatoskur into a school for a pilot.

### Audience (priority order)
1. School administrators / decision-makers (the people we want to contact us)
2. Teachers and students (understand what it is)
3. Funders & partners (Tækniþróunarsjóður Fræ → Sproti credibility)
4. Researchers in Icelandic educational AI

### Goals
- Explain Ratatoskur clearly and credibly in under a minute of scrolling.
- Show the real product (screenshots, the Hint / Check / Reveal model).
- Make it easy and obvious for a school to reach out.
- Reflect the existing brand identity faithfully and feel genuinely crafted.

### Non-goals (v1)
- App distribution (no App Store / TestFlight link yet — it is a prototype).
- Accounts, auth, or any student-facing functionality.
- A CMS. Content is in-repo (i18n message files + MDX).

## 2. Product context (source of truth)

Ratatoskur reads a problem image **and** the student's handwritten solution, then gives **mode-specific** feedback in Icelandic:
- **Vísbending / Hint** — a nudge, never the answer.
- **Fara yfir lausn / Check** — reviews the current solution.
- **Sýna lausn / Reveal** — the full worked solution.
It asks the student to confirm unclear handwriting, and stores attempts for learning analytics. Stage: early prototype in validation (Fræ). Team: **Sölvi Santos** and **Jóhannes Reykdal Einarsson**.

## 3. Sitemap & routing

- `/[locale]` — **Home**, a single scrolling page with anchored sections:
  Hero → How it works → Why it matters → Under the hood → Team → Contact
- `/[locale]/updates` — devlog index
- `/[locale]/updates/[slug]` — a devlog post
- `/[locale]/research` — long-form research / approach page
- `locale` ∈ `en` (default, unprefixed or `/en`) and `is`. Header language toggle.

## 4. Section content

Copy is drafted in English from the real docs (PRODUCT_BRIEF, FRAE_SPROTI_STRATEGY, READMEs), then translated to Icelandic for team review.

1. **Hero** — serif headline ("The math coach that reads your *handwriting*"), one-line subhead, **Contact us** (brown, primary) + "See how it works" (text link to the How-it-works anchor), and an iPhone showing the real mode picker.
2. **How it works** — a genuine 3-step sequence (numbering is earned here): ① Upload a problem ② Solve it by hand with Apple Pencil ③ Get the right help — Hint / Check / Reveal. Includes the "confirm unclear handwriting" detail. Carried by real app visuals.
3. **Why it matters** — feedback *while* solving rather than after; never revealing too much too soon; preserving the student's process; the Icelandic-language gap.
4. **Under the hood** — light credibility, not a spec sheet: reads problem + handwriting, mode-specific AI feedback, consent-aware evaluation data, analytics for teachers/researchers.
5. **Team** — Sölvi Santos & Jóhannes Reykdal Einarsson.
6. **Contact** — "Bring Ratatoskur to your school." Short form + email (see §8).
7. **Footer** — diamond logo, section nav, GitHub/docs links, Tækniþróunarsjóður Fræ acknowledgment, language toggle.

**Optional deeper pages (in scope for v1):**
- **Updates** — MDX devlog (validation progress, milestones).
- **Research** — the approach: handwritten-math feedback, evaluation methodology, consent/privacy design.

## 5. Tech & architecture

- **Framework:** Next.js (App Router) + TypeScript (strict).
- **Hosting:** Vercel.
- **Styling:** Tailwind CSS v4 with a CSS custom-property token layer (palette, radii, motion, type). Tokens are named **semantically** (`--bg`, `--surface`, `--ink`, `--ink-2`, `--accent`, `--accent-2`) — deliberately *not* `--cream`/`--parchment`, per the impeccable guidance that those names are tells.
- **i18n:** `next-intl` with `[locale]` routing. Copy in `messages/en.json` + `messages/is.json`. A build/test check asserts key parity between locales.
- **Content:** **MDX** for Updates posts (frontmatter: `title`, `date`, `locale`, `summary`) and the Research page.
- **Fonts:** `next/font` self-hosting **Fraunces** (display serif) + **Inter** (body). Both must include Icelandic glyphs (þ ð æ ö á í ú ý). Two families total (within impeccable's cap of 3).
- **Assets:** the real diamond `ratatoskur_logo.svg` becomes the site mark + favicon/app icons; app screenshots optimized into `/public` (Next `<Image>`).

### Component inventory (small, single-purpose)
- Layout/shell: `app/[locale]/layout.tsx`, `Nav`, `Footer`, `LanguageToggle`, `LogoMark`
- Primitives: `Button`, `SectionHeading`, `DeviceFrame`, `Reveal` (scroll-in wrapper)
- Home sections (one component each): `Hero`, `HowItWorks`, `WhyItMatters`, `UnderTheHood`, `Team`, `Contact`
- Pages: `UpdatesIndex`, `UpdatePost`, `Research`

Each component has one clear purpose, takes content via props / i18n keys (no hardcoded English), and is independently understandable.

## 6. Design system

Identity-preserving — derived from the shipped app, not invented.

### Color (OKLCH; brand-derived, identity wins)
- **Brand:** espresso `#3C1D11`, orange `#ED8228`, rust `#A45124`.
- **Body bg:** a warm off-white tied to the brand's *own* hue (the app already ships ~`#EFE7D6`). Kept because it matches the product identity, not as a generic cream reflex. Carry warmth mainly through accent, type, and imagery.
- **Ink:** espresso for headings; a darker brown for body. **All body text ≥ 4.5:1 contrast** against bg (large/bold text ≥ 3:1). Secondary/muted text must still clear 4.5:1 — no light-gray-for-elegance.
- **Accent:** orange for links, highlights, focus rings; rust as a secondary accent. CTAs are **brown-filled** with cream text (matches the app).
- Color strategy: **Restrained** (warm neutral surface + brown/orange accents), with selective **committed** moments (hero, contact band).

### Typography
- Display: Fraunces; body/UI: Inter. Hierarchy via scale + weight (≥1.25 step ratio).
- Hero `clamp()` max **≤ 6rem**; display letter-spacing **≥ -0.04em** (no cramped touching letters).
- `text-wrap: balance` on h1–h3; `pretty` on long prose. Body line length 65–75ch.
- Eyebrows/kickers used **sparingly**, not above every section. Numbered markers only where a real sequence exists (How it works).

### Layout & shape
- Card radii **12–16px** (no 24px+ over-rounding); pills fine for tags/buttons.
- No ghost-card pattern (no 1px border + ≥16px shadow together). Vary spacing for rhythm. Cards used only where they're the best affordance.
- Semantic z-index scale.

## 7. Motion (scoped for v1)

Purpose-driven and restrained — "to the extent that makes sense now." Governed by `emil-design-eng`, executed via impeccable's `animate`.

In scope for v1:
- **Hero entrance** — subtle fade + small translate on load (`@starting-style` where supported, fallback otherwise).
- **Scroll reveals** — `IntersectionObserver`, fire once, `translateY(8–12px)` + opacity, ~250–300ms ease-out, 30–80ms stagger within a group. **Content is visible by default**; the reveal *enhances* it (never gate visibility on a JS class — avoids blank sections in SSR/headless/hidden tabs).
- **Button/press feedback** — `scale(0.97)` on `:active`, `transform` ~160ms ease-out.
- **Nav + language toggle** — small, crisp state transitions.

Rules: animate only `transform`/`opacity` (blur/shadow only if it materially helps and stays smooth); custom **ease-out** curves (exponential, no bounce/elastic), e.g. `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; all UI transitions **< 300ms**; hover gated behind `@media (hover: hover) and (pointer: fine)`; **full `prefers-reduced-motion` support** (crossfade/instant fallback). **No mascot / character animation** (per decision). A small `motion` (Framer Motion) footprint is allowed only where CSS is awkward; prefer CSS for scroll/entrance per Emil's under-load guidance.

## 8. Contact form

"Bring Ratatoskur to your school." Fields: name, email, school / role, message. Inline validation, clear success and error states, accessible labels, focus management.

- **Decided:** Next.js Route Handler → email via **Resend** (`RESEND_API_KEY` env var), with a `mailto:` fallback link always present so contact never depends on the API being configured.
- Anti-spam: honeypot field + basic rate limiting on the route handler.

## 9. How the design skills are used

The user wants to lean heavily on the two installed skills.

- **impeccable** (`.agents/skills/impeccable`): on implementation start, run `scripts/context.mjs`; since this is a new project it will likely report `NO_PRODUCT_MD` → follow `reference/init.md` to create `PRODUCT.md` + `DESIGN.md` and capture the tokens above. Use the **brand register** (`reference/brand.md` — design *is* the product here). Build sections with `craft`/`shape`, motion with `animate`, and QA with `critique` / `audit` / `polish`. Honor its absolute bans (no gradient text, no side-stripe borders, no glassmorphism-by-default, no eyebrow/numbered-marker scaffolding, no over-rounding, no em-dashes in copy, no marketing buzzwords).
- **emil-design-eng**: the animation decision framework (should it animate, purpose, easing, duration), button/press and reveal patterns, and the UI review checklist (Before/After table) for motion code review.

## 10. Copy rules (site content)

- **No em dashes** in UI/site copy (use commas, colons, periods, parentheses).
- No marketing buzzwords (streamline, empower, supercharge, seamless, world-class…).
- Button labels are verb + object; links have standalone meaning.
- English drafted first; **Icelandic drafted then reviewed by the team** for tone and correctness.

## 11. Verification

- `tsc` strict passes; ESLint clean.
- `next build` succeeds.
- **i18n completeness** test: `en.json` and `is.json` have identical key sets.
- Contact-form logic tested (validation, success/error, honeypot).
- Lighthouse: accessibility and performance pass; verify color contrast on real rendered pages.
- Reduced-motion verified (animations degrade gracefully).
- Manual run-through via the `run` / `verify` skills; screenshot key breakpoints (mobile / tablet / desktop) and confirm no heading overflow.
- Targeted tests for logic (form, i18n util); static sections verified visually rather than unit-tested.

## 12. Decisions (resolved)

1. **Contact backend:** Resend via a Next route handler, with a `mailto:` fallback. ✓
2. **Domain / deployment:** Vercel URL for now; no custom domain yet. ✓
3. **Footer links:** `ratatoskur_backend` and `ratatoskur_ios` are public → link to GitHub. ✓

## 13. Out of scope (v1, possible later)

- App Store / TestFlight distribution links once the app ships.
- Teacher-facing dashboard preview (Sproti-stage).
- Analytics/marketing tracking.
- Newsletter / waitlist.
