import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/components/motion/Reveal';
import { type Locale } from '@/i18n/routing';
import { getAllPosts } from '@/lib/updates';
import { isSupportedLocale } from '@/lib/locales';
import { createPageMetadata } from '@/lib/metadata';
import styles from '@/components/content/ContentPages.module.css';

const copy: Record<
  Locale,
  {
    label: string;
    title: string;
    lead: string;
    signal: string;
    signalLead: string;
    entry: string;
    readMore: string;
    emptyTitle: string;
    emptyLead: string;
  }
> = {
  en: {
    label: 'Updates',
    title: 'Build notes from the notebook',
    lead: 'Short entries on validation, pilots, and the choices behind Ratatoskur as it becomes a working learning tool.',
    signal: 'Product journal',
    signalLead: 'Decisions, tests, and field notes from turning the notebook into a product.',
    entry: 'Notebook entry',
    readMore: 'Read the update',
    emptyTitle: 'No updates yet',
    emptyLead: 'When there is a useful validation note or product decision, it will appear here.',
  },
  is: {
    label: 'Fréttir',
    title: 'Vinnubókarfærslur úr þróuninni',
    lead: 'Stuttar færslur um prófanir, samstarf við skóla og ákvarðanirnar sem móta Ratatoskur sem námsverkfæri.',
    signal: 'Vörudagbók',
    signalLead: 'Ákvarðanir, prófanir og vettvangsnótur úr þróun vinnubókarinnar.',
    entry: 'Vinnubókarfærsla',
    readMore: 'Lesa færsluna',
    emptyTitle: 'Engar færslur enn',
    emptyLead: 'Þegar gagnleg prófunarniðurstaða eða vöruákvörðun liggur fyrir birtist hún hér.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  return createPageMetadata(rawLocale, 'updates');
}

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const pageCopy = copy[locale];
  const posts = getAllPosts(locale);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={`${styles.hero} ${styles.updatesHero}`}>
          <Reveal className={styles.heroCopy}>
            <p className={styles.sectionLabel}>{pageCopy.label}</p>
            <h1 className={styles.title}>{pageCopy.title}</h1>
            <p className={styles.lead}>{pageCopy.lead}</p>
          </Reveal>
          <Reveal className={styles.journalSignal} delay={90} variant="focus" aria-label={pageCopy.signal}>
            <span>{pageCopy.signal}</span>
            <p>{pageCopy.signalLead}</p>
          </Reveal>
        </header>

        <section className={`${styles.layout} ${styles.updatesLayout}`} aria-labelledby="updates-title">
          <div className={`${styles.article} ${styles.updatesArticle}`}>
            <h2 id="updates-title" className={styles.sectionLabel}>
              {pageCopy.entry}
            </h2>
            {posts.length > 0 ? (
              <ul className={styles.updatesList}>
                {posts.map((post, index) => (
                  <Reveal as="li" delay={index * 80} key={post.slug} className={styles.updateItem} variant="sheet">
                    <Link href={`/updates/${post.slug}`} className={styles.updateLink}>
                      <time className={styles.updateDate} dateTime={post.date}>
                        <span>{pageCopy.entry}</span>
                        {post.date}
                      </time>
                      <div className={styles.updateCopy}>
                        <h2>{post.title}</h2>
                        <p>{post.summary}</p>
                        <span className={styles.readMore}>{pageCopy.readMore}</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <Reveal className={styles.emptyState} variant="sheet">
                <h2>{pageCopy.emptyTitle}</h2>
                <p>{pageCopy.emptyLead}</p>
              </Reveal>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
