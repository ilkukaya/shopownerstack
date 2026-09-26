import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOg, type OgInput } from '../../lib/og';
import { CATEGORY_META, SITE } from '../../lib/site';
import { bestSlug } from '../../lib/urls';

/**
 * One social card per indexable content page, rendered at build time:
 * /og/reviews/jobber.png, /og/compare/<slug>.png, /og/default.png, ...
 * Pages point at these through the `ogImage` prop on BaseLayout.
 */
export const getStaticPaths = (async () => {
  const tools = await getCollection('tools');
  const byId = new Map(tools.map((t) => [t.id, t]));
  const trades = await getCollection('trades');
  const comparisons = await getCollection('comparisons');
  const alternatives = await getCollection('alternatives');
  const guides = await getCollection('guides');
  const year = new Date().getFullYear();

  const pages: { slug: string; og: OgInput }[] = [
    {
      slug: 'default',
      og: { kicker: 'Independent reviews', title: SITE.tagline, subtitle: SITE.description },
    },
    {
      slug: 'calculator',
      og: {
        kicker: 'Free tool',
        title: 'Hourly rate and job pricing calculator',
        subtitle: 'Work out the rate that covers your overhead, billable hours and target income.',
      },
    },
    ...tools.map((t) => ({
      slug: `reviews/${t.data.slug}`,
      og: {
        kicker: `${year} review`,
        title: `${t.data.name} review`,
        subtitle: t.data.bestFor,
        score: t.data.score,
      },
    })),
    ...comparisons.map((c) => ({
      slug: `compare/${c.data.slug}`,
      og: { kicker: 'Head to head', title: c.data.title, subtitle: c.data.verdict.split('. ')[0] + '.' },
    })),
    ...alternatives.map((a) => ({
      slug: `alternatives/${a.data.tool.id}`,
      og: {
        kicker: 'Alternatives',
        title: `Best ${byId.get(a.data.tool.id)?.data.name ?? ''} alternatives`,
        subtitle: a.data.verdict.split('. ')[0] + '.',
      },
    })),
    ...guides.map((g) => ({
      slug: `guides/${g.data.slug}`,
      og: { kicker: 'Guide', title: g.data.title, subtitle: g.data.description },
    })),
    ...trades.map((t) => ({
      slug: `best/${bestSlug(t.data.category, t.data.slug)}`,
      og: {
        kicker: `Best of ${year}`,
        title: `Best ${CATEGORY_META[t.data.category].label.toLowerCase()} for ${t.data.name.toLowerCase()}`,
        subtitle: CATEGORY_META[t.data.category].blurb,
      },
    })),
  ];

  return pages.map(({ slug, og }) => ({ params: { slug }, props: { og } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props.og as OgInput);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
