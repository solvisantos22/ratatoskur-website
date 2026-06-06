import { Fraunces, Inter } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'], // latin-ext covers Icelandic glyphs
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz'],
});

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
});
