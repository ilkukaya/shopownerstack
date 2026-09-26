import { SITE } from './site';
import { isoDate } from './format';

type Json = Record<string, unknown>;

export const abs = (path: string) => new URL(path, SITE.url).toString();

export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;

export function organization(): Json {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    foundingDate: SITE.founded,
    logo: {
      '@type': 'ImageObject',
      url: abs('/icon-512.png'),
      width: 512,
      height: 512,
    },
    publishingPrinciples: abs('/how-we-test/'),
    ethicsPolicy: abs('/affiliate-disclosure/'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      url: abs('/contact/'),
    },
  };
}

export function website(): Json {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/search/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqPage(items: { q: string; a: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/**
 * Editorial review of a software product. Deliberately no AggregateRating: we
 * publish one editorial rating, and marking that up as an aggregate of user
 * ratings would misrepresent it.
 */
export function productReview(tool: {
  name: string;
  slug: string;
  website: string;
  priceFrom: number | null;
  score: number;
  verdict: string;
  updatedDate: Date;
  pros: string[];
  cons: string[];
  categoryLabel: string;
}): Json {
  const list = (items: string[]) => ({
    '@type': 'ItemList',
    itemListElement: items.map((name, i) => ({ '@type': 'ListItem', position: i + 1, name })),
  });

  return {
    '@type': 'SoftwareApplication',
    '@id': abs(`/reviews/${tool.slug}/#software`),
    name: tool.name,
    url: tool.website,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: tool.categoryLabel,
    operatingSystem: 'Web, iOS, Android',
    ...(tool.priceFrom !== null && {
      offers: {
        '@type': 'Offer',
        price: tool.priceFrom,
        priceCurrency: 'USD',
        url: tool.website,
      },
    }),
    review: {
      '@type': 'Review',
      name: `${tool.name} review`,
      url: abs(`/reviews/${tool.slug}/`),
      datePublished: isoDate(tool.updatedDate),
      dateModified: isoDate(tool.updatedDate),
      reviewBody: tool.verdict,
      positiveNotes: list(tool.pros),
      negativeNotes: list(tool.cons),
      reviewRating: {
        '@type': 'Rating',
        ratingValue: tool.score,
        bestRating: 10,
        worstRating: 0,
      },
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
    },
  };
}

/** Ranked list on /best/ pages. */
export function itemList(name: string, items: { name: string; path: string }[]): Json {
  return {
    '@type': 'ItemList',
    name,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: abs(item.path),
    })),
  };
}

/** WebPage node with dates and speakable summary for answer engines. */
export function webPage(p: {
  path: string;
  title: string;
  description: string;
  dateModified?: Date;
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
}): Json {
  return {
    '@type': p.type ?? 'WebPage',
    '@id': abs(`${p.path}#webpage`),
    url: abs(p.path),
    name: p.title,
    description: p.description,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    ...(p.dateModified && { dateModified: isoDate(p.dateModified) }),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-answer]'],
    },
  };
}

export function howTo(name: string, steps: { name: string; text: string }[]): Json {
  return {
    '@type': 'HowTo',
    name,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function article(a: {
  title: string;
  description: string;
  path: string;
  publishDate: Date;
  updatedDate: Date;
  image?: string;
}): Json {
  return {
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: abs(a.path),
    mainEntityOfPage: abs(a.path),
    datePublished: isoDate(a.publishDate),
    dateModified: isoDate(a.updatedDate),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    ...(a.image && { image: abs(a.image) }),
  };
}

/** Wraps whatever a page contributes into a single @graph block. */
export function graph(nodes: Json[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
