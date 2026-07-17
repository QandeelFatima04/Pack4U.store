"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Paperclip, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { readRfqRaw, parseRfq, subscribeRfq } from "@/lib/rfq";
import { site, telLink } from "@/lib/site";
import { track } from "@/lib/track";

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

        {/* Delivery is best-effort: never claim an email was sent when it wasn't. */}
        {rfq.delivered ? (
          <p className="mt-4 text-sm text-muted-foreground">
            We&apos;ve sent a confirmation
            {rfq.email ? ` to ${rfq.email}` : ""} and usually reply within one working day.
          </p>
        ) : (
          <div className="mt-4 flex gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>
              We have your details, but we couldn&apos;t send your confirmation email just now.
              Please message us on WhatsApp with your reference so we can pick this up straight
              away.
            </p>
          </div>
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
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <WhatsAppButton
            source="quote-confirmation"
            text={`Hi Pack4U, I've just submitted a packaging request${rfq.reference ? ` (${rfq.reference})` : ""}. Could you confirm you've received it?`}
          />
          <a
            href={telLink()}
            onClick={() => track("call_click", { source: "quote-confirmation" })}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            <Phone className="h-5 w-5" />
            {site.phoneDisplay}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            <Mail className="h-5 w-5" />
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
