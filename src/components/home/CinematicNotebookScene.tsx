'use client';

import { useEffect, useRef } from 'react';
import { createTimeline, stagger } from 'animejs';
import { useReducedMotion } from 'motion/react';

import styles from './Home.module.css';

type CinematicNotebookSceneProps = {
  feedback: string;
  modeLabel: string;
  modes: string[];
  problem: string;
  workLabel: string;
};

const writtenSteps = ['2x + 5 = 17', '2x = 12', 'x = 6'];

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function CinematicNotebookScene({
  feedback,
  modeLabel,
  modes,
  problem,
  workLabel,
}: CinematicNotebookSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return undefined;

    const hero = root.closest<HTMLElement>('[data-hero]');
    const inkPaths = Array.from(
      root.querySelectorAll<SVGPathElement>('[data-ink-path]'),
    );
    const mathLines = Array.from(
      root.querySelectorAll<HTMLElement>('[data-math-line]'),
    );
    const problemCard = root.querySelector<HTMLElement>('[data-problem-card]');
    const scan = root.querySelector<HTMLElement>('[data-scan]');
    const modePills = Array.from(
      root.querySelectorAll<HTMLElement>('[data-mode-pill]'),
    );
    const feedbackCard = root.querySelector<HTMLElement>('[data-feedback-card]');

    if (!problemCard || !scan || !feedbackCard || !inkPaths.length) {
      return undefined;
    }

    for (const path of inkPaths) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }

    const animatedElements = [
      problemCard,
      scan,
      feedbackCard,
      ...mathLines,
      ...modePills,
      ...inkPaths,
    ];

    problemCard.style.opacity = '0';
    problemCard.style.transform = 'translateY(14px)';
    scan.style.opacity = '0';
    scan.style.transform = 'translateX(-120%)';
    feedbackCard.style.opacity = '0';
    feedbackCard.style.transform = 'translateY(16px)';

    for (const line of mathLines) {
      line.style.opacity = '0';
      line.style.transform = 'translateY(10px)';
    }

    for (const pill of modePills) {
      pill.style.opacity = '0.16';
      pill.style.transform = 'translateY(12px) scale(0.96)';
    }

    const timeline = createTimeline({
      autoplay: false,
      defaults: {
        ease: 'outQuart',
      },
    })
      .add(problemCard, { opacity: [0, 1], translateY: [14, 0], duration: 520 }, 80)
      .add(
        inkPaths,
        {
          opacity: [0.5, 1],
          strokeDashoffset: 0,
          duration: 980,
          delay: stagger(190),
        },
        380,
      )
      .add(
        mathLines,
        {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 420,
          delay: stagger(170),
        },
        480,
      )
      .add(scan, { opacity: [0, 0.82], translateX: ['-120%', '118%'], duration: 1050 }, 1180)
      .add(scan, { opacity: 0, duration: 220 }, 2190)
      .add(
        modePills,
        {
          opacity: [0.16, 1],
          translateY: [12, 0],
          scale: [0.96, 1],
          duration: 420,
          delay: stagger(105),
        },
        1780,
      )
      .add(feedbackCard, { opacity: [0, 1], translateY: [16, 0], duration: 520 }, 2220);

    const updateTimeline = () => {
      if (!hero) {
        timeline.play();
        return;
      }

      const rect = hero.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const scrollDistance = Math.max(1, hero.offsetHeight - viewport * 0.42);
      const progress = clamp((-rect.top + viewport * 0.08) / scrollDistance);

      timeline.seek(timeline.duration * progress, true);
    };

    let frame = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateTimeline);
    };

    updateTimeline();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      timeline.revert();

      for (const element of animatedElements) {
        element.removeAttribute('style');
      }
    };
  }, [reduceMotion]);

  return (
    <div
      aria-hidden="true"
      className={styles.cinematicScene}
      data-reduced-motion={reduceMotion ? 'true' : 'false'}
      ref={rootRef}
    >
      <div className={styles.sceneTopBar}>
        <strong>Ratatoskur</strong>
        <span>{problem}</span>
      </div>

      <div className={styles.scenePaper}>
        <div className={styles.scenePaperHeader}>
          <span>{workLabel}</span>
          <strong>Page 1</strong>
        </div>

        <div className={styles.sceneProblemCard} data-problem-card>
          <span>{problem}</span>
          <b>2x + 5 = 17</b>
        </div>

        <svg
          className={styles.sceneInk}
          focusable="false"
          viewBox="0 0 640 360"
        >
          <path
            data-ink-path=""
            d="M96 104 C126 88 167 95 191 108 C214 120 248 115 272 99 C301 81 347 91 376 107 C414 128 463 115 509 93"
          />
          <path
            data-ink-path=""
            d="M134 184 C174 166 217 176 252 190 C291 206 334 192 361 174 C386 158 429 162 469 184"
          />
          <path
            data-ink-path=""
            d="M174 270 C210 246 252 250 285 270 C316 289 362 286 403 260"
          />
        </svg>

        <div className={styles.sceneMathLines}>
          {writtenSteps.map((step) => (
            <i data-math-line="" key={step}>
              {step}
            </i>
          ))}
        </div>

        <div className={styles.sceneScan} data-scan="" />
      </div>

      <div className={styles.sceneModePanel} data-mode-panel="">
        <span>{modeLabel}</span>
        <div>
          {modes.map((mode) => (
            <b data-mode-pill="" key={mode}>
              {mode}
            </b>
          ))}
        </div>
      </div>

      <p className={styles.sceneFeedback} data-feedback-card="">
        {feedback}
      </p>
    </div>
  );
}
