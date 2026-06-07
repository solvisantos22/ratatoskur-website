import { getTranslations } from 'next-intl/server';
import { LogoMark } from '@/components/brand/LogoMark';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { homeAnchorHref } from '@/lib/site-links';
import { LanguageToggle } from './LanguageToggle';
import styles from './Shell.module.css';

const GITHUB_BACKEND = 'https://github.com/solvisantos22/ratatoskur_backend';
const GITHUB_IOS = 'https://github.com/solvisantos22/ratatoskur_ios';

export async function SiteFooter({ locale }: { locale: Locale }) {
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const footer = await getTranslations({ locale, namespace: 'footer' });

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Link href="/" className={styles.footerBrand} aria-label="Ratatoskur home">
          <LogoMark />
        </Link>

        <nav className={styles.footerNav} aria-label={footer('navigationLabel')}>
          <Link href="/">{footer('home')}</Link>
          <Link href="/research">{nav('research')}</Link>
          <Link href="/updates">{nav('updates')}</Link>
          <a href={homeAnchorHref(locale, 'contact')}>{nav('contact')}</a>
        </nav>

        <nav className={styles.repositoryNav} aria-label={footer('repositoriesLabel')}>
          <a href={GITHUB_BACKEND} target="_blank" rel="noreferrer">
            {footer('backend')}
          </a>
          <a href={GITHUB_IOS} target="_blank" rel="noreferrer">
            {footer('ios')}
          </a>
        </nav>

        <div className={styles.footerLanguage}>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
