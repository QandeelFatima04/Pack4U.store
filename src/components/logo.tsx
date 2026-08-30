import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The wordmark lockup.
 *
 * `variant="light"` swaps in the reversed artwork for dark backgrounds, where the
 * default navy lockup would disappear. Nothing ships it right now — the header and
 * footer both sit on light surfaces — but it stays because a CSS colour override
 * can't recolour an image, so any dark placement has to opt in explicitly.
 */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Pack4U home"
    >
      {/* Sized for how it actually renders (h-8 ≈ 110px wide), not the file's
          720px. Passing the intrinsic width makes next/image build a srcset up
          to w=1920 — upscaling the source for a 32px-tall logo, which is pure
          waste and wedges the dev optimizer. 220×64 keeps the 3.44 aspect and
          leaves headroom for 2x screens. */}
      <Image
        src={variant === "light" ? "/images/logo-light.png" : "/images/logo.png"}
        alt="Pack4U"
        width={220}
        height={64}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}
