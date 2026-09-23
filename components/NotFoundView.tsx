import Link from "next/link";
import type { Lang } from "@/lib/types";
import { DEFAULT_STATION, getStation } from "@/lib/stations";
import { stationPath } from "@/lib/seo";
import { strings } from "@/lib/strings";

export function NotFoundView({ lang }: { lang: Lang }) {
  const t = strings(lang);
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
      <h1 style={{ margin: 0, fontSize: 22 }}>{t.notFoundTitle}</h1>
      <p style={{ margin: 0, color: "var(--c-sub)" }}>{t.notFoundText}</p>
      <Link href={stationPath(DEFAULT_STATION, lang)} style={{ color: "var(--c-primary-text)" }}>
        {t.notFoundGo(def?.name ?? DEFAULT_STATION)}
      </Link>
    </main>
  );
}
