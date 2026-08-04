import {
  IBM_Plex_Mono,
  Noto_Kufi_Arabic,
  Nunito_Sans,
  Outfit,
} from "next/font/google";

/**
 * The pairing: Outfit is geometric and architectural — it carries the arch and
 * the tile grid. Nunito Sans is humanist and soft-cornered, which keeps long
 * patient-facing copy reassuring rather than clinical. Plex Mono is reserved
 * for references, times and IDs. Kufi Arabic sets the bilingual wordmark.
 */

export const displayFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const bodyFont = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const monoFont = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const arabicFont = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  subsets: ["arabic"],
  weight: ["400", "600"],
  display: "swap",
});

export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
  arabicFont.variable,
].join(" ");
