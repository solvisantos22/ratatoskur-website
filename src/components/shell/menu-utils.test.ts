import { describe, expect, it } from 'vitest';
import { composePathWithQueryAndHash, nextFocusIndex } from './menu-utils';

describe('composePathWithQueryAndHash', () => {
  it('returns the pathname when there is no query or hash', () => {
    expect(composePathWithQueryAndHash('/research', '', '')).toBe('/research');
  });

  it('preserves query parameters without adding a malformed question mark', () => {
    expect(composePathWithQueryAndHash('/research', 'page=2', '')).toBe(
      '/research?page=2',
    );
  });

  it('normalizes query parameters that already include a question mark', () => {
    expect(composePathWithQueryAndHash('/research', '?page=2', '')).toBe(
      '/research?page=2',
    );
  });

  it('preserves hash fragments', () => {
    expect(composePathWithQueryAndHash('/updates', '', '#latest')).toBe(
      '/updates#latest',
    );
  });

  it('normalizes hash fragments that do not include the leading marker', () => {
    expect(composePathWithQueryAndHash('/updates', '', 'latest')).toBe(
      '/updates#latest',
    );
  });

  it('preserves query parameters before hash fragments', () => {
    expect(
      composePathWithQueryAndHash(
        '/updates/article',
        'utm=nav&mode=full',
        '#summary',
      ),
    ).toBe('/updates/article?utm=nav&mode=full#summary');
  });
});

describe('nextFocusIndex', () => {
  it('moves forward through middle focusable controls', () => {
    expect(nextFocusIndex(1, 4, 1)).toBe(2);
  });

  it('wraps forward from the last focusable control', () => {
    expect(nextFocusIndex(3, 4, 1)).toBe(0);
  });

  it('moves backward through middle focusable controls', () => {
    expect(nextFocusIndex(2, 4, -1)).toBe(1);
  });

  it('wraps backward from the first focusable control', () => {
    expect(nextFocusIndex(0, 4, -1)).toBe(3);
  });

  it('returns -1 when there are no focusable controls', () => {
    expect(nextFocusIndex(0, 0, 1)).toBe(-1);
  });
});
