import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from './site';

export type Tool = CollectionEntry<'tools'>;
export type Trade = CollectionEntry<'trades'>;
export type Comparison = CollectionEntry<'comparisons'>;
export type Alternative = CollectionEntry<'alternatives'>;
export type Guide = CollectionEntry<'guides'>;

export const byScoreDesc = (a: Tool, b: Tool) => b.data.score - a.data.score;

export async function allTools(): Promise<Tool[]> {
  return (await getCollection('tools')).sort(byScoreDesc);
}

export async function toolMap(): Promise<Map<string, Tool>> {
  return new Map((await getCollection('tools')).map((t) => [t.id, t]));
}

export function toolsInCategory(tools: Tool[], category: Category): Tool[] {
  return tools.filter((t) => t.data.categories.includes(category)).sort(byScoreDesc);
}

/**
 * Three tools to link to from a review: highest scoring peers that share a
 * category, never the tool itself.
 */
export function relatedTools(tool: Tool, tools: Tool[], count = 3): Tool[] {
  const shares = (other: Tool) =>
    other.data.categories.some((c) => tool.data.categories.includes(c));

  const peers = tools.filter((t) => t.id !== tool.id && shares(t)).sort(byScoreDesc);

  // Fall back to overall top tools if a category is thin, so a review always
  // has its three internal links.
  const filler = tools.filter((t) => t.id !== tool.id && !peers.includes(t));
  return [...peers, ...filler].slice(0, count);
}

/** The first comparison this tool appears in. */
export function comparisonFor(tool: Tool, comparisons: Comparison[]): Comparison | undefined {
  return comparisons.find((c) => c.data.toolA.id === tool.id || c.data.toolB.id === tool.id);
}

/** A trade whose category this tool covers, for the "best" page link. */
export function tradeFor(tool: Tool, trades: Trade[]): Trade | undefined {
  return trades.find((t) => tool.data.categories.includes(t.data.category));
}

export function alternativesFor(
  tool: Tool,
  alternatives: Alternative[],
): Alternative | undefined {
  return alternatives.find((a) => a.data.tool.id === tool.id);
}

/**
 * On a page covering several tools, report the oldest review and price-check
 * dates of the set. Claiming the newest would overstate how fresh the page is.
 */
export function oldestUpdate(tools: Tool[]): { updatedDate: Date; pricesChecked: Date } {
  const min = (dates: Date[]) => dates.reduce((a, b) => (a < b ? a : b));
  return {
    updatedDate: min(tools.map((t) => t.data.updatedDate)),
    pricesChecked: min(tools.map((t) => t.data.pricesChecked)),
  };
}

export function newestUpdate(tools: Tool[]): Date {
  return tools.map((t) => t.data.updatedDate).reduce((a, b) => (a > b ? a : b));
}

/** Loser of a comparison, by score. Used to link to their alternatives page. */
export function comparisonLoser(a: Tool, b: Tool): Tool {
  return a.data.score >= b.data.score ? b : a;
}
