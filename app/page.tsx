import { redirect } from "next/navigation";
import { DEFAULT_STATION } from "@/lib/stations";

export default function Home() {
  redirect(`/${DEFAULT_STATION}`);
}
