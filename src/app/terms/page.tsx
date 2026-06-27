import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of the Pack4U website and packaging orders.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 2026">
      <p>
        These terms govern your use of our website and any custom packaging orders
        you place with us.
      </p>
      <h2>Quotes &amp; pricing</h2>
      <ul>
        <li>
          All packaging is custom and priced per project. Quotes are valid for the
          period stated and depend on final specifications (size, material, finishes
          and quantity).
        </li>
        <li>
          The price estimator provides an indicative range only — it is not a binding
          quote. Your final price is confirmed in writing before production.
        </li>
      </ul>
      <h2>Orders &amp; approval</h2>
      <ul>
        <li>Bulk production proceeds only after you approve a physical sample.</li>
        <li>You are responsible for the accuracy of supplied artwork and specifications.</li>
        <li>Minimum order quantities apply and are confirmed in your quote.</li>
      </ul>
      <h2>Payments</h2>
      <p>
        Payment terms (advance, balance and method) are agreed and confirmed in your
        quote before production begins.
      </p>
      <h2>Liability</h2>
      <p>Our liability for any order is limited to the value of that order.</p>
    </LegalLayout>
  );
}
