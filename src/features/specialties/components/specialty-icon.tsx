import {
  Activity,
  Baby,
  Ear,
  HeartPulse,
  ScanFace,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import type { SpecialtyIcon } from "@/types";

/** The store holds an icon key; the UI layer owns the mapping to a component. */
const icons: Record<SpecialtyIcon, LucideIcon> = {
  stethoscope: Stethoscope,
  "scan-face": ScanFace,
  baby: Baby,
  "heart-pulse": HeartPulse,
  ear: Ear,
  activity: Activity,
};

export function specialtyIcon(key: SpecialtyIcon): LucideIcon {
  return icons[key] ?? Stethoscope;
}
