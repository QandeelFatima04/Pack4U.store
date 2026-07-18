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
   * PKR per unit — the lowest rate this type reaches anywhere in the pricing sheet
   * (Small size, no paid finishes), since it is shown as "From <x>/unit". Omit when
   * the sheet carries no rate: the tile and landing page then read "Custom-quoted"
   * rather than showing an invented figure.
   */
  basePricePerUnit?: number;
  /**
   * Lowest MOQ this type reaches in the pricing sheet. Varies sharply by type —
   * boxes start at 500, tags and sleeves not until 5,000 — so there is no single
   * site-wide floor to quote here.
   */
  startingMoq?: number;
  /**
   * Production time after artwork and sample approval, e.g. "7–15 working days".
   * Same shape as `IndustryPage.leadTime`. Buyers need this before they'll ask for
   * a quote, so it is shown on the tile.
   */
  leadTime?: string;
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

/**
 * Internal marketing-funnel classification. Never shown to public visitors —
 * used only for analytics dimensions and to pick the next-step CTA.
 */
export type FunnelStage = "tofu" | "mofu" | "bofu";

/** What kind of page a blog CTA sends the reader to (drives analytics + styling). */
export type CtaDestinationType =
  | "article"
  | "industry"
  | "product"
  | "consultation"
  | "estimator"
  | "quote"
  | "whatsapp";

/** Public-facing blog category shown as a listing filter (not the internal funnel stage). */
export type BlogCategory =
  | "Getting Started"
  | "Packaging Costs"
  | "Packaging Ideas"
  | "Materials & Finishes"
  | "Ordering Guides"
  | "Sustainable Packaging";

/** Contextual next-step CTA for an article. `href` must be a confirmed site route. */
export type BlogCta = {
  label: string;
  href: string;
  destinationType: CtaDestinationType;
  /** Stable machine-readable name for analytics (snake_case). */
  ctaName: string;
  nextFunnelStage: FunnelStage;
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

  // --- Marketing funnel metadata (internal) ---
  /** Internal funnel stage; not surfaced to visitors. */
  funnelStage: FunnelStage;
  /** Machine-readable content cluster, e.g. "startup-packaging". */
  contentCluster: string;
  /** Public-facing category used by the blog listing filter. */
  category: BlogCategory;
  /** Contextual primary CTA driving the reader to the next funnel step. */
  primaryCta: BlogCta;
  /** Slugs of related posts (validated at build; missing refs dropped at render). */
  relatedPosts: string[];
  /** Optional ISO date the article was last updated; falls back to `date`. */
  updatedAt?: string;
};

// The estimator's pricing model lives in content/estimator-pricing.ts, typed there
// against the pricing sheet's real per-industry MOQs and rates.
