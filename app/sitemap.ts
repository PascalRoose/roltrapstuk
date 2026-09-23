import type { MetadataRoute } from "next";
import { allStations } from "@/lib/stations";
import { SITE_URL } from "@/lib/site";
import { stationPath } from "@/lib/seo";

// No `lastModified`: the status changes with every report, so "now" would be
// a made-up signal. `changeFrequency`/`priority` are ignored by Google.
export default function sitemap(): MetadataRoute.Sitemap {
  return allStations().flatMap((s) => {
    const languages = {
      nl: `${SITE_URL}${stationPath(s.slug, "nl")}`,
      en: `${SITE_URL}${stationPath(s.slug, "en")}`,
    };
    return [
      { url: languages.nl, alternates: { languages } },
      { url: languages.en, alternates: { languages } },
    ];
  });
}
