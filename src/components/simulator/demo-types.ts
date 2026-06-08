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
  paused: boolean;
  guidedRunComplete: boolean;
  runId: number;
};

export type DemoAction =
  | { type: 'START' }
  | { type: 'ADVANCE' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'CONFIRM_READING' }
  | { type: 'SKIP' }
  | { type: 'REPLAY' }
  | { type: 'SELECT_MODE'; mode: DemoMode };
