# Ratatoskur UI Elevation Design Spec

**Date:** 2026-06-08
**Status:** Approved direction, pending written spec review
**Author:** Solvi Santos with Codex

## 1. Goal

Elevate the current Ratatoskur website without resetting the parts that are already working. The homepage hero and notebook demo remain the foundation. The rest of the site should become smoother, cleaner, more readable, and more memorable through stronger layout composition, better scroll rhythm, and purposeful motion.

This is an upgrade pass, not a new brand direction.

## 2. Preserved Surfaces

The following areas stay structurally intact:

- Homepage hero and first landing impression.
- Notebook demo concept, sequence, and core app-like behavior.
- Logo, route structure, bilingual setup, and warm espresso-orange brand palette.
- Primary site purpose: explain Ratatoskur to school decision-makers and make contact easy.

Small spacing or integration tweaks are allowed only when needed to make adjacent sections feel coherent.

## 3. Problems To Fix

1. The Updates list has a broken visual treatment: each entry uses a hard brown strip across roughly one third of the card, while the rest is a light surface. It reads like a rendering mistake.
2. Sections below the demo are too conservative. Mode stories, Icelandic context, team, and contact rely on simple card or split-panel patterns.
3. Research and Updates are better than before but still not visually strong enough for a brand site.
4. Motion exists, but it is mostly generic reveal behavior plus a few line-drawing effects. The site needs clearer scroll storytelling without becoming janky or distracting.
5. The page should feel less cluttered: fewer nested boxes, stronger grouping, better rhythm, and more use of negative space.

## 4. Design Direction

Reading this as an identity-preserving redesign of an AI math notebook brand site for school decision-makers, with warm, careful, app-adjacent design language. The target is higher visual variance and richer scroll choreography while keeping the product credible and readable.

Design dials:

- Visual variance: 7 out of 10. More distinctive than a standard landing page, but not chaotic.
- Motion intensity: 6 out of 10. Noticeable scroll and state motion where it helps narrative, not constant animation.
- Visual density: 4 out of 10. Airier than the current page, with clearer section pacing.

Motion weighting:

- Primary: Jakub Krehel lens, for production polish and subtle refinement.
- Secondary: Jhey Tompkins lens, for selective playful CSS and scroll-driven moments.
- Emil Kowalski lens as a restraint gate, especially for high-frequency interactions and accessibility.

## 5. Page-Level Changes

### Homepage After The Notebook

The hero and notebook demo stay as-is. Below them:

- Rework the mode stories into a larger "student help system" composition instead of three equal columns. Hint, Check, and Reveal should feel connected to the notebook workflow.
- Refine the method section into a scroll narrative that reads as a real student sequence: write, ask, keep working, check or reveal.
- Simplify the Icelandic context section so it feels like a grounded product stance, not a list beside a large dark card.
- Tighten team cards further so portraits and copy feel intentional, with no excess headroom.
- Make contact feel like a clear final action, not just a form card.

### Research

The Research page should feel like an evaluation board. It should communicate that Ratatoskur separates reading handwriting, confirming uncertainty, and responding by mode.

Changes:

- Keep the current research content and route.
- Improve the visual board so it feels more like a product methodology artifact.
- Reduce card clutter in the article area.
- Use scroll motion to clarify progression, not to decorate every paragraph.

### Updates

The Updates page should become a polished product journal.

Changes:

- Remove the brown one-third split from update entries.
- Use full-surface readable journal entries with date metadata as a compact marker.
- Add better hover, focus, and reveal states.
- Preserve post routes and MDX content.

## 6. Motion System

Extend the existing `Reveal` primitive instead of adding scattered one-off animation code.

New or refined variants:

- `rise`: default restrained entrance.
- `lift`: stronger entrance for major sections.
- `sheet`: soft page/surface entrance.
- `focus`: opacity, translate, and blur for content that should come into attention.
- `trace`: line or rule reveal for process/timeline elements.

Rules:

- Content must be visible by default. Motion enhances after hydration and intersection.
- Reduced motion must land in the final readable state with no large transform, parallax, or looping motion.
- Animate transform, opacity, filter, and clip-path only where appropriate.
- Avoid scroll effects that bind too tightly to scroll speed. Prefer trigger-then-play patterns where possible.
- No decorative continuous loops.

## 7. CSS And Component Strategy

Keep the implementation close to existing patterns:

- Continue using CSS modules and semantic tokens.
- Add small reusable section classes only where they reduce duplication.
- Do not introduce a large animation dependency unless the existing CSS and `motion/react` setup cannot express the effect cleanly.
- Avoid raw visual hacks such as hard percentage color strips, side-stripe borders, excessive shadows, or repeated identical cards.
- Keep responsive behavior explicit for mobile, tablet, and desktop.

## 8. Accessibility And Quality Gates

The finished pass must preserve or improve:

- Text contrast at WCAG AA.
- Keyboard focus visibility on links and form controls.
- Reduced-motion support.
- No horizontal overflow on small screens.
- Stable layout with no large cumulative shift.
- Heading hierarchy and route metadata.

The update entries must remain semantic links inside a list. The contact form must keep labels, validation, and fallback email behavior.

## 9. Tests And Verification

Implementation verification must include:

- `npm test`
- `npm run lint`
- `npm run build`
- HTTP checks for `/en`, `/en/research`, and `/en/updates`
- Source-level checks for removed banned copy and no return of the broken update-card split treatment

Browser MCP is not required for completion because it has been unreliable in this local setup. If a browser session works, use it as an additional visual check, not as the only verification.

## 10. Out Of Scope

- Reworking the notebook demo behavior in this pass.
- Changing URL structure or navigation labels.
- Adding new external imagery.
- Adding analytics, CMS, or backend integrations.
- Changing the core brand palette or logo.

## 11. Success Criteria

The pass is successful when:

- The initial screen and notebook still feel like the same Ratatoskur site.
- The rest of the website feels more crafted, smoother, and more readable.
- Updates entries no longer have the broken one-third brown treatment.
- Research and Updates look like intentional product surfaces, not default content pages.
- Motion improves progression and hierarchy without distracting from reading.
- Verification passes and the work is committed and pushed.
