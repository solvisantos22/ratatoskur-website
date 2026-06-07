import type { Locale } from '@/i18n/routing';

export type HomeAnchor = 'demo' | 'how' | 'method' | 'team' | 'contact';

export function homeAnchorHref(locale: Locale, anchor: HomeAnchor) {
  return `/${locale}#${anchor}` as const;
}

export function isRouteActive(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function shellNavigation(locale: Locale) {
  return [
    { key: 'demo', href: homeAnchorHref(locale, 'demo'), kind: 'anchor' },
    { key: 'how', href: homeAnchorHref(locale, 'how'), kind: 'anchor' },
    { key: 'research', href: '/research', kind: 'route' },
    { key: 'updates', href: '/updates', kind: 'route' },
  ] as const;
}
