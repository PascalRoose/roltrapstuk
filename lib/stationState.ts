import "server-only";
import type { StationState } from "@/lib/types";
import { getStation } from "@/lib/stations";
import { aggregate } from "@/lib/aggregate";
import { getStore } from "@/lib/store";

/**
 * Read the report log for a station and fold it into the shape the client renders.
 * Returns null for an unknown station slug.
 */
export async function readStationState(
  slug: string,
  reporterId?: string | null,
): Promise<StationState | null> {
  const station = getStation(slug);
  if (!station) return null;
  const reports = await getStore().list(slug);
  return aggregate(station, reports, { reporterId });
}
