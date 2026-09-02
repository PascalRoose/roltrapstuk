import type { RawReport, StationDef, StationState, UnitState } from "@/lib/types";

export const UNDO_WINDOW_MS = 15 * 60 * 1000;

const EMPTY: UnitState = {
  status: "ok",
  last: null,
  streak: 0,
  total: 0,
  okAgain: false,
  canUndo: false,
};

/**
 * Fold the raw report log into per-unit state.
 * The current status is simply the most recent report; a unit with no reports
 * is assumed to be working.
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
    const status = last.kind;

    let streak = 0;
    for (let i = list.length - 1; i >= 0 && list[i].kind === status; i--) streak++;

    const canUndo =
      !!opts.reporterId &&
      last.reporterId === opts.reporterId &&
      now - new Date(last.at).getTime() < UNDO_WINDOW_MS;

    units[unit.id] = {
      status,
      last: { kind: last.kind, at: last.at },
      streak,
      total: list.length,
      okAgain: status === "ok" && list.some((r) => r.kind === "out"),
      canUndo,
    };
  }

  return { slug: station.slug, units, generatedAt: new Date(now).toISOString() };
}

export function summarise(state: StationState): { ok: number; out: number } {
  let ok = 0;
  let out = 0;
  for (const u of Object.values(state.units)) {
    if (u.status === "out") out++;
    else ok++;
  }
  return { ok, out };
}
