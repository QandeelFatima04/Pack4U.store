import Link from "next/link";
import { Check, Layers, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SectionHeading, CtaBand } from "@/components/sections";
import { FaqAccordion } from "@/components/faq-accordion";
import { Estimator } from "@/components/estimator";
import { ProductGallery } from "@/components/product-gallery";
import { BreadcrumbJsonLd, ServiceJsonLd, FaqJsonLd } from "@/components/json-ld";
import { formatPKR } from "@/lib/format";
import type { PackagingType } from "@/content/types";

export function PackagingTypeTemplate({ type }: { type: PackagingType }) {
  const gallery = type.gallery && type.gallery.length ? type.gallery : type.image ? [type.image] : [];
  // Bags are a tall/portrait product — show the whole image on its detail page
  // instead of cropping it. Other product pages keep the full-bleed crop.
  const isBags = type.slug === "custom-paper-bags";
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Packaging Types", url: "/packaging-types" },
          { name: type.name, url: `/${type.slug}` },
        ]}
      />
      <ServiceJsonLd name={type.name} description={type.heroSub} url={`/${type.slug}`} image={type.image} />
      <FaqJsonLd items={type.faqs} />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <nav className="mb-5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-brand">Home</Link> /{" "}
              <Link href="/packaging-types" className="hover:text-brand">Packaging Types</Link> /{" "}
              <span className="text-foreground">{type.shortName}</span>
            </nav>
            <p className="eyebrow">Custom {type.shortName}</p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {type.heroHeadline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{type.heroSub}</p>
            <p className="mt-4 text-sm font-semibold text-brand">
              From {formatPKR(type.basePricePerUnit)}/unit · MOQ from 300 units
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/get-quote?type=${type.slug}`}>Get a {type.shortName.toLowerCase()} quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#estimate">Estimate price</Link>
              </Button>
            </div>
          </div>
          <ProductGallery
            images={gallery}
            alt={`${type.name} by Pack4U`}
            priority
            aspect={isBags ? "aspect-[1271/1872]" : "aspect-[4/3]"}
            fit={isBags ? "contain" : "cover"}
            className={isBags ? "bg-white" : undefined}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Use cases + industries */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-brand">
              <Boxes className="h-5 w-5" />
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">Use cases</h2>
            </div>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {type.useCases.map((u) => (
                <li key={u} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {u}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-brand">
              <Layers className="h-5 w-5" />
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">Industries served</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {type.industriesServed.map((i) => (
                <Badge key={i} variant="secondary" className="text-sm">{i}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customization + material */}
      <section className="section bg-secondary/40">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">Customization options</h2>
            <ul className="mt-5 space-y-2.5">
              {type.customizationOptions.map((c) => (
                <li key={c} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-7">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">Material options</h2>
            <ul className="mt-5 space-y-2.5">
              {type.materialOptions.map((m) => (
                <li key={m} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Estimator */}
      <section id="estimate" className="section scroll-mt-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Instant estimate"
            title={`Estimate your ${type.shortName.toLowerCase()} price`}
            subtitle="Pick size, finishes and quantity for an instant price range. MOQ starts at 300 units."
          />
          <div className="mt-10">
            <Estimator defaultTypeSlug={type.slug} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-secondary/40">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <div className="mt-5">
              <WhatsAppButton source={`type-faq-${type.slug}`} label="Ask on WhatsApp" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={type.faqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Get a quote for custom ${type.shortName.toLowerCase()}`}
        primaryHref={`/get-quote?type=${type.slug}`}
        primaryLabel={`Get a ${type.shortName.toLowerCase()} quote`}
      />
    </>
  );
}
