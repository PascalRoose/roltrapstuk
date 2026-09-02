import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "roltrapstuk 's-Hertogenbosch",
    template: "%s · roltrapstuk",
  },
  description:
    "Crowdsourced escalator and lift status for 's-Hertogenbosch station. Status comes only from travellers — tap the map to see the latest report and file your own.",
  applicationName: "roltrapstuk",
  openGraph: {
    type: "website",
    siteName: "roltrapstuk",
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#12161C" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D11" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Resolve theme + language before first paint so there's no flash. */
const PREHYDRATE = `
try {
  var s = JSON.parse(localStorage.getItem('roltrapstuk.settings') || '{}');
  var pref = s.theme || 'system';
  var dark = pref === 'dark' || (pref === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);
  var el = document.documentElement;
  el.dataset.theme = dark ? 'dark' : 'light';
  if (s.lang === 'en' || s.lang === 'nl') el.lang = s.lang;
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREHYDRATE }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
