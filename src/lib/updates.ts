import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DEFAULT_DIR = path.join(process.cwd(), 'content', 'updates');

export type PostMeta = { slug: string; title: string; date: string; locale: string; summary: string };
export type Post = PostMeta & { content: string };

function normalizeDate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  return String(raw ?? '');
}

export function getAllPosts(locale: string, dir: string = DEFAULT_DIR): PostMeta[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: String(data.title ?? ''),
        date: normalizeDate(data.date),
        locale: String(data.locale ?? ''),
        summary: String(data.summary ?? ''),
      };
    })
    .filter((p) => p.locale === locale)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string, dir: string = DEFAULT_DIR): Post | null {
  const file = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return {
    slug,
    title: String(data.title ?? ''),
    date: normalizeDate(data.date),
    locale: String(data.locale ?? ''),
    summary: String(data.summary ?? ''),
    content,
  };
}
