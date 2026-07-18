"use client";

import { site } from "@/lib/site";
import { track } from "@/lib/track";

/** A mailto: link that reports the click as `email_click` (GA4 + Meta Contact-free). */
export function EmailLink({
  clickLocation,
  pageType,
  className,
  children,
}: {
  /** Where the click came from, e.g. "footer" | "contact-page". */
  clickLocation: string;
  pageType?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`mailto:${site.email}`}
      onClick={() =>
        track("email_click", {
          click_location: clickLocation,
          ...(pageType ? { page_type: pageType } : {}),
        })
      }
      className={className}
    >
      {children}
    </a>
  );
}
