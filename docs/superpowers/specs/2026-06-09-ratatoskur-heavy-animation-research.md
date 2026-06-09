# Ratatoskur Heavy Animation Research

**Date:** 2026-06-09
**Status:** Direction selected

## Decision

Proceed with a cinematic notebook landing scene.

The homepage should open on a large notebook/paper moment where the visitor sees the product idea unfold through scroll and scene choreography:

- A blank student page becomes active.
- A math problem and handwritten work appear.
- A recognition layer scans the written work.
- Hint, Check, and Reveal become the visible feedback choices.
- The existing website content follows naturally after the opening scene.

This direction uses heavy animation for a new first impression, not only to improve existing simulator details.

Do not implement the 3D product-object version in this pass. Keep it as a future test track.

## Context

The site currently uses `motion` with React 19 and Next 16. The strongest animated surfaces already in the product are:

- Homepage hero product preview.
- Simulator notebook, writing surface, recognition lens, confirmation sheet, and response card.
- Section reveal choreography through `Reveal`.
- Method timeline and content-page pipeline traces.

The next animation pass should deepen the product metaphor: handwritten ink, recognition, notebook paper, response layers, and a possible product-grade 3D device/notebook scene. It should not add generic decoration or bring back the removed glass/logo mark.

## Current Project Stack

Installed now:

- `motion@12.40.0`
- `next@16.2.7`
- `react@19.2.4`

Candidate npm versions checked on 2026-06-09:

- `animejs@4.4.1`
- `@rive-app/react-webgl2@4.29.0`
- `@rive-app/react-canvas@4.29.0`
- `@react-three/fiber@9.6.1`
- `three@0.184.0`
- `@react-three/drei@10.7.7`
- `@lottiefiles/dotlottie-react@0.19.4`
- `gsap@3.15.0`
- `iconsax-react@0.0.8`
- `iconsax-reactjs@0.0.8`
- `react-iconsax-icons@1.0.1`

## Candidate Read

### Motion

Keep Motion as the default React UI animation layer. It already fits the repo and is best for component presence, layout transitions, gestures, hover/tap states, section reveals, and state-driven cards.

Do not replace Motion with Anime.js for normal React UI. Use Anime.js only when timeline control over SVG/DOM drawing is the primary job.

### Anime.js

Best first new dependency.

Use it for deterministic DOM/SVG sequences:

- Handwritten ink drawing in `ScriptedInk`.
- A real timeline for "write, scan, confirm, respond" instead of disconnected CSS keyframes.
- SVG path drawing, staggered line appearance, subtle paper annotations, and recognition sweeps.
- Demo timeline pause/play control if we want animation state to obey manual navigation more tightly.

Avoid using it for simple button hover, layout changes, or card enter/exit motion where Motion is already better integrated with React.

### Jitter

Treat Jitter as an authoring/export tool, not a runtime animation library.

Good uses:

- Create a short authored loop for a hero, updates page, or launch visual.
- Export MP4/WebM for video-style brand motion.
- Export Lottie for simple scalable vector loops.

Weak uses:

- Stateful simulator UI.
- Per-step product interactions.
- Anything that must react to the demo controller without custom runtime glue.

### Rive

Best candidate for interactive 2D authored animation if we want a real art asset with states.

Good uses:

- Notebook/pen/recognition state machine.
- A small interactive hero object that reacts to hover, scroll, or demo mode.
- Canvas-rendered vector animation with explicit play, pause, and state inputs.

Cost:

- Requires creating or sourcing a `.riv` asset.
- Needs a stable wrapper component because the runtime owns a canvas.
- Should have a static fallback and reduced-motion behavior.

### React Three Fiber

Best candidate for true 3D, but only if the design commits to a real product scene.

Good uses:

- Full-bleed or section-level 3D notebook/device scene.
- Subtle pointer tilt, page depth, pencil, lighting, or camera parallax.
- A visual that communicates "handwritten work read by AI" better than the flat preview.

Cost:

- Adds `three`, `@react-three/fiber`, and probably `@react-three/drei`.
- Needs a client-only island, dynamic loading, static fallback, reduced-motion behavior, and browser screenshot QA.
- The installed `react-three-fiber` skill is json-render/R3F guidance, useful for the 3D track but not a reason to force 3D into this pass.

### Iconsax

Use only if we deliberately choose its icon style.

Good uses:

- Pen, eraser, ruler, scan, play, pause, previous, next, and feedback-mode icons.
- Replacing text-only simulator tool pills with recognizable controls.

Risk:

- The React package landscape is fragmented (`iconsax-react`, `iconsax-reactjs`, `react-iconsax-icons`), while the official Iconsax site also supports downloading selected SVG/code directly.
- For this repo, the safer approach is likely downloading a small chosen icon set or using inline SVG components, not adding a broad icon package immediately.

### GSAP

Powerful but not the first pick here.

It is strongest for scroll-linked/pinned storytelling and complex timeline choreography. Since the user already likes Anime.js and the site already has Motion, GSAP should stay as a comparison point unless we plan a large scroll-driven narrative section.

### Lottie / dotLottie

Useful playback format for Jitter or other authored motion.

Good uses:

- Lightweight exported vector loops.
- Non-interactive illustration and marketing motion.

Weak uses:

- Product UI states that need tight React/demo-controller integration.
- Complex text/mask animation unless the exporter supports the exact features.

## Recommended Direction

### Phase 1: Cinematic Notebook Prologue

Add Anime.js and use it narrowly inside a new landing-scene animation.

Targets:

- Add a first-viewport notebook scene to the homepage hero.
- Use Anime.js for SVG/path drawing, timeline control, recognition sweep, and mode reveal choreography.
- Keep `motion/react` for React-driven presence, cards, CTAs, and section reveals.
- Let visitors scroll normally. The site should not be trapped behind an intro gate.

This is the highest value path because it makes the first impression feel product-specific rather than simply adding polish to existing components.

### Phase 2: Icon Controls

Improve the demo controls and notebook toolbar with real icon affordances.

Preferred approach:

- Choose 6 to 10 icons only.
- Start with local SVG components or explicit copied SVGs.
- Add an icon package only if the selected package is proven tree-shakeable and the license/package quality is acceptable.

### Future Test Track: Interactive 2D Or 3D Prototype

Choose one, not both, after the cinematic notebook has shipped and been reviewed.

Rive if the goal is an authored, stateful 2D notebook object.

React Three Fiber if the goal is a real 3D notebook/device scene that becomes a first-viewport brand/product signal.

Jitter or dotLottie if the goal is a non-interactive authored brand loop.

Do not add Rive, Lottie, and R3F together in one pass. That would create implementation and QA overhead before the creative direction is proven.

## Specific Repo Fit

Best immediate insertion points:

- `src/components/home/Hero.tsx`
- `src/components/home/Home.module.css`
- New client leaf for the cinematic notebook animation.
- Optional shared SVG/path helpers if the same ink language later moves into the simulator.

Best experiments:

- Anime.js `CinematicNotebookScene` client component inside the hero.
- SVG stroke-dash drawing for the student's written work.
- Scroll-aware scene progress that still leaves content visible by default.
- Static reduced-motion version that shows the finished scene.
- Optional isolated `HeroNotebookScene3D` prototype only if we choose the R3F test track later.

## Guardrails

- Keep `prefers-reduced-motion` support for every new moving effect.
- Animate transform, opacity, filter, clip-path, SVG stroke dash, and canvas state. Avoid layout animation loops.
- Avoid decorative loops that compete with reading the product demo.
- Do not reintroduce the removed glass/liquid logo.
- Keep heavy animation client-only and lazy where possible.
- Before code changes, read the relevant Next docs under `node_modules/next/dist/docs/` as required by `AGENTS.md`.
- After frontend changes, verify with Browser screenshots on desktop and mobile. For R3F, also verify the canvas is nonblank and correctly framed.

## Sources

- Anime.js documentation: https://animejs.com/documentation/
- Motion for React documentation: https://motion.dev/docs/react
- Rive React runtime documentation: https://rive.app/docs/runtimes/react/react
- Jitter export documentation: https://help.jitter.video/en/articles/5369843-export-your-work
- dotLottie player quick start: https://docs.lottiefiles.com/en/runtimes/overview/quick-start
- React Three Fiber introduction: https://r3f.docs.pmnd.rs/getting-started/introduction
- Iconsax getting started: https://docs.iconsax.io/getting-started
- GSAP ScrollTrigger documentation: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
