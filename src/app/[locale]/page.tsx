import { notFound } from 'next/navigation';
import { Hero } from '@/components/home/Hero';
import styles from '@/components/home/Home.module.css';
import { ProductDemoSection } from '@/components/home/ProductDemoSection';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  const validatedLocale = locale as Locale;

  return (
    <main className={styles.home}>
      <Hero locale={validatedLocale} />
      <ProductDemoSection locale={validatedLocale} />
    </main>
  );
}
