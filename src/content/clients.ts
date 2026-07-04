import type { ClientLogo } from "./types";

// Real client / brand logos for the trust strip. Keep this list REAL.
// The <Testimonials /> section hides the logo strip while this array is empty.
//
// To add one, drop the logo file in /public/images/clients and append:
//   { name: "Aurora Skincare", logo: "/images/clients/aurora.svg", url: "https://aurora.example" },
export const clients: ClientLogo[] = [];
