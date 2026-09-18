import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { DemoBar } from "@/components/layout/demo-bar";
import { demoJsonLd, demoMetadata } from "@/lib/desert-launch";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  // Share preview, robots, canonical host and the link back to the studio.
  ...demoMetadata(),
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
        <DemoBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(demoJsonLd()) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
