import type { Locale } from '@/i18n/routing';
import { AppSimulator } from '@/components/simulator/AppSimulator';
import styles from './Home.module.css';

const copy: Record<
  Locale,
  {
    title: string;
    lead: string;
    modeIntro: string;
    modes: Array<{ name: string; body: string }>;
  }
> = {
  en: {
    title: 'Try the notebook Ratatoskur students see',
    lead:
      'The demo starts when it enters view and pauses for reading confirmation, matching the app flow.',
    modeIntro: 'One written solution can become three kinds of help.',
    modes: [
      {
        name: 'Hint',
        body: 'A small nudge that keeps the student doing the thinking.',
      },
      {
        name: 'Check',
        body: 'A direct read on whether the written work is on track.',
      },
      {
        name: 'Reveal',
        body: 'A full explanation for review after the attempt.',
      },
    ],
  },
  is: {
    title: 'Prófaðu vinnubókina sem nemendur sjá',
    lead:
      'Sýnið byrjar þegar það kemur í sjónmál og stoppar við staðfestingu á lestri eins og appið.',
    modeIntro: 'Ein skrifuð lausn getur orðið að þrenns konar aðstoð.',
    modes: [
      {
        name: 'Vísbending',
        body: 'Lítil vísbending sem heldur hugsuninni hjá nemandanum.',
      },
      {
        name: 'Fara yfir',
        body: 'Bein endurgjöf um hvort skrifaða lausnin sé á réttri leið.',
      },
      {
        name: 'Sýna lausn',
        body: 'Heildarskýring til að rifja upp eftir tilraunina.',
      },
    ],
  },
};

type ProductDemoSectionProps = {
  locale: Locale;
};

export function ProductDemoSection({ locale }: ProductDemoSectionProps) {
  const text = copy[locale];

  return (
    <section className={styles.demoSection} id="demo">
      <div className={styles.demoIntro}>
        <h2>{text.title}</h2>
        <p>{text.lead}</p>
      </div>
      <div className={styles.demoStage}>
        <AppSimulator locale={locale} />
      </div>
      <div className={styles.modeExplanation} aria-label={text.modeIntro}>
        <p>{text.modeIntro}</p>
        <ul>
          {text.modes.map((mode) => (
            <li key={mode.name}>
              <strong>{mode.name}</strong>
              <span>{mode.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
