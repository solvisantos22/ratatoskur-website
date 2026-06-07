import { describe, expect, it } from 'vitest';
import { homeAnchorHref, isRouteActive } from './site-links';

describe('homeAnchorHref', () => {
  it('builds an English home-section link', () => {
    expect(homeAnchorHref('en', 'how')).toBe('/en#how');
  });

  it('builds an Icelandic home-section link', () => {
    expect(homeAnchorHref('is', 'contact')).toBe('/is#contact');
  });
});

describe('isRouteActive', () => {
  it('matches descendant routes', () => {
    expect(isRouteActive('/updates/a-post', '/updates')).toBe(true);
  });

  it('rejects unrelated routes', () => {
    expect(isRouteActive('/updates', '/research')).toBe(false);
  });
});
