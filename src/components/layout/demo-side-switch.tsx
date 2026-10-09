"use client";

/**
 * The demo bar's switch between the two sides of the demo: on the public site
 * it opens the dashboard, on the dashboard it goes back to the site. It is
 * the only route a visitor needs from the one link on desertlaunch.dev to the
 * staff side, so it is the one filled control in the bar.
 *
 * A client `Link`, so the move keeps the query cache and the store warm.
 * Identical in every demo.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const COPY = {
  en: { admin: "Open the dashboard", adminShort: "Dashboard", site: "Back to the site", siteShort: "Site" },
  ar: { admin: "افتح لوحة التحكم", adminShort: "لوحة التحكم", site: "العودة إلى الموقع", siteShort: "الموقع" },
} as const;

export function DemoSideSwitch({ lang, adminPath }: { lang: "en" | "ar"; adminPath: string }) {
  const pathname = usePathname() ?? "/";
  const onAdmin = pathname === adminPath || pathname.startsWith(`${adminPath}/`);
  const c = COPY[lang];

  return (
    <Link
      href={onAdmin ? "/" : adminPath}
      className="ms-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f5c542] px-3 py-1 font-semibold text-[#0b0f19] hover:bg-[#f8d66e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c542]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-3.5"
      >
        {onAdmin ? (
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        ) : (
          <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" />
        )}
      </svg>
      <span className="sm:hidden">{onAdmin ? c.siteShort : c.adminShort}</span>
      <span className="hidden sm:inline">{onAdmin ? c.site : c.admin}</span>
    </Link>
  );
}
