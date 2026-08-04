"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  // Rendered client-side only: opening hours depend on the visitor's clock, and
  // computing them during SSR produces a hydration mismatch.
  const [status, setStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const result = clinicStatusAt(now);
    setStatus(result.label);
    setIsOpen(result.open);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-stone-0/90 backdrop-blur-md">
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
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-lapis-50 text-lapis-800"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                {item.label}
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
  );
}
