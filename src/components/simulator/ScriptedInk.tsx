'use client';

import { motion } from 'motion/react';

import styles from './AppSimulator.module.css';

type ScriptedInkProps = {
  animate: boolean;
  reducedMotion: boolean;
  runId: number;
};

const solutionLines = [
  { text: '2x + 3 = 11', x: 76, y: 106, rotate: -1.4 },
  { text: '2x = 8', x: 104, y: 184, rotate: 0.8 },
  { text: 'x = 4', x: 134, y: 262, rotate: -0.6 },
];

export function ScriptedInk({
  animate,
  reducedMotion,
  runId,
}: ScriptedInkProps) {
  const shouldAnimate = animate && !reducedMotion;

  return (
    <svg
      aria-hidden="true"
      className={styles.scriptedInk}
      focusable="false"
      viewBox="0 0 620 340"
    >
      <g className={styles.scriptedGuides}>
        <line x1="58" x2="540" y1="122" y2="122" />
        <line x1="58" x2="540" y1="200" y2="200" />
        <line x1="58" x2="540" y1="278" y2="278" />
      </g>
      {solutionLines.map((line, index) =>
        shouldAnimate ? (
          <motion.text
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className={styles.scriptedLine}
            initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
            key={`${runId}-${line.text}`}
            style={{ transformOrigin: `${line.x}px ${line.y}px` }}
            transform={`rotate(${line.rotate} ${line.x} ${line.y})`}
            transition={{
              delay: index * 0.52,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            x={line.x}
            y={line.y}
          >
            {line.text}
          </motion.text>
        ) : (
          <text
            className={styles.scriptedLine}
            key={`${runId}-${line.text}`}
            transform={`rotate(${line.rotate} ${line.x} ${line.y})`}
            x={line.x}
            y={line.y}
          >
            {line.text}
          </text>
        ),
      )}
    </svg>
  );
}
