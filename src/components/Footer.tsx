import { useTranslations } from 'next-intl';
import { LogoMark } from './LogoMark';
import { LanguageToggle } from './LanguageToggle';

const GITHUB_BACKEND = 'https://github.com/solvisantos22/ratatoskur_backend';
const GITHUB_IOS = 'https://github.com/solvisantos22/ratatoskur_ios';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer style={{ borderTop: '1px solid var(--surface-2)', background: 'var(--surface)', marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 22px', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
        <LogoMark size={24} />
        <nav style={{ display: 'flex', gap: 16, fontSize: 14 }}>
          <a href={GITHUB_BACKEND} target="_blank" rel="noreferrer">{t('github')} (backend)</a>
          <a href={GITHUB_IOS} target="_blank" rel="noreferrer">{t('github')} (iOS)</a>
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
