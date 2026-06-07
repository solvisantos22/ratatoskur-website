import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

function loadResearch(locale: string) {
  const dir = path.join(process.cwd(), 'content', 'research');
  const file = path.join(dir, `${locale}.mdx`);
  const fallback = path.join(dir, 'en.mdx');
  const target = fs.existsSync(file) ? file : fallback;
  return matter(fs.readFileSync(target, 'utf8'));
}

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { data, content } = loadResearch(locale);
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 22px' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '0 0 12px', lineHeight: 1.1 }}>{String(data.title)}</h1>
      {data.summary && <p style={{ color: 'var(--ink-2)', fontSize: '1.1rem', marginBottom: 28 }}>{String(data.summary)}</p>}
      <article style={{ color: 'var(--ink-2)', lineHeight: 1.7 }}>
        <MDXRemote source={content} />
      </article>
    </main>
  );
}
