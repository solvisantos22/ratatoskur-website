import type { Locale } from '@/i18n/routing';
import { Reveal } from '@/components/motion/Reveal';
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
    title: 'How a student actually moves through a problem',
    lead:
      'The app follows the rhythm of the notebook: write a line, ask for help when stuck, keep working, then check or reveal after an attempt.',
    steps: [
      {
        title: 'Write what is known',
        body: 'The student starts from the problem and puts the first useful line on the page.',
      },
      {
        title: 'Ask at the right moment',
        body: 'A hint can respond to the partial attempt without taking ownership of the solution.',
      },
      {
        title: 'Keep the work visible',
        body: 'The next lines stay on the same page, so feedback is always connected to the written attempt.',
      },
      {
        title: 'Check before moving on',
        body: 'When the app is uncertain, it asks the student to confirm the reading before judging the answer.',
      },
    ],
    calloutTitle: 'Teacher analytics are a future layer',
    calloutBody:
      'Ratatoskur starts with the student notebook. Classroom analytics can come later as a consent-aware layer, not as a shipped capability.',
  },
  is: {
    title: 'Hvernig nemandi vinnur raunverulega í gegnum dæmi',
    lead:
      'Appið fylgir takti vinnubókarinnar: skrifa línu, biðja um hjálp þegar maður festist, halda áfram og fara svo yfir eða sjá lausn eftir tilraun.',
    steps: [
      {
        title: 'Skrifa það sem er vitað',
        body: 'Nemandinn byrjar á dæminu og setur fyrstu gagnlegu línuna á síðuna.',
      },
      {
        title: 'Spyrja á réttu augnabliki',
        body: 'Vísbending getur svarað ókláraðri tilraun án þess að taka lausnina af nemandanum.',
      },
      {
        title: 'Halda vinnunni sýnilegri',
        body: 'Næstu línur haldast á sömu síðu, svo endurgjöfin tengist alltaf handskrifuðu tilrauninni.',
      },
      {
        title: 'Yfirfara áður en haldið er áfram',
        body: 'Þegar appið er óvisst biður það nemandann um að staðfesta lesturinn áður en svarið er metið.',
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
      <Reveal className={styles.methodCopy}>
        <h2 id="method-title">{text.title}</h2>
        <p>{text.lead}</p>
        <aside className={styles.futureCallout}>
          <h3>{text.calloutTitle}</h3>
          <p>{text.calloutBody}</p>
        </aside>
      </Reveal>
      <ol className={styles.methodSteps}>
        {text.steps.map((step, index) => (
          <Reveal as="li" delay={index * 65} key={step.title}>
            <span aria-hidden="true" />
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
