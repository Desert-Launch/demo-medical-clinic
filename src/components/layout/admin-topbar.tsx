"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronDown, Menu } from "lucide-react";

import { AdminSidebarContent } from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  staffDirectory,
  useSessionStore,
} from "@/lib/state/session-store";
import { initials } from "@/lib/utils";

export function AdminTopbar({ title }: { title: string }) {
  const staff = useSessionStore((state) => state.staff);
  const setStaff = useSessionStore((state) => state.setStaff);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Client-only: the date depends on the viewer's clock.
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(format(new Date(), "EEEE d MMMM yyyy"));
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-stone-0/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open dashboard menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-0 p-0">
              <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
              <AdminSidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{title}</h1>
            <p className="truncate text-xs text-stone-500">
              {today ?? " "}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3 transition-colors hover:bg-stone-50"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-lapis-100 text-xs font-semibold text-lapis-800">
                {initials(staff.name.replace(/^Dr\.\s*/, ""))}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-medium text-stone-900">
                  {staff.name}
                </span>
                <span className="block text-xs text-stone-500">
                  {staff.role}
                </span>
              </span>
              <ChevronDown aria-hidden="true" className="size-4 text-stone-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {staffDirectory.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onSelect={() => setStaff(member.id)}
                className="flex-col items-start gap-0.5"
              >
                <span className="text-sm font-medium">{member.name}</span>
                <span className="text-xs text-stone-500">{member.role}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-stone-500">
              Demo only — there is no real sign-in.
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
