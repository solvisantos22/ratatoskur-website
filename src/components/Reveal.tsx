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
  // 'idle' = SSR/no-JS default: fully visible (never ships blank). Server AND
  // client both start at 'idle', so there is no hydration mismatch; the
  // reduced-motion check and the reveal happen after hydration, in the effect.
  const [state, setState] = useState<'idle' | 'pre' | 'in'>('idle');

  /* eslint-disable react-hooks/set-state-in-effect --
     Motion is decided on the client AFTER hydration to avoid a hydration
     mismatch (server and client both render the 'idle' visible state).
     Setting state in this effect is intentional and correct here. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Reduced motion: reveal immediately, no movement.
      setState('in');
      return;
    }
    // Enhancement only: hide post-hydration, then reveal when scrolled into view.
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
  /* eslint-enable react-hooks/set-state-in-effect */

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
