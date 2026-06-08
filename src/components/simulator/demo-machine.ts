import type { DemoAction, DemoStage, DemoState } from './demo-types';

const sequence: DemoStage[] = [
  'idle',
  'writing',
  'checking-reading',
  'confirming',
  'responding',
  'interactive',
];

export const initialDemoState: DemoState = {
  stage: 'idle',
  mode: 'hint',
  paused: false,
  guidedRunComplete: false,
  runId: 0,
  responseOpen: false,
};

export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'START':
      return state.stage === 'idle' ? { ...state, stage: 'writing' } : state;
    case 'ADVANCE': {
      if (state.paused) return state;
      if (state.stage === 'confirming') return state;

      const index = sequence.indexOf(state.stage);
      if (index === -1) return state;

      const stage = sequence[Math.min(index + 1, sequence.length - 1)];

      return {
        ...state,
        stage,
        responseOpen: stage === 'responding',
        guidedRunComplete:
          stage === 'interactive' || state.guidedRunComplete,
      };
    }
    case 'PAUSE':
      return { ...state, paused: true };
    case 'RESUME':
      return { ...state, paused: false };
    case 'CONFIRM_READING':
      return state.stage === 'confirming'
        ? { ...state, stage: 'responding', paused: false, responseOpen: true }
        : state;
    case 'DISMISS_RESPONSE':
      return { ...state, responseOpen: false };
    case 'SKIP':
      return {
        ...state,
        stage: 'interactive',
        paused: false,
        guidedRunComplete: true,
        responseOpen: false,
      };
    case 'REPLAY':
      return {
        ...initialDemoState,
        stage: 'writing',
        runId: state.runId + 1,
      };
    case 'SELECT_MODE':
      if (state.stage === 'idle') return state;

      return {
        ...state,
        stage: 'interactive',
        mode: action.mode,
        paused: false,
        guidedRunComplete: true,
        responseOpen: true,
      };
  }

  return assertNever(action);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled demo action: ${JSON.stringify(value)}`);
}
