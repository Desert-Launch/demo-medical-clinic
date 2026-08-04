"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useResetDemo } from "@/features/demo";

/** Discreet footer control for putting the demo back to a known state. */
export function ResetDemoButton() {
  const [open, setOpen] = useState(false);
  const reset = useResetDemo();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-lapis-300 transition-colors hover:bg-lapis-900 hover:text-stone-0"
      >
        <RotateCcw aria-hidden="true" className="size-3.5" />
        Reset demo data
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        tone="default"
        title="Reset the demo data?"
        description="Every appointment and patient goes back to the seeded set. Anything added during this session is discarded."
        confirmLabel="Reset data"
        cancelLabel="Leave it"
        pending={reset.isPending}
        onConfirm={() =>
          reset.mutate(undefined, { onSettled: () => setOpen(false) })
        }
      />
    </>
  );
}
