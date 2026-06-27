import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import {
  getAllIndustries,
  getAllPackagingTypes,
  getAllConsultationTopics,
  getBlogPosts,
} from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = [
    "",
    "/custom-packaging",
    "/industries",
    "/packaging-types",
    "/packaging-consultation",
    "/portfolio",
    "/estimate",
    "/get-quote",
    "/about",
    "/faq",
    "/blog",
    "/contact",
    "/shipping",
    "/privacy",
    "/terms",
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r}`,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));

  for (const i of getAllIndustries())
    routes.push({ url: `${base}/${i.slug}`, priority: 0.9, changeFrequency: "weekly" });
  for (const p of getAllPackagingTypes())
    routes.push({ url: `${base}/${p.slug}`, priority: 0.9, changeFrequency: "weekly" });
  for (const c of getAllConsultationTopics())
    routes.push({ url: `${base}/${c.slug}`, priority: 0.8, changeFrequency: "monthly" });
  for (const b of getBlogPosts())
    routes.push({ url: `${base}/blog/${b.slug}`, priority: 0.5, changeFrequency: "monthly" });

  return routes;
}
