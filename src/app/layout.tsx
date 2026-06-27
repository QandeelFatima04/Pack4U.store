import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Analytics } from "@/components/analytics";
import { UtmCapture } from "@/components/utm-capture";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationJsonLd } from "@/components/json-ld";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// --font-serif is mapped to --font-heading in globals.css; we use a strong grotesk.
const heading = Sora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "custom packaging Pakistan",
    "custom boxes Pakistan",
    "custom paper bags Pakistan",
    "product packaging Pakistan",
    "branded packaging Pakistan",
    "food packaging Pakistan",
    "cosmetic packaging Pakistan",
    "custom retail packaging Pakistan",
    "custom tags Pakistan",
    "packaging design and production Pakistan",
    "sustainable packaging Pakistan",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/images/hero/hero-1.jpg",
        width: 1200,
        height: 630,
        alt: "Pack4U custom paper packaging — boxes, bags, sleeves and inserts for product brands",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${heading.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Analytics />
        <UtmCapture />
        <OrganizationJsonLd />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppButton variant="sticky" />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
