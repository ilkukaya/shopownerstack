import type { APIRoute } from 'astro';
import { ADSENSE_CLIENT } from '../lib/site';

/**
 * ads.txt authorises Google to sell ad space on this domain. Generated from
 * PUBLIC_ADSENSE_CLIENT (ca-pub-XXXXXXXXXXXXXXXX) so it cannot drift from the
 * ad code. Without an id it is a valid, empty file.
 */
export const GET: APIRoute = () => {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# No advertising partners configured yet.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
