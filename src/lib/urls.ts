import { CATEGORY_META, type Category } from './site';

export const toolUrl = (slug: string) => `/reviews/${slug}/`;
export const goUrl = (slug: string) => `/go/${slug}/`;
export const compareUrl = (slug: string) => `/compare/${slug}/`;
export const alternativesUrl = (slug: string) => `/alternatives/${slug}/`;
export const guideUrl = (slug: string) => `/guides/${slug}/`;
export const tradeUrl = (slug: string) => `/best/${slug}/`;

/** `/best/field-service-software-for-plumbers/` */
export const bestSlug = (category: Category, tradeSlug: string) =>
  `${CATEGORY_META[category].urlLabel}-for-${tradeSlug}`;

export const bestUrl = (category: Category, tradeSlug: string) =>
  `/best/${bestSlug(category, tradeSlug)}/`;

export const CALCULATOR_URL = '/tools/job-pricing-calculator/';

export const absolute = (path: string, site: URL | undefined) =>
  new URL(path, site ?? 'https://shopownerstack.com').toString();
