import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        alt={type.name}
        fit="cover"
        aspect="aspect-[4/3]"
        className="rounded-none border-0 bg-white"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold leading-tight">
          <Link href={`/${type.slug}`} className="hover:text-brand">
            {type.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{type.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="text-sm font-semibold text-brand">
            From {formatPKR(type.basePricePerUnit)}/unit
          </span>
          <Link href={`/${type.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2">
            View <ArrowRight className="h-4 w-4 transition-all" />
          </Link>
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
