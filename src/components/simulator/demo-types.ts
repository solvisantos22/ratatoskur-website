export type DemoStage =
  | 'idle'
  | 'writing'
  | 'checking-reading'
  | 'confirming'
  | 'responding'
  | 'interactive';

export type DemoMode = 'hint' | 'check_solution' | 'reveal';

export type DemoState = {
  stage: DemoStage;
  mode: DemoMode;
  timelineIndex: number;
  visibleLineCount: number;
  paused: boolean;
  guidedRunComplete: boolean;
  runId: number;
  responseOpen: boolean;
};

export type DemoAction =
  | { type: 'START' }
  | { type: 'ADVANCE' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'CONFIRM_READING' }
  | { type: 'DISMISS_RESPONSE' }
  | { type: 'SKIP' }
  | { type: 'REPLAY' }
  | { type: 'SELECT_MODE'; mode: DemoMode };
