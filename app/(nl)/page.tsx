import { permanentRedirect } from "next/navigation";
import { DEFAULT_STATION } from "@/lib/stations";
import { stationPath } from "@/lib/seo";

export default function Home() {
  permanentRedirect(stationPath(DEFAULT_STATION, "nl"));
}
