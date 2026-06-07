import { useTranslations } from 'next-intl';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function Team() {
  const t = useTranslations('team');
  const members = [
    { name: t('m1Name'), role: t('m1Role') },
    { name: t('m2Name'), role: t('m2Role') },
  ];
  return (
    <section id="team" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 22px', scrollMarginTop: 80 }}>
      <SectionHeading title={t('title')} lead={t('lead')} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        {members.map((m, i) => (
          <Reveal key={m.name} delay={i * 60}>
            <div style={{ minWidth: 220 }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--r-pill)', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display-stack)', fontSize: 22, color: 'var(--ink)' }}>{m.name.charAt(0)}</div>
              <h3 style={{ fontSize: '1.1rem', margin: '12px 0 2px' }}>{m.name}</h3>
              <p style={{ color: 'var(--muted)', margin: 0 }}>{m.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
