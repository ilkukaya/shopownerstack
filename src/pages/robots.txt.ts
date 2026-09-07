import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(SITE.url)).origin;

  const body = `User-agent: *
Allow: /

# Affiliate redirects. Never index these - they are hops, not pages.
Disallow: /go/
Disallow: /thanks/

Sitemap: ${origin}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
