"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PackagingTypeCard, IndustryTile, ProjectCard } from "@/components/cards";
import {
  ShareRequirementIllustration,
  MaterialAdviceIllustration,
  FinalizeSpecsIllustration,
  ProductionDeliveryIllustration,
} from "@/components/process-illustrations";
import { FaqAccordion } from "@/components/faq-accordion";
import { SectionHeading, PricingTiers, CtaBand } from "@/components/sections";
import { Testimonials } from "@/components/testimonials";
import {
  FadeIn,
  StaggerIn,
  StaggerItem,
  AnimatedHeadline,
  AnimatedLine,
} from "@/components/ui/animate";
import {
  getAllIndustries,
  getAllPackagingTypes,
  getFeaturedProjects,
  getFaqs,
} from "@/lib/content";
import { site } from "@/lib/site";

const heroImages = [
  { src: "/images/hero/hero-1.jpg", alt: "Custom printed cosmetic and perfume packaging", cls: "row-span-2" },
  { src: "/images/hero/hero-3.jpg", alt: "Premium rigid corporate gift box" },
  { src: "/images/hero/hero-2.jpg", alt: "Branded coffee and food packaging box" },
  { src: "/images/hero/hero-4.jpg", alt: "Custom rigid retail box" },
];

const steps = [
  { illustration: ShareRequirementIllustration, title: "Share your product & requirement", text: "Tell us what you sell, your quantity, size, budget and goal." },
  { illustration: MaterialAdviceIllustration, title: "Get structure & material advice", text: "We recommend the right paper, type, printing and finish." },
  { illustration: FinalizeSpecsIllustration, title: "Finalize specs or prototype", text: "We align on size, artwork, finishing and feasibility." },
  { illustration: ProductionDeliveryIllustration, title: "Production & delivery", text: "Produced to the agreed spec and delivered for use." },
];

export default function HomePage() {
  const industries = getAllIndustries();
  const types = getAllPackagingTypes();
  const projects = getFeaturedProjects();
  const faqs = getFaqs().slice(0, 6);

  return (
    <>
      {/* ── HERO (dark, with packaging collage) ── */}
      <section className="relative -mt-16 overflow-hidden bg-primary text-primary-foreground">
        <div className="container-page grid items-start gap-12 pt-24 pb-16 lg:grid-cols-2 lg:pt-28 lg:pb-20">
          <div>
            <AnimatedLine delay={0.1}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                Custom paper packaging for product brands
              </span>
            </AnimatedLine>
            <h1 className="mt-6 font-[family-name:var(--font-heading)] text-4xl font-bold leading-[1.07] tracking-tight sm:text-5xl lg:text-6xl">
              <AnimatedHeadline text="Custom Packaging" delay={0.2} />
              <br />
              <AnimatedHeadline text="for Product" delay={0.5} />{" "}
              <AnimatedHeadline text="Brands" delay={0.7} className="text-brand" />
            </h1>
            <AnimatedLine delay={1} className="mt-6 max-w-xl text-lg text-white/75">
              We design, develop and produce custom boxes, bags, tags, sleeves, inserts and branded paper packaging for retail, gifting, food, fashion, cosmetics and e-commerce.
            </AnimatedLine>
            <AnimatedLine delay={1.15} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link href="/get-quote">Get a packaging quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15">
                <Link href="/estimate"><Calculator className="h-4 w-4" /> Estimate a price</Link>
              </Button>
            </AnimatedLine>
            <AnimatedLine delay={1.3}>
              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
                {[
                  { label: "MOQ from", value: "300 units" },
                  { label: "Lead time", value: "7–15 days" },
                  { label: "Industries", value: "6+ served" },
                  { label: "Made in", value: site.country },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-widest text-white/45">{label}</dt>
                    <dd className="mt-0.5 text-2xl font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </AnimatedLine>
          </div>

          {/* Collage */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroImages.map((img) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-2xl border border-white/10 ${img.cls ?? ""} ${img.cls ? "aspect-auto" : "aspect-square"}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── BUYER ROUTING TILES ── */}
      <section className="section">
        <div className="container-page">
          <FadeIn>
            <SectionHeading eyebrow="Find your brief" title="What type of packaging do you need?"
              subtitle="Pick your industry and we'll show the packaging types, customization and examples that fit your product." />
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
            {industries.map((i) => (
              <StaggerItem key={i.slug} className="h-full">
                <IndustryTile industry={i} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── WHAT WE MAKE ── */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <FadeIn>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="What we make" title="Custom packaging products we develop"
                subtitle="Made to your size, material, printing and finish." />
              <Button asChild variant="outline" className="hidden shrink-0 sm:inline-flex">
                <Link href="/packaging-types">All types <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
            {types.map((t) => (
              <StaggerItem key={t.slug} className="h-full">
                <PackagingTypeCard type={t} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section">
        <div className="container-page">
          <FadeIn>
            <SectionHeading eyebrow="How it works" title="From packaging idea to production" />
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" delay={0.05}>
            {steps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="h-full rounded-2xl border bg-card p-6">
                  <div className="overflow-hidden rounded-xl bg-brand/5">
                    <s.illustration className="h-24 w-full" preserveAspectRatio="xMidYMid meet" />
                  </div>
                  <p className="mt-4 text-xs font-bold text-brand">Step {i + 1}</p>
                  <h3 className="mt-1 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerIn>
          <FadeIn delay={0.15} className="mt-10">
            <Button asChild size="lg"><Link href="/get-quote">Start your packaging project</Link></Button>
          </FadeIn>
        </div>
      </section>

      {/* ── ESTIMATOR TEASER ── */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <FadeIn>
            <div className="grid items-center gap-8 rounded-3xl border bg-card p-8 sm:p-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow">Instant estimate</p>
                <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold">
                  Get a price before you talk to anyone
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Use our estimator to get an instant price range and per-unit cost — pick your packaging type, size, finishes and quantity. MOQ starts at 300 units.
                </p>
                <div className="mt-6">
                  <Button asChild size="lg"><Link href="/estimate"><Calculator className="h-4 w-4" /> Open the estimator</Link></Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Boxes", "Bags", "Tags", "Sleeves", "Gift boxes", "Inserts"].map((t) => (
                  <div key={t} className="rounded-xl border bg-secondary/40 px-3 py-4 text-center text-sm font-semibold">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PORTFOLIO PROOF ── */}
      <section className="section">
        <div className="container-page">
          <FadeIn>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="Proof" title="Packaging work across product categories" />
              <Button asChild variant="outline" className="hidden shrink-0 sm:inline-flex">
                <Link href="/portfolio">View portfolio <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
            {projects.map((p) => (
              <StaggerItem key={p.slug} className="h-full">
                <ProjectCard project={p} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── SOCIAL PROOF (renders only when real testimonials/logos exist) ── */}
      <Testimonials />

      {/* ── CONSULTATION + SUSTAINABILITY ── */}
      <section className="section bg-secondary/40">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <div className="flex h-full flex-col rounded-3xl border bg-card p-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Not sure what packaging you need?</h2>
              <p className="mt-3 flex-1 text-muted-foreground">
                We help brands choose the right packaging structure, material, size, finish and production method before they spend on packaging that may not fit.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild><Link href="/packaging-consultation">Request consultation</Link></Button>
                <Button asChild variant="outline"><Link href="/packaging-for-startups">Packaging for startups</Link></Button>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl border bg-card p-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Sustainable options, without losing practicality</h2>
              <p className="mt-3 flex-1 text-muted-foreground">
                Moving away from plastic? We can recommend recycled, biodegradable or lower-impact paper options where they suit your product and budget.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline"><Link href="/sustainable-packaging-upgrade">Explore sustainable upgrade</Link></Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── WAYS TO START ── */}
      <section className="section">
        <div className="container-page">
          <FadeIn>
            <SectionHeading eyebrow="How we work" title="Pick a starting point" align="center"
              subtitle="Every project is custom — these are the ways brands usually start with us." />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-12">
            <PricingTiers />
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section bg-secondary/40">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Answers buyers ask first" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button asChild variant="outline"><Link href="/faq">See all FAQs</Link></Button>
              <WhatsAppButton source="home-faq" label="Ask on WhatsApp" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-8">
            <FaqAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
