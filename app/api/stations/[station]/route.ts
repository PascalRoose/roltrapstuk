import type { NextRequest } from "next/server";
import { readStationState } from "@/lib/stationState";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ station: string }> }) {
  const { station } = await params;
  const reporterId = req.nextUrl.searchParams.get("r");
  const state = await readStationState(station, reporterId);
  if (!state) {
    return Response.json({ error: "unknown station" }, { status: 404 });
  }
  return Response.json(state, { headers: { "cache-control": "no-store" } });
}
