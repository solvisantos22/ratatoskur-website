import type { Locale } from '@/i18n/routing';
import styles from './Home.module.css';

const copy: Record<
  Locale,
  {
    title: string;
    lead: string;
    steps: Array<{ title: string; body: string }>;
    calloutTitle: string;
    calloutBody: string;
  }
> = {
  en: {
    title: 'How feedback stays tied to the work',
    lead:
      'Ratatoskur starts with the problem image and the handwritten page. The selected mode shapes the response, and the app pauses when it needs the student to read before moving on.',
    steps: [
      {
        title: 'Problem image',
        body: 'The app begins with the exercise, so the model has the same prompt the student sees.',
      },
      {
        title: 'Handwritten work',
        body: 'The student solves with Apple Pencil. The page stays visible while feedback is requested.',
      },
      {
        title: 'Mode-specific feedback',
        body: 'Hint, Check, and Reveal change the kind of response without changing the notebook habit.',
      },
      {
        title: 'Reading confirmation',
        body: 'When the response needs attention, the app waits for the student to confirm before continuing.',
      },
    ],
    calloutTitle: 'Teacher analytics are a future layer',
    calloutBody:
      'Ratatoskur starts with the student notebook. Classroom analytics can come later as a consent-aware layer, not as a shipped capability.',
  },
  is: {
    title: 'Ferli sem byggir á vinnu nemandans',
    lead:
      'Varan byrjar á því sem nemendur búa þegar til: mynd af dæmi og handskrifaðri vinnu. Endurgjöfin ræðst af völdum ham og Ratatoskur biður um staðfestingu þegar mikilvægt er að vita að nemandinn hafi lesið svarið.',
    steps: [
      {
        title: 'Mynd af dæmi',
        body: 'Appið byrjar á verkefninu, svo líkanið hafi sömu spurningu og nemandinn sér.',
      },
      {
        title: 'Handskrifuð vinna',
        body: 'Nemandinn leysir með Apple Pencil. Síðan helst sýnileg á meðan beðið er um endurgjöf.',
      },
      {
        title: 'Endurgjöf eftir ham',
        body: 'Vísbending, Fara yfir lausn og Sýna lausn breyta svarinu án þess að breyta vinnubókarvenjunni.',
      },
      {
        title: 'Staðfesting á lestri',
        body: 'Þegar svarið þarf athygli bíður appið eftir staðfestingu nemandans áður en haldið er áfram.',
      },
    ],
    calloutTitle: 'Yfirsýn kennara er framtíðarlag',
    calloutBody:
      'Ratatoskur byrjar á vinnubók nemandans. Yfirsýn fyrir kennara getur komið síðar sem samþykkismeðvitað lag, ekki sem núverandi eiginleiki.',
  },
};

type MethodSectionProps = {
  locale: Locale;
};

export function MethodSection({ locale }: MethodSectionProps) {
  const text = copy[locale];

  return (
    <section className={styles.methodSection} id="method" aria-labelledby="method-title">
      <div className={styles.methodCopy}>
        <h2 id="method-title">{text.title}</h2>
        <p>{text.lead}</p>
        <aside className={styles.futureCallout}>
          <h3>{text.calloutTitle}</h3>
          <p>{text.calloutBody}</p>
        </aside>
      </div>
      <ol className={styles.methodSteps}>
        {text.steps.map((step) => (
          <li key={step.title}>
            <span aria-hidden="true" />
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
