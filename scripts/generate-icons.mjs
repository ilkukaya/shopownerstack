// Renders the PNG icons (apple-touch-icon, PWA icons) from public/favicon.svg.
// Run with `node scripts/generate-icons.mjs`; the output is committed.
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');

for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  writeFileSync(new URL(`../public/${name}`, import.meta.url), png);
  console.log('wrote', name);
}
