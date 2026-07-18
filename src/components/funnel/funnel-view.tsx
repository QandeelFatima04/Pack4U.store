"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";
import type { FunnelStage } from "@/content/types";

type Props = {
  /** Coarse page type, e.g. "blog_article" | "industry" | "product" | "consultation" | "estimator" | "quote". */
  pageType: string;
  /** Stable slug/identifier for this page (article slug, landing slug, or route key). */
  pageSlug: string;
  funnelStage: FunnelStage;
  contentCluster?: string;
  /** Blog articles only: also fire the blog-specific `funnel_content_view`. */
  alsoContentView?: boolean;
};

/**
 * Fires site-wide funnel page-view analytics for a funnel page. Renders nothing.
 *
 * Dedup: a ref holds the last-tracked slug so the event fires once per slug. The
 * ref survives React StrictMode's double-invoked effect (same mount → same ref →
 * skipped), but a genuine return visit or client navigation to a different slug
 * re-fires — no permanent module-level cache that would suppress real revisits.
 */
export function FunnelView({
  pageType,
  pageSlug,
  funnelStage,
  contentCluster,
  alsoContentView = false,
}: Props) {
  const lastSlug = useRef<string | null>(null);

  useEffect(() => {
    if (lastSlug.current === pageSlug) return;
    lastSlug.current = pageSlug;

    track("funnel_page_view", {
      page_type: pageType,
      page_slug: pageSlug,
      funnel_stage: funnelStage,
      ...(contentCluster ? { content_cluster: contentCluster } : {}),
    });

    if (alsoContentView) {
      track("funnel_content_view", {
        article_slug: pageSlug,
        funnel_stage: funnelStage,
        ...(contentCluster ? { content_cluster: contentCluster } : {}),
      });
    }
  }, [pageType, pageSlug, funnelStage, contentCluster, alsoContentView]);

  return null;
}
