import type { Metadata } from "next";
import type { Lang, StationDef } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "roltrapstuk";

const OG_LOCALE: Record<Lang, string> = { nl: "nl_NL", en: "en_GB" };

/** Dutch is the default language and lives at the root; English under `/en`. */
export function stationPath(slug: string, lang: Lang): string {
  return lang === "nl" ? `/${slug}` : `/en/${slug}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === "nl" ? "en" : "nl";
}

/** Site-wide defaults for a language's root layout. */
export function rootMetadata(lang: Lang): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
    openGraph: { type: "website", siteName: SITE_NAME, locale: OG_LOCALE[lang] },
  };
}

export function stationMetadata(def: StationDef, lang: Lang): Metadata {
  const title = def.seo.title[lang];
  const description = def.seo.description[lang];
  const path = stationPath(def.slug, lang);
  return {
    // `absolute`: the title is already written for search results; no suffix.
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      languages: {
        nl: stationPath(def.slug, "nl"),
        en: stationPath(def.slug, "en"),
        "x-default": stationPath(def.slug, "nl"),
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[otherLang(lang)],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** schema.org description of the page, serialised safe for an inline <script>. */
export function stationJsonLd(def: StationDef, lang: Lang): string {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: `${SITE_URL}${stationPath(def.slug, lang)}`,
        description: def.seo.description[lang],
        inLanguage: lang,
        applicationCategory: "TravelApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
      },
      {
        "@type": "TrainStation",
        name: `Station ${def.name}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: def.name,
          addressCountry: "NL",
        },
      },
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
