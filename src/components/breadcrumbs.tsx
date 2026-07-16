import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; url: string };

// Visible breadcrumb trail. Takes the same items as BreadcrumbJsonLd so a page
// can pass one list to both. The last item is the current page: plain text, not
// a link.
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-5 text-sm text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-x-1.5">
              {isLast ? (
                <span className="text-foreground" aria-current="page">{item.name}</span>
              ) : (
                <>
                  <Link href={item.url} className="hover:text-brand">{item.name}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
