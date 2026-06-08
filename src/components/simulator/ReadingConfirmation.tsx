'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { demoCopy } from './demo-content';
import styles from './AppSimulator.module.css';

type Locale = 'en' | 'is';

type ReadingConfirmationProps = {
  locale: Locale;
  open: boolean;
  onConfirm?: () => void;
};

const copy: Record<
  Locale,
  {
    title: string;
    intro: string;
    readingLabel: string;
    confirm: string;
    reason: string;
  }
> = {
  en: {
    title: 'Confirm the reading',
    intro: 'Did you write this?',
    readingLabel: 'Interpreted as',
    confirm: 'Yes, continue',
    reason: 'Ratatoskur asks before guessing, especially when handwriting is ambiguous.',
  },
  is: {
    title: 'Staðfestu lesturinn',
    intro: 'Skrifaðir þú þetta?',
    readingLabel: 'Lesið sem',
    confirm: 'Já, halda áfram',
    reason: 'Ratatoskur spyr áður en hann giskar, sérstaklega þegar rithönd er óljós.',
  },
};

export function ReadingConfirmation({
  locale,
  open,
  onConfirm,
}: ReadingConfirmationProps) {
  const [dismissed, setDismissed] = useState(false);
  const text = copy[locale];
  const data = demoCopy[locale];

  const handleConfirm = () => {
    setDismissed(true);
    onConfirm?.();
  };

  return (
    <AnimatePresence initial={false} mode="wait">
      {open && !dismissed ? (
        <motion.aside
          key={`${locale}-reading-confirmation`}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          aria-label={text.title}
          className={styles.confirmationSheet}
          exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          transition={{ bounce: 0, duration: 0.34, type: 'spring' }}
        >
          <div className={styles.sheetHeader}>
            <p className={styles.sheetKicker}>{data.confidence}</p>
            <h3>{text.title}</h3>
          </div>
          <p className={styles.confirmQuestion}>{text.intro}</p>
          <div className={styles.readingCard}>
            <span>{text.readingLabel}</span>
            <strong>{data.interpretedReading}</strong>
          </div>
          <p className={styles.sheetReason}>{text.reason}</p>
          <button
            className={`${styles.controlButton} ${styles.primaryControl}`}
            onClick={handleConfirm}
            type="button"
          >
            {text.confirm}
          </button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
