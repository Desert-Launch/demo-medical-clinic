"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh items-center bg-stone-50">
      <PageContainer className="py-24">
        <p className="eyebrow text-danger-700">Something broke</p>
        <h1 className="mt-4 max-w-2xl text-4xl">
          This page stopped part way through loading
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
          Nothing you entered was sent anywhere. Try again — and if it keeps
          happening, refresh the page to reset the demo data.
        </p>
        {error.message ? (
          <p className="mt-5 max-w-xl rounded-lg border border-border bg-surface p-4 font-mono text-sm text-stone-600">
            {error.message}
          </p>
        ) : null}
        <div className="mt-9">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}
