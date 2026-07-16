// Content model for Pack4U. Mirrors a future CMS schema so migration stays trivial.
// Every editable document carries SEO fields so pages can be optimized without code changes.

export type Seo = {
  /** Optional override; falls back to the document title. */
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
};

/** Simple question/answer pair used by page-level FAQ blocks. */
export type QA = { question: string; answer: string };

export type IndustrySlug =
  | "custom-cosmetic-packaging"
  | "custom-food-packaging"
  | "custom-fashion-packaging"
  | "custom-ecommerce-packaging"
  | "custom-gift-packaging"
  | "custom-rigid-boxes";

export type PackagingTypeSlug =
  | "custom-boxes"
  | "custom-paper-bags"
  | "custom-tags-labels"
  | "custom-sleeves-belly-bands"
  | "custom-inserts-thank-you-cards"
  | "custom-gift-boxes"
  | "custom-food-boxes"
  | "custom-essential-oil-boxes"
  | "custom-mist-bottle-packaging";

export type ConsultationSlug =
  | "packaging-for-startups"
  | "sustainable-packaging-upgrade"
  | "packaging-cost-optimization"
  | "packaging-redesign";

/** Industry landing page (blueprint §3 ICPs). Template A. */
export type IndustryPage = {
  slug: IndustrySlug;
  label: string; // nav label, e.g. "Cosmetics & Skincare"
  shortLabel: string; // chip/tile label, e.g. "Cosmetics"
  accent: string; // hex used for the category accent (tiles, badges)
  audience: string;
  heroHeadline: string;
  heroSub: string;
  pains: string[];
  offer: string;
  productTypeSlugs: PackagingTypeSlug[]; // related packaging types
  customization: string[];
  /**
   * Overrides the "Packaging for <shortLabel> brands" section title. Needed when
   * shortLabel names a product rather than an audience, where the default reads
   * as "Packaging for rigid box brands".
   */
  whatWeMakeTitle?: string;
  portfolioSlugs: string[];
  startingMoq: string;
  leadTime: string;
  heroImage?: string;
  gallery?: string[];
  faqs: QA[];
  cta: { label: string; whatsappText: string };
  seo?: Seo;
};

/** Packaging type page (blueprint §4). Template B — carries the estimator pricing model. */
export type PackagingType = {
  slug: PackagingTypeSlug;
  name: string; // "Custom Boxes"
  shortName: string; // "Boxes"
  tagline: string;
  heroHeadline: string;
  heroSub: string;
  useCases: string[];
  industriesServed: string[];
  customizationOptions: string[];
  materialOptions: string[];
  // Estimator inputs
  estimable: boolean;
  /**
   * PKR, Medium size, 300–500 tier, no finishes. Omit when there is no real rate yet —
   * the tile and landing page hide the price rather than show an invented one.
   */
  basePricePerUnit?: number;
  image?: string;
  gallery?: string[];
  /** Names the project pictured on the tile, so the photo is identified without renaming the category. */
  galleryCaption?: string;
  /**
   * Overrides the name shown on the tile only. The landing page, nav, estimator and
   * quote form all keep `name`, so set this only when a mismatch is intended.
   */
  tileLabel?: string;
  faqs: QA[];
  seo?: Seo;
};

/** Consultation page (blueprint §4). Template C — problem-led. */
export type ConsultationTopic = {
  slug: ConsultationSlug;
  label: string;
  name: string;
  heroHeadline: string;
  heroSub: string;
  problem: string;
  bestFor: string[];
  helpDecide: string[];
  deliverables: string[];
  process: { title: string; text: string }[];
  faqs: QA[];
  cta: { label: string; whatsappText: string };
  seo?: Seo;
};

/** Portfolio project (blueprint §12). */
export type Project = {
  slug: string;
  client: string; // can be a generic type, e.g. "Skincare Brand"
  clientType: string;
  industry: string; // filter tag, e.g. "Cosmetics"
  packagingType: string; // filter tag, e.g. "Boxes"
  filters: string[]; // all tags this project matches
  product: string;
  material: string;
  customization: string[];
  quantityRange: string;
  problemSolved: string;
  outcome: string;
  images: string[];
  featured?: boolean;
  seo?: Seo;
};

/** "Ways to start" offer frame shown on the homepage / consultation hub. */
export type PricingTier = {
  name: string;
  positioning: string;
  bestFor: string;
  priceHint: string;
  includes: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
};

export type Faq = QA & {
  category: "Products" | "Printing & Finishing" | "Pricing & MOQ" | "Ordering" | "Delivery" | "Company";
};

/** Customer testimonial / review (blueprint social proof). Rendered only when real entries exist. */
export type Testimonial = {
  /** Real person or brand name. */
  name: string;
  /** Role + company, e.g. "Founder, Aurora Skincare". */
  role?: string;
  /** The quote itself, in the customer's words. */
  quote: string;
  /** Optional 1–5 star rating. */
  rating?: number;
  /** Optional avatar image path under /public. */
  avatar?: string;
};

/** Client / brand logo for the trust strip. Rendered only when real entries exist. */
export type ClientLogo = {
  /** Brand name (used as the image alt and fallback text). */
  name: string;
  /** Logo image path under /public, e.g. "/images/clients/acme.svg". */
  logo: string;
  /** Optional link to the client's site. */
  url?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  tags: string[];
  /** Markdown-ish body (rendered as paragraphs). */
  body: string;
  cover?: string;
  seo?: Seo;
};

// ── Estimator pricing model ───────────────────────────────────────────────
export type QuantityTier = {
  id: string;
  label: string;
  min: number;
  factor: number; // per-unit multiplier (lower = cheaper at higher volume)
};

export type SizeBand = { id: string; label: string; factor: number };

export type Finish = { id: string; label: string; factor: number; note?: string };

export type EstimatorConfig = {
  quantityTiers: QuantityTier[];
  sizeBands: SizeBand[];
  finishes: Finish[];
  setupFee: number; // one-time plates/die cost, PKR
  rangeSpread: number; // ± fraction applied to the estimate
  currency: string;
};
