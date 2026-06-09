# Ratatoskur Website Design System

Identity-preserving, derived from the shipped app: warm paper, espresso, orange, handwritten notebook work, and careful school-facing trust. The warm background is the product's own identity, not a generic AI cream reflex. Warmth is carried by accent, type, paper texture, and product imagery; contrast is kept strong.

## Color

- Brand: espresso `#3C1D11`, orange `#ED8228`, rust `#A45124`.
- Semantic tokens live in `src/styles/tokens.css`: `--brand-espresso`, `--brand-orange`, `--brand-rust`, `--paper`, `--paper-deep`, `--reading`, `--ink`, `--ink-soft`, `--line`, `--focus`, `--success`, `--danger`.
- Body text must meet WCAG AA contrast on its background; muted text still needs to remain readable.
- Strategy: restrained warm surface plus brown/orange accents, with committed moments in hero, simulator, and contact.

## Typography

- Display: Literata via `next/font/google`.
- Body/UI: Manrope via `next/font/google`.
- Both include `latin` and `latin-ext` subsets for Icelandic glyphs.
- Hero clamp max stays below 6rem; display letter spacing stays at or above `-0.04em`.
- Use `text-wrap: balance` on h1-h3 and `text-wrap: pretty` on prose.
- Keep body line length near 65-75ch.

## Material And Motion

- Primary materials: paper, ink, recognition lens, response layer.
- Liquid logo references remain research material only; the hero uses the static brand mark and product preview.
- Liquid glass references are adapted as a scoped simulator reading/feedback material, not glassmorphism by default.
- React Three Fiber is deferred until there is a real product-relevant 3D scene to justify its dependency and QA cost.
- Animate only transform, opacity, filter, clip-path, and background position where appropriate. Avoid layout-property animations.
- UI transitions stay under 300ms. Larger scene entrances can use `--duration-scene`.
- Motion must enhance visible content after hydration. Content is never hidden by default.
- Every new moving effect needs a reduced-motion fallback.

## Shape

- Card and panel radii stay in the 12-18px range through `--radius-md` and `--radius-lg`.
- Device frames may use the larger `--radius-device`.
- Avoid ghost-card treatment: do not pair a decorative 1px border with a large soft shadow unless the shadow communicates real elevation.
- Buttons can be pill or medium-radius depending on context, but the rule must be consistent inside each component.

## Accessibility

- Preserve keyboard focus visibility.
- Preserve forced-colors support.
- Preserve contact form labels, validation, and fallback email behavior.
- No horizontal overflow on mobile.
- No public UI copy uses em dashes or generic marketing buzzwords.

## Honored Bans

No gradient text, no side-stripe borders, no glassmorphism as a page-wide default, no repeated eyebrow/numbered scaffolding, no mascot animation, no generic AI purple/blue glow, and no route or navigation changes without explicit approval.
