const DATE = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const MONTH = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export const formatDate = (d: Date) => DATE.format(d);
export const formatMonth = (d: Date) => MONTH.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** `$65` / `$0` — whole dollars, which is how SaaS list prices read. */
export function money(n: number): string {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: n % 1 === 0 ? 0 : 2 })}`;
}

/** Scores always render with one decimal: 8 -> "8.0". */
export const score1 = (n: number) => n.toFixed(1);

export function pluralize(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

/** "From $39/mo" or "Quote-based" when the vendor does not publish a price. */
export function priceLabel(priceFrom: number | null, short = false): string {
  if (priceFrom === null) return 'Quote-based';
  if (priceFrom === 0) return 'Free plan';
  return short ? `${money(priceFrom)}/mo` : `From ${money(priceFrom)}/mo`;
}

/** Money or an en-dash style placeholder for unpublished plan prices. */
export const moneyOr = (n: number | null, fallback = 'Not published') =>
  n === null ? fallback : money(n);
