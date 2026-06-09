'use client';

import styles from './AppSimulator.module.css';

type Locale = 'en' | 'is';

type DemoControlsProps = {
  locale: Locale;
  paused: boolean;
  reducedMotion: boolean;
  currentStep: number;
  totalSteps: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPause: () => void;
  onResume: () => void;
  onReplay: () => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
};

const copy: Record<
  Locale,
  {
    label: string;
    step: (current: number, total: number) => string;
    previous: string;
    next: string;
    pause: string;
    resume: string;
    replay: string;
    reduced: string;
  }
> = {
  en: {
    label: 'Demo timeline controls',
    step: (current, total) => `Step ${current} of ${total}`,
    previous: 'Previous step',
    next: 'Next step',
    pause: 'Pause',
    resume: 'Resume',
    replay: 'Replay walkthrough',
    reduced:
      'Reduced motion is on. Use the timeline controls to step through the walkthrough.',
  },
  is: {
    label: 'Stýringar fyrir tímalínu',
    step: (current, total) => `Skref ${current} af ${total}`,
    previous: 'Fyrra skref',
    next: 'Næsta skref',
    pause: 'Stöðva',
    resume: 'Halda áfram',
    replay: 'Spila ferlið aftur',
    reduced:
      'Minni hreyfing er virk. Notaðu tímalínuna til að fara í gegnum prufuna.',
  },
};

export function DemoControls({
  locale,
  paused,
  reducedMotion,
  currentStep,
  totalSteps,
  canGoPrevious,
  canGoNext,
  onPause,
  onResume,
  onReplay,
  onPreviousStep,
  onNextStep,
}: DemoControlsProps) {
  const text = copy[locale];
  const progress =
    totalSteps > 0 ? Math.max(0, Math.min(1, currentStep / totalSteps)) : 0;

  return (
    <div aria-label={text.label} className={styles.demoControls} role="group">
      {reducedMotion ? (
        <p className={styles.reducedMotionNote}>{text.reduced}</p>
      ) : null}
      <div className={styles.timelineStatus}>
        <span>{text.step(currentStep, totalSteps)}</span>
        <div aria-hidden="true" className={styles.timelineRail}>
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
      <div className={styles.controlRow}>
        <button
          className={styles.controlButton}
          disabled={!canGoPrevious}
          onClick={onPreviousStep}
          type="button"
        >
          {text.previous}
        </button>
        <button
          className={styles.controlButton}
          onClick={paused ? onResume : onPause}
          type="button"
        >
          {paused ? text.resume : text.pause}
        </button>
        <button
          className={styles.controlButton}
          disabled={!canGoNext}
          onClick={onNextStep}
          type="button"
        >
          {text.next}
        </button>
        <button
          className={styles.controlButton}
          onClick={onReplay}
          type="button"
        >
          {text.replay}
        </button>
      </div>
    </div>
  );
}
