import { test, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getAllPosts, getPostBySlug } from './updates';

let dir: string;

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'updates-'));
  fs.writeFileSync(path.join(dir, 'a.mdx'), `---\ntitle: A\ndate: 2026-01-01\nlocale: en\nsummary: first\n---\nBody A`);
  fs.writeFileSync(path.join(dir, 'b.mdx'), `---\ntitle: B\ndate: 2026-02-01\nlocale: en\nsummary: second\n---\nBody B`);
  fs.writeFileSync(path.join(dir, 'c.mdx'), `---\ntitle: C\ndate: 2026-03-01\nlocale: is\nsummary: thrid\n---\nBody C`);
});
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

test('lists en posts newest first', () => {
  const posts = getAllPosts('en', dir);
  expect(posts.map((p) => p.slug)).toEqual(['b', 'a']);
});
test('filters by locale', () => {
  expect(getAllPosts('is', dir).map((p) => p.slug)).toEqual(['c']);
});
test('reads a post body by slug', () => {
  const post = getPostBySlug('a', dir);
  expect(post?.title).toBe('A');
  expect(post?.content.trim()).toBe('Body A');
});
