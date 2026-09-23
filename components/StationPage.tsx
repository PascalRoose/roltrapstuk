import { notFound } from "next/navigation";
import type { Lang } from "@/lib/types";
import { getStation } from "@/lib/stations";
import { readStationState } from "@/lib/stationState";
import { stationJsonLd } from "@/lib/seo";
import { StationView } from "./StationView";
import { StationInfo } from "./StationInfo";

/** A station's page in one language: the interactive app plus crawlable text. */
export async function StationPage({ slug, lang }: { slug: string; lang: Lang }) {
  const def = getStation(slug);
  if (!def) notFound();
  const state = await readStationState(slug);
  return (
    <>
      <StationView slug={slug} lang={lang} initialState={state ?? undefined} />
      <StationInfo station={def} lang={lang} state={state} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stationJsonLd(def, lang) }}
      />
    </>
  );
}
