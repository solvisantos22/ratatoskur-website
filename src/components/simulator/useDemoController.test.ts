import { describe, expect, it } from 'vitest';

import { stageDuration } from './useDemoController';

describe('demo controller policy', () => {
  it('uses the planned guided-stage timing', () => {
    expect(stageDuration).toEqual({
      writing: 2600,
      'checking-reading': 900,
      responding: 2200,
    });
  });

  it('does not schedule automatic advancement for the confirmation stage', () => {
    expect(stageDuration.confirming).toBeUndefined();
  });
});
