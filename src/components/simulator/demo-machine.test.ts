import { describe, expect, test } from 'vitest';

import { initialDemoState, reduceDemo } from './demo-machine';
import type { DemoState } from './demo-types';

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

  test('ADVANCE ignores malformed runtime stages', () => {
    const malformed = {
      ...initialDemoState,
      stage: 'persisted-unknown-stage',
    } as unknown as DemoState;

    expect(reduceDemo(malformed, { type: 'ADVANCE' })).toEqual(malformed);
  });

  test('repeated ADVANCE from interactive stays interactive and keeps guided run complete', () => {
    const interactive = reduceDemo(initialDemoState, { type: 'SKIP' });

    expect(reduceDemo(interactive, { type: 'ADVANCE' })).toEqual(interactive);
  });

  test('START after SKIP stays interactive', () => {
    const interactive = reduceDemo(initialDemoState, { type: 'SKIP' });

    expect(reduceDemo(interactive, { type: 'START' })).toEqual(interactive);
  });

  test('REPLAY from a non-interactive stage starts writing and increments runId', () => {
    const confirming = reduceDemo(
      reduceDemo(reduceDemo(initialDemoState, { type: 'START' }), {
        type: 'ADVANCE',
      }),
      { type: 'ADVANCE' },
    );
    const replayed = reduceDemo({ ...confirming, runId: 3 }, { type: 'REPLAY' });

    expect(replayed.stage).toBe('writing');
    expect(replayed.runId).toBe(4);
  });

  test('SELECT_MODE after interactive can select check solution and reveal', () => {
    const interactive = reduceDemo(initialDemoState, { type: 'SKIP' });

    const checkSolution = reduceDemo(interactive, {
      type: 'SELECT_MODE',
      mode: 'check_solution',
    });
    expect(checkSolution.mode).toBe('check_solution');

    const reveal = reduceDemo(checkSolution, {
      type: 'SELECT_MODE',
      mode: 'reveal',
    });
    expect(reveal.mode).toBe('reveal');
  });

  test('CONFIRM_READING advances the guided confirmation to response', () => {
    const confirming = reduceDemo(
      reduceDemo(reduceDemo(initialDemoState, { type: 'START' }), {
        type: 'ADVANCE',
      }),
      { type: 'ADVANCE' },
    );

    const confirmed = reduceDemo(confirming, {
      type: 'CONFIRM_READING',
    });

    expect(confirmed.stage).toBe('responding');
    expect(confirmed.guidedRunComplete).toBe(false);
  });

  test('CONFIRM_READING outside the confirmation stage preserves state', () => {
    const writing = reduceDemo(initialDemoState, { type: 'START' });

    expect(reduceDemo(writing, { type: 'CONFIRM_READING' })).toEqual(writing);
  });
});
