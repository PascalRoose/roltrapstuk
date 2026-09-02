import { describe, expect, it } from "vitest";
import { aggregate, summarise, UNDO_WINDOW_MS } from "@/lib/aggregate";
import { denBosch as station } from "@/lib/stations/denbosch";
import type { RawReport } from "@/lib/types";

const T0 = Date.parse("2026-09-02T12:00:00.000Z");
const ago = (ms: number) => new Date(T0 - ms).toISOString();

function report(
  unitId: string,
  kind: "out" | "ok",
  ms: number,
  reporterId: string | null = null,
): RawReport {
  return { unitId, kind, at: ago(ms), reporterId };
}

describe("aggregate", () => {
  it("assumes every unit works when there are no reports", () => {
    const state = aggregate(station, [], { now: T0 });
    for (const unit of station.units) {
      expect(state.units[unit.id]).toEqual({
        status: "ok",
        last: null,
        streak: 0,
        total: 0,
        okAgain: false,
        canUndo: false,
      });
    }
    expect(state.slug).toBe(station.slug);
    expect(state.generatedAt).toBe(new Date(T0).toISOString());
  });

  it("takes the current status from the most recent report", () => {
    const state = aggregate(station, [report("E6", "out", 5000)], { now: T0 });
    expect(state.units.E6.status).toBe("out");
    expect(state.units.E6.last).toEqual({ kind: "out", at: ago(5000) });
    expect(state.units.E6.streak).toBe(1);
    expect(state.units.E6.total).toBe(1);
    expect(state.units.E6.okAgain).toBe(false);
  });

  it("orders unsorted input by timestamp", () => {
    const state = aggregate(
      station,
      [report("E6", "ok", 1000), report("E6", "out", 9000), report("E6", "out", 5000)],
      { now: T0 },
    );
    expect(state.units.E6.status).toBe("ok");
    expect(state.units.E6.total).toBe(3);
  });

  it("counts a streak only while reports agree with the current status", () => {
    const state = aggregate(
      station,
      [
        report("E6", "out", 9000),
        report("E6", "ok", 7000),
        report("E6", "ok", 5000),
        report("E6", "ok", 3000),
      ],
      { now: T0 },
    );
    expect(state.units.E6.status).toBe("ok");
    expect(state.units.E6.streak).toBe(3);
    expect(state.units.E6.okAgain).toBe(true);
  });

  it("okAgain is false once the unit is broken again", () => {
    const state = aggregate(
      station,
      [report("E6", "out", 9000), report("E6", "ok", 7000), report("E6", "out", 5000)],
      { now: T0 },
    );
    expect(state.units.E6.status).toBe("out");
    expect(state.units.E6.streak).toBe(1);
    expect(state.units.E6.okAgain).toBe(false);
  });

  it("ignores reports for units the station does not have", () => {
    const state = aggregate(station, [report("ZZ9", "out", 1000)], { now: T0 });
    expect(state.units.ZZ9).toBeUndefined();
    expect(summarise(state)).toEqual({ ok: station.units.length, out: 0 });
  });

  describe("canUndo", () => {
    it("is true for the caller's own fresh latest report", () => {
      const state = aggregate(station, [report("E6", "out", 60_000, "me")], {
        now: T0,
        reporterId: "me",
      });
      expect(state.units.E6.canUndo).toBe(true);
    });

    it("is false for someone else's report", () => {
      const state = aggregate(station, [report("E6", "out", 60_000, "someone")], {
        now: T0,
        reporterId: "me",
      });
      expect(state.units.E6.canUndo).toBe(false);
    });

    it("is false once the undo window has passed", () => {
      const state = aggregate(station, [report("E6", "out", UNDO_WINDOW_MS + 1000, "me")], {
        now: T0,
        reporterId: "me",
      });
      expect(state.units.E6.canUndo).toBe(false);
    });

    it("is false when the caller's report is not the latest", () => {
      const state = aggregate(
        station,
        [report("E6", "out", 60_000, "me"), report("E6", "ok", 30_000, "other")],
        { now: T0, reporterId: "me" },
      );
      expect(state.units.E6.canUndo).toBe(false);
    });

    it("is false without a reporterId", () => {
      const state = aggregate(station, [report("E6", "out", 1000, "me")], { now: T0 });
      expect(state.units.E6.canUndo).toBe(false);
    });
  });
});

describe("summarise", () => {
  it("counts broken vs working units", () => {
    const state = aggregate(
      station,
      [report("E6", "out", 1000), report("L4", "out", 1000), report("E1", "ok", 1000)],
      { now: T0 },
    );
    expect(summarise(state)).toEqual({ ok: station.units.length - 2, out: 2 });
  });
});
