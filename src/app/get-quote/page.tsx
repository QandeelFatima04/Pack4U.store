import type { Metadata } from "next";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { guarantees } from "@/lib/content";
import { site, telLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Packaging Quote — Custom Packaging Quote",
  description:
    "Request a custom packaging quote from Pack4U. Tell us your product, packaging type, quantity and finishes and we'll send practical options and pricing.",
  alternates: { canonical: "/get-quote" },
};

const crumbs = [{ name: "Home", url: "/" }, { name: "Get a Quote", url: "/get-quote" }];

export default function GetQuotePage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Get a quote</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl">
            Tell us about your packaging
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Share your product, quantity and packaging goal. We&apos;ll guide you toward a practical packaging option and quote.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading form…</div>}>
              <QuoteForm />
            </Suspense>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border bg-secondary/40 p-6">
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">Why brands choose Pack4U</h2>
                <ul className="mt-4 space-y-2.5">
                  {guarantees.map((g) => (
                    <li key={g} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">Prefer to talk?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Message us on WhatsApp or call — we reply fast on weekdays.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <WhatsAppButton source="get-quote-aside" />
                  <a href={telLink()} className="text-sm font-semibold text-brand hover:underline">
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
