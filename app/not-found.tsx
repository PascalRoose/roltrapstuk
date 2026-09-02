import Link from "next/link";
import { DEFAULT_STATION, getStation } from "@/lib/stations";

export default function NotFound() {
  const def = getStation(DEFAULT_STATION);
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 22 }}>Station not found</h1>
      <p style={{ margin: 0, color: "var(--c-sub)" }}>
        There&rsquo;s no status page for that station yet.
      </p>
      <Link href={`/${DEFAULT_STATION}`} style={{ color: "var(--c-primary-text)" }}>
        Go to {def?.name ?? DEFAULT_STATION}
      </Link>
    </main>
  );
}
