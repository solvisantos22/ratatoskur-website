import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import styles from '@/components/content/ContentPages.module.css';
import { type Locale } from '@/i18n/routing';
import { isSupportedLocale } from '@/lib/locales';

function loadResearch(locale: Locale) {
  const dir = path.join(process.cwd(), 'content', 'research');
  const file = path.join(dir, `${locale}.mdx`);
  const fallback = path.join(dir, 'en.mdx');
  const target = fs.existsSync(file) ? file : fallback;
  return matter(fs.readFileSync(target, 'utf8'));
}

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const { data, content } = loadResearch(locale);
  const title = String(data.title ?? 'Research and approach');
  const summary = data.summary ? String(data.summary) : undefined;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.sectionLabel}>{locale === 'is' ? 'Rannsókn' : 'Research'}</p>
            <h1 className={styles.title}>{title}</h1>
            {summary ? <p className={styles.lead}>{summary}</p> : null}
          </div>
          <div className={styles.heroNote} aria-label={locale === 'is' ? 'Nálgun' : 'Approach'}>
            <span>{locale === 'is' ? 'Vinnubók, ekki auglýsing' : 'Notebook, not a brochure'}</span>
            <p>
              {locale === 'is'
                ? 'Sönnunargögnin þurfa að passa við hvernig nemendur leysa dæmi.'
                : 'The evidence has to match how students actually solve problems.'}
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <article className={styles.article} aria-labelledby="research-title">
            <p className={styles.articleMeta}>{locale === 'is' ? 'Aðferð og mat' : 'Method and evaluation'}</p>
            <h2 id="research-title" className={styles.sectionLabel}>
              {locale === 'is' ? 'Lesefni' : 'Reading notes'}
            </h2>
            <div className={styles.body}>
              <MDXRemote source={content} />
            </div>
          </article>

          <aside className={styles.aside} aria-label={locale === 'is' ? 'Áherslur' : 'Editorial note'}>
            <strong>{locale === 'is' ? 'Hvað skiptir máli' : 'What matters'}</strong>
            <p>
              {locale === 'is'
                ? 'Handskrift, staðfesting og gagnleg endurgjöf eru metin sem aðskildir hlutar.'
                : 'Handwriting, confirmation, and useful feedback are evaluated as separate parts.'}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
