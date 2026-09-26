import type { APIRoute } from 'astro';
import { SITE, IS_INDEXABLE } from '../lib/site';

/**
 * Search engines and AI answer engines are welcome everywhere except the
 * affiliate redirect hops and utility pages. Branch deploys and deploy
 * previews are closed to all crawlers so they never compete with production.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(SITE.url)).origin;

  if (!IS_INDEXABLE) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const aiAgents = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'Bingbot',
    'DuckAssistBot',
    'Amazonbot',
    'CCBot',
    'meta-externalagent',
  ];

  const rules = `Disallow: /go/
Disallow: /thanks/
Disallow: /search/`;

  const body = `# ${SITE.name} - crawlers welcome.
User-agent: *
Allow: /
${rules}

# AI assistants and answer engines: explicitly allowed, same exclusions.
${aiAgents.map((a) => `User-agent: ${a}`).join('\n')}
Allow: /
${rules}

Sitemap: ${origin}/sitemap-index.xml
# LLM-readable summaries: ${origin}/llms.txt and ${origin}/llms-full.txt
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
