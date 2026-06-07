import type { Locale } from '@/i18n/routing';

export type HomeAnchor = 'demo' | 'how' | 'method' | 'team' | 'contact';

export function homeAnchorHref(locale: Locale, anchor: HomeAnchor) {
  return `/${locale}#${anchor}` as const;
}

export function isRouteActive(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}
