import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceFiles = [
  'src/app/[locale]/research/page.tsx',
  'src/app/[locale]/updates/page.tsx',
  'src/components/home/MethodSection.tsx',
];

const cssSourceFiles = [
  'src/components/content/ContentPages.module.css',
  'src/components/home/Home.module.css',
  'src/components/motion/Reveal.module.css',
  'src/components/motion/Reveal.tsx',
  'src/components/simulator/AppSimulator.module.css',
  'src/components/ui/UI.module.css',
];

const publicVisibleSourceFiles = [
  ...sourceFiles,
  'src/components/home/CinematicNotebookScene.tsx',
  'src/components/home/ContactSection.tsx',
  'src/components/home/Hero.tsx',
  'src/components/home/MethodSection.tsx',
  'src/components/simulator/DemoControls.tsx',
  'src/components/simulator/NotebookShell.tsx',
  'src/components/simulator/ReadingConfirmation.tsx',
  'src/components/simulator/TutorResponse.tsx',
  'messages/en.json',
  'messages/is.json',
];

function sourceFile(file: string) {
  return readFileSync(path.join(process.cwd(), file), 'utf8');
}

function publicUiSource() {
  return sourceFiles
    .map((file) => sourceFile(file))
    .join('\n');
}

function publicCssSource() {
  return cssSourceFiles
    .map((file) => sourceFile(file))
    .join('\n');
}

function publicVisibleSource() {
  return publicVisibleSourceFiles
    .map((file) => sourceFile(file))
    .join('\n');
}

describe('public UI copy', () => {
  it('does not ship discarded positioning notes as visible copy', () => {
    const source = publicUiSource();

    expect(source).not.toMatch(/Publication rhythm/i);
    expect(source).not.toMatch(/Notebook, not a brochure/i);
    expect(source).not.toMatch(/The evidence has to match how students actually solve problems/i);
    expect(source).not.toMatch(/What matters/i);
    expect(source).not.toMatch(/Handwriting, confirmation, and useful feedback are evaluated as separate parts/i);
  });

  it('does not ship the broken split-color update card treatment', () => {
    const source = publicCssSource();
    const contentCss = sourceFile('src/components/content/ContentPages.module.css');
    const updateLinkBlocks = [
      ...contentCss.matchAll(/\.updateLink\s*\{[\s\S]*?\n\}/g),
      ...contentCss.matchAll(/\.updateItem:nth-child\(even\)\s+\.updateLink\s*\{[\s\S]*?\n\}/g),
    ]
      .map(([block]) => block)
      .join('\n');

    expect(source).not.toMatch(/0 31%, transparent 31%/);
    expect(source).not.toMatch(/0 34%, transparent 34%/);
    expect(updateLinkBlocks).not.toMatch(/linear-gradient\(\s*(?:90deg|180deg)[\s\S]*?transparent/);
  });

  it('keeps update journal focus rings high contrast', () => {
    const contentCss = sourceFile('src/components/content/ContentPages.module.css');
    const focusBlock = contentCss.match(/\.updateLink:focus-visible\s*\{[\s\S]*?\n\}/)?.[0] ?? '';

    expect(focusBlock).toContain('outline: 3px solid var(--brand-espresso);');
    expect(focusBlock).toContain('outline-offset: 4px;');
    expect(focusBlock).not.toMatch(/outline:\s*3px solid color-mix/);
  });

  it('keeps richer reveal variants available for elevated sections', () => {
    const revealTs = sourceFile('src/components/motion/Reveal.tsx');
    const revealCss = sourceFile('src/components/motion/Reveal.module.css');
    const variantUnion = revealTs.match(/variant\?:\s*([^;]+);/)?.[1] ?? '';

    for (const variant of ['rise', 'lift', 'sheet', 'focus', 'trace']) {
      expect(variantUnion).toMatch(new RegExp(`['"]${variant}['"]`));
    }

    expect(revealCss).toMatch(/\[data-variant="focus"\]/);
    expect(revealCss).toMatch(/\[data-variant="trace"\]/);
  });

  it('keeps reveal hydration stable before intersection observers run', () => {
    const revealTs = sourceFile('src/components/motion/Reveal.tsx');

    expect(revealTs).toContain('const reduceMotion = Boolean(shouldReduceMotion);');
    expect(revealTs).toContain("'data-visible': visible || reduceMotion");
    expect(revealTs).not.toContain("'data-visible': visible || shouldReduceMotion");
  });

  it('keeps the simulator timeline on transform instead of layout width', () => {
    const controlsTs = sourceFile('src/components/simulator/DemoControls.tsx');
    const simulatorCss = sourceFile('src/components/simulator/AppSimulator.module.css');
    const timelineBlock =
      simulatorCss.match(/\.timelineRail span\s*\{[\s\S]*?\n\}/)?.[0] ?? '';

    expect(controlsTs).toContain('scaleX(');
    expect(controlsTs).not.toContain('width: `${progress}%`');
    expect(timelineBlock).toContain('transform-origin: left center;');
    expect(timelineBlock).toContain('transition: transform');
    expect(timelineBlock).not.toMatch(/transition:\s*width/);
  });

  it('keeps the design and skills ledger aligned with the actual stack', () => {
    const design = sourceFile('DESIGN.md');
    const skills = sourceFile('docs/AGENT_SKILLS.md');

    expect(design).toMatch(/\bLiterata\b/);
    expect(design).toMatch(/\bManrope\b/);
    expect(design).not.toMatch(/\bFraunces\b/);
    expect(skills).toMatch(/catalog metadata only/i);
    expect(skills).toMatch(/Deferred for this site/i);
    expect(skills).toMatch(/does not add React Three Fiber dependencies/i);
    expect(skills).toMatch(/cinematic-notebook pass uses Anime\.js/i);
    expect(skills).toMatch(/Rive for an authored 2D state-machine object/i);
    expect(skills).toMatch(/Jitter or dotLottie/i);
  });

  it('keeps cinematic notebook dependencies scoped to Anime.js', () => {
    const packageJson = JSON.parse(sourceFile('package.json')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    expect(dependencies).toHaveProperty('animejs');
    expect(dependencies).not.toHaveProperty('@react-three/fiber');
    expect(dependencies).not.toHaveProperty('@react-three/drei');
    expect(dependencies).not.toHaveProperty('three');
    expect(dependencies).not.toHaveProperty('@json-render/react-three-fiber');
    expect(dependencies).not.toHaveProperty('@rive-app/react-canvas');
    expect(dependencies).not.toHaveProperty('@rive-app/react-webgl2');
    expect(dependencies).not.toHaveProperty('@lottiefiles/dotlottie-react');
    expect(dependencies).not.toHaveProperty('iconsax-react');
  });

  it('keeps the cinematic notebook animation isolated as a client leaf', () => {
    const heroTs = sourceFile('src/components/home/Hero.tsx');
    const sceneTs = sourceFile('src/components/home/CinematicNotebookScene.tsx');

    expect(heroTs).toMatch(/CinematicNotebookScene/);
    expect(sceneTs).toContain("'use client';");
    expect(sceneTs).toMatch(/from 'animejs'/);
    expect(sceneTs).toMatch(/useReducedMotion/);
    expect(sceneTs).toMatch(/aria-hidden="true"/);
    expect(sceneTs).toMatch(/data-reduced-motion/);
  });

  it('does not ship em dashes in public UI source strings', () => {
    expect(publicVisibleSource()).not.toContain('—');
  });

  it('does not ship discarded classroom mascot phrasing', () => {
    const source = publicVisibleSource();

    expect(source).not.toMatch(/class squirrel/i);
    expect(source).not.toMatch(/glass squirrel/i);
    expect(source).not.toMatch(/Tell us about the class/i);
  });

  it('does not render the removed hero glass logo treatment', () => {
    const heroTs = sourceFile('src/components/home/Hero.tsx');
    const homeCss = sourceFile('src/components/home/Home.module.css');

    expect(heroTs).not.toMatch(/heroLiquidMark/);
    expect(homeCss).not.toMatch(/heroLiquidMark/);
  });

  it('keeps manual demo reading steps visible after rewinding', () => {
    const notebookTs = sourceFile('src/components/simulator/NotebookShell.tsx');
    const confirmationTs = sourceFile('src/components/simulator/ReadingConfirmation.tsx');

    expect(notebookTs).toMatch(/readingStatusTitle/);
    expect(notebookTs).toMatch(/stage === 'checking-reading'/);
    expect(confirmationTs).not.toMatch(/useState/);
    expect(confirmationTs).not.toMatch(/dismissed/);
  });

  it('keeps public UI typography free of negative letter spacing', () => {
    expect(publicCssSource()).not.toMatch(/letter-spacing:\s*-/);
  });
});
