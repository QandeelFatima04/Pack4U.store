// ── Estimator pricing — sourced from Pack4U pricing sheet (Sheet3) ────────────
// Industry → packaging product → size (Small / Medium / Large), each with its own
// MOQ and per-unit price (PKR). Finishing options are flat per-unit add-ons:
//   number      → optional add-on, +PKR/unit when selected
//   "included"  → already priced into the per-unit cost (no extra charge)
//   null        → not available for this product
// Products with no sizes are custom-quoted (Complete set / Not sure / corporate).

export type EstFinishKey = "printing" | "embossing" | "foiling" | "spotuv" | "lamination";
export type EstFinishValue = number | "included" | null;

export const FINISH_LABELS: Record<EstFinishKey, string> = {
  printing: "4-colour printing",
  embossing: "Embossing",
  foiling: "Foiling",
  spotuv: "Spot UV",
  lamination: "Lamination",
};

// Order finishes appear in the UI.
export const FINISH_ORDER: EstFinishKey[] = [
  "printing",
  "embossing",
  "foiling",
  "spotuv",
  "lamination",
];

export type EstSize = {
  id: "small" | "medium" | "large";
  label: string;
  moq: number;
  price: number; // PKR per unit
};

export type EstProduct = {
  name: string;
  sizes: EstSize[]; // empty ⇒ custom-quoted (not price-estimable)
  finishes: Record<EstFinishKey, EstFinishValue>;
  estimable: boolean;
};

export type EstIndustry = {
  slug: string;
  name: string;
  products: EstProduct[];
};

// Helper: build the size list, dropping any size with no price in the sheet.
function sizes(
  sMoq: number | null,
  sPrice: number | null,
  mMoq: number | null,
  mPrice: number | null,
  lMoq: number | null,
  lPrice: number | null,
): EstSize[] {
  const out: EstSize[] = [];
  if (sPrice != null) out.push({ id: "small", label: "Small", moq: sMoq ?? 0, price: sPrice });
  if (mPrice != null) out.push({ id: "medium", label: "Medium", moq: mMoq ?? 0, price: mPrice });
  if (lPrice != null) out.push({ id: "large", label: "Large", moq: lMoq ?? 0, price: lPrice });
  return out;
}

// Helper: finish add-on map, in sheet column order.
function fin(
  printing: EstFinishValue,
  embossing: EstFinishValue,
  foiling: EstFinishValue,
  spotuv: EstFinishValue,
  lamination: EstFinishValue,
): Record<EstFinishKey, EstFinishValue> {
  return { printing, embossing, foiling, spotuv, lamination };
}

function product(
  name: string,
  sz: EstSize[],
  finishes: Record<EstFinishKey, EstFinishValue>,
): EstProduct {
  return { name, sizes: sz, finishes, estimable: sz.length > 0 };
}

// A custom-quoted option (no per-unit price in the sheet).
function custom(name: string): EstProduct {
  return { name, sizes: [], finishes: fin(null, null, null, null, null), estimable: false };
}

const COMPLETE_SET = () => custom("Complete Packaging Set");
const NOT_SURE = () => custom("Not sure yet");

export const estimatorIndustries: EstIndustry[] = [
  {
    slug: "cosmetic-skincare",
    name: "Cosmetic & Skincare",
    products: [
      product("Custom Boxes", sizes(500, 40, 1000, 80, 500, 150), fin("included", 10, 10, 10, 20)),
      product("Custom Bags (card)", sizes(500, 70, 1000, 150, 500, 250), fin("included", 10, 10, 10, 30)),
      product("Custom Tags & Labels", sizes(5000, 8, 5000, 12, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Sleeves & Belly Bands", sizes(5000, 10, 5000, 15, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Inserts & Thank-You Cards", sizes(500, 30, 500, 40, 500, 50), fin("included", 10, 10, 10, 10)),
      product("Custom Gift Boxes (rigid)", sizes(500, 200, 500, 400, 500, 800), fin("included", 10, 10, 10, 25)),
      product("Custom Food Boxes", sizes(1000, 12, 1000, 18, 1000, 25), fin("included", 10, 10, 10, 10)),
      COMPLETE_SET(),
      NOT_SURE(),
    ],
  },
  {
    slug: "clothing-accessories",
    name: "Clothing & Accessories",
    products: [
      product("Custom Boxes (rigid)", sizes(500, 500, 500, 800, 500, 1500), fin("included", 10, 10, 10, 30)),
      product("Custom Bags (paper)", sizes(1000, 30, 1000, 40, 1000, 60), fin(10, 10, 10, 10, 20)),
      product("Custom Bags (card)", sizes(1000, 50, 1000, 75, 1000, 120), fin("included", 20, 20, 10, 30)),
      product("Custom Tags & Labels", sizes(5000, 8, 5000, 12, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Sleeves & Belly Bands", sizes(5000, 10, 5000, 15, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Inserts & Thank-You Cards", sizes(500, 30, 500, 40, 500, 50), fin("included", 10, 10, 10, 10)),
      product("Custom Gift Boxes", sizes(500, 200, 500, 400, 500, 800), fin("included", 10, 10, 10, 30)),
      product("Custom Food Boxes", sizes(1000, 12, 1000, 18, 1000, 25), fin("included", 10, 10, 10, 10)),
      COMPLETE_SET(),
      NOT_SURE(),
    ],
  },
  {
    slug: "ecommerce-d2c",
    name: "E-commerce & D2C",
    products: [
      product("Corrugated Boxes", sizes(1000, 100, 1000, 250, 1000, 400), fin(20, null, null, null, null)),
      product("Custom Boxes", sizes(1000, 400, 1000, 800, 1000, 1500), fin(10, 10, 10, 10, 10)),
      product("Custom Bags (delivery)", sizes(1000, 50, 1000, 75, 1000, 120), fin("included", 20, 20, 10, 10)),
      product("Flyers", sizes(1000, 12, 1000, 25, 1000, 40), fin(null, null, null, 10, null)),
      product("Custom Tags & Labels", sizes(5000, 8, 5000, 12, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Sleeves & Belly Bands", sizes(5000, 10, 5000, 15, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Inserts & Thank-You Cards", sizes(500, 30, 500, 40, 500, 50), fin("included", 10, 10, 10, 10)),
      product("Custom Gift Boxes", sizes(500, 200, 500, 400, 500, 800), fin("included", 10, 10, 20, 30)),
      product("Custom Food Boxes", sizes(1000, 12, 1000, 18, 1000, 25), fin("included", 10, 10, 10, 10)),
      COMPLETE_SET(),
      NOT_SURE(),
    ],
  },
  {
    slug: "food-bakery",
    name: "Food & Bakery",
    products: [
      product("Custom Boxes (Card — Burgers)", sizes(2000, 15, 2000, 20, 1000, 30), fin("included", 10, 10, 10, 10)),
      product("Custom Boxes (Card — Cakes)", sizes(2000, 40, 2000, 50, 2000, 60), fin("included", 10, 10, 10, 10)),
      product("Custom Bags", sizes(2000, 40, 2000, 50, 2000, 60), fin("included", 10, 10, 10, 10)),
      product("Custom Tags & Labels", sizes(5000, 8, 5000, 12, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Sleeves & Belly Bands", sizes(5000, 10, 5000, 15, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Inserts & Thank-You Cards", sizes(500, 30, 500, 40, 500, 50), fin("included", 10, 10, 10, 10)),
      product("Custom Gift Boxes", sizes(500, 200, 500, 400, 500, 800), fin("included", 10, 10, 20, 30)),
      product("Custom Food Boxes", sizes(1000, 12, 1000, 18, 1000, 25), fin("included", 10, 10, 10, 10)),
      COMPLETE_SET(),
      NOT_SURE(),
    ],
  },
  {
    slug: "gift-packaging",
    name: "Gift Packaging",
    products: [
      product("Custom Boxes", sizes(500, 40, 1000, 80, 500, 150), fin("included", 10, 10, 10, 20)),
      product("Custom Bags", sizes(500, 70, 1000, 150, 500, 250), fin("included", 10, 10, 10, 30)),
      product("Custom Tags & Labels", sizes(5000, 8, 5000, 12, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Sleeves & Belly Bands", sizes(5000, 10, 5000, 15, 5000, 20), fin("included", 10, 10, 10, 10)),
      product("Custom Inserts & Thank-You Cards", sizes(500, 30, 500, 40, 500, 50), fin("included", 10, 10, 10, 10)),
      product("Custom Gift Boxes", sizes(500, 200, 500, 400, 500, 800), fin("included", 10, 10, 10, 25)),
      product("Custom Food Boxes", sizes(1000, 12, 1000, 18, 1000, 25), fin("included", 10, 10, 10, 10)),
      COMPLETE_SET(),
      NOT_SURE(),
    ],
  },
  {
    slug: "seed-paper",
    name: "Seed Paper Packaging",
    products: [
      product("Custom Boxes", sizes(500, 200, 500, 400, 500, 800), fin("included", 10, 10, null, null)),
      product("Custom Bags", sizes(500, 210, 500, 350, null, null), fin("included", 10, 10, null, null)),
      product("Custom Tags & Labels", sizes(5000, 25, 5000, 35, 5000, 50), fin("included", 10, 10, null, null)),
      product("Custom Sleeves & Belly Bands", sizes(5000, 25, 5000, 35, 5000, 50), fin("included", 10, 10, null, null)),
      product("Custom Inserts & Thank-You Cards", sizes(500, 40, 500, 80, 500, 125), fin("included", 10, 10, null, null)),
      product("Custom Gift Boxes", sizes(500, 200, 500, 400, 500, 800), fin("included", 10, 10, null, null)),
      COMPLETE_SET(),
      NOT_SURE(),
    ],
  },
  {
    slug: "corporate-souvenir",
    name: "Corporate / Souvenir Boxes",
    products: [
      custom("Custom Boxes"),
      COMPLETE_SET(),
      NOT_SURE(),
    ],
  },
];

// Map a packaging-type landing-page slug to the product name used in the sheet,
// so type pages can pre-select the closest estimable product.
export const typeSlugToProductName: Record<string, string> = {
  "custom-boxes": "Custom Boxes",
  "custom-paper-bags": "Custom Bags",
  "custom-tags-labels": "Custom Tags & Labels",
  "custom-sleeves-belly-bands": "Custom Sleeves & Belly Bands",
  "custom-inserts-thank-you-cards": "Custom Inserts & Thank-You Cards",
  "custom-gift-boxes": "Custom Gift Boxes",
  "custom-food-boxes": "Custom Food Boxes",
};

// Best-effort reverse map: a sheet product name → the quote form's project-type value.
export function productNameToTypeValue(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("tags")) return "custom-tags-labels";
  if (n.includes("sleeve")) return "custom-sleeves-belly-bands";
  if (n.includes("insert")) return "custom-inserts-thank-you-cards";
  if (n.includes("gift box")) return "custom-gift-boxes";
  if (n.includes("food box")) return "custom-food-boxes";
  if (n.includes("bag")) return "custom-paper-bags";
  if (n.includes("box")) return "custom-boxes";
  if (n.includes("complete")) return "complete-set";
  return "";
}

// Pick the default product for an industry given an optional type-page slug.
export function pickProduct(industry: EstIndustry, typeSlug?: string): EstProduct {
  if (typeSlug) {
    const target = typeSlugToProductName[typeSlug]?.toLowerCase();
    if (target) {
      const exact = industry.products.find((p) => p.estimable && p.name.toLowerCase() === target);
      if (exact) return exact;
      const partial = industry.products.find(
        (p) => p.estimable && p.name.toLowerCase().startsWith(target),
      );
      if (partial) return partial;
    }
  }
  return industry.products.find((p) => p.estimable) ?? industry.products[0];
}
