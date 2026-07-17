import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand } from "@/components/sections";
import { EstimatorWithPreset } from "@/components/estimator-with-preset";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Packaging Price Estimator — Instant Custom Packaging Estimate",
  description:
    "Estimate the price of custom packaging instantly. Pick your industry, packaging type, size, finishes and quantity for a per-unit and total cost, then request an exact quote.",
  alternates: { canonical: "/estimate" },
  keywords: ["packaging price estimator", "packaging cost calculator", "custom packaging price Pakistan"],
};

const crumbs = [{ name: "Home", url: "/" }, { name: "Price Estimator", url: "/estimate" }];

export default function EstimatePage() {
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs items={crumbs} />
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
          {/* ?type=<slug> preselects that product, so a buyer arriving from a
              product card doesn't pick it again. The fallback must not be a real
              <Estimator/> — it would render a second one with duplicate field ids. */}
          <Suspense
            fallback={
              <div
                className="h-[28rem] animate-pulse rounded-2xl bg-secondary/40"
                aria-label="Loading the estimator"
              />
            }
          >
            <EstimatorWithPreset />
          </Suspense>
        </div>
      </section>

      <CtaBand
        title="Want the exact number?"
        subtitle="Send us your spec and we'll confirm an exact quote — usually within one business day."
      />
    </>
  );
}
