---
title: How to switch field service software without losing money
slug: how-to-switch-field-service-software
description: A six-week changeover plan for a small shop, and the four things that most often go wrong in a migration.
publishDate: 2026-02-19
updatedDate: 2026-09-26
summary: >-
  Export everything while the old account is still live, rebuild your price book rather than importing it, run both systems
  for one billing cycle, re-create recurring work by hand, and only cancel once your phone number and booking links have moved.
  Most losses come from job photos, recurring visits, accounting mapping and cancelling too early.
faq:
  - q: How long does it take to switch field service software?
    a: >-
      For a small shop, plan on four to six weeks from first export to cancelling the old system, including one full billing cycle
      running both. The data import itself is often the quick part.
  - q: Can I export my data from my current field service software?
    a: >-
      Usually, for core records. Jobber's help center, for example, documents CSV exports for clients, jobs and invoices.
      Attachments such as photos and signed forms are often harder, so check your vendor's help center early.
  - q: Will I lose my business phone number if I switch?
    a: >-
      Not if you port it properly. The FCC says not to cancel your old service before the port completes, because the number
      has to be active to transfer. Once the port is done, the old line is cancelled automatically.
  - q: Should I import my old price book?
    a: >-
      In our assessment, rebuilding is usually better. It clears out outdated prices and duplicates and gives you a chance to reprice.
  - q: What is the biggest risk in a software migration?
    a: >-
      Recurring visits and service agreements that do not carry over with the right next dates, because the missing revenue
      may not show up for months.
sources:
  - title: FCC - Porting, keeping your phone number when you change providers
    url: https://www.fcc.gov/consumers/guides/porting-keeping-your-phone-number-when-you-change-providers
  - title: Jobber Help Center - Import or export clients
    url: https://help.getjobber.com/hc/en-us/sections/7792823112087-Import-or-Export-Clients
  - title: Jobber Help Center - Invoices report
    url: https://help.getjobber.com/hc/en-us/articles/17291337236247-Invoices-Report
  - title: Jobber Help Center - Recurring jobs report
    url: https://help.getjobber.com/hc/en-us/articles/20440772134807-Recurring-Jobs-Report
---

Migrations tend to fail in predictable ways. Losing the customer list is rare. Losing two weeks of
productivity, a month of recurring invoices or a folder of job photos you needed for a warranty
dispute is much more common. The plan below is general best practice; check your old and new
vendors' help centers for exactly what each one can export and import.

## Should you switch field service software at all?

Only if you can name a specific decision you cannot make today. "The software is annoying" is not a
reason; most products are annoying somewhere by month six. "I cannot see labor cost per job" or "I
cannot tell which ads produce booked jobs" are reasons, because they name what you are buying.

If you cannot finish that sentence, stay where you are and spend the effort on your price book
instead.

## What should you export before you switch?

Everything, while the old account is still live, and on the same day so cross-references line up.
Most products export core records such as clients, jobs and invoices to CSV. Jobber's help center,
for example, documents CSV exports for clients and for invoice and job reports.

Then go after what is often not in the CSVs, which is where migrations actually go wrong:

- **Job photos and signed forms.** Check how your vendor exports attachments. If it is one job at a
  time, start early.
- **Automation rules.** Quote follow-ups and reminder schedules generally do not export. Screenshot
  or write them down.
- **Recurring jobs and service agreements with their next-visit dates.** Export a recurring jobs
  report if your system has one. The dates are what break.
- **Call recordings and text history**, if your system has them.

## Should you import or rebuild your price book?

In our assessment, rebuild it. A straight import carries across years of drift: prices you meant to
update, line items nobody uses, duplicates. Rebuilding takes time but it is the one chance to
reprice without a customer conversation. Use it together with our
[guide to pricing a service job](/guides/how-to-price-a-service-job/).

## Why run both systems at once?

Because one full billing cycle in parallel surfaces what you forgot. New jobs go into the new
system; open jobs finish in the old one. It is not elegant, but it is safer.

Watch three things specifically: that invoices are reaching customers, that card payments are
settling into the right bank account, and that the accounting sync is posting to the right accounts.
Check the first few invoices line by line with whoever does your books.

## How do you move recurring work?

Carefully, and usually by hand. Recurring maintenance visits and service agreements often do not
import with the correct next dates. Rebuild them, then check that the first generated visit for each
one lands on the right day.

This is the failure that costs real money, because a recurring visit that silently stops generating
is revenue you may not notice missing for months.

## When is it safe to cancel the old system?

Only after your phone number, booking links and final export are sorted. Update your website booking
link, Google Business Profile and email signatures. Take one final full export. Then cancel.

If your old system hosts your business phone number, port it before cancelling. The FCC's consumer
guide is explicit: do not end service with your current provider before the port is initiated,
because the number has to be active to transfer, and the old line cancels automatically once the
port completes. Keep read-only access for a month if the vendor allows it; if not, keep the export
somewhere searchable.

## What are the four things that most often go wrong?

1. **Job photos** left behind because nobody checked how attachments export
2. **Recurring visits** that stop generating and are not noticed for a quarter
3. **Accounting mapping** that posts to the wrong accounts until the bookkeeper catches it
4. **Cancelling too early**, especially with a hosted phone number, where cancelling before the port
   completes can take your main line off the air

Tool-specific versions of this plan are on each alternatives page, for example
[Housecall Pro alternatives](/alternatives/housecall-pro/) or
[Jobber alternatives](/alternatives/jobber/). Before you sign with the new vendor, run through the
[software contract checklist](/guides/saas-contract-checklist/).
