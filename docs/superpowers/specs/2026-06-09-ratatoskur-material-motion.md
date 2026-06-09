# Ratatoskur Material Motion Design Spec

**Date:** 2026-06-09
**Status:** Approved for implementation
**Author:** Solvi Santos with Codex

## 1. Goal

Add a more memorable material and motion layer to the Ratatoskur website without changing the information architecture, routes, contact workflow, or core product story.

This pass uses the prior probe findings:

- The site already has a strong notebook and simulator foundation.
- The next lift should come from product-material metaphors: paper, ink, recognition lens, and response layer.
- Liquid/logo and liquid-glass references should be adapted deliberately, not copied as generic effects.
- Documentation should match the code that is actually shipping.

## 2. Design Read

Reading this as an identity-preserving brand-site overhaul for school decision-makers, with a warm notebook/product-demo language, leaning toward native CSS modules plus existing `motion/react` rather than a new design system.

Design dials:

- Visual variance: 7 out of 10.
- Motion intensity: 6 out of 10.
- Visual density: 4 out of 10.

## 3. Materials

### Liquid Logo

Use `collidingScopes/liquid-logo` as research material only. The hero keeps the static brand mark and product preview; no decorative glass/liquid logo is shipped.

Implementation direction:

- Add a masked, liquid-metal mark in the hero.
- Use the existing `ratatoskur-logo.svg` as the shape source.
- Animate shimmer with CSS background movement only.
- Stop animation under `prefers-reduced-motion: reduce`.
- Keep the header logo static and fast.

### Liquid Glass

Use `dashersw/liquid-glass-js` as conceptual reference for the simulator recognition and response layer.

Implementation direction:

- Add a glass-like recognition lens inside the notebook writing surface.
- Make confirmation and response sheets feel like the system is reading handwriting, not like generic frosted cards.
- Use `backdrop-filter` with solid-fill fallbacks.
- Scope the effect to the simulator, not the whole page.

### React Three Fiber

Do not add React Three Fiber in this pass. The installed skill is json-render-specific, and a 3D scene would add dependency and QA cost without a clear product need.

R3F remains a future track only if the site needs a real 3D notebook/device scene with measurable value over the current simulator.

## 4. Motion

Use the existing `motion/react` dependency and CSS transitions.

Rules:

- Animate `transform`, `opacity`, `filter`, and `clip-path`; avoid layout properties.
- Keep high-frequency UI under 300ms.
- Keep content visible by default.
- Use reduced-motion fallbacks for every new moving effect.
- Do not add looping decorative motion beyond a subtle hero material shimmer.

## 5. Mismatch Fixes

Fix these mismatches:

- `DESIGN.md` must reflect the actual fonts: Literata and Manrope.
- `docs/AGENT_SKILLS.md` must state that `ui-ux-pro-max` is currently a catalog stub and that R3F is deferred for this pass.
- The simulator timeline must stop animating `width`.
- Any new documentation must describe Liquid Glass as a web approximation, not an official Apple web material.

## 6. Acceptance Criteria

- Homepage hero includes a liquid-material brand mark without harming readability.
- Simulator includes a recognition lens and glass response material that reinforce the handwriting-reading story.
- Timeline progress animates via transform rather than width.
- `DESIGN.md` and skill inventory match the implementation.
- No route, nav label, form field, or localization structure changes.
- Tests pass.
- Lint and build either pass or any blocker is documented clearly.
