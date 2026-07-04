"use client";

import { motion, type Variants, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

// Shared easing used throughout the site
const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

// Fade + slide up when element enters viewport
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0.2 : 0.65, ease, delay: reduce ? 0 : delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger wrapper — children get fadeUpVariants
export function StaggerIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Reduced-motion variant of fadeUpVariants: fade only, no vertical slide.
const fadeOnlyVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease } },
};

// Each direct child of StaggerIn should be wrapped in this
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={reduce ? fadeOnlyVariants : fadeUpVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Word-by-word text reveal (hero headline)
export function AnimatedHeadline({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : delay },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: reduce ? 0.2 : 0.55, ease },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Line-by-line reveal (used for sub-text)
export function AnimatedLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: reduce ? 0.2 : 0.6, ease, delay: reduce ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax wrapper: wraps an image container and applies y-translation on scroll
export function ParallaxSection({
  children,
  speed = 0.25,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        style={reduce ? undefined : { y }}
        className="absolute inset-0 will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Pulsing "NEW" badge
export function PulseBadge({ label = "NEW" }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="inline-flex items-center rounded-full bg-brand px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-white"
      animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
      transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {label}
    </motion.span>
  );
}

// Scale-up card on hover
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
