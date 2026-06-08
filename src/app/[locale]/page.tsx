import { notFound } from 'next/navigation';
import { ContactSection } from '@/components/home/ContactSection';
import { Hero } from '@/components/home/Hero';
import { IcelandicContext } from '@/components/home/IcelandicContext';
import { MethodSection } from '@/components/home/MethodSection';
import { ModeStories } from '@/components/home/ModeStories';
import styles from '@/components/home/Home.module.css';
import { ProductDemoSection } from '@/components/home/ProductDemoSection';
import { TeamSection } from '@/components/home/TeamSection';
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
      <ModeStories locale={validatedLocale} />
      <MethodSection locale={validatedLocale} />
      <IcelandicContext locale={validatedLocale} />
      <TeamSection locale={validatedLocale} />
      <ContactSection locale={validatedLocale} />
    </main>
  );
}
