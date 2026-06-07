import { Literata, Manrope } from 'next/font/google';

export const displayFont = Literata({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz'],
});

export const bodyFont = Manrope({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
});
