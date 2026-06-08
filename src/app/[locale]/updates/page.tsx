import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { getAllPosts } from '@/lib/updates';
import { isSupportedLocale } from '@/lib/locales';
import styles from '@/components/content/ContentPages.module.css';

const copy: Record<
  Locale,
  {
    label: string;
    title: string;
    lead: string;
    noteLabel: string;
    note: string;
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
    noteLabel: 'Publication rhythm',
    note: 'We publish when there is a real product or research decision to explain.',
    entry: 'Notebook entry',
    readMore: 'Read the update',
    emptyTitle: 'No updates yet',
    emptyLead: 'When there is a useful validation note or product decision, it will appear here.',
  },
  is: {
    label: 'Fréttir',
    title: 'Vinnubókarfærslur úr þróuninni',
    lead: 'Stuttar færslur um prófanir, samstarf við skóla og ákvarðanirnar sem móta Ratatoskur sem námsverkfæri.',
    noteLabel: 'Útgáfutaktur',
    note: 'Við birtum þegar það er raunveruleg vöru- eða rannsóknarákvörðun sem þarf að útskýra.',
    entry: 'Vinnubókarfærsla',
    readMore: 'Lesa færsluna',
    emptyTitle: 'Engar færslur enn',
    emptyLead: 'Þegar gagnleg prófunarniðurstaða eða vöruákvörðun liggur fyrir birtist hún hér.',
  },
};

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const pageCopy = copy[locale];
  const posts = getAllPosts(locale);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.sectionLabel}>{pageCopy.label}</p>
            <h1 className={styles.title}>{pageCopy.title}</h1>
            <p className={styles.lead}>{pageCopy.lead}</p>
          </div>
          <div className={styles.heroNote} aria-label={pageCopy.noteLabel}>
            <span>{pageCopy.noteLabel}</span>
            <p>{pageCopy.note}</p>
          </div>
        </header>

        <section className={styles.layout} aria-labelledby="updates-title">
          <div className={styles.article}>
            <h2 id="updates-title" className={styles.sectionLabel}>
              {pageCopy.entry}
            </h2>
            {posts.length > 0 ? (
              <ul className={styles.updatesList}>
                {posts.map((post) => (
                  <li key={post.slug} className={styles.updateItem}>
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
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <h2>{pageCopy.emptyTitle}</h2>
                <p>{pageCopy.emptyLead}</p>
              </div>
            )}
          </div>

          <aside className={styles.aside} aria-label={pageCopy.noteLabel}>
            <strong>{pageCopy.noteLabel}</strong>
            <p>{pageCopy.note}</p>
          </aside>
        </section>
      </div>
    </main>
  );
}
