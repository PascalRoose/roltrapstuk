"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang, StationDef, StationState } from "@/lib/types";
import { strings } from "@/lib/strings";
import styles from "./StationMap.module.css";

const W = 402;
const H = 620;

interface Props {
  station: StationDef;
  state: StationState | undefined;
  selected: string | null;
  onPick: (id: string) => void;
  lang: Lang;
  flip: boolean;
}

export function StationMap({ station, state, selected, onPick, lang, flip }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: W, h: H });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fit the fixed canvas to whichever dimension runs out first (never past its
  // natural size), so the whole map is always visible without scrolling — iOS
  // Safari won't reliably scroll the nested overflow container when the
  // viewport resizes under it.
  const scale = box.w > 0 && box.h > 0 ? Math.min(box.w / W, box.h / H, 1) : 1;
  const t = strings(lang);
  const track = lang === "nl" ? "Spoor" : "Track";

  const statusOf = (id: string) => state?.units[id]?.status ?? "ok";
  const statusWord = (id: string) => (statusOf(id) === "out" ? t.out : t.working);

  return (
    <div ref={ref} className={styles.host}>
      <div className={styles.root} style={{ width: W * scale, height: H * scale }}>
        <div className={styles.canvas} style={{ transform: `scale(${scale})` }}>
          <div className={styles.rotate} data-flip={flip}>
            <div className={styles.tunnel} />

            {station.rails.map((r) => (
              <div key={r.top} className={styles.rail} style={{ top: r.top }} />
            ))}

            {station.plates.map((p) => (
              <div key={p.top} className={styles.plate} style={{ top: p.top }} />
            ))}

            {station.trackLabels.map((l, i) => (
              <div
                key={i}
                className={`${styles.trackLabel} ${styles.upright}`}
                style={l.side === "l" ? { top: l.top, left: 16 } : { top: l.top, right: 16 }}
              >
                {`${track} ${l.text}`}
              </div>
            ))}

            <div className={`${styles.end} ${styles.endTop} ${styles.upright}`}>
              {station.ends.top[lang]}
            </div>
            <div className={`${styles.end} ${styles.endBottom} ${styles.upright}`}>
              {station.ends.bottom[lang]}
            </div>

            <div className={`${styles.noEsc} ${styles.upright}`} style={station.noEscalatorBox}>
              {station.noEscalator[lang]}
            </div>

            {station.units.map((u) => {
              const status = statusOf(u.id);
              const isSelected = selected === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  className={styles.hit}
                  style={u.box}
                  aria-pressed={isSelected}
                  aria-label={`${u.name[lang]} — ${statusWord(u.id)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPick(u.id);
                  }}
                >
                  <span
                    className={styles.chip}
                    data-status={status}
                    data-selected={isSelected}
                    data-type={u.type}
                  >
                    {u.type === "lift" ? (
                      <>
                        <span className={styles.liftGlyph}>
                          <span>▲</span>
                          <span className={styles.liftBar} />
                          <span>▼</span>
                        </span>
                        <span className={`${styles.liftCap} ${styles.upright}`}>LIFT</span>
                      </>
                    ) : (
                      <span className={styles.arrow}>{u.glyph}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
