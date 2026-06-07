import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { bodyFont, displayFont } from '@/app/fonts';
import { SiteFooter } from '@/components/shell/SiteFooter';
import { SiteHeader } from '@/components/shell/SiteHeader';
import shellStyles from '@/components/shell/Shell.module.css';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'is')) notFound();
  const validatedLocale = locale as Locale;

  return (
    <html
      lang={validatedLocale}
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <SiteHeader locale={validatedLocale} />
          <div className={shellStyles.siteMain}>{children}</div>
          <SiteFooter locale={validatedLocale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
