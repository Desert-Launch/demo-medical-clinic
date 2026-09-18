"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  CircleAlert,
  UserPlus,
  Wallet,
} from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentChart } from "@/features/appointments/components/department-chart";
import { ScheduleList } from "@/features/appointments/components/schedule-list";
import { useClinicOverview } from "@/features/appointments";
import { useSessionStore } from "@/lib/state/session-store";
import { formatAED, formatPercent } from "@/lib/utils";

export function OverviewDashboard() {
  const { data, isPending, isError } = useClinicOverview();
  const staff = useSessionStore((state) => state.staff);

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={CircleAlert}
        title="The dashboard did not load"
        description="Refresh the page to try again."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl">
          Good to see you, {staff.name.replace(/^Dr\.\s*/, "")}.
        </h2>
        <p className="mt-1.5 text-stone-600">
          {data.todayRemaining > 0
            ? `${data.todayRemaining} appointment${data.todayRemaining === 1 ? "" : "s"} still to come today.`
            : "Nothing left on today’s list."}
        </p>
      </div>

      <RevealGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RevealItem className="h-full">
          <StatCard
            label="Today’s appointments"
            value={String(data.todayCount)}
            detail={`${data.todayRemaining} still to come`}
            icon={CalendarCheck}
            tone="brand"
            className="h-full"
          />
        </RevealItem>
        <RevealItem className="h-full">
          <StatCard
            label="Upcoming"
            value={String(data.upcomingCount)}
            detail="Scheduled or confirmed"
            icon={CalendarClock}
            className="h-full"
          />
        </RevealItem>
        <RevealItem className="h-full">
          <StatCard
            label="No-show rate"
            value={formatPercent(data.noShowRate)}
            detail="Last 30 days"
            icon={CircleAlert}
            tone={data.noShowRate > 10 ? "warning" : "default"}
            className="h-full"
          />
        </RevealItem>
        <RevealItem className="h-full">
          <StatCard
            label="Billed this month"
            value={formatAED(data.monthRevenueAED)}
            detail={`${data.monthCompleted} completed visits`}
            icon={Wallet}
            className="h-full"
          />
        </RevealItem>
      </RevealGroup>

      <Reveal className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h3 className="text-lg">Appointments by department</h3>
              <p className="mt-1 text-sm text-stone-500">
                Booked so far this month, across all statuses that hold a slot.
              </p>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-stone-500">
              <UserPlus aria-hidden="true" className="size-4" />
              {data.newPatientsThisMonth} new patient
              {data.newPatientsThisMonth === 1 ? "" : "s"}
            </p>
          </div>
          <div className="mt-6">
            <DepartmentChart data={data.departmentLoad} />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg">Today’s schedule</h3>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/appointments">Open the diary</Link>
            </Button>
          </div>
          <div className="mt-2 max-h-[22rem] overflow-y-auto">
            <ScheduleList
              appointments={data.todaySchedule}
              emptyTitle="No clinics today"
              emptyDescription="Nothing is booked for today. The next appointments are listed below."
            />
          </div>
        </section>
      </Reveal>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h3 className="text-lg">Next up</h3>
        <p className="mt-1 text-sm text-stone-500">
          The six soonest appointments still holding a slot.
        </p>
        <div className="mt-2">
          <ScheduleList
            appointments={data.nextUp}
            showDate
            emptyTitle="Nothing booked ahead"
            emptyDescription="Once patients book, their appointments appear here."
          />
        </div>
      </section>
    </div>
  );
}
