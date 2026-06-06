import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LogoMark } from './LogoMark';
import { LanguageToggle } from './LanguageToggle';

export function Nav() {
  const t = useTranslations('nav');
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 'var(--z-nav)' as unknown as number, background: 'color-mix(in oklch, var(--bg) 88%, transparent)', backdropFilter: 'saturate(120%) blur(8px)', borderBottom: '1px solid var(--surface-2)' }}>
      <nav style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 18, padding: '12px 22px' }}>
        <Link href="/"><LogoMark size={26} /></Link>
        <div style={{ display: 'flex', gap: 16, marginLeft: 14, fontSize: 14 }} className="nav-links">
          <a href="#how">{t('how')}</a>
          <a href="#why">{t('why')}</a>
          <Link href="/research">{t('research')}</Link>
          <a href="#team">{t('team')}</a>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <LanguageToggle />
          <a href="#contact" className="press" style={{ background: 'var(--cta)', color: 'var(--on-accent)', fontWeight: 600, fontSize: 14, padding: '8px 14px', borderRadius: 'var(--r-md)' }}>{t('contact')}</a>
        </div>
      </nav>
    </header>
  );
}
