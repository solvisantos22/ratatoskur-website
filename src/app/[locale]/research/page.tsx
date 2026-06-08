import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/motion/Reveal';
import styles from '@/components/content/ContentPages.module.css';
import { type Locale } from '@/i18n/routing';
import { isSupportedLocale } from '@/lib/locales';
import { createArticleMetadata } from '@/lib/metadata';

function loadResearch(locale: Locale) {
  const dir = path.join(process.cwd(), 'content', 'research');
  const file = path.join(dir, `${locale}.mdx`);
  const fallback = path.join(dir, 'en.mdx');
  const target = fs.existsSync(file) ? file : fallback;
  return matter(fs.readFileSync(target, 'utf8'));
}

const researchCopy: Record<
  Locale,
  {
    label: string;
    visualLabel: string;
    visualTitle: string;
    visualLead: string;
    articleLabel: string;
    flow: Array<{ label: string; title: string; body: string }>;
  }
> = {
  en: {
    label: 'Research',
    visualLabel: 'Evaluation flow',
    visualTitle: 'Separate the read from the response',
    visualLead:
      'The product is judged as a chain of student-visible moments, not as one generic AI answer.',
    articleLabel: 'Research notes',
    flow: [
      {
        label: '01',
        title: 'Read the page',
        body: 'Capture the problem and the handwritten attempt, including partial work.',
      },
      {
        label: '02',
        title: 'Confirm uncertainty',
        body: 'Ask the student before treating an ambiguous reading as truth.',
      },
      {
        label: '03',
        title: 'Respond by mode',
        body: 'Measure Hint, Check, and Reveal as different jobs with different success criteria.',
      },
    ],
  },
  is: {
    label: 'Rannsókn',
    visualLabel: 'Matsferli',
    visualTitle: 'Aðskilja lestur frá svari',
    visualLead:
      'Varan er metin sem röð augnablika sem nemandinn sér, ekki sem eitt almennt gervigreindarsvar.',
    articleLabel: 'Rannsóknarnótur',
    flow: [
      {
        label: '01',
        title: 'Lesa síðuna',
        body: 'Ná í dæmið og handskrifuðu tilraunina, líka ókláraða vinnu.',
      },
      {
        label: '02',
        title: 'Staðfesta óvissu',
        body: 'Spyrja nemandann áður en óljós lestur er notaður sem staðreynd.',
      },
      {
        label: '03',
        title: 'Svara eftir ham',
        body: 'Meta Vísbendingu, Yfirferð og Lausn sem ólík verkefni með ólík markmið.',
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  const { data } = loadResearch(rawLocale);
  return createArticleMetadata(rawLocale, {
    title: String(data.title ?? 'Research and approach'),
    description: String(data.summary ?? 'How Ratatoskur evaluates handwriting and useful math feedback.'),
  });
}

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const { data, content } = loadResearch(locale);
  const title = String(data.title ?? 'Research and approach');
  const summary = data.summary ? String(data.summary) : undefined;
  const text = researchCopy[locale];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={`${styles.hero} ${styles.researchHero}`}>
          <Reveal className={styles.heroCopy}>
            <p className={styles.sectionLabel}>{text.label}</p>
            <h1 className={styles.title}>{title}</h1>
            {summary ? <p className={styles.lead}>{summary}</p> : null}
          </Reveal>
          <Reveal className={styles.researchBoard} delay={90} variant="focus" aria-label={text.visualLabel}>
            <span className={styles.boardLabel}>{text.visualLabel}</span>
            <h2>{text.visualTitle}</h2>
            <p>{text.visualLead}</p>
            <ol className={styles.pipeline}>
              {text.flow.map((step) => (
                <li key={step.title}>
                  <span>{step.label}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </header>

        <div className={`${styles.layout} ${styles.researchLayout}`}>
          <Reveal as="article" className={styles.article} aria-labelledby="research-title" variant="sheet">
            <p className={styles.articleMeta}>{locale === 'is' ? 'Aðferð og mat' : 'Method and evaluation'}</p>
            <h2 id="research-title" className={styles.sectionLabel}>
              {text.articleLabel}
            </h2>
            <div className={styles.body}>
              <MDXRemote source={content} />
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
