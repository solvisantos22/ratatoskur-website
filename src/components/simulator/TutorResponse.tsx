'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { demoCopy } from './demo-content';
import type { DemoMode } from './demo-types';
import styles from './AppSimulator.module.css';

type Locale = 'en' | 'is';

type TutorResponseProps = {
  locale: Locale;
  mode: DemoMode;
  open: boolean;
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
    verdict: string;
    feedbackLabel: string;
    helpful: string;
    notHelpful: string;
    selected: string;
  }
> = {
  en: {
    verdict: 'Result: correct so far',
    feedbackLabel: 'Demo feedback controls',
    helpful: 'Helpful',
    notHelpful: 'Not helpful',
    selected: 'Selected',
  },
  is: {
    verdict: 'Niðurstaða: rétt hingað til',
    feedbackLabel: 'Prufuumsögn',
    helpful: 'Gagnlegt',
    notHelpful: 'Ekki gagnlegt',
    selected: 'Valið',
  },
};

export function TutorResponse({ locale, mode, open }: TutorResponseProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<
    'up' | 'down' | null
  >(null);
  const data = demoCopy[locale].responses[mode];
  const text = copy[locale];

  return (
    <AnimatePresence initial={false} mode="wait">
      {open ? (
        <motion.aside
          key={`${locale}-${mode}-response`}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          aria-label={data.title}
          className={styles.responseCard}
          exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
          initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
          transition={{ bounce: 0, duration: 0.38, type: 'spring' }}
        >
          <div className={styles.responseTopline}>
            <span>{text.verdict}</span>
            <strong>{modeLabels[locale][mode]}</strong>
          </div>
          <h3>{data.title}</h3>
          <p>{data.body}</p>
          <div
            aria-label={text.feedbackLabel}
            className={styles.feedbackControls}
            role="group"
          >
            <button
              aria-pressed={selectedFeedback === 'up'}
              className={styles.feedbackButton}
              onClick={() => setSelectedFeedback('up')}
              type="button"
            >
              <span aria-hidden="true">+</span>
              {text.helpful}
              {selectedFeedback === 'up' ? (
                <span className={styles.selectedFeedback}>{text.selected}</span>
              ) : null}
            </button>
            <button
              aria-pressed={selectedFeedback === 'down'}
              className={styles.feedbackButton}
              onClick={() => setSelectedFeedback('down')}
              type="button"
            >
              <span aria-hidden="true">-</span>
              {text.notHelpful}
              {selectedFeedback === 'down' ? (
                <span className={styles.selectedFeedback}>{text.selected}</span>
              ) : null}
            </button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
