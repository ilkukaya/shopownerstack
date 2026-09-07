const INK = '#1b2a3a';
const WHITE = '#ffffff';

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

const toHex = (rgb: number[]) =>
  '#' + rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');

function luminance(hex: string): number {
  const channels = toRgb(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Brand colours in the tools collection are chosen for recognition, not for
 * contrast. A logo mark still contains real text, so pick a foreground that
 * clears WCAG AA against it - and where neither ink nor white gets there,
 * darken the brand colour until white does. Hue is preserved; only the
 * lightness moves, and only as far as it has to.
 */
export function readableMark(background: string): { bg: string; fg: string } {
  const target = 4.5;

  const withWhite = contrast(background, WHITE);
  const withInk = contrast(background, INK);

  if (withInk >= target || withWhite >= target) {
    return { bg: background, fg: withInk >= withWhite ? INK : WHITE };
  }

  let rgb: number[] = toRgb(background);
  for (let i = 0; i < 40; i += 1) {
    rgb = rgb.map((v) => v * 0.94);
    const candidate = toHex(rgb);
    if (contrast(candidate, WHITE) >= target) return { bg: candidate, fg: WHITE };
  }

  return { bg: INK, fg: WHITE };
}
