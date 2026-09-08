export type Lang = "en" | "nl";
export type ThemePref = "light" | "dark" | "system";
export type Theme = "light" | "dark";

/** What a traveller reports. */
export type ReportKind = "out" | "ok";

/**
 * Traffic-light status of a unit. `unsure` is a single unconfirmed report
 * sitting between the two settled states — one more report the same way
 * settles it, one the other way cancels it. See {@link aggregate}.
 */
export type UnitStatus = "ok" | "unsure" | "out";

export type UnitType = "escalator" | "lift";

/** Placement in the 402 x 620 station schematic (see StationMap). */
export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface UnitDef {
  id: string;
  type: UnitType;
  name: Record<Lang, string>;
  /** direction / endpoints line, shown under the name */
  sub: Record<Lang, string>;
  box: Box;
  /** escalators only: ▲ ▼ ◀ ▶ — the way the stair travels on the map */
  glyph?: string;
}

export interface RailDef {
  top: number;
}

export interface TrackLabelDef {
  side: "l" | "r";
  top: number;
  text: string;
}

export interface PlateDef {
  top: number;
}

export interface StationDef {
  slug: string;
  /** display name, e.g. 's-Hertogenbosch */
  name: string;
  kicker: Record<Lang, string>;
  ends: {
    top: Record<Lang, string>;
    bottom: Record<Lang, string>;
  };
  /** label for the gap where a platform has no escalator */
  noEscalator: Record<Lang, string>;
  noEscalatorBox: Box;
  units: UnitDef[];
  rails: RailDef[];
  trackLabels: TrackLabelDef[];
  plates: PlateDef[];
}

/** One traveller report, as stored. */
export interface RawReport {
  unitId: string;
  kind: ReportKind;
  at: string; // ISO 8601
  reporterId: string | null;
}

/** Aggregated state of a single unit, sent to the client. */
export interface UnitState {
  status: UnitStatus;
  last: { kind: ReportKind; at: string } | null;
  /** consecutive most-recent reports of the same kind */
  streak: number;
  /** all reports ever filed for this unit */
  total: number;
  /**
   * The caller's own active report for this unit: the kind they last reported,
   * while it is still inside the undo window. `null` once the window has passed
   * (they may report again) or if they never reported. One active report per
   * device — the report buttons are hidden and only "undo" is offered while
   * this is set. See {@link aggregate}.
   */
  yours: ReportKind | null;
}

export interface StationState {
  slug: string;
  units: Record<string, UnitState>;
  generatedAt: string;
}
