"use client";

import type { Lang, StationDef } from "@/lib/types";
import { strings } from "@/lib/strings";
import styles from "./Header.module.css";

interface Props {
  station: StationDef;
  lang: Lang;
  summary: { ok: number; out: number } | null;
  onInfo: () => void;
  onSettings: () => void;
}

export function Header({ station, lang, summary, onInfo, onSettings }: Props) {
  const t = strings(lang);

  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <div className={styles.kicker}>{station.kicker[lang]}</div>
        <h1 className={styles.name}>{station.name}</h1>
      </div>

      <div className={styles.summary}>
        <span className={styles.count}>
          <i className={styles.dotOut} aria-hidden />
          {summary ? summary.out : "–"} {t.outShort}
        </span>
        <span className={styles.count}>
          <i className={styles.dotOk} aria-hidden />
          {summary ? summary.ok : "–"} {t.okShort}
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} onClick={onInfo} aria-label={t.whyTitle}>
          i
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onSettings}
          aria-label={t.settings}
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
