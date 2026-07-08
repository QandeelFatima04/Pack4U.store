import type { PackagingType } from "./types";
import { productImages } from "./product-images";

export const packagingTypes: PackagingType[] = [
  {
    slug: "custom-boxes",
    name: "Custom Boxes",
    shortName: "Boxes",
    tagline: "Printed product boxes built to your exact size",
    heroHeadline: "Custom Paper Boxes for Product Brands",
    heroSub:
      "Design and produce custom boxes for cosmetics, food, gifts, fashion, retail and e-commerce products — with material, printing and finishing options suited to your brand and budget.",
    useCases: [
      "Product packaging",
      "Gift packaging",
      "Retail display",
      "Launch kits",
      "E-commerce orders",
      "Event giveaways",
    ],
    industriesServed: ["Cosmetics", "Food", "Fashion", "E-commerce", "Retail", "Gift"],
    customizationOptions: [
      "Full-colour printing",
      "Matte / gloss lamination",
      "Foil stamping",
      "Emboss / deboss",
      "Window cut-out",
      "Custom die-cut shape",
      "Inserts & dividers",
    ],
    materialOptions: [
      "Kraft board",
      "White SBS / FBB board",
      "Recycled board",
      "Rigid / hardboard (premium)",
      "Corrugated (shipping-grade)",
    ],
    estimable: true,
    basePricePerUnit: 38,
    image: "/images/types/boxes.jpg",
    gallery: ["/images/types/boxes.jpg", ...productImages["retail-boxes"], ...productImages["ecommerce-boxes"]],
    faqs: [
      {
        question: "What box styles can you produce?",
        answer:
          "Tuck-end boxes, auto-lock bottoms, sleeve-and-tray, two-piece lid-and-base, and rigid magnetic boxes. We recommend a style based on your product weight, presentation and budget.",
      },
      {
        question: "Can you match my exact product dimensions?",
        answer:
          "Yes. Custom boxes are made to your inner dimensions so the product fits snugly. Share the product size or send us a sample and we build the die line around it.",
      },
      {
        question: "What is the minimum order for custom boxes?",
        answer: "Our practical minimum is 300–500 units. Lower quantities are possible for rigid boxes but the per-unit cost rises.",
      },
    ],
    seo: {
      seoTitle: "Custom Boxes Pakistan — Printed Product & Packaging Boxes",
      metaDescription:
        "Custom printed product boxes in Pakistan for cosmetics, food, gifts, fashion and e-commerce. Any size, material, printing and finish. Get a custom box quote.",
      keywords: ["custom boxes Pakistan", "product boxes", "printed boxes", "custom packaging boxes"],
    },
  },
  {
    slug: "custom-paper-bags",
    name: "Custom Bags",
    shortName: "Bags",
    tagline: "Branded shopping & gift bags customers carry home",
    heroHeadline: "Custom Bags for Retail & Gifting",
    heroSub:
      "Branded paper bags for shops, boutiques, events and gifting — printed with your logo and brand colours, with handle, size and finish options that match your products.",
    useCases: ["Retail shopping bags", "Boutique & fashion", "Gift bags", "Event giveaways", "Takeaway / food", "Corporate gifting"],
    industriesServed: ["Fashion", "Retail", "Food", "Cosmetics", "Gift"],
    customizationOptions: [
      "Full-colour printing",
      "Matte / gloss lamination",
      "Foil stamping",
      "Rope / ribbon / die-cut handles",
      "Spot finishes",
    ],
    materialOptions: ["Kraft paper", "Art / coated paper", "Recycled paper", "Textured / premium paper"],
    estimable: true,
    basePricePerUnit: 32,
    image: "/images/types/paper-bags.jpg",
    gallery: ["/images/types/paper-bags.jpg", ...productImages["souvenir-bag"]],
    faqs: [
      {
        question: "What handle options are available?",
        answer: "Twisted-paper handles, flat tape handles, cotton rope, ribbon, and die-cut punch handles. We match the handle to bag size and weight.",
      },
      {
        question: "Can paper bags carry heavier products?",
        answer: "Yes — we step up paper GSM and add a reinforced top fold and base board for heavier or premium products.",
      },
      { question: "Minimum order for paper bags?", answer: "Typically 300–500 bags for custom-printed orders." },
    ],
    seo: {
      seoTitle: "Custom Bags Pakistan — Branded Shopping & Gift Bags",
      metaDescription:
        "Custom printed paper bags in Pakistan for retail, fashion, food and gifting. Branded shopping bags with handle, size and finish options. Request a quote.",
      keywords: ["custom bags Pakistan", "branded paper bags", "shopping bags", "printed paper bags"],
    },
  },
  {
    slug: "custom-tags-labels",
    name: "Custom Tags & Labels",
    shortName: "Tags & Labels",
    tagline: "Hang tags, price tags and product labels",
    heroHeadline: "Custom Tags & Labels for Product Brands",
    heroSub:
      "Hang tags, price tags, product labels and stickers that finish your packaging and reinforce your brand — printed and finished to match the rest of your packaging set.",
    useCases: ["Hang tags", "Price tags", "Product labels", "Stickers & seals", "Care / instruction tags", "Thank-you tags"],
    industriesServed: ["Fashion", "Cosmetics", "Food", "Retail", "Gift"],
    customizationOptions: ["Full-colour printing", "Foil stamping", "Emboss / deboss", "Custom die-cut shape", "String / eyelet", "Spot UV"],
    materialOptions: ["Art card", "Kraft card", "Textured / cotton card", "Adhesive label stock"],
    estimable: true,
    basePricePerUnit: 9,
    image: "/images/types/tags-labels.jpg",
    gallery: ["/images/types/tags-labels.jpg", ...productImages["perfume-kai"], ...productImages["perfume-mulan"]],
    faqs: [
      { question: "Can tags match my box and bag?", answer: "Yes — we keep stock, colour and finish consistent across your full packaging set so everything looks like one brand." },
      { question: "Do you add strings and eyelets?", answer: "Yes, we supply tags with eyelets and string in your chosen colour, ready to attach." },
      { question: "Minimum order for tags & labels?", answer: "Tags and labels usually start at 300–500 pieces, often combined with a box or bag order." },
    ],
    seo: {
      seoTitle: "Custom Tags & Labels Pakistan — Hang Tags, Price Tags, Stickers",
      metaDescription:
        "Custom hang tags, price tags, product labels and stickers in Pakistan. Foil, emboss and die-cut options to match your packaging. Get a quote from Pack4U.",
      keywords: ["custom tags Pakistan", "hang tags", "price tags", "product labels Pakistan"],
    },
  },
  {
    slug: "custom-sleeves-belly-bands",
    name: "Custom Sleeves & Belly Bands",
    shortName: "Sleeves",
    tagline: "Wrap an existing box or product in brand",
    heroHeadline: "Custom Sleeves & Belly Bands",
    heroSub:
      "An affordable way to brand a plain box or bundle a product — printed sleeves and belly bands that add presentation without the cost of a fully printed box.",
    useCases: ["Branding plain boxes", "Bundling products", "Seasonal / limited editions", "Subscription boxes", "Food & café"],
    industriesServed: ["Cosmetics", "Food", "E-commerce", "Gift", "Retail"],
    customizationOptions: ["Full-colour printing", "Foil stamping", "Emboss / deboss", "Matte / gloss lamination", "Custom width & wrap"],
    materialOptions: ["Art / coated paper", "Kraft paper", "Recycled paper", "Textured paper"],
    estimable: true,
    basePricePerUnit: 12,
    image: "/images/types/sleeves.jpg",
    gallery: ["/images/types/sleeves.jpg", ...productImages["mist-blank-spell"]],
    faqs: [
      { question: "Why choose a sleeve over a printed box?", answer: "Sleeves let you keep a plain or stock box and add full branding on the wrap — a lower-cost route to a premium look, and easy to update per season." },
      { question: "Can you make sleeves for an existing box?", answer: "Yes. Send the box dimensions or a sample and we cut the sleeve to fit." },
      { question: "Minimum order?", answer: "Sleeves and belly bands typically start at 300–500 units." },
    ],
    seo: {
      seoTitle: "Custom Sleeves & Belly Bands Pakistan",
      metaDescription:
        "Custom printed sleeves and belly bands in Pakistan — an affordable way to brand plain boxes and bundle products. Foil, emboss and lamination options.",
      keywords: ["custom sleeves Pakistan", "belly bands", "box sleeves", "product sleeves"],
    },
  },
  {
    slug: "custom-inserts-thank-you-cards",
    name: "Custom Inserts & Thank-You Cards",
    shortName: "Inserts & Cards",
    tagline: "The unboxing details that build loyalty",
    heroHeadline: "Custom Inserts & Thank-You Cards",
    heroSub:
      "Branded inserts, thank-you cards, discount cards and instruction leaflets that make every order feel intentional and bring customers back.",
    useCases: ["Thank-you cards", "Discount / referral cards", "How-to-use leaflets", "Care instructions", "Subscription notes", "Unboxing inserts"],
    industriesServed: ["E-commerce", "Cosmetics", "Fashion", "Gift", "Food"],
    customizationOptions: ["Full-colour printing", "Foil stamping", "Emboss / deboss", "Spot UV", "Custom size & fold", "QR codes"],
    materialOptions: ["Art card", "Kraft card", "Textured / cotton card", "Recycled card"],
    estimable: true,
    basePricePerUnit: 10,
    image: "/images/types/inserts.jpg",
    gallery: ["/images/types/inserts.jpg", ...productImages["dawlance-kit"]],
    faqs: [
      { question: "Do inserts come with the box?", answer: "They can. Many brands add a thank-you card and an insert to a box order so the whole unboxing is consistent." },
      { question: "Can you add a QR code or discount code?", answer: "Yes — we print QR codes, unique discount codes and referral links directly on the insert." },
      { question: "Minimum order?", answer: "Inserts and cards typically start at 300–500 pieces." },
    ],
    seo: {
      seoTitle: "Custom Inserts & Thank-You Cards Pakistan",
      metaDescription:
        "Custom printed inserts, thank-you cards, discount cards and leaflets in Pakistan for e-commerce and retail unboxing. Get a packaging quote from Pack4U.",
      keywords: ["custom inserts Pakistan", "thank you cards", "packaging inserts", "unboxing cards"],
    },
  },
  {
    slug: "custom-gift-boxes",
    name: "Custom Gift Boxes",
    shortName: "Gift Boxes",
    tagline: "Premium rigid & magnetic boxes for gifting",
    heroHeadline: "Custom Gift Boxes & Rigid Packaging",
    heroSub:
      "Premium rigid and magnetic-closure gift boxes for corporate gifting, launches and luxury retail — with foam or board inserts that hold each item in place.",
    useCases: ["Corporate gifts", "Product launch kits", "Luxury retail", "Subscription / hamper boxes", "Wedding & event gifting"],
    industriesServed: ["Gift", "Cosmetics", "Fashion", "Corporate", "Retail"],
    customizationOptions: ["Full-colour or special-colour printing", "Foil stamping", "Emboss / deboss", "Magnetic closure", "Custom foam / board inserts", "Ribbon & magnetic flaps"],
    materialOptions: ["Rigid / grey board wrapped in art paper", "Specialty / textured wrap", "Recycled rigid board"],
    estimable: true,
    basePricePerUnit: 70,
    image: "/images/types/gift-boxes.jpg",
    gallery: ["/images/types/gift-boxes.jpg", ...productImages["corporate-gift-box"]],
    faqs: [
      { question: "What makes a gift box 'rigid'?", answer: "Rigid boxes use a thick grey board wrapped in printed paper — they hold their shape, feel premium and are ideal for gifting and high-value products." },
      { question: "Can you add inserts to hold the products?", answer: "Yes — foam, board or moulded-pulp inserts cut to hold each item so the gift presents perfectly when opened." },
      { question: "Minimum order for rigid gift boxes?", answer: "Rigid boxes can run from lower quantities, but 300+ gives the best per-unit cost." },
    ],
    seo: {
      seoTitle: "Custom Gift Boxes & Rigid Packaging Pakistan",
      metaDescription:
        "Premium custom gift boxes and rigid magnetic boxes in Pakistan for corporate gifting, launches and luxury retail. Foil, emboss and custom inserts. Get a quote.",
      keywords: ["custom gift boxes Pakistan", "rigid boxes", "magnetic boxes", "luxury packaging Pakistan"],
    },
  },
  {
    slug: "custom-food-boxes",
    name: "Custom Food Boxes",
    shortName: "Food Boxes",
    tagline: "Food-suitable boxes for bakeries & cafés",
    heroHeadline: "Custom Food & Bakery Boxes",
    heroSub:
      "Practical, attractive food-suitable boxes for bakeries, cafés, dessert and food brands — for takeaway, gifting and retail, branded with your logo.",
    useCases: ["Bakery & dessert boxes", "Takeaway packaging", "Café & coffee", "Food gifting", "Retail food brands"],
    industriesServed: ["Food", "Retail", "Gift"],
    customizationOptions: ["Full-colour printing", "Food-suitable coatings", "Window cut-out", "Custom die-cut shape", "Inserts & dividers"],
    materialOptions: ["Food-grade board", "Kraft board", "Greaseproof-lined board", "Corrugated (for heavier items)"],
    estimable: true,
    basePricePerUnit: 30,
    image: "/images/types/food-boxes.jpg",
    gallery: ["/images/types/food-boxes.jpg", ...productImages["coffee-box"]],
    faqs: [
      { question: "Are the boxes food-safe?", answer: "We use food-suitable boards and coatings and advise the right liner for your product. Tell us what goes inside and we recommend a safe, practical option." },
      { question: "Can you add a window?", answer: "Yes — clear window cut-outs let customers see the product, popular for bakery and dessert boxes." },
      { question: "Minimum order for food boxes?", answer: "Custom-printed food boxes typically start at 300–500 units." },
    ],
    seo: {
      seoTitle: "Custom Food & Bakery Boxes Pakistan",
      metaDescription:
        "Custom food-suitable boxes in Pakistan for bakeries, cafés and food brands — takeaway, gifting and retail. Windows, kraft and printed options. Get a quote.",
      keywords: ["food packaging boxes Pakistan", "bakery boxes", "custom food boxes", "takeaway packaging Pakistan"],
    },
  },
];
