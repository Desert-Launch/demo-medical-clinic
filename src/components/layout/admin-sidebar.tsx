"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

import { KhatimMark } from "@/components/layout/logo";
import { ResetDemoButton } from "@/features/demo/components/reset-demo-button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  {
    href: "/admin/appointments",
    label: "Appointments",
    icon: CalendarCheck,
    exact: false,
  },
  { href: "/admin/patients", label: "Patients", icon: UsersRound, exact: false },
];

export function AdminSidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-lapis-950 text-lapis-100">
      <div className="flex items-center gap-3 border-b border-lapis-900/70 px-5 py-5">
        <span className="text-saffron-300">
          <KhatimMark className="size-7" />
        </span>
        <div className="leading-none">
          <p className="font-display text-sm font-semibold text-stone-0">
            {site.shortName}
          </p>
          <p className="mt-1 text-xs text-lapis-300">Clinic dashboard</p>
        </div>
      </div>

      <nav aria-label="Dashboard" className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-lapis-800 text-stone-0"
                  : "text-lapis-200 hover:bg-lapis-900 hover:text-stone-0",
              )}
            >
              <item.icon aria-hidden="true" className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-lapis-900/70 p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-lapis-300 transition-colors hover:bg-lapis-900 hover:text-stone-0"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to the public site
        </Link>
        <div className="px-1">
          <ResetDemoButton />
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="fixed inset-y-0 left-0 w-64">
        <AdminSidebarContent />
      </div>
    </aside>
  );
}
