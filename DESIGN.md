# Ratatoskur website — Design system

Identity-preserving, derived from the shipped app (warm cream/espresso/orange). The warm background is the product's OWN identity, NOT a generic AI "cream" reflex — warmth is carried by accent, type, and imagery; contrast is kept strong.

## Color (OKLCH)
- Brand: espresso `#3C1D11`, orange `#ED8228`, rust `#A45124`.
- Semantic tokens (named semantically, never `--cream`/`--parchment`): `--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-2`, `--muted`, `--accent`, `--accent-2`, `--on-accent`, `--cta`, `--cta-hover`. See `src/styles/tokens.css`.
- Body text ≥ 4.5:1 contrast on its background (large/bold ≥ 3:1); muted text still ≥ 4.5:1.
- Strategy: restrained (warm neutral surface + brown/orange accents), with committed moments (hero, contact).

## Typography
- Display: Fraunces; body/UI: Inter (both with Icelandic glyphs). Two families total.
- Hero clamp() max ≤ 6rem; display letter-spacing ≥ -0.04em; `text-wrap: balance` on h1–h3, `pretty` on prose; line length 65–75ch.
- Eyebrow used sparingly (hero only). Numbered markers only for the real 3-step "How it works".

## Shape & motion
- Card radii 12–16px (no over-rounding). No ghost-card (1px border + ≥16px shadow). Semantic z-index.
- Motion: animate only transform/opacity; custom ease-out curves (no ease-in, no bounce); UI transitions < 300ms; reveals enhance an already-visible default (never gate visibility); full `prefers-reduced-motion` support. No mascot/character animation.

## Honored bans
No gradient text, no side-stripe borders, no glassmorphism-by-default, no eyebrow/numbered scaffolding on every section, no em dashes in site copy, no marketing buzzwords.
