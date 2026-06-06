import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { Button } from '../Button';
import { DeviceFrame } from '../DeviceFrame';

export function Hero() {
  const t = useTranslations('hero');
  return (
    <section data-hero style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px 40px', display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)', gap: 40, alignItems: 'center' }}>
      <Reveal>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12, fontWeight: 600, color: 'var(--accent-2)' }}>{t('eyebrow')}</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.05, margin: '12px 0 0', letterSpacing: '-0.03em' }}>{t('title')}</h1>
        <p style={{ marginTop: 16, fontSize: '1.15rem', color: 'var(--ink-2)', maxWidth: '46ch' }}>{t('subtitle')}</p>
        <div style={{ marginTop: 26, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button href="#contact">{t('ctaContact')}</Button>
          <Button href="#how" variant="ghost">{t('ctaHow')} →</Button>
        </div>
      </Reveal>
      <Reveal delay={80} className="hero-device">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DeviceFrame src="/app/mode-picker.png" alt="Ratatoskur mode picker: Hint, Check, Reveal" width={300} ratio={384 / 326} />
        </div>
      </Reveal>
    </section>
  );
}
