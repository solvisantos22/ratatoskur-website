/**
 * next-intl routing proxy for Next.js 16.
 *
 * Next.js 16 renamed middleware.ts -> proxy.ts and the exported function
 * from `middleware` to `proxy`. We wrap next-intl's createMiddleware result
 * with the required named export so Next.js 16 picks it up correctly.
 *
 * Deviation from baseline: file is proxy.ts (not middleware.ts), and the
 * handler is exported as `proxy` (not as default) per Next.js 16 conventions.
 */
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/', '/(en|is)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
