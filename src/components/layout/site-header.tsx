"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Menu, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { clinicStatusAt } from "@/lib/scheduling";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/specialties", label: "Specialties" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Rendered client-side only: opening hours depend on the visitor's clock, and
  // computing them during SSR produces a hydration mismatch.
  const [status, setStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const now = new Date();
    const result = clinicStatusAt(now);
    setStatus(result.label);
    setIsOpen(result.open);
  }, []);

  // The bar only needs to know "am I against the top of the window or not".
  // Reading it inside a rAF keeps the listener off the scroll critical path.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setStuck(window.scrollY > 8);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* The hours-and-phone bar scrolls away instead of collapsing. Sitting
          outside the sticky element means it costs no layout animation and the
          page never jumps when it goes. */}
      <div className="hidden border-b border-lapis-900/40 bg-lapis-950 text-stone-0 md:block">
        <PageContainer className="flex h-9 items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-lapis-100">
            <Clock aria-hidden="true" className="size-3.5" />
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                isOpen ? "text-stone-0" : "text-lapis-200",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  isOpen ? "bg-success-500" : "bg-saffron-400",
                )}
              />
              {status ?? "Checking today’s hours…"}
            </span>
          </span>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-lapis-100 transition-colors hover:text-stone-0"
          >
            <Phone aria-hidden="true" className="size-3.5" />
            {site.phone}
          </a>
        </PageContainer>
      </div>

      <header
        data-stuck={stuck || undefined}
        className={cn(
          "header-shell sticky top-0 z-40 border-b bg-stone-0/90 backdrop-blur-md",
          stuck
            ? "border-transparent shadow-md"
            : "border-border shadow-none",
        )}
      >
        <PageContainer className="flex h-[--header-height] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-lapis-800"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                  )}
                >
                  {/* The active marker is one element that travels between
                      links rather than four that switch on and off, so moving
                      between sections reads as continuous. */}
                  {active ? (
                    reduceMotion ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-lapis-50"
                      />
                    ) : (
                      <motion.span
                        aria-hidden="true"
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-md bg-lapis-50"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 38,
                        }}
                      />
                    )
                  ) : null}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="lg" className="hidden sm:inline-flex">
              <Link href="/book">Book appointment</Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(20rem,88vw)] p-0">
                <SheetHeader className="border-b border-border px-5 py-4">
                  <SheetTitle className="text-left text-base">Menu</SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile" className="flex flex-col p-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-3 text-base font-medium text-stone-700 transition-colors hover:bg-stone-100"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-stone-500 transition-colors hover:bg-stone-100"
                  >
                    Clinic dashboard
                  </Link>
                </nav>
                <div className="px-5 pb-6">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/book" onClick={() => setMobileOpen(false)}>
                      Book appointment
                    </Link>
                  </Button>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="mt-4 flex items-center gap-2 text-sm text-stone-600"
                  >
                    <Phone aria-hidden="true" className="size-4" />
                    {site.phone}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </PageContainer>
      </header>
    </>
  );
}
