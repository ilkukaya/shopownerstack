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
  markdown: {
    // The site is a light theme; Shiki's default (github-dark) renders pale
    // syntax colours that fail contrast on our paper surfaces.
    shikiConfig: { theme: 'github-light', wrap: true },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
