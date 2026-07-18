import { Check, Target, ClipboardList } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { FunnelView } from "@/components/funnel/funnel-view";
import { FunnelCta } from "@/components/funnel/funnel-cta";
import { SectionHeading, CtaBand } from "@/components/sections";
import { FaqAccordion } from "@/components/faq-accordion";
import { BreadcrumbJsonLd, ServiceJsonLd, FaqJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { ConsultationTopic } from "@/content/types";

export function ConsultationTemplate({ topic }: { topic: ConsultationTopic }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Packaging Consultation", url: "/packaging-consultation" },
          { name: topic.label, url: `/${topic.slug}` },
        ]}
      />
      <ServiceJsonLd name={topic.name} description={topic.heroSub} url={`/${topic.slug}`} />
      <FaqJsonLd items={topic.faqs} />
      <FunnelView pageType="consultation" pageSlug={topic.slug} funnelStage="mofu" />

      {/* Problem-led hero */}
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Consultation", url: "/packaging-consultation" },
              { name: topic.label, url: `/${topic.slug}` },
            ]}
          />
          <p className="eyebrow">Packaging consultation</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {topic.heroHeadline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{topic.heroSub}</p>
          <div className="mt-6 max-w-2xl rounded-2xl border border-brand/30 bg-secondary/40 p-5 text-base font-medium">
            {topic.problem}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <FunnelCta
              pageType="consultation"
              pageSlug={topic.slug}
              funnelStage="mofu"
              nextFunnelStage="bofu"
              ctaName="consultation_hero_quote"
              label={topic.cta.label}
              href={`/get-quote?topic=${topic.slug}`}
              destinationType="quote"
              position="landing_hero"
              variant="default"
            />
            <WhatsAppButton
              source={`consultation-${topic.slug}`}
              pageType="consultation"
              funnelStage="mofu"
              text={topic.cta.whatsappText}
            />
          </div>
        </div>
      </section>

      {/* Who it's for + what we help decide */}
      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-center gap-2 text-brand">
              <Target className="h-5 w-5" />
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">Best for</h2>
            </div>
            <ul className="mt-5 space-y-2.5">
              {topic.bestFor.map((b) => (
                <li key={b} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-center gap-2 text-brand">
              <ClipboardList className="h-5 w-5" />
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">What we help you decide</h2>
            </div>
            <ul className="mt-5 space-y-2.5">
              {topic.helpDecide.map((h) => (
                <li key={h} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <SectionHeading eyebrow="Deliverables" title="What you get" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topic.deliverables.map((d) => (
              <div key={d} className="flex items-start gap-2 rounded-xl border bg-card p-5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {d}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="A simple, low-risk process" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topic.process.map((step, i) => (
              <div key={step.title} className="rounded-2xl border bg-card p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-secondary/40">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <div className="mt-5">
              <WhatsAppButton source={`consultation-faq-${topic.slug}`} label="Ask on WhatsApp" text={topic.cta.whatsappText} />
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={topic.faqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title={topic.cta.label}
        primaryHref={`/get-quote?topic=${topic.slug}`}
        primaryLabel={topic.cta.label}
        whatsappText={topic.cta.whatsappText}
      />
    </>
  );
}
