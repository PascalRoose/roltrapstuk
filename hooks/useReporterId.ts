"use client";

import { useState } from "react";

const KEY = "roltrapstuk.reporterId";

function readOrCreate(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let value = localStorage.getItem(KEY);
    if (!value) {
      value =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `r-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(KEY, value);
    }
    return value;
  } catch {
    return `r-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * A stable, anonymous per-device id used to attribute (and undo) reports.
 * Null during server render; resolved on the client's first render. It only
 * feeds the fetch key and request bodies, never the DOM, so there is no
 * hydration mismatch.
 */
export function useReporterId(): string | null {
  const [id] = useState<string | null>(readOrCreate);
  return id;
}
