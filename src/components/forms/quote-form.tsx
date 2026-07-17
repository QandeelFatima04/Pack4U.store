"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/submit-lead";
import { packagingTypes } from "@/content/packaging-types";
import { estimatorIndustries, lookupMoq } from "@/content/estimator-pricing";
import { readEstimate, finishKeysToCustomizationIds } from "@/lib/estimate";
import { track } from "@/lib/track";
import { writeRfq } from "@/lib/rfq";
import { formatPKR } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

const projectTypes = [
  ...packagingTypes.map((p) => ({ value: p.slug, label: p.name })),
  { value: "complete-set", label: "Complete packaging set" },
  { value: "not-sure", label: "Not sure yet" },
];

const industryOptions = [
  ...estimatorIndustries.map((i) => ({ value: i.slug, label: i.name })),
  { value: "other", label: "Other" },
];

// Sheet3 lists three sizes per product (the "Dimensions" column), each with its
// own MOQ. The buyer picks one; the MOQ then drives the quantity minimum.
const sizeOptions = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

const materialOptions = [
  { value: "kraft", label: "Kraft board / paper" },
  { value: "white-board", label: "White SBS / FBB board" },
  { value: "art-card", label: "Art / coated card" },
  { value: "recycled", label: "Recycled board / paper" },
  { value: "rigid", label: "Rigid / hardboard (premium)" },
  { value: "corrugated", label: "Corrugated (shipping-grade)" },
  { value: "label-stock", label: "Adhesive label stock" },
  { value: "not-sure", label: "Not sure — recommend one" },
];

const customizations = [
  { id: "printing", label: "4-colour printing" },
  { id: "emboss", label: "Embossing / debossing" },
  { id: "foiling", label: "Foiling" },
  { id: "spot-uv", label: "Spot UV" },
  { id: "lamination", label: "Lamination" },
  { id: "die-cut", label: "Die cutting" },
  { id: "window", label: "Window cut-out" },
  { id: "custom-shape", label: "Custom shape" },
  { id: "labels", label: "Stickers / labels" },
];

const goals = [
  "Improve brand presentation",
  "Prepare for product launch",
  "Reduce packaging cost",
  "Move toward sustainable packaging",
  "Create gift / retail packaging",
  "Improve e-commerce unboxing",
  "Routine order",
  "Not sure yet",
];

const steps = [
  "Your details",
  "What you need",
  "Size, material & quantity",
  "Printing & finishing",
  "Project & artwork",
];

function selectCls() {
  return "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
}

const sizeLabelById = (id: string) => sizeOptions.find((s) => s.id === id)?.label ?? "";

export function QuoteForm() {
  const router = useRouter();
  const params = useSearchParams();

  // The estimator hands over the full spec in sessionStorage. URL params are the
  // fallback for links opened in a new tab, shared, or with storage cleared.
  // Read once: every value below only seeds a defaultValue, so the buyer can
  // edit any of it.
  const [estimate] = useState(() => readEstimate());

  const presetType = estimate?.typeValue ?? params.get("type") ?? "";
  const presetIndustry = estimate?.industrySlug ?? params.get("industry") ?? "";
  const presetProduct = estimate?.productName ?? params.get("product") ?? "";
  const presetQty = estimate?.quantity ?? Number(params.get("qty") ?? 0);
  const presetFinishes = estimate
    ? finishKeysToCustomizationIds(estimate.finishKeys)
    : (params.get("finishes") ?? "").split(",").filter(Boolean);
  // Null unless there's a real figure to show — ?est=abc must not render "Rs NaN".
  const presetEstValue = (() => {
    if (estimate) return estimate.total;
    const n = Number(params.get("est"));
    return Number.isFinite(n) && n > 0 ? n : null;
  })();
  const presetEst = presetEstValue !== null ? String(Math.round(presetEstValue)) : null;

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const stepRef = useRef<HTMLDivElement>(null);

  // Type, industry and size drive the Sheet3 MOQ, so they're controlled: changing
  // any of them recomputes the quantity minimum below.
  const [projectType, setProjectType] = useState(presetType);
  const [industry, setIndustry] = useState(presetIndustry);
  const [size, setSize] = useState(estimate?.sizeId ?? "");

  // MOQ for the chosen industry + type + size, straight from the pricing sheet.
  // null when the combination isn't a priced row (custom-quoted, or size unset).
  const moq = useMemo(
    () => lookupMoq(industry, projectType, size),
    [industry, projectType, size],
  );

  // Quantity is a real number now. Seed it from the estimator's exact figure, else
  // the MOQ. The buyer can raise it; they can't drop below the MOQ (min + clamp).
  const [quantity, setQuantity] = useState(() =>
    presetQty && !Number.isNaN(presetQty) ? String(presetQty) : "",
  );

  // Whenever a selection changes the MOQ, pull the quantity up to it if it's below
  // (or empty). Done in the change handlers, not an effect, to avoid extra renders.
  function bumpQtyTo(newMoq: number | null) {
    if (newMoq == null) return;
    setQuantity((q) => {
      const n = Number(q);
      return !q || Number.isNaN(n) || n < newMoq ? String(newMoq) : q;
    });
  }

  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  // Fires once, on first real interaction — so abandonment is measurable against
  // form starts rather than page views.
  function onFirstInput() {
    if (started) return;
    setStarted(true);
    track("quote_started", { prefilled: Boolean(estimate) });
  }

  // Only step 1 holds required fields, so this gate is really about it — but run
  // native validation on whatever step is showing so any future required field
  // is honoured too.
  function currentStepValid() {
    const root = stepRef.current;
    if (!root) return true;
    const fields = root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    );
    for (const f of fields) {
      if (!f.reportValidity()) return false;
    }
    return true;
  }

  function goNext() {
    if (!currentStepValid()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Guard against Enter submitting from an early step — only the final step
    // triggers a real submit.
    if (!isLast) {
      goNext();
      return;
    }
    if (!currentStepValid()) return;

    const fd = new FormData(e.currentTarget);

    // projectType, industry and quantity are controlled state — read them directly.
    const checkedCustomization = customizations
      .filter((c) => fd.get(`cz-${c.id}`) === "on")
      .map((c) => c.label);

    // The file is sent for real — previously only its name was.
    const artworkFile = fd.get("artwork");
    const files =
      artworkFile instanceof File && artworkFile.size > 0 ? [artworkFile] : [];
    if (files[0] && files[0].size > MAX_FILE_BYTES) {
      setFileError(
        `That file is over ${MAX_FILE_MB}MB. Please send it on WhatsApp instead, or attach a smaller version — the rest of your request will still reach us.`,
      );
      return;
    }
    setFileError("");
    const artworkName = files[0]?.name ?? "";

    setLoading(true);

    // Lead tag for sales routing (blueprint §14): quote-ready vs consultation.
    const isUnsure =
      projectType === "not-sure" ||
      quantity === "not-sure" ||
      String(fd.get("artworkStatus")) === "need-help";
    const leadTag = isUnsure ? "consultation-required" : "quote-ready";

    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const packaging =
      [projectType, String(fd.get("productDetails") || "")].filter(Boolean).join(" — ") ||
      "";

    const res = await submitLead(
      {
        type: "quote",
        name,
        email,
        phone: String(fd.get("phone") || ""),
        company: String(fd.get("company") || ""),
        businessType: industry,
        product: packaging,
        quantity,
        timeline: String(fd.get("deadline") || ""),
        message: String(fd.get("message") || ""),
        leadTag,
        answers: {
          city: String(fd.get("city") || ""),
          size: sizeLabelById(String(fd.get("size") || "")),
          ...(moq != null ? { moq: String(moq) } : {}),
          material: String(fd.get("material") || ""),
          artworkStatus: String(fd.get("artworkStatus") || ""),
          existingPackaging: String(fd.get("existingPackaging") || ""),
          customization: checkedCustomization.join(", "),
          budget: String(fd.get("budget") || ""),
          launchDate: String(fd.get("launchDate") || ""),
          goal: String(fd.get("goal") || ""),
          // Everything the estimator computed, so sales sees exactly what the
          // buyer was shown.
          ...(estimate
            ? {
                estimateReference: estimate.reference,
                estimatedAt: estimate.calculatedAt,
                estimatorSize: estimate.sizeLabel,
                estimatorQuantity: String(estimate.quantity),
                estimatorPerUnit: formatPKR(estimate.perUnit),
                estimatorFinishes: estimate.finishLabels.join(", "),
                estimatorCalcVersion: String(estimate.calcVersion),
              }
            : {}),
          ...(presetEst ? { estimatorRange: `PKR ${presetEst}` } : {}),
          ...(artworkName ? { artwork: artworkName } : {}),
        },
      },
      files,
    );

    setLoading(false);
    if (!res.ok) {
      toast.error(res.error ?? "Something went wrong.");
      return;
    }

    const spec = ([
      ["Packaging", packaging],
      ["Industry", industry],
      ["Quantity", quantity],
      ["Timeline", String(fd.get("deadline") || "")],
      ...(checkedCustomization.length
        ? ([["Customization", checkedCustomization.join(", ")]] as [string, string][])
        : []),
      ...(estimate
        ? ([
            ["Estimate reference", estimate.reference],
            ["Estimated figure", formatPKR(estimate.total)],
          ] as [string, string][])
        : []),
    ] as [string, string][]).filter(([, v]) => v);

    writeRfq({
      reference: res.reference ?? "",
      submittedAt: new Date().toISOString(),
      delivered: res.delivered ?? false,
      name,
      email,
      spec,
      files: files.map((f) => f.name),
    });

    toast.success("Quote request sent! We'll reply with options.");
    router.push("/get-quote/confirmation");
  }

  return (
    <form onSubmit={onSubmit} onInput={onFirstInput} className="space-y-7">
      {presetEstValue !== null && (
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm">
          <p className="font-semibold">Estimator result attached</p>
          <p className="mt-1 text-muted-foreground">
            Estimated {formatPKR(presetEstValue)}
            {estimate
              ? ` for ${estimate.quantity.toLocaleString()} × ${estimate.productName} (${estimate.sizeLabel})`
              : ""}
            {" — we've filled in what you selected below. Edit anything that isn't right, and we'll confirm an exact quote for your spec."}
          </p>
          {estimate && (
            <p className="mt-2 text-xs text-muted-foreground">
              Estimate reference {estimate.reference}
            </p>
          )}
        </div>
      )}

      {/* Stepper */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {steps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  // Allow jumping back freely; jumping forward only if the
                  // required step is satisfied.
                  if (i <= step || currentStepValid()) setStep(i);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  active
                    ? "border-brand bg-brand text-white"
                    : done
                      ? "border-brand/40 bg-brand/5 text-brand"
                      : "border-input text-muted-foreground hover:bg-muted",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                    active ? "bg-white/20" : done ? "bg-brand/15" : "bg-muted",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div ref={stepRef}>
        {/* Step 1 — Required personal information */}
        <fieldset className={cn("space-y-4", step !== 0 && "hidden")}>
          <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
            Your details
          </legend>
          <p className="text-sm text-muted-foreground">
            Fields marked <span className="text-destructive">*</span> are required. Everything
            after this step is optional — you can send your request with just these details and
            we&apos;ll follow up.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-name">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input id="q-name" name="name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input id="q-email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="q-phone">
                Phone / WhatsApp number <span className="text-destructive">*</span>
              </Label>
              <Input id="q-phone" name="phone" required placeholder="+92 3XX XXXXXXX" />
            </div>
          </div>
        </fieldset>

        {/* Step 2 — Choose what you need */}
        <fieldset className={cn("space-y-4", step !== 1 && "hidden")}>
          <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
            Choose what you need
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-type">What type of packaging do you need?</Label>
              <select
                id="q-type"
                name="projectType"
                value={projectType}
                onChange={(e) => {
                  setProjectType(e.target.value);
                  bumpQtyTo(lookupMoq(industry, e.target.value, size));
                }}
                className={selectCls()}
              >
                <option value="">Select packaging…</option>
                {projectTypes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-industry">What type of business is this for?</Label>
              <select
                id="q-industry"
                name="industry"
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  bumpQtyTo(lookupMoq(e.target.value, projectType, size));
                }}
                className={selectCls()}
              >
                <option value="">Select industry…</option>
                {industryOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="q-product">What product are you packaging?</Label>
              <Input id="q-product" name="productDetails" defaultValue={presetProduct} placeholder="e.g. 50ml serum bottle, coffee pods…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-existing">Existing packaging?</Label>
              <select id="q-existing" name="existingPackaging" defaultValue="" className={selectCls()}>
                <option value="">Select…</option>
                <option value="improving">Yes, improving it</option>
                <option value="fresh">No, starting fresh</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-goal">Main goal of this packaging</Label>
              <select id="q-goal" name="goal" defaultValue="" className={selectCls()}>
                <option value="">Select a goal…</option>
                {goals.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Step 3 — Size, material & quantity */}
        <fieldset className={cn("space-y-4", step !== 2 && "hidden")}>
          <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
            Size, material &amp; quantity
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-size">Size</Label>
              <select
                id="q-size"
                name="size"
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                  bumpQtyTo(lookupMoq(industry, projectType, e.target.value));
                }}
                className={selectCls()}
              >
                <option value="">Select size…</option>
                {sizeOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-material">Preferred material</Label>
              <select id="q-material" name="material" defaultValue="" className={selectCls()}>
                <option value="">Select material…</option>
                {materialOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="q-qty">Quantity{moq != null ? " (MOQ)" : ""}</Label>
              <Input
                id="q-qty"
                name="quantity"
                type="number"
                inputMode="numeric"
                min={moq ?? 1}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={moq != null ? String(moq) : "e.g. 1000"}
              />
              {moq != null ? (
                <p className="text-xs text-muted-foreground">
                  Minimum order for a {sizeLabelById(size).toLowerCase()} size is{" "}
                  <span className="font-semibold text-foreground">{moq.toLocaleString()}</span> units
                  (per our pricing sheet). You can order more, not fewer.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Pick a packaging type, business and size to see the minimum order quantity.
                  Minimums start at {site.minMoq.toLocaleString()} units and vary by product.
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Step 4 — Printing & finishing */}
        <fieldset className={cn("space-y-4", step !== 3 && "hidden")}>
          <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
            Printing &amp; finishing
          </legend>
          <div className="space-y-2">
            <Label>Customization</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {customizations.map((c) => (
                <label key={c.id} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                  <input
                    type="checkbox"
                    name={`cz-${c.id}`}
                    defaultChecked={presetFinishes.includes(c.id)}
                    className="h-4 w-4 rounded border-input accent-[#ea6a25]"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-artwork-status">Do you have artwork?</Label>
            <select id="q-artwork-status" name="artworkStatus" defaultValue="" className={selectCls()}>
              <option value="">Select…</option>
              <option value="yes">Yes, print-ready</option>
              <option value="logo-only">Logo only</option>
              <option value="need-help">Need help</option>
            </select>
          </div>
        </fieldset>

        {/* Step 5 — Project, artwork & contact */}
        <fieldset className={cn("space-y-4", step !== 4 && "hidden")}>
          <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
            Project, artwork &amp; contact
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-company">Company / business name</Label>
              <Input id="q-company" name="company" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-city">City / country</Label>
              <Input id="q-city" name="city" placeholder="e.g. Lahore, Pakistan" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-budget">Estimated budget (optional)</Label>
              <Input id="q-budget" name="budget" placeholder="e.g. PKR 50,000" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-deadline">Required deadline</Label>
              <Input id="q-deadline" name="deadline" placeholder="e.g. 3 weeks" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="q-launch">Is this for a launch / event date?</Label>
              <Input id="q-launch" name="launchDate" placeholder="e.g. yes — 20 July" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-artwork">Upload logo / artwork / reference (optional)</Label>
            <Input
              id="q-artwork"
              name="artwork"
              type="file"
              accept="image/*,.pdf,.ai,.eps"
              className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm"
              aria-describedby="q-artwork-help"
              onChange={() => setFileError("")}
            />
            {fileError ? (
              <p className="text-xs font-medium text-destructive" role="alert">
                {fileError}
              </p>
            ) : (
              <p id="q-artwork-help" className="text-xs text-muted-foreground">
                Your file is sent with this request. Up to {MAX_FILE_MB}MB — larger files can be
                shared on WhatsApp.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-message">Anything else?</Label>
            <Textarea id="q-message" name="message" rows={3} placeholder="Brand colours, finishing, special requirements…" />
          </div>
          <p className="text-xs text-muted-foreground">
            Minimums start at 500 units and vary by product. We&apos;ll reply on WhatsApp or email
            with practical options and pricing.
          </p>
        </fieldset>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={isFirst || loading}
          className={cn(isFirst && "invisible")}
        >
          Back
        </Button>

        <span className="text-xs text-muted-foreground">
          Step {step + 1} of {steps.length}
        </span>

        {isLast ? (
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Sending…" : "Get my packaging quote"}
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={goNext}>
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
