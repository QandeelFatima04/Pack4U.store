import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
          <PackageX className="h-7 w-7 text-brand" />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-heading)] text-4xl font-bold">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          This page may have been moved or no longer exists.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/packaging-types">Browse packaging types</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
