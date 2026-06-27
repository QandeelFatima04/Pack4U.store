import type { IndustryPage } from "./types";
import { productImages } from "./product-images";

export const industries: IndustryPage[] = [
  {
    slug: "custom-cosmetic-packaging",
    label: "Cosmetics & Skincare",
    shortLabel: "Cosmetics",
    accent: "#E94C8A",
    audience: "Skincare, beauty, soap, perfume & wellness brands",
    heroHeadline: "Custom Cosmetic Packaging for Skincare, Beauty & Wellness Brands",
    heroSub:
      "Create branded boxes, sleeves, inserts, labels and product packaging that improves presentation and supports your product launch, retail display or customer unboxing.",
    pains: [
      "Generic packaging weakens perceived product value",
      "Product size doesn't fit standard boxes",
      "Packaging design and production feel confusing",
      "Premium packaging feels too expensive",
      "Brand needs consistent packaging across products",
    ],
    offer:
      "We develop custom paper packaging for skincare, beauty and wellness brands — boxes, sleeves, inserts, labels and launch kits sized to your product, printed to your brand, and made production-ready.",
    productTypeSlugs: ["custom-boxes", "custom-sleeves-belly-bands", "custom-inserts-thank-you-cards", "custom-tags-labels", "custom-gift-boxes", "custom-paper-bags"],
    customization: ["Printing", "Foiling", "Embossing", "Window cut-out", "Custom inserts", "Matching sleeve & label set"],
    portfolioSlugs: ["perfume-kai", "perfume-mulan", "mist-boomerang-chic", "perfume-mumba", "mist-drop-beat", "perfume-box"],
    startingMoq: "From 300–500 units",
    leadTime: "7–15 working days after approval",
    heroImage: "/images/industries/cosmetics.jpg",
    gallery: ["/images/industries/cosmetics.jpg", ...productImages["perfume-kai"], ...productImages["perfume-mulan"], ...productImages["mist-boomerang-chic"], ...productImages["mist-drop-beat"]],
    faqs: [
      { question: "Can you match my product's exact size?", answer: "Yes. We build the box and insert around your bottle, jar or tube so it fits snugly and presents well." },
      { question: "Can you do a matching set — box, sleeve and label?", answer: "Yes. A coordinated set is one of our most popular requests for skincare and beauty lines." },
      { question: "What's the minimum order?", answer: "Most cosmetic packaging starts at 300–500 units; rigid/premium boxes can run lower at a higher per-unit cost." },
    ],
    cta: {
      label: "Get a cosmetic packaging quote",
      whatsappText: "Hi Pack4U, I need custom cosmetic/skincare packaging. Product: ___. Quantity: ___. Please share options and pricing.",
    },
    seo: {
      seoTitle: "Custom Cosmetic Packaging Pakistan — Skincare & Beauty Boxes",
      metaDescription:
        "Custom cosmetic packaging in Pakistan for skincare, beauty, soap and perfume brands — boxes, sleeves, inserts and labels. Premium presentation, production-ready. Get a quote.",
      keywords: ["cosmetic packaging Pakistan", "skincare packaging", "beauty packaging", "perfume box packaging Pakistan"],
    },
  },
  {
    slug: "custom-food-packaging",
    label: "Food & Bakery",
    shortLabel: "Food",
    accent: "#F0A23B",
    audience: "Bakeries, cafés, dessert, tea/coffee & food brands",
    heroHeadline: "Custom Food & Bakery Packaging",
    heroSub:
      "Custom paper packaging for bakeries, cafés and food brands that need practical, food-suitable packaging with strong brand presentation — for takeaway, gifting and retail.",
    pains: [
      "Need packaging that is attractive and practical",
      "Need food-safe or food-suitable packaging direction",
      "Need bags, sleeves, boxes, labels and inserts that match",
      "Packaging must work for takeaway, gifting or retail",
      "Need cost-effective bulk production",
    ],
    offer:
      "We develop food-suitable paper packaging for bakeries, cafés and food brands — boxes, bags, sleeves, labels and inserts that are practical to use and strongly branded.",
    productTypeSlugs: ["custom-food-boxes", "custom-paper-bags", "custom-sleeves-belly-bands", "custom-tags-labels", "custom-boxes", "custom-inserts-thank-you-cards"],
    customization: ["Printing", "Food-suitable coatings", "Window cut-out", "Die-cut shapes", "Stickers & labels", "Matching bag & box set"],
    portfolioSlugs: ["coffee-box"],
    startingMoq: "From 300–500 units",
    leadTime: "7–15 working days after approval",
    heroImage: "/images/industries/food.jpg",
    gallery: ["/images/industries/food.jpg", ...productImages["coffee-box"]],
    faqs: [
      { question: "Is the packaging food-safe?", answer: "We use food-suitable boards and coatings and recommend the right liner for your product. Tell us what goes inside and we advise a safe, practical option." },
      { question: "Can you do takeaway and retail versions?", answer: "Yes — we keep your branding consistent across takeaway boxes, bags and retail-shelf packaging." },
      { question: "Minimum order?", answer: "Custom-printed food packaging usually starts at 300–500 units." },
    ],
    cta: {
      label: "Get a food packaging quote",
      whatsappText: "Hi Pack4U, I need custom food/bakery packaging. Product: ___. Quantity: ___. Please share options and pricing.",
    },
    seo: {
      seoTitle: "Custom Food & Bakery Packaging Pakistan — Café & Takeaway",
      metaDescription:
        "Custom food packaging in Pakistan for bakeries, cafés and food brands — boxes, bags, sleeves and labels. Food-suitable, practical and branded. Get a quote.",
      keywords: ["food packaging Pakistan", "bakery packaging", "café packaging", "takeaway packaging Pakistan"],
    },
  },
  {
    slug: "custom-fashion-packaging",
    label: "Fashion & Accessories",
    shortLabel: "Fashion",
    accent: "#7C5CE0",
    audience: "Clothing, boutique, jewelry, footwear & accessory brands",
    heroHeadline: "Custom Packaging for Fashion & Accessory Brands",
    heroSub:
      "Custom packaging for fashion and accessory brands that want stronger brand presentation across retail, gifting and e-commerce orders — paper bags, hang tags, inserts and boxes.",
    pains: [
      "Need branded paper bags, tags, labels and inserts",
      "Current packaging feels low-end",
      "Need consistent retail and e-commerce presentation",
      "Need packaging that improves perceived value",
      "Need flexible customization",
    ],
    offer:
      "We develop branded packaging sets for fashion and accessory brands — paper bags, hang tags, price tags, thank-you cards, inserts and boxes that lift perceived value across every channel.",
    productTypeSlugs: ["custom-paper-bags", "custom-tags-labels", "custom-inserts-thank-you-cards", "custom-boxes", "custom-gift-boxes", "custom-sleeves-belly-bands"],
    customization: ["Printing", "Foiling", "Embossing", "Custom die-cut tags", "Ribbon & rope handles", "Retail packaging set"],
    portfolioSlugs: ["souvenir-bag", "rigid-box"],
    startingMoq: "From 300–500 units",
    leadTime: "7–15 working days after approval",
    heroImage: "/images/industries/fashion.jpg",
    gallery: ["/images/industries/fashion.jpg", ...productImages["souvenir-bag"], ...productImages["rigid-box"]],
    faqs: [
      { question: "Can you make a full retail set?", answer: "Yes — bag, hang tag, price tag, thank-you card and tissue coordination, all matched to one brand look." },
      { question: "Do you make jewelry and accessory boxes?", answer: "Yes, including window boxes and rigid boxes with inserts for jewelry and small accessories." },
      { question: "Minimum order?", answer: "Most fashion packaging starts at 300–500 units per item." },
    ],
    cta: {
      label: "Get a fashion packaging quote",
      whatsappText: "Hi Pack4U, I need custom packaging for my fashion/accessory brand. Item: ___. Quantity: ___. Please share options and pricing.",
    },
    seo: {
      seoTitle: "Custom Fashion Packaging Pakistan — Bags, Tags & Boxes",
      metaDescription:
        "Custom packaging for fashion and accessory brands in Pakistan — branded paper bags, hang tags, inserts and boxes. Stronger retail and e-commerce presentation. Get a quote.",
      keywords: ["fashion packaging Pakistan", "clothing tags", "boutique packaging", "jewelry boxes Pakistan"],
    },
  },
  {
    slug: "custom-ecommerce-packaging",
    label: "E-commerce & D2C",
    shortLabel: "E-commerce",
    accent: "#19A7A0",
    audience: "Online stores, Instagram & Shopify sellers, subscription brands",
    heroHeadline: "Custom E-commerce Packaging for Online Brands",
    heroSub:
      "Custom packaging for online brands that want every order to feel intentional, branded and ready to share — mailer boxes, inserts, sleeves and thank-you cards built for shipping and unboxing.",
    pains: [
      "Need packaging that feels branded when delivered",
      "Need inserts, sleeves, boxes and thank-you cards",
      "Need affordable custom packaging without overcomplication",
      "Need packaging that works for shipping and presentation",
      "Need guidance on minimum viable packaging",
    ],
    offer:
      "We develop e-commerce packaging that survives shipping and elevates unboxing — mailer-style boxes, product boxes, inserts, sleeves, labels and thank-you cards that make every order feel branded.",
    productTypeSlugs: ["custom-boxes", "custom-inserts-thank-you-cards", "custom-sleeves-belly-bands", "custom-tags-labels", "custom-paper-bags", "custom-gift-boxes"],
    customization: ["Printing", "Mailer / shipping-grade board", "Inserts & dividers", "Branded tape & stickers", "QR / discount cards"],
    portfolioSlugs: ["ecommerce-boxes", "dawlance-kit", "product-boxes"],
    startingMoq: "From 300–500 units",
    leadTime: "7–15 working days after approval",
    heroImage: "/images/industries/ecommerce.jpg",
    gallery: ["/images/industries/ecommerce.jpg", ...productImages["ecommerce-boxes"], ...productImages["product-boxes"], ...productImages["dawlance-kit"]],
    faqs: [
      { question: "What's the minimum viable packaging for a small store?", answer: "Often a printed mailer box (or a plain box plus a printed sleeve) and a thank-you card. We help you start lean and scale up." },
      { question: "Will it survive shipping?", answer: "Yes — we use shipping-grade board for mailers and advise on protection so products arrive intact." },
      { question: "Minimum order?", answer: "E-commerce packaging usually starts at 300–500 units; sleeves and inserts keep early costs low." },
    ],
    cta: {
      label: "Get an e-commerce packaging quote",
      whatsappText: "Hi Pack4U, I run an online store and need branded e-commerce packaging. Product: ___. Quantity: ___. Please share options and pricing.",
    },
    seo: {
      seoTitle: "Custom E-commerce Packaging Pakistan — Mailer Boxes & Inserts",
      metaDescription:
        "Custom e-commerce packaging in Pakistan for online and D2C brands — mailer boxes, inserts, sleeves and thank-you cards. Built for shipping and unboxing. Get a quote.",
      keywords: ["ecommerce packaging Pakistan", "unboxing packaging", "mailer boxes Pakistan", "online store packaging"],
    },
  },
  {
    slug: "custom-gift-packaging",
    label: "Gift Packaging",
    shortLabel: "Gift",
    accent: "#E0584B",
    audience: "Gift brands, corporates, events & hamper businesses",
    heroHeadline: "Custom Gift Packaging & Corporate Gift Boxes",
    heroSub:
      "Premium gift and corporate-gift packaging that recipients keep — rigid boxes, hampers, sleeves and inserts customised with your brand for launches, events and seasonal gifting.",
    pains: [
      "Gift packaging looks generic or last-minute",
      "Need premium presentation within budget",
      "Need inserts that hold multiple items neatly",
      "Need bulk gifting delivered on a deadline",
      "Need consistent branding across the gift set",
    ],
    offer:
      "We develop premium gift packaging — rigid and magnetic gift boxes, hamper boxes, sleeves, tags and inserts — customised with your brand and built to hold each item perfectly.",
    productTypeSlugs: ["custom-gift-boxes", "custom-boxes", "custom-paper-bags", "custom-inserts-thank-you-cards", "custom-tags-labels", "custom-sleeves-belly-bands"],
    customization: ["Printing", "Foiling", "Embossing", "Magnetic closure", "Custom foam / board inserts", "Ribbon & belly band"],
    portfolioSlugs: ["corporate-gift-box", "discovery-box", "dawlance-kit"],
    startingMoq: "From 300 units",
    leadTime: "10–15 working days after approval",
    heroImage: "/images/industries/gift.jpg",
    gallery: ["/images/industries/gift.jpg", ...productImages["corporate-gift-box"], ...productImages["discovery-box"]],
    faqs: [
      { question: "Can you build a full corporate gift box?", answer: "Yes — rigid box, custom insert to hold each item, printed sleeve and tag. We coordinate the whole set and bulk delivery." },
      { question: "Can inserts hold multiple products?", answer: "Yes. Foam or board inserts are cut to hold bottles, mugs, notebooks, pens and more in fixed positions." },
      { question: "Minimum order?", answer: "Gift packaging typically starts at 300 units; rigid boxes can run lower at a higher per-unit cost." },
    ],
    cta: {
      label: "Plan your gift packaging",
      whatsappText: "Hi Pack4U, I need custom gift / corporate-gift packaging. Item: ___. Quantity: ___. Deadline: ___. Please share options and pricing.",
    },
    seo: {
      seoTitle: "Custom Gift Packaging & Corporate Gift Boxes Pakistan",
      metaDescription:
        "Custom gift packaging in Pakistan — rigid gift boxes, hampers, sleeves and inserts for corporate gifting, launches and events. Premium and branded. Get a quote.",
      keywords: ["gift packaging Pakistan", "corporate gift boxes", "hamper boxes Pakistan", "custom gift boxes"],
    },
  },
  {
    slug: "custom-retail-packaging",
    label: "Retail Packaging",
    shortLabel: "Retail",
    accent: "#3B82C4",
    audience: "Retail brands, FMCG, multi-product & shelf-ready brands",
    heroHeadline: "Custom Retail Packaging for Shelf-Ready Brands",
    heroSub:
      "Retail-ready packaging that performs on shelf and stays consistent across your range — printed boxes, sleeves, labels and display packaging built for retail presentation and bulk supply.",
    pains: [
      "Packaging looks inconsistent across the product range",
      "Needs to stand out on a retail shelf",
      "Needs durable, stackable, shelf-ready structures",
      "Needs reliable bulk production and reorders",
      "Needs cost control at scale",
    ],
    offer:
      "We develop shelf-ready retail packaging — printed boxes, sleeves, labels and display-friendly structures — kept consistent across your range and produced reliably at volume.",
    productTypeSlugs: ["custom-boxes", "custom-tags-labels", "custom-sleeves-belly-bands", "custom-food-boxes", "custom-paper-bags", "custom-inserts-thank-you-cards"],
    customization: ["Printing", "Lamination", "Window cut-out", "Die-cut shapes", "Shelf-ready / display formats", "Range-wide consistency"],
    portfolioSlugs: ["rigid-box", "retail-boxes", "product-boxes", "editorial-packaging"],
    startingMoq: "From 500 units",
    leadTime: "10–15 working days after approval",
    heroImage: "/images/industries/retail.jpg",
    gallery: ["/images/industries/retail.jpg", ...productImages["retail-boxes"], ...productImages["rigid-box"], ...productImages["editorial-packaging"]],
    faqs: [
      { question: "Can you keep packaging consistent across many products?", answer: "Yes — we build a packaging system so every SKU shares the same look, structure logic and finish, then produce them together." },
      { question: "Do you make shelf-ready / display packaging?", answer: "Yes — stackable, display-friendly structures designed to perform on a retail shelf." },
      { question: "Minimum order?", answer: "Retail packaging is most cost-effective from 500 units, with better pricing at higher volumes." },
    ],
    cta: {
      label: "Get a retail packaging quote",
      whatsappText: "Hi Pack4U, I need custom retail packaging for my product range. Products: ___. Quantity: ___. Please share options and pricing.",
    },
    seo: {
      seoTitle: "Custom Retail Packaging Pakistan — Shelf-Ready Boxes",
      metaDescription:
        "Custom retail packaging in Pakistan — printed boxes, sleeves, labels and shelf-ready structures kept consistent across your range and produced at volume. Get a quote.",
      keywords: ["custom retail packaging Pakistan", "shelf ready packaging", "branded packaging Pakistan", "product packaging Pakistan"],
    },
  },
];
