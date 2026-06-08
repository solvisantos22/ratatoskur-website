'use client';

import { useMemo } from 'react';

import { DemoControls } from './DemoControls';
import type { DemoMode, DemoStage } from './demo-types';
import { NotebookShell } from './NotebookShell';
import { useDemoController } from './useDemoController';
import styles from './AppSimulator.module.css';

type Locale = 'en' | 'is';

type AppSimulatorProps = {
  locale?: Locale;
};

const copy: Record<
  Locale,
  {
    sectionLabel: string;
    caption: string;
    stageLabels: Record<DemoStage, string>;
    modeLabels: Record<DemoMode, string>;
  }
> = {
  en: {
    sectionLabel: 'Interactive Ratatoskur app demo',
    caption:
      'A guided app walkthrough: written work, handwriting recognition, confirmation, then Hint, Check, and Reveal.',
    stageLabels: {
      idle: 'Ready to begin',
      writing: 'Writing the student solution',
      'checking-reading': 'Reading the handwriting',
      confirming: 'Asking for reading confirmation',
      responding: 'Showing Ratatoskur feedback',
      interactive: 'Interactive mode',
    },
    modeLabels: {
      hint: 'Hint',
      check_solution: 'Check',
      reveal: 'Reveal',
    },
  },
  is: {
    sectionLabel: 'Gagnvirk Ratatoskur prufa',
    caption:
      'Leiddu prufuna áfram: skrifuð lausn, lestur á rithönd, staðfesting og svo vísbending, yfirferð og lausn.',
    stageLabels: {
      idle: 'Tilbúið að byrja',
      writing: 'Sýnir lausn nemanda',
      'checking-reading': 'Les rithöndina',
      confirming: 'Biður um staðfestingu á lestri',
      responding: 'Sýnir endurgjöf frá Ratatoskur',
      interactive: 'Gagnvirkur hamur',
    },
    modeLabels: {
      hint: 'Vísbending',
      check_solution: 'Fara yfir lausn',
      reveal: 'Sýna lausn',
    },
  },
};

export function AppSimulator({ locale = 'en' }: AppSimulatorProps) {
  const {
    state,
    rootRef,
    reducedMotion,
    canGoPrevious,
    canGoNext,
    totalSteps,
    pause,
    resume,
    replay,
    previousStep,
    nextStep,
    confirmReading,
    dismissResponse,
    selectMode,
  } = useDemoController();
  const text = copy[locale];

  const announcement = useMemo(() => {
    return `${text.stageLabels[state.stage]}. ${text.modeLabels[state.mode]}.`;
  }, [state.mode, state.stage, text.modeLabels, text.stageLabels]);

  const handleModeChange = (mode: DemoMode) => {
    selectMode(mode);
  };

  return (
    <section
      aria-label={text.sectionLabel}
      className={styles.simulatorSection}
      ref={rootRef}
    >
      <p className={styles.caption}>{text.caption}</p>
      <div aria-live="polite" className={styles.srOnly}>
        {announcement}
      </div>
      <div className={styles.simulatorLayout}>
        <NotebookShell
          locale={locale}
          mode={state.mode}
          onConfirm={confirmReading}
          onDismissResponse={dismissResponse}
          onModeChange={handleModeChange}
          responseOpen={state.responseOpen}
          runId={state.runId}
          stage={state.stage}
          visibleLineCount={state.visibleLineCount}
        />
        <DemoControls
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          currentStep={state.timelineIndex + 1}
          locale={locale}
          onNextStep={nextStep}
          onPause={pause}
          onPreviousStep={previousStep}
          onReplay={replay}
          onResume={resume}
          paused={state.paused}
          reducedMotion={reducedMotion}
          totalSteps={totalSteps}
        />
      </div>
    </section>
  );
}
