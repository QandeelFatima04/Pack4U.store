import Link from "next/link";
import { ArrowRight, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SectionHeading, TransparencyBlock, CtaBand } from "@/components/sections";
import { FaqAccordion } from "@/components/faq-accordion";
import { ProductGallery } from "@/components/product-gallery";
import { PackagingTypeCard, ProjectCard } from "@/components/cards";
import { BreadcrumbJsonLd, ServiceJsonLd, FaqJsonLd } from "@/components/json-ld";
import { getPackagingTypesBySlugs, getProjectsBySlugs } from "@/lib/content";
import type { IndustryPage } from "@/content/types";

export function IndustryTemplate({ industry }: { industry: IndustryPage }) {
  const types = getPackagingTypesBySlugs(industry.productTypeSlugs);
  const projects = getProjectsBySlugs(industry.portfolioSlugs);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
          { name: industry.label, url: `/${industry.slug}` },
        ]}
      />
      <ServiceJsonLd
        name={industry.label + " Packaging"}
        description={industry.heroSub}
        url={`/${industry.slug}`}
        image={industry.heroImage}
      />
      <FaqJsonLd items={industry.faqs} />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <nav className="mb-5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-brand">Home</Link> /{" "}
              <Link href="/industries" className="hover:text-brand">Industries</Link> /{" "}
              <span className="text-foreground">{industry.shortLabel}</span>
            </nav>
            <p
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: industry.accent }}
            >
              {industry.audience}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {industry.heroHeadline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{industry.heroSub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/get-quote?industry=${industry.slug}`}>{industry.cta.label}</Link>
              </Button>
              <WhatsAppButton source={`industry-${industry.slug}`} text={industry.cta.whatsappText} />
            </div>
          </div>
          <ProductGallery
            images={
              industry.gallery && industry.gallery.length
                ? industry.gallery
                : industry.heroImage
                  ? [industry.heroImage]
                  : []
            }
            alt={`${industry.label} packaging examples by Pack4U`}
            priority
            aspect="aspect-[4/3]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Transparency strip */}
      <section className="border-b bg-background">
        <div className="container-page py-8">
          <TransparencyBlock
            startingFrom="Custom-quoted"
            moq={industry.startingMoq}
            leadTime={industry.leadTime}
          />
        </div>
      </section>

      {/* Pains + offer */}
      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">Sound familiar?</h2>
            <ul className="mt-5 space-y-3">
              {industry.pains.map((p) => (
                <li key={p} className="flex gap-2 text-sm">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand/30 bg-secondary/40 p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">How Pack4U helps</p>
            <p className="mt-3 text-lg font-medium leading-relaxed">{industry.offer}</p>
            <div className="mt-5 space-y-2">
              {industry.customization.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-brand" /> {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packaging types */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we make"
            title={industry.whatWeMakeTitle ?? `Packaging for ${industry.shortLabel.toLowerCase()} brands`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <PackagingTypeCard key={t.slug} type={t} />
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/packaging-types">See all packaging types <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {projects.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeading eyebrow="Proof" title="Recent packaging work" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sustainability note (small, per blueprint) */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <div className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-brand" />
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">Want a more sustainable option?</h3>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  We can recommend recycled or biodegradable paper options where they suit your product and budget — without losing practicality.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/sustainable-packaging-upgrade">Explore upgrade</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <div className="mt-5">
              <WhatsAppButton source={`industry-faq-${industry.slug}`} label="Ask on WhatsApp" text={industry.cta.whatsappText} />
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={industry.faqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Ready for ${industry.shortLabel.toLowerCase()} packaging that fits?`}
        primaryHref={`/get-quote?industry=${industry.slug}`}
        primaryLabel={industry.cta.label}
        whatsappText={industry.cta.whatsappText}
      />
    </>
  );
}
