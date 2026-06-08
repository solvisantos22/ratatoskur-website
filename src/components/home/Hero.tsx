import type { Locale } from '@/i18n/routing';
import { ButtonLink } from '@/components/ui/ButtonLink';
import styles from './Home.module.css';

const copy: Record<
  Locale,
  {
    kicker: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    previewProblem: string;
    previewWorkLabel: string;
    previewModeLabel: string;
    previewModes: string[];
    previewFeedback: string;
  }
> = {
  en: {
    kicker: 'AI math coach for handwritten work',
    title: 'Math feedback that reads the work',
    lead:
      'Students solve by hand. Ratatoskur reads the page, checks the answer, and explains the next move.',
    primaryCta: 'Try the demo',
    secondaryCta: 'Contact us',
    previewProblem: 'Solve 2x + 5 = 17',
    previewWorkLabel: 'Student notebook',
    previewModeLabel: 'Feedback modes',
    previewModes: ['Hint', 'Check', 'Reveal'],
    previewFeedback: 'Try subtracting 5 from both sides first.',
  },
  is: {
    kicker: 'AI stærðfræðiaðstoð fyrir handskrifaðar lausnir',
    title: 'Endurgjöf sem les vinnuna',
    lead:
      'Nemendur leysa í höndunum. Ratatoskur les síðuna, fer yfir svarið og útskýrir næsta skref.',
    primaryCta: 'Prófa sýnishorn',
    secondaryCta: 'Hafa samband',
    previewProblem: 'Leystu 2x + 5 = 17',
    previewWorkLabel: 'Vinnubók nemanda',
    previewModeLabel: 'Hamir',
    previewModes: ['Vísbending', 'Fara yfir lausn', 'Sýna lausn'],
    previewFeedback: 'Prófaðu fyrst að draga 5 frá báðum megin.',
  },
};

type HeroProps = {
  locale: Locale;
};

export function Hero({ locale }: HeroProps) {
  const text = copy[locale];

  return (
    <section className={styles.hero} data-hero>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>{text.kicker}</p>
        <h1>{text.title}</h1>
        <p className={styles.heroLead}>{text.lead}</p>
        <div className={styles.heroActions}>
          <ButtonLink href="#demo" tone="espresso">
            {text.primaryCta}
          </ButtonLink>
          <ButtonLink href="#contact" tone="quiet">
            {text.secondaryCta}
          </ButtonLink>
        </div>
      </div>

      <div aria-hidden="true" className={styles.heroAppPreview}>
        <div className={styles.previewDevice}>
          <div className={styles.previewScreen}>
            <div className={styles.previewTopBar}>
              <strong>Ratatoskur</strong>
              <span>{text.previewProblem}</span>
            </div>
            <div className={styles.previewPaper}>
              <span>{text.previewWorkLabel}</span>
              <div className={styles.previewEquation}>
                <i>2x + 5 = 17</i>
                <i>2x = 12</i>
                <i>x = 6</i>
              </div>
            </div>
            <div className={styles.previewModes}>
              <span>{text.previewModeLabel}</span>
              <div>
                {text.previewModes.map((mode) => (
                  <b key={mode}>{mode}</b>
                ))}
              </div>
            </div>
            <p className={styles.previewFeedback}>{text.previewFeedback}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
