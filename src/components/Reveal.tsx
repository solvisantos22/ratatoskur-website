'use client';

import { useEffect, useRef, useState } from 'react';

// Lazily resolve the initial state on the client only.
function getInitialState(): 'idle' | 'pre' | 'in' {
  if (typeof window === 'undefined') return 'idle';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'in';
  return 'pre';
}

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
  // Client resolves to 'in' (reduced-motion) or 'pre' (will animate) synchronously.
  const [state, setState] = useState<'idle' | 'pre' | 'in'>(getInitialState);

  useEffect(() => {
    const el = ref.current;
    if (!el || state === 'in') return;
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
  }, [state]);

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
