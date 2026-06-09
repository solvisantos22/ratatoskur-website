# Machine Wipe Handoff: Ratatoskur Website

Date: 2026-06-09

This file is the durable handoff for the current Ratatoskur website work before the local machine wipe. It is meant to survive through Git and OneDrive even if the chat history, Codex environment, global skills, and local caches are lost.

## Repository State

- Repo path before wipe: `C:\Users\SolviSantos\OneDrive - evolv.is\Desktop\Personal\website`
- Branch: `main`
- Remote: `https://solvisantos22@github.com/solvisantos22/ratatoskur-website.git`
- Latest implementation commit before this handoff file: `51f6dcf` (`WIP snapshot before machine wipe: cinematic notebook + material motion`)
- The repo was clean before adding this handoff file.

## Current Stack

- Next.js `16.2.7`
- React `19.2.4`
- TypeScript `~5.8.3`
- CSS Modules plus project tokens in `src/styles/tokens.css`
- Existing animation dependency: `motion@12.40.0`
- New animation dependency added in this pass: `animejs@^4.4.1`

No React Three Fiber, Three.js, Rive, Jitter runtime, Lottie runtime, or Iconsax dependency was added.

## What We Did

### 1. Preserved Agent/Skill Context

Created `docs/AGENT_SKILLS.md` as the portable source of truth for the skills and references used in this repo.

Important notes from that file:

- Project-scoped skills live under `.agents/`, but `.agents/` is gitignored.
- Global skills to reinstall on a new machine are listed as `npx skills add ...` commands.
- `ui-ux-pro-max` is currently only a catalog metadata stub in the installed Open Design copy.
- The liquid-logo and liquid-glass repos are visual references, not drop-in dependencies.
- React Three Fiber is a future track only, not part of the current shipped pass.

### 2. Material Motion Pass

Added documentation:

- `docs/superpowers/specs/2026-06-09-ratatoskur-material-motion.md`
- `docs/superpowers/plans/2026-06-09-ratatoskur-material-motion.md`

Implemented and fixed:

- Removed the decorative glass/liquid logo treatment from the hero after visual review.
- Kept the header logo static.
- Scoped liquid-glass-style material to the simulator only, as a web approximation.
- Added the simulator recognition lens inside the notebook writing surface.
- Restyled confirmation and response sheets as scoped reading/feedback layers.
- Changed simulator timeline progress from layout `width` animation to `transform: scaleX(...)`.
- Preserved route, nav, contact form, localization, and CTA structure.

### 3. Demo And Copy Fixes

Addressed the issues called out during review:

- The Hint mode card no longer has excessive headroom.
- The static landing notebook answer is centered instead of pushed left.
- The unwanted glass logo treatment was removed.
- Public copy no longer uses the disliked classroom/mascot phrasing.
- Manual demo interactions now pause autoplay, including previous/next and mode changes.
- Final guided state pauses instead of continuing to advance.
- Demo steps 6 and 7 now show visible reading/confirmation states.
- `ReadingConfirmation` was simplified so it renders reliably after rewinding.

Relevant files:

- `src/components/simulator/demo-machine.ts`
- `src/components/simulator/useDemoController.ts`
- `src/components/simulator/NotebookShell.tsx`
- `src/components/simulator/ReadingConfirmation.tsx`
- `src/components/simulator/DemoControls.tsx`
- `src/components/simulator/AppSimulator.module.css`

### 4. Heavy Animation Research

Added:

- `docs/superpowers/specs/2026-06-09-ratatoskur-heavy-animation-research.md`

Research conclusion:

- Use a cinematic notebook scene now.
- Use Anime.js for SVG/path drawing and timeline choreography.
- Keep Motion for normal React UI state and component presence.
- Keep these as future test tracks:
  - React Three Fiber for a real 3D notebook/device scene.
  - Rive for an authored 2D notebook state-machine object.
  - Jitter or dotLottie for a non-interactive exported brand loop.

### 5. Cinematic Notebook Landing Scene

Added:

- `docs/superpowers/plans/2026-06-09-ratatoskur-cinematic-notebook.md`
- `src/components/home/CinematicNotebookScene.tsx`

Modified:

- `src/components/home/Hero.tsx`
- `src/components/home/Home.module.css`
- `package.json`
- `package-lock.json`

What changed:

- The homepage now opens with a larger cinematic notebook scene.
- The scene starts as a blank notebook page.
- As the user scrolls, Anime.js controls:
  - problem card reveal
  - SVG handwriting stroke drawing
  - recognition scan movement
  - feedback mode reveal
  - feedback response reveal
- The hero copy and CTAs remain visible; the user is not trapped behind an intro gate.
- The animation is isolated to a `'use client'` leaf.
- Reduced motion skips the timeline and shows the completed scene instead of a blank state.
- Mobile layout was tuned so the headline, lead, CTAs, and scene do not overflow.

### 6. Source Guards And Tests

Expanded `src/lib/public-ui-copy.test.ts` to guard:

- no discarded public copy
- no broken update-card treatment
- reveal variants remain available
- reveal hydration remains stable
- simulator timeline uses transform, not width
- design docs match the actual stack
- no React Three Fiber / Rive / Lottie / Iconsax deps in this pass
- Anime.js is present for the cinematic notebook pass
- no public UI em dashes
- no discarded classroom/mascot phrasing
- no removed hero glass logo treatment
- demo reading steps remain visible after rewinding
- no negative letter spacing in public UI CSS
- cinematic notebook animation stays isolated as a client leaf

## Verification

These commands passed after the cinematic notebook implementation:

```powershell
npm test
npm run lint
npm run build
```

Results:

- `npm test`: 17 test files passed, 84 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed with Next.js `16.2.7` and Turbopack.

Visual QA:

- Headless Edge desktop render checked at `1440x1100`.
- Headless Edge mobile render checked at `390x844`.
- Desktop and mobile reports showed:
  - no horizontal overflow
  - no hero copy/scene overlap
  - cinematic notebook visible and framed
  - top state starts with blank notebook page
  - mobile headline and lead wrap cleanly

Note:

- `npm install animejs@^4.4.1` reported 2 moderate audit findings in the dependency tree.
- `npm audit fix --force` was intentionally not run because it can introduce unrelated breaking changes.

## How To Restore On A Fresh Machine

1. Clone the repo:

```powershell
git clone https://github.com/solvisantos22/ratatoskur-website.git
cd ratatoskur-website
```

2. Install dependencies:

```powershell
npm ci
```

3. Reinstall useful global skills if needed:

```powershell
npx -y skills add nexu-io/open-design@ui-ux-pro-max -g -y
npx -y skills add patricio0312rev/skills@framer-motion-animator -g -y
npx -y skills add leonxlnx/taste-skill@design-taste-frontend -g -y
npx -y skills add vercel-labs/json-render@react-three-fiber -g -y
```

4. Run verification:

```powershell
npm test
npm run lint
npm run build
```

5. Start the site:

```powershell
npm run dev
```

Then open `http://localhost:3000/en`.

## What Is Next

Immediate next steps:

- Pull this pushed state on the new machine and run `npm ci`.
- Open `/en` in a real browser and review the cinematic notebook scene by hand.
- Tune scroll pacing if the reveal feels too early or too late in a real browser.
- Decide whether the first scene should stay as a scroll-progress narrative or become a shorter autoplay-on-load scene.
- Decide whether to improve the blank start with a subtle prompt or micro-detail without making it feel like a loading gate.

Possible future animation tests:

- R3F/Three.js 3D notebook or device scene, only if a full product-relevant 3D direction is approved.
- Rive authored 2D notebook object with state-machine inputs.
- Jitter/dotLottie exported loop for a non-interactive brand moment.
- Icons only if a specific icon family and use case is chosen.

Guardrails to keep:

- Do not reintroduce the removed glass/liquid hero logo.
- Do not add decorative page-wide glassmorphism.
- Do not add R3F/Rive/Lottie/Jitter/Icon dependencies casually.
- Preserve reduced-motion behavior.
- Preserve route, nav, contact, and bilingual structure.
- Before changing Next code, read the relevant local docs under `node_modules/next/dist/docs/`, per `AGENTS.md`.
