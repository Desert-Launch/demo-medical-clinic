"use client";

import { useMemo, useState } from "react";
import { CircleAlert, Search, UserRoundSearch } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorCard } from "@/features/doctors/components/doctor-card";
import { useDoctors } from "@/features/doctors";
import { useSpecialties } from "@/features/specialties";
import { spokenLanguages, type SpokenLanguage } from "@/types";

const ALL = "all";

export function DoctorDirectory({
  initialSpecialtySlug,
}: {
  initialSpecialtySlug?: string;
}) {
  const { data: specialties } = useSpecialties();
  const [specialtySlug, setSpecialtySlug] = useState(
    initialSpecialtySlug ?? ALL,
  );
  const [language, setLanguage] = useState<string>(ALL);
  const [search, setSearch] = useState("");

  const specialtyId = useMemo(() => {
    if (specialtySlug === ALL) return undefined;
    return specialties?.find((item) => item.slug === specialtySlug)?.id;
  }, [specialties, specialtySlug]);

  const { data: doctors, isPending, isError } = useDoctors({
    specialtyId,
    language: language === ALL ? undefined : (language as SpokenLanguage),
    search: search.trim() || undefined,
  });

  const specialtyById = useMemo(
    () => new Map((specialties ?? []).map((item) => [item.id, item])),
    [specialties],
  );

  const filtersApplied =
    specialtySlug !== ALL || language !== ALL || search.trim().length > 0;

  return (
    <div>
      <div className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-2">
          <Label htmlFor="doctor-search">Search by name</Label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400"
            />
            <Input
              id="doctor-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="e.g. Al Shamsi"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctor-specialty">Specialty</Label>
          <Select value={specialtySlug} onValueChange={setSpecialtySlug}>
            <SelectTrigger id="doctor-specialty" className="w-full">
              <SelectValue placeholder="Any specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any specialty</SelectItem>
              {specialties?.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.slug}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctor-language">Language spoken</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="doctor-language" className="w-full">
              <SelectValue placeholder="Any language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any language</SelectItem>
              {spokenLanguages.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        {isPending ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : isError || !doctors ? (
          <EmptyState
            icon={CircleAlert}
            title="The directory did not load"
            description="Refresh the page to try again."
          />
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={UserRoundSearch}
            title="No doctors match those filters"
            description="Widen the search — try any specialty, or drop the language filter."
            action={
              filtersApplied ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSpecialtySlug(ALL);
                    setLanguage(ALL);
                    setSearch("");
                  }}
                >
                  Clear filters
                </Button>
              ) : null
            }
          />
        ) : (
          <>
            <p className="mb-5 text-sm text-stone-500">
              {doctors.length} doctor{doctors.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  specialty={specialtyById.get(doctor.specialtyId)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
