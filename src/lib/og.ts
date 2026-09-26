import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) =>
  readFileSync(require.resolve(`${pkg}/files/${file}`));

let fonts: Parameters<typeof satori>[1]['fonts'] | undefined;
function loadFonts() {
  fonts ??= [
    { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-500-normal.woff'), weight: 500 },
    { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-700-normal.woff'), weight: 700 },
    {
      name: 'Serif',
      data: font('@fontsource/source-serif-4', 'source-serif-4-latin-700-normal.woff'),
      weight: 700,
    },
  ];
  return fonts;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export interface OgInput {
  kicker: string;
  title: string;
  subtitle?: string;
  /** Optional rating badge, 0-10. */
  score?: number;
}

/** 1200x630 PNG social card in the site's visual language. */
export async function renderOg({ kicker, title, subtitle, score }: OgInput): Promise<Buffer> {
  const bars = h('div', { display: 'flex', flexDirection: 'column', gap: 7 }, [
    h('div', { width: 36, height: 9, borderRadius: 5, background: '#ffffff' }),
    h('div', { width: 26, height: 9, borderRadius: 5, background: 'rgba(255,255,255,.85)' }),
    h('div', { width: 36, height: 9, borderRadius: 5, background: '#F2A900' }),
  ]);

  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      background: '#FBFAF7',
      fontFamily: 'Inter',
      borderTop: '14px solid #0B6B4F',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: 18 }, [
        h(
          'div',
          {
            width: 64,
            height: 64,
            borderRadius: 14,
            background: '#0B6B4F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          [bars],
        ),
        h('div', { fontSize: 30, fontWeight: 700, color: '#151A23' }, 'ShopOwnerStack'),
      ]),
      h('div', { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }, [
        h('div', { display: 'flex', flexDirection: 'column', maxWidth: score === undefined ? 1056 : 860 }, [
          h(
            'div',
            {
              fontSize: 24,
              fontWeight: 700,
              color: '#0B6B4F',
              textTransform: 'uppercase',
              letterSpacing: 2,
            },
            kicker,
          ),
          h(
            'div',
            {
              marginTop: 14,
              fontFamily: 'Serif',
              fontSize: title.length > 60 ? 58 : 70,
              fontWeight: 700,
              lineHeight: 1.08,
              color: '#151A23',
            },
            title,
          ),
          subtitle
            ? h(
                'div',
                { marginTop: 22, fontSize: 28, fontWeight: 500, color: '#5A6374', lineHeight: 1.35 },
                subtitle.length > 140 ? `${subtitle.slice(0, 137)}...` : subtitle,
              )
            : h('div', {}, ''),
        ]),
        score === undefined
          ? h('div', {}, '')
          : h(
              'div',
              {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 170,
                height: 170,
                borderRadius: 32,
                background: '#10151D',
                color: '#ffffff',
                flexShrink: 0,
              },
              [
                h('div', { fontSize: 72, fontWeight: 700, lineHeight: 1 }, score.toFixed(1)),
                h('div', { fontSize: 22, fontWeight: 500, opacity: 0.7, marginTop: 6 }, 'out of 10'),
              ],
            ),
      ]),
    ],
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
