import { permanentRedirect } from "next/navigation";
import { DEFAULT_STATION } from "@/lib/stations";
import { stationPath } from "@/lib/seo";

export default function EnglishHome() {
  permanentRedirect(stationPath(DEFAULT_STATION, "en"));
}
