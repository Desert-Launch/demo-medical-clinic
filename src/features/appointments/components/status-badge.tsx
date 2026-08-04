import { cn } from "@/lib/utils";
import { appointmentStatusLabels, type AppointmentStatus } from "@/types";

/** One colour per status, used identically in the table, the drawer and cards. */
const styles: Record<AppointmentStatus, string> = {
  scheduled: "bg-lapis-50 text-lapis-800 ring-lapis-200",
  confirmed: "bg-success-50 text-success-700 ring-success-100",
  completed: "bg-stone-100 text-stone-600 ring-stone-200",
  cancelled: "bg-danger-50 text-danger-700 ring-danger-100",
  "no-show": "bg-warning-50 text-warning-700 ring-warning-100",
};

export function StatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status],
        className,
      )}
    >
      {appointmentStatusLabels[status]}
    </span>
  );
}
