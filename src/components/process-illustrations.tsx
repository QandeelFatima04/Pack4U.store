import type { SVGProps } from "react";

type IllustrationProps = SVGProps<SVGSVGElement>;

/** Step 1 — a spec sheet with a pencil, next to a product box. */
export function ShareRequirementIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="10" width="82" height="76" rx="8" fill="#FFE7D6" />
      <rect x="22" y="24" width="58" height="6" rx="3" fill="#FF7A30" />
      <rect x="22" y="38" width="46" height="5" rx="2.5" fill="#FFB88A" />
      <rect x="22" y="48" width="52" height="5" rx="2.5" fill="#FFB88A" />
      <rect x="22" y="58" width="38" height="5" rx="2.5" fill="#FFB88A" />
      <rect x="22" y="68" width="30" height="10" rx="3" fill="#FF7A30" />
      <g transform="translate(96,40) rotate(-8)">
        <rect x="0" y="0" width="46" height="46" rx="6" fill="#1E1B18" />
        <path d="M0 12 L23 0 L46 12 L23 24 Z" fill="#33302B" />
        <path d="M0 12 L23 24 L23 46 L0 34 Z" fill="#151311" />
        <path d="M46 12 L23 24 L23 46 L46 34 Z" fill="#22201D" />
      </g>
      <g transform="translate(112,14) rotate(18)">
        <rect x="0" y="0" width="34" height="8" rx="3" fill="#FF7A30" />
        <rect x="0" y="0" width="8" height="8" rx="3" fill="#1E1B18" />
      </g>
    </svg>
  );
}

/** Step 2 — stacked material swatches / paper layers with a sample chip. */
export function MaterialAdviceIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="14" y="46" width="88" height="34" rx="6" fill="#F2C79A" />
      <rect x="24" y="34" width="88" height="34" rx="6" fill="#FFB88A" />
      <rect x="34" y="20" width="88" height="34" rx="6" fill="#FF7A30" />
      <rect x="44" y="28" width="68" height="5" rx="2.5" fill="#FFE7D6" />
      <rect x="44" y="38" width="52" height="5" rx="2.5" fill="#FFE7D6" opacity="0.8" />
      <circle cx="128" cy="70" r="18" fill="#1E1B18" />
      <path d="M120 70 l6 6 12 -14" stroke="#FFE7D6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Step 3 — a packaging box prototype with finishing/spec checkmarks. */
export function FinalizeSpecsIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(18,18)">
        <path d="M0 16 L34 0 L68 16 L34 32 Z" fill="#FFB88A" />
        <path d="M0 16 L34 32 L34 68 L0 52 Z" fill="#FF7A30" />
        <path d="M68 16 L34 32 L34 68 L68 52 Z" fill="#F2874A" />
        <rect x="14" y="30" width="20" height="8" rx="2" fill="#FFE7D6" opacity="0.85" />
      </g>
      <g transform="translate(104,14)">
        <circle cx="20" cy="20" r="20" fill="#1E1B18" />
        <path d="M11 21 l6 6 13 -15" stroke="#FF7A30" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <g transform="translate(96,58)">
        <rect x="0" y="0" width="52" height="10" rx="5" fill="#FFE7D6" />
        <rect x="0" y="16" width="36" height="10" rx="5" fill="#FFE7D6" />
      </g>
    </svg>
  );
}

/** Step 4 — a delivery truck carrying a finished box, in motion. */
export function ProductionDeliveryIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="38" width="60" height="34" rx="6" fill="#1E1B18" />
      <path d="M70 46 h20 l14 14 v12 h-34 z" fill="#FF7A30" />
      <rect x="24" y="46" width="24" height="18" rx="3" fill="#FFB88A" />
      <circle cx="34" cy="78" r="9" fill="#33302B" />
      <circle cx="34" cy="78" r="3.5" fill="#FFE7D6" />
      <circle cx="94" cy="78" r="9" fill="#33302B" />
      <circle cx="94" cy="78" r="3.5" fill="#FFE7D6" />
      <path d="M6 30 h20 M2 40 h16 M6 20 h14" stroke="#FFB88A" strokeWidth="4" strokeLinecap="round" />
      <path d="M108 30 h22 M132 40 h18" stroke="#FFE7D6" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
