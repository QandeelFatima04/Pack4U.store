import { NextResponse } from "next/server";
import { site } from "@/lib/site";

// Lead intake: the quote form and contact form post here.
//
// Quote submissions get an RFQ reference, a structured notification to sales
// (with any uploaded artwork attached), and a confirmation email back to the
// buyer. Attribution (UTMs) is included so every lead is attributable.
//
// TODO: persist to a database. For now: log + email. If email is not configured
// the response reports `delivered: false` so the form can show the WhatsApp
// fallback rather than a false success.

export type LeadPayload = {
  type: "contact" | "quote";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string; // industry
  message?: string;
  product?: string; // packaging type / product
  quantity?: string;
  timeline?: string;
  /** Intent tag for sales routing (blueprint §14). */
  leadTag?: string;
  /** Page the RFQ was submitted from. */
  sourcePage?: string;
  answers?: Record<string, string>;
  attribution?: Record<string, string>;
};

export type LeadResponse = {
  ok: boolean;
  error?: string;
  /** RFQ-YYMMDD-XXXX, for quote submissions. */
  reference?: string;
  /** False when the notification could not be emailed (unconfigured or failed). */
  delivered?: boolean;
};

type Attachment = { filename: string; content: string };

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 5;

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function makeReference(prefix: string, now = new Date()) {
  const date = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  return `${prefix}-${date}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
}

function esc(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function resendSend(body: Record<string, unknown>): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: "Pack4U Leads <leads@pack4u.store>", ...body }),
    });
    if (!res.ok) {
      console.error("[lead] resend rejected", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[lead] email failed", err);
    return false;
  }
}

/** Sales notification — the full spec, so a quote can be prepared without
 *  opening anything else. */
async function notifySales(
  payload: LeadPayload,
  reference: string | undefined,
  attachments: Attachment[],
): Promise<boolean> {
  const to = process.env.LEADS_NOTIFY_EMAIL;
  if (!to) return false;

  const rows: [string, string][] = [];
  const add = (label: string, value?: string) => {
    if (value) rows.push([label, value]);
  };

  if (reference) add("RFQ reference", reference);
  add("Lead tag", payload.leadTag);
  add("Name", payload.name);
  add("Company", payload.company);
  add("Email", payload.email);
  add("Phone / WhatsApp", payload.phone);
  add("Industry", payload.businessType);
  add("Packaging", payload.product);
  add("Quantity", payload.quantity);
  add("Timeline", payload.timeline);
  add("Message", payload.message);
  add("Source page", payload.sourcePage);
  for (const [k, v] of Object.entries(payload.answers ?? {})) add(k, v);
  for (const [k, v] of Object.entries(payload.attribution ?? {})) add(`utm: ${k}`, v);
  if (attachments.length) add("Attachments", attachments.map((a) => a.filename).join(", "));

  const html =
    `<h2>New ${esc(payload.type)} lead${reference ? ` — ${esc(reference)}` : ""}</h2><table>` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:2px 12px 2px 0;color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`,
      )
      .join("") +
    `</table>`;

  const subject =
    `New ${payload.type} lead` +
    (reference ? ` ${reference}` : "") +
    (payload.company ? ` — ${payload.company}` : "");

  return resendSend({
    to,
    subject,
    html,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    ...(payload.email ? { reply_to: payload.email } : {}),
    ...(attachments.length ? { attachments } : {}),
  });
}

/** Buyer confirmation — what they sent, the reference, and what happens next. */
async function confirmToBuyer(
  payload: LeadPayload,
  reference: string,
  attachments: Attachment[],
): Promise<boolean> {
  if (!payload.email) return false;

  const spec: [string, string][] = [];
  const add = (label: string, value?: string) => {
    if (value) spec.push([label, value]);
  };
  add("Packaging", payload.product);
  add("Industry", payload.businessType);
  add("Quantity", payload.quantity);
  add("Timeline", payload.timeline);
  add("Estimate reference", payload.answers?.estimateReference);
  add("Estimated figure", payload.answers?.estimatorRange);
  if (attachments.length) add("Files received", attachments.map((a) => a.filename).join(", "));

  const steps = [
    "Pack4U reviews your submitted specifications.",
    "We contact you if anything needs clarification.",
    "You receive a formal quotation.",
    "A sample or artwork proof is prepared where required.",
    "Production begins only after your approval and agreed payment.",
  ];

  const html = `
    <p>Hi ${esc(payload.name || "there")},</p>
    <p>Thanks for your request — we've received it. Your reference is <strong>${esc(reference)}</strong>.
    Please quote it if you get in touch.</p>
    <p><strong>Submitted ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong></p>
    <h3>What you sent us</h3>
    <table>${spec
      .map(
        ([k, v]) =>
          `<tr><td style="padding:2px 12px 2px 0;color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`,
      )
      .join("")}</table>
    <h3>What happens next</h3>
    <ol>${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <p>We usually reply within one working day. Any figure you saw in our estimator is indicative —
    your formal quote is confirmed after we review your specifications.</p>
    <p>Need to reach us sooner?<br>
    WhatsApp / phone: ${esc(site.phoneDisplay)}<br>
    Email: ${esc(site.email)}</p>
    <p>— ${esc(site.name)}</p>
  `;

  return resendSend({
    to: payload.email,
    subject: `We've received your packaging request — ${reference}`,
    html,
  });
}

/** Quote form posts multipart when artwork is attached, JSON otherwise.
 *  The contact form always posts JSON. */
async function parseRequest(
  request: Request,
): Promise<{ payload: LeadPayload; attachments: Attachment[] }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return { payload: (await request.json()) as LeadPayload, attachments: [] };
  }

  const form = await request.formData();
  const payload = JSON.parse(String(form.get("payload") ?? "{}")) as LeadPayload;

  const attachments: Attachment[] = [];
  for (const entry of form.getAll("files")) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (attachments.length >= MAX_FILES) break;
    if (entry.size > MAX_FILE_BYTES) continue; // client guards too; ignore quietly
    const buf = Buffer.from(await entry.arrayBuffer());
    attachments.push({ filename: entry.name, content: buf.toString("base64") });
  }

  return { payload, attachments };
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  let attachments: Attachment[];
  try {
    ({ payload, attachments } = await parseRequest(request));
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (!payload.type) {
    return NextResponse.json({ ok: false, error: "Missing type" }, { status: 400 });
  }
  if (payload.email && !isEmail(payload.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  if (!payload.email && !payload.phone) {
    return NextResponse.json(
      { ok: false, error: "Provide an email or WhatsApp number" },
      { status: 400 },
    );
  }

  const reference = payload.type === "quote" ? makeReference("RFQ") : undefined;

  console.log(
    "[lead]",
    JSON.stringify({
      ...payload,
      reference,
      files: attachments.map((a) => a.filename),
    }),
  );

  const notified = await notifySales(payload, reference, attachments);
  if (reference) {
    // Best-effort: the buyer's copy failing must not fail the submission.
    await confirmToBuyer(payload, reference, attachments);
  }

  const res: LeadResponse = { ok: true, reference, delivered: notified };
  return NextResponse.json(res);
}
