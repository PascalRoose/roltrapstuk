import { describe, expect, it } from "vitest";
import { allStations } from "@/lib/stations";
import { stationJsonLd, stationMetadata, stationPath } from "@/lib/seo";

describe("stationPath", () => {
  it("serves Dutch at the root and English under /en", () => {
    expect(stationPath("denbosch", "nl")).toBe("/denbosch");
    expect(stationPath("denbosch", "en")).toBe("/en/denbosch");
  });
});

describe.each(allStations())("stationMetadata: $slug", (def) => {
  it.each(["nl", "en"] as const)("has a canonical, hreflang trio and short title (%s)", (lang) => {
    const m = stationMetadata(def, lang);
    expect(m.alternates?.canonical).toBe(stationPath(def.slug, lang));
    expect(m.alternates?.languages).toEqual({
      nl: `/${def.slug}`,
      en: `/en/${def.slug}`,
      "x-default": `/${def.slug}`,
    });
    expect(def.seo.title[lang].length).toBeLessThanOrEqual(60);
    expect(def.seo.description[lang].length).toBeLessThanOrEqual(170);
  });
});

describe("stationJsonLd", () => {
  it("is valid JSON and cannot close the surrounding script tag", () => {
    const [def] = allStations();
    const raw = stationJsonLd(def, "nl");
    expect(raw).not.toContain("<");
    expect(JSON.parse(raw)["@graph"]).toHaveLength(2);
  });
});
