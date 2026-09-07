import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const TOOLS_DIR = new URL('../content/tools/', import.meta.url);

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Reads just the frontmatter of every tool. The integration runs before the
 * content layer exists, so it cannot use getCollection() and reads from disk.
 */
function readTools() {
  const dir = fileURLToPath(TOOLS_DIR);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const match = FRONTMATTER.exec(readFileSync(join(dir, f), 'utf8'));
      if (!match) throw new Error(`No frontmatter in src/content/tools/${f}`);
      const data = parseYaml(match[1]);
      if (!data?.slug) throw new Error(`Missing "slug" in src/content/tools/${f}`);
      if (!data.website) throw new Error(`Missing "website" in src/content/tools/${f}`);
      return { slug: data.slug, affiliateUrl: data.affiliateUrl ?? '', website: data.website };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function buildRedirects(tools) {
  const lines = [
    '# GENERATED FILE - do not edit by hand.',
    '# Written by src/integrations/affiliate-redirects.mjs from src/content/tools/*.md',
    '# on every `pnpm build` and `pnpm dev`. Tracked in .gitignore.',
    '#',
    '# Affiliate URLs never appear in page markup: every outbound link points at',
    '# /go/<slug>/ and is bounced from here. A tool with no affiliateUrl yet falls',
    '# back to its own website so the link still works.',
    '',
  ];

  for (const { slug, affiliateUrl, website } of tools) {
    const target = affiliateUrl || website;
    // Both forms so the link works with or without the trailing slash.
    lines.push(`/go/${slug}   ${target}   302`);
    lines.push(`/go/${slug}/  ${target}   302`);
  }

  lines.push('');
  return lines.join('\n');
}

/** @returns {import('astro').AstroIntegration} */
export default function affiliateRedirects() {
  return {
    name: 'shopownerstack:affiliate-redirects',
    hooks: {
      // config:setup runs before public/ is copied into dist/, so writing the
      // file here is enough for it to reach the deploy.
      'astro:config:setup': ({ config, logger }) => {
        const tools = readTools();
        const publicDir = fileURLToPath(config.publicDir);
        mkdirSync(publicDir, { recursive: true });
        writeFileSync(join(publicDir, '_redirects'), buildRedirects(tools), 'utf8');
        logger.info(`Wrote public/_redirects for ${tools.length} tools`);
      },
    },
  };
}
