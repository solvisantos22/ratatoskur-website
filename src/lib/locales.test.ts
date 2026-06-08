import { expect, test } from 'vitest';
import { isSupportedLocale } from './locales';

test('recognizes configured public locales', () => {
  expect(isSupportedLocale('en')).toBe(true);
  expect(isSupportedLocale('is')).toBe(true);
});

test('rejects unknown locale segments', () => {
  expect(isSupportedLocale('de')).toBe(false);
  expect(isSupportedLocale('')).toBe(false);
});
