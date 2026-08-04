"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetDemoData } from "@/features/demo/api";

export function useResetDemo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetDemoData,
    onSuccess: () => {
      // Everything downstream of the store is now wrong, so drop the lot.
      void queryClient.invalidateQueries();
      toast.success("Demo data reset", {
        description: "Every appointment and patient is back to its seeded state.",
      });
    },
    onError: (error: Error) => {
      toast.error("Reset failed", { description: error.message });
    },
  });
}
