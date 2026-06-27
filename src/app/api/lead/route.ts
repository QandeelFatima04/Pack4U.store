import { NextResponse } from "next/server";

// Lead intake: the quote form and contact form post here.
// Sends an email (Resend) if configured; always logs. Attribution (UTMs) is
// included so every lead is attributable to a channel.

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
  answers?: Record<string, string>;
  attribution?: Record<string, string>;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function sendEmail(payload: LeadPayload) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL;
  if (!key || !to) return;

  const lines = Object.entries(payload)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
    .join("\n");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Pack4U Leads <leads@pack4u.store>",
        to,
        subject: `New ${payload.type} lead${payload.company ? ` — ${payload.company}` : ""}`,
        text: lines,
      }),
    });
  } catch (err) {
    console.error("[lead] email failed", err);
  }
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
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

  // TODO: persist to a database. For now: log + email notify.
  console.log("[lead]", JSON.stringify(payload));
  await sendEmail(payload);

  return NextResponse.json({ ok: true });
}
