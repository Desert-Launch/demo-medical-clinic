"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { transitions } from "@/lib/motion";

/**
 * The small-screen booking bar.
 *
 * On desktop the header carries a permanent "Book appointment"; below the `sm`
 * breakpoint it is dropped for room, which would otherwise leave a patient
 * three scrolls from the only thing they came to do. This puts the two actions
 * a clinic is actually called about — book, or phone the desk — inside thumb
 * reach for the whole page.
 *
 * It stays out of the way until the hero has gone past, and never appears on
 * the booking flow itself, where it would compete with the wizard's own
 * controls.
 */

const REVEAL_AFTER_PX = 420;

export function BookBar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setPast(window.scrollY > REVEAL_AFTER_PX);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const onBookingFlow = pathname.startsWith("/book");
  const visible = past && !onBookingFlow;

  return (
    <>
      {/* Reserves the height the bar occupies so it never sits on top of the
          last line of the footer. */}
      <div aria-hidden="true" className="h-20 sm:hidden" />

      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: "100%", opacity: 0 }}
            transition={transitions.panel}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border pad-safe-bottom bg-stone-0/95 backdrop-blur-md sm:hidden"
          >
            <div className="flex items-center gap-3 px-5 py-3">
              <Button asChild size="lg" className="h-12 flex-1">
                <Link href="/book">
                  <CalendarPlus aria-hidden="true" className="size-4" />
                  Book appointment
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="size-12 shrink-0 p-0"
              >
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  aria-label={`Call the clinic on ${site.phone}`}
                >
                  <Phone aria-hidden="true" className="size-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
