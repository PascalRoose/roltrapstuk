import { describe, expect, it } from "vitest";
import { strings } from "@/lib/strings";

describe("strings", () => {
  it("pluralises traveller counts per language", () => {
    expect(strings("en").travellers(1)).toBe("1 traveller reported this");
    expect(strings("en").travellers(4)).toBe("4 travellers reported this");
    expect(strings("nl").travellers(1)).toBe("1 reiziger meldde dit");
    expect(strings("nl").travellers(4)).toBe("4 reizigers meldden dit");
  });

  it("pluralises the records line", () => {
    expect(strings("en").records(1)).toBe("1 report on record");
    expect(strings("en").records(9)).toBe("9 reports on record");
    expect(strings("nl").records(1)).toBe("1 melding bekend");
  });

  it("falls back to English for an unknown language", () => {
    // @ts-expect-error — exercising the runtime guard
    expect(strings("de")).toBe(strings("en"));
  });

  it("keeps the two dictionaries in sync", () => {
    expect(Object.keys(strings("nl")).sort()).toEqual(Object.keys(strings("en")).sort());
  });
});
