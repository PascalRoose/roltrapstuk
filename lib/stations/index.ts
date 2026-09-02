import type { StationDef } from "@/lib/types";
import { denBosch } from "@/lib/stations/denbosch";

const STATIONS: Record<string, StationDef> = {
  [denBosch.slug]: denBosch,
};

export const DEFAULT_STATION = denBosch.slug;

export function getStation(slug: string): StationDef | undefined {
  return STATIONS[slug];
}

export function allStations(): StationDef[] {
  return Object.values(STATIONS);
}
