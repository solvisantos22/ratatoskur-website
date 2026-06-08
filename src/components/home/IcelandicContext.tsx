import type { Locale } from '@/i18n/routing';
import { Reveal } from '@/components/motion/Reveal';
import styles from './Home.module.css';

const copy: Record<
  Locale,
  {
    title: string;
    lead: string;
    points: string[];
    closing: string;
  }
> = {
  en: {
    title: 'Built for the language students use in Iceland',
    lead:
      'Math help is not only symbols. Students ask questions in everyday language, teachers explain steps with local phrasing, and the work often mixes notation with Icelandic sentences.',
    points: [
      'Feedback should understand the way Icelandic students describe a step, not force them into English.',
      'The page should respect handwritten reasoning, including partial work and crossed-out attempts.',
      'The product direction is Icelandic-first, with support claims kept tied to what the app actually does.',
    ],
    closing:
      'That is why the website shows the notebook behavior directly instead of relying on static app images or generic tutoring copy.',
  },
  is: {
    title: 'Byggt fyrir tungumálið sem nemendur nota á Íslandi',
    lead:
      'Stærðfræðiaðstoð snýst ekki bara um tákn. Nemendur spyrja á daglegu máli, kennarar útskýra skref með staðbundnu orðalagi og vinnan blandar oft saman táknum og íslenskum setningum.',
    points: [
      'Endurgjöf þarf að skilja hvernig íslenskir nemendur lýsa skrefi, ekki neyða þá yfir í ensku.',
      'Síðan þarf að virða handskrifaða hugsun, líka ókláraða vinnu og yfirstrikaðar tilraunir.',
      'Varan er þróuð með íslensku í forgangi og fullyrðingar um stuðning eru bundnar við það sem appið gerir í raun.',
    ],
    closing:
      'Þess vegna sýnir vefsíðan vinnubókarhegðunina beint í stað þess að treysta á fágaðar skjámyndir eða almenna kennslufrasa.',
  },
};

type IcelandicContextProps = {
  locale: Locale;
};

export function IcelandicContext({ locale }: IcelandicContextProps) {
  const text = copy[locale];

  return (
    <section className={styles.contextSection} aria-labelledby="icelandic-context-title">
      <Reveal className={styles.contextPanel} variant="sheet">
        <h2 id="icelandic-context-title">{text.title}</h2>
        <p>{text.lead}</p>
      </Reveal>
      <Reveal className={styles.contextNotes} delay={90}>
        <ul>
          {text.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p>{text.closing}</p>
      </Reveal>
    </section>
  );
}
