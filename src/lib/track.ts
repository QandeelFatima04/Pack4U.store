// Key-event tracking helper. Fires to GA4 (gtag) and Meta Pixel (fbq) if present.
// Key events per the diagnosis chat: WhatsApp click, form submit, sample-kit
// request, catalogue download, call click, begin/complete checkout.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type KeyEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "form_submit"
  | "sample_kit_request"
  | "quote_request"
  | "estimate_generated"
  | "quiz_complete"
  | "catalogue_download"
  | "begin_checkout"
  | "purchase"
  // --- Marketing funnel events (GA4-only; see META_EVENT for exceptions) ---
  | "funnel_page_view"
  | "funnel_content_view"
  | "funnel_cta_click"
  | "estimator_start"
  | "estimator_step_complete"
  | "estimator_complete"
  | "quote_form_start"
  | "generate_lead";

// Map our events to Meta standard events where one fits.
const META_EVENT: Partial<Record<KeyEvent, string>> = {
  whatsapp_click: "Contact",
  phone_click: "Contact",
  form_submit: "Lead",
  sample_kit_request: "Lead",
  quote_request: "Lead",
  // The estimate is real buying intent but not yet a lead — no contact details
  // are collected. Meta's InitiateCheckout is the closest standard fit.
  estimate_generated: "InitiateCheckout",
  quiz_complete: "Lead",
  catalogue_download: "ViewContent",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  // NOTE: `generate_lead` has no Meta mapping on purpose — it is the canonical
  // GA4 lead event. Meta's `Lead` keeps coming from `quote_request`/`form_submit`
  // (fired Meta-only by submit-lead), so neither platform double-counts a lead.
};

/**
 * Fire a key event. Defaults to both GA4 (gtag) and Meta Pixel (fbq) where a
 * Meta mapping exists. Pass `opts` to restrict a destination — e.g.
 * `track("quote_request", params, { ga: false })` sends Meta-only so the event
 * does not also land in GA4 (avoids double-counting alongside `generate_lead`).
 */
export function track(
  event: KeyEvent,
  params: Record<string, unknown> = {},
  opts: { ga?: boolean; meta?: boolean } = {},
) {
  if (typeof window === "undefined") return;
  const { ga = true, meta = true } = opts;
  if (ga) {
    try {
      window.gtag?.("event", event, params);
    } catch {
      /* noop */
    }
  }
  if (meta) {
    try {
      const metaName = META_EVENT[event];
      if (metaName) window.fbq?.("track", metaName, params);
    } catch {
      /* noop */
    }
  }
}
