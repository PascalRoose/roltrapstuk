import type { Lang } from "@/lib/types";
import { strings } from "@/lib/strings";

/**
 * Human phrasing for how long ago a report came in.
 * < 1 min      → "Just now"
 * < 60 min     → "N min ago"
 * earlier today → "HH:MM"
 * yesterday    → "Yesterday"
 * else         → "N days ago"
 */
export function relativeTime(iso: string, lang: Lang, now: number = Date.now()): string {
  const t = strings(lang);
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const mins = Math.floor((now - then) / 60000);
  if (mins < 1) return t.justNow;
  if (mins < 60) return t.minAgo(mins);

  const startOfDay = (ms: number) => {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const dayDiff = Math.round((startOfDay(now) - startOfDay(then)) / 86400000);

  if (dayDiff <= 0) {
    const d = new Date(then);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  if (dayDiff === 1) return t.yesterday;
  return t.daysAgo(dayDiff);
}
