"use client";

import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { CalendarClock } from "lucide-react";

import { useNextAvailableSlot } from "@/features/doctors";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** "Today, 4:30 pm" / "Tomorrow, 9:00 am" / "Tue 12 Aug, 9:00 am". */
export function formatSlotLabel(iso: string): string {
  const date = parseISO(iso);
  const time = format(date, "h:mm a");
  if (isToday(date)) return `Today, ${time}`;
  if (isTomorrow(date)) return `Tomorrow, ${time}`;
  return `${format(date, "EEE d MMM")}, ${time}`;
}

export function NextAvailable({
  doctorId,
  durationMinutes,
  className,
}: {
  doctorId: string;
  durationMinutes: number;
  className?: string;
}) {
  const { data, isPending } = useNextAvailableSlot(doctorId, durationMinutes);

  if (isPending) {
    return <Skeleton className={cn("h-5 w-40", className)} />;
  }

  return (
    <p
      className={cn(
        "flex items-center gap-2 text-sm",
        data ? "text-stone-700" : "text-stone-500",
        className,
      )}
    >
      <CalendarClock
        aria-hidden="true"
        className={cn("size-4", data ? "text-success-700" : "text-stone-400")}
      />
      {data ? (
        <span>
          Next free{" "}
          <span className="font-semibold">{formatSlotLabel(data.startsAt)}</span>
        </span>
      ) : (
        <span>Fully booked for the next four weeks</span>
      )}
    </p>
  );
}
