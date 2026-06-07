'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { composePathWithQueryAndHash } from './menu-utils';
import styles from './Shell.module.css';

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  function switchLocale(nextLocale: Locale) {
    const href = composePathWithQueryAndHash(
      pathname,
      window.location.search,
      window.location.hash,
    );
    router.replace(href, { locale: nextLocale });
  }

  return (
    <div className={styles.languageToggle} role="group" aria-label={t('label')}>
      {routing.locales.map((option) => {
        const current = option === locale;

        return (
          <button
            key={option}
            type="button"
            className={styles.languageOption}
            aria-current={current ? 'true' : undefined}
            aria-label={t(option)}
            onClick={() => switchLocale(option)}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
