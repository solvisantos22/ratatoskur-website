import type { Locale } from '@/i18n/routing';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CinematicNotebookScene } from './CinematicNotebookScene';
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

      <CinematicNotebookScene
        feedback={text.previewFeedback}
        modeLabel={text.previewModeLabel}
        modes={text.previewModes}
        problem={text.previewProblem}
        workLabel={text.previewWorkLabel}
      />
    </section>
  );
}
