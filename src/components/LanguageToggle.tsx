'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label="Language" style={{ display: 'inline-flex', gap: 2, border: '1px solid var(--surface-2)', borderRadius: 'var(--r-pill)', padding: 2 }}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-current={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
          className="press"
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--r-pill)',
            fontSize: 13,
            fontWeight: 600,
            background: l === locale ? 'var(--cta)' : 'transparent',
            color: l === locale ? 'var(--on-accent)' : 'var(--ink-2)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
