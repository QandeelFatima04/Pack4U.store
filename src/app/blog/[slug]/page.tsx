import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FunnelView } from "@/components/funnel/funnel-view";
import { FunnelCta } from "@/components/funnel/funnel-cta";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getBlogPosts, getBlogPost, getRelatedPosts, readingMinutes } from "@/lib/content";

const crumbs = (post: { title: string; slug: string }) => [
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" },
  { name: post.title, url: `/blog/${post.slug}` },
];

// Minimal inline renderer: **bold** and [text](href) links.
function renderInline(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return tokens.map((tok, i) => {
    const bold = tok.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-foreground">{bold[1]}</strong>;
    const link = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link)
      return (
        <Link key={i} href={link[2]} className="font-semibold text-brand hover:underline">
          {link[1]}
        </Link>
      );
    return <span key={i}>{tok}</span>;
  });
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const ogImage = post.cover ?? post.seo?.ogImage;
  return {
    title: post.seo?.seoTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    keywords: post.seo?.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      // Only attach an OG image when the post actually has one.
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);
  const minutes = readingMinutes(post.body);

  return (
    <>
      <BreadcrumbJsonLd items={crumbs(post)} />
      <ArticleJsonLd
        slug={post.slug}
        title={post.title}
        description={post.seo?.metaDescription ?? post.excerpt}
        datePublished={post.date}
        dateModified={post.updatedAt ?? post.date}
        image={post.cover ?? post.seo?.ogImage}
      />
      <FunnelView
        pageType="blog_article"
        pageSlug={post.slug}
        funnelStage={post.funnelStage}
        contentCluster={post.contentCluster}
        alsoContentView
      />
      <article className="container-page max-w-3xl py-16 sm:py-20">
        <Breadcrumbs items={crumbs(post)} className="mb-6" />
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {new Date(post.date).toLocaleDateString("en-PK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.author} · {minutes} min read
        </p>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
          {post.body.split("\n\n").map((block, i) => {
            const trimmed = block.trim();
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={i} className="!mt-10 font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
                  {trimmed.replace(/^##\s+/, "")}
                </h2>
              );
            }
            if (trimmed.startsWith("- ")) {
              const items = trimmed.split("\n").map((l) => l.replace(/^-\s+/, ""));
              return (
                <ul key={i} className="list-disc space-y-2 pl-5">
                  {items.map((it, j) => (
                    <li key={j}>{renderInline(it)}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{renderInline(trimmed)}</p>;
          })}
        </div>

        {related.length > 0 && (
          <section className="mt-14 border-t pt-10">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
              Related guides
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-2xl border bg-card p-5 transition hover:shadow-lg hover:shadow-black/5"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {r.category}
                  </span>
                  <span className="mt-2 font-[family-name:var(--font-heading)] text-lg font-bold leading-tight text-foreground">
                    {r.title}
                  </span>
                  <span className="mt-2 flex-1 text-sm text-muted-foreground">
                    {r.excerpt}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2">
                    Read <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Contextual next-step CTA — chosen per article, tracked as funnel_cta_click. */}
      <section className="section">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
                {post.funnelStage === "bofu"
                  ? "Ready to move forward?"
                  : "Take the next step"}
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                {post.excerpt}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <FunnelCta
                  pageType="blog_article"
                  pageSlug={post.slug}
                  funnelStage={post.funnelStage}
                  nextFunnelStage={post.primaryCta.nextFunnelStage}
                  contentCluster={post.contentCluster}
                  ctaName={post.primaryCta.ctaName}
                  label={post.primaryCta.label}
                  href={post.primaryCta.href}
                  destinationType={post.primaryCta.destinationType}
                  position="article_end"
                  variant="gold"
                  withArrow
                />
                <WhatsAppButton
                  source="blog-article-cta"
                  pageType="blog_article"
                  funnelStage={post.funnelStage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
