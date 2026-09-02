import type { NextRequest } from "next/server";
import { getStation } from "@/lib/stations";
import { getStore } from "@/lib/store";
import { readStationState } from "@/lib/stationState";
import type { ReportKind } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Body {
  station?: unknown;
  unitId?: unknown;
  kind?: unknown;
  reporterId?: unknown;
}

function parse(body: Body) {
  const station = typeof body.station === "string" ? body.station : "";
  const unitId = typeof body.unitId === "string" ? body.unitId : "";
  const kind = body.kind === "out" || body.kind === "ok" ? (body.kind as ReportKind) : null;
  const reporterId =
    typeof body.reporterId === "string" &&
    body.reporterId.length >= 8 &&
    body.reporterId.length <= 100
      ? body.reporterId
      : "";

  const stationDef = getStation(station);
  if (!stationDef) return { error: "unknown station" as const };
  if (!kind) return { error: "invalid kind" as const };
  if (!reporterId) return { error: "missing reporterId" as const };
  if (!stationDef.units.some((u) => u.id === unitId)) return { error: "unknown unit" as const };

  return { station, unitId, kind, reporterId };
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = parse(body);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  await getStore().add(parsed);
  const state = await readStationState(parsed.station, parsed.reporterId);
  return Response.json(state, { headers: { "cache-control": "no-store" } });
}

export async function DELETE(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = parse({ ...body, kind: "ok" });
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const undone = await getStore().undo(parsed.station, parsed.unitId, parsed.reporterId);
  const state = await readStationState(parsed.station, parsed.reporterId);
  return Response.json({ ...state, undone }, { headers: { "cache-control": "no-store" } });
}
