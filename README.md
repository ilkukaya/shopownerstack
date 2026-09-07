# shopownerstack.com

Software reviews and comparisons for local service businesses - plumbers, HVAC contractors,
electricians, cleaners, landscapers, salons, fitness studios and auto repair shops. The business
model is affiliate and lead generation: readers book demos or start trials through partner links
and lead forms.

Astro 5, static output, Tailwind CSS v4, TypeScript, deployed on Netlify. No CMS, no component
library, and no client-side framework.

> **Everything in `src/content/` is placeholder data.** Read [SAMPLE_DATA.md](./SAMPLE_DATA.md)
> before publishing anything. Scores, prices, measurements and quotes are all invented to
> demonstrate the layouts.

---

## Running it

Requires **Node 20+** and **pnpm**.

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static site into dist/
pnpm preview    # serve dist/ locally
pnpm check      # astro check - types, unused imports, a11y hints
```

`/go/<tool>/` links **do not work in `pnpm dev` or `pnpm preview`**. They are edge redirects
served from `_redirects`, so they only resolve on Netlify (or `netlify dev`). A 404 locally is
expected, not a bug.

### Environment variables

| Variable | Required | What it does |
| --- | --- | --- |
| `PUBLIC_GA_ID` | No | GA4 measurement ID, e.g. `G-XXXXXXXXXX`. When empty **no analytics JavaScript is loaded at all** and no `affiliate_click` events fire. Leave it unset locally. |

Set it in `.env` for local work and under Site configuration → Environment variables on Netlify.

---

## Layout of the repo

```
src/
  content/          Markdown content, one file per entry
    tools/          One file per software product
    trades/         One file per trade
    comparisons/    Head-to-head pages
    alternatives/   "X alternatives" pages
    guides/         General articles
  content.config.ts Zod schemas for all five collections
  components/       Astro components. No framework, no component library.
  integrations/     affiliate-redirects.mjs - generates public/_redirects
  layouts/          BaseLayout - head, SEO, JSON-LD, analytics, click tracking
  lib/              site config, URL builders, formatters, JSON-LD, content queries
  pages/            Routes
  styles/global.css Design tokens (this file IS the Tailwind config) + components
public/             Static assets. _redirects is generated, not committed.
```

### Where the design tokens live

Tailwind v4 is configured in CSS, not in a JS file. The `@theme` block at the top of
`src/styles/global.css` **is** the Tailwind config: `--color-ink: #1b2a3a` there is what makes
`bg-ink`, `text-ink` and `border-ink` exist. There is no `tailwind.config.js` and adding one will
not do anything.

Fonts are self-hosted through Fontsource (`@fontsource/barlow`, `@fontsource/barlow-condensed`)
rather than loaded from Google's CDN, which keeps a render-blocking third-party request off the
critical path.

---

## Adding a tool

1. Create `src/content/tools/<slug>.md`. Copy an existing file - the schema in
   `src/content.config.ts` is strict and the build fails loudly on anything missing.
2. Fill in the frontmatter. The fields that matter most:

   | Field | Notes |
   | --- | --- |
   | `slug` | Must match the filename. Drives `/reviews/<slug>/`, `/go/<slug>/` and `/alternatives/<slug>/`. |
   | `categories` | One or more of the keys in `CATEGORIES` (`src/lib/site.ts`). This is what puts the tool on a `/best/` page. |
   | `teamSizes` | Drives the size filter on `/best/` pages. |
   | `affiliateUrl` | Leave as `''` until the partner programme is approved. `/go/` falls back to `website`. |
   | `score`, `subscores` | 0-10, one decimal. Never write these before the test is done. |
   | `testDate`, `nextRetest` | Rendered as the visible "last full retest" and "next retest due" dates. |
   | `measurements` | The timed results table. Same tasks on every product. |

3. Write the review body in Markdown below the frontmatter. Phrase H2s as the question a shop
   owner would type.
4. `pnpm build`. The review page, the `/go/` redirect, the sitemap entry and the `llms.txt` line
   are all generated automatically.

**Gotcha:** any frontmatter value containing a colon followed by a space must be quoted or written
as a YAML block scalar (`>-`), or the build fails while generating the redirects.

### Adding a comparison

1. Create `src/content/comparisons/<tool-a>-vs-<tool-b>.md`.
2. `toolA` and `toolB` are **references** - use the tool's filename without `.md`, not its display
   name. A typo fails the build rather than rendering a blank page.
3. `rows` is the comparison table. Each row needs `feature`, `a`, `b` and `winner`
   (`a` | `b` | `tie`). Winning cells are highlighted and labelled for screen readers.
4. `slug` must match the filename.

The page links to both reviews automatically, and to the alternatives page of the lower-scoring
tool if one exists.

### Adding a trade

Create `src/content/trades/<slug>.md`. Its `category` must be one of the tool category keys. A new
trade generates a `/best/<category-url-label>-for-<trade-slug>/` page listing every tool in that
category, and adds a tile to the trade board on the home page.

Category URL labels are in `CATEGORY_META` in `src/lib/site.ts`.

---

## How the `/go/` redirects are generated

Affiliate URLs never appear in page markup. Every outbound link to a vendor points at
`/go/<slug>/` and carries `rel="sponsored nofollow noopener"` and `target="_blank"`
(`src/components/AffiliateLink.astro`).

`src/integrations/affiliate-redirects.mjs` runs on the `astro:config:setup` hook - before `public/`
is copied into `dist/` - reads the frontmatter of every file in `src/content/tools/`, and writes
`public/_redirects`:

```
/go/jobber   https://partner.example/jobber   302
/go/jobber/  https://partner.example/jobber   302
```

Both forms are written so the link resolves with or without a trailing slash. A tool with an empty
`affiliateUrl` redirects to its own `website`, so the link always works.

`public/_redirects` is **generated and gitignored**. Do not edit it and do not commit it; it is
rewritten on every `pnpm dev` and `pnpm build`.

Three things follow from this design and should not be "fixed":

- **No page is generated at `/go/<slug>/`.** A static file at that path would shadow the redirect,
  because Netlify serves files before applying non-forced redirect rules.
- `/go/` is disallowed in `robots.txt` and filtered out of the sitemap.
- The redirects are not in `netlify.toml`. Keeping them in one generated file means they cannot
  drift from the content.

### Click tracking

A single delegated capture-phase listener in `BaseLayout.astro` fires a GA4 `affiliate_click` event
with `tool` and `page` parameters before the browser navigates. If `gtag` has not finished loading
yet it falls back to `navigator.sendBeacon` against the Measurement Protocol, so a fast click is
still recorded. Nothing runs when `PUBLIC_GA_ID` is empty.

---

## Forms

Both forms post to **Netlify Forms** so submissions are captured from day one, and both carry a
clearly commented slot for the real integration.

- **Demo request** (`src/components/DemoRequestForm.astro`) takes a `provider` prop and submits it
  as a hidden field, so leads are attributable per tool. To swap in a PartnerStack lead-form embed
  for one tool, put the embed inside `<div data-partnerstack-slot>` and remove the `<form>` beneath
  it - do not run both, or the lead is submitted twice and attribution breaks. Keep the disclosure
  paragraph visible under whichever form is live.
- **Newsletter** (`src/components/NewsletterForm.astro`) has a commented slot for a Kit
  (ConvertKit) form action. The comment lists the three changes needed.

Netlify discovers both forms by parsing the built HTML, so they need no configuration beyond
`data-netlify="true"`. Successful submissions land on `/thanks/`.

---

## SEO

- `site` in `astro.config.mjs` is `https://shopownerstack.com` and must never be unset - canonicals,
  Open Graph URLs, the sitemap and `llms.txt` are all built from it.
- **Every page's first paragraph after the H1 is the verdict**: a direct, quotable one or two
  sentence answer. This is deliberate for AI search engines. Keep the pattern when adding pages.
- JSON-LD is assembled per page from `src/lib/schema.ts` into a single `@graph`:
  `Organization` + `WebSite` on the home page, `Product` + `Review` + `AggregateRating` on reviews,
  `FAQPage` where a page has FAQ items, `HowTo` on alternatives migration steps, `Article` on
  guides, and `BreadcrumbList` everywhere.
- `/llms.txt` is generated at build with a one-line summary of every review, best, compare,
  alternatives and guide page.
- Visible "last full retest" and "prices checked" dates come from the tools collection. On pages
  covering several tools we show the **oldest** test date of the set, so the page never claims to
  be fresher than its weakest input.

### Client-side JavaScript

Deliberately almost none. The only scripts on the site are the mobile menu, the team-size filter on
`/best/` pages, the pricing calculator, and the affiliate click event. The FAQ uses native
`<details>`. Every one of them degrades to a working page when JavaScript fails.

---

## Deploying to Netlify

**New site:**

1. Netlify → Add new site → Import an existing project → pick this repository.
2. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
   - Node version: 20 (already set in `netlify.toml` and `.nvmrc`)
3. Add `PUBLIC_GA_ID` under Site configuration → Environment variables if analytics should run.
4. Deploy. `netlify.toml` in the repo root already carries the build settings and security headers,
   so the UI fields only need to match it.

**After the first deploy, check:**

- `https://<site>/go/jobber/` redirects to the vendor
- `https://<site>/robots.txt` disallows `/go/`
- `https://<site>/sitemap-index.xml` exists and contains no `/go/` URLs
- `https://<site>/llms.txt` renders
- A test submission appears under Forms in the Netlify dashboard

**Custom domain:** point `shopownerstack.com` at the site in Netlify's domain settings. `site` in
`astro.config.mjs` is already set to the production domain, so no code change is needed.

---

## Quality bar

- Responsive to 360px, verified across all 18 page types - no page scrolls horizontally.
  Wide tables scroll inside their own container.
- Visible focus states on everything focusable, with a white ring on dark surfaces.
- `prefers-reduced-motion` respected.
- Colour contrast meets WCAG AA throughout. `--color-ink-muted` is tuned to clear 4.5:1 on
  `--color-paper-deep`, the darkest surface it sits on, and `src/lib/color.ts` guarantees the
  same for logo marks built from arbitrary brand hex values.
- No emoji in UI text. No lorem ipsum.

### Lighthouse

Mobile, Lighthouse 12.8.2, against `pnpm preview`:

| Page | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 100 |
| `/reviews/jobber/` | 100 | 100 | 100 | 100 |
| `/best/field-service-software-for-plumbers/` | 100 | 100 | 100 | 100 |
| `/compare/housecall-pro-vs-jobber/` | 100 | 100 | 100 | 100 |
| `/alternatives/jobber/` | 100 | 100 | 100 | 100 |
| `/guides/how-to-price-a-service-job/` | 100 | 100 | 100 | 100 |
| `/tools/job-pricing-calculator/` | 100 | 100 | 100 | 100 |
| `/how-we-test/` | 100 | 100 | 100 | 100 |

Two things are load-bearing for those numbers and should not be removed casually:

- **Metric-matched font fallbacks** at the top of `global.css`. The `size-adjust` values were
  measured in Chrome against Arial, not guessed. Without them the swap to Barlow Condensed
  re-wraps every heading and costs about 0.12 CLS on heading-heavy pages.
- **`position: relative` on `.table-scroll`.** Visually hidden captions and the "Winner:" labels
  in the comparison table are absolutely positioned; with no positioned ancestor they resolve
  against the initial containing block, escape the scroll container and make the whole page
  scroll sideways on a phone.

---

## Known gaps

Things a reader of this repo should not assume are done:

1. **All content is placeholder data.** See [SAMPLE_DATA.md](./SAMPLE_DATA.md). This is the big
   one - nothing here should be published as a review.
2. **The original design demo was never available.** `shopownerstack-demo-v2.html` was not in the
   working folder or the repository, so the visual language was rebuilt from the written brief
   (ink `#1B2A3A`, safety yellow `#F5C518`, Barlow and Barlow Condensed, trade board, verdict box,
   get-it-if / skip-it-if, score bars, winner-highlighted comparison tables, demo form). Expect
   differences from the demo, and reconcile against it if it turns up.
3. **`astro:assets` is not wired in**, because there is not a single raster image in the site
   yet - product shots are the CSS-drawn `MockScreenshot`, and icons and the logo are inline SVG.
   Add the `<Image>` component and explicit dimensions at the same time as the first real
   screenshot.
4. **No Open Graph image.** `twitter:card` is `summary` rather than `summary_large_image` because
   there is no artwork to point at. Add `og:image` and switch the card type when brand assets
   exist.
5. **Prices-checked date shares `testDate`.** The tools schema has only `testDate` and
   `nextRetest`, so "prices checked" is rendered from `testDate` - true today, since prices are
   checked during a full retest. If prices start being checked between retests, that needs its own
   schema field.
6. **`/go/` links cannot be exercised locally.** They are edge redirects, so verifying them needs
   a Netlify deploy or `netlify dev`.
7. **`affiliateUrl` is empty on every tool**, so every `/go/` link currently falls back to the
   vendor's own site. Nothing earns until the partner programmes are approved and those fields
   are filled in.
8. **No analytics have been verified end to end.** The `affiliate_click` event fires against a
   real GA4 property only once `PUBLIC_GA_ID` is set; the sendBeacon fallback path in particular
   has not been observed against a live property.
