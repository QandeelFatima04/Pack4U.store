"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { track } from "@/lib/track";
import type { CtaDestinationType, FunnelStage } from "@/content/types";

export type CtaPosition =
  | "article_inline"
  | "article_end"
  | "sticky_mobile"
  | "related_content"
  | "header"
  | "footer"
  | "estimator_result"
  | "landing_hero"
  | "landing_footer";

type Props = {
  pageType: string;
  pageSlug?: string;
  funnelStage: FunnelStage;
  nextFunnelStage: FunnelStage;
  contentCluster?: string;
  /** Stable machine name for analytics (snake_case). */
  ctaName: string;
  label: string;
  href: string;
  destinationType: CtaDestinationType;
  position: CtaPosition;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  withArrow?: boolean;
  /** WhatsApp-only: pre-filled message text. */
  whatsappText?: string;
};

/** Default button styling by funnel stage: heavier as intent increases. */
function stageVariant(stage: FunnelStage): ButtonProps["variant"] {
  if (stage === "bofu") return "brand";
  if (stage === "mofu") return "default";
  return "outline";
}

/**
 * Central, analytics-tracked funnel CTA used across blog, landing and estimator
 * pages. Fires `funnel_cta_click` (GA4) on click with PII-free params. Preserves
 * existing button styling and routes — it only wraps them with tracking.
 */
export function FunnelCta({
  pageType,
  pageSlug,
  funnelStage,
  nextFunnelStage,
  contentCluster,
  ctaName,
  label,
  href,
  destinationType,
  position,
  variant,
  size = "lg",
  className,
  withArrow = false,
  whatsappText,
}: Props) {
  function fire() {
    track("funnel_cta_click", {
      page_type: pageType,
      ...(pageSlug ? { page_slug: pageSlug } : {}),
      funnel_stage: funnelStage,
      next_funnel_stage: nextFunnelStage,
      ...(contentCluster ? { content_cluster: contentCluster } : {}),
      cta_name: ctaName,
      cta_position: position,
      destination_type: destinationType,
    });
  }

  if (destinationType === "whatsapp") {
    // WhatsAppButton already fires `whatsapp_click`; label it with the CTA name.
    return (
      <WhatsAppButton
        source={`cta:${ctaName}`}
        label={label}
        text={whatsappText}
        className={className}
      />
    );
  }

  const external = href.startsWith("http");

  return (
    <Button
      asChild
      variant={variant ?? stageVariant(funnelStage)}
      size={size}
      className={className}
    >
      <Link
        href={href}
        onClick={fire}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
        {withArrow && <ArrowRight className="h-4 w-4" />}
      </Link>
    </Button>
  );
}
