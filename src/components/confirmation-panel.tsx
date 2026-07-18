"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, Paperclip, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CallLink } from "@/components/call-link";
import { EmailLink } from "@/components/email-link";
import { readRfqRaw, parseRfq, subscribeRfq } from "@/lib/rfq";
import { site } from "@/lib/site";

const NEXT_STEPS = [
  "Pack4U reviews your submitted specifications.",
  "We contact you if anything needs clarification.",
  "You receive a formal quotation.",
  "A sample or artwork proof is prepared where required.",
  "Production begins only after your approval and agreed payment.",
];

export function ConfirmationPanel() {
  // sessionStorage is client-only. The server snapshot is null, so the receipt
  // renders after hydration without a mismatch.
  const raw = useSyncExternalStore(subscribeRfq, readRfqRaw, () => null);
  const rfq = useMemo(() => parseRfq(raw), [raw]);

  // Direct hit with no submission in this session.
  if (!rfq) {
    return (
      <div className="rounded-2xl border bg-secondary/40 p-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
          Nothing to show here
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We can&apos;t find a recent request in this browser. If you&apos;ve already sent one,
          it&apos;s with us — check your email for the reference. Otherwise, start a new request.
        </p>
        <Button asChild className="mt-5">
          <Link href="/get-quote">Request a quote</Link>
        </Button>
      </div>
    );
  }

  const submitted = new Date(rfq.submittedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-brand" />
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
              Request received
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Submitted {submitted}</p>
          </div>
        </div>

        {rfq.reference && (
          <div className="mt-6 rounded-xl border border-brand/30 bg-brand/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your reference
            </p>
            <p className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-brand">
              {rfq.reference}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Quote this if you get in touch about your request.
            </p>
          </div>
        )}

        {/* Delivery is best-effort: never claim an email was sent when it wasn't.
            When it wasn't, degrade gracefully — the request is still safely
            captured under its reference; nudge WhatsApp without alarming copy. */}
        {rfq.delivered ? (
          <p className="mt-4 text-sm text-muted-foreground">
            We&apos;ve sent a confirmation
            {rfq.email ? ` to ${rfq.email}` : ""} and usually reply within one working day.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Your request is saved{rfq.reference ? ` under ${rfq.reference}` : ""} and we usually
            reply within one working day. For the fastest response, message us on WhatsApp with
            your reference and we&apos;ll pick it up straight away.
          </p>
        )}
      </div>

      {rfq.spec.length > 0 && (
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">
            What you sent us
          </h2>
          <dl className="mt-4 divide-y text-sm">
            {rfq.spec.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {rfq.files.length > 0 && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Paperclip className="h-4 w-4 shrink-0" />
              {rfq.files.join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border bg-secondary/40 p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">
          What happens next
        </h2>
        <ol className="mt-4 space-y-2.5 text-sm">
          {NEXT_STEPS.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-muted-foreground">
          Any figure shown in our estimator is indicative. Your formal quote is confirmed after we
          review your specifications, artwork and delivery requirements.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">
          Need us sooner?
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:flex-nowrap">
          <WhatsAppButton
            source="quote-confirmation"
            text={`Hi Pack4U, I've just submitted a packaging request${rfq.reference ? ` (${rfq.reference})` : ""}. Could you confirm you've received it?`}
            className="px-4 whitespace-nowrap"
          />
          <CallLink
            source="quote-confirmation"
            pageType="quote_confirmation"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-brand px-4 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            <Phone className="h-5 w-5 shrink-0" />
            {site.phoneDisplay}
          </CallLink>
          <EmailLink
            clickLocation="quote-confirmation"
            pageType="quote_confirmation"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-brand px-4 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            <Mail className="h-5 w-5 shrink-0" />
            {site.email}
          </EmailLink>
        </div>
      </div>
    </div>
  );
}
