"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/content/types";

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  category: BlogCategory;
  readingMinutes: number;
  cover?: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Meta({ item }: { item: BlogListItem }) {
  return (
    <span>
      {formatDate(item.date)} · {item.readingMinutes} min read
    </span>
  );
}

/**
 * Client blog listing with public category filters. Filtering is client-side over
 * the full server-rendered set (all cards ship in the initial HTML, so links stay
 * crawlable and accessible) and produces no `?category=` URLs — so there is no
 * duplicate-indexing surface and `/blog` keeps a single canonical.
 */
export function BlogList({ posts }: { posts: BlogListItem[] }) {
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const [active, setActive] = useState<BlogCategory | "all">("all");

  const featured = posts[0];
  const showFeatured = active === "all" && Boolean(featured);
  const grid = posts.filter((p) => {
    if (active !== "all" && p.category !== active) return false;
    if (showFeatured && p.slug === featured.slug) return false;
    return true;
  });

  const filters: (BlogCategory | "all")[] = ["all", ...categories];

  return (
    <section className="section">
      <div className="container-page">
        {/* Category filters (public labels only — never the internal funnel stage). */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter guides by topic"
        >
          {filters.map((f) => {
            const selected = active === f;
            const label = f === "all" ? "All Guides" : f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(f)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  selected
                    ? "border-brand bg-brand/10 text-brand"
                    : "hover:bg-muted",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {showFeatured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-8 grid overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5 md:grid-cols-2"
          >
            {featured.cover && (
              <div className="relative aspect-[16/10] md:aspect-auto">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Featured</Badge>
                <Badge variant="secondary">{featured.category}</Badge>
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight">
                {featured.title}
              </h2>
              <p className="mt-3 flex-1 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <Meta item={featured} />
                <span className="inline-flex items-center gap-1 font-semibold text-brand group-hover:gap-2">
                  Read <ArrowRight className="h-3.5 w-3.5 transition-all" />
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grid.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5"
            >
              {post.cover && (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
                <h2 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold leading-tight">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <Meta item={post} />
                  <span className="inline-flex items-center gap-1 font-semibold text-brand group-hover:gap-2">
                    Read <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
