export const SITE = {
  name: 'ShopOwnerStack',
  domain: 'shopownerstack.com',
  url: 'https://shopownerstack.com',
  tagline: 'Software reviews for people who run the shop',
  description:
    'Hands-on reviews and comparisons of the software local service businesses actually run on: scheduling, dispatch, invoicing, payments and phones. Every tool is bought, set up and used before it is scored.',
  email: 'hello@shopownerstack.com',
  founded: '2025',
} as const;

/** Tool category keys. Kept in one place so schema, routes and labels agree. */
export const CATEGORIES = [
  'field-service',
  'salon-spa',
  'fitness',
  'auto-repair',
  'restaurant',
  'clinic',
  'phone-system',
  'invoicing',
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * `label` is what we call the category in prose.
 * `urlLabel` is the first half of a /best/ slug: `${urlLabel}-for-${trade.slug}`.
 */
export const CATEGORY_META: Record<Category, { label: string; urlLabel: string; blurb: string }> = {
  'field-service': {
    label: 'Field service software',
    urlLabel: 'field-service-software',
    blurb: 'Scheduling, dispatch, job tracking and invoicing for crews that work at the customer site.',
  },
  'salon-spa': {
    label: 'Salon and spa software',
    urlLabel: 'salon-software',
    blurb: 'Chair-level booking, stylist commission, retail stock and rebooking prompts.',
  },
  fitness: {
    label: 'Fitness studio software',
    urlLabel: 'fitness-studio-software',
    blurb: 'Class timetables, memberships, recurring billing and attendance for studios and gyms.',
  },
  'auto-repair': {
    label: 'Auto repair shop software',
    urlLabel: 'auto-repair-software',
    blurb: 'Digital vehicle inspections, parts ordering, labour guides and bay scheduling.',
  },
  restaurant: {
    label: 'Restaurant software',
    urlLabel: 'restaurant-software',
    blurb: 'Front of house, table management, rotas and back-office reporting.',
  },
  clinic: {
    label: 'Clinic software',
    urlLabel: 'clinic-software',
    blurb: 'Patient booking, notes, recalls and card-on-file billing for small private practices.',
  },
  'phone-system': {
    label: 'Business phone systems',
    urlLabel: 'phone-systems',
    blurb: 'Call routing, missed-call texts, recordings and voicemail that reaches the right person.',
  },
  invoicing: {
    label: 'Invoicing software',
    urlLabel: 'invoicing-software',
    blurb: 'Quotes, invoices, deposits, card payments and the chase-up sequence behind them.',
  },
};

export const TEAM_SIZES = ['solo', '2-5', '6-15', '16+'] as const;
export type TeamSize = (typeof TEAM_SIZES)[number];

export const TEAM_SIZE_LABELS: Record<TeamSize, string> = {
  solo: 'Solo',
  '2-5': '2-5 people',
  '6-15': '6-15 people',
  '16+': '16 or more',
};

export const PARTNER_NETWORKS = ['partnerstack', 'impact', 'cj', 'direct', 'none'] as const;
export type PartnerNetwork = (typeof PARTNER_NETWORKS)[number];

/** Subscore keys, in the order they are shown on a review. */
export const SUBSCORES = [
  'setup',
  'scheduling',
  'invoicing',
  'communication',
  'reporting',
  'value',
] as const;

export type SubscoreKey = (typeof SUBSCORES)[number];

export const SUBSCORE_LABELS: Record<SubscoreKey, string> = {
  setup: 'Setup',
  scheduling: 'Scheduling',
  invoicing: 'Invoicing',
  communication: 'Communication',
  reporting: 'Reporting',
  value: 'Value',
};

export const NAV = [
  { href: '/reviews/', label: 'Reviews' },
  { href: '/compare/', label: 'Compare' },
  { href: '/best/', label: 'Best of' },
  { href: '/guides/', label: 'Guides' },
  { href: '/tools/job-pricing-calculator/', label: 'Calculator' },
  { href: '/how-we-test/', label: 'How we test' },
] as const;

/** The one-line disclosure that has to appear anywhere we send affiliate traffic. */
export const DISCLOSURE =
  'Some links on this page are partner links. If you buy through them we may earn a commission at no extra cost to you. It never changes a score or a ranking.';

/** GA4. Left empty in most environments; nothing is loaded when it is empty. */
export const GA_ID = import.meta.env.PUBLIC_GA_ID ?? '';
