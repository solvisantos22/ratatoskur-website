# Ratatoskur UI Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the Ratatoskur website UI below the preserved hero/notebook foundation, fix the broken Updates entries, and add a stronger reusable motion layer.

**Architecture:** Keep the current Next.js App Router, CSS modules, and server-component section structure. Extend the existing `Reveal` client leaf for motion variants, then restyle and lightly restructure the homepage support sections and content pages without changing routes, primary copy intent, or the notebook demo.

**Tech Stack:** Next.js 16.2.7, React 19.2.4, TypeScript, CSS Modules, `motion/react`, Vitest, ESLint.

---

## File Structure

- Modify `src/components/motion/Reveal.tsx`: add `focus` and `trace` variants to the public prop type.
- Modify `src/components/motion/Reveal.module.css`: add variant-specific entry states, keep visible-by-default and reduced-motion behavior.
- Modify `src/components/home/ModeStories.tsx`: add small semantic wrappers so modes can render as a connected workflow instead of identical cards.
- Modify `src/components/home/MethodSection.tsx`: keep sequence content, add optional meta text hooks only if needed for visual hierarchy.
- Modify `src/components/home/IcelandicContext.tsx`: keep content, allow a cleaner stance/panel layout through existing markup.
- Modify `src/components/home/TeamSection.tsx`: preserve people and images, use CSS to tighten crop and headroom.
- Modify `src/components/home/ContactSection.tsx`: preserve form behavior, make final CTA composition stronger through CSS only unless markup needs a wrapper.
- Modify `src/components/home/Home.module.css`: main homepage visual overhaul below the demo.
- Modify `src/app/[locale]/research/page.tsx`: add semantic classes/variants for the evaluation-board composition.
- Modify `src/app/[locale]/updates/page.tsx`: add semantic classes/variants for product-journal entries.
- Modify `src/components/content/ContentPages.module.css`: research/updates visual overhaul and broken update-card split removal.
- Modify `src/lib/public-ui-copy.test.ts`: add source-level UI guard for the broken Updates split and key motion variants.

---

### Task 1: Motion Primitive And UI Guards

**Files:**
- Modify: `src/components/motion/Reveal.tsx`
- Modify: `src/components/motion/Reveal.module.css`
- Modify: `src/lib/public-ui-copy.test.ts`

- [ ] **Step 1: Add failing source-level tests for the broken split and new motion variants**

Append source checks to `src/lib/public-ui-copy.test.ts`:

```ts
const cssSourceFiles = [
  'src/components/content/ContentPages.module.css',
  'src/components/motion/Reveal.module.css',
  'src/components/motion/Reveal.tsx',
];

function publicCssSource() {
  return cssSourceFiles
    .map((file) => readFileSync(path.join(process.cwd(), file), 'utf8'))
    .join('\n');
}

it('does not ship the broken split-color update card treatment', () => {
  const source = publicCssSource();

  expect(source).not.toMatch(/0 31%, transparent 31%/);
  expect(source).not.toMatch(/0 34%, transparent 34%/);
});

it('keeps richer reveal variants available for elevated sections', () => {
  const source = publicCssSource();

  expect(source).toMatch(/focus/);
  expect(source).toMatch(/trace/);
});
```

- [ ] **Step 2: Run the targeted test and verify it fails**

Run: `npm test -- src/lib/public-ui-copy.test.ts`

Expected: FAIL because `focus` and `trace` variants are not present yet, and the current update-card split patterns still exist.

- [ ] **Step 3: Extend `Reveal` variant typing**

Change the prop type in `src/components/motion/Reveal.tsx`:

```ts
type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'li';
  children: ReactNode;
  delay?: number;
  variant?: 'rise' | 'lift' | 'sheet' | 'focus' | 'trace';
};
```

- [ ] **Step 4: Add motion variants while preserving reduced-motion safety**

Add variant rules to `src/components/motion/Reveal.module.css`:

```css
.reveal[data-ready="true"][data-variant="focus"][data-visible="false"] {
  opacity: 0.01;
  transform: translateY(12px) scale(0.992);
  filter: blur(7px);
}

.reveal[data-ready="true"][data-variant="trace"][data-visible="false"] {
  opacity: 0.01;
  transform: translateY(8px);
  filter: blur(2px);
}
```

If `trace` is used on elements with pseudo-elements, drive the line animation from each section CSS module, not from `Reveal.module.css`.

- [ ] **Step 5: Run the targeted test and verify the variant half passes**

Run: `npm test -- src/lib/public-ui-copy.test.ts`

Expected: FAIL only on the update-card split checks until Task 3 removes those CSS patterns.

- [ ] **Step 6: Commit motion primitive changes after Task 3 test passes**

After Task 3 removes the update split and the full targeted test passes, commit this task with Task 3:

```bash
git add src/components/motion/Reveal.tsx src/components/motion/Reveal.module.css src/lib/public-ui-copy.test.ts src/components/content/ContentPages.module.css src/app/[locale]/updates/page.tsx
git commit -m "feat: refine reveal motion and update entries"
```

---

### Task 2: Homepage Section Elevation

**Files:**
- Modify: `src/components/home/ModeStories.tsx`
- Modify: `src/components/home/MethodSection.tsx`
- Modify: `src/components/home/IcelandicContext.tsx`
- Modify: `src/components/home/TeamSection.tsx`
- Modify: `src/components/home/ContactSection.tsx`
- Modify: `src/components/home/Home.module.css`

- [ ] **Step 1: Preserve notebook and hero files**

Do not edit these files in this task:

```text
src/components/home/Hero.tsx
src/components/home/ProductDemoSection.tsx
src/components/simulator/*
```

- [ ] **Step 2: Restructure mode stories into a connected workflow**

In `src/components/home/ModeStories.tsx`, keep existing copy and replace the inner story markup with wrappers:

```tsx
<div className={styles.modeStoriesGrid}>
  {text.stories.map((story, index) => (
    <Reveal
      as="article"
      className={styles.modeStory}
      delay={index * 70}
      key={story.label}
      variant={index === 0 ? 'focus' : 'rise'}
    >
      <div className={styles.modeStoryIndex}>
        <span>{story.label}</span>
      </div>
      <div className={styles.modeStoryCopy}>
        <h3>{story.title}</h3>
        <p>{story.body}</p>
        <small>{story.note}</small>
      </div>
    </Reveal>
  ))}
</div>
```

- [ ] **Step 3: Apply a less card-like mode composition**

In `src/components/home/Home.module.css`, replace the current `.modeStoriesGrid`, `.modeStory`, and related mode-story rules with a composition that uses a dark first panel and two light connected panels:

```css
.modeStoriesGrid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: clamp(0.85rem, 2vw, 1.15rem);
  margin-top: clamp(1.55rem, 4vw, 2.75rem);
}

.modeStory {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: clamp(0.85rem, 2vw, 1.15rem);
  min-height: clamp(12rem, 22vw, 16rem);
  padding: clamp(1rem, 2.4vw, 1.45rem);
  border-radius: var(--radius-lg);
  background: color-mix(in oklch, var(--reading) 86%, white);
  box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--brand-espresso) 9%, transparent);
}

.modeStory:first-child {
  grid-row: span 2;
  align-content: end;
  background:
    radial-gradient(circle at 82% 12%, color-mix(in oklch, var(--brand-orange) 34%, transparent), transparent 13rem),
    var(--brand-espresso);
  color: var(--reading);
}
```

Also update `.modeStory h3`, `.modeStory p`, `.modeStory small`, and `.modeStory span` so text contrast remains readable on both dark and light surfaces.

- [ ] **Step 4: Refine the method sequence**

Keep `MethodSection.tsx` content intact, but update `Reveal` variants:

```tsx
<Reveal className={styles.methodCopy} variant="focus">
```

and:

```tsx
<Reveal as="li" delay={index * 65} key={step.title} variant="trace">
```

In `Home.module.css`, make `.methodSteps li` cleaner by reducing visual boxiness and adding a scroll-progress-like marker through existing `::before`.

- [ ] **Step 5: Simplify Icelandic context**

Keep `IcelandicContext.tsx` copy intact and set the first `Reveal` to `variant="focus"` and the second to `variant="lift"`:

```tsx
<Reveal className={styles.contextPanel} variant="focus">
...
<Reveal className={styles.contextNotes} delay={90} variant="lift">
```

In `Home.module.css`, make `.contextSection` a more editorial stance section with fewer heavy panels:

```css
.contextSection {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: clamp(1.4rem, 5vw, 4.2rem);
  align-items: start;
}
```

- [ ] **Step 6: Tighten team cards and contact final action**

In `Home.module.css`, keep `.teamCard` as a two-column layout on desktop but reduce empty headroom:

```css
.teamCard {
  grid-template-columns: minmax(7rem, 8.5rem) minmax(0, 1fr);
  align-items: center;
  padding: clamp(0.65rem, 1.4vw, 0.9rem);
}

.teamImage {
  aspect-ratio: 4 / 5;
  object-fit: cover;
}
```

For contact, preserve form markup and make `.contactSection` read as the final conversion surface through stronger spacing and a clearer form surface, not by adding fields.

- [ ] **Step 7: Run homepage-related tests**

Run: `npm test -- src/lib/public-ui-copy.test.ts src/components/home/contact-form-model.test.ts`

Expected: PASS after Task 3 is complete. The contact model test confirms form behavior was not changed.

- [ ] **Step 8: Commit homepage elevation**

```bash
git add src/components/home/ModeStories.tsx src/components/home/MethodSection.tsx src/components/home/IcelandicContext.tsx src/components/home/TeamSection.tsx src/components/home/ContactSection.tsx src/components/home/Home.module.css
git commit -m "feat: elevate homepage support sections"
```

---

### Task 3: Research And Updates Content Pages

**Files:**
- Modify: `src/app/[locale]/research/page.tsx`
- Modify: `src/app/[locale]/updates/page.tsx`
- Modify: `src/components/content/ContentPages.module.css`
- Modify: `src/lib/public-ui-copy.test.ts`

- [ ] **Step 1: Update Research reveal variants**

In `src/app/[locale]/research/page.tsx`, make the board and article feel more staged:

```tsx
<Reveal className={styles.researchBoard} delay={90} variant="focus" aria-label={text.visualLabel}>
```

and:

```tsx
<Reveal as="article" className={styles.article} aria-labelledby="research-title" variant="sheet">
```

- [ ] **Step 2: Update Updates reveal variants**

In `src/app/[locale]/updates/page.tsx`, use richer variants:

```tsx
<Reveal className={styles.journalSignal} delay={90} variant="focus" aria-label={pageCopy.signal}>
```

and:

```tsx
<Reveal as="li" delay={index * 80} key={post.slug} className={styles.updateItem} variant="sheet">
```

- [ ] **Step 3: Remove the broken update-card split**

In `src/components/content/ContentPages.module.css`, replace `.updateLink`, `.updateItem:nth-child(even) .updateLink`, `.updateDate`, and small-screen background overrides so entries use a full readable surface:

```css
.updateLink {
  position: relative;
  display: grid;
  grid-template-columns: minmax(8rem, 0.22fr) minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  min-height: clamp(10.5rem, 18vw, 13.5rem);
  padding: clamp(1rem, 2.4vw, 1.55rem);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at 94% 10%, color-mix(in oklch, var(--brand-orange) 18%, transparent), transparent 13rem),
    color-mix(in oklch, var(--reading) 88%, white);
  box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--brand-espresso) 10%, transparent);
  color: inherit;
  text-decoration: none;
  transition:
    box-shadow var(--duration-ui) var(--ease-out),
    transform var(--duration-ui) var(--ease-out);
}

.updateItem:nth-child(even) .updateLink {
  background:
    radial-gradient(circle at 8% 18%, color-mix(in oklch, var(--brand-rust) 13%, transparent), transparent 12rem),
    color-mix(in oklch, var(--paper-deep) 32%, var(--reading));
}

.updateDate {
  display: grid;
  align-content: start;
  gap: 0.45rem;
  color: var(--brand-espresso);
  font-size: 0.88rem;
  font-weight: 850;
  line-height: 1.25;
}

.updateDate span {
  width: fit-content;
  padding: 0.38rem 0.62rem;
  border-radius: 999px;
  background: var(--brand-espresso);
  color: var(--reading);
  font-size: 0.76rem;
}
```

Remove mobile overrides that recreate a vertical brown strip.

- [ ] **Step 4: Improve research board and article rhythm**

In `ContentPages.module.css`, revise `.researchBoard`, `.pipeline`, `.pipeline li`, `.body`, and `.layout` to reduce nested-card weight and improve line length. Keep `.pipeline::before` because the sequence is meaningful.

- [ ] **Step 5: Run content-page targeted tests**

Run: `npm test -- src/lib/public-ui-copy.test.ts src/lib/updates.test.ts src/lib/public-content.test.ts`

Expected: PASS. `public-ui-copy.test.ts` must now pass the broken split checks.

- [ ] **Step 6: Commit content page elevation**

```bash
git add src/app/[locale]/research/page.tsx src/app/[locale]/updates/page.tsx src/components/content/ContentPages.module.css src/lib/public-ui-copy.test.ts
git commit -m "feat: elevate research and updates pages"
```

---

### Task 4: Full Verification And Push

**Files:**
- No source edits expected unless verification finds a defect.

- [ ] **Step 1: Run full tests**

Run: `npm test`

Expected: all Vitest suites pass.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: ESLint exits with code 0.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: Next.js production build succeeds.

- [ ] **Step 4: Check local routes**

Start the app if needed:

```powershell
npm run dev
```

Then check:

```powershell
Invoke-WebRequest http://localhost:3000/en -UseBasicParsing
Invoke-WebRequest http://localhost:3000/en/research -UseBasicParsing
Invoke-WebRequest http://localhost:3000/en/updates -UseBasicParsing
```

Expected: each response status is `200`.

- [ ] **Step 5: Inspect final git status**

Run: `git status --short`

Expected: only intentional files are modified or staged. Do not stage `skills-lock.json` or `.cursor/` unless the user explicitly asks.

- [ ] **Step 6: Commit any verification fixes**

If verification required fixes, commit them:

```bash
git add <intentional-files-only>
git commit -m "fix: polish ui elevation verification"
```

- [ ] **Step 7: Push main**

Run: `git push`

Expected: `main` pushes to the configured GitHub remote.

---

## Self-Review

- Spec coverage: preserved hero/notebook, update split fix, home sections, research page, updates page, motion variants, accessibility, verification, and push are all covered.
- Completion-marker scan: no unresolved markers or vague open-ended implementation notes remain.
- Type consistency: new `Reveal` variants are `focus` and `trace` in both TypeScript and CSS/test references.
- Scope check: no route changes, no notebook behavior changes, no new external imagery, no CMS/backend changes.
