import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';

export const siteName = 'Ratatoskur';

const rootDescription =
  'AI math feedback for handwritten work, designed Icelandic-first for students learning through their own reasoning.';

type MetadataText = {
  title: string;
  description: string;
};

type PageKey = 'home' | 'research' | 'updates';

const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  is: 'is_IS',
};

export const localizedMetadata: Record<Locale, Record<PageKey, MetadataText>> = {
  en: {
    home: {
      title: 'AI feedback for handwritten math',
      description:
        'Ratatoskur gives students AI feedback on handwritten math work, with an Icelandic-first notebook experience built around hints, checks, and revealable solutions.',
    },
    research: {
      title: 'Research and approach',
      description:
        'How Ratatoskur evaluates handwriting, confirmation, and useful math feedback as separate parts of a learning workflow.',
    },
    updates: {
      title: 'Build notes from the notebook',
      description:
        'Product and research notes on validation, pilots, and the choices behind Ratatoskur as a working learning tool.',
    },
  },
  is: {
    home: {
      title: 'AI-endurgjöf fyrir handskrifaða stærðfræði',
      description:
        'Ratatoskur gefur nemendum AI-endurgjöf á handskrifaða stærðfræði í íslenskri vinnubók með vísbendingum, yfirferð og sýnilegum lausnum.',
    },
    research: {
      title: 'Rannsókn og nálgun',
      description:
        'Hvernig Ratatoskur metur handskrift, staðfestingu og gagnlega endurgjöf í stærðfræðinámi sem aðskilda hluta í námsferli.',
    },
    updates: {
      title: 'Vinnubókarfærslur úr þróuninni',
      description:
        'Vöru- og rannsóknarnótur um prófanir, samstarf við skóla og ákvarðanirnar sem móta Ratatoskur sem námsverkfæri.',
    },
  },
};

const noIndexTitles: Record<Locale, string> = {
  en: 'Page not found',
  is: 'Síða fannst ekki',
};

function socialMetadata(locale: Locale, text: MetadataText, type: 'website' | 'article'): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      title: text.title,
      description: text.description,
      siteName,
      locale: openGraphLocales[locale],
      type,
    },
    twitter: {
      card: 'summary',
      title: text.title,
      description: text.description,
    },
  };
}

export function stripSiteNamePrefix(title: string) {
  const stripped = title.replace(/^Ratatoskur\s*[:\-–—]?\s+/i, '').trim();
  if (!stripped) return title;
  return `${stripped.charAt(0).toLocaleUpperCase()}${stripped.slice(1)}`;
}

export function createRootMetadata(): Metadata {
  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: rootDescription,
    applicationName: siteName,
    icons: {
      icon: '/icon.svg',
    },
    openGraph: {
      title: siteName,
      description: rootDescription,
      siteName,
      type: 'website',
      locale: openGraphLocales.en,
    },
    twitter: {
      card: 'summary',
      title: siteName,
      description: rootDescription,
    },
  };
}

export function createPageMetadata(locale: Locale, page: PageKey): Metadata {
  const text = localizedMetadata[locale][page];
  return {
    title: text.title,
    description: text.description,
    ...socialMetadata(locale, text, 'website'),
  };
}

export function createArticleMetadata(locale: Locale, text: MetadataText): Metadata {
  const articleText = {
    ...text,
    title: stripSiteNamePrefix(text.title),
  };

  return {
    title: articleText.title,
    description: articleText.description,
    ...socialMetadata(locale, articleText, 'article'),
  };
}

export function createSafeNoIndexMetadata(locale: Locale): Metadata {
  return {
    title: noIndexTitles[locale],
    robots: {
      index: false,
      follow: false,
    },
  };
}
