"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Cookie,
  Shirt,
  ShoppingBag,
  Gift,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { IndustryPage } from "@/content/types";

const ease = [0.22, 1, 0.36, 1] as const;

// A distinct sign/icon per industry, shown on the colored badge.
const iconBySlug: Record<string, LucideIcon> = {
  "custom-cosmetic-packaging": Sparkles,
  "custom-food-packaging": Cookie,
  "custom-fashion-packaging": Shirt,
  "custom-ecommerce-packaging": ShoppingBag,
  "custom-gift-packaging": Gift,
  "custom-retail-packaging": Store,
};

export function IndustryTile({ industry }: { industry: IndustryPage }) {
  const Icon = iconBySlug[industry.slug] ?? Sparkles;
  const accent = industry.accent;

  return (
    <motion.div
      className="h-full"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      <Link
        href={`/${industry.slug}`}
        className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border bg-card p-7 text-center shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-black/5"
        style={{
          background: `radial-gradient(135% 90% at 50% 0%, ${accent}1a 0%, transparent 62%)`,
        }}
      >
        {/* soft colored glow behind the circle */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full opacity-35 blur-3xl transition-opacity duration-300 group-hover:opacity-60"
          style={{ backgroundColor: accent }}
        />

        {/* circular image + rotating color ring + sign badge */}
        <div className="relative h-28 w-28">
          {/* continuously rotating colorful ring */}
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${accent}, ${accent}00 45%, ${accent}00 55%, ${accent})`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />

          {/* image disc */}
          <motion.div
            className="absolute inset-[5px] overflow-hidden rounded-full border-4 border-card bg-secondary"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
            transition={{ duration: 0.4, ease }}
          >
            <Image
              src={industry.heroImage}
              alt={industry.label}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>

          {/* floating sign/icon badge */}
          <motion.span
            className="absolute -bottom-1 -right-1 grid h-11 w-11 place-items-center rounded-full text-white shadow-lg ring-4 ring-card"
            style={{ backgroundColor: accent }}
            variants={{
              rest: { y: 0, scale: 1, rotate: 0 },
              hover: { y: -3, scale: 1.15, rotate: -8 },
            }}
            transition={{ duration: 0.35, ease }}
          >
            <Icon className="h-5 w-5" />
          </motion.span>
        </div>

        <h3 className="mt-6 font-[family-name:var(--font-heading)] text-lg font-bold">
          {industry.label}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{industry.audience}</p>

        <span
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-all duration-300 group-hover:gap-2"
          style={{ color: accent }}
        >
          Explore <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}
