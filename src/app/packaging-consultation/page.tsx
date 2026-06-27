import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading, CtaBand } from "@/components/sections";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { getAllConsultationTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Packaging Consultation — Development & Cost Optimization",
  description:
    "Packaging development and cost optimization consultation: packaging for startups, sustainable upgrades, cost optimization and redesign. Make practical decisions before production.",
  alternates: { canonical: "/packaging-consultation" },
};

export default function ConsultationHub() {
  const topics = getAllConsultationTopics();
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Packaging Consultation", url: "/packaging-consultation" }]} />
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">Packaging Consultation</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl">
            Make practical packaging decisions before production
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Many brands know they need better packaging but not the right material, structure, size, finish or production method. Our consultation helps you decide first — so you avoid wasted budget and poor-fit packaging.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Where we help" title="Choose your starting point" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {topics.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="group flex flex-col rounded-2xl border bg-card p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">{t.name}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.problem}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2">
                  {t.cta.label} <ArrowRight className="h-4 w-4 transition-all" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure which consultation you need?"
        subtitle="Tell us about your product and stage — we'll point you to the right starting point and a quote."
      />
    </>
  );
}
