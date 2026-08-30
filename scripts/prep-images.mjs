// Resize + compress curated photoshoot images into public/images.
// Run: npm run prep-images
// Source files are large (4–10 MB) raw JPEGs; outputs are ~1600px, ~80% quality.
//
// Two passes:
//  1. MAP    — single hero/industry/type images (one file each).
//  2. GROUPS — every shot of a product, grouped, into public/images/products/<slug>/NN.jpg.
//              Emits src/content/product-images.ts so content can't drift from the files.

import sharp from "sharp";
import { mkdir, access, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const SRC = "D:\\Boxit Images photoshoot\\Photo shoot";
const OUT = path.resolve("public/images");
const WIDTH = 1600;
const QUALITY = 80;

// Source-folder shortcuts
const PK = "Packaging/PackU";
const ED = "Packaging/EDit";
const PF = "Sabrina/wetransfer_for-noman_2024-11-20_1244/For Noman/Perfumes";
const MI = "Sabrina/wetransfer_for-noman_2024-11-20_1244/For Noman/Mists";
const CB = "Sabrina/wetransfer_for-noman_2024-11-20_1244/For Noman/Corporate Box";
const DB = "Sabrina/wetransfer_for-noman_2024-11-20_1244/For Noman/Discovery Box";

// Groups below are keyed off what each photo actually shows, identified from the
// artwork on the box. The IMG_#### source files are unnamed but are not generic:
// each belongs to a specific job, and several jobs were previously split across
// slugs (the welcome kit) or merged into one (the editorial shoot).
//
// EXCLUDED ON PURPOSE — cannabis/THC, CBD and vape work, which sits outside the
// industries this site sells to. Do not re-add without updating the industry copy:
//   PackU/IMG_3065-3068  Delta-9 gummies, cannabis flower, pre-roll dispensers
//   PackU/IMG_3077       Boxit mailer shot dominated by a smoke-brand cube
//   EDit/IMG_3460        line-up including CBD capsules + a vape carton
//   EDit/IMG_3472        CBD gel capsules
//   EDit/IMG_3496        smoke-brand box

// NOTE: public/images/process/* is not produced here — those four step photos are
// not from the photoshoot and are committed already optimized.

// target (relative to public/images) -> source (relative to SRC), either as a
// plain path or as { src, crop, extend, width } when the frame needs reworking.
// `crop` is in SOURCE pixels and runs first; `width` then overrides the default
// resize; `extend` finally pads the frame by replicating its edge pixels.
const MAP = {
  // Homepage hero stage. IMG_3072 is the mixed-industry range shot (supplement,
  // coffee, e-commerce mailer, jewellery window box). The crop trims the dead space
  // around the group; the padding then places the boxes where the hero leaves a hole
  // for them — centred horizontally (32-68%) and sitting at 47-74% vertically, which
  // is the band between the hero's paragraph and its button row. The boxes are sized
  // to clear that band on a short laptop window too, where cover-scaling lifts them
  // toward the copy. The padding
  // replicates the studio backdrop's own edge pixels, so it reads as one sweep
  // rather than a pasted-on panel — which matters because the hero shows this plate
  // unscrimmed on desktop, with the copy set in dark ink straight onto the backdrop.
  // 820 + 550 + 550 = 1920 wide, 547 + 354 + 179 = 1080 tall — a 16:9 plate that
  // survives `object-cover` at any hero size.
  //
  // NB: renaming this file is how a geometry change reaches browsers. next/image
  // caches optimised output against the URL, so overwriting it in place serves the
  // old plate from both the build cache and visitors' browsers.
  "hero/hero-stage.jpg": {
    src: `${PK}/IMG_3072.JPG`,
    crop: { left: 316, top: 389, width: 4600, height: 3067 },
    width: 820,
    extend: { top: 354, bottom: 179, left: 550, right: 550 },
  },
  // The phone plate. A 16:9 plate cover-cropped to a phone keeps only a narrow slice
  // through the middle of the lineup, so phones get their own 1080x2400 frame. At
  // 0.45 that is close enough to a modern handset's aspect that it is scaled rather
  // than cropped, which is what lets the boxes run to 90% of the width — on a 375px
  // screen the lineup is width-capped, so every percent of frame width is a percent
  // of how large the product reads. The crop is tighter than the desktop plate's for
  // the same reason: less studio margin, more box. They sit at 44-61% of the height,
  // the band every phone size leaves clear between the paragraph and the button row.
  // 1000 + 40 + 40 = 1080 wide, 468 + 1046 + 886 = 2400 tall.
  "hero/hero-stage-mobile.jpg": {
    src: `${PK}/IMG_3072.JPG`,
    crop: { left: 600, top: 1160, width: 4040, height: 1890 },
    width: 1000,
    extend: { top: 1046, bottom: 886, left: 40, right: 40 },
  },
  "hero/hero-1.jpg": `${PF}/Mumba with box.jpg`,
  "hero/hero-2.jpg": `${PK}/Coffee Box.JPG`,
  "hero/hero-3.jpg": `${CB}/_ALI6793.JPG`,
  "hero/hero-4.jpg": `${PK}/Rigid box.JPG`,
  "industries/cosmetics.jpg": `${PF}/Ezra with box.jpg`,
  "industries/food.jpg": `${PK}/Coffee Box.JPG`,
  "industries/fashion.jpg": `${PK}/Rigid box 2.JPG`,
  "industries/ecommerce.jpg": `${PK}/IMG_3073.JPG`,
  "industries/gift.jpg": `${CB}/_ALI6797.JPG`,
  "industries/rigid-box.jpg": `${PK}/Rigid Box 3.JPG`,
  "types/boxes.jpg": `${PK}/IMG_3075.JPG`,
  "types/paper-bags.jpg": `${PK}/Souvenir bag.JPG`,
  "types/tags-labels.jpg": `${PF}/Kai with box.JPG`,
  "types/sleeves.jpg": `${PF}/Dyar with box.JPG`,
  "types/inserts.jpg": `${PK}/Dawlance insta.jpg`,
  "types/gift-boxes.jpg": `${CB}/_ALI6813.JPG`,
  "types/food-boxes.jpg": `${PK}/IMG_3080.JPG`,
};

// slug -> ALL shots of that product (each becomes products/<slug>/NN.jpg in order)
const GROUPS = {
  // Cosmetics / fragrance — boxed perfumes (multiple angles where available)
  // "Kai Box" leads: the styled hero shot, vs the plain white-background angle.
  "perfume-kai": [`${PF}/Kai Box.jpeg`, `${PF}/Kai with box.JPG`],
  "perfume-mulan": [`${PF}/Mulan with box.jpg`, `${PF}/Mulan with box.jpeg`],
  "perfume-diyar": [`${PF}/Dyar with box.JPG`],
  "perfume-ezra": [`${PF}/Ezra with box.jpg`],
  // "Perfume box.JPG" is the same SKU as "Mumba with box" — a second angle, not its own product.
  "perfume-mumba": [`${PF}/Mumba with box.jpg`, `${PK}/Perfume box.JPG`],
  "perfume-zaram": [`${PF}/Zaram with box.JPG`],
  // Cosmetics — mist bottle boxes (hi-res multi-angle sets)
  "mist-boomerang-chic": [`${MI}/boomerang chic 1.jpg`, `${MI}/boomerang chic 2.jpg`, `${MI}/boomerang chic 3-2.jpg`, `${MI}/boomerang chic 4.jpg`],
  "mist-blank-spell": [`${MI}/blank spell 1.jpg`, `${MI}/blank spell 2.jpg`, `${MI}/blank spell 3.jpg`],
  "mist-classical-rockstar": [`${MI}/classical rockstar 1.jpg`, `${MI}/classical rockstar 2.jpg`, `${MI}/classical rockstar 3-2.jpg`],
  "mist-crooked-smile": [`${MI}/crooked smile 1 .jpg`, `${MI}/crooked smile 2.jpg`, `${MI}/crooked smile 3.jpg`],
  "mist-designer-crime": [`${MI}/designer crime 1.jpg`, `${MI}/designer crime 2.jpg`],
  "mist-drop-beat": [`${MI}/drop beat 1 .jpg`, `${MI}/drop beat 2.jpg`, `${MI}/drop beat 3-2.jpg`],
  // Gift / corporate
  // _ALI6801 leads: the full open-box hero showing the insert, candle and parfum.
  "corporate-gift-box": [
    `${CB}/_ALI6801.JPG`,
    `${CB}/_ALI6778.JPG`, `${CB}/_ALI6779.JPG`, `${CB}/_ALI6793.JPG`, `${CB}/_ALI6797.JPG`,
    `${CB}/_ALI6813.JPG`, `${CB}/_ALI6828.JPG`, `${CB}/_ALI6840.JPG`,
    `${CB}/_ALI6848.JPG`, `${CB}/_ALI6859.JPG`, `${CB}/_ALI6864.JPG`, `${CB}/_ALI6872.JPG`,
  ],
  "discovery-box": [
    `${DB}/WhatsApp Image 2024-11-20 at 5.06.38 PM.jpeg`,
    `${DB}/WhatsApp Image 2024-11-20 at 5.06.38 PM(1).jpeg`,
    `${DB}/WhatsApp Image 2024-11-20 at 5.06.39 PM.jpeg`,
  ],
  // One job, previously split between "dawlance-kit" and 4 shots of "retail-boxes".
  "welcome-kit": [
    `${PK}/Dawlance insta.jpg`, `${PK}/insta page.jpg`, `${PK}/IMG_3094.JPG`,
    `${PK}/IMG_3095.JPG`, `${PK}/IMG_3097.JPG`, `${PK}/IMG_3099.JPG`,
  ],
  // Boxes / bags
  "rigid-box": [`${PK}/Rigid box.JPG`, `${PK}/Rigid box 2.JPG`, `${PK}/Rigid Box 3.JPG`, `${PK}/Rigid box 4.JPG`],
  "coffee-box": [`${PK}/Coffee Box.JPG`],
  "coffee-variety-kit": [`${PK}/IMG_3080.JPG`, `${PK}/IMG_3081.JPG`],
  "souvenir-bag": [`${PK}/Souvenir bag.JPG`],
  "jewelry-box": [`${PK}/IMG_3073.JPG`],
  "honey-box": [`${PK}/IMG_3075.JPG`],
  // Editorial shoot — was one 12-shot "editorial-packaging" set spanning several jobs.
  "essential-oil-boxes": [
    `${ED}/IMG_3435.JPG`, `${ED}/IMG_3454.JPG`, `${ED}/IMG_3456.JPG`,
    `${ED}/IMG_3480.JPG`, `${ED}/IMG_3481.JPG`, `${ED}/IMG_3482.JPG`,
  ],
  "date-bar-box": [`${ED}/IMG_3447.JPG`, `${ED}/IMG_3448.JPG`],
  "serum-box": [`${ED}/IMG_3494.JPG`],
};

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function resizeOne(source, outAbs) {
  const { src: srcRel, crop, extend, width } = typeof source === "string" ? { src: source } : source;
  const srcPath = path.join(SRC, srcRel);
  if (!(await exists(srcPath))) { console.warn(`MISSING: ${srcRel}`); return false; }
  await mkdir(path.dirname(outAbs), { recursive: true });
  let pipeline = sharp(srcPath).rotate();
  if (crop) pipeline = pipeline.extract(crop);
  pipeline = pipeline.resize({ width: width ?? WIDTH, withoutEnlargement: true });
  if (extend) pipeline = pipeline.extend({ ...extend, extendWith: "copy" });
  await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(outAbs);
  return true;
}

let ok = 0, missing = 0;

// Pass 1 — single images
for (const [target, source] of Object.entries(MAP)) {
  if (await resizeOne(source, path.join(OUT, target))) { ok++; } else { missing++; }
}

// Pass 2 — product galleries
await rm(path.join(OUT, "products"), { recursive: true, force: true });
const manifest = {};
for (const [slug, sources] of Object.entries(GROUPS)) {
  const webPaths = [];
  let i = 0;
  for (const src of sources) {
    i++;
    const name = String(i).padStart(2, "0") + ".jpg";
    const outAbs = path.join(OUT, "products", slug, name);
    if (await resizeOne(src, outAbs)) { webPaths.push(`/images/products/${slug}/${name}`); ok++; }
    else { missing++; }
  }
  if (webPaths.length) manifest[slug] = webPaths;
}

// Emit the manifest so content references can't drift from the generated files.
const ts =
  "// AUTO-GENERATED by scripts/prep-images.mjs — do not edit by hand.\n" +
  "// Maps a product slug to all of its image paths (gallery order).\n\n" +
  "export const productImages: Record<string, string[]> = " +
  JSON.stringify(manifest, null, 2) +
  ";\n";
await writeFile(path.resolve("src/content/product-images.ts"), ts, "utf8");

console.log(`\nDone. ${ok} written, ${missing} missing/failed. ${Object.keys(manifest).length} product galleries.`);
