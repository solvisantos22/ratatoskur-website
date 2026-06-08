import Image from 'next/image';
import type { Locale } from '@/i18n/routing';
import styles from './Home.module.css';

const copy: Record<
  Locale,
  {
    title: string;
    lead: string;
    people: Array<{
      name: string;
      role: string;
      body: string;
      image: string;
      width: number;
      height: number;
      alt: string;
    }>;
  }
> = {
  en: {
    title: 'Made by a small team close to the problem',
    lead:
      'Ratatoskur is shaped by product engineering, AI systems, and the practical details of helping students work through math on an iPad.',
    people: [
      {
        name: 'Sölvi Santos',
        role: 'Product and engineering',
        body:
          'Focuses on the product direction, website, and the bridge between the app experience and the learning workflow.',
        image: '/team/solvi.jpg',
        width: 400,
        height: 400,
        alt: 'Portrait of Sölvi Santos',
      },
      {
        name: 'Jóhannes Reykdal Einarsson',
        role: 'AI and iOS engineering',
        body:
          'Focuses on the app, model behavior, and making handwritten math feedback feel useful inside the student notebook.',
        image: '/team/johannes.jpg',
        width: 460,
        height: 460,
        alt: 'Portrait of Jóhannes Reykdal Einarsson',
      },
    ],
  },
  is: {
    title: 'Smíðað af litlu teymi nálægt vandanum',
    lead:
      'Ratatoskur er mótað af vöruhugsun, verkfræði, gervigreind og smáatriðunum sem skipta máli þegar nemendur vinna stærðfræði á iPad.',
    people: [
      {
        name: 'Sölvi Santos',
        role: 'Vara og verkfræði',
        body:
          'Sinnir vörustefnu, vefsíðu og tengingunni milli upplifunar í appinu og námsflæðisins.',
        image: '/team/solvi.jpg',
        width: 400,
        height: 400,
        alt: 'Andlitsmynd af Sölva Santos',
      },
      {
        name: 'Jóhannes Reykdal Einarsson',
        role: 'Gervigreind og iOS verkfræði',
        body:
          'Sinnir appinu, hegðun líkana og því að gera endurgjöf á handskrifaða stærðfræði gagnlega í vinnubók nemandans.',
        image: '/team/johannes.jpg',
        width: 460,
        height: 460,
        alt: 'Andlitsmynd af Jóhannesi Reykdal Einarssyni',
      },
    ],
  },
};

type TeamSectionProps = {
  locale: Locale;
};

export function TeamSection({ locale }: TeamSectionProps) {
  const text = copy[locale];

  return (
    <section className={styles.teamSection} id="team" aria-labelledby="team-title">
      <div className={styles.sectionHeader}>
        <h2 id="team-title">{text.title}</h2>
        <p>{text.lead}</p>
      </div>
      <div className={styles.teamGrid}>
        {text.people.map((person) => (
          <article className={styles.teamCard} key={person.name}>
            <Image
              src={person.image}
              width={person.width}
              height={person.height}
              sizes="(max-width: 760px) 100vw, 320px"
              alt={person.alt}
              className={styles.teamImage}
            />
            <div>
              <h3>{person.name}</h3>
              <p className={styles.teamRole}>{person.role}</p>
              <p>{person.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
