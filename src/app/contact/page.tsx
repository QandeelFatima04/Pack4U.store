import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CallLink } from "@/components/call-link";
import { EmailLink } from "@/components/email-link";
import { site } from "@/lib/site";

const crumbs = [{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }];

export const metadata: Metadata = {
  title: "Contact Pack4U — Custom Packaging Enquiries",
  description:
    "Get in touch with Pack4U for custom packaging — boxes, bags, tags, sleeves and inserts. WhatsApp, call or email us in Pakistan.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="section">
      <BreadcrumbJsonLd items={crumbs} />
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
            Let&apos;s talk packaging
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            The fastest way to a quote is WhatsApp — send your product and
            quantity and we&apos;ll reply with options and pricing.
          </p>

          <div className="mt-7">
            <WhatsAppButton source="contact-page" />
          </div>

          <dl className="mt-10 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand" />
              <CallLink source="contact-page" pageType="contact" className="hover:text-brand">
                {site.phoneDisplay}
              </CallLink>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand" />
              <EmailLink clickLocation="contact-page" pageType="contact" className="hover:text-brand">
                {site.email}
              </EmailLink>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-brand" />
              <span>{site.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-brand" />
              <span>Mon–Sat, 10am–7pm PKT</span>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">
            Send a message
          </h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
