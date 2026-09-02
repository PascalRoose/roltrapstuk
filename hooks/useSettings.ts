"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { Lang, Theme, ThemePref } from "@/lib/types";

const KEY = "roltrapstuk.settings";

interface Settings {
  lang: Lang;
  theme: ThemePref;
  flip: boolean;
}

const DEFAULTS: Settings = { lang: "en", theme: "system", flip: false };

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return {
        lang: parsed.lang === "nl" || parsed.lang === "en" ? parsed.lang : DEFAULTS.lang,
        theme:
          parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system"
            ? parsed.theme
            : DEFAULTS.theme,
        flip: typeof parsed.flip === "boolean" ? parsed.flip : DEFAULTS.flip,
      };
    }
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

/* ---- external store: localStorage + the OS colour-scheme preference ---- */

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
    mq.removeEventListener("change", cb);
  };
}

function getSnapshot(): string {
  const s = readSettings();
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return JSON.stringify({ ...s, systemDark });
}

const SERVER_SNAPSHOT = JSON.stringify({ ...DEFAULTS, systemDark: false });

function getServerSnapshot(): string {
  return SERVER_SNAPSHOT;
}

export interface SettingsApi extends Settings {
  /** the resolved concrete theme, after applying the system preference */
  resolvedTheme: Theme;
  update: (patch: Partial<Settings>) => void;
}

export function useSettings(): SettingsApi {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parsed = JSON.parse(snapshot) as Settings & { systemDark: boolean };

  const update = useCallback((patch: Partial<Settings>) => {
    const next = { ...readSettings(), ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    emit();
  }, []);

  const resolvedTheme: Theme =
    parsed.theme === "system" ? (parsed.systemDark ? "dark" : "light") : parsed.theme;

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.lang = parsed.lang;
  }, [resolvedTheme, parsed.lang]);

  return {
    lang: parsed.lang,
    theme: parsed.theme,
    flip: parsed.flip,
    resolvedTheme,
    update,
  };
}
