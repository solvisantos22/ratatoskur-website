import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function WhyItMatters() {
  const t = useTranslations('why');
  return (
    <section id="why" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--surface-2)', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px' }}>
        <SectionHeading title={t('title')} />
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, maxWidth: 900 }}>
            <p style={{ color: 'var(--ink-2)' }}>{t('p1')}</p>
            <p style={{ color: 'var(--ink-2)' }}>{t('p2')}</p>
            <p style={{ color: 'var(--ink-2)' }}>{t('p3')}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
