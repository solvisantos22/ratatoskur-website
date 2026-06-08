import type { Locale } from '@/i18n/routing';
import styles from './Home.module.css';

const copy: Record<
  Locale,
  {
    title: string;
    lead: string;
    stories: Array<{
      label: string;
      title: string;
      body: string;
      note: string;
    }>;
  }
> = {
  en: {
    title: 'Three ways to ask for help, without leaving the page',
    lead:
      'Ratatoskur keeps the student in the notebook. The same handwritten attempt can become a nudge, a check, or a worked explanation depending on what the student needs.',
    stories: [
      {
        label: 'Hint',
        title: 'When the next line is stuck',
        body:
          'The student keeps ownership of the solution. Ratatoskur reads the written work and points to the next useful move instead of jumping to the answer.',
        note: 'Best for keeping momentum during the first attempt.',
      },
      {
        label: 'Check',
        title: 'When the work feels almost right',
        body:
          'The app checks the answer and the reasoning on the page. It can say whether the written path is on track while the page is still fresh.',
        note: 'Best for confidence before moving on.',
      },
      {
        label: 'Reveal',
        title: 'When review matters more than guessing',
        body:
          'Ratatoskur can show a full explanation after the attempt, so the student can compare the solution with their own handwriting and see the gap.',
        note: 'Best after effort, not before it.',
      },
    ],
  },
  is: {
    title: 'Þrjár leiðir til að fá hjálp án þess að yfirgefa síðuna',
    lead:
      'Ratatoskur heldur nemandanum í vinnubókinni. Sama handskrifaða tilraun getur orðið að vísbendingu, yfirferð eða útskýrðri lausn eftir því hvað nemandinn þarf.',
    stories: [
      {
        label: 'Vísbending',
        title: 'Þegar næsta lína vantar',
        body:
          'Nemandinn heldur eignarhaldi á lausninni. Ratatoskur les vinnuna og bendir á næsta gagnlega skref í stað þess að hoppa beint í svarið.',
        note: 'Hentar þegar markmiðið er að halda hugsuninni gangandi.',
      },
      {
        label: 'Fara yfir lausn',
        title: 'Þegar lausnin virðist næstum rétt',
        body:
          'Appið fer yfir svarið og rökin á síðunni. Það getur sagt hvort handskrifaða leiðin sé á réttri leið á meðan vinnan er enn fersk.',
        note: 'Hentar til að byggja öryggi áður en haldið er áfram.',
      },
      {
        label: 'Sýna lausn',
        title: 'Þegar upprifjun skiptir mestu máli',
        body:
          'Ratatoskur getur sýnt heildarskýringu eftir tilraunina, svo nemandinn geti borið hana saman við eigin vinnu og séð hvar bilið liggur.',
        note: 'Hentar eftir tilraun, ekki í staðinn fyrir hana.',
      },
    ],
  },
};

type ModeStoriesProps = {
  locale: Locale;
};

export function ModeStories({ locale }: ModeStoriesProps) {
  const text = copy[locale];

  return (
    <section className={styles.storySection} aria-labelledby="mode-stories-title">
      <div className={styles.sectionHeader}>
        <h2 id="mode-stories-title">{text.title}</h2>
        <p>{text.lead}</p>
      </div>
      <div className={styles.modeStoriesGrid}>
        {text.stories.map((story) => (
          <article className={styles.modeStory} key={story.label}>
            <span>{story.label}</span>
            <h3>{story.title}</h3>
            <p>{story.body}</p>
            <small>{story.note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
