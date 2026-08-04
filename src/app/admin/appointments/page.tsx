import { AdminTopbar } from "@/components/layout/admin-topbar";
import { AppointmentsBoard } from "@/features/appointments/components/appointments-board";

export default function AdminAppointmentsPage() {
  return (
    <>
      <AdminTopbar title="Appointments" />
      <div className="px-5 py-8 sm:px-8">
        <AppointmentsBoard />
      </div>
    </>
  );
}
