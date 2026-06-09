'use client';

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
  const text = copy[locale];
  const data = demoCopy[locale];

  const handleConfirm = () => {
    onConfirm?.();
  };

  const content = (
    <>
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
    </>
  );

  return open ? (
    <aside aria-label={text.title} className={styles.confirmationSheet}>
      {content}
    </aside>
  ) : null;
}
