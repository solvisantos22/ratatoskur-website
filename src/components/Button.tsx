import type { ComponentProps } from 'react';

type Variant = 'primary' | 'ghost';

const base: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontWeight: 600, fontSize: 15, padding: '11px 18px', borderRadius: 'var(--r-md)',
  border: 'none', cursor: 'pointer', textDecoration: 'none',
};
const variants: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--cta)', color: 'var(--on-accent)' },
  ghost: { background: 'transparent', color: 'var(--accent-2)' },
};

export function Button({ variant = 'primary', style, ...props }: { variant?: Variant } & ComponentProps<'a'>) {
  return <a {...props} className="press" style={{ ...base, ...variants[variant], ...style }} />;
}
