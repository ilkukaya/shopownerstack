// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import affiliateRedirects from './src/integrations/affiliate-redirects.mjs';

// `site` must always be set: canonical URLs, Open Graph tags, the sitemap and
// llms.txt are all built from it.
//
// Resolution order:
//   1. SITE_URL - set this in Netlify once a custom domain is live
//      (e.g. https://www.shopownerstack.com).
//   2. URL - injected by Netlify on every build: the site's primary URL.
//   3. The Netlify subdomain the site currently lives on.
const SITE_URL = (process.env.SITE_URL || process.env.URL || 'https://shopownerstack.netlify.app')
  .replace(/^http:\/\//, 'https://')
  .replace(/\/$/, '');

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    affiliateRedirects(),
    sitemap({
      // /go/ pages are affiliate redirects, /thanks/ and /search/ are utility
      // pages - none of them belong in the index.
      filter: (page) => !/\/(go|thanks|search)\//.test(page),
      changefreq: 'weekly',
      lastmod: new Date(),
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
