import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStation } from "@/lib/stations";
import { readStationState } from "@/lib/stationState";
import { StationView } from "@/components/StationView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ station: string }>;
}): Promise<Metadata> {
  const { station } = await params;
  const def = getStation(station);
  if (!def) return {};
  return {
    title: def.name,
    description: `Escalator and lift status for ${def.name} station, kept up to date by travellers.`,
    alternates: { canonical: `/${def.slug}` },
  };
}

export default async function StationPage({ params }: { params: Promise<{ station: string }> }) {
  const { station } = await params;
  if (!getStation(station)) notFound();
  const initialState = await readStationState(station);
  return <StationView slug={station} initialState={initialState ?? undefined} />;
}
