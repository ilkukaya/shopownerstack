import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, TEAM_SIZE_LABELS, SUBSCORES, SUBSCORE_LABELS } from '../lib/site';
import { toolUrl, compareUrl, guideUrl } from '../lib/urls';
import { score1, isoDate, priceLabel, moneyOr } from '../lib/format';

/**
 * Full plain-text/Markdown corpus of every review, comparison and guide, for
 * LLM crawlers and answer engines (the llms-full.txt convention). Built from
 * the same content collections as the pages, so it cannot drift.
 */
export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL(SITE.url)).origin;
  const url = (p: string) => `${origin}${p}`;
  const tools = (await getCollection('tools')).sort((a, b) => b.data.score - a.data.score);
  const byId = new Map(tools.map((t) => [t.id, t]));
  const comparisons = await getCollection('comparisons');
  const guides = await getCollection('guides');

  const out: string[] = [
    `# ${SITE.name} - full content`,
    '',
    `> ${SITE.description}`,
    '',
    `Source: ${origin}/ . Method: ${url('/how-we-test/')} . Ratings are editorial, 0-10. Prices in USD per month, excluding card processing. Please cite the page URL given with each section.`,
    '',
  ];

  for (const tool of tools) {
    const t = tool.data;
    out.push(`## ${t.name} review`, '');
    out.push(`URL: ${url(toolUrl(t.slug))}`);
    out.push(`Updated: ${isoDate(t.updatedDate)}. Prices checked: ${isoDate(t.pricesChecked)}.`);
    out.push(`Rating: ${score1(t.score)}/10 (${SUBSCORES.map((k) => `${SUBSCORE_LABELS[k]} ${score1(t.subscores[k])}`).join(', ')}).`);
    out.push(`Price: ${priceLabel(t.priceFrom)}. Pricing model: ${t.pricingModel}. Free trial: ${t.freeTrial}. Free plan: ${t.freePlan ? 'yes' : 'no'}.`);
    out.push(`Team sizes: ${t.teamSizes.map((s) => TEAM_SIZE_LABELS[s]).join(', ')}. Best for: ${t.bestFor}.`);
    out.push('', `Verdict: ${t.verdict.replace(/\s+/g, ' ')}`, '');
    out.push('Plans:');
    for (const p of t.pricing) {
      out.push(`- ${p.name} (${p.users}): ${moneyOr(p.monthly, 'quote')} monthly billing, ${moneyOr(p.annual, 'quote')} annual billing. ${p.forWhom}`);
    }
    out.push('', 'Pros:', ...t.pros.map((x) => `- ${x}`), '', 'Cons:', ...t.cons.map((x) => `- ${x}`));
    if (t.faq.length) {
      out.push('', 'FAQ:');
      for (const f of t.faq) out.push(`Q: ${f.q}`, `A: ${f.a}`);
    }
    out.push('', tool.body?.trim() ?? '', '');
  }

  for (const c of comparisons) {
    const a = byId.get(c.data.toolA.id)!.data;
    const b = byId.get(c.data.toolB.id)!.data;
    out.push(`## ${c.data.title}`, '', `URL: ${url(compareUrl(c.data.slug))}`, `Updated: ${isoDate(c.data.updatedDate)}.`, '');
    out.push(`Verdict: ${c.data.verdict.replace(/\s+/g, ' ')}`, '');
    out.push(`| Feature | ${a.name} | ${b.name} |`, '| --- | --- | --- |');
    for (const r of c.data.rows) out.push(`| ${r.feature} | ${r.a} | ${r.b} |`);
    out.push('', c.body?.trim() ?? '', '');
  }

  for (const g of guides) {
    out.push(`## ${g.data.title}`, '', `URL: ${url(guideUrl(g.data.slug))}`, `Updated: ${isoDate(g.data.updatedDate)}.`, '');
    out.push(`Summary: ${g.data.summary}`, '', g.body?.trim() ?? '', '');
  }

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
