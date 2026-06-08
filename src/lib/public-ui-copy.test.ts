import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceFiles = [
  'src/app/[locale]/research/page.tsx',
  'src/app/[locale]/updates/page.tsx',
  'src/components/home/MethodSection.tsx',
];

function publicUiSource() {
  return sourceFiles
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
});
