import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Custom Packaging Guides & Ideas",
  description:
    "Practical guides on custom packaging: choosing packaging for a new product, box vs sleeve, reducing packaging cost, packaging ideas by industry and more, from Pack4U.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const crumbs = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }];

export default function BlogPage() {
  const posts = getBlogPosts();
  return (
    <>
      <BreadcrumbJsonLd items={crumbs} />
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-20">
          <Breadcrumbs items={crumbs} />
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

      <section className="section">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border bg-card p-6 transition hover:shadow-lg hover:shadow-black/5"
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold leading-tight">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(post.date)}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand group-hover:gap-2">
                  Read <ArrowRight className="h-3.5 w-3.5 transition-all" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
