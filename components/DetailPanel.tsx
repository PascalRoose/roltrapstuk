"use client";

import type { Lang, ReportKind, UnitDef, UnitState, UnitStatus } from "@/lib/types";
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

  const status: UnitStatus = unitState?.status ?? "ok";
  const last = unitState?.last ?? null;
  const streak = unitState?.streak ?? 0;
  const total = unitState?.total ?? 0;
  const yours = unitState?.yours ?? null;

  let statusWord: string;
  if (status === "out") statusWord = t.out;
  else if (status === "ok") statusWord = t.working;
  else statusWord = last?.kind === "out" ? t.unsureOut : t.unsureOk;

  const mine = justReported ?? yours;
  let lastText: string;
  if (!last) lastText = t.noReports;
  else if (mine) lastText = mine === "out" ? t.youOut : t.youOk;
  else lastText = last.kind === "out" ? t.lastOut : t.lastOk;

  const lastTime = last ? relativeTime(last.at, lang, now) : "—";
  const history = last ? `${t.travellers(streak || 1)} · ${t.records(total)}` : t.noReportsSub;

  const doneText = justReported === "out" ? t.doneOut : t.doneOk;

  return (
    <div className={styles.detail} key={unit.id}>
      <div className={styles.head}>
        <span className={styles.dot} data-status={status} aria-hidden />
        <div className={styles.headText}>
          <div className={styles.title}>{unit.name[lang]}</div>
          <div className={styles.sub}>
            {statusWord} · {unit.sub[lang]}
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

      {justReported && (
        <div className={styles.confirm}>
          <div className={styles.confirmTitle}>{t.thanks}</div>
          <div className={styles.cardText}>{doneText}</div>
        </div>
      )}

      {yours ? (
        <button type="button" className={styles.undo} onClick={onUndo} disabled={busy}>
          {t.undo}
        </button>
      ) : (
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnOut}`}
            onClick={() => onReport("out")}
            disabled={busy}
          >
            {t.reportOut}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnOk}`}
            onClick={() => onReport("ok")}
            disabled={busy}
          >
            {t.reportOk}
          </button>
        </div>
      )}
    </div>
  );
}
