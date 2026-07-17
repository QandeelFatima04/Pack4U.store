"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/submit-lead";
import { packagingTypes } from "@/content/packaging-types";
import { estimatorIndustries } from "@/content/estimator-pricing";
import { readEstimate, finishKeysToCustomizationIds } from "@/lib/estimate";
import { track } from "@/lib/track";
import { writeRfq } from "@/lib/rfq";
import { formatPKR } from "@/lib/format";

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

const quantityRanges = [
  { value: "under-100", label: "Under 100" },
  { value: "100-500", label: "100 – 500" },
  { value: "500-1000", label: "500 – 1,000" },
  { value: "1000-5000", label: "1,000 – 5,000" },
  { value: "5000+", label: "5,000+" },
  { value: "not-sure", label: "Not sure yet" },
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

function selectCls() {
  return "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
}

/** Map a numeric estimator quantity to the nearest range option. Falls back to
 *  no selection for a missing or unparseable ?qty. */
function toQtyRange(n: number) {
  if (!n || Number.isNaN(n)) return "";
  if (n < 100) return "under-100";
  if (n <= 500) return "100-500";
  if (n <= 1000) return "500-1000";
  if (n <= 5000) return "1000-5000";
  return "5000+";
}

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
  const presetQtyRange = toQtyRange(presetQty);

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [started, setStarted] = useState(false);

  // Fires once, on first real interaction — so abandonment is measurable against
  // form starts rather than page views.
  function onFirstInput() {
    if (started) return;
    setStarted(true);
    track("quote_started", { prefilled: Boolean(estimate) });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const projectType = String(fd.get("projectType") || "");
    const industry = String(fd.get("industry") || "");
    const quantity = String(fd.get("quantity") || "");
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
          dimensions: String(fd.get("dimensions") || ""),
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

      {/* Contact */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
          Your details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="q-name">Full name *</Label>
            <Input id="q-name" name="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-company">Business name</Label>
            <Input id="q-company" name="company" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-email">Email</Label>
            <Input id="q-email" name="email" type="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-phone">WhatsApp number *</Label>
            <Input id="q-phone" name="phone" required placeholder="+92 3XX XXXXXXX" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="q-city">City / country</Label>
            <Input id="q-city" name="city" placeholder="e.g. Lahore, Pakistan" />
          </div>
        </div>
      </fieldset>

      {/* Project */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
          Your packaging
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="q-type">What type of packaging do you need? *</Label>
            <select id="q-type" name="projectType" required defaultValue={presetType} className={selectCls()}>
              <option value="" disabled>Select packaging…</option>
              {projectTypes.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-industry">What type of business is this for? *</Label>
            <select id="q-industry" name="industry" required defaultValue={presetIndustry} className={selectCls()}>
              <option value="" disabled>Select industry…</option>
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
            <Label htmlFor="q-dimensions">Product dimensions (if known)</Label>
            <Input id="q-dimensions" name="dimensions" placeholder="e.g. 5 × 5 × 12 cm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-qty">Quantity *</Label>
            <select id="q-qty" name="quantity" required defaultValue={presetQtyRange} className={selectCls()}>
              <option value="" disabled>Select quantity…</option>
              {quantityRanges.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-artwork-status">Do you have artwork?</Label>
            <select id="q-artwork-status" name="artworkStatus" defaultValue="" className={selectCls()}>
              <option value="" disabled>Select…</option>
              <option value="yes">Yes, print-ready</option>
              <option value="logo-only">Logo only</option>
              <option value="need-help">Need help</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-existing">Existing packaging?</Label>
            <select id="q-existing" name="existingPackaging" defaultValue="" className={selectCls()}>
              <option value="" disabled>Select…</option>
              <option value="improving">Yes, improving it</option>
              <option value="fresh">No, starting fresh</option>
            </select>
          </div>
        </div>

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
      </fieldset>

      {/* Budget / timing / goal */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wide text-brand">
          Budget &amp; goal
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="q-budget">Estimated budget (optional)</Label>
            <Input id="q-budget" name="budget" placeholder="e.g. PKR 50,000" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-deadline">Required deadline</Label>
            <Input id="q-deadline" name="deadline" placeholder="e.g. 3 weeks" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-launch">Is this for a launch / event date?</Label>
            <Input id="q-launch" name="launchDate" placeholder="e.g. yes — 20 July" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-goal">Main goal of this packaging</Label>
            <select id="q-goal" name="goal" defaultValue="" className={selectCls()}>
              <option value="" disabled>Select a goal…</option>
              {goals.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
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
      </fieldset>

      <p className="text-xs text-muted-foreground">
        Provide a WhatsApp number or email so we can send your quote. Minimums start at 500 units and vary by product.
      </p>
      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Sending…" : "Get my packaging quote"}
      </Button>
    </form>
  );
}
