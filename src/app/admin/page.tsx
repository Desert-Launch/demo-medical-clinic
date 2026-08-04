import { AdminTopbar } from "@/components/layout/admin-topbar";
import { OverviewDashboard } from "@/features/appointments/components/overview-dashboard";

export default function AdminOverviewPage() {
  return (
    <>
      <AdminTopbar title="Overview" />
      <div className="px-5 py-8 sm:px-8">
        <OverviewDashboard />
      </div>
    </>
  );
}
