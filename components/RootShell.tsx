import type { Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import type { Lang } from "@/lib/types";
import "@/app/globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const VIEWPORT: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#12161C" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D11" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Resolve the theme before first paint so there's no flash. */
const PREHYDRATE = `
try {
  var s = JSON.parse(localStorage.getItem('roltrapstuk.settings') || '{}');
  var pref = s.theme || 'system';
  var dark = pref === 'dark' || (pref === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
} catch (e) {}
`;

/**
 * The <html> shell shared by the per-language root layouts (`app/(nl)` and
 * `app/(en)/en`). The language is fixed per URL, so `lang` is right in the
 * server HTML that crawlers see.
 */
export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- this is a root layout shell, not a pages/ document */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREHYDRATE }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
