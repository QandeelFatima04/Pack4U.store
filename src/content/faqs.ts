import type { Faq } from "./types";

export const faqCategories = [
  "Products",
  "Printing & Finishing",
  "Pricing & MOQ",
  "Ordering",
  "Delivery",
  "Company",
] as const;

export const faqs: Faq[] = [
  // ── Products ──
  {
    category: "Products",
    question: "What types of packaging do you make?",
    answer:
      "Custom boxes, paper bags, tags and labels, sleeves and belly bands, inserts and thank-you cards, gift boxes and food boxes — for cosmetics, food, fashion, retail, gift and e-commerce brands.",
  },
  {
    category: "Products",
    question: "Can you make packaging in my exact size?",
    answer:
      "Yes. Custom packaging is built around your product's dimensions. Share the size or send a sample and we build the die line to fit it snugly.",
  },
  {
    category: "Products",
    question: "Can you produce a full matching packaging set?",
    answer:
      "Yes — box, bag, tag, label, insert and sleeve kept consistent in stock, colour and finish so everything looks like one brand. We call this a Brand Packaging Set.",
  },
  {
    category: "Products",
    question: "I don't know what packaging I need — can you help?",
    answer:
      "That's what our packaging consultation is for. We help you choose the right structure, material, size and finish before you order. Start with Packaging for Startups.",
  },
  // ── Printing & Finishing ──
  {
    category: "Printing & Finishing",
    question: "What customization options are available?",
    answer:
      "Full-colour printing, matte/gloss lamination, foil stamping, embossing/debossing, window cut-outs, custom die-cut shapes, spot UV, and inserts. Not every finish suits every product — we advise what's worth it.",
  },
  {
    category: "Printing & Finishing",
    question: "Do I need print-ready artwork?",
    answer:
      "It helps, but it's not required to start. If you don't have artwork, we guide you on what's needed or work alongside your designer.",
  },
  {
    category: "Printing & Finishing",
    question: "Can you match my brand colours exactly?",
    answer:
      "Yes. Share your brand colours (Pantone or values) and we match them in print, then confirm on a sample before bulk.",
  },
  // ── Pricing & MOQ ──
  {
    category: "Pricing & MOQ",
    question: "What is your minimum order quantity (MOQ)?",
    answer:
      "It depends on the product. Boxes, bags, inserts and rigid gift boxes start at 500 units; corrugated mailers and food boxes at 1,000–2,000; tags, labels and sleeves at 5,000. The estimator shows the exact minimum once you pick your industry, product and size.",
  },
  {
    category: "Pricing & MOQ",
    question: "How is packaging priced?",
    answer:
      "Price depends on packaging type, size, material, finishes and quantity — higher quantities lower the per-unit cost. Use our price estimator for an instant range, then request an exact quote.",
  },
  {
    category: "Pricing & MOQ",
    question: "Can I get an estimate before committing?",
    answer:
      "Yes. The price estimator gives an instant ballpark from your type, size, finishes and quantity. For an exact figure, send your details through the quote form and we'll confirm.",
  },
  // ── Ordering ──
  {
    category: "Ordering",
    question: "How does the process work?",
    answer:
      "Share your product and requirement → we recommend structure and material → we finalize size, artwork, printing and finish → we produce and deliver. You approve a sample before any bulk production.",
  },
  {
    category: "Ordering",
    question: "Do you make a sample before bulk?",
    answer:
      "Yes — we don't run bulk production until you approve a sample of the agreed specification.",
  },
  {
    category: "Ordering",
    question: "How do I start?",
    answer:
      "Request a quote with your product, quantity and packaging goal, or message us on WhatsApp. If you're unsure, book a packaging consultation first.",
  },
  // ── Delivery ──
  {
    category: "Delivery",
    question: "What are your lead times?",
    answer:
      "Most orders are produced in 7–15 working days after artwork and sample approval. Rigid/premium and large orders can take a little longer — we confirm a timeline before you commit.",
  },
  {
    category: "Delivery",
    question: "Do you deliver across Pakistan?",
    answer: "Yes — we deliver nationwide across Pakistan and confirm delivery timing with your quote.",
  },
  // ── Company ──
  {
    category: "Company",
    question: "Who do you work with?",
    answer:
      "Product-based businesses — startups, SMEs and established brands in cosmetics, food, fashion, retail, gift and e-commerce that need custom packaging or packaging development.",
  },
  {
    category: "Company",
    question: "Can you handle both design and production?",
    answer:
      "Yes — we're a single vendor for packaging development, printing, finishing and bulk delivery, so you don't have to coordinate multiple suppliers.",
  },
];
