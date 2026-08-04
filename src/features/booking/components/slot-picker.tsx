"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format, isToday, parseISO } from "date-fns";
import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAvailability } from "@/features/doctors";
import { dateKey, parseDateKey } from "@/lib/scheduling";
import { cn } from "@/lib/utils";

const WINDOW_DAYS = 7;

/**
 * The clinic's slot picker: a week of day chips, then that day's free times.
 * Booked slots are rendered struck-through rather than hidden, so a full
 * morning reads as busy rather than as an error.
 */
export function SlotPicker({
  doctorId,
  durationMinutes,
  value,
  onChange,
  ignoreAppointmentId,
}: {
  doctorId: string;
  durationMinutes: number;
  value: string;
  onChange: (startsAt: string) => void;
  ignoreAppointmentId?: string;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const from = useMemo(
    () => dateKey(addDays(new Date(), weekOffset * WINDOW_DAYS)),
    [weekOffset],
  );

  const { data: days, isPending } = useAvailability(
    doctorId
      ? {
          doctorId,
          durationMinutes,
          from,
          days: WINDOW_DAYS,
          ignoreAppointmentId,
        }
      : null,
  );

  // Land on the first day that actually has something free.
  useEffect(() => {
    if (!days) return;
    const stillVisible = days.some((day) => day.date === selectedDate);
    if (stillVisible) return;
    const firstOpen = days.find((day) =>
      day.slots.some((slot) => slot.available),
    );
    setSelectedDate(firstOpen?.date ?? days[0]?.date ?? null);
  }, [days, selectedDate]);

  const activeDay = days?.find((day) => day.date === selectedDate);
  const hasAnythingThisWeek = days?.some((day) =>
    day.slots.some((slot) => slot.available),
  );

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <p className="text-sm font-medium text-stone-700">
          {days && days.length > 0
            ? `${format(parseDateKey(days[0].date), "d MMM")} – ${format(
                parseDateKey(days[days.length - 1].date),
                "d MMM yyyy",
              )}`
            : "Loading the diary…"}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous week"
            disabled={weekOffset === 0}
            onClick={() => setWeekOffset((offset) => Math.max(0, offset - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next week"
            disabled={weekOffset >= 5}
            onClick={() => setWeekOffset((offset) => offset + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {isPending || !days ? (
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: WINDOW_DAYS }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-28 rounded-md" />
        </div>
      ) : (
        <>
          <div
            role="group"
            aria-label="Choose a day"
            className="grid grid-cols-4 gap-2 border-b border-border p-4 sm:grid-cols-7"
          >
            {days.map((day) => {
              const date = parseDateKey(day.date);
              const free = day.slots.filter((slot) => slot.available).length;
              const active = day.date === selectedDate;
              return (
                <button
                  key={day.date}
                  type="button"
                  aria-pressed={active}
                  disabled={free === 0}
                  onClick={() => setSelectedDate(day.date)}
                  className={cn(
                    "flex flex-col items-center rounded-md border px-1 py-2.5 transition-colors",
                    active
                      ? "border-lapis-600 bg-lapis-700 text-stone-0"
                      : free === 0
                        ? "cursor-not-allowed border-transparent bg-stone-100 text-stone-400"
                        : "border-border bg-surface text-stone-700 hover:border-lapis-300 hover:bg-lapis-50",
                  )}
                >
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {format(date, "EEE")}
                  </span>
                  <span
                    data-numeric
                    className="mt-0.5 font-display text-lg font-semibold"
                  >
                    {format(date, "d")}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 text-[0.6875rem]",
                      active ? "text-lapis-100" : "text-stone-500",
                    )}
                  >
                    {free === 0 ? "Full" : `${free} free`}
                  </span>
                  {isToday(date) ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 size-1.5 rounded-full",
                        active ? "bg-saffron-300" : "bg-saffron-500",
                      )}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="p-4">
            {!hasAnythingThisWeek ? (
              <EmptyState
                icon={CalendarX}
                title="Nothing free this week"
                description="This doctor is fully booked. Try the following week, or go back and take the first available slot in the department."
                className="border-0 py-8"
                action={
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWeekOffset((offset) => offset + 1)}
                  >
                    Look at next week
                  </Button>
                }
              />
            ) : activeDay && activeDay.slots.length > 0 ? (
              <>
                <p className="mb-3 text-sm font-medium text-stone-700">
                  {format(parseDateKey(activeDay.date), "EEEE d MMMM")}
                </p>
                <div
                  role="group"
                  aria-label="Choose a time"
                  className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5"
                >
                  {activeDay.slots.map((slot) => {
                    const active = slot.startsAt === value;
                    return (
                      <button
                        key={slot.startsAt}
                        type="button"
                        aria-pressed={active}
                        disabled={!slot.available}
                        onClick={() => onChange(slot.startsAt)}
                        className={cn(
                          "rounded-md border px-2 py-2.5 text-sm font-medium tabular-nums transition-colors",
                          active
                            ? "border-lapis-600 bg-lapis-700 text-stone-0"
                            : slot.available
                              ? "border-border bg-surface text-stone-800 hover:border-lapis-400 hover:bg-lapis-50"
                              : "cursor-not-allowed border-transparent bg-stone-100 text-stone-400 line-through",
                        )}
                      >
                        {format(parseISO(slot.startsAt), "h:mm a")}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-sm text-stone-500">
                  Struck-through times are already taken. Each slot holds{" "}
                  {durationMinutes} minutes.
                </p>
              </>
            ) : (
              <p className="py-6 text-center text-sm text-stone-500">
                No clinic on this day. Pick another.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
