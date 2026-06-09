# Ratatoskur Cinematic Notebook Implementation Plan

> **For agentic workers:** implement task-by-task. Keep checkbox state current. Preserve routes, nav labels, form field names, bilingual structure, and the existing contact workflow.

**Goal:** Replace the static-feeling homepage first impression with a cinematic notebook scene that introduces Ratatoskur through blank paper, handwritten work, recognition, and feedback modes.

**Decision:** Use a cinematic notebook scene for this pass. Keep the 3D product object, Rive state-machine object, and Jitter/dotLottie brand loop as future test tracks.

**Architecture:** Keep Next.js App Router server components by default. Add a client-only animation leaf inside the hero. Use CSS Modules, existing tokens, existing `motion/react`, and Anime.js only for timeline/SVG choreography.

**Tech Stack:** Next.js 16.2.7, React 19.2.4, TypeScript, CSS Modules, `motion/react`, Anime.js, Vitest, ESLint.

---

## Task 1: Framework And Dependency Grounding

**Files:**
- Read: `node_modules/next/dist/docs/`
- Modify: `package.json`
- Modify: `package-lock.json`

- [x] Read the relevant Next 16 docs before code changes, per `AGENTS.md`.
- [x] Add `animejs` as the only new runtime dependency for this pass.
- [x] Do not add React Three Fiber, Rive, Jitter runtime, Lottie runtime, or an icon package in this pass.

## Task 2: Cinematic Hero Scene

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/Home.module.css`
- Add: `src/components/home/CinematicNotebookScene.tsx`

- [x] Build a client leaf that renders the animated notebook scene.
- [x] Scene beats: blank paper, problem, handwritten work, recognition scan, mode choices, feedback response.
- [x] Use Anime.js for SVG stroke drawing and scene sequencing.
- [x] Keep the primary CTA and secondary CTA visible or quickly available. Do not trap visitors behind an intro gate.
- [x] Ensure the scene reads clearly without the removed glass/liquid logo.

## Task 3: Reduced Motion And Accessibility

**Files:**
- Modify: `src/components/home/CinematicNotebookScene.tsx`
- Modify: `src/components/home/Home.module.css`

- [x] Respect `prefers-reduced-motion`.
- [x] Reduced-motion state should show the completed notebook scene without scroll or timeline dependency.
- [x] Keep decorative animation hidden from assistive tech.
- [x] Preserve page heading semantics and CTA order.
- [x] Avoid text overlap on mobile and desktop.

## Task 4: Future Test Track Notes

**Files:**
- Modify: `docs/superpowers/specs/2026-06-09-ratatoskur-heavy-animation-research.md`
- Modify: `docs/AGENT_SKILLS.md`

- [x] Record R3F as a future 3D notebook/device test, not part of this pass.
- [x] Record Rive as a future authored 2D notebook state-machine test.
- [x] Record Jitter/dotLottie as a future non-interactive brand-loop/export test.

## Task 5: Verification

- [x] Run `npm test`.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Capture desktop and mobile screenshots for `/en`.
- [x] Verify animation is visible, nonblank, and framed correctly.
- [x] Verify reduced motion does not leave the hero blank.
- [x] Check final git status and report intentional files.
