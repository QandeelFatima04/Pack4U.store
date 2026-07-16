import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/sections";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBlogPosts, getBlogPost } from "@/lib/content";

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

  return (
    <>
      <BreadcrumbJsonLd items={crumbs(post)} />
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
          · {post.author}
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
      </article>
      <CtaBand />
    </>
  );
}
