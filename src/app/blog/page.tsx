import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogList, type BlogListItem } from "@/components/blog/blog-list";
import { getBlogPosts, readingMinutes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Custom Packaging Guides & Ideas",
  description:
    "Practical guides on custom packaging: choosing packaging for a new product, box vs sleeve, reducing packaging cost, packaging ideas by industry and more, from Pack4U.",
  alternates: { canonical: "/blog" },
};

const crumbs = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }];

export default function BlogPage() {
  const posts: BlogListItem[] = getBlogPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    tags: p.tags,
    category: p.category,
    readingMinutes: readingMinutes(p.body),
    cover: p.cover,
  }));

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page pt-10 pb-6 sm:pt-12 sm:pb-8">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
            Custom packaging guides &amp; ideas
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Practical guides on choosing, costing and customising packaging for
            your product — built for founders and brand owners.
          </p>
        </div>
      </section>

      <BlogList posts={posts} />
    </>
  );
}
