'use client';

import { useMemo, useState } from 'react';

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
    caption: 'Illustrative demo. Custom drawing stays on this device.',
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
    caption: 'Sýnishorn. Eigin teikning helst á þessu tæki.',
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
    pause,
    resume,
    replay,
    skip,
    selectMode,
    clearDrawingSignal,
    clearDrawing,
  } = useDemoController();
  const [drawingMode, setDrawingMode] = useState(false);
  const text = copy[locale];

  const announcement = useMemo(() => {
    return `${text.stageLabels[state.stage]}. ${text.modeLabels[state.mode]}.`;
  }, [state.mode, state.stage, text.modeLabels, text.stageLabels]);

  const handleToggleDrawing = () => {
    setDrawingMode((current) => !current);
  };

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
          clearSignal={clearDrawingSignal}
          drawingMode={drawingMode}
          locale={locale}
          mode={state.mode}
          onModeChange={handleModeChange}
          runId={state.runId}
          stage={state.stage}
        />
        <DemoControls
          drawingMode={drawingMode}
          locale={locale}
          onClearDrawing={clearDrawing}
          onPause={pause}
          onReplay={replay}
          onResume={resume}
          onSkip={skip}
          onToggleDrawing={handleToggleDrawing}
          paused={state.paused}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}
