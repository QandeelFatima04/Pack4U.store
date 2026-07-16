import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq-accordion";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/sections";
import { getFaqs, faqCategories } from "@/lib/content";

const crumbs = [{ name: "Home", url: "/" }, { name: "FAQ", url: "/faq" }];

export const metadata: Metadata = {
  title: "FAQ — Custom Packaging Questions",
  description:
    "Answers to common questions about custom packaging from Pack4U: packaging types, customization, printing, MOQ and pricing, ordering, lead times and delivery.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqs = getFaqs();

  return (
    <>
      <FaqJsonLd items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <BreadcrumbJsonLd items={crumbs} />

      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-20">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">FAQ</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
            Custom packaging questions, answered
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Straight answers on packaging types, customization, pricing, MOQ and
            timelines — and if yours isn&apos;t here, message us on WhatsApp.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page space-y-12">
          {faqCategories.map((cat) => {
            const items = faqs.filter((f) => f.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                    {cat}
                  </h2>
                </div>
                <div className="lg:col-span-9">
                  <FaqAccordion items={items} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Still have a question?"
        subtitle="Message us with your product and quantity — we'll answer and share practical options."
      />
    </>
  );
}
