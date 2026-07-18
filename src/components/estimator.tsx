"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPKR } from "@/lib/format";
import {
  estimatorIndustries,
  pickProduct,
  productNameToTypeValue,
  FINISH_LABELS,
  FINISH_ORDER,
  type EstFinishKey,
} from "@/content/estimator-pricing";
import {
  ESTIMATE_CALC_VERSION,
  finishKeysToCustomizationIds,
  makeReference,
  writeEstimate,
  clearEstimate,
} from "@/lib/estimate";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

/** Coarse quantity band for analytics — never sends the exact figure. */
function qtyBand(n: number): string {
  if (n < 250) return "100_249";
  if (n < 500) return "250_499";
  if (n < 1000) return "500_999";
  if (n < 2500) return "1000_2499";
  if (n < 5000) return "2500_4999";
  return "5000_plus";
}

export function Estimator({
  defaultTypeSlug,
  compact = false,
}: {
  defaultTypeSlug?: string;
  compact?: boolean;
}) {
  const initialIndustry = estimatorIndustries[0];
  const initialProduct = pickProduct(initialIndustry, defaultTypeSlug);

  const [industrySlug, setIndustrySlug] = useState(initialIndustry.slug);
  const [productName, setProductName] = useState(initialProduct.name);
  const [sizeId, setSizeId] = useState(initialProduct.sizes[0]?.id ?? "medium");
  const [selectedFinishes, setSelectedFinishes] = useState<EstFinishKey[]>([]);
  const [qty, setQty] = useState(initialProduct.sizes[0]?.moq ?? 500);

  const industry =
    estimatorIndustries.find((i) => i.slug === industrySlug) ?? estimatorIndustries[0];
  const product =
    industry.products.find((p) => p.name === productName) ?? industry.products[0];
  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0];

  // Finishes that are actually offered for this product (null ⇒ not available).
  // The React Compiler auto-memoizes these derived values, so no manual useMemo.
  const availableFinishes = FINISH_ORDER.filter(
    (key) => product.finishes[key] !== null,
  ).map((key) => {
    const value = product.finishes[key];
    return {
      key,
      label: FINISH_LABELS[key],
      included: value === "included",
      add: typeof value === "number" ? value : 0,
    };
  });

  const result = ((): {
    safeQty: number;
    moq: number;
    perUnit: number;
    total: number;
  } | null => {
    if (!product.estimable || !size) return null;
    const moq = size.moq;
    const safeQty = Math.max(moq, Math.round(qty || moq));
    const addOn = availableFinishes.reduce(
      (sum, f) => (!f.included && selectedFinishes.includes(f.key) ? sum + f.add : sum),
      0,
    );
    const perUnit = size.price + addOn;
    return { safeQty, moq, perUnit, total: perUnit * safeQty };
  })();

  // --- Funnel analytics: fire on real interactions only, never on page load.
  // The estimator is a single live screen, so its four visible input groups map
  // to funnel "steps": packaging (1), size (2), finishes (3), quantity (4).
  const [engaged, setEngaged] = useState(false);
  const startedRef = useRef(false);
  const stepDoneRef = useRef({
    packaging: false,
    size: false,
    finishes: false,
    quantity: false,
  });
  const completeRef = useRef(false);

  const eventBase = () => ({
    industry: industry.slug,
    packaging_type: productNameToTypeValue(product.name),
  });

  function fireStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    setEngaged(true);
    track("estimator_start", eventBase());
  }

  function fireStep(
    step: keyof typeof stepDoneRef.current,
    stepNumber: number,
    extra: Record<string, string> = {},
  ) {
    fireStart();
    if (stepDoneRef.current[step]) return;
    stepDoneRef.current[step] = true;
    track("estimator_step_complete", {
      estimator_step: step,
      estimator_step_number: stepNumber,
      ...eventBase(),
      ...extra,
    });
  }

  // Quantity step: fire once a valid (>= MOQ) quantity has been entered.
  function noteQuantity(n: number) {
    if (!size || Number.isNaN(n) || n < size.moq) return;
    fireStep("quantity", 4, { quantity_band: qtyBand(n) });
  }

  // estimator_complete: once, after the user has engaged and a valid priced
  // estimate is on screen. Non-estimable/custom-quote products yield no result,
  // so they correctly never "complete".
  useEffect(() => {
    if (!engaged || completeRef.current || !result) return;
    completeRef.current = true;
    track("estimator_complete", {
      industry: industry.slug,
      packaging_type: productNameToTypeValue(product.name),
      quantity_band: qtyBand(result.safeQty),
    });
  }, [engaged, result, industry, product]);

  function selectIndustry(slug: string) {
    fireStep("packaging", 1);
    const next = estimatorIndustries.find((i) => i.slug === slug) ?? estimatorIndustries[0];
    const nextProduct = pickProduct(next);
    setIndustrySlug(slug);
    setProductName(nextProduct.name);
    setSizeId(nextProduct.sizes[0]?.id ?? "medium");
    setSelectedFinishes([]);
    setQty(nextProduct.sizes[0]?.moq ?? 500);
  }

  function selectProduct(name: string) {
    fireStep("packaging", 1);
    const next = industry.products.find((p) => p.name === name) ?? industry.products[0];
    setProductName(name);
    setSizeId(next.sizes[0]?.id ?? "medium");
    setSelectedFinishes([]);
    setQty(next.sizes[0]?.moq ?? 500);
  }

  function selectSize(id: "small" | "medium" | "large") {
    fireStep("size", 2);
    const next = product.sizes.find((s) => s.id === id);
    setSizeId(id);
    if (next) setQty((q) => Math.max(next.moq, Math.round(q || next.moq)));
  }

  function toggleFinish(key: EstFinishKey) {
    fireStep("finishes", 3);
    setSelectedFinishes((cur) =>
      cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key],
    );
  }

  const activeFinishes = availableFinishes.filter(
    (f) => f.included || selectedFinishes.includes(f.key),
  );
  const activeFinishLabels = activeFinishes.map((f) => f.label);

  const quoteHref =
    `/get-quote?industry=${industry.slug}` +
    `&type=${productNameToTypeValue(product.name)}` +
    `&product=${encodeURIComponent(product.name)}` +
    (activeFinishes.length
      ? `&finishes=${finishKeysToCustomizationIds(activeFinishes.map((f) => f.key)).join(",")}`
      : "") +
    (result ? `&qty=${result.safeQty}&est=${Math.round(result.total)}` : "");

  // Hand the full spec to /get-quote. The URL params above stay as the fallback
  // for links opened in a new tab or on another device.
  function handoffToQuote() {
    if (!result || !size) {
      clearEstimate();
      return;
    }
    const spec = {
      calcVersion: ESTIMATE_CALC_VERSION,
      reference: makeReference("EST"),
      calculatedAt: new Date().toISOString(),
      industrySlug: industry.slug,
      industryName: industry.name,
      productName: product.name,
      typeValue: productNameToTypeValue(product.name),
      sizeId: size.id,
      sizeLabel: size.label,
      finishKeys: activeFinishes.map((f) => f.key),
      finishLabels: activeFinishLabels,
      quantity: result.safeQty,
      moq: result.moq,
      perUnit: result.perUnit,
      total: result.total,
    };
    writeEstimate(spec);
    track("estimate_generated", {
      product: product.name,
      industry: industry.name,
      quantity: result.safeQty,
      value: Math.round(result.total),
    });
  }

  // Estimator → quote hand-off, tracked as a funnel CTA (mofu → bofu).
  function continueToQuote() {
    handoffToQuote();
    track("funnel_cta_click", {
      page_type: "estimator",
      funnel_stage: "mofu",
      next_funnel_stage: "bofu",
      cta_name: "estimator_continue_to_quote",
      cta_position: "estimator_result",
      destination_type: "quote",
      ...eventBase(),
    });
  }

  const whatsappText = result
    ? `Hi Pack4U, I used the estimator. Industry: ${industry.name}. ${product.name}, ${size?.label} size, qty ${result.safeQty}, finishes: ${activeFinishLabels.join(", ") || "none"}. Estimated ${formatPKR(result.total)} (${formatPKR(result.perUnit)}/unit). Please confirm an exact quote.`
    : `Hi Pack4U, I'd like a quote for ${product.name} (${industry.name}). Please share options and pricing.`;

  return (
    <div className={cn("grid gap-6", compact ? "" : "lg:grid-cols-5 lg:gap-10")}>
      {/* Inputs */}
      <div className={cn("space-y-6", compact ? "" : "lg:col-span-3")}>
        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="est-industry">What type of business is this for?</Label>
          <select
            id="est-industry"
            value={industrySlug}
            onChange={(e) => selectIndustry(e.target.value)}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {estimatorIndustries.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        {/* Packaging type */}
        <div className="space-y-2">
          <Label htmlFor="est-type">What type of packaging do you need?</Label>
          <select
            id="est-type"
            value={productName}
            onChange={(e) => selectProduct(e.target.value)}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {industry.products.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {product.estimable && size ? (
          <>
            {/* Size */}
            <div className="space-y-2">
              <Label>Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSize(s.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition",
                      sizeId === s.id
                        ? "border-brand bg-brand/10 text-brand"
                        : "hover:bg-muted",
                    )}
                  >
                    <span className="block">{s.label}</span>
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      from {formatPKR(s.price)}/unit
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Finishes */}
            <div className="space-y-2">
              <Label>Finishes &amp; customization</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableFinishes.map((f) => {
                  if (f.included) {
                    return (
                      <div
                        key={f.key}
                        className="flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand/5 px-3 py-2.5 text-left text-sm font-medium text-brand"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {f.label}
                          <span className="font-normal text-brand/70"> · included</span>
                        </span>
                      </div>
                    );
                  }
                  const on = selectedFinishes.includes(f.key);
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => toggleFinish(f.key)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition",
                        on ? "border-brand bg-brand/10 text-brand" : "hover:bg-muted",
                      )}
                    >
                      {f.label}
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        +{formatPKR(f.add)}/unit
                      </span>
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
                  (minimum {result?.moq.toLocaleString()} for {size.label} size)
                </span>
              </Label>
              <input
                id="est-qty"
                type="number"
                min={size.moq}
                step={100}
                value={qty}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setQty(n);
                  noteQuantity(n);
                }}
                onBlur={() => setQty((q) => Math.max(size.moq, Math.round(q || size.moq)))}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {qty < size.moq && (
                <p className="text-xs font-medium text-brand">
                  Minimum order for the {size.label} size is {size.moq.toLocaleString()} units.
                  You can increase the quantity, but not go below this.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {[size.moq, size.moq * 2, size.moq * 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setQty(n);
                      noteQuantity(n);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition",
                      result?.safeQty === n
                        ? "border-brand bg-brand/10 text-brand"
                        : "hover:bg-muted",
                    )}
                  >
                    {n.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border bg-secondary/40 p-5 text-sm text-muted-foreground">
            This option is custom-quoted. Tell us a little about your project and we&apos;ll
            put together the right packaging set and pricing for you.
          </div>
        )}
      </div>

      {/* Result */}
      <div className={cn(compact ? "" : "lg:col-span-2")}>
        <div className="sticky top-24 rounded-2xl border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Estimated price
          </p>
          {result && size ? (
            <>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight">
                {formatPKR(result.total)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                for {result.safeQty.toLocaleString()} units · {product.name}
              </p>
              <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Per unit</span>
                  <span className="font-semibold">{formatPKR(result.perUnit)}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-semibold">{size.label}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted-foreground">MOQ</span>
                  <span className="font-semibold">
                    From {result.moq.toLocaleString()} units
                  </span>
                </div>
                {activeFinishLabels.length > 0 && (
                  <div className="mt-1 flex justify-between gap-3">
                    <span className="shrink-0 text-muted-foreground">Finishes</span>
                    <span className="text-right font-semibold">
                      {activeFinishLabels.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight">
                Custom quote
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.name} — {industry.name}
              </p>
            </>
          )}

          <Button asChild size="lg" className="mt-5 w-full">
            <Link href={quoteHref} onClick={continueToQuote}>
              {result ? "Get exact quote" : "Request a quote"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="mt-3 flex justify-center">
            <WhatsAppButton
              source="estimator"
              pageType="estimator"
              funnelStage="mofu"
              label="Confirm on WhatsApp"
              text={whatsappText}
            />
          </div>
          <p className="mt-4 flex gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            This is an indicative estimate based on standard specs. Your final quote depends
            on exact size, material, artwork and finishing — we confirm it before any production.
          </p>
        </div>
      </div>
    </div>
  );
}
