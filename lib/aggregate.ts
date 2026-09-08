import type {
  RawReport,
  ReportKind,
  StationDef,
  StationState,
  UnitState,
  UnitStatus,
} from "@/lib/types";

export const UNDO_WINDOW_MS = 15 * 60 * 1000;

const EMPTY: UnitState = {
  status: "ok",
  last: null,
  streak: 0,
  total: 0,
  yours: null,
};

/**
 * Traffic-light status from a chronological run of reports.
 *
 * A unit starts confidently working. Each report nudges a confidence counter
 * one step and it is clamped to [-1, 1]: `ok` = +1 (working), `unsure` = 0,
 * `out` = -1 (broken). So the first "broken" report only makes a working unit
 * `unsure`; a second one settles it to `out`. Reporting a broken unit working
 * walks it back the same way. Consecutive reports the same way just hold the
 * clamp, and one report the other way cancels an `unsure`.
 */
function foldStatus(reportsAsc: RawReport[]): UnitStatus {
  let c = 1;
  for (const r of reportsAsc) {
    c = r.kind === "ok" ? Math.min(1, c + 1) : Math.max(-1, c - 1);
  }
  return c > 0 ? "ok" : c < 0 ? "out" : "unsure";
}

/**
 * Fold the raw report log into per-unit state. A unit with no reports is
 * assumed to be working.
 */
export function aggregate(
  station: StationDef,
  reports: RawReport[],
  opts: { reporterId?: string | null; now?: number } = {},
): StationState {
  const now = opts.now ?? Date.now();
  const byUnit = new Map<string, RawReport[]>();
  for (const r of reports) {
    const list = byUnit.get(r.unitId);
    if (list) list.push(r);
    else byUnit.set(r.unitId, [r]);
  }

  const units: Record<string, UnitState> = {};
  for (const unit of station.units) {
    const list = (byUnit.get(unit.id) ?? []).slice().sort((a, b) => a.at.localeCompare(b.at));

    if (list.length === 0) {
      units[unit.id] = EMPTY;
      continue;
    }

    const last = list[list.length - 1];

    let streak = 0;
    for (let i = list.length - 1; i >= 0 && list[i].kind === last.kind; i--) streak++;

    // The caller's own most recent report for this unit — even if a later
    // report from someone else has since superseded it. It only counts as
    // "yours" (undoable, and blocking a re-report) while inside the window.
    let yours: ReportKind | null = null;
    if (opts.reporterId) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].reporterId !== opts.reporterId) continue;
        if (now - new Date(list[i].at).getTime() < UNDO_WINDOW_MS) yours = list[i].kind;
        break;
      }
    }

    units[unit.id] = {
      status: foldStatus(list),
      last: { kind: last.kind, at: last.at },
      streak,
      total: list.length,
      yours,
    };
  }

  return { slug: station.slug, units, generatedAt: new Date(now).toISOString() };
}

export function summarise(state: StationState): { ok: number; unsure: number; out: number } {
  let ok = 0;
  let unsure = 0;
  let out = 0;
  for (const u of Object.values(state.units)) {
    if (u.status === "out") out++;
    else if (u.status === "unsure") unsure++;
    else ok++;
  }
  return { ok, unsure, out };
}
