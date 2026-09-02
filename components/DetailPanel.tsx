"use client";

import type { Lang, ReportKind, UnitDef, UnitState } from "@/lib/types";
import { strings } from "@/lib/strings";
import { relativeTime } from "@/lib/relativeTime";
import styles from "./DetailPanel.module.css";

interface Props {
  unit: UnitDef | null;
  unitState: UnitState | undefined;
  lang: Lang;
  now: number;
  busy: boolean;
  justReported: ReportKind | null;
  onReport: (kind: ReportKind) => void;
  onUndo: () => void;
}

export function DetailPanel({
  unit,
  unitState,
  lang,
  now,
  busy,
  justReported,
  onReport,
  onUndo,
}: Props) {
  const t = strings(lang);

  if (!unit) {
    return <div className={styles.hint}>{t.tapHint}</div>;
  }

  const status: ReportKind = unitState?.status ?? "ok";
  const last = unitState?.last ?? null;
  const streak = unitState?.streak ?? 0;
  const total = unitState?.total ?? 0;
  const okAgain = unitState?.okAgain ?? false;
  const canUndo = unitState?.canUndo ?? false;

  let lastText: string;
  if (!last) lastText = t.noReports;
  else if (justReported) lastText = justReported === "out" ? t.youOut : t.youOk;
  else if (last.kind === "out") lastText = t.lastOut;
  else lastText = okAgain ? t.lastOkAgain : t.lastOk;

  const lastTime = last ? relativeTime(last.at, lang, now) : "—";
  const history = last ? `${t.travellers(streak || 1)} · ${t.records(total)}` : t.noReportsSub;

  const actionLabel = status === "out" ? t.reportOk : t.reportOut;
  const nextKind: ReportKind = status === "out" ? "ok" : "out";
  const doneText = justReported === "out" ? t.doneOut : t.doneOk;

  return (
    <div className={styles.detail}>
      <div className={styles.head}>
        <span className={styles.dot} data-status={status} aria-hidden />
        <div className={styles.headText}>
          <div className={styles.title}>{unit.name[lang]}</div>
          <div className={styles.sub}>
            {status === "out" ? t.out : t.working} · {unit.sub[lang]}
          </div>
        </div>
        <span className={styles.id}>{unit.id}</span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLabel}>{t.latest}</div>
        <div className={styles.cardRow}>
          <div className={styles.cardText}>{lastText}</div>
          <div className={styles.cardTime}>{lastTime}</div>
        </div>
        <div className={styles.sub}>{history}</div>
      </div>

      {justReported ? (
        <>
          <div className={styles.confirm}>
            <div className={styles.confirmTitle}>{t.thanks}</div>
            <div className={styles.cardText}>{doneText}</div>
          </div>
          {canUndo && (
            <button type="button" className={styles.undo} onClick={onUndo} disabled={busy}>
              {t.undo}
            </button>
          )}
        </>
      ) : (
        <button
          type="button"
          className={styles.primary}
          onClick={() => onReport(nextKind)}
          disabled={busy}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
