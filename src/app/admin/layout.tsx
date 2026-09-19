import type { ReactNode } from "react";
import type { Metadata } from "next";

import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata: Metadata = {
  title: "Clinic dashboard",
  description: "Demo staff view for the Demo Medical Clinic.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-stone-50">
      <AdminSidebar />
      <main id="main" className="flex min-w-0 flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
