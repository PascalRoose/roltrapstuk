export type Lang = "en" | "nl";
export type ThemePref = "light" | "dark" | "system";
export type Theme = "light" | "dark";

/** What a traveller reports, and the resting status of a unit. */
export type ReportKind = "out" | "ok";

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
  status: ReportKind;
  last: { kind: ReportKind; at: string } | null;
  /** consecutive reports agreeing with the current status */
  streak: number;
  /** all reports ever filed for this unit */
  total: number;
  /** the current status is "ok" but the unit was reported broken before that */
  okAgain: boolean;
  /** the caller's own most recent report is the latest one and still undoable */
  canUndo: boolean;
}

export interface StationState {
  slug: string;
  units: Record<string, UnitState>;
  generatedAt: string;
}
