"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import type { ReportKind, StationState } from "@/lib/types";
import { getStation } from "@/lib/stations";
import { summarise } from "@/lib/aggregate";
import { strings } from "@/lib/strings";
import { useSettings } from "@/hooks/useSettings";
import { useReporterId } from "@/hooks/useReporterId";
import { Header } from "./Header";
import { StationMap } from "./StationMap";
import { DetailPanel } from "./DetailPanel";
import { InfoModal } from "./modals/InfoModal";
import { SettingsModal } from "./modals/SettingsModal";
import styles from "./StationView.module.css";

async function fetcher(url: string): Promise<StationState> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`request failed: ${res.status}`);
  return res.json();
}

export function StationView({ slug, initialState }: { slug: string; initialState?: StationState }) {
  const station = getStation(slug);
  const settings = useSettings();
  const reporterId = useReporterId();
  const t = strings(settings.lang);

  const key = reporterId
    ? `/api/stations/${slug}?r=${encodeURIComponent(reporterId)}`
    : `/api/stations/${slug}`;
  const { data, error, mutate, isLoading } = useSWR<StationState>(key, fetcher, {
    fallbackData: initialState,
    refreshInterval: 20000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });

  const [selected, setSelected] = useState<string | null>(null);
  const [modal, setModal] = useState<"info" | "settings" | null>(null);
  const [justReported, setJustReported] = useState<ReportKind | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Open the info screen the first time someone lands on the site. Deferred to a
  // microtask so it lands after hydration (the server render has no modal).
  useEffect(() => {
    const KEY = "roltrapstuk.infoSeen";
    try {
      if (localStorage.getItem(KEY) != null) return;
      localStorage.setItem(KEY, "1");
    } catch {
      return;
    }
    queueMicrotask(() => setModal("info"));
  }, []);

  const selectedUnit = useMemo(
    () => station?.units.find((u) => u.id === selected) ?? null,
    [station, selected],
  );

  const summary = data ? summarise(data) : null;

  const pick = useCallback((id: string) => {
    setSelected((cur) => (cur === id ? null : id));
    setJustReported(null);
  }, []);

  const deselect = useCallback(() => {
    setSelected(null);
    setJustReported(null);
  }, []);

  const post = useCallback(
    async (method: "POST" | "DELETE", body: Record<string, unknown>) => {
      setBusy(true);
      try {
        const res = await fetch("/api/reports", {
          method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`request failed: ${res.status}`);
        const next = (await res.json()) as StationState;
        await mutate(next, { revalidate: false });
        return true;
      } catch {
        await mutate();
        return false;
      } finally {
        setBusy(false);
      }
    },
    [mutate],
  );

  const report = useCallback(
    async (kind: ReportKind) => {
      if (!selected || !reporterId) return;
      const ok = await post("POST", { station: slug, unitId: selected, kind, reporterId });
      if (ok) setJustReported(kind);
    },
    [selected, reporterId, slug, post],
  );

  const undo = useCallback(async () => {
    if (!selected || !reporterId) return;
    const ok = await post("DELETE", { station: slug, unitId: selected, reporterId });
    if (ok) setJustReported(null);
  }, [selected, reporterId, slug, post]);

  if (!station) return null;

  return (
    <div className={styles.app} onClick={deselect}>
      <Header
        station={station}
        lang={settings.lang}
        summary={summary}
        onInfo={() => setModal("info")}
        onSettings={() => setModal("settings")}
      />

      <div className={styles.body}>
        <div className={styles.mapArea}>
          {error && !data ? (
            <p className={styles.state}>
              {settings.lang === "nl" ? "Server niet bereikbaar" : "Can’t reach the server"}
            </p>
          ) : isLoading && !data ? (
            <p className={styles.state}>{settings.lang === "nl" ? "Laden…" : "Loading…"}</p>
          ) : (
            <StationMap
              station={station}
              state={data}
              selected={selected}
              onPick={pick}
              lang={settings.lang}
              flip={settings.flip}
            />
          )}
          {error && data && <p className={styles.banner}>{t.offline}</p>}
        </div>

        <div
          className={styles.panel}
          data-open={selected != null}
          onClick={(e) => e.stopPropagation()}
        >
          <DetailPanel
            unit={selectedUnit}
            unitState={selected ? data?.units[selected] : undefined}
            lang={settings.lang}
            now={now}
            busy={busy}
            justReported={justReported}
            onReport={report}
            onUndo={undo}
          />
        </div>
      </div>

      {modal === "info" && <InfoModal lang={settings.lang} onClose={() => setModal(null)} />}
      {modal === "settings" && <SettingsModal settings={settings} onClose={() => setModal(null)} />}
    </div>
  );
}
