import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: "How Pack4U produces and delivers custom packaging across Pakistan.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <LegalLayout title="Shipping & Delivery" updated="June 2026" url="/shipping">
      <p>
        We produce custom packaging to order and deliver across Pakistan. The
        details below are general guidance — exact timelines and delivery costs
        are confirmed in your quote.
      </p>
      <h2>Production &amp; dispatch</h2>
      <ul>
        <li>
          Custom orders are produced after artwork and sample approval — typically
          7–15 working days.
        </li>
        <li>Rigid / premium and large orders may take a little longer.</li>
        <li>Urgent timelines may be accommodated depending on quantity and finish.</li>
      </ul>
      <h2>Delivery</h2>
      <ul>
        <li>We deliver nationwide across Pakistan.</li>
        <li>Delivery cost depends on order size and destination, and is quoted per project.</li>
        <li>We confirm dispatch and expected delivery dates before production.</li>
      </ul>
      <h2>Questions?</h2>
      <p>
        Message us on WhatsApp or email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalLayout>
  );
}
