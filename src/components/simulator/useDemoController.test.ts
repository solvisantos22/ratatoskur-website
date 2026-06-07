import { describe, expect, it } from 'vitest';

import {
  shouldClearDrawingForAction,
  stageDuration,
} from './useDemoController';

describe('demo controller policy', () => {
  it('uses the planned guided-stage timing', () => {
    expect(stageDuration).toEqual({
      writing: 2400,
      'checking-reading': 900,
      confirming: 2200,
      responding: 2200,
    });
  });

  it('clears drawing only when replaying the guided sequence', () => {
    expect(shouldClearDrawingForAction('replay')).toBe(true);
    expect(shouldClearDrawingForAction('skip')).toBe(false);
  });
});
