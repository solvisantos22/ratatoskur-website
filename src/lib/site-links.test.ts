import { describe, expect, it } from 'vitest';
import { homeAnchorHref, isRouteActive, shellNavigation } from './site-links';

describe('homeAnchorHref', () => {
  it('builds an English home-section link', () => {
    expect(homeAnchorHref('en', 'how')).toBe('/en#how');
  });

  it('builds an Icelandic home-section link', () => {
    expect(homeAnchorHref('is', 'contact')).toBe('/is#contact');
  });
});

describe('isRouteActive', () => {
  it('matches the exact route', () => {
    expect(isRouteActive('/updates', '/updates')).toBe(true);
  });

  it('matches descendant routes', () => {
    expect(isRouteActive('/updates/a-post', '/updates')).toBe(true);
  });

  it('rejects routes that only share a prefix', () => {
    expect(isRouteActive('/updates-old', '/updates')).toBe(false);
  });

  it('rejects unrelated routes', () => {
    expect(isRouteActive('/updates', '/research')).toBe(false);
  });
});

describe('shellNavigation', () => {
  it('localizes home anchors without prefixing app routes', () => {
    expect(shellNavigation('is')).toEqual([
      { key: 'demo', href: '/is#demo', kind: 'anchor' },
      { key: 'how', href: '/is#how', kind: 'anchor' },
      { key: 'research', href: '/research', kind: 'route' },
      { key: 'updates', href: '/updates', kind: 'route' },
    ]);
  });

  it('never exposes a bare shared-navigation anchor', () => {
    expect(shellNavigation('en').every(({ href }) => !href.startsWith('#'))).toBe(true);
  });
});
