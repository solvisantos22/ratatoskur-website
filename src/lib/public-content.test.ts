import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

function mdxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return mdxFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
  });
}

function contentSources() {
  const contentRoot = path.join(process.cwd(), 'content');
  return mdxFiles(contentRoot).map((file) => readFileSync(file, 'utf8'));
}

test('public MDX content avoids prohibited people, funding, analytics, and internal copy', () => {
  const publicCopy = contentSources().join('\n');
  const prohibitedClaims = [
    /Saevar/i,
    /Sævar/i,
    /Tækniþróunarsjóður\s+Fræ/i,
    /\bFræ\b.{0,80}\b(support|supported|fund|funded|funding|grant|application)\b/i,
    /\b(support|supported|fund|funded|funding|grant|application)\b.{0,80}\bFræ\b/i,
    /\bFræ\b.{0,80}\b(stutt|styður|styrkur|styrkt|fjármagnað|fjármögnun|umsókn)\b/i,
    /\b(stutt|styður|styrkur|styrkt|fjármagnað|fjármögnun|umsókn)\b.{0,80}\bFræ\b/i,
    /\b(currently|now|today)\b.{0,80}\b(supported|funded|funding)\b/i,
    /\b(núna|í dag|sem stendur)\b.{0,80}\b(stutt|styrkt|fjármagnað)\b/i,
    /\b(shipped|current|live)\b.{0,80}\b(teacher analytics|teacher insights|teacher dashboard)\b/i,
    /\b(teacher analytics|teacher insights|teacher dashboard)\b.{0,80}\b(shipped|current|live)\b/i,
    /\b(temporary|placeholder|redesign|rebuilt|navigable)\b/i,
    /\b(bráðabirgða|endurhönnun|endurbyggt)\b/i,
  ];

  for (const claim of prohibitedClaims) {
    expect(publicCopy).not.toMatch(claim);
  }
});
