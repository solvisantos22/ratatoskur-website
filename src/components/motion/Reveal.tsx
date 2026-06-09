'use client';

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  RefCallback,
} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import styles from './Reveal.module.css';

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'li';
  children: ReactNode;
  delay?: number;
  variant?: 'rise' | 'lift' | 'sheet' | 'focus' | 'trace';
};

export function Reveal({
  as = 'div',
  children,
  className,
  delay = 0,
  style: propStyle,
  variant = 'rise',
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const setNodeRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const node = ref.current;
    if (!node) return;
    const readyFrame = window.requestAnimationFrame(() => {
      setReady(true);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.16,
      },
    );

    observer.observe(node);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      observer.disconnect();
    };
  }, [reduceMotion]);

  const style = {
    '--reveal-delay': `${delay}ms`,
    ...propStyle,
  } as CSSProperties;
  const revealProps = {
    ...props,
    className: [styles.reveal, className].filter(Boolean).join(' '),
    'data-ready': ready && !reduceMotion,
    'data-variant': variant,
    'data-visible': visible || reduceMotion,
    style,
  };

  if (as === 'li') {
    return (
      <li {...revealProps} ref={setNodeRef as RefCallback<HTMLLIElement>}>
        {children}
      </li>
    );
  }

  if (as === 'article') {
    return (
      <article
        {...revealProps}
        ref={setNodeRef as RefCallback<HTMLElement>}
      >
        {children}
      </article>
    );
  }

  return (
    <div {...revealProps} ref={setNodeRef as RefCallback<HTMLDivElement>}>
      {children}
    </div>
  );
}
