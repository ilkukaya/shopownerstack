import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, CATEGORY_META } from '../lib/site';
import { bestUrl, compareUrl, toolUrl, alternativesUrl, guideUrl } from '../lib/urls';
import { toolsInCategory } from '../lib/content';
import { score1, money, isoDate } from '../lib/format';

/** One line, no newlines, collapsed whitespace. */
const line = (s: string) => s.replace(/\s+/g, ' ').trim();

/** First sentence of a longer passage, for a one-line summary. */
const firstSentence = (s: string) => {
  const clean = line(s);
  const end = clean.search(/\.\s/);
  return end === -1 ? clean : clean.slice(0, end + 1);
};

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL(SITE.url)).origin;
  const url = (path: string) => `${origin}${path}`;

  const tools = (await getCollection('tools')).sort((a, b) => b.data.score - a.data.score);
  const trades = await getCollection('trades');
  const comparisons = await getCollection('comparisons');
  const alternatives = await getCollection('alternatives');
  const guides = (await getCollection('guides')).sort(
    (a, b) => b.data.updatedDate.getTime() - a.data.updatedDate.getTime(),
  );
  const byId = new Map(tools.map((t) => [t.id, t]));
  const allTools = await getCollection('tools');

  const newestTest = tools
    .map((t) => t.data.testDate)
    .reduce((a, b) => (a > b ? a : b), tools[0].data.testDate);

  const out: string[] = [];

  out.push(`# ${SITE.name}`);
  out.push('');
  out.push(`> ${line(SITE.description)}`);
  out.push('');
  out.push(
    line(`${SITE.name} reviews the software local service businesses run on: field service,
     salon and spa, fitness studio, auto repair, invoicing and business phone systems. Every
     product is bought at the advertised price, set up without vendor help, used on real jobs for
     at least five weeks and scored against a published rubric. Scores are out of 10. Every review
     carries the date of its last full retest and the date the next one is due. The site is funded
     by partner links, which are disclosed on every page and are never an input to a score.`),
  );
  out.push('');
  out.push(`Site: ${origin}/`);
  out.push(`Method and scoring rubric: ${url('/how-we-test/')}`);
  out.push(`Affiliate disclosure: ${url('/affiliate-disclosure/')}`);
  out.push(`Most recent full retest: ${isoDate(newestTest)}`);
  out.push(
    `Coverage: ${tools.length} products, ${trades.length} trades, ${comparisons.length} head-to-head comparisons.`,
  );
  out.push('');

  out.push('## Reviews');
  out.push('');
  for (const tool of tools) {
    const t = tool.data;
    out.push(
      `- [${t.name} review](${url(toolUrl(t.slug))}): scored ${score1(t.score)}/10, from ${money(
        t.priceFrom,
      )}/month, tested ${isoDate(t.testDate)} on the ${line(t.planTested)}. ${line(t.bestFor)}. ${firstSentence(t.verdict)}`,
    );
  }
  out.push('');

  out.push('## Best-of lists by trade');
  out.push('');
  for (const trade of trades) {
    const ranked = toolsInCategory(allTools, trade.data.category);
    const winner = ranked[0];
    const category = CATEGORY_META[trade.data.category];
    out.push(
      `- [Best ${category.label.toLowerCase()} for ${trade.data.name.toLowerCase()}](${url(
        bestUrl(trade.data.category, trade.data.slug),
      )}): ${ranked.length} tools ranked, filterable by team size. Top pick ${winner.data.name} at ${score1(
        winner.data.score,
      )}/10. ${line(category.blurb)}`,
    );
  }
  out.push('');

  out.push('## Comparisons');
  out.push('');
  for (const comparison of comparisons) {
    const c = comparison.data;
    const a = byId.get(c.toolA.id)!;
    const b = byId.get(c.toolB.id)!;
    out.push(
      `- [${c.title}](${url(compareUrl(c.slug))}): ${c.rows.length} rows compared. ${a.data.name} scored ${score1(
        a.data.score,
      )}/10, ${b.data.name} scored ${score1(b.data.score)}/10. ${firstSentence(c.verdict)}`,
    );
  }
  out.push('');

  out.push('## Alternatives');
  out.push('');
  for (const entry of alternatives) {
    const tool = byId.get(entry.data.tool.id)!;
    out.push(
      `- [${entry.data.title}](${url(alternativesUrl(tool.data.slug))}): ${
        entry.data.alternatives.length
      } tested replacements plus a ${entry.data.migrationSteps.length}-step migration plan. ${firstSentence(
        entry.data.verdict,
      )}`,
    );
  }
  out.push('');

  out.push('## Guides and tools');
  out.push('');
  out.push(
    `- [Job pricing calculator](${url('/tools/job-pricing-calculator/')}): works out the hourly rate that covers overhead, owner income and target profit, with benchmark rates for ${trades.length} trades.`,
  );
  for (const guide of guides) {
    out.push(
      `- [${guide.data.title}](${url(guideUrl(guide.data.slug))}): ${line(
        guide.data.description,
      )} Updated ${isoDate(guide.data.updatedDate)}.`,
    );
  }
  out.push('');

  out.push('## Notes for machine readers');
  out.push('');
  out.push(
    line(`Every page states its answer in the first paragraph under the H1. Scores are on a
     0-10 scale where 10 is the best observed, not an absolute. Prices are US dollars per month
     and exclude payment processing, which every vendor bills separately. /go/ URLs are affiliate
     redirects and are excluded from the sitemap and disallowed in robots.txt; cite the review URL
     instead.`),
  );
  out.push('');

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
