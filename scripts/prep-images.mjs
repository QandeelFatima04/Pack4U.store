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

// target (relative to public/images) -> source (relative to SRC)
const MAP = {
  "hero/hero-1.jpg": `${PF}/Mumba with box.jpg`,
  "hero/hero-2.jpg": `${PK}/Coffee Box.JPG`,
  "hero/hero-3.jpg": `${CB}/_ALI6793.JPG`,
  "hero/hero-4.jpg": `${PK}/Rigid box.JPG`,
  "industries/cosmetics.jpg": `${PF}/Ezra with box.jpg`,
  "industries/food.jpg": `${PK}/Coffee Box.JPG`,
  "industries/fashion.jpg": `${PK}/Rigid box 2.JPG`,
  "industries/ecommerce.jpg": `${PK}/IMG_3065.JPG`,
  "industries/gift.jpg": `${CB}/_ALI6797.JPG`,
  "industries/retail.jpg": `${PK}/Rigid Box 3.JPG`,
  "types/boxes.jpg": `${PK}/IMG_3066.JPG`,
  "types/paper-bags.jpg": `${PK}/Souvenir bag.JPG`,
  "types/tags-labels.jpg": `${PF}/Kai with box.JPG`,
  "types/sleeves.jpg": `${PF}/Dyar with box.JPG`,
  "types/inserts.jpg": `${PK}/Dawlance insta.jpg`,
  "types/gift-boxes.jpg": `${CB}/_ALI6813.JPG`,
  "types/food-boxes.jpg": `${PK}/IMG_3094.JPG`,
};

// slug -> ALL shots of that product (each becomes products/<slug>/NN.jpg in order)
const GROUPS = {
  // Cosmetics / fragrance — boxed perfumes (multiple angles where available)
  "perfume-kai": [`${PF}/Kai with box.JPG`, `${PF}/Kai Box.jpeg`],
  "perfume-mulan": [`${PF}/Mulan with box.jpg`, `${PF}/Mulan with box.jpeg`],
  "perfume-dyar": [`${PF}/Dyar with box.JPG`],
  "perfume-ezra": [`${PF}/Ezra with box.jpg`],
  "perfume-mumba": [`${PF}/Mumba with box.jpg`],
  "perfume-zaram": [`${PF}/Zaram with box.JPG`],
  // Cosmetics — mist bottle boxes (hi-res multi-angle sets)
  "mist-boomerang-chic": [`${MI}/boomerang chic 1.jpg`, `${MI}/boomerang chic 2.jpg`, `${MI}/boomerang chic 3-2.jpg`, `${MI}/boomerang chic 4.jpg`],
  "mist-blank-spell": [`${MI}/blank spell 1.jpg`, `${MI}/blank spell 2.jpg`, `${MI}/blank spell 3.jpg`],
  "mist-classical-rockstar": [`${MI}/classical rockstar 1.jpg`, `${MI}/classical rockstar 2.jpg`, `${MI}/classical rockstar 3-2.jpg`],
  "mist-crooked-smile": [`${MI}/crooked smile 1 .jpg`, `${MI}/crooked smile 2.jpg`, `${MI}/crooked smile 3.jpg`],
  "mist-designer-crime": [`${MI}/designer crime 1.jpg`, `${MI}/designer crime 2.jpg`],
  "mist-drop-beat": [`${MI}/drop beat 1 .jpg`, `${MI}/drop beat 2.jpg`, `${MI}/drop beat 3-2.jpg`],
  // Gift / corporate
  "corporate-gift-box": [
    `${CB}/_ALI6778.JPG`, `${CB}/_ALI6779.JPG`, `${CB}/_ALI6793.JPG`, `${CB}/_ALI6797.JPG`,
    `${CB}/_ALI6801.JPG`, `${CB}/_ALI6813.JPG`, `${CB}/_ALI6828.JPG`, `${CB}/_ALI6840.JPG`,
    `${CB}/_ALI6848.JPG`, `${CB}/_ALI6859.JPG`, `${CB}/_ALI6864.JPG`, `${CB}/_ALI6872.JPG`,
  ],
  "discovery-box": [
    `${DB}/WhatsApp Image 2024-11-20 at 5.06.38 PM.jpeg`,
    `${DB}/WhatsApp Image 2024-11-20 at 5.06.38 PM(1).jpeg`,
    `${DB}/WhatsApp Image 2024-11-20 at 5.06.39 PM.jpeg`,
  ],
  "dawlance-kit": [`${PK}/Dawlance insta.jpg`, `${PK}/insta page.jpg`],
  // Boxes / retail / food / fashion
  "rigid-box": [`${PK}/Rigid box.JPG`, `${PK}/Rigid box 2.JPG`, `${PK}/Rigid Box 3.JPG`, `${PK}/Rigid box 4.JPG`],
  "coffee-box": [`${PK}/Coffee Box.JPG`],
  "perfume-box": [`${PK}/Perfume box.JPG`],
  "souvenir-bag": [`${PK}/Souvenir bag.JPG`],
  "ecommerce-boxes": [`${PK}/IMG_3065.JPG`, `${PK}/IMG_3066.JPG`, `${PK}/IMG_3067.JPG`, `${PK}/IMG_3068.JPG`],
  "product-boxes": [`${PK}/IMG_3072.JPG`, `${PK}/IMG_3073.JPG`, `${PK}/IMG_3075.JPG`, `${PK}/IMG_3077.JPG`],
  "retail-boxes": [`${PK}/IMG_3080.JPG`, `${PK}/IMG_3081.JPG`, `${PK}/IMG_3094.JPG`, `${PK}/IMG_3095.JPG`, `${PK}/IMG_3097.JPG`, `${PK}/IMG_3099.JPG`],
  "editorial-packaging": [
    `${ED}/IMG_3435.JPG`, `${ED}/IMG_3447.JPG`, `${ED}/IMG_3448.JPG`, `${ED}/IMG_3454.JPG`,
    `${ED}/IMG_3456.JPG`, `${ED}/IMG_3460.JPG`, `${ED}/IMG_3472.JPG`, `${ED}/IMG_3480.JPG`,
    `${ED}/IMG_3481.JPG`, `${ED}/IMG_3482.JPG`, `${ED}/IMG_3494.JPG`, `${ED}/IMG_3496.JPG`,
  ],
};

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function resizeOne(srcRel, outAbs) {
  const srcPath = path.join(SRC, srcRel);
  if (!(await exists(srcPath))) { console.warn(`MISSING: ${srcRel}`); return false; }
  await mkdir(path.dirname(outAbs), { recursive: true });
  await sharp(srcPath).rotate().resize({ width: WIDTH, withoutEnlargement: true }).jpeg({ quality: QUALITY, mozjpeg: true }).toFile(outAbs);
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
