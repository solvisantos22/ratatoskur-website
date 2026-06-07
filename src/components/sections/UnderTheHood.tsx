import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function UnderTheHood() {
  const t = useTranslations('hood');
  const items = [
    { title: t('i1Title'), body: t('i1Body') },
    { title: t('i2Title'), body: t('i2Body') },
    { title: t('i3Title'), body: t('i3Body') },
    { title: t('i4Title'), body: t('i4Body') },
  ];
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px' }}>
      <SectionHeading title={t('title')} lead={t('lead')} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 50}>
            <h3 style={{ fontSize: '1.15rem', margin: '0 0 6px', color: 'var(--ink)' }}>{it.title}</h3>
            <p style={{ color: 'var(--ink-2)' }}>{it.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
