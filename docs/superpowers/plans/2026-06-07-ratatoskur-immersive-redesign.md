# Ratatoskur Immersive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current restrained, screenshot-led Ratatoskur website with the approved Living Notebook redesign, including a faithful guided-to-interactive app simulator, reliable localized navigation, redesigned secondary pages, real team portraits, and purposeful accessible motion.

**Architecture:** Keep Next.js App Router pages server-rendered and localized through `next-intl`, with narrow Client Component boundaries for the mobile menu, contact form, and simulator. Build the simulator from a pure tested reducer, deterministic demo content, a visibility-aware controller, SVG scripted ink, and a local pointer canvas. Use CSS Modules for section-specific art direction, semantic global tokens for shared brand values, and `motion/react` only for coordinated simulator state transitions.

**Tech Stack:** Next.js 16.2.7 App Router, React 19.2, TypeScript 5.8 strict, Tailwind CSS v4 base layer, CSS Modules, next-intl 4, Motion for React, next/font, next/image, MDX, Zod, Resend, Vitest.

**Primary specification:** `docs/superpowers/specs/2026-06-07-ratatoskur-immersive-redesign.md`

**Required implementation references:**

- Installed Next.js guides under `node_modules/next/dist/docs/01-app/`
- Motion React documentation: `https://motion.dev/docs/react`
- iOS source of truth: `.references/ratatoskur_ios/MathCoach/Features/Notebook/`
- Backend response contracts: `.references/ratatoskur_backend/api_contract_examples/`

---

## Target File Architecture

### Shared shell

- `src/components/shell/SiteHeader.tsx`: server-rendered header and localized links.
- `src/components/shell/MobileMenu.tsx`: client-only accessible mobile navigation.
- `src/components/shell/SiteFooter.tsx`: localized footer and repository links.
- `src/components/shell/LanguageToggle.tsx`: localized route switching.
- `src/components/shell/Shell.module.css`: header, mobile menu, footer, and language styles.
- `src/lib/site-links.ts`: pure localized-link and active-route helpers.
- `src/lib/site-links.test.ts`: link regression tests.

### Brand and shared UI

- `src/components/brand/LogoMark.tsx`: larger official logo and wordmark.
- `src/components/ui/ButtonLink.tsx`: link-style button variants.
- `src/components/ui/PageIntro.tsx`: secondary-page hero.
- `src/components/ui/Prose.tsx`: MDX reading wrapper.
- `src/components/ui/UI.module.css`: shared button, intro, and prose styles.

### Simulator

- `src/components/simulator/demo-types.ts`: simulator state and content types.
- `src/components/simulator/demo-machine.ts`: pure reducer and transition helpers.
- `src/components/simulator/demo-machine.test.ts`: reducer/state tests.
- `src/components/simulator/demo-content.ts`: deterministic English/Icelandic examples.
- `src/components/simulator/canvas-model.ts`: pure pointer normalization and stroke helpers.
- `src/components/simulator/canvas-model.test.ts`: drawing model tests.
- `src/components/simulator/useDemoController.ts`: visibility, timing, tab-state, reduced-motion controller.
- `src/components/simulator/DrawingCanvas.tsx`: local pointer/touch/stylus canvas.
- `src/components/simulator/ScriptedInk.tsx`: SVG handwriting paths.
- `src/components/simulator/NotebookShell.tsx`: faithful app chrome and problem workspace.
- `src/components/simulator/ReadingConfirmation.tsx`: clarification sheet.
- `src/components/simulator/TutorResponse.tsx`: Hint, Check, Reveal response card.
- `src/components/simulator/DemoControls.tsx`: pause, replay, skip, reset, and mode controls.
- `src/components/simulator/AppSimulator.tsx`: state composition.
- `src/components/simulator/AppSimulator.module.css`: device, notebook, and simulator visuals.

### Home

- `src/components/home/Hero.tsx`
- `src/components/home/ProductDemoSection.tsx`
- `src/components/home/ModeStories.tsx`
- `src/components/home/MethodSection.tsx`
- `src/components/home/IcelandicContext.tsx`
- `src/components/home/TeamSection.tsx`
- `src/components/home/ContactSection.tsx`
- `src/components/home/Home.module.css`

### Secondary pages

- `src/components/pages/ResearchDiagram.tsx`
- `src/components/pages/UpdatesList.tsx`
- `src/components/pages/EmptyUpdates.tsx`
- `src/components/pages/Pages.module.css`

### Retired after migration

- `src/components/Reveal.tsx`
- `src/components/DeviceFrame.tsx`
- `src/components/Nav.tsx`
- `src/components/Footer.tsx`
- `src/components/SectionHeading.tsx`
- `src/components/sections/*`
- Old screenshot files under `public/app/` after reference checks pass.

---

### Task 0: Establish A Clean Execution Baseline

**Files:**

- Modify: `eslint.config.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Preserve unstaged: `skills-lock.json`, `.cursor/`, and unrelated user changes

- [ ] **Step 1: Inspect the existing working tree before creating an implementation branch or worktree**

Run:

```powershell
git status --short
git diff -- .gitignore messages/en.json messages/is.json src/components/Footer.tsx src/i18n/messages.test.ts
git diff -- docs/superpowers/plans/2026-06-06-ratatoskur-website.md docs/superpowers/specs/2026-06-06-ratatoskur-website-design.md
```

Expected:

- The previously approved consistency fixes are visible.
- `skills-lock.json` and `.cursor/` are treated as user/tooling state and are not staged.

- [ ] **Step 2: Checkpoint the approved pre-redesign consistency changes separately**

Stage only:

```powershell
git add -- `
  .gitignore `
  messages/en.json `
  messages/is.json `
  src/components/Footer.tsx `
  src/i18n/messages.test.ts `
  docs/superpowers/plans/2026-06-06-ratatoskur-website.md `
  docs/superpowers/specs/2026-06-06-ratatoskur-website-design.md
git commit -m "fix: align team funding analytics and mode terminology"
```

Expected: one commit containing only the already approved consistency work.

- [ ] **Step 3: Read the relevant installed Next.js 16 guides**

Read:

```text
node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md
node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md
node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md
node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md
node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md
```

Confirm:

- `params` remains awaited.
- Client boundaries stay narrow.
- `ssr: false` is not placed in a Server Component.
- `next/image` receives fixed dimensions or `fill` with a sized parent.

- [ ] **Step 4: Install Motion**

Run:

```powershell
npm install motion
```

Expected: `motion` is added to dependencies and lockfile.

- [ ] **Step 5: Exclude local tool mirrors from application lint**

Update `eslint.config.mjs`:

```js
globalIgnores([
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  ".agents/**",
  ".cursor/**",
  ".superpowers/**",
  ".references/**",
])
```

- [ ] **Step 6: Verify baseline**

Run:

```powershell
npm test
npm run lint
npm run build
```

Expected:

- Existing tests pass.
- No application lint errors.
- Next.js production build succeeds.

- [ ] **Step 7: Commit dependency and lint setup**

```powershell
git add package.json package-lock.json eslint.config.mjs
git commit -m "chore: prepare motion and lint boundaries for redesign"
```

---

### Task 1: Rebuild The Brand Foundation

**Files:**

- Modify: `src/app/fonts.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/styles/tokens.css`
- Create: `src/components/brand/LogoMark.tsx`
- Create: `src/components/ui/ButtonLink.tsx`
- Create: `src/components/ui/UI.module.css`

- [ ] **Step 1: Replace the current fonts with the approved distinctive pairing**

Use `Literata` for display and `Manrope` for body/UI:

```ts
// src/app/fonts.ts
import { Literata, Manrope } from 'next/font/google';

export const displayFont = Literata({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz'],
});

export const bodyFont = Manrope({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
});
```

Update `src/app/[locale]/layout.tsx` imports and `<html className>` to use `displayFont.variable` and `bodyFont.variable`.

- [ ] **Step 2: Replace tokens with the Living Notebook system**

Define these shared tokens in `src/styles/tokens.css`:

```css
:root {
  --brand-espresso: #3c1d11;
  --brand-orange: #ed8228;
  --brand-rust: #a45124;
  --paper: #efe7d6;
  --paper-deep: #e2d3bd;
  --reading: #fff8ec;
  --ink: #2c160e;
  --ink-soft: #684b3b;
  --line: color-mix(in oklch, var(--brand-espresso) 18%, transparent);
  --focus: #ed8228;
  --success: #316b4f;
  --danger: #9b3728;

  --font-display-stack: var(--font-display), Georgia, serif;
  --font-body-stack: var(--font-body), system-ui, sans-serif;

  --page-gutter: clamp(1.1rem, 3vw, 3.5rem);
  --section-space: clamp(4.5rem, 9vw, 9rem);
  --content-max: 78rem;
  --reading-max: 46rem;

  --radius-sm: 0.5rem;
  --radius-md: 0.8rem;
  --radius-lg: 1.1rem;
  --radius-device: 2.4rem;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 140ms;
  --duration-ui: 220ms;
  --duration-scene: 420ms;

  --z-header: 50;
  --z-menu: 70;
  --z-dialog: 90;
}
```

- [ ] **Step 3: Replace the global reveal rules with stable global defaults**

`src/app/globals.css` must:

```css
@import "tailwindcss";
@import "../styles/tokens.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color-scheme: light;
  scroll-behavior: smooth;
  background: var(--paper);
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body-stack);
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4 {
  margin: 0;
  color: inherit;
  font-family: var(--font-display-stack);
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}

a {
  color: inherit;
}

button,
input,
textarea {
  font: inherit;
}

:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Remove every `[data-reveal]` rule.

- [ ] **Step 4: Build a larger official logo component**

```tsx
// src/components/brand/LogoMark.tsx
import Image from 'next/image';
import styles from '../ui/UI.module.css';

export function LogoMark({
  compact = false,
  priority = false,
}: {
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={styles.logo}>
      <Image
        src="/ratatoskur-logo.svg"
        alt=""
        width={compact ? 42 : 54}
        height={compact ? 42 : 54}
        priority={priority}
        className={styles.logoImage}
      />
      {!compact && <span className={styles.wordmark}>Ratatoskur</span>}
    </span>
  );
}
```

The SVG is decorative inside a link whose accessible name is supplied by the link.

- [ ] **Step 5: Build semantic button links**

```tsx
// src/components/ui/ButtonLink.tsx
import type { ComponentProps } from 'react';
import styles from './UI.module.css';

type Props = ComponentProps<'a'> & {
  tone?: 'espresso' | 'orange' | 'quiet';
};

export function ButtonLink({ tone = 'espresso', className, ...props }: Props) {
  return (
    <a
      {...props}
      className={[styles.button, styles[tone], className].filter(Boolean).join(' ')}
    />
  );
}
```

- [ ] **Step 6: Add `UI.module.css`**

Include:

- Logo mark at `42–54px`, wordmark at `clamp(1.15rem, 2vw, 1.55rem)`.
- Button minimum height `44px`.
- `:active` feedback no larger than `scale(.98)`.
- Hover only under `@media (hover: hover) and (pointer: fine)`.
- No `transition: all`.

- [ ] **Step 7: Verify typography and Icelandic glyphs**

Temporarily render:

```text
Hætti, stærðfræði, vísbending, Jóhannes, Sölvi, þ, ð, æ, ö
```

Check at 375px and 1440px. Remove temporary content.

- [ ] **Step 8: Run and commit**

```powershell
npm run lint
npm run build
git add src/app/fonts.ts src/app/[locale]/layout.tsx src/app/globals.css src/styles/tokens.css src/components/brand src/components/ui
git commit -m "feat: establish Living Notebook brand foundation"
```

---

### Task 2: Fix Localized Links With Tests

**Files:**

- Create: `src/lib/site-links.ts`
- Create: `src/lib/site-links.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/site-links.test.ts
import { describe, expect, test } from 'vitest';
import { homeAnchorHref, isRouteActive } from './site-links';

describe('homeAnchorHref', () => {
  test('creates an English home anchor from a secondary page', () => {
    expect(homeAnchorHref('en', 'how')).toBe('/en#how');
  });

  test('creates an Icelandic home anchor', () => {
    expect(homeAnchorHref('is', 'contact')).toBe('/is#contact');
  });
});

describe('isRouteActive', () => {
  test('matches a section route and its descendants', () => {
    expect(isRouteActive('/updates/a-post', '/updates')).toBe(true);
  });

  test('does not mark research active on updates', () => {
    expect(isRouteActive('/updates', '/research')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests and confirm RED**

```powershell
npm test -- src/lib/site-links.test.ts
```

Expected: FAIL because `site-links.ts` does not exist.

- [ ] **Step 3: Implement the pure helpers**

```ts
// src/lib/site-links.ts
import type { Locale } from '@/i18n/routing';

export type HomeAnchor = 'demo' | 'how' | 'method' | 'team' | 'contact';

export function homeAnchorHref(locale: Locale, anchor: HomeAnchor) {
  return `/${locale}#${anchor}` as const;
}

export function isRouteActive(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}
```

- [ ] **Step 4: Run GREEN**

```powershell
npm test -- src/lib/site-links.test.ts
```

Expected: 4 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/site-links.ts src/lib/site-links.test.ts
git commit -m "test: define reliable localized site links"
```

---

### Task 3: Replace The Shared Navigation Shell

**Files:**

- Create: `src/components/shell/SiteHeader.tsx`
- Create: `src/components/shell/MobileMenu.tsx`
- Create: `src/components/shell/SiteFooter.tsx`
- Create: `src/components/shell/LanguageToggle.tsx`
- Create: `src/components/shell/Shell.module.css`
- Modify: `src/app/[locale]/layout.tsx`
- Delete after replacement: `src/components/Nav.tsx`
- Delete after replacement: `src/components/Footer.tsx`
- Delete after replacement: `src/components/LanguageToggle.tsx`
- Delete after replacement: `src/components/LogoMark.tsx`

- [ ] **Step 1: Build the server-rendered header**

`SiteHeader.tsx` accepts the validated `locale` from the locale layout and uses:

```tsx
const links = [
  { href: homeAnchorHref(locale, 'demo'), label: t('demo') },
  { href: homeAnchorHref(locale, 'how'), label: t('how') },
  { href: '/research', label: t('research') },
  { href: '/updates', label: t('updates') },
];
```

Requirements:

- Logo link accessible name: `Ratatoskur home`.
- Desktop links visible from `min-width: 56rem`.
- Contact CTA points to `homeAnchorHref(locale, 'contact')`.
- Updates is present.
- No bare `#anchor` appears in shared navigation.

- [ ] **Step 2: Build the accessible mobile menu**

`MobileMenu.tsx`:

```tsx
'use client';

import { useEffect, useId, useState } from 'react';

export function MobileMenu({ children, openLabel, closeLabel }: {
  children: React.ReactNode;
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
      </button>
      {open && <div id={panelId}>{children}</div>}
    </div>
  );
}
```

During implementation, close the menu when a link is selected by passing an `onNavigate` callback to menu links or by wrapping the link list inside the client component.

- [ ] **Step 3: Rebuild language switching**

Keep `usePathname()` and `router.replace(pathname, { locale })`.

Requirements:

- `aria-label` comes from translations.
- Each target is at least `44px` high.
- Current locale uses `aria-current="true"`.
- Preserve Research/Updates/article path when switching.

- [ ] **Step 4: Build the footer**

Include:

- Large logo and wordmark.
- Localized Home, Research, Updates, Contact links.
- Backend and iOS GitHub links.
- Language toggle.
- No funding acknowledgment.

- [ ] **Step 5: Mount the shell in the locale layout**

```tsx
<NextIntlClientProvider>
  <SiteHeader locale={locale as Locale} />
  <div className="site-main">{children}</div>
  <SiteFooter locale={locale as Locale} />
</NextIntlClientProvider>
```

Add `.site-main { flex: 1; }` globally or use a shell class.

- [ ] **Step 6: Verify every shared link from all routes**

Run the dev server and test:

```text
/en
/en/research
/en/updates
/en/updates/2026-06-06-first-update
/is
/is/research
/is/updates
```

From every secondary page:

- “How it works” reaches localized home `#how`.
- “Contact” reaches localized home `#contact`.
- Logo reaches localized home.
- Updates is reachable.

- [ ] **Step 7: Run and commit**

```powershell
npm test
npm run lint
npm run build
git add src/components/shell src/app/[locale]/layout.tsx src/components/Nav.tsx src/components/Footer.tsx src/components/LanguageToggle.tsx src/components/LogoMark.tsx
git commit -m "feat: replace shell with reliable localized navigation"
```

---

### Task 4: Implement The Simulator State Machine With TDD

**Files:**

- Create: `src/components/simulator/demo-types.ts`
- Create: `src/components/simulator/demo-machine.ts`
- Create: `src/components/simulator/demo-machine.test.ts`
- Create: `src/components/simulator/demo-content.ts`

- [ ] **Step 1: Define the public types**

```ts
// demo-types.ts
export type DemoStage =
  | 'idle'
  | 'writing'
  | 'checking-reading'
  | 'confirming'
  | 'responding'
  | 'interactive';

export type DemoMode = 'hint' | 'check_solution' | 'reveal';

export type DemoState = {
  stage: DemoStage;
  mode: DemoMode;
  paused: boolean;
  guidedRunComplete: boolean;
  runId: number;
};

export type DemoAction =
  | { type: 'START' }
  | { type: 'ADVANCE' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SKIP' }
  | { type: 'REPLAY' }
  | { type: 'SELECT_MODE'; mode: DemoMode };
```

- [ ] **Step 2: Write failing reducer tests**

```ts
import { describe, expect, test } from 'vitest';
import { initialDemoState, reduceDemo } from './demo-machine';

test('guided sequence follows the approved states', () => {
  let state = reduceDemo(initialDemoState, { type: 'START' });
  expect(state.stage).toBe('writing');

  state = reduceDemo(state, { type: 'ADVANCE' });
  expect(state.stage).toBe('checking-reading');

  state = reduceDemo(state, { type: 'ADVANCE' });
  expect(state.stage).toBe('confirming');

  state = reduceDemo(state, { type: 'ADVANCE' });
  expect(state.stage).toBe('responding');

  state = reduceDemo(state, { type: 'ADVANCE' });
  expect(state.stage).toBe('interactive');
  expect(state.guidedRunComplete).toBe(true);
});

test('pause blocks ADVANCE until resume', () => {
  const writing = reduceDemo(initialDemoState, { type: 'START' });
  const paused = reduceDemo(writing, { type: 'PAUSE' });
  expect(reduceDemo(paused, { type: 'ADVANCE' })).toEqual(paused);
  expect(reduceDemo(paused, { type: 'RESUME' }).paused).toBe(false);
});

test('skip unlocks interaction', () => {
  expect(reduceDemo(initialDemoState, { type: 'SKIP' }).stage).toBe('interactive');
});

test('replay resets the run and increments runId', () => {
  const interactive = { ...initialDemoState, stage: 'interactive' as const, runId: 2 };
  const replayed = reduceDemo(interactive, { type: 'REPLAY' });
  expect(replayed.stage).toBe('writing');
  expect(replayed.runId).toBe(3);
});

test('mode changes only after interaction unlocks', () => {
  expect(
    reduceDemo(initialDemoState, { type: 'SELECT_MODE', mode: 'reveal' }).mode,
  ).toBe('hint');
});
```

- [ ] **Step 3: Run RED**

```powershell
npm test -- src/components/simulator/demo-machine.test.ts
```

Expected: module-not-found failure.

- [ ] **Step 4: Implement the reducer**

```ts
const sequence: DemoStage[] = [
  'idle',
  'writing',
  'checking-reading',
  'confirming',
  'responding',
  'interactive',
];

export const initialDemoState: DemoState = {
  stage: 'idle',
  mode: 'hint',
  paused: false,
  guidedRunComplete: false,
  runId: 0,
};

export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'START':
      return state.stage === 'idle' ? { ...state, stage: 'writing' } : state;
    case 'ADVANCE': {
      if (state.paused) return state;
      const index = sequence.indexOf(state.stage);
      const stage = sequence[Math.min(index + 1, sequence.length - 1)];
      return {
        ...state,
        stage,
        guidedRunComplete: stage === 'interactive' || state.guidedRunComplete,
      };
    }
    case 'PAUSE':
      return { ...state, paused: true };
    case 'RESUME':
      return { ...state, paused: false };
    case 'SKIP':
      return { ...state, stage: 'interactive', paused: false, guidedRunComplete: true };
    case 'REPLAY':
      return {
        ...initialDemoState,
        stage: 'writing',
        runId: state.runId + 1,
      };
    case 'SELECT_MODE':
      return state.stage === 'interactive' ? { ...state, mode: action.mode } : state;
  }
}
```

- [ ] **Step 5: Add deterministic localized content**

`demo-content.ts` exports:

```ts
export type DemoCopy = {
  problem: string;
  interpretedReading: string;
  confidence: string;
  handwritingLines: string[];
  responses: Record<DemoMode, { title: string; body: string }>;
};

export const demoCopy: Record<'en' | 'is', DemoCopy> = {
  en: {
    problem: 'Solve the equation: 2x + 3 = 11',
    interpretedReading: '2x + 3 = 11',
    confidence: '68% reading confidence',
    handwritingLines: ['2x + 3 = 11', '2x = 8', 'x = 4'],
    responses: {
      hint: {
        title: 'You are on the right track.',
        body: 'Next, divide both sides by 2 to isolate x.',
      },
      check_solution: {
        title: 'The solution is correct.',
        body: 'Each step preserves the equality, and x = 4 satisfies the original equation.',
      },
      reveal: {
        title: 'Full solution',
        body: 'Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.',
      },
    },
  },
  is: {
    problem: 'Leystu jöfnuna: 2x + 3 = 11',
    interpretedReading: '2x + 3 = 11',
    confidence: '68% lestraröryggi',
    handwritingLines: ['2x + 3 = 11', '2x = 8', 'x = 4'],
    responses: {
      hint: {
        title: 'Þú ert á réttri leið.',
        body: 'Næst skaltu deila báðum megin með 2 til að einangra x.',
      },
      check_solution: {
        title: 'Lausnin er rétt.',
        body: 'Hvert skref varðveitir jafngildið og x = 4 uppfyllir upphaflegu jöfnuna.',
      },
      reveal: {
        title: 'Full lausn',
        body: 'Dragðu 3 frá báðum megin til að fá 2x = 8 og deildu síðan með 2 til að fá x = 4.',
      },
    },
  },
};
```

- [ ] **Step 6: Run GREEN and commit**

```powershell
npm test -- src/components/simulator/demo-machine.test.ts
git add src/components/simulator/demo-types.ts src/components/simulator/demo-machine.ts src/components/simulator/demo-machine.test.ts src/components/simulator/demo-content.ts
git commit -m "feat: add tested app demo state machine"
```

---

### Task 5: Implement Local Drawing Helpers With TDD

**Files:**

- Create: `src/components/simulator/canvas-model.ts`
- Create: `src/components/simulator/canvas-model.test.ts`
- Create: `src/components/simulator/DrawingCanvas.tsx`

- [ ] **Step 1: Write failing drawing-model tests**

```ts
import { expect, test } from 'vitest';
import { appendPoint, normalizePointer } from './canvas-model';

test('normalizes pointer coordinates into canvas space', () => {
  expect(
    normalizePointer(
      { clientX: 150, clientY: 90 },
      { left: 100, top: 50, width: 200, height: 100 },
    ),
  ).toEqual({ x: 0.25, y: 0.4 });
});

test('clamps points to the drawing area', () => {
  expect(
    normalizePointer(
      { clientX: 500, clientY: -10 },
      { left: 100, top: 50, width: 200, height: 100 },
    ),
  ).toEqual({ x: 1, y: 0 });
});

test('appendPoint creates a new immutable stroke', () => {
  const original = [{ x: 0, y: 0 }];
  expect(appendPoint(original, { x: 1, y: 1 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ]);
  expect(original).toHaveLength(1);
});
```

- [ ] **Step 2: Run RED**

```powershell
npm test -- src/components/simulator/canvas-model.test.ts
```

- [ ] **Step 3: Implement helpers**

```ts
export type Point = { x: number; y: number };

export function normalizePointer(
  pointer: { clientX: number; clientY: number },
  rect: { left: number; top: number; width: number; height: number },
): Point {
  return {
    x: Math.min(1, Math.max(0, (pointer.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (pointer.clientY - rect.top) / rect.height)),
  };
}

export function appendPoint(points: Point[], point: Point) {
  return [...points, point];
}
```

- [ ] **Step 4: Run GREEN**

```powershell
npm test -- src/components/simulator/canvas-model.test.ts
```

- [ ] **Step 5: Build the local pointer canvas**

`DrawingCanvas.tsx` requirements:

- `'use client'`
- Store `Point[][]` in component state.
- Use Pointer Events, not separate mouse/touch handlers.
- Call `setPointerCapture(event.pointerId)` on pointer down.
- Set `touch-action: none` only on the drawing surface.
- Redraw to the backing canvas when strokes change or dimensions resize.
- Scale canvas backing dimensions by `devicePixelRatio`.
- Expose `clearSignal: number`; clear when the signal changes.
- Never call `fetch`, upload, or serialize outside the component.
- Add visible text: “Drawing stays on this device.”
- Canvas `aria-label` comes from localized copy.

- [ ] **Step 6: Verify pointer behavior**

Browser checks:

- Mouse drawing works.
- Touch emulation works.
- Stylus pointer type does not branch into broken behavior.
- Page scroll works outside the canvas.
- Clear removes all strokes.

- [ ] **Step 7: Commit**

```powershell
git add src/components/simulator/canvas-model.ts src/components/simulator/canvas-model.test.ts src/components/simulator/DrawingCanvas.tsx
git commit -m "feat: add local pointer drawing canvas"
```

---

### Task 6: Build The Visibility-Aware Demo Controller

**Files:**

- Create: `src/components/simulator/useDemoController.ts`

- [ ] **Step 1: Define exact stage durations**

```ts
const stageDuration: Partial<Record<DemoStage, number>> = {
  writing: 2400,
  'checking-reading': 900,
  confirming: 2200,
  responding: 2200,
};
```

- [ ] **Step 2: Implement the controller**

The hook must:

- Use `useReducer(reduceDemo, initialDemoState)`.
- Observe the demo root with `IntersectionObserver`.
- Dispatch `START` only once when at least 55% visible.
- Pause when less than 20% visible.
- Resume only if the visitor did not manually pause.
- Pause on `document.visibilityState === 'hidden'`.
- Read `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- In reduced motion, dispatch `SKIP` when the demo enters view and show manual state tabs.
- Schedule one timeout at a time from `stageDuration`.
- Clear timeouts on stage change and unmount.

Return:

```ts
{
  state,
  rootRef,
  reducedMotion,
  pause,
  resume,
  replay,
  skip,
  selectMode,
}
```

- [ ] **Step 3: Add comments only around timing ownership**

One comment should explain that reducer transitions are pure while this hook owns browser visibility and timers. Avoid narrating obvious React code.

- [ ] **Step 4: Verify manually with performance tools**

- Scroll demo into view: starts once.
- Scroll away: pauses.
- Return: resumes.
- Hide tab: pauses.
- Replay increments `runId` and redraws scripted ink.
- Reduced motion: no timed cinematic sequence.

- [ ] **Step 5: Commit**

```powershell
git add src/components/simulator/useDemoController.ts
git commit -m "feat: orchestrate visibility-aware guided demo"
```

---

### Task 7: Build The Faithful App Simulator UI

**Files:**

- Create: `src/components/simulator/ScriptedInk.tsx`
- Create: `src/components/simulator/NotebookShell.tsx`
- Create: `src/components/simulator/ReadingConfirmation.tsx`
- Create: `src/components/simulator/TutorResponse.tsx`
- Create: `src/components/simulator/DemoControls.tsx`
- Create: `src/components/simulator/AppSimulator.tsx`
- Create: `src/components/simulator/AppSimulator.module.css`

- [ ] **Step 1: Build scripted handwriting as SVG**

`ScriptedInk.tsx`:

- Three SVG paths matching the lines:
  - `2x + 3 = 11`
  - `2x = 8`
  - `x = 4`
- Use `pathLength="1"`.
- Animate `strokeDashoffset` from `1` to `0`.
- Use Motion only when `animate` is true.
- Use a stable full drawing when reduced motion is true.
- Key the SVG with `runId` so replay restarts it.

Use:

```tsx
import { motion } from 'motion/react';
```

Do not animate layout dimensions.

- [ ] **Step 2: Build the notebook shell**

`NotebookShell.tsx` renders:

- iPhone-like device frame.
- App top bar.
- Problem panel.
- Writing surface.
- Page count and simple toolbar.
- Mode actions using the actual Icelandic labels in Icelandic locale.
- Child slot for reading confirmation or response.

Props:

```ts
type NotebookShellProps = {
  locale: 'en' | 'is';
  stage: DemoStage;
  mode: DemoMode;
  runId: number;
  drawingMode: boolean;
  clearSignal: number;
  onModeChange: (mode: DemoMode) => void;
};
```

- [ ] **Step 3: Build reading confirmation**

Use `AnimatePresence initial={false} mode="wait"` around the overlay state.

The sheet includes:

- Confidence badge.
- “Did you write…” / Icelandic equivalent.
- Interpreted reading.
- Confirm control.
- Explanation that Ratatoskur asks before guessing.

The confirm control advances to the response state during the guided run and closes the sheet in interactive mode.

- [ ] **Step 4: Build response cards**

`TutorResponse.tsx` reads deterministic response content by locale and mode.

Include:

- Mode tag.
- Title.
- Body.
- Decorative thumbs controls only if labeled as demo feedback.
- No backend request.

- [ ] **Step 5: Build demo controls**

Controls:

- Pause / Resume
- Replay
- Skip guided demo
- Try drawing / Return to example
- Clear drawing

Requirements:

- All controls are real `<button>` elements.
- `aria-pressed` for drawing-mode toggle.
- Minimum `44px` target.
- Controls remain visible in reduced motion.

- [ ] **Step 6: Compose `AppSimulator`**

```tsx
'use client';

export function AppSimulator({ locale }: { locale: 'en' | 'is' }) {
  const demo = useDemoController();
  const [drawingMode, setDrawingMode] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);

  return (
    <section ref={demo.rootRef} aria-label={...}>
      <p>Illustrative demo. Custom drawing stays on this device.</p>
      <NotebookShell
        locale={locale}
        stage={demo.state.stage}
        mode={demo.state.mode}
        runId={demo.state.runId}
        drawingMode={drawingMode}
        clearSignal={clearSignal}
        onModeChange={demo.selectMode}
      />
      <DemoControls ... />
      <p aria-live="polite" className={styles.srOnly}>
        {localizedStageAnnouncement}
      </p>
    </section>
  );
}
```

Throttle announcements to stage changes only. Do not announce every handwriting frame.

- [ ] **Step 7: Implement simulator CSS**

`AppSimulator.module.css` must include:

- Device dimensions using `clamp()`.
- App palette derived from the iOS mode picker.
- No fake browser chrome.
- Stable reserved height to prevent layout shift.
- Sheet and response overlay positions.
- `@media (max-width: 48rem)` mobile layout.
- `@media (prefers-reduced-motion: reduce)` stable states.
- `@media (forced-colors: active)` visible borders.

- [ ] **Step 8: Run quality checks and commit**

```powershell
npm test
npm run lint
npm run build
git add src/components/simulator
git commit -m "feat: build faithful interactive Ratatoskur simulator"
```

---

### Task 8: Build The New Hero And Product Demo Section

**Files:**

- Create: `src/components/home/Hero.tsx`
- Create: `src/components/home/ProductDemoSection.tsx`
- Create: `src/components/home/Home.module.css`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Build the server-rendered hero**

Hero structure:

```tsx
<section className={styles.hero}>
  <div className={styles.heroCopy}>
    <p className={styles.heroKicker}>{t('kicker')}</p>
    <h1>{t('title')}</h1>
    <p className={styles.heroLead}>{t('lead')}</p>
    <div className={styles.heroActions}>
      <ButtonLink href="#demo">{t('watchDemo')}</ButtonLink>
      <ButtonLink href="#contact" tone="quiet">{t('contact')}</ButtonLink>
    </div>
  </div>
  <div className={styles.heroAppPreview} aria-hidden="true">
    {/* Static app preview built from HTML/CSS, not a screenshot */}
  </div>
</section>
```

Do not use the old `DeviceFrame` or PNG screenshot.

- [ ] **Step 2: Add a single orchestrated page entrance**

Use CSS `@starting-style` where supported:

```css
.heroCopy,
.heroAppPreview {
  opacity: 1;
  transform: none;
  transition:
    opacity 520ms var(--ease-out),
    transform 520ms var(--ease-out);
}

@starting-style {
  .heroCopy {
    opacity: 0;
    transform: translateY(14px);
  }

  .heroAppPreview {
    opacity: 0;
    transform: translateY(20px) rotate(2deg);
  }
}
```

Disable through reduced-motion globals.

- [ ] **Step 3: Build `ProductDemoSection`**

Include:

- `id="demo"`.
- Short explanatory copy.
- AppSimulator.
- Mode explanation after the simulator.
- Stable server-rendered heading before client hydration.

- [ ] **Step 4: Compose the initial home page**

Temporarily render:

```tsx
<main className={styles.home}>
  <Hero />
  <ProductDemoSection />
</main>
```

- [ ] **Step 5: Browser-check first two viewports**

At 375, 768, 1440:

- Logo and hero do not overflow.
- Simulator starts only when reached.
- Hero visual does not depend on JavaScript.
- No layout shift when simulator hydrates.
- No screenshot assets load.

- [ ] **Step 6: Commit**

```powershell
git add src/components/home/Hero.tsx src/components/home/ProductDemoSection.tsx src/components/home/Home.module.css src/app/[locale]/page.tsx
git commit -m "feat: launch Living Notebook hero and product demo"
```

---

### Task 9: Build The Home Story Sections

**Files:**

- Create: `src/components/home/ModeStories.tsx`
- Create: `src/components/home/MethodSection.tsx`
- Create: `src/components/home/IcelandicContext.tsx`
- Create: `src/components/home/TeamSection.tsx`
- Modify: `src/components/home/Home.module.css`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Build mode stories from evidence**

Use three visually distinct rows, not equal cards:

```tsx
const modes = [
  { key: 'hint', number: '01' },
  { key: 'check', number: '02' },
  { key: 'reveal', number: '03' },
] as const;
```

Each row includes:

- Number.
- User-facing mode name.
- One sentence describing the policy.
- A small response excerpt from `demo-content.ts`.
- Alternating alignment on desktop, single column on mobile.

- [ ] **Step 2: Build Method section**

Show:

- Problem + handwriting.
- Confirmation before guessing.
- Consent-aware evaluation.
- Future teacher/researcher insight boundary.

Use a dark espresso field and one simple process diagram. Do not claim a current teacher dashboard.

- [ ] **Step 3: Build Icelandic Context section**

Use the committed orange treatment.

Content:

- Built in Iceland.
- Icelandic responses.
- Prototype in validation.
- No current funding support claim.

- [ ] **Step 4: Copy team portraits into public**

Run:

```powershell
New-Item -ItemType Directory -Force public/team | Out-Null
Copy-Item -LiteralPath 'C:\Users\solvi\Downloads\solvi.jpg' -Destination 'public/team/solvi.jpg'
Copy-Item -LiteralPath 'C:\Users\solvi\Downloads\joi.jpg' -Destination 'public/team/johannes.jpg'
```

Verify hashes differ from the stale cached files and dimensions are 400×400.

- [ ] **Step 5: Build Team section with `next/image`**

Use:

```tsx
<Image
  src="/team/solvi.jpg"
  alt="Sölvi Santos"
  width={400}
  height={400}
  sizes="(max-width: 700px) 78vw, 28vw"
/>
```

and equivalent for Jóhannes.

Requirements:

- Rectangular art-directed crop.
- Shared border/shadow geometry.
- Preserve Sölvi color and Jóhannes monochrome.
- Real short bios from translation content.
- No circles or initials.

- [ ] **Step 6: Compose home sections**

Order:

```tsx
<Hero />
<ProductDemoSection />
<ModeStories />
<MethodSection />
<IcelandicContext />
<TeamSection />
<ContactSection />
```

ContactSection is added in Task 10.

- [ ] **Step 7: Verify and commit**

```powershell
npm run lint
npm run build
git add src/components/home src/app/[locale]/page.tsx public/team
git commit -m "feat: complete product story and real team section"
```

---

### Task 10: Redesign Contact With Shared Validation

**Files:**

- Create: `src/lib/contact-errors.ts`
- Create: `src/lib/contact-errors.test.ts`
- Create: `src/components/home/ContactSection.tsx`
- Modify: `src/components/home/Home.module.css`
- Preserve: `src/lib/contact-schema.ts`
- Preserve: `src/app/api/contact/route.ts`

- [ ] **Step 1: Write failing validation-error tests**

```ts
import { expect, test } from 'vitest';
import { contactSchema } from './contact-schema';
import { fieldErrors } from './contact-errors';

test('maps zod field errors for inline display', () => {
  const result = contactSchema.safeParse({
    name: '',
    email: 'bad',
    organization: '',
    message: '',
    website: '',
  });
  if (result.success) throw new Error('expected validation failure');

  expect(fieldErrors(result.error)).toMatchObject({
    name: expect.any(String),
    email: expect.any(String),
    organization: expect.any(String),
    message: expect.any(String),
  });
});
```

- [ ] **Step 2: Run RED**

```powershell
npm test -- src/lib/contact-errors.test.ts
```

- [ ] **Step 3: Implement error mapping**

```ts
import type { ZodError } from 'zod';

export function fieldErrors(error: ZodError) {
  const flat = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flat).map(([key, messages]) => [key, messages?.[0] ?? '']),
  );
}
```

- [ ] **Step 4: Run GREEN**

```powershell
npm test -- src/lib/contact-errors.test.ts
```

- [ ] **Step 5: Build ContactSection**

Client behavior:

1. Convert form entries to a plain object.
2. Run `contactSchema.safeParse`.
3. Show localized inline errors and focus the first invalid field.
4. Submit valid values to `/api/contact`.
5. Preserve form values on network/server failure.
6. Reset only on success.
7. Keep `mailto:hello@ratatoskur.is` visible.

Use an espresso/orange closing composition rather than a generic centered form card.

- [ ] **Step 6: Verify all states**

- Empty submit.
- Invalid email.
- Successful mocked/local configured send.
- Missing API key returns friendly failure and mailto.
- Keyboard focus moves to first invalid field.
- Values persist after failure.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/contact-errors.ts src/lib/contact-errors.test.ts src/components/home/ContactSection.tsx src/components/home/Home.module.css
git commit -m "feat: redesign contact with inline recovery"
```

---

### Task 11: Rewrite And Validate Bilingual Content

**Files:**

- Modify: `messages/en.json`
- Modify: `messages/is.json`
- Modify: `src/i18n/messages.test.ts`

- [ ] **Step 1: Expand the message structure identically**

Required top-level groups:

```text
meta
nav
hero
demo
modes
method
iceland
team
contact
research
updates
footer
```

Do not hardcode user-facing English in components.

- [ ] **Step 2: Add regression assertions**

Extend `messages.test.ts`:

```ts
test('public copy keeps prohibited claims out', () => {
  const joined = JSON.stringify({ en, is }).toLowerCase();
  expect(joined).not.toContain('supported by tæknþróunarsjóður');
  expect(joined).not.toContain('stutt af tækniþróunarsjóði');
  expect(joined).not.toContain('sævar');
});

test('mode labels stay consistent', () => {
  expect(en.demo.modes).toEqual({
    hint: 'Hint',
    check: 'Check',
    reveal: 'Reveal',
  });
  expect(is.demo.modes).toEqual({
    hint: 'Vísbending',
    check: 'Fara yfir lausn',
    reveal: 'Sýna lausn',
  });
});
```

- [ ] **Step 3: Run tests**

```powershell
npm test -- src/i18n/messages.test.ts
```

Fix parity and exact labels until green.

- [ ] **Step 4: Perform copy QA**

Search:

```powershell
Get-ChildItem messages,content,src -Recurse -File |
  Select-String -Pattern '—|streamline|empower|supercharge|seamless|world-class|Sævar|Supported by|Stutt af'
```

Expected: no public-copy hits.

- [ ] **Step 5: Commit**

```powershell
git add messages/en.json messages/is.json src/i18n/messages.test.ts
git commit -m "content: rewrite bilingual Living Notebook story"
```

---

### Task 12: Redesign The Research Page

**Files:**

- Create: `src/components/ui/PageIntro.tsx`
- Create: `src/components/ui/Prose.tsx`
- Create: `src/components/pages/ResearchDiagram.tsx`
- Create: `src/components/pages/Pages.module.css`
- Modify: `src/app/[locale]/research/page.tsx`
- Modify: `content/research/en.mdx`
- Modify: `content/research/is.mdx`

- [ ] **Step 1: Build shared secondary-page primitives**

`PageIntro` props:

```ts
{
  eyebrow?: string;
  title: string;
  summary?: string;
  tone: 'dark' | 'orange' | 'paper';
}
```

`Prose` wraps MDX with:

- `max-width: var(--reading-max)`.
- Correct heading spacing.
- Styled lists, links, blockquotes, and code.
- No global article element styling.

- [ ] **Step 2: Build the research process diagram**

Four steps:

```text
Problem + handwriting
→ Legibility check
→ Confirm when uncertain
→ Mode-specific tutoring response
```

Use semantic HTML ordered list with decorative connectors. It must read correctly with CSS disabled.

- [ ] **Step 3: Rewrite research MDX**

English and Icelandic content must include:

- Handwritten mathematics.
- Legibility and reading confirmation.
- Hint, Check, Reveal policy.
- Consent and data boundaries.
- Evaluation approach.
- Prototype and validation status.
- Fræ preparation and later Sproti boundary.

Do not describe internal provider routing unless it directly supports a public trust point.

- [ ] **Step 4: Rebuild route**

Use awaited `params`.

Render:

```tsx
<main className={styles.researchPage}>
  <PageIntro tone="dark" ... />
  <ResearchDiagram ... />
  <Prose>
    <MDXRemote source={content} />
  </Prose>
</main>
```

- [ ] **Step 5: Verify and commit**

```powershell
npm run lint
npm run build
git add src/components/ui src/components/pages src/app/[locale]/research/page.tsx content/research
git commit -m "feat: redesign research as a focused methodology page"
```

---

### Task 13: Redesign Updates And Articles

**Files:**

- Create: `src/components/pages/UpdatesList.tsx`
- Create: `src/components/pages/EmptyUpdates.tsx`
- Modify: `src/components/pages/Pages.module.css`
- Modify: `src/app/[locale]/updates/page.tsx`
- Modify: `src/app/[locale]/updates/[slug]/page.tsx`
- Modify: `src/lib/updates.ts`
- Modify: `src/lib/updates.test.ts`

- [ ] **Step 1: Add locale-safe post lookup test**

Add:

```ts
test('does not return a post for the wrong locale', () => {
  expect(getPostBySlug('a', dir, 'is')).toBeNull();
});
```

Change signature:

```ts
getPostBySlug(slug: string, dir?: string, locale?: string)
```

- [ ] **Step 2: Run RED**

```powershell
npm test -- src/lib/updates.test.ts
```

- [ ] **Step 3: Implement locale filtering**

After parsing:

```ts
if (locale && String(data.locale ?? '') !== locale) return null;
```

- [ ] **Step 4: Run GREEN**

```powershell
npm test -- src/lib/updates.test.ts
```

- [ ] **Step 5: Build Updates index**

Use:

- Orange PageIntro.
- Large date column.
- Title and summary.
- Visible focus/hover state.
- EmptyUpdates when `posts.length === 0`.

Empty Icelandic state includes:

- “No updates have been published in Icelandic yet.”
- Link to English updates.
- Link back home.

- [ ] **Step 6: Rebuild article page**

Await both `locale` and `slug`.

Call:

```ts
getPostBySlug(slug, undefined, locale)
```

Render:

- Back to Updates link.
- Localized date.
- Large article title.
- `Prose`.
- 404 for wrong-locale slug.

- [ ] **Step 7: Verify and commit**

```powershell
npm test
npm run build
git add src/components/pages src/app/[locale]/updates src/lib/updates.ts src/lib/updates.test.ts
git commit -m "feat: redesign updates with localized empty states"
```

---

### Task 14: Add Localized Metadata And Route Polish

**Files:**

- Create: `src/lib/metadata.ts`
- Create: `src/lib/metadata.test.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/research/page.tsx`
- Modify: `src/app/[locale]/updates/page.tsx`
- Modify: `src/app/[locale]/updates/[slug]/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write metadata helper test**

```ts
import { expect, test } from 'vitest';
import { localizedAlternates } from './metadata';

test('creates locale alternates for a route', () => {
  expect(localizedAlternates('/research')).toEqual({
    languages: {
      en: '/en/research',
      is: '/is/research',
    },
  });
});
```

- [ ] **Step 2: Run RED**

```powershell
npm test -- src/lib/metadata.test.ts
```

- [ ] **Step 3: Implement helper**

```ts
export function localizedAlternates(pathname = '') {
  return {
    languages: {
      en: `/en${pathname}`,
      is: `/is${pathname}`,
    },
  };
}
```

- [ ] **Step 4: Add `generateMetadata` per page**

Metadata includes:

- Localized title.
- Localized description.
- Alternates.
- Open Graph title/description.
- No unverified funding or outcome claims.

Preserve the validated layout structure already used by the project:

- `src/app/layout.tsx` remains the required passthrough.
- `src/app/[locale]/layout.tsx` owns `<html lang={locale}>` and `<body>`.
- The production build in Step 5 is the regression gate for this installed Next.js version.

- [ ] **Step 5: Run GREEN and build**

```powershell
npm test -- src/lib/metadata.test.ts
npm run build
```

- [ ] **Step 6: Commit**

```powershell
git add src/lib/metadata.ts src/lib/metadata.test.ts src/app
git commit -m "feat: add localized metadata and route polish"
```

---

### Task 15: Remove The Old Website Implementation

**Files:**

- Delete: `src/components/Reveal.tsx`
- Delete: `src/components/DeviceFrame.tsx`
- Delete: `src/components/SectionHeading.tsx`
- Delete: `src/components/Button.tsx` if fully replaced
- Delete: `src/components/sections/`
- Delete: unused screenshots in `public/app/`
- Modify: imports across `src/`

- [ ] **Step 1: Prove old components are unused**

Run:

```powershell
git grep -n "Reveal\|DeviceFrame\|SectionHeading\|components/sections\|/app/mode-picker.png\|/app/screen-" -- src
```

Expected: no references outside files scheduled for deletion.

- [ ] **Step 2: Delete retired code and assets**

Use `apply_patch` for source-file deletions. Use `Remove-Item -LiteralPath` only for confirmed unused binary screenshots, after verifying every resolved path is under `public/app/`.

- [ ] **Step 3: Scan for obsolete patterns**

```powershell
git grep -n "data-reveal\|transition: all\|href=\"#how\"\|href=\"#contact\"" -- src
```

Expected: no hits.

- [ ] **Step 4: Run full automated checks**

```powershell
npm test
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```powershell
git add -A src public/app
git commit -m "refactor: remove retired screenshot and reveal implementation"
```

---

### Task 16: Motion, Accessibility, And Responsive Audit

**Files:**

- Modify as findings require: simulator, home, shell, pages CSS/components
- Create: `docs/qa/2026-06-07-redesign-audit.md`

- [ ] **Step 1: Run the design-motion audit**

Use the installed `design-motion-principles` Audit workflow.

Context weighting:

- Primary: Jakub Krehel production polish
- Secondary: Jhey Tompkins selective delight
- Selective: Emil Kowalski restraint for nav/forms

Record:

- Animation purpose.
- Trigger frequency.
- Duration/easing.
- Reduced-motion behavior.
- Performance risk.

- [ ] **Step 2: Run Impeccable audit and critique**

```powershell
node .agents/skills/impeccable/scripts/detect.mjs --json src
```

Review manually for:

- Gradient text.
- Generic icon cards.
- Repeated eyebrows.
- Ghost cards.
- Excessive rounding.
- Low contrast.
- Heading overflow.
- Equal-card-grid overuse.

- [ ] **Step 3: Verify accessibility**

Browser/manual:

- Tab through entire header, demo, form, and footer.
- Escape closes mobile menu.
- Every simulator button has a visible focus state.
- State changes are announced once.
- Canvas has label and local-only explanation.
- 200% zoom causes no horizontal page overflow.
- Forced colors keeps controls visible.

- [ ] **Step 4: Verify reduced motion**

With reduced motion:

- Hero appears without entrance movement.
- Simulator opens in interactive/stepped mode.
- No handwriting path animates.
- Mode selection still works.
- Pause/replay/skip remain understandable.

- [ ] **Step 5: Verify responsive layout**

Capture and inspect:

```text
375×812
430×932
768×1024
1024×768
1440×1000
```

Both `/en` and `/is`.

- [ ] **Step 6: Record findings**

Create `docs/qa/2026-06-07-redesign-audit.md` with the title `Ratatoskur Redesign QA`
and sections for Motion, Accessibility, Responsive, Links, and Residual Risks.
Record each observed issue alongside the concrete fix and verification result. If a
section has no findings, state the checks performed and that no defect was observed.
List only real remaining limitations under Residual Risks; write `None identified`
when the completed audit leaves none.

- [ ] **Step 7: Commit audit fixes**

```powershell
git add src docs/qa/2026-06-07-redesign-audit.md
git commit -m "polish: complete redesign motion and accessibility audit"
```

---

### Task 17: Final Browser And Quality Verification

**Files:**

- Modify only if verification finds defects
- Update: `README.md` if component/content locations changed materially

- [ ] **Step 1: Start a production server**

```powershell
npm run build
npm start
```

Use the in-app Browser plugin when available.

- [ ] **Step 2: Verify all routes**

Expected HTTP 200:

```text
/
/en
/is
/en/research
/is/research
/en/updates
/is/updates
/en/updates/2026-06-06-first-update
```

Expected 404:

```text
/is/updates/2026-06-06-first-update
/en/updates/not-a-real-post
```

- [ ] **Step 3: Click every visible link**

Verify:

- Header links.
- Mobile menu links.
- Logo.
- Hero CTAs.
- Research/Updates links.
- GitHub links.
- Language toggle.
- Article back link.
- Contact mailto.

No shared bare anchor may fail from a secondary page.

- [ ] **Step 4: Exercise the complete demo**

Verify:

1. Scroll into view starts sequence once.
2. Writing animates.
3. Reading confirmation appears.
4. Feedback appears.
5. Interaction unlocks.
6. Hint, Check, Reveal change content.
7. Pause/resume works.
8. Replay restarts ink.
9. Skip unlocks controls.
10. Drawing works.
11. Clear resets drawing.
12. No network request occurs during drawing or mode changes.

Use browser network inspection to confirm no simulator request reaches `/api` or an external AI endpoint.

- [ ] **Step 5: Verify contact**

Test:

- Inline invalid fields.
- Focus first error.
- Missing API key failure state.
- Mailto remains visible.
- Configured success if a test Resend key is available.

- [ ] **Step 6: Run the final command gate**

```powershell
npm test
npm run lint
npm run build
```

Expected:

- All tests pass.
- Zero application lint errors.
- Production build succeeds.

- [ ] **Step 7: Review final diff**

```powershell
git status --short
git diff --check
git diff --stat HEAD~1
```

Confirm:

- No temporary screenshots/profiles/logs.
- No Downloads paths in runtime code.
- No `.references` content staged.
- No `.cursor` or `skills-lock.json` staged unless explicitly intended.

- [ ] **Step 8: Commit final verification fixes**

```powershell
git add src public content messages README.md docs/qa package.json package-lock.json
git commit -m "feat: ship immersive Ratatoskur website redesign"
```

Only create this final commit if verification produced additional changes. Otherwise keep the prior focused commits as the completed implementation history.

---

## Plan Self-Review

### Specification Coverage

- Core brand preservation: Tasks 1, 3.
- Larger logo: Tasks 1, 3.
- Living Notebook visual system: Tasks 1, 8, 9.
- Full public-site redesign: Tasks 8–14.
- Faithful app simulator: Tasks 4–7.
- Guided then interactive behavior: Tasks 4, 6, 7.
- Scroll trigger, pause, replay, skip: Tasks 4, 6, 7.
- Local drawing only: Task 5.
- Deterministic illustrative responses: Tasks 4, 7.
- Purposeful motion and removal of Reveal: Tasks 1, 7, 15, 16.
- Real team portraits: Task 9.
- Reliable links and mobile menu: Tasks 2, 3, 17.
- Contact recovery: Task 10.
- Research and Updates redesign: Tasks 12, 13.
- Metadata and preserved routes: Task 14.
- Bilingual parity and claim boundaries: Task 11.
- Accessibility and reduced motion: Tasks 6, 7, 16.
- Performance and cleanup: Tasks 7, 15, 17.
- Browser and command verification: Tasks 16, 17.

### Type Consistency

- `DemoStage`, `DemoMode`, `DemoState`, and `DemoAction` are defined once in `demo-types.ts`.
- Internal mode remains `check_solution`; display labels remain Check / Fara yfir lausn.
- `homeAnchorHref` accepts only approved home anchors.
- `getPostBySlug` adds optional locale as its third argument consistently.
- Simulator controller returns the same operations consumed by `AppSimulator`.
- Drawing uses normalized `Point` values throughout.

### Explicit Non-Goals

- No live AI call from the simulator.
- No backend or iOS contract changes.
- No teacher dashboard.
- No app authentication.
- No CMS.
- No route slug changes.
- No logo redesign.
