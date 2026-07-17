import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/product-gallery";
import { formatPKR } from "@/lib/format";
import type { PackagingType, Project } from "@/content/types";

export function PackagingTypeCard({ type }: { type: PackagingType }) {
  const gallery =
    type.gallery && type.gallery.length
      ? type.gallery
      : type.image
        ? [type.image]
        : [];
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5">
      <ProductGallery
        images={gallery}
        alt={type.galleryCaption ?? type.name}
        fit="cover"
        aspect="aspect-[4/3]"
        className="rounded-none border-0 bg-white"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="flex flex-1 flex-col p-5">
        {type.galleryCaption && (
          <p className="text-xs font-medium text-muted-foreground">{type.galleryCaption}</p>
        )}
        <h3 className="mt-1 font-[family-name:var(--font-heading)] text-lg font-semibold leading-tight">
          <Link href={`/${type.slug}`} className="hover:text-brand">
            {type.tileLabel ?? type.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{type.tagline}</p>

        {/* Buyers need MOQ, materials, industries and lead time before they'll ask
            for a quote. Each row is omitted when the record has no figure, rather
            than showing an invented one. */}
        <dl className="mt-4 space-y-1.5 border-t pt-3 text-xs">
          {type.startingMoq && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">MOQ</dt>
              <dd className="text-right font-semibold">
                From {type.startingMoq.toLocaleString()} units
              </dd>
            </div>
          )}
          {type.leadTime && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Lead time</dt>
              <dd className="text-right font-semibold">{type.leadTime}</dd>
            </div>
          )}
          {type.materialOptions?.length > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">Materials</dt>
              <dd className="text-right font-semibold">
                {type.materialOptions.slice(0, 2).join(", ")}
                {type.materialOptions.length > 2 && ` +${type.materialOptions.length - 2}`}
              </dd>
            </div>
          )}
          {type.industriesServed?.length > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">Industries</dt>
              <dd className="text-right font-semibold">
                {type.industriesServed.slice(0, 2).join(", ")}
                {type.industriesServed.length > 2 && ` +${type.industriesServed.length - 2}`}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-brand">
              {type.basePricePerUnit
                ? `From ${formatPKR(type.basePricePerUnit)}/unit`
                : "Custom-quoted"}
            </span>
            <Link
              href={`/${type.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2"
            >
              View <ArrowRight className="h-4 w-4 transition-all" />
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* ?type= preselects this product in the estimator. */}
            <Button asChild size="sm" variant="outline">
              <Link href={type.estimable ? `/estimate?type=${type.slug}` : `/${type.slug}`}>
                {type.estimable ? "Estimate price" : "See options"}
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/get-quote?type=${type.slug}`}>Request quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// IndustryTile now lives in its own client component (animated circular design).
export { IndustryTile } from "@/components/industry-tile";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5">
      <div className="relative">
        <ProductGallery
          images={project.images.length ? project.images : [""]}
          alt={`${project.product} — ${project.client}`}
          className="rounded-none border-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {project.featured && (
          <Badge className="absolute left-3 top-3 z-10 bg-gold text-gold-foreground">Featured</Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{project.industry}</Badge>
          <Badge variant="secondary">{project.packagingType}</Badge>
        </div>
        <h3 className="mt-3 font-[family-name:var(--font-heading)] text-base font-bold">
          {project.product}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
        <p className="mt-3 flex-1 text-sm text-muted-foreground">{project.outcome}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-xs text-muted-foreground">
          <div>
            <dt className="font-semibold text-foreground">Material</dt>
            <dd>{project.material}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Quantity</dt>
            <dd>{project.quantityRange}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
