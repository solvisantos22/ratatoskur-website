import { getTranslations } from 'next-intl/server';
import { LogoMark } from '@/components/brand/LogoMark';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { homeAnchorHref, shellNavigation } from '@/lib/site-links';
import { LanguageToggle } from './LanguageToggle';
import { MobileMenu } from './MobileMenu';
import styles from './Shell.module.css';

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const links = shellNavigation(locale);

  const navigation = links.map((item) =>
    item.kind === 'route' ? (
      <Link key={item.key} href={item.href} className={styles.navLink}>
        {t(item.key)}
      </Link>
    ) : (
      <a key={item.key} href={item.href} className={styles.navLink}>
        {t(item.key)}
      </a>
    ),
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brandLink} aria-label="Ratatoskur home">
          <LogoMark compact priority />
        </Link>

        <nav className={styles.desktopNav} aria-label={t('primaryLabel')}>
          {navigation}
        </nav>

        <div className={styles.desktopActions}>
          <LanguageToggle />
          <a className={styles.contactLink} href={homeAnchorHref(locale, 'contact')}>
            {t('contact')}
          </a>
        </div>

        <div className={styles.mobileOnly}>
          <MobileMenu openLabel={t('openMenu')} closeLabel={t('closeMenu')}>
            <nav className={styles.mobileNav} aria-label={t('primaryLabel')}>
              {navigation}
              <a className={styles.mobileContactLink} href={homeAnchorHref(locale, 'contact')}>
                {t('contact')}
              </a>
            </nav>
            <div className={styles.mobileLanguage}>
              <LanguageToggle />
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
