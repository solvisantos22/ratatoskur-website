import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function HowItWorks() {
  const t = useTranslations('how');
  const steps = [
    { n: 1, title: t('s1Title'), body: t('s1Body') },
    { n: 2, title: t('s2Title'), body: t('s2Body') },
    { n: 3, title: t('s3Title'), body: t('s3Body') },
  ];
  return (
    <section id="how" style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 22px', scrollMarginTop: 80 }}>
      <SectionHeading title={t('title')} lead={t('lead')} />
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 60}>
            <div style={{ fontFamily: 'var(--font-display-stack)', fontSize: 40, color: 'var(--accent)', lineHeight: 1 }}>{s.n}</div>
            <h3 style={{ fontSize: '1.25rem', margin: '10px 0 6px' }}>{s.title}</h3>
            <p style={{ color: 'var(--ink-2)' }}>{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
