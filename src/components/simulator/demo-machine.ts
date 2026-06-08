import type { DemoAction, DemoMode, DemoStage, DemoState } from './demo-types';

type DemoTimelineStep = {
  stage: DemoStage;
  mode: DemoMode;
  responseOpen: boolean;
  guidedRunComplete: boolean;
};

export const demoTimeline: DemoTimelineStep[] = [
  {
    stage: 'idle',
    mode: 'hint',
    responseOpen: false,
    guidedRunComplete: false,
  },
  {
    stage: 'writing',
    mode: 'hint',
    responseOpen: false,
    guidedRunComplete: false,
  },
  {
    stage: 'checking-reading',
    mode: 'hint',
    responseOpen: false,
    guidedRunComplete: false,
  },
  {
    stage: 'confirming',
    mode: 'hint',
    responseOpen: false,
    guidedRunComplete: false,
  },
  {
    stage: 'responding',
    mode: 'hint',
    responseOpen: true,
    guidedRunComplete: false,
  },
  {
    stage: 'responding',
    mode: 'check_solution',
    responseOpen: true,
    guidedRunComplete: true,
  },
  {
    stage: 'responding',
    mode: 'reveal',
    responseOpen: true,
    guidedRunComplete: true,
  },
  {
    stage: 'interactive',
    mode: 'reveal',
    responseOpen: false,
    guidedRunComplete: true,
  },
];

const modeTimelineIndex: Record<DemoMode, number> = {
  hint: 4,
  check_solution: 5,
  reveal: 6,
};

export const initialDemoState: DemoState = {
  stage: 'idle',
  mode: 'hint',
  timelineIndex: 0,
  paused: false,
  guidedRunComplete: false,
  runId: 0,
  responseOpen: false,
};

export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'START':
      return state.stage === 'idle'
        ? applyTimelineStep(state, 1, { paused: false })
        : state;
    case 'NEXT_STEP':
    case 'ADVANCE': {
      if (state.paused) return state;
      if (state.stage === 'confirming') return state;

      const index = getTimelineIndex(state);
      if (index === -1) return state;

      return applyTimelineStep(state, index + 1);
    }
    case 'PREVIOUS_STEP': {
      const index = getTimelineIndex(state);
      if (index === -1) return state;

      return applyTimelineStep(state, index - 1, { paused: false });
    }
    case 'PAUSE':
      return { ...state, paused: true };
    case 'RESUME':
      return { ...state, paused: false };
    case 'CONFIRM_READING':
      return state.stage === 'confirming'
        ? applyTimelineStep(state, 4, { paused: false })
        : state;
    case 'DISMISS_RESPONSE':
      return { ...state, responseOpen: false };
    case 'SKIP':
      return applyTimelineStep(state, demoTimeline.length - 1, {
        paused: false,
      });
    case 'REPLAY':
      return {
        ...initialDemoState,
        stage: 'writing',
        timelineIndex: 1,
        runId: state.runId + 1,
      };
    case 'SELECT_MODE':
      if (state.stage === 'idle') return state;

      return applyTimelineStep(state, modeTimelineIndex[action.mode], {
        paused: false,
        guidedRunComplete: true,
      });
  }

  return assertNever(action);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled demo action: ${JSON.stringify(value)}`);
}

function applyTimelineStep(
  state: DemoState,
  targetIndex: number,
  overrides: Partial<DemoState> = {},
): DemoState {
  const timelineIndex = clampTimelineIndex(targetIndex);
  const step = demoTimeline[timelineIndex];

  return {
    ...state,
    ...step,
    timelineIndex,
    ...overrides,
  };
}

function clampTimelineIndex(index: number): number {
  return Math.min(Math.max(index, 0), demoTimeline.length - 1);
}

function getTimelineIndex(state: DemoState): number {
  if (
    Number.isInteger(state.timelineIndex) &&
    state.timelineIndex >= 0 &&
    state.timelineIndex < demoTimeline.length
  ) {
    const step = demoTimeline[state.timelineIndex];
    if (step.stage === state.stage && step.mode === state.mode) {
      return state.timelineIndex;
    }
  }

  return demoTimeline.findIndex(
    (step) => step.stage === state.stage && step.mode === state.mode,
  );
}
