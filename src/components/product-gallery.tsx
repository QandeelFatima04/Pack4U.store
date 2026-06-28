"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll-snap gallery. Shows every image of a product and lets the
 * user scroll/swipe left–right. Arrows + dots appear only when there are 2+ images.
 */
export function ProductGallery({
  images,
  alt,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  fit = "cover",
  className,
}: {
  images: string[];
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const valid = images.filter(Boolean);
  const multi = valid.length > 1;

  if (valid.length === 0) {
    return (
      <div className={cn("grid place-items-center rounded-2xl border bg-gradient-to-br from-secondary via-accent to-cream", aspect, className)}>
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand/60" fill="none" aria-hidden>
          <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M3 7.5 12 12l9-4.5M12 12v9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  function scrollToIndex(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(valid.length - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <div className={cn("group/gallery relative overflow-hidden rounded-2xl border bg-card", className)}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          aspect,
        )}
      >
        {valid.map((src, i) => (
          <div key={src} className="relative w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={`${alt} — image ${i + 1} of ${valid.length}`}
              fill
              priority={priority && i === 0}
              className={fit === "contain" ? "object-contain" : "object-cover"}
              sizes={sizes}
            />
          </div>
        ))}
      </div>

      {multi && (
        <>
          {/* Arrows — appear on hover (always visible on touch via opacity-100 below sm) */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => scrollToIndex(active - 1)}
            className={cn(
              "absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition hover:bg-background",
              "opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100 max-sm:opacity-100",
              active === 0 && "pointer-events-none opacity-0",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => scrollToIndex(active + 1)}
            className={cn(
              "absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition hover:bg-background",
              "opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100 max-sm:opacity-100",
              active === valid.length - 1 && "pointer-events-none opacity-0",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Count badge */}
          <span className="absolute right-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur">
            {active + 1}/{valid.length}
          </span>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {valid.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "h-1.5 rounded-full bg-background/70 transition-all",
                  i === active ? "w-4 bg-background" : "w-1.5",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
