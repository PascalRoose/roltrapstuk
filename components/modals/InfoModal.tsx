"use client";

import type { Lang } from "@/lib/types";
import { strings } from "@/lib/strings";
import { Modal } from "./Modal";
import styles from "./content.module.css";

export function InfoModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = strings(lang);
  return (
    <Modal title={t.whyTitle} onClose={onClose}>
      <h2 className={styles.title}>{t.whyTitle}</h2>
      <p className={styles.text}>{t.why1}</p>
      <p className={styles.text}>{t.why2}</p>
      <button type="button" className={styles.primary} onClick={onClose}>
        {t.gotIt}
      </button>
    </Modal>
  );
}
