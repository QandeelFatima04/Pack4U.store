import type { Metadata } from "next";
import { ConfirmationPanel } from "@/components/confirmation-panel";

export const metadata: Metadata = {
  // The root layout's template appends "· Pack4U" already.
  title: "Request Received",
  description: "Your packaging request has been received. Here's your RFQ reference and what happens next.",
  robots: { index: false, follow: false },
};

export default function QuoteConfirmationPage() {
  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <ConfirmationPanel />
      </div>
    </section>
  );
}
