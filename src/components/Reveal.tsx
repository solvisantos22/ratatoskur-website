'use client';

import { useEffect, useRef, useState } from 'react';

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  // 'idle' = SSR/no-JS default: fully visible (never ships blank).
  const [state, setState] = useState<'idle' | 'pre' | 'in'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('in');
      return;
    }
    setState('pre');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setState('in');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      data-reveal={state === 'in' ? undefined : state}
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </Component>
  );
}
