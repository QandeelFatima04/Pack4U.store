export type NavLink = { label: string; href: string };

// Industry landing pages (blueprint §3 ICPs)
export const industriesNav: NavLink[] = [
  { label: "Cosmetics & Skincare", href: "/custom-cosmetic-packaging" },
  { label: "Food & Bakery", href: "/custom-food-packaging" },
  { label: "Fashion & Accessories", href: "/custom-fashion-packaging" },
  { label: "E-commerce & D2C", href: "/custom-ecommerce-packaging" },
  { label: "Gift Packaging", href: "/custom-gift-packaging" },
  { label: "Retail Packaging", href: "/custom-retail-packaging" },
];

// Packaging type pages (blueprint §4)
export const packagingTypesNav: NavLink[] = [
  { label: "Custom Boxes", href: "/custom-boxes" },
  { label: "Paper Bags", href: "/custom-paper-bags" },
  { label: "Tags & Labels", href: "/custom-tags-labels" },
  { label: "Sleeves & Belly Bands", href: "/custom-sleeves-belly-bands" },
  { label: "Inserts & Thank-You Cards", href: "/custom-inserts-thank-you-cards" },
  { label: "Gift Boxes", href: "/custom-gift-boxes" },
  { label: "Food Boxes", href: "/custom-food-boxes" },
];

// Packaging consultation pages (blueprint §4)
export const consultationNav: NavLink[] = [
  { label: "Packaging for Startups", href: "/packaging-for-startups" },
  { label: "Sustainable Packaging Upgrade", href: "/sustainable-packaging-upgrade" },
  { label: "Packaging Cost Optimization", href: "/packaging-cost-optimization" },
  { label: "Packaging Redesign", href: "/packaging-redesign" },
];

export const mainNav: NavLink[] = [
  { label: "Custom Packaging", href: "/custom-packaging" },
  { label: "Industries", href: "/industries" },
  { label: "Packaging Types", href: "/packaging-types" },
  { label: "Consultation", href: "/packaging-consultation" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Price Estimator", href: "/estimate" },
];

export const footerNav = {
  industries: industriesNav,
  packagingTypes: packagingTypesNav,
  consultation: [
    { label: "Packaging Consultation", href: "/packaging-consultation" },
    ...consultationNav,
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Price Estimator", href: "/estimate" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};
