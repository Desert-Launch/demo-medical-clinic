"use client";

import { CircleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SpecialtyCard } from "@/features/specialties/components/specialty-card";
import { useSpecialties } from "@/features/specialties";

export function SpecialtyGrid({ limit }: { limit?: number }) {
  const { data, isPending, isError } = useSpecialties();

  if (isPending) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: limit ?? 6 }).map((_, index) => (
          <Skeleton key={index} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={CircleAlert}
        title="Departments did not load"
        description="Refresh the page to try again. Nothing you entered has been lost."
      />
    );
  }

  const specialties = limit ? data.slice(0, limit) : data;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {specialties.map((specialty) => (
        <SpecialtyCard key={specialty.id} specialty={specialty} />
      ))}
    </div>
  );
}
