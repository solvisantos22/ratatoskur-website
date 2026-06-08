'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';

import { demoCopy } from './demo-content';
import type { DemoMode, DemoStage } from './demo-types';
import { DrawingCanvas } from './DrawingCanvas';
import { ReadingConfirmation } from './ReadingConfirmation';
import { ScriptedInk } from './ScriptedInk';
import { TutorResponse } from './TutorResponse';
import styles from './AppSimulator.module.css';

type Locale = 'en' | 'is';

type NotebookShellProps = {
  locale: Locale;
  stage: DemoStage;
  mode: DemoMode;
  runId: number;
  drawingMode: boolean;
  clearSignal: number;
  onModeChange: (mode: DemoMode) => void;
  onConfirm?: () => void;
  onDismissResponse: () => void;
  responseOpen: boolean;
};

const modeLabels: Record<Locale, Record<DemoMode, string>> = {
  en: {
    hint: 'Hint',
    check_solution: 'Check',
    reveal: 'Reveal',
  },
  is: {
    hint: 'Vísbending',
    check_solution: 'Fara yfir lausn',
    reveal: 'Sýna lausn',
  },
};

const copy: Record<
  Locale,
  {
    appTitle: string;
    topStatus: string;
    problemLabel: string;
    paperLabel: string;
    pageCount: string;
    toolbar: string;
    pen: string;
    highlighter: string;
    eraser: string;
    ruler: string;
    actions: string;
    locked: string;
    chooseModeHint: string;
    canvasLabel: string;
    privacy: string;
    keyboardHelp: string;
    scriptedLabel: string;
  }
> = {
  en: {
    appTitle: 'Ratatoskur',
    topStatus: 'Notebook',
    problemLabel: 'Problem image',
    paperLabel: 'Student work',
    pageCount: 'Page 1 of 1',
    toolbar: 'Drawing tools demo',
    pen: 'Pen selected',
    highlighter: 'Highlighter',
    eraser: 'Eraser',
    ruler: 'Ruler',
    actions: 'Choose feedback mode',
    locked: 'Mode controls unlock once work is on the page.',
    chooseModeHint: 'Choose a mode to request a fresh response.',
    canvasLabel: 'Practice canvas for the Ratatoskur demo',
    privacy: 'Custom drawing stays on this device.',
    keyboardHelp:
      'Drawing is optional. Use the mode controls to explore feedback without drawing.',
    scriptedLabel: 'Scripted handwritten solution',
  },
  is: {
    appTitle: 'Ratatoskur',
    topStatus: 'Glósubók',
    problemLabel: 'Mynd af dæmi',
    paperLabel: 'Lausn nemanda',
    pageCount: 'Blað 1 af 1',
    toolbar: 'Prufustýringar fyrir ritflöt',
    pen: 'Penni valinn',
    highlighter: 'Yfirstrikari',
    eraser: 'Strokleður',
    ruler: 'Reglustika',
    actions: 'Veldu endurgjöf',
    locked: 'Hamir opnast þegar vinna birtist á síðunni.',
    chooseModeHint: 'Veldu ham til að biðja um nýtt svar.',
    canvasLabel: 'Æfingaflötur fyrir Ratatoskur prufu',
    privacy: 'Eigin teikning helst á þessu tæki.',
    keyboardHelp:
      'Teikning er valfrjáls. Notaðu hamina til að skoða endurgjöf án þess að teikna.',
    scriptedLabel: 'Handskrifuð sýnilausn',
  },
};

const orderedModes: DemoMode[] = ['hint', 'check_solution', 'reveal'];

function shouldShowInk(stage: DemoStage) {
  return (
    stage === 'writing' ||
    stage === 'checking-reading' ||
    stage === 'confirming' ||
    stage === 'responding' ||
    stage === 'interactive'
  );
}

export function NotebookShell({
  locale,
  stage,
  mode,
  runId,
  drawingMode,
  clearSignal,
  onModeChange,
  onConfirm,
  onDismissResponse,
  responseOpen,
}: NotebookShellProps) {
  const reducedMotion = useReducedMotion();
  const text = copy[locale];
  const data = demoCopy[locale];
  const modeControlsLocked = stage === 'idle';
  const confirmationOpen = stage === 'confirming';
  const activeModeLabel = modeLabels[locale][mode];

  const toolbarItems = useMemo(
    () => [text.pen, text.highlighter, text.eraser, text.ruler],
    [text.eraser, text.highlighter, text.pen, text.ruler],
  );

  return (
    <div className={styles.deviceFrame}>
      <div className={styles.deviceScreen}>
        <div className={styles.appTopBar}>
          <div>
            <strong>{text.appTitle}</strong>
            <span>{text.topStatus}</span>
          </div>
          <span className={styles.modeStatus}>{activeModeLabel}</span>
        </div>

        <div className={styles.problemPanel}>
          <span>{text.problemLabel}</span>
          <p>{data.problem}</p>
        </div>

        <section aria-label={text.paperLabel} className={styles.paperPanel}>
          <div className={styles.paperHeader}>
            <div>
              <span>{text.paperLabel}</span>
              <strong>{text.pageCount}</strong>
            </div>
            <span className={styles.paperCount}>{data.confidence}</span>
          </div>

          <div className={styles.writingSurface}>
            {drawingMode ? (
              <DrawingCanvas
                ariaLabel={text.canvasLabel}
                clearSignal={clearSignal}
                keyboardHelpText={text.keyboardHelp}
                privacyText={text.privacy}
              />
            ) : shouldShowInk(stage) ? (
              <div
                aria-label={text.scriptedLabel}
                className={styles.scriptedInkWrap}
                role="img"
              >
                <ScriptedInk
                  animate={stage === 'writing'}
                  reducedMotion={Boolean(reducedMotion)}
                  runId={runId}
                />
              </div>
            ) : (
              <div className={styles.emptyPaper} />
            )}

            <ReadingConfirmation
              key={runId}
              locale={locale}
              onConfirm={onConfirm}
              open={confirmationOpen}
            />
            <TutorResponse
              key={`${locale}-${mode}`}
              locale={locale}
              mode={mode}
              onDismiss={onDismissResponse}
              open={responseOpen}
            />
          </div>

          <div aria-label={text.toolbar} className={styles.toolbar}>
            {toolbarItems.map((item, index) => (
              <span
                className={index === 0 ? styles.toolActive : undefined}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section aria-label={text.actions} className={styles.modePanel}>
          <div className={styles.modePanelHeader}>
            <strong>{text.actions}</strong>
            <span>{modeControlsLocked ? text.locked : text.chooseModeHint}</span>
          </div>
          <div className={styles.modeButtons}>
            {orderedModes.map((candidate) => (
              <button
                aria-pressed={candidate === mode}
                className={candidate === mode ? styles.modeActive : undefined}
                disabled={modeControlsLocked}
                key={candidate}
                onClick={() => onModeChange(candidate)}
                type="button"
              >
                {modeLabels[locale][candidate]}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
