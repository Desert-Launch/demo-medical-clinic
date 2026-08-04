import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center">
        <PageContainer className="py-24">
          <p className="eyebrow text-lapis-600">Page not found</p>
          <h1 className="mt-4 max-w-2xl text-4xl sm:text-5xl">
            That page is not on the site
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
            The link may be out of date, or the department may have been
            renamed. The six current departments are all listed on the
            specialties page.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/specialties">See all specialties</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Back to the home page</Link>
            </Button>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
