import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { DemoBar } from "@/components/layout/demo-bar";

import "./globals.css";

export const metadata: Metadata = {
  // Fictional business, invented contact details: never a search result.
  robots: { index: false, follow: false },
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased`}>
        <a
          href="#main"
          className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <DemoBar demo="Andalus Medical Center" slug="medical" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
