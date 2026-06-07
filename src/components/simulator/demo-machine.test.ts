import { describe, expect, test } from 'vitest';

import { initialDemoState, reduceDemo } from './demo-machine';

describe('demo machine', () => {
  test('guided sequence runs from idle to interactive and marks the guided run complete', () => {
    let state = reduceDemo(initialDemoState, { type: 'START' });
    expect(state.stage).toBe('writing');

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('checking-reading');

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('confirming');

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('responding');

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('interactive');
    expect(state.guidedRunComplete).toBe(true);
  });

  test('pause blocks ADVANCE until RESUME', () => {
    const writing = reduceDemo(initialDemoState, { type: 'START' });
    const paused = reduceDemo(writing, { type: 'PAUSE' });

    expect(reduceDemo(paused, { type: 'ADVANCE' })).toEqual(paused);

    const resumed = reduceDemo(paused, { type: 'RESUME' });
    expect(resumed.paused).toBe(false);
    expect(reduceDemo(resumed, { type: 'ADVANCE' }).stage).toBe(
      'checking-reading',
    );
  });

  test('SKIP unlocks interactive', () => {
    const skipped = reduceDemo(initialDemoState, { type: 'SKIP' });

    expect(skipped.stage).toBe('interactive');
    expect(skipped.paused).toBe(false);
    expect(skipped.guidedRunComplete).toBe(true);
  });

  test('REPLAY starts writing and increments runId', () => {
    const interactive = reduceDemo(initialDemoState, { type: 'SKIP' });
    const replayed = reduceDemo(
      { ...interactive, runId: 7, mode: 'reveal', paused: true },
      { type: 'REPLAY' },
    );

    expect(replayed.stage).toBe('writing');
    expect(replayed.mode).toBe('hint');
    expect(replayed.paused).toBe(false);
    expect(replayed.guidedRunComplete).toBe(false);
    expect(replayed.runId).toBe(8);
  });

  test('SELECT_MODE before interactive keeps mode hint', () => {
    const selected = reduceDemo(initialDemoState, {
      type: 'SELECT_MODE',
      mode: 'reveal',
    });

    expect(selected.mode).toBe('hint');
  });
});
