import { routing, type Locale } from '@/i18n/routing';

export function isSupportedLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
