import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ratatoskur',
  description: 'AI math coach in Icelandic',
};

/**
 * Root layout — minimal passthrough.
 *
 * The <html> / <body> shell and font variables have been moved into
 * src/app/[locale]/layout.tsx so that lang={locale} and the font class
 * variables are applied correctly per locale (Next.js 16 + next-intl pattern).
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
