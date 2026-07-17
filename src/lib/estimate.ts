// Estimator → quote handoff.
//
// The estimator writes the full spec here when the buyer clicks through to
// /get-quote; the quote form reads it and prefills. The URL params the
// estimator already appends stay as the fallback, so deep links and shared
// WhatsApp links keep working when sessionStorage is empty (new tab, cleared
// storage, link opened on another device).

const KEY = "pack4u_estimate";

/** Bump when the pricing inputs or estimator fields change shape, so a stored
 *  spec from an older build is ignored rather than misread. */
export const ESTIMATE_CALC_VERSION = 1;

export type EstimateSpec = {
  calcVersion: number;
  /** EST-YYMMDD-XXXX — quoted back to the buyer and attached to the RFQ. */
  reference: string;
  /** ISO timestamp of when the estimate was calculated. */
  calculatedAt: string;
  industrySlug: string;
  industryName: string;
  productName: string;
  /** Packaging-type slug, for the quote form's projectType select. */
  typeValue: string;
  sizeId: string;
  sizeLabel: string;
  /** Finish keys as used by the estimator (printing, foiling, …). */
  finishKeys: string[];
  finishLabels: string[];
  /** The exact quantity the buyer chose — the quote form buckets this into a
   *  range for its select, so the real number travels here for sales. */
  quantity: number;
  moq: number;
  perUnit: number;
  total: number;
};

/** The estimator's finish keys and the quote form's customization checkbox ids
 *  are not spelled the same. Translate so a finish picked in the estimator
 *  arrives pre-ticked on the form. */
const FINISH_KEY_TO_CUSTOMIZATION_ID: Record<string, string> = {
  printing: "printing",
  embossing: "emboss",
  foiling: "foiling",
  spotuv: "spot-uv",
  lamination: "lamination",
};

export function finishKeysToCustomizationIds(keys: string[]): string[] {
  return keys.map((k) => FINISH_KEY_TO_CUSTOMIZATION_ID[k] ?? k);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** EST-YYMMDD-XXXX / RFQ-YYMMDD-XXXX. Not globally unique — enough to quote
 *  back to a buyer and find a lead in the inbox. */
export function makeReference(prefix: string, now = new Date()) {
  const date = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const suffix = Math.floor(Math.random() * 10000);
  return `${prefix}-${date}-${String(suffix).padStart(4, "0")}`;
}

export function writeEstimate(spec: EstimateSpec) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(spec));
  } catch {
    // Private mode or storage full — the URL params still carry the basics.
  }
}

export function readEstimate(): EstimateSpec | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const spec = JSON.parse(raw) as EstimateSpec;
    if (spec?.calcVersion !== ESTIMATE_CALC_VERSION) return null;
    return spec;
  } catch {
    return null;
  }
}

export function clearEstimate() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
