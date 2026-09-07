# SAMPLE DATA - REPLACE BEFORE LAUNCH

**Every number, quote, date and test result in `src/content/` is placeholder data.**
None of it comes from a real test. It exists so the site can be built, styled and reviewed
end to end. Publishing it as-is would be publishing fabricated review data.

Nothing in this repository should go live until the items below are replaced with results
from a real, documented test.

---

## What is fabricated

### `src/content/tools/` - 11 entries

| Field | Status | What has to happen |
| --- | --- | --- |
| `score`, `subscores` | **Invented** | Must come from a completed test against the published rubric in `/how-we-test/`. |
| `measurements` | **Invented** | Every row is a timed or observed result. Re-run each test and record the real figure. |
| `pricing`, `priceFrom` | **Invented, plausible shape** | Check each vendor's public pricing page on the day of publication. Record the date checked. |
| `testDate`, `nextRetest`, `planTested` | **Invented** | Set from the real test. `planTested` must name the plan actually purchased. |
| `pros`, `cons`, `getItIf`, `skipItIf`, `verdict` | **Invented** | Written to demonstrate the layout. Rewrite from test findings. |
| `faq` | **Invented** | Answers assert specific behaviour that has not been verified. |
| `body` | **Invented** | Contains specific claims ("we ran 14 jobs over six weeks") that are not true. |
| `website` | Real URLs | Verify each still resolves before launch. |
| `affiliateUrl` | **Empty on every tool** | Fill in once each partner programme is approved. `/go/` falls back to `website` until then. |
| `partnerNetwork` | **Guessed** | Set to the network each programme actually runs on. |
| `logoColor`, `logoText` | Placeholder brand colours | Replace with correct brand values, or keep the CSS mark deliberately generic. |
| `videoId` | Not set on any tool | Add real YouTube IDs when review videos exist. |

### `src/content/trades/` - 8 entries

`medianHourlyRate` and `overheadPerHourSolo` are **invented benchmark figures**. They drive
the defaults and the benchmark table on `/tools/job-pricing-calculator/`, so a visitor will
treat them as research. Replace with figures from a named, citable source (industry survey,
BLS data, or our own survey) and cite the source on the calculator page.

### `src/content/comparisons/` - 8 entries

Every `rows[].a` and `rows[].b` value is an **invented claim about a real product**, and
every `winner` is an unverified judgement. The measured rows ("time to first invoice: 34
minutes") are the highest risk: they read as data and are not.

### `src/content/alternatives/` - 8 entries

`whyPeopleLeave` is **invented**, not drawn from user research, support tickets or reviews.
`migrationSteps` describe export behaviour that has not been verified per product.

### `src/content/guides/` - 7 entries

Worked examples use invented input numbers. The arithmetic in them is correct; the inputs
are not researched. `publishDate` and `updatedDate` are invented.

---

## Deviations from the original brief, for the record

- **Two extra tools.** The brief listed nine sample tools. **Mindbody** and **Tekmetric**
  were added so that the salon-spa, fitness and auto-repair `/best/` pages have more than
  one entry to rank. Remove them if they are not in the real test plan.
- **Sample values are not from the design demo.** `shopownerstack-demo-v2.html` was not
  present in the working folder or the repository, so descriptions and numbers could not be
  taken from it. All sample values here were written fresh. If the demo file is recovered,
  reconcile these entries against it.

---

## Screenshots

There are no product screenshots anywhere in the repository, deliberately. Review pages use
the `MockScreenshot` component (`src/components/MockScreenshot.astro`), a CSS-drawn generic
application frame. It is clearly not a real screenshot and does not reproduce any vendor's
interface.

Replace it with real captures only when they exist, and check each vendor's brand and press
terms first.

---

## Pre-launch checklist

- [ ] Every tool re-tested against the `/how-we-test/` rubric; scores and subscores replaced
- [ ] Every `measurements` row re-run and the real result recorded
- [ ] Every pricing table checked against the vendor's page; "prices checked" date updated
- [ ] Every comparison row verified against both products
- [ ] Trade benchmark rates replaced with sourced figures and the source cited
- [ ] `affiliateUrl` and `partnerNetwork` filled in for approved programmes
- [ ] Guide worked examples rebuilt on researched inputs
- [ ] Real screenshots captured, or `MockScreenshot` retained deliberately
- [ ] This file deleted or replaced with a data-provenance note
