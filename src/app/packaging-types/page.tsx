import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections";
import { PackagingTypeCard } from "@/components/cards";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllPackagingTypes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Packaging Types — Boxes, Bags, Tags, Sleeves & Inserts",
  description:
    "Browse custom packaging types: boxes, paper bags, tags & labels, sleeves & belly bands, inserts & thank-you cards, gift boxes and food boxes. Get an instant estimate or a quote.",
  alternates: { canonical: "/packaging-types" },
};

const crumbs = [{ name: "Home", url: "/" }, { name: "Packaging Types", url: "/packaging-types" }];

export default function PackagingTypesHub() {
  const types = getAllPackagingTypes();
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Packaging Types</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl">
            Custom packaging products we develop
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every type is made to your size, material, printing and finish. Open any one for use cases, options and an instant price estimate.
          </p>
          <div className="mt-7">
            <Button asChild size="lg">
              <Link href="/estimate">Estimate a price <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <PackagingTypeCard key={t.slug} type={t} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
