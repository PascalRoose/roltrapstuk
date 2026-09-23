import type { Metadata } from "next";
import { getStation } from "@/lib/stations";
import { stationMetadata } from "@/lib/seo";
import { StationPage } from "@/components/StationPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ station: string }>;
}): Promise<Metadata> {
  const { station } = await params;
  const def = getStation(station);
  return def ? stationMetadata(def, "en") : {};
}

export default async function Page({ params }: { params: Promise<{ station: string }> }) {
  const { station } = await params;
  return <StationPage slug={station} lang="en" />;
}
