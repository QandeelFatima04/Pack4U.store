"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, FileText } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { cn } from "@/lib/utils";

// Owns everything pinned to the bottom of the viewport, so the mobile CTA bar and
// the WhatsApp FAB can't overlap each other.
//
// The bar is hidden where it would only duplicate the page's own primary CTA.
const HIDE_BAR_ON = ["/estimate", "/get-quote"];

export function StickyActions() {
  const pathname = usePathname();
  const showBar = !HIDE_BAR_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <>
      {/* When the bar is up, lift the FAB above it on mobile. */}
      <WhatsAppButton
        variant="sticky"
        className={cn(showBar && "bottom-20 sm:bottom-5")}
      />

      {showBar && (
        <>
          {/* Spacer so the bar never covers the end of the page. */}
          <div aria-hidden className="h-16 sm:hidden" />
          <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
            <div className="flex gap-2">
              <Link
                href="/estimate"
                className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-input text-sm font-semibold transition hover:bg-muted"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                Estimate price
              </Link>
              <Link
                href="/get-quote"
                className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand text-sm font-semibold text-brand-foreground transition hover:opacity-90"
              >
                <FileText className="h-4 w-4" aria-hidden />
                Request quote
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
