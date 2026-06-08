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

function publicUiSource() {
  return sourceFiles
    .map((file) => readFileSync(path.join(process.cwd(), file), 'utf8'))
    .join('\n');
}

function publicCssSource() {
  return cssSourceFiles
    .map((file) => readFileSync(path.join(process.cwd(), file), 'utf8'))
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

    expect(source).not.toMatch(/0 31%, transparent 31%/);
    expect(source).not.toMatch(/0 34%, transparent 34%/);
  });

  it('keeps richer reveal variants available for elevated sections', () => {
    const source = publicCssSource();

    expect(source).toMatch(/focus/);
    expect(source).toMatch(/trace/);
  });
});
