import type { Metadata } from "next";
import { SectionHeading, CtaBand } from "@/components/sections";
import { IndustryTile } from "@/components/cards";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { getAllIndustries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries We Package For — Cosmetics, Food, Fashion & More",
  description:
    "Custom packaging by industry: cosmetics & skincare, food & bakery, fashion & accessories, e-commerce, gift and retail. Find packaging built for your product category.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesHub() {
  const industries = getAllIndustries();
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Industries", url: "/industries" }]} />
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">Industries</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl">
            Packaging built for your product category
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            We organise packaging around the way your product is sold, presented and shipped. Pick your industry to see the packaging types, customization and examples that fit.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <IndustryTile key={i.slug} industry={i} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
