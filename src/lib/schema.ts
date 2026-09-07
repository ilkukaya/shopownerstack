import { SITE } from './site';
import { isoDate } from './format';

type Json = Record<string, unknown>;

const abs = (path: string) => new URL(path, SITE.url).toString();

export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;

export function organization(): Json {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    foundingDate: SITE.founded,
  };
}

/** SearchAction is deliberately omitted: the site has no search endpoint. */
export function website(): Json {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
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

export function productReview(tool: {
  name: string;
  slug: string;
  website: string;
  priceFrom: number;
  score: number;
  verdict: string;
  testDate: Date;
  pros: string[];
  cons: string[];
}): Json {
  return {
    '@type': 'Product',
    name: tool.name,
    url: abs(`/reviews/${tool.slug}/`),
    sameAs: tool.website,
    category: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: tool.priceFrom,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: abs(`/go/${tool.slug}/`),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.score,
      bestRating: 10,
      worstRating: 0,
      ratingCount: 1,
      reviewCount: 1,
    },
    review: {
      '@type': 'Review',
      name: `${tool.name} review`,
      url: abs(`/reviews/${tool.slug}/`),
      datePublished: isoDate(tool.testDate),
      reviewBody: tool.verdict,
      positiveNotes: {
        '@type': 'ItemList',
        itemListElement: tool.pros.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p,
        })),
      },
      negativeNotes: {
        '@type': 'ItemList',
        itemListElement: tool.cons.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c,
        })),
      },
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
    inLanguage: 'en',
  };
}

/** Wraps whatever a page contributes into a single @graph block. */
export function graph(nodes: Json[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
