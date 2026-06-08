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
  'src/components/motion/Reveal.module.css',
  'src/components/motion/Reveal.tsx',
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
});
