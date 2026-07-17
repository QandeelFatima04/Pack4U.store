// Hands a submitted RFQ to /get-quote/confirmation so the buyer sees their
// reference and what they sent. Session-scoped: the confirmation page is a
// receipt for this submission, not a durable record.

const KEY = "pack4u_rfq";

export type SubmittedRfq = {
  reference: string;
  submittedAt: string;
  /** True when the notification email actually went out. */
  delivered: boolean;
  name?: string;
  email?: string;
  spec: [string, string][];
  files: string[];
};

export function writeRfq(rfq: SubmittedRfq) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(rfq));
  } catch {
    /* noop */
  }
}

/** Raw JSON, or null. Returns a primitive so it is a stable snapshot for
 *  useSyncExternalStore — parsing here would allocate a new object per call and
 *  spin the render loop. */
export function readRfqRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseRfq(raw: string | null): SubmittedRfq | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SubmittedRfq;
  } catch {
    return null;
  }
}

/** The receipt is written once before navigation and never changes while the
 *  page is open, so there is nothing to subscribe to. */
export function subscribeRfq() {
  return () => {};
}
