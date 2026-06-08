import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import styles from '@/components/content/ContentPages.module.css';
import { isSupportedLocale } from '@/lib/locales';
import { createArticleMetadata } from '@/lib/metadata';
import { getPostBySlug } from '@/lib/updates';

const copy: Record<Locale, { back: string; label: string; noteLabel: string; note: string }> = {
  en: {
    back: 'Back to updates',
    label: 'Update',
    noteLabel: 'Notebook entry',
    note: 'These notes explain product and research choices as they become concrete enough to share.',
  },
  is: {
    back: 'Til baka í fréttir',
    label: 'Frétt',
    noteLabel: 'Vinnubókarfærsla',
    note: 'Þessar færslur útskýra vöru- og rannsóknarákvarðanir þegar þær eru orðnar nógu skýrar til birtingar.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  const post = getPostBySlug(slug);
  if (!post || post.locale !== rawLocale) notFound();

  return createArticleMetadata(rawLocale, {
    title: post.title,
    description: post.summary,
  });
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isSupportedLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const post = getPostBySlug(slug);
  if (!post || post.locale !== locale) notFound();
  const pageCopy = copy[locale];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <article className={styles.layout}>
          <div className={styles.article}>
            <nav aria-label={pageCopy.back}>
              <Link href="/updates" className={styles.backLink}>
                {pageCopy.back}
              </Link>
            </nav>
            <p className={styles.postMeta}>
              <span>{pageCopy.label}</span>
              <time dateTime={post.date}>{post.date}</time>
            </p>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.body}>
              <MDXRemote source={post.content} />
            </div>
          </div>

          <aside className={styles.aside} aria-label={pageCopy.noteLabel}>
            <strong>{pageCopy.noteLabel}</strong>
            <p>{pageCopy.note}</p>
          </aside>
        </article>
      </div>
    </main>
  );
}
