import type { Metadata } from "next";
import { CtaBand } from "@/components/sections";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio — Custom Packaging Projects",
  description:
    "Custom packaging work across cosmetics, food, fashion, e-commerce, retail and gift — boxes, bags, tags, sleeves and gift boxes. Filter packaging projects by category.",
  alternates: { canonical: "/portfolio" },
};

const crumbs = [{ name: "Home", url: "/" }, { name: "Portfolio", url: "/portfolio" }];

export default function PortfolioPage() {
  const projects = getAllProjects();
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Portfolio</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl">
            Packaging work across product categories
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            A selection of custom packaging projects — grouped by industry and packaging type. Filter to see work that matches your product.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <PortfolioGrid projects={projects} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
