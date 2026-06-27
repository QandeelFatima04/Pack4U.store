import type { PricingTier, EstimatorConfig } from "./types";

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

// ── Estimator pricing model ───────────────────────────────────────────────
// Placeholder multipliers — replace basePricePerUnit + factors with real costs
// before launch. MOQ floor is 300 units (lowest selectable tier is 300–500).
export const estimatorConfig: EstimatorConfig = {
  currency: "PKR",
  setupFee: 4000,
  rangeSpread: 0.15,
  quantityTiers: [
    { id: "300-500", label: "300 – 500", min: 300, factor: 1.0 },
    { id: "500-1000", label: "500 – 1,000", min: 500, factor: 0.86 },
    { id: "1000-5000", label: "1,000 – 5,000", min: 1000, factor: 0.72 },
    { id: "5000+", label: "5,000+", min: 5000, factor: 0.6 },
  ],
  sizeBands: [
    { id: "s", label: "Small", factor: 0.8 },
    { id: "m", label: "Medium", factor: 1.0 },
    { id: "l", label: "Large", factor: 1.35 },
  ],
  finishes: [
    { id: "printing", label: "Full-colour printing", factor: 1.15 },
    { id: "lamination", label: "Matte / gloss lamination", factor: 1.08 },
    { id: "foiling", label: "Foil stamping", factor: 1.22 },
    { id: "emboss", label: "Emboss / deboss", factor: 1.18 },
    { id: "window", label: "Window cut-out", factor: 1.12 },
    { id: "die-cut", label: "Custom die-cut shape", factor: 1.16 },
  ],
};
