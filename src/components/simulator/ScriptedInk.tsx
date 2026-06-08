'use client';

import { motion } from 'motion/react';

import styles from './AppSimulator.module.css';

type ScriptedInkProps = {
  animate: boolean;
  reducedMotion: boolean;
  runId: number;
};

const paths = [
  'M36 78 C58 65 84 64 106 74 C126 83 129 101 115 113 C101 127 73 122 68 103 C64 88 78 72 103 60 M142 61 L176 119 M176 61 L142 119 M217 73 C237 69 255 69 274 74 M219 101 C239 99 257 99 276 103 M322 59 L322 121 M311 70 C318 62 328 58 338 60 M376 76 C394 66 420 65 437 77 C454 89 448 109 431 118 C414 127 388 123 378 108 C367 91 380 77 403 72',
  'M39 177 C60 163 88 163 108 174 C126 184 128 202 114 214 C99 227 74 222 68 204 C63 188 78 172 103 161 M142 162 L176 220 M176 162 L142 220 M222 181 C241 178 260 178 278 182 M222 204 C242 202 260 202 279 206 M323 166 C344 155 372 160 379 178 C386 197 367 214 342 216 C317 218 302 201 313 185 C322 173 344 172 362 181',
  'M57 263 L95 263 M77 244 L77 302 M142 252 C158 238 186 240 196 255 C208 273 190 293 163 295 C142 297 128 285 130 270 C132 256 148 248 170 247 M237 259 C255 256 273 256 291 260 M238 284 C256 282 274 282 292 286 M337 241 C328 258 316 276 306 292 M337 241 L337 304 M309 281 L372 281',
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
      viewBox="0 0 470 340"
    >
      {paths.map((path, index) => (
        <motion.path
          key={`${runId}-${index}`}
          animate={
            shouldAnimate
              ? { strokeDashoffset: 0 }
              : { strokeDashoffset: 0 }
          }
          className={styles.inkPath}
          d={path}
          initial={shouldAnimate ? { strokeDashoffset: 1 } : false}
          pathLength="1"
          transition={{
            delay: index * 0.42,
            duration: 0.78,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}
