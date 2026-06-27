import type { Metadata } from "next";
import { PackageCheck, Layers, PencilRuler, MapPin } from "lucide-react";
import { SectionHeading, CtaBand } from "@/components/sections";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Pack4U — Custom Packaging Partner",
  description:
    "Pack4U develops and produces custom paper packaging for product brands in Pakistan — boxes, bags, tags, sleeves and inserts. A single partner for design, print and bulk delivery.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: PencilRuler,
    title: "Packaging outcomes, not just paper",
    text: "We focus on better product presentation, retail readiness and brand consistency — packaging that's actually production-ready, not just a pretty render.",
  },
  {
    icon: Layers,
    title: "One partner, end to end",
    text: "Material selection, structure, printing, finishing and bulk delivery — a single vendor so you don't have to coordinate multiple suppliers.",
  },
  {
    icon: PackageCheck,
    title: "Low-risk by design",
    text: "We recommend the right structure and material for your product, confirm a sample before bulk, and keep MOQ and timelines transparent.",
  },
  {
    icon: MapPin,
    title: "Made in Pakistan",
    text: "We produce locally and deliver nationwide, with practical lead times and no import delays.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow">About {site.name}</p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-5xl">
            Custom paper packaging for product brands — from concept to production.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {site.name} helps product-based businesses create practical, attractive and
            production-ready paper packaging that fits their product, brand, quantity and
            budget. Boxes, bags, tags, sleeves and inserts for cosmetics, food, fashion,
            retail, gifting and e-commerce — designed, developed and produced in one place.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we stand for"
            title="A packaging partner, not just a box supplier"
            subtitle="Most packaging suppliers just take an order. We help brands decide the right structure, material and finish first — then produce it reliably at volume."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
