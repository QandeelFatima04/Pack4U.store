import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PencilRuler, Layers, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SectionHeading, PricingTiers, Guarantees, CtaBand } from "@/components/sections";
import { PackagingTypeCard, IndustryTile } from "@/components/cards";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllPackagingTypes, getAllIndustries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Custom Packaging Pakistan — Design, Develop & Produce",
  description:
    "Custom paper packaging in Pakistan for product brands — boxes, bags, tags, sleeves and inserts. From concept and material selection to production-ready, branded packaging.",
  alternates: { canonical: "/custom-packaging" },
  keywords: ["custom packaging Pakistan", "branded packaging", "product packaging Pakistan"],
};

const steps = [
  { icon: PencilRuler, title: "Share your product & requirement", text: "Tell us what you sell, your quantity, size, budget range and packaging goal." },
  { icon: Layers, title: "We recommend structure & material", text: "We help you choose the right paper, packaging type, printing, finish and production route." },
  { icon: PackageCheck, title: "Prototype or finalize specs", text: "We align on dimensions, artwork, finishing and production feasibility." },
  { icon: Truck, title: "Production & delivery", text: "Your packaging is produced to the agreed specs and delivered for use." },
];

const crumbs = [{ name: "Home", url: "/" }, { name: "Custom Packaging", url: "/custom-packaging" }];

export default function CustomPackagingPage() {
  const types = getAllPackagingTypes();
  const industries = getAllIndustries();
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <ServiceJsonLd
        name="Custom Paper Packaging"
        description="Custom paper packaging for product brands — boxes, bags, tags, sleeves and inserts, from concept to production."
        url="/custom-packaging"
      />

      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Custom Packaging</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Custom paper packaging, from concept to finished production
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            We develop custom paper boxes, bags, tags, sleeves and inserts for product brands that need branded packaging for retail, gifting, food, fashion, cosmetics and e-commerce orders.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/get-quote">Get a packaging quote</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/estimate">Estimate a price <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* What we make */}
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="What we make" title="Custom packaging products we can develop" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <PackagingTypeCard key={t.slug} type={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <SectionHeading eyebrow="Who we work with" title="Packaging by industry" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <IndustryTile key={i.slug} industry={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="From packaging idea to production" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-bold text-brand">Step {i + 1}</p>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to start */}
      <section className="section bg-secondary/40">
        <div className="container-page space-y-12">
          <SectionHeading eyebrow="How we work" title="Pick a starting point, not a price list" align="center"
            subtitle="Every project is custom. These are the ways brands usually start with us." />
          <PricingTiers />
          <Guarantees />
        </div>
      </section>

      {/* Consultation teaser */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-col items-start gap-5 rounded-3xl border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Not sure what packaging you need?</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Our packaging consultation helps you choose the right structure, material, size, finish and production method before you spend.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/packaging-consultation">Request consultation</Link></Button>
              <WhatsAppButton source="custom-packaging" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
