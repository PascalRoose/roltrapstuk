"use client";

import type { Lang, ThemePref } from "@/lib/types";
import { strings } from "@/lib/strings";
import type { SettingsApi } from "@/hooks/useSettings";
import { Modal } from "./Modal";
import { SegmentedControl } from "./SegmentedControl";
import styles from "./content.module.css";

export function SettingsModal({
  settings,
  onClose,
}: {
  settings: SettingsApi;
  onClose: () => void;
}) {
  const t = strings(settings.lang);

  return (
    <Modal title={t.settings} onClose={onClose}>
      <h2 className={styles.title}>{t.settings}</h2>

      <div className={styles.group}>
        <div className={styles.label}>{t.language}</div>
        <SegmentedControl<Lang>
          label={t.language}
          value={settings.lang}
          onChange={(lang) => settings.update({ lang })}
          options={[
            { value: "en", label: "English" },
            { value: "nl", label: "Nederlands" },
          ]}
        />
      </div>

      <div className={styles.group}>
        <div className={styles.label}>{t.appearance}</div>
        <SegmentedControl<ThemePref>
          label={t.appearance}
          value={settings.theme}
          onChange={(theme) => settings.update({ theme })}
          options={[
            { value: "light", label: t.light },
            { value: "dark", label: t.dark },
            { value: "system", label: t.system },
          ]}
        />
      </div>

      <div className={styles.group}>
        <div className={styles.label}>{t.orientation}</div>
        <SegmentedControl<"off" | "on">
          label={t.orientation}
          value={settings.flip ? "on" : "off"}
          onChange={(v) => settings.update({ flip: v === "on" })}
          options={[
            { value: "off", label: t.flipOff },
            { value: "on", label: t.flipOn },
          ]}
        />
      </div>

      <button type="button" className={styles.primary} onClick={onClose}>
        {t.done}
      </button>
    </Modal>
  );
}
