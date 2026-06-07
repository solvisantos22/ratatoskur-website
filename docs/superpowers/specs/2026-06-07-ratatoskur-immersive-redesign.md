# Ratatoskur Immersive Website Redesign

**Date:** 2026-06-07  
**Status:** Approved design, pending written-spec review  
**Scope:** Full public website redesign  

## 1. Objective

Redesign the Ratatoskur website into a distinctive, immersive product experience that demonstrates what the app can do instead of describing it primarily through text and screenshots.

The redesign preserves the core Ratatoskur identity:

- The existing diamond logo
- Espresso brown, Ratatoskur orange, and warm notebook colors
- The recognizable visual language of the iOS app
- English and Icelandic support

Everything around that core may change: typography, layout, motion, navigation, page composition, responsive behavior, and product storytelling.

The result should feel premium and carefully crafted first, with selective playfulness and theatrical scale. It must remain credible to school decision-makers without becoming restrained, generic, or forgettable.

## 2. Audience And Outcome

Audience priority:

1. School administrators and decision-makers
2. Teachers and students
3. Research and funding partners

Primary visitor outcome:

- Understand Ratatoskur quickly
- See the real product behavior
- Trust that the team understands the educational and technical problem
- Start a conversation about a school pilot

The website remains a public project hub, not an app portal. It does not provide accounts, student data, or live tutoring.

## 3. Design Direction

### Living Notebook

The main direction is **Living Notebook**:

- Warm, tactile, and rooted in handwritten work
- Premium visual craft rather than conventional edtech styling
- The app interface is the primary visual object
- The page unfolds like a worked solution
- Notebook paper, ink, app surfaces, and geometric brand forms create the material language

The direction borrows selected qualities from the more playful **Classroom Theatre** concept:

- Oversized display moments
- Committed orange sections
- Controlled overlap and asymmetry
- Occasional delightful visual surprises
- More expressive scale than the current restrained site

The design must not become childish, cartoon-heavy, or visually detached from the shipped app.

### Design Dials

- **Design variance:** 8/10
- **Motion intensity:** 7/10 for the product demonstration, 3/10 elsewhere
- **Visual density:** 5/10

## 4. Visual System

### Logo

The real SVG logo remains unchanged.

The current logo treatment is too small. The redesign gives the mark and wordmark clear visual authority:

- Larger desktop and mobile presentation
- Correct intrinsic proportions and clear space
- A strong home link
- No tiny favicon-like use in the main navigation
- No distortion or recoloring outside the existing brand palette

### Color

Core palette:

- Espresso `#3C1D11`
- Orange `#ED8228`
- Rust `#A45124`
- Warm notebook background near `#EFE7D6`
- Warm white reading surfaces

Color behavior:

- Espresso provides structure, depth, and technical credibility
- Orange is used for committed brand moments, not scattered decoration
- Warm paper tones connect the website to the notebook experience
- Dark sections use sufficient line-height and contrast
- Semantic design tokens remain the source of truth

No gradient text, generic purple AI gradients, or timid beige-only presentation.

### Typography

Typography should feel warm, intelligent, and alive.

Requirements:

- A more distinctive display face may replace Fraunces after testing
- Full Icelandic glyph support is mandatory
- Interface and app-simulator text use a neutral, highly readable UI sans
- Display type uses confident scale and committed hierarchy
- Body text remains quiet and readable
- No generic editorial-magazine styling
- No repeated tiny uppercase labels as section scaffolding
- Two font families maximum unless a third is required for simulated handwriting

The implementation plan must include a font comparison before changing the current families.

### Layout

- Use varied section pacing rather than identical centered blocks
- Allow asymmetry, overlap, and controlled grid breaks
- Keep one dominant idea per viewport where practical
- Use generous fluid spacing on larger screens
- Preserve readable text measures
- Avoid generic equal-card grids unless the content genuinely requires them
- No horizontal scroll-jacking

## 5. Homepage Narrative

The home page follows a **Story, Then Play** structure.

### 5.1 Promise

The hero establishes the product before asking the visitor to interact.

Working headline:

> Math help that follows your thinking.

The hero includes:

- Large Ratatoskur identity
- Concise explanation
- Primary action leading to the product demonstration
- A faithful app preview, not a static screenshot crop
- A bold but controlled entrance sequence

### 5.2 Guided Product Demonstration

The demonstration enters shortly after the hero and is the main website centerpiece.

It starts automatically once when scrolled into view. It does not autoplay before the visitor reaches it.

The sequence has five explicit states:

1. A representative algebra problem appears
2. A handwritten solution draws itself
3. Ratatoskur identifies an uncertain reading and asks for confirmation
4. Mode-specific feedback appears
5. The guided sequence unlocks into visitor-controlled interaction

The initial representative problem is:

> Solve: `2x + 3 = 11`

The exact Icelandic problem and tutoring response text must be reviewed during implementation.

### 5.3 Tutoring Modes

Hint, Check, and Reveal are demonstrated as distinct behaviors, not presented as three labels on otherwise identical cards.

- **Hint:** nudges without exposing the final answer
- **Check:** reviews the current reasoning and identifies correctness or a wrong turn
- **Reveal:** presents the full worked path

User-facing terminology:

- English: Hint, Check, Reveal
- Icelandic: Vísbending, Fara yfir lausn, Sýna lausn
- Internal contract: `hint`, `check_solution`, `reveal`

### 5.4 Trust And Method

This section explains, with visual evidence:

- Ratatoskur reads the problem and handwritten work
- It asks before guessing when handwriting is uncertain
- It supports multiple solution pages
- Attempts and feedback can support consent-aware evaluation
- Teacher-facing tools are future work, not a current product claim

### 5.5 Icelandic Context

A committed orange section explains:

- Why Icelandic math-learning support matters
- Why the product is being developed in Iceland
- The current prototype and validation stage

It must not claim current Fræ support unless that status changes and is explicitly confirmed.

### 5.6 Team

The team is:

- Sölvi Santos
- Jóhannes Reykdal Einarsson

Use the supplied real portraits with art-directed rectangular crops and a shared framing system. Do not use generic circular avatars.

The two source portraits have intentionally different styles:

- Sölvi: dramatic color portrait with a red background
- Jóhannes: monochrome studio portrait

The design should use the contrast deliberately rather than attempting to make them visually identical.

Team bios should be short and concrete. Do not use placeholder roles such as “two builders.”

### 5.7 Contact

The final section invites schools to start a conversation.

Requirements:

- Shorter, more direct form presentation
- Existing fields and server behavior remain compatible
- Inline client validation
- Clear sending, success, and failure states
- Reliable `mailto:` fallback
- No false urgency or sales-funnel language

## 6. App Simulator

### 6.1 Fidelity

The simulator is a web-native recreation of the actual SwiftUI notebook, not a generic phone mockup.

It must reflect:

- Real Ratatoskur colors
- Real Icelandic labels
- Problem image or problem panel
- PencilKit-like writing area
- Multi-page cues where appropriate
- Hint, Check, and Reveal controls
- Reading-confirmation sheet
- Tutor-response card
- Retry, replay, pause, and skip controls where applicable

The iOS repository is the visual and behavioral source of truth.

### 6.2 State Architecture

Implement the guided simulator as an explicit state machine:

```text
idle
  -> writing
  -> checking-reading
  -> confirming
  -> responding
  -> interactive
```

Transitions must be deterministic and independently testable.

### 6.3 Guided Motion

Motion is concentrated in meaningful product behavior:

- Pencil stroke drawing
- App state transitions
- Reading-confirmation sheet entrance
- Feedback arrival
- Unlocking visitor controls

The sequence:

- Runs once when entering view
- Pauses when off-screen
- Pauses when the tab is hidden
- Provides pause, replay, and skip controls
- Does not trap scrolling
- Does not delay access to page content

### 6.4 Interactive Mode

After the guided sequence:

- Visitors can choose Hint, Check, and Reveal
- Visitors can replay the representative example
- Visitors can optionally draw with mouse, touch, or stylus
- Visitors can clear and reset the local drawing

All drawing and simulator state remain local to the browser.

No user drawing is uploaded or sent to the Ratatoskur backend.

### 6.5 Demonstration Honesty

The simulator must be labeled as an illustrative demo.

Mode responses are deterministic examples derived from backend contracts and tutoring prompts. The website must not imply that the visitor's custom drawing is being evaluated by live AI.

## 7. Motion System

Retire the current global `Reveal` behavior.

The current pattern mounts content visibly, hides it after hydration, and then reveals it through IntersectionObserver. This can flash, delay content, and make unrelated sections move without narrative purpose.

The redesign uses:

- One orchestrated page entrance
- One guided product sequence
- Purposeful state transitions
- Fast, restrained navigation and button feedback
- Stable article and form layouts

Do not animate every section merely because it entered the viewport.

Use CSS for ordinary transitions. Use Motion only where coordinated React state transitions are meaningfully clearer or more robust.

### Reduced Motion

`prefers-reduced-motion` is mandatory.

Reduced-motion behavior:

- No animated handwriting path
- No large spatial transitions
- Guided states appear as immediate discrete steps
- All content and controls remain available
- The visitor can still select modes and use the demo

## 8. Navigation And Links

The current shared navigation uses bare anchors such as `#how` and `#contact`. These fail from Research and Updates because those sections do not exist on those pages.

The redesign uses locale-aware home anchors:

- `/en#how`
- `/is#how`
- Equivalent URLs for team, contact, and other home sections

Requirements:

- Updates returns to the primary navigation
- Research and Updates show active navigation state
- Logo always returns to the localized home page
- Language switching preserves the corresponding page where possible
- Mobile receives a real accessible menu
- No desktop-link compression on small screens
- All tap targets meet accessible minimum sizing

Existing route slugs remain:

- `/[locale]`
- `/[locale]/research`
- `/[locale]/updates`
- `/[locale]/updates/[slug]`

## 9. Secondary Pages

### Research

Research uses a darker, focused long-form presentation.

Content should cover:

- Reading handwritten mathematics
- Legibility and confirmation
- Mode-specific tutoring policy
- Consent and data boundaries
- Evaluation methodology
- Prototype status
- Current funding path

Use diagrams and product states where they clarify the approach. Do not turn the page into a backend specification.

### Updates

Updates becomes a chronological field-notes page:

- Large dates
- Clear milestone hierarchy
- Real development and validation updates
- Strong empty state when a locale has no posts

### Update Articles

Article pages use:

- Warm paper reading surfaces
- Excellent typography
- Stable navigation
- Restrained motion
- Localized metadata
- Clear return path

## 10. Content Rules

- English and Icelandic layouts are both first-class
- Icelandic copy must be reviewed independently, not treated as a mechanical string replacement
- Longer Icelandic strings must not break controls or headings
- No em dashes in public UI copy
- No unsupported learning-outcome claims
- No current Fræ support claim
- No current teacher-dashboard claim
- No mention of Sævar
- No marketing buzzwords
- Claims should be demonstrated or tied directly to implemented behavior

## 11. Responsive Behavior

The simulator and primary story must work at:

- Small mobile around 375 px
- Large mobile
- Tablet portrait and landscape
- Desktop
- Wide desktop

Mobile requirements:

- No horizontal overflow
- No pinned horizontal narrative
- Simulator controls remain usable
- Drawing surface supports touch
- Navigation uses an accessible menu
- Primary actions stay easy to reach
- Text does not depend on hover

Desktop requirements:

- Use the available width for stronger composition
- Avoid simply scaling a narrow centered column
- Preserve readable prose widths
- Keep the simulator visually dominant without overwhelming the page

## 12. Accessibility

- Semantic heading order
- Keyboard-accessible simulator controls
- Visible focus states
- Accessible mobile menu
- Canvas controls have text alternatives and labels
- Simulator state changes are announced appropriately without excessive screen-reader chatter
- Color is not the only state indicator
- Body text meets WCAG AA contrast
- Reduced-motion behavior is fully functional
- Content remains usable at 200% browser zoom
- Touch targets meet at least 44 × 44 CSS pixels

## 13. Performance

- Avoid video for the main simulator
- Use SVG paths and web-native components
- Lazy-load noncritical simulator code if it improves initial load without delaying the first meaningful visual
- Optimize and copy team portraits into the website repository
- Avoid permanent `will-change`
- Animate transform and opacity where possible
- Prevent layout shift by reserving simulator and portrait dimensions
- Keep client-component boundaries narrow
- Maintain strong Core Web Vitals

## 14. Testing And Verification

Automated tests:

- Simulator state transitions
- Pause, replay, skip, and reset behavior
- Deterministic Hint, Check, and Reveal selection
- Local drawing reset behavior where practical
- Locale-aware anchor generation
- English and Icelandic translation parity
- Contact schema and route behavior
- Updates loading and locale filtering

Browser verification:

- Every route and visible link
- Cross-page home anchors
- Desktop and mobile navigation
- Guided sequence timing
- Pause when off-screen or hidden
- Replay and skip
- Local drawing with mouse and touch emulation
- Reduced-motion mode
- Keyboard-only operation
- 200% zoom
- Both locales at key breakpoints
- Empty Updates state
- Contact success, validation, and fallback states

Quality gate:

```text
npm test
npm run lint
npm run build
```

Lint warnings from ignored local tooling directories are not application findings. Application source should have no lint errors or new warnings.

## 15. Current Assets And Sources

Product source of truth:

- `.references/ratatoskur_ios`
- `.references/ratatoskur_backend`

Brand source:

- `public/ratatoskur-logo.svg`
- Existing app palette and SwiftUI controls

Team portrait sources:

- `C:\Users\solvi\Downloads\solvi.jpg`
- `C:\Users\solvi\Downloads\joi.jpg`

Implementation must copy optimized versions into `public/` and must not depend on the Downloads paths at runtime.

The current product screenshots are not suitable as primary redesign assets:

- The mode-picker screenshot is too narrow in scope
- One screenshot duplicates the mode picker
- One screenshot is an observability table rather than a student experience

They may be removed if no longer referenced.

## 16. Out Of Scope

- Live backend evaluation of visitor drawings
- App accounts or authentication on the website
- App Store or TestFlight distribution
- Production teacher dashboard
- Claims of measured learning outcomes
- CMS migration
- Changes to backend or iOS API contracts
- Rebranding the Ratatoskur logo

## 17. Resolved Decisions

1. Preserve the logo and recognizable palette while radically redesigning the website.
2. Use Living Notebook as the main direction with bold scale and selective delight from Classroom Theatre.
3. Redesign the full public site, not only the home page.
4. Use a faithful app recreation rather than screenshots as the main product visual.
5. Use a hybrid simulator: guided first run followed by visitor control.
6. Include optional local drawing.
7. Start the sequence when scrolled into view.
8. Provide pause, replay, and skip.
9. Use immediate stepped states for reduced motion.
10. Use the supplied portraits for Sölvi and Jóhannes.
11. Structure the home page as Story, Then Play.
12. Keep simulator responses illustrative and deterministic.
13. Preserve existing routes and contact-field compatibility.

