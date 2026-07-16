import type { PricingTier } from "./types";

// "Ways to start" — buying frames, not fixed SKU prices (blueprint §6 offer architecture).
export const pricingTiers: PricingTier[] = [
  {
    name: "Packaging Starter Kit",
    positioning: "For startups and first-time buyers who need direction before producing.",
    bestFor: "Startups & first-time buyers",
    priceHint: "Start with a consultation",
    includes: [
      "Discovery call",
      "Structure & material recommendation",
      "2–3 packaging direction options",
      "Approximate budget direction",
      "Production quote option",
    ],
    cta: { label: "Start from scratch", href: "/packaging-for-startups" },
  },
  {
    name: "Custom Packaging Production",
    positioning: "For brands that already know the packaging they want made.",
    bestFor: "Brands ready to produce",
    priceHint: "Custom-quoted",
    includes: [
      "Packaging type & material selection",
      "Custom dimensions",
      "Printing & finishing (foil, emboss, window, die-cut)",
      "Sample approval before bulk",
      "Production & delivery",
    ],
    cta: { label: "Get a production quote", href: "/get-quote" },
    highlight: true,
  },
  {
    name: "Brand Packaging Set",
    positioning: "For brands that need multiple packaging elements that match.",
    bestFor: "Full-brand & retail rollouts",
    priceHint: "Custom-quoted",
    includes: [
      "Box or bag",
      "Tag or label",
      "Insert or thank-you card",
      "Sleeve or belly band",
      "Optional gift packaging",
    ],
    cta: { label: "Build my packaging set", href: "/get-quote" },
  },
];

// Reassurances shown across the site (no over-promises).
export const guarantees: string[] = [
  "No bulk production before you approve a sample",
  "Transparent MOQ and timeline before you confirm",
  "Material & structure recommended for your actual product",
  "A revision round included before production",
  "Single vendor for design, print and bulk delivery",
];
