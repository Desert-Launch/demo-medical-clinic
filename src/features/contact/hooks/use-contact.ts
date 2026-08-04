"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { submitContactMessage } from "@/features/contact/api";
import type { ContactFormValues } from "@/features/contact/schema";

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (values: ContactFormValues) => submitContactMessage(values),
    onSuccess: (receipt) => {
      toast.success("Message received", {
        description: `Reference ${receipt.reference}. We reply within ${receipt.respondWithin}.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Message not sent", { description: error.message });
    },
  });
}
