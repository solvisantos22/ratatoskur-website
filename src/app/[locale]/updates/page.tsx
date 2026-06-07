import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllPosts } from '@/lib/updates';
import { SectionHeading } from '@/components/SectionHeading';

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('nav');
  const posts = getAllPosts(locale);
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '80px 22px' }}>
      <SectionHeading title={t('updates')} />
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 24 }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/updates/${p.slug}`} style={{ textDecoration: 'none' }}>
              <time style={{ color: 'var(--muted)', fontSize: 13 }}>{p.date}</time>
              <h3 style={{ margin: '4px 0 6px', color: 'var(--ink)' }}>{p.title}</h3>
              <p style={{ color: 'var(--ink-2)', margin: 0 }}>{p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
