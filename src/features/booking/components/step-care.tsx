"use client";

import { Check, Clock } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { specialtyIcon } from "@/features/specialties/components/specialty-icon";
import { useSpecialties } from "@/features/specialties";
import { cn, formatAED } from "@/lib/utils";
import type { Specialty } from "@/types";

/**
 * Step one, and the signature moment: the department courtyard. Choosing a tile
 * opens the appointment types underneath it rather than pushing another screen.
 */
export function StepCare({
  specialtyId,
  serviceId,
  onSelectSpecialty,
  onSelectService,
}: {
  specialtyId: string;
  serviceId: string;
  onSelectSpecialty: (specialty: Specialty) => void;
  onSelectService: (serviceId: string) => void;
}) {
  const { data: specialties, isPending } = useSpecialties();
  const selected = specialties?.find((item) => item.id === specialtyId);

  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="text-xl font-semibold">
          Which department do you need?
        </legend>
        <p className="mt-2 text-stone-600">
          Not sure? Choose family medicine — they see you first and refer you on
          the same day if it belongs elsewhere.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[6.5rem] rounded-xl" />
              ))
            : specialties?.map((specialty) => {
                const Icon = specialtyIcon(specialty.icon);
                const active = specialty.id === specialtyId;
                return (
                  <button
                    key={specialty.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelectSpecialty(specialty)}
                    className={cn(
                      "group flex h-full flex-col items-start rounded-xl border p-4 text-left transition-all",
                      active
                        ? "border-lapis-600 bg-lapis-50 ring-1 ring-lapis-600"
                        : "border-border bg-surface hover:border-lapis-300 hover:bg-stone-25",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full transition-colors",
                        active
                          ? "bg-lapis-700 text-stone-0"
                          : "bg-lapis-50 text-lapis-700 group-hover:bg-lapis-100",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-4.5" />
                    </span>
                    <span className="mt-3 font-semibold text-stone-900">
                      {specialty.name}
                    </span>
                    <span className="mt-1 text-sm leading-snug text-stone-600">
                      {specialty.summary}
                    </span>
                  </button>
                );
              })}
        </div>
      </fieldset>

      {selected ? (
        <fieldset>
          <legend className="text-xl font-semibold">
            What kind of appointment?
          </legend>
          <p className="mt-2 text-stone-600">
            The time we hold for you depends on this, so pick the closest match.
          </p>

          <ul className="mt-6 space-y-3">
            {selected.services.map((service) => {
              const active = service.id === serviceId;
              return (
                <li key={service.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelectService(service.id)}
                    className={cn(
                      "flex w-full flex-wrap items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all",
                      active
                        ? "border-lapis-600 bg-lapis-50 ring-1 ring-lapis-600"
                        : "border-border bg-surface hover:border-lapis-300",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">
                          {service.name}
                        </span>
                        {active ? (
                          <Check
                            aria-hidden="true"
                            className="size-4 text-lapis-700"
                          />
                        ) : null}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-stone-600">
                        {service.summary}
                      </span>
                      <span className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
                        <Clock aria-hidden="true" className="size-3.5" />
                        {service.durationMinutes} minutes
                      </span>
                    </span>
                    <span className="text-right">
                      <span
                        data-numeric
                        className="block font-display text-lg font-semibold text-stone-900"
                      >
                        {formatAED(service.priceAED)}
                      </span>
                      {service.priceNote ? (
                        <span className="block text-xs text-stone-500">
                          {service.priceNote}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : null}
    </div>
  );
}
