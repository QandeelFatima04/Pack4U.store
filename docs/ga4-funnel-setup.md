# GA4 Funnel Setup — Manual Configuration Checklist

This document lists the GA4 admin steps that **cannot** be done in code. The site
already sends every event below (via the single `NEXT_PUBLIC_GA_ID` tag in
`src/components/analytics.tsx` and the `track()` helper in `src/lib/track.ts`).
No second GA tag or GTM container is used — do not add one.

Property: Pack4U · Measurement ID `G-RHKLE2QL6H`.

---

## 1. Register custom event-scoped dimensions

GA4 → **Admin → Custom definitions → Custom dimensions → Create**. Scope =
**Event** for all of these. `Dimension name` is your label; `Event parameter` must
match the parameter name exactly (case-sensitive).

| Dimension name | Event parameter |
| --- | --- |
| Funnel stage | `funnel_stage` |
| Next funnel stage | `next_funnel_stage` |
| Content cluster | `content_cluster` |
| Article slug | `article_slug` |
| Page type | `page_type` |
| Page slug | `page_slug` |
| CTA name | `cta_name` |
| CTA position | `cta_position` |
| Destination type | `destination_type` |
| Lead source | `lead_source` |
| Form name | `form_name` |
| Industry | `industry` |
| Packaging type | `packaging_type` |
| Quantity band | `quantity_band` |
| Click location | `click_location` |
| Estimator step | `estimator_step` |
| Estimator step number | `estimator_step_number` |

> GA4 allows up to 50 event-scoped custom dimensions — this uses 17. Register them
> before relying on them in explorations; historical data is not back-filled.

---

## 2. Mark key events (conversions)

GA4 → **Admin → Events** (or **Key events**) → toggle **Mark as key event**.

**Mark as key events:**
- `generate_lead` — the single canonical lead event (fires only after the server
  confirms a successful quote/contact submission).
- `whatsapp_click` — primary contact conversion.

**Secondary (optional to mark, useful as a micro-conversion):**
- `estimator_complete`

**Do NOT mark as key events** (mid-funnel / diagnostic signals):
`funnel_page_view`, `funnel_content_view`, `funnel_cta_click`, `estimator_start`,
`estimator_step_complete`, `quote_form_start`, `phone_click`, `email_click`, and
standard `scroll`.

> **Lead double-counting note:** the legacy `quote_request` / `form_submit` events
> are now sent to **Meta Pixel only** (`{ ga: false }` in `submit-lead.ts`) and no
> longer reach GA4. So GA4 sees exactly one `generate_lead` per successful
> submission, and `quote_request` is not a GA4 event — do not look for it or mark
> it as a key event. Meta Pixel still records one `Lead` per submission separately.

---

## 3. Funnel Exploration

GA4 → **Explore → Funnel exploration**. Build an **open** funnel (so users can
enter at any step):

1. `funnel_page_view` **or** `funnel_content_view`
2. `funnel_cta_click`
3. `estimator_start`
4. `estimator_complete`
5. `quote_form_start`
6. `generate_lead`

Suggested breakdowns (add as the exploration's Breakdown, one at a time):
`funnel_stage`, `content_cluster`, `page_type`, `article_slug` / `page_slug`,
`industry`, `packaging_type`, Session source/medium, Device category, Country.

---

## 4. Event & parameter reference (already emitted by the site)

| Event | Key params (all PII-free) |
| --- | --- |
| `funnel_page_view` | `page_type`, `page_slug`, `funnel_stage`, `content_cluster?` |
| `funnel_content_view` | `article_slug`, `funnel_stage`, `content_cluster` |
| `funnel_cta_click` | `page_type`, `page_slug?`, `funnel_stage`, `next_funnel_stage`, `content_cluster?`, `cta_name`, `cta_position`, `destination_type` |
| `estimator_start` | `industry`, `packaging_type` |
| `estimator_step_complete` | `estimator_step` (packaging/size/finishes/quantity), `estimator_step_number` (1–4), `industry`, `packaging_type`, `quantity_band?` |
| `estimator_complete` | `industry`, `packaging_type`, `quantity_band` |
| `quote_form_start` | `form_name`, `lead_source` |
| `generate_lead` | `lead_source` (quote_form/contact_form), `form_name`, `industry?`, `packaging_type?` |
| `whatsapp_click` | `click_location`, `page_type?`, `funnel_stage?` |
| `phone_click` | `click_location`, `page_type?` |
| `email_click` | `click_location`, `page_type?` |

No event sends names, emails, phone numbers, company names, free-text messages, or
uploaded/artwork filenames. Quantities are sent as coarse bands
(`100_249 … 5000_plus`), never exact figures.

---

## 5. Realtime + DebugView validation

1. **DebugView** (GA4 → Admin → DebugView): open the site with the GA Debug
   extension, or append `?gtm_debug=1`, or (dev) use the GA Debugger. Then:
   - Load a blog article → expect one `funnel_page_view` and one
     `funnel_content_view` with the article's `funnel_stage` / `content_cluster`.
   - Click the article's contextual CTA → one `funnel_cta_click`.
   - On `/estimate`, change an input → `estimator_start` once, then
     `estimator_step_complete` per step and one `estimator_complete`.
   - Submit a **test** quote (see below) → one `generate_lead`; confirm no
     `quote_request` appears in GA4.
   - Tap WhatsApp / phone / email links → `whatsapp_click` / `phone_click` /
     `email_click`.
2. **Realtime** (GA4 → Reports → Realtime): confirm the key events appear and that
   `generate_lead` counts 1 per successful submission.
3. Confirm exactly **one** GA tag loads (Network tab → a single
   `gtag/js?id=G-RHKLE2QL6H`).

> **Do not generate real leads during testing.** Test against a local build with
> `RESEND_API_KEY` unset (no sales email is sent) or intercept `/api/lead`. Never
> submit real enquiries against production.
