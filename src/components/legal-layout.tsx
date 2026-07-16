import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function LegalLayout({
  title,
  updated,
  url,
  children,
}: {
  title: string;
  updated: string;
  url: string; // path, e.g. "/privacy"
  children: React.ReactNode;
}) {
  const crumbs = [{ name: "Home", url: "/" }, { name: title, url }];
  return (
    <section className="section">
      <BreadcrumbJsonLd items={crumbs} />
      <div className="container-page max-w-3xl">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="mt-8 space-y-5 text-muted-foreground [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-heading)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_a]:text-brand [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </section>
  );
}
