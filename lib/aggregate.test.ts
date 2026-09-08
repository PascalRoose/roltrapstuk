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
        canUndo: false,
      });
    }
    expect(state.slug).toBe(station.slug);
    expect(state.generatedAt).toBe(new Date(T0).toISOString());
  });

  describe("traffic-light status", () => {
    it("a single broken report only makes a working unit unsure", () => {
      const state = aggregate(station, [report("E6", "out", 5000)], { now: T0 });
      expect(state.units.E6.status).toBe("unsure");
      expect(state.units.E6.last).toEqual({ kind: "out", at: ago(5000) });
      expect(state.units.E6.streak).toBe(1);
      expect(state.units.E6.total).toBe(1);
    });

    it("a second broken report settles it to out", () => {
      const state = aggregate(station, [report("E6", "out", 9000), report("E6", "out", 5000)], {
        now: T0,
      });
      expect(state.units.E6.status).toBe("out");
      expect(state.units.E6.streak).toBe(2);
    });

    it("holds at out no matter how many further broken reports arrive", () => {
      const state = aggregate(
        station,
        [
          report("E6", "out", 9000),
          report("E6", "out", 7000),
          report("E6", "out", 5000),
          report("E6", "out", 3000),
        ],
        { now: T0 },
      );
      expect(state.units.E6.status).toBe("out");
      expect(state.units.E6.streak).toBe(4);
    });

    it("walks a broken unit back to working over two working reports", () => {
      const broken = [report("E6", "out", 9000), report("E6", "out", 8000)];
      const after1 = aggregate(station, [...broken, report("E6", "ok", 5000)], { now: T0 });
      expect(after1.units.E6.status).toBe("unsure");
      const after2 = aggregate(
        station,
        [...broken, report("E6", "ok", 5000), report("E6", "ok", 4000)],
        { now: T0 },
      );
      expect(after2.units.E6.status).toBe("ok");
    });

    it("one report the other way cancels an unsure back to the settled state", () => {
      // working -> one broken report (unsure) -> one working report (back to ok)
      const state = aggregate(station, [report("E6", "out", 9000), report("E6", "ok", 5000)], {
        now: T0,
      });
      expect(state.units.E6.status).toBe("ok");
    });

    it("stays ok when the only reports are confirmations that it works", () => {
      const state = aggregate(station, [report("E6", "ok", 9000), report("E6", "ok", 5000)], {
        now: T0,
      });
      expect(state.units.E6.status).toBe("ok");
      expect(state.units.E6.streak).toBe(2);
    });

    it("orders unsorted input by timestamp", () => {
      const state = aggregate(
        station,
        [report("E6", "ok", 1000), report("E6", "out", 9000), report("E6", "out", 5000)],
        { now: T0 },
      );
      // asc: out, out, ok -> counter 1,0,-1,0 -> unsure
      expect(state.units.E6.status).toBe("unsure");
      expect(state.units.E6.total).toBe(3);
    });
  });

  it("counts a streak only while the most recent reports agree", () => {
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
  });

  it("ignores reports for units the station does not have", () => {
    const state = aggregate(station, [report("ZZ9", "out", 1000)], { now: T0 });
    expect(state.units.ZZ9).toBeUndefined();
    expect(summarise(state)).toEqual({ ok: station.units.length, unsure: 0, out: 0 });
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
  it("counts working, reported (unsure) and broken units", () => {
    const state = aggregate(
      station,
      [
        // E6: two broken reports -> out
        report("E6", "out", 2000),
        report("E6", "out", 1000),
        // L4: one broken report -> unsure
        report("L4", "out", 1000),
        // E1: one working report -> ok
        report("E1", "ok", 1000),
      ],
      { now: T0 },
    );
    expect(summarise(state)).toEqual({
      ok: station.units.length - 2,
      unsure: 1,
      out: 1,
    });
  });
});
