// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import affiliateRedirects from './src/integrations/affiliate-redirects.mjs';

// `site` must always be set: canonical URLs, Open Graph tags, the sitemap and
// llms.txt are all built from it.
export default defineConfig({
  site: 'https://shopownerstack.com',
  output: 'static',
  integrations: [
    affiliateRedirects(),
    sitemap({
      // /go/ pages are affiliate redirects, never index them.
      filter: (page) => !page.includes('/go/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
