// Single source of truth for brand/contact/config.
// Values marked TODO are placeholders confirmed before launch (see plan "Open items").

export const site = {
  name: "Pack4U",
  legalName: "Pack4U Packaging",
  tagline: "Custom Paper Packaging for Product Brands",
  /** Logo under /public, used as the JSON-LD publisher logo (absolute URL built with site.url). */
  logo: "/images/logo.png",
  heroHeadline: "Custom Paper Packaging for Product Brands",
  heroSub:
    "We help businesses design, develop, and produce custom boxes, bags, tags, sleeves, inserts, and branded paper packaging for retail, gifting, food, fashion, cosmetics, and e-commerce.",
  description:
    "Pack4U designs and produces custom paper packaging for product brands — boxes, paper bags, tags, labels, sleeves and inserts for cosmetics, food, fashion, retail and e-commerce. Get a packaging quote in Pakistan.",
  url: "https://pack4u.store",
  // Contact
  phoneDisplay: "+92 304 5300300",
  phoneE164: "+923045300300",
  whatsappNumber: "923045300300", // wa.me format, no +
  email: "info@pack4u.store",
  city: "Pakistan",
  country: "Pakistan",
  address: "Pakistan", // TODO confirm full address
  // Lowest MOQ in the pricing sheet (inserts, cards, boxes). Most products sit higher —
  // tags and sleeves start at 5,000 — so quote a product's own MOQ where one is known.
  minMoq: 500,
  social: {
    instagram: "https://www.instagram.com/pack4u.store/",
    facebook: "https://www.facebook.com/pack4u.store",
    linkedin: "https://www.linkedin.com/company/pack4u",
  },
  // Analytics — fill from env at runtime (see analytics.tsx)
} as const;

// Default pre-filled WhatsApp message; pages can override the `text`.
export function whatsappLink(text?: string): string {
  const msg =
    text ??
    "Hi Pack4U, I'd like a quote for custom packaging. Product: ___. Quantity: ___. Please share options and pricing.";
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export function telLink(): string {
  return `tel:${site.phoneE164}`;
}
