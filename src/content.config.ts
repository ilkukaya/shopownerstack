import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES, PARTNER_NETWORKS, TEAM_SIZES } from './lib/site';

const md = (base: string) => glob({ pattern: '**/*.md', base });

const score = z.number().min(0).max(10);

const pricingPlan = z.object({
  name: z.string(),
  users: z.string(),
  /** Monthly price on a month-to-month contract, in USD. */
  monthly: z.number().nonnegative(),
  /** Effective monthly price when billed annually, in USD. */
  annual: z.number().nonnegative(),
  forWhom: z.string(),
});

const tools = defineCollection({
  loader: md('./src/content/tools'),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    logoText: z.string().max(4),
    logoColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'logoColor must be a 6-digit hex colour'),
    website: z.string().url(),
    /** Empty until the partner programme is approved. /go/ falls back to `website`. */
    affiliateUrl: z.string().url().or(z.literal('')),
    partnerNetwork: z.enum(PARTNER_NETWORKS),
    categories: z.array(z.enum(CATEGORIES)).nonempty(),
    bestFor: z.string(),
    teamSizes: z.array(z.enum(TEAM_SIZES)).nonempty(),
    priceFrom: z.number().nonnegative(),
    pricing: z.array(pricingPlan).nonempty(),
    score: score.refine((n) => Number((n * 10).toFixed(0)) === n * 10, {
      message: 'score must have at most one decimal place',
    }),
    subscores: z.object({
      setup: score,
      scheduling: score,
      invoicing: score,
      communication: score,
      reporting: score,
      value: score,
    }),
    testDate: z.coerce.date(),
    nextRetest: z.coerce.date(),
    planTested: z.string(),
    measurements: z.array(z.object({ test: z.string(), result: z.string() })).nonempty(),
    pros: z.array(z.string()).nonempty(),
    cons: z.array(z.string()).nonempty(),
    getItIf: z.array(z.string()).nonempty(),
    skipItIf: z.array(z.string()).nonempty(),
    verdict: z.string(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    videoId: z.string().optional(),
  }),
});

const trades = defineCollection({
  loader: md('./src/content/trades'),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    icon: z.string(),
    category: z.enum(CATEGORIES),
    /** What the trade bills per hour, USD. Drives the pricing calculator benchmarks. */
    medianHourlyRate: z.number().positive(),
    /** Non-billable cost of keeping a one-person operation open, per working hour, USD. */
    overheadPerHourSolo: z.number().positive(),
    description: z.string(),
  }),
});

const comparisons = defineCollection({
  loader: md('./src/content/comparisons'),
  schema: z.object({
    slug: z.string(),
    toolA: reference('tools'),
    toolB: reference('tools'),
    title: z.string(),
    verdict: z.string(),
    pickAIf: z.array(z.string()).nonempty(),
    pickBIf: z.array(z.string()).nonempty(),
    rows: z
      .array(
        z.object({
          feature: z.string(),
          a: z.string(),
          b: z.string(),
          winner: z.enum(['a', 'b', 'tie']),
        }),
      )
      .nonempty(),
  }),
});

const alternatives = defineCollection({
  loader: md('./src/content/alternatives'),
  schema: z.object({
    tool: reference('tools'),
    title: z.string(),
    whyPeopleLeave: z.array(z.string()).nonempty(),
    verdict: z.string(),
    alternatives: z.array(reference('tools')).nonempty(),
    migrationSteps: z
      .array(z.object({ name: z.string(), text: z.string() }))
      .nonempty(),
  }),
});

const guides = defineCollection({
  loader: md('./src/content/guides'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
  }),
});

export const collections = { tools, trades, comparisons, alternatives, guides };
