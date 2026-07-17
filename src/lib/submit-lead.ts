import { getAttribution } from "@/lib/utm";
import { track, type KeyEvent } from "@/lib/track";
import type { LeadPayload, LeadResponse } from "@/app/api/lead/route";

const EVENT_BY_TYPE: Record<LeadPayload["type"], KeyEvent> = {
  contact: "form_submit",
  quote: "quote_request",
};

/** Posts multipart when files are attached (so the bytes actually reach us),
 *  plain JSON otherwise. */
export async function submitLead(
  payload: Omit<LeadPayload, "attribution">,
  files: File[] = [],
): Promise<LeadResponse> {
  const body: LeadPayload = {
    ...payload,
    sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
    attribution: getAttribution() as Record<string, string>,
  };

  const init: RequestInit = { method: "POST" };
  if (files.length) {
    const fd = new FormData();
    fd.set("payload", JSON.stringify(body));
    for (const file of files) fd.append("files", file);
    init.body = fd; // let the browser set the multipart boundary
  } else {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }

  try {
    const res = await fetch("/api/lead", init);
    const data = (await res.json()) as LeadResponse;
    if (data.ok) track(EVENT_BY_TYPE[payload.type], { type: payload.type });
    return data;
  } catch {
    return { ok: false, error: "Network error. Please try WhatsApp instead." };
  }
}
