'use client';

import styles from './AppSimulator.module.css';

type Locale = 'en' | 'is';

type DemoControlsProps = {
  locale: Locale;
  paused: boolean;
  drawingMode: boolean;
  reducedMotion: boolean;
  onPause: () => void;
  onResume: () => void;
  onReplay: () => void;
  onSkip: () => void;
  onToggleDrawing: () => void;
  onClearDrawing: () => void;
};

const copy: Record<
  Locale,
  {
    label: string;
    pause: string;
    resume: string;
    replay: string;
    skip: string;
    draw: string;
    example: string;
    clear: string;
    reduced: string;
  }
> = {
  en: {
    label: 'Demo controls',
    pause: 'Pause',
    resume: 'Resume',
    replay: 'Replay',
    skip: 'Skip guided demo',
    draw: 'Try drawing',
    example: 'Return to example',
    clear: 'Clear drawing',
    reduced: 'Reduced motion is on. The demo opens in interactive mode.',
  },
  is: {
    label: 'Stýringar fyrir prufu',
    pause: 'Stöðva',
    resume: 'Halda áfram',
    replay: 'Spila aftur',
    skip: 'Sleppa leiðsögn',
    draw: 'Prófa að skrifa',
    example: 'Til baka í dæmi',
    clear: 'Hreinsa teikningu',
    reduced: 'Minni hreyfing er virk. Prufan opnast í gagnvirkum ham.',
  },
};

export function DemoControls({
  locale,
  paused,
  drawingMode,
  reducedMotion,
  onPause,
  onResume,
  onReplay,
  onSkip,
  onToggleDrawing,
  onClearDrawing,
}: DemoControlsProps) {
  const text = copy[locale];

  return (
    <div aria-label={text.label} className={styles.demoControls} role="group">
      {reducedMotion ? (
        <p className={styles.reducedMotionNote}>{text.reduced}</p>
      ) : null}
      <div className={styles.controlRow}>
        <button
          className={styles.controlButton}
          onClick={paused ? onResume : onPause}
          type="button"
        >
          {paused ? text.resume : text.pause}
        </button>
        <button
          className={styles.controlButton}
          onClick={onReplay}
          type="button"
        >
          {text.replay}
        </button>
        <button className={styles.controlButton} onClick={onSkip} type="button">
          {text.skip}
        </button>
      </div>
      <div className={styles.controlRow}>
        <button
          aria-pressed={drawingMode}
          className={`${styles.controlButton} ${drawingMode ? styles.activeControl : ''}`}
          onClick={onToggleDrawing}
          type="button"
        >
          {drawingMode ? text.example : text.draw}
        </button>
        <button
          className={styles.controlButton}
          disabled={!drawingMode}
          onClick={onClearDrawing}
          type="button"
        >
          {text.clear}
        </button>
      </div>
    </div>
  );
}
