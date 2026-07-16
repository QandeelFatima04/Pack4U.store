// Content access layer. Reads typed local content; swapping to a CMS later means
// changing only this file (page components stay the same).

import { industries } from "@/content/industries";
import { packagingTypes } from "@/content/packaging-types";
import { consultationTopics } from "@/content/consultation";
import { projects } from "@/content/portfolio";
import { faqs, faqCategories } from "@/content/faqs";
import { pricingTiers, guarantees } from "@/content/pricing";
import { blogPosts } from "@/content/blog";
import type {
  IndustrySlug,
  PackagingTypeSlug,
  ConsultationSlug,
} from "@/content/types";

// Industries
export const getAllIndustries = () => industries;
export const getIndustry = (slug: string) =>
  industries.find((i) => i.slug === (slug as IndustrySlug));

// Packaging types
export const getAllPackagingTypes = () => packagingTypes;
export const getPackagingType = (slug: string) =>
  packagingTypes.find((p) => p.slug === (slug as PackagingTypeSlug));
export const getPackagingTypesBySlugs = (slugs: PackagingTypeSlug[]) =>
  slugs
    .map((s) => packagingTypes.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

// Consultation
export const getAllConsultationTopics = () => consultationTopics;
export const getConsultationTopic = (slug: string) =>
  consultationTopics.find((c) => c.slug === (slug as ConsultationSlug));

// Portfolio
export const getAllProjects = () => projects;
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const getProjectsBySlugs = (slugs: string[]) =>
  slugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
export const getFeaturedProjects = () => projects.filter((p) => p.featured);

// FAQ
export const getFaqs = () => faqs;
export { faqCategories };

// Offers
export const getPricingTiers = () => pricingTiers;
export { guarantees };

// Blog
export const getBlogPosts = () =>
  [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
export const getBlogPost = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);

// All dynamic landing-page slugs (for the single root [slug] route)
export type LandingKind = "industry" | "type" | "consultation";
export function getAllLandingSlugs(): { slug: string; kind: LandingKind }[] {
  return [
    ...industries.map((i) => ({ slug: i.slug, kind: "industry" as const })),
    ...packagingTypes.map((p) => ({ slug: p.slug, kind: "type" as const })),
    ...consultationTopics.map((c) => ({ slug: c.slug, kind: "consultation" as const })),
  ];
}
