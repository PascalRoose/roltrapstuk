import { describe, expect, it } from "vitest";
import { relativeTime } from "@/lib/relativeTime";

const NOW = Date.parse("2026-09-02T12:00:00.000Z");
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("relativeTime", () => {
  it("says 'just now' under a minute", () => {
    expect(relativeTime(ago(30_000), "en", NOW)).toBe("Just now");
    expect(relativeTime(ago(30_000), "nl", NOW)).toBe("Zojuist");
  });

  it("counts minutes under an hour", () => {
    expect(relativeTime(ago(5 * MIN), "en", NOW)).toBe("5 min ago");
    expect(relativeTime(ago(5 * MIN), "nl", NOW)).toBe("5 min geleden");
  });

  it("shows a clock time earlier the same day", () => {
    // 12:00Z − 3h = 09:00Z; formatted in the runner's local zone
    const expected = new Date(NOW - 3 * HOUR);
    const hh = String(expected.getHours()).padStart(2, "0");
    const mm = String(expected.getMinutes()).padStart(2, "0");
    expect(relativeTime(ago(3 * HOUR), "en", NOW)).toBe(`${hh}:${mm}`);
  });

  it("says 'yesterday' one calendar day back", () => {
    expect(relativeTime(ago(DAY), "en", NOW)).toBe("Yesterday");
    expect(relativeTime(ago(DAY), "nl", NOW)).toBe("Gisteren");
  });

  it("counts days further back", () => {
    expect(relativeTime(ago(3 * DAY), "en", NOW)).toBe("3 days ago");
    expect(relativeTime(ago(3 * DAY), "nl", NOW)).toBe("3 dagen geleden");
  });

  it("returns a dash for an unparseable timestamp", () => {
    expect(relativeTime("not-a-date", "en", NOW)).toBe("—");
  });
});
