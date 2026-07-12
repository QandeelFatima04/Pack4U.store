import type { Metadata } from "next";
import { SectionHeading, CtaBand } from "@/components/sections";
import { Estimator } from "@/components/estimator";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Packaging Price Estimator — Instant Custom Packaging Estimate",
  description:
    "Estimate the price of custom packaging instantly. Pick your industry, packaging type, size, finishes and quantity for a per-unit and total cost, then request an exact quote.",
  alternates: { canonical: "/estimate" },
  keywords: ["packaging price estimator", "packaging cost calculator", "custom packaging price Pakistan"],
};

export default function EstimatePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Price Estimator", url: "/estimate" }]} />
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">Price Estimator</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl">
            Estimate your packaging price in seconds
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Choose your industry, packaging type, size, finishes and quantity for an instant per-unit and total price. Minimum order quantities vary by product. When you&apos;re ready, send it through for an exact quote.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <Estimator />
        </div>
      </section>

      <CtaBand
        title="Want the exact number?"
        subtitle="Send us your spec and we'll confirm an exact quote — usually within one business day."
      />
    </>
  );
}
