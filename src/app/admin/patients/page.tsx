import { AdminTopbar } from "@/components/layout/admin-topbar";
import { PatientsBoard } from "@/features/patients/components/patients-board";

export default function AdminPatientsPage() {
  return (
    <>
      <AdminTopbar title="Patients" />
      <div className="px-5 py-8 sm:px-8">
        <PatientsBoard />
      </div>
    </>
  );
}
