import { describe, expect, it } from 'vitest';

import { demoCopy } from './demo-content';

describe('demo content', () => {
  it('gives reveal a worked derivation instead of only a verdict', () => {
    const reveal = demoCopy.en.responses.reveal as { steps?: string[] };

    expect(reveal.steps).toEqual([
      'Start with 2x + 3 = 11.',
      'Subtract 3 from both sides: 2x = 8.',
      'Divide both sides by 2: x = 4.',
    ]);
  });

  it('keeps check solution as a concise correctness response', () => {
    const check = demoCopy.en.responses.check_solution as { steps?: string[] };

    expect(check.steps).toBeUndefined();
  });
});
