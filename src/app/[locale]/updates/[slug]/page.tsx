import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug } from '@/lib/updates';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 22px' }}>
      <time style={{ color: 'var(--muted)', fontSize: 13 }}>{post.date}</time>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '6px 0 24px', lineHeight: 1.1 }}>{post.title}</h1>
      <article style={{ color: 'var(--ink-2)', lineHeight: 1.7 }}>
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
