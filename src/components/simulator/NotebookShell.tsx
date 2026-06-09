'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';

import { demoCopy } from './demo-content';
import type { DemoMode, DemoStage } from './demo-types';
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
  visibleLineCount: number;
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
    eraser: string;
    ruler: string;
    actions: string;
    locked: string;
    chooseModeHint: string;
    scriptedLabel: string;
    readingStatusTitle: string;
    readingStatusBody: string;
  }
> = {
  en: {
    appTitle: 'Ratatoskur',
    topStatus: 'Notebook',
    problemLabel: 'Problem image',
    paperLabel: 'Student work',
    pageCount: 'Page 1 of 1',
    toolbar: 'Notebook tools',
    pen: 'Pen selected',
    eraser: 'Eraser',
    ruler: 'Ruler',
    actions: 'Choose feedback mode',
    locked: 'Mode controls unlock once work is on the page.',
    chooseModeHint: 'Choose a mode to request a fresh response.',
    scriptedLabel: 'Scripted handwritten solution',
    readingStatusTitle: 'Reading handwriting',
    readingStatusBody: 'Matching the written work before showing feedback.',
  },
  is: {
    appTitle: 'Ratatoskur',
    topStatus: 'Glósubók',
    problemLabel: 'Mynd af dæmi',
    paperLabel: 'Lausn nemanda',
    pageCount: 'Blað 1 af 1',
    toolbar: 'Verkfæri í vinnubók',
    pen: 'Penni valinn',
    eraser: 'Strokleður',
    ruler: 'Reglustika',
    actions: 'Veldu endurgjöf',
    locked: 'Hamir opnast þegar vinna birtist á síðunni.',
    chooseModeHint: 'Veldu ham til að biðja um nýtt svar.',
    scriptedLabel: 'Handskrifuð sýnilausn',
    readingStatusTitle: 'Les rithönd',
    readingStatusBody: 'Ber handskrifuðu vinnuna saman áður en endurgjöf birtist.',
  },
};

const orderedModes: DemoMode[] = ['hint', 'check_solution', 'reveal'];

export function getNotebookToolbarItems(locale: Locale) {
  const text = copy[locale];

  return [text.pen, text.eraser, text.ruler];
}

function shouldShowInk(stage: DemoStage) {
  return (
    stage === 'writing' ||
    stage === 'checking-reading' ||
    stage === 'confirming' ||
    stage === 'responding' ||
    stage === 'interactive'
  );
}

function shouldShowRecognitionLens(stage: DemoStage) {
  return (
    stage === 'checking-reading' ||
    stage === 'confirming' ||
    stage === 'responding'
  );
}

export function NotebookShell({
  locale,
  stage,
  mode,
  runId,
  visibleLineCount,
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

  const toolbarItems = useMemo(() => getNotebookToolbarItems(locale), [locale]);

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
            {shouldShowInk(stage) ? (
              <div
                aria-label={text.scriptedLabel}
                className={styles.scriptedInkWrap}
                role="img"
              >
                <ScriptedInk
                  animate={stage === 'writing'}
                  reducedMotion={Boolean(reducedMotion)}
                  runId={runId}
                  visibleLineCount={visibleLineCount}
                />
              </div>
            ) : (
              <div className={styles.emptyPaper} />
            )}

            {shouldShowRecognitionLens(stage) ? (
              <div aria-hidden="true" className={styles.recognitionLens} />
            ) : null}

            {stage === 'checking-reading' ? (
              <aside className={styles.readingStatus} aria-label={text.readingStatusTitle}>
                <span>{data.confidence}</span>
                <strong>{text.readingStatusTitle}</strong>
                <p>{text.readingStatusBody}</p>
              </aside>
            ) : null}

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
