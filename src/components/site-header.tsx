"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  industriesNav,
  packagingTypesNav,
  consultationNav,
  type NavLink,
} from "@/lib/nav";

const dropdowns: { label: string; href: string; links: NavLink[] }[] = [
  { label: "Industries", href: "/industries", links: industriesNav },
  { label: "Packaging Types", href: "/packaging-types", links: packagingTypesNav },
  { label: "Consultation", href: "/packaging-consultation", links: consultationNav },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("Industries");
  // Which desktop dropdown is currently open (null = none).
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  // Hover-intent: delay closing so a transient pointer excursion (or the
  // pointer move during a click on a menu item) doesn't hide the menu before
  // the click lands. Without this, clicking a dropdown link silently fails.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  }, []);

  // Clear any pending close timer on unmount.
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  // Off the homepage the header is always solid; only the homepage starts glassy.
  const [scrolled, setScrolled] = useState(!isHomepage);

  useEffect(() => {
    if (!isHomepage) return;
    const handler = () => setScrolled(window.scrollY > 80);
    // One-time sync in case the page loads already scrolled.
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isHomepage]);

  // Close the desktop dropdown on route change.
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  // Close the desktop dropdown on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const isGlass = isHomepage && !scrolled;
  const linkClass = isGlass
    ? "text-white/90 hover:text-white"
    : "text-foreground/80 hover:text-foreground";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isGlass
          ? "border-transparent bg-transparent"
          : "border-b border-border/60 bg-background/90 backdrop-blur"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo variant={isGlass ? "light" : "dark"} />

        <nav ref={navRef} className="hidden items-center gap-3.5 lg:flex">
          {dropdowns.map((d) => {
            const isOpen = openMenu === d.label;
            return (
              <div
                key={d.label}
                className="relative"
                onMouseEnter={() => openDropdown(d.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={() => (isOpen ? setOpenMenu(null) : openDropdown(d.label))}
                  className={`inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium transition ${linkClass}`}
                >
                  {d.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 transition ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  <div className="rounded-xl border bg-popover p-2 shadow-lg">
                    <Link
                      href={d.href}
                      onClick={() => setOpenMenu(null)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-brand transition hover:bg-muted"
                    >
                      All {d.label}
                    </Link>
                    {d.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpenMenu(null)}
                        className="block rounded-lg px-3 py-2 text-sm text-popover-foreground transition hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/portfolio" className={`text-sm font-medium transition ${linkClass}`}>
            Portfolio
          </Link>
          <Link href="/about" className={`text-sm font-medium transition ${linkClass}`}>
            About
          </Link>
          <Link href="/faq" className={`text-sm font-medium transition ${linkClass}`}>
            FAQ
          </Link>
          <Link href="/contact" className={`text-sm font-medium transition ${linkClass}`}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className={`hidden sm:inline-flex ${
              isGlass ? "border-white/40 bg-white/10 text-white hover:bg-white/20" : ""
            }`}
          >
            <Link href="/estimate">Estimate price</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className={`hidden sm:inline-flex ${
              isGlass ? "bg-white text-black hover:bg-white/90 border-0 shadow-none" : ""
            }`}
          >
            <Link href="/get-quote">Get a quote</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={`grid h-10 w-10 place-items-center rounded-full transition lg:hidden ${
                isGlass ? "text-white hover:bg-white/15" : "hover:bg-muted"
              }`}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-8">
                {/* Collapsible dropdown sections */}
                {dropdowns.map((d) => {
                  const isOpen = openSection === d.label;
                  return (
                    <div key={d.label} className="border-b border-border/60 last:border-b-0">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenSection(isOpen ? null : d.label)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                      >
                        {d.label}
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-0.5 pb-2 pl-3">
                            <Link
                              href={d.href}
                              onClick={() => setOpen(false)}
                              className="rounded-lg px-3 py-2 text-sm font-medium text-brand hover:bg-muted"
                            >
                              All {d.label}
                            </Link>
                            {d.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Link href="/portfolio" onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted">
                  Portfolio
                </Link>
                <Link href="/about" onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted">
                  About
                </Link>
                <Link href="/faq" onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted">
                  FAQ
                </Link>
                <Link href="/contact" onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-muted">
                  Contact
                </Link>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/estimate" onClick={() => setOpen(false)}>Estimate price</Link>
                </Button>
                <Button asChild className="mt-2">
                  <Link href="/get-quote" onClick={() => setOpen(false)}>Get a quote</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
