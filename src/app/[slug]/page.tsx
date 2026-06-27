import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllLandingSlugs,
  getIndustry,
  getPackagingType,
  getConsultationTopic,
} from "@/lib/content";
import { IndustryTemplate } from "@/components/landing/industry-template";
import { PackagingTypeTemplate } from "@/components/landing/packaging-type-template";
import { ConsultationTemplate } from "@/components/landing/consultation-template";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLandingSlugs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  const type = getPackagingType(slug);
  const topic = getConsultationTopic(slug);
  const doc = industry ?? type ?? topic;
  if (!doc) return {};

  const title =
    doc.seo?.seoTitle ??
    ("heroHeadline" in doc ? doc.heroHeadline : (doc as { name: string }).name);
  const description = doc.seo?.metaDescription ?? ("heroSub" in doc ? doc.heroSub : "");

  return {
    title,
    description,
    keywords: doc.seo?.keywords,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      url: `/${slug}`,
      images: doc.seo?.ogImage
        ? [doc.seo.ogImage]
        : "heroImage" in doc && doc.heroImage
          ? [doc.heroImage]
          : undefined,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const industry = getIndustry(slug);
  if (industry) return <IndustryTemplate industry={industry} />;

  const type = getPackagingType(slug);
  if (type) return <PackagingTypeTemplate type={type} />;

  const topic = getConsultationTopic(slug);
  if (topic) return <ConsultationTemplate topic={topic} />;

  notFound();
}
