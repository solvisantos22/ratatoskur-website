import { describe, expect, test } from 'vitest';
import {
  createArticleMetadata,
  createPageMetadata,
  createRootMetadata,
  createSafeNoIndexMetadata,
  localizedMetadata,
} from './metadata';
import { routing, type Locale } from '@/i18n/routing';

function metadataStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(metadataStrings);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(metadataStrings);
  }
  return [];
}

function publicMetadataCopy() {
  const samples = [
    createRootMetadata(),
    ...routing.locales.flatMap((locale) => [
      createPageMetadata(locale, 'home'),
      createPageMetadata(locale, 'updates'),
      createArticleMetadata(locale, {
        title: localizedMetadata[locale].research.title,
        description: localizedMetadata[locale].research.description,
      }),
      createSafeNoIndexMetadata(locale),
    ]),
  ];

  return metadataStrings(samples).join('\n');
}

describe('metadata helpers', () => {
  test('provide localized metadata for each supported public page', () => {
    for (const locale of routing.locales) {
      expect(localizedMetadata[locale]).toHaveProperty('home');
      expect(localizedMetadata[locale]).toHaveProperty('research');
      expect(localizedMetadata[locale]).toHaveProperty('updates');

      for (const page of ['home', 'research', 'updates'] as const) {
        const metadata = createPageMetadata(locale, page);
        expect(metadata.title).toBe(localizedMetadata[locale][page].title);
        expect(metadata.description).toBe(localizedMetadata[locale][page].description);
        expect(metadata.openGraph).toMatchObject({
          title: localizedMetadata[locale][page].title,
          description: localizedMetadata[locale][page].description,
          siteName: 'Ratatoskur',
          type: 'website',
        });
        expect(metadata.twitter).toMatchObject({
          card: 'summary',
          title: localizedMetadata[locale][page].title,
          description: localizedMetadata[locale][page].description,
        });
      }
    }
  });

  test('root metadata has a title template and no invented production domain', () => {
    const metadata = createRootMetadata();

    expect(metadata.title).toEqual({
      default: 'Ratatoskur',
      template: '%s | Ratatoskur',
    });
    expect(metadata.applicationName).toBe('Ratatoskur');
    expect(metadata.metadataBase).toBeUndefined();
    expect(metadata.icons).toEqual({ icon: '/icon.svg' });
    expect(metadata.openGraph).toMatchObject({
      title: 'Ratatoskur',
      siteName: 'Ratatoskur',
      type: 'website',
    });
  });

  test('article metadata uses supplied content without exposing wrong-locale fallbacks', () => {
    const metadata = createArticleMetadata('en', {
      title: 'Notebook entry',
      description: 'A short note about validation work.',
    });

    expect(metadata.title).toBe('Notebook entry');
    expect(metadata.description).toBe('A short note about validation work.');
    expect(metadata.openGraph).toMatchObject({
      title: 'Notebook entry',
      description: 'A short note about validation work.',
      type: 'article',
    });
  });

  test('safe noindex metadata is localized and crawl-safe', () => {
    const expected: Record<Locale, string> = {
      en: 'Page not found',
      is: 'Síða fannst ekki',
    };

    for (const locale of routing.locales) {
      const metadata = createSafeNoIndexMetadata(locale);
      expect(metadata.title).toBe(expected[locale]);
      expect(metadata.robots).toEqual({ index: false, follow: false });
    }
  });

  test('public metadata avoids prohibited people, funding, analytics, and internal copy', () => {
    const publicCopy = publicMetadataCopy();
    const prohibitedClaims = [
      /Sævar/i,
      /Saevar/i,
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
});
