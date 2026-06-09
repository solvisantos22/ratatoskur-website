# Ratatoskur Material Motion Implementation Plan

> **For agentic workers:** implement task-by-task. Keep checkbox state current. Preserve routes, nav labels, form field names, and the current bilingual structure.

**Goal:** Add a product-material layer using scoped liquid glass references, fix documentation mismatches, and remove the known layout-cost timeline animation.

**Architecture:** Keep Next.js App Router server components by default. Add client behavior only in existing simulator client leaves. Use CSS Modules, existing tokens, and `motion/react`.

**Tech Stack:** Next.js 16.2.7, React 19.2.4, TypeScript, CSS Modules, `motion/react`, Vitest, ESLint.

---

## Task 1: Documentation And Superpowers Ledger

**Files:**
- Add: `docs/superpowers/specs/2026-06-09-ratatoskur-material-motion.md`
- Add: `docs/superpowers/plans/2026-06-09-ratatoskur-material-motion.md`
- Modify: `DESIGN.md`
- Modify: `docs/AGENT_SKILLS.md`

- [x] Create this Superpowers spec and plan.
- [x] Update `DESIGN.md` to reflect Literata and Manrope.
- [x] Update the skill inventory with the current implementation stance: `ui-ux-pro-max` catalog stub, liquid repos as references, R3F deferred unless a real 3D scene is approved.

## Task 2: Hero Logo Treatment

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/Home.module.css`

- [x] Remove the decorative hero material mark after visual review.
- [x] Keep the hero text stack to four elements or fewer before CTAs.
- [x] Keep the header logo static.

## Task 3: Simulator Recognition Glass

**Files:**
- Modify: `src/components/simulator/NotebookShell.tsx`
- Modify: `src/components/simulator/AppSimulator.module.css`
- Modify: `src/components/simulator/DemoControls.tsx`

- [x] Add a recognition lens inside the writing surface when handwriting is being checked, confirmed, or responded to.
- [x] Restyle confirmation and response sheets as scoped web-glass approximations with fallback backgrounds.
- [x] Change timeline progress from `width` animation to `transform: scaleX(...)`.
- [x] Preserve all existing labels, aria behavior, and simulator state transitions.

## Task 4: Responsive And Source Guards

**Files:**
- Modify: `src/lib/public-ui-copy.test.ts`

- [x] Add source-level guards for the timeline transform behavior and documentation mismatch.
- [x] Confirm no copy or CSS introduces em-dash usage in public UI strings.
- [x] Confirm no accidental R3F dependency is added in this pass.

## Task 5: Verification

- [x] Run `npm test`.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Capture desktop and mobile screenshots for `/en`.
- [x] Check final git status and report intentional files.

## Future Track

React Three Fiber remains a future optional track. Use it only if a later plan defines a full-bleed, product-relevant 3D notebook/device scene and includes canvas pixel checks across desktop and mobile.
