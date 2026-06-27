"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPKR } from "@/lib/format";
import { site } from "@/lib/site";
import { packagingTypes } from "@/content/packaging-types";
import { estimatorConfig } from "@/content/pricing";
import { cn } from "@/lib/utils";

const { quantityTiers, sizeBands, finishes, setupFee, rangeSpread } = estimatorConfig;

function tierForQty(qty: number) {
  // Highest tier whose minimum is <= qty (tiers are ascending).
  let chosen = quantityTiers[0];
  for (const t of quantityTiers) if (qty >= t.min) chosen = t;
  return chosen;
}

export function Estimator({
  defaultTypeSlug,
  compact = false,
}: {
  defaultTypeSlug?: string;
  compact?: boolean;
}) {
  const [typeSlug, setTypeSlug] = useState(
    defaultTypeSlug ?? packagingTypes[0].slug,
  );
  const [sizeId, setSizeId] = useState("m");
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(["printing"]);
  const [qty, setQty] = useState(500);

  const type = packagingTypes.find((p) => p.slug === typeSlug) ?? packagingTypes[0];

  const result = useMemo(() => {
    const safeQty = Math.max(site.minMoq, Math.round(qty || 0));
    const size = sizeBands.find((s) => s.id === sizeId) ?? sizeBands[1];
    const tier = tierForQty(safeQty);
    const finishFactor = selectedFinishes.reduce((acc, id) => {
      const f = finishes.find((x) => x.id === id);
      return acc * (f ? f.factor : 1);
    }, 1);
    const perUnit = type.basePricePerUnit * size.factor * finishFactor * tier.factor;
    const subtotal = perUnit * safeQty;
    const total = subtotal + setupFee;
    return {
      safeQty,
      tier,
      perUnitLow: perUnit * (1 - rangeSpread),
      perUnitHigh: perUnit * (1 + rangeSpread),
      totalLow: total * (1 - rangeSpread),
      totalHigh: total * (1 + rangeSpread),
    };
  }, [type, sizeId, selectedFinishes, qty]);

  function toggleFinish(id: string) {
    setSelectedFinishes((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }

  const quoteHref =
    `/get-quote?type=${type.slug}` +
    `&qty=${result.safeQty}` +
    `&finishes=${selectedFinishes.join(",")}` +
    `&est=${Math.round(result.totalLow)}-${Math.round(result.totalHigh)}`;

  const whatsappText = `Hi Pack4U, I used the estimator. ${type.name}, size ${sizeId.toUpperCase()}, qty ${result.safeQty}, finishes: ${selectedFinishes.join(", ") || "none"}. Estimated ${formatPKR(result.totalLow)}–${formatPKR(result.totalHigh)}. Please confirm an exact quote.`;

  return (
    <div className={cn("grid gap-6", compact ? "" : "lg:grid-cols-5 lg:gap-10")}>
      {/* Inputs */}
      <div className={cn("space-y-6", compact ? "" : "lg:col-span-3")}>
        {/* Packaging type */}
        <div className="space-y-2">
          <Label htmlFor="est-type">Packaging type</Label>
          <select
            id="est-type"
            value={typeSlug}
            onChange={(e) => setTypeSlug(e.target.value)}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {packagingTypes.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-3 gap-2">
            {sizeBands.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSizeId(s.id)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                  sizeId === s.id
                    ? "border-brand bg-brand/10 text-brand"
                    : "hover:bg-muted",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Finishes */}
        <div className="space-y-2">
          <Label>Finishes &amp; customization</Label>
          <div className="grid grid-cols-2 gap-2">
            {finishes.map((f) => {
              const on = selectedFinishes.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFinish(f.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition",
                    on ? "border-brand bg-brand/10 text-brand" : "hover:bg-muted",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="est-qty">
            Quantity{" "}
            <span className="font-normal text-muted-foreground">
              (minimum {site.minMoq})
            </span>
          </Label>
          <input
            id="est-qty"
            type="number"
            min={site.minMoq}
            step={50}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            onBlur={() => setQty((q) => Math.max(site.minMoq, Math.round(q || site.minMoq)))}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex flex-wrap gap-2">
            {quantityTiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setQty(t.min)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  result.tier.id === t.id
                    ? "border-brand bg-brand/10 text-brand"
                    : "hover:bg-muted",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className={cn(compact ? "" : "lg:col-span-2")}>
        <div className="sticky top-24 rounded-2xl border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Estimated price
          </p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight">
            {formatPKR(result.totalLow)}
            <span className="text-muted-foreground"> – </span>
            {formatPKR(result.totalHigh)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            for {result.safeQty.toLocaleString()} units
          </p>
          <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Per unit</span>
              <span className="font-semibold">
                {formatPKR(result.perUnitLow)} – {formatPKR(result.perUnitHigh)}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">MOQ</span>
              <span className="font-semibold">From {site.minMoq} units</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Includes one-time setup</span>
              <span className="font-semibold">{formatPKR(setupFee)}</span>
            </div>
          </div>
          <Button asChild size="lg" className="mt-5 w-full">
            <Link href={quoteHref}>
              Get exact quote <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="mt-3 flex justify-center">
            <WhatsAppButton source="estimator" label="Confirm on WhatsApp" text={whatsappText} />
          </div>
          <p className="mt-4 flex gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            This is an indicative estimate. Your final quote depends on exact size,
            material, artwork and finishing — we confirm it before any production.
          </p>
        </div>
      </div>
    </div>
  );
}
