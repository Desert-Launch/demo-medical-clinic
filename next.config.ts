import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is a sales demo — the dev overlay badge sits on top of the admin
  // sidebar and has no place in a walkthrough.
  devIndicators: false,
  // The demo sits beside sibling lockfiles, so pin the workspace root instead
  // of letting Turbopack infer it.
  turbopack: {
    root: import.meta.dirname,
  },
  // Placeholder photography only — see src/lib/images.ts, which is the single
  // place these hosts are referenced. Both go when real assets land.
  images: {
    remotePatterns: [
      // Portrait avatars for the doctor directory.
      { protocol: "https", hostname: "xsgames.co", pathname: "/randomusers/**" },
      // Hand-checked CC-licensed clinic scenes.
      { protocol: "https", hostname: "live.staticflickr.com" },
      { protocol: "https", hostname: "images.rawpixel.com" },
    ],
  },
};

export default nextConfig;
