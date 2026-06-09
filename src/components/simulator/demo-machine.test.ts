import { describe, expect, test } from 'vitest';

import { initialDemoState, reduceDemo } from './demo-machine';
import type { DemoState } from './demo-types';

describe('demo machine', () => {
  test('guided sequence writes progressively, asks for hint, then checks and reveals', () => {
    let state = reduceDemo(initialDemoState, { type: 'START' });
    expect(state.stage).toBe('writing');
    expect(state.visibleLineCount).toBe(1);

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('responding');
    expect(state.mode).toBe('hint');
    expect(state.visibleLineCount).toBe(1);
    expect(state.responseOpen).toBe(true);

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('writing');
    expect(state.visibleLineCount).toBe(2);
    expect(state.responseOpen).toBe(false);

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('writing');
    expect(state.visibleLineCount).toBe(3);
    expect(state.responseOpen).toBe(false);

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('checking-reading');
    expect(state.mode).toBe('check_solution');
    expect(state.visibleLineCount).toBe(3);

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('confirming');

    state = reduceDemo(state, { type: 'CONFIRM_READING' });
    expect(state.stage).toBe('responding');
    expect(state.mode).toBe('check_solution');
    expect(state.visibleLineCount).toBe(3);
    expect(state.responseOpen).toBe(true);

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('responding');
    expect(state.mode).toBe('reveal');
    expect(state.responseOpen).toBe(true);

    state = reduceDemo(state, { type: 'ADVANCE' });
    expect(state.stage).toBe('interactive');
    expect(state.guidedRunComplete).toBe(true);
    expect(state.responseOpen).toBe(false);
    expect(state.paused).toBe(true);
  });

  test('timeline controls move backward and forward one step at a time', () => {
    const writing = reduceDemo(initialDemoState, { type: 'START' });
    expect(writing.stage).toBe('writing');
    expect(writing.timelineIndex).toBe(1);

    const checking = reduceDemo(writing, { type: 'NEXT_STEP' } as never);
    expect(checking.stage).toBe('responding');
    expect(checking.mode).toBe('hint');
    expect(checking.timelineIndex).toBe(2);
    expect(checking.paused).toBe(true);

    const rewound = reduceDemo(checking, { type: 'PREVIOUS_STEP' } as never);
    expect(rewound.stage).toBe('writing');
    expect(rewound.timelineIndex).toBe(1);
    expect(rewound.paused).toBe(true);
  });

  test('timeline controls keep working while manually paused', () => {
    const writing = reduceDemo(initialDemoState, { type: 'START' });
    const paused = reduceDemo(writing, { type: 'PAUSE' });

    const next = reduceDemo(paused, { type: 'NEXT_STEP' });

    expect(next.stage).toBe('responding');
    expect(next.timelineIndex).toBe(2);
    expect(next.paused).toBe(true);
  });

  test('pause blocks ADVANCE until RESUME', () => {
    const writing = reduceDemo(initialDemoState, { type: 'START' });
    const paused = reduceDemo(writing, { type: 'PAUSE' });

    expect(reduceDemo(paused, { type: 'ADVANCE' })).toEqual(paused);

    const resumed = reduceDemo(paused, { type: 'RESUME' });
    expect(resumed.paused).toBe(false);
    expect(reduceDemo(resumed, { type: 'ADVANCE' }).stage).toBe('responding');
    expect(reduceDemo(resumed, { type: 'ADVANCE' }).mode).toBe('hint');
  });

  test('SKIP unlocks interactive', () => {
    const skipped = reduceDemo(initialDemoState, { type: 'SKIP' });

    expect(skipped.stage).toBe('interactive');
    expect(skipped.paused).toBe(false);
    expect(skipped.guidedRunComplete).toBe(true);
    expect(skipped.responseOpen).toBe(false);
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
    expect(replayed.timelineIndex).toBe(1);
    expect(replayed.visibleLineCount).toBe(1);
  });

  test('SELECT_MODE before work is visible keeps the idle state', () => {
    const selected = reduceDemo(initialDemoState, {
      type: 'SELECT_MODE',
      mode: 'reveal',
    });

    expect(selected.mode).toBe('hint');
    expect(selected.stage).toBe('idle');
    expect(selected.responseOpen).toBe(false);
  });

  test('SELECT_MODE during the guided writing jumps to that response step', () => {
    const writing = reduceDemo(initialDemoState, { type: 'START' });

    const selected = reduceDemo(writing, {
      type: 'SELECT_MODE',
      mode: 'reveal',
    });

    expect(selected.stage).toBe('responding');
    expect(selected.mode).toBe('reveal');
    expect(selected.visibleLineCount).toBe(3);
    expect(selected.guidedRunComplete).toBe(true);
    expect(selected.responseOpen).toBe(true);
    expect(selected.paused).toBe(true);
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
    expect(checkSolution.responseOpen).toBe(true);

    const reveal = reduceDemo(checkSolution, {
      type: 'SELECT_MODE',
      mode: 'reveal',
    });
    expect(reveal.mode).toBe('reveal');
    expect(reveal.responseOpen).toBe(true);
  });

  test('DISMISS_RESPONSE closes the response without changing selected mode', () => {
    const interactive = reduceDemo(initialDemoState, { type: 'SKIP' });
    const withResponse = reduceDemo(interactive, {
      type: 'SELECT_MODE',
      mode: 'reveal',
    });

    const dismissed = reduceDemo(withResponse, {
      type: 'DISMISS_RESPONSE',
    } as never);

    expect(dismissed.stage).toBe('responding');
    expect(dismissed.mode).toBe('reveal');
    expect(dismissed.responseOpen).toBe(false);
  });

  test('CONFIRM_READING advances the guided confirmation to response', () => {
    let confirming = reduceDemo(initialDemoState, { type: 'START' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });

    const confirmed = reduceDemo(confirming, {
      type: 'CONFIRM_READING',
    });

    expect(confirmed.stage).toBe('responding');
    expect(confirmed.mode).toBe('check_solution');
    expect(confirmed.guidedRunComplete).toBe(true);
    expect(confirmed.responseOpen).toBe(true);
  });

  test('ADVANCE from confirmation waits for user confirmation', () => {
    let confirming = reduceDemo(initialDemoState, { type: 'START' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });

    expect(reduceDemo(confirming, { type: 'ADVANCE' })).toEqual(confirming);
  });

  test('NEXT_STEP from confirmation acts like accepting the reading', () => {
    let confirming = reduceDemo(initialDemoState, { type: 'START' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });
    confirming = reduceDemo(confirming, { type: 'ADVANCE' });

    const next = reduceDemo(confirming, { type: 'NEXT_STEP' });

    expect(next.stage).toBe('responding');
    expect(next.mode).toBe('check_solution');
    expect(next.responseOpen).toBe(true);
    expect(next.paused).toBe(true);
  });

  test('CONFIRM_READING outside the confirmation stage preserves state', () => {
    const writing = reduceDemo(initialDemoState, { type: 'START' });

    expect(reduceDemo(writing, { type: 'CONFIRM_READING' })).toEqual(writing);
  });
});
