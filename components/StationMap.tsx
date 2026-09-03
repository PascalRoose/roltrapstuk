"use client";

import { useEffect, useRef, useState } from "react";
import type { Box as UnitBox, Lang, StationDef, StationState } from "@/lib/types";
import { strings } from "@/lib/strings";
import styles from "./StationMap.module.css";

const W = 402;
const H = 620;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1.5;

interface Props {
  station: StationDef;
  state: StationState | undefined;
  selected: string | null;
  onPick: (id: string) => void;
  lang: Lang;
  flip: boolean;
}

interface Size {
  w: number;
  h: number;
}

interface Point {
  x: number;
  y: number;
}

interface View {
  zoom: number;
  pan: Point;
}

function clampAxis(pos: number, content: number, viewport: number) {
  // Content that fits stays centred; content that overflows gets clamped so
  // it never leaves a gap at either edge.
  if (content <= viewport) return (viewport - content) / 2;
  return Math.min(0, Math.max(viewport - content, pos));
}

function clampPan(pan: Point, content: Size, viewport: Size): Point {
  return {
    x: clampAxis(pan.x, content.w, viewport.w),
    y: clampAxis(pan.y, content.h, viewport.h),
  };
}

/** Visual bounding box of a unit on the canvas, accounting for the 180° flip. */
function visualRect(box: UnitBox, flip: boolean) {
  if (!flip) {
    return {
      left: box.left,
      top: box.top,
      right: box.left + box.width,
      bottom: box.top + box.height,
    };
  }
  return {
    left: W - (box.left + box.width),
    top: H - (box.top + box.height),
    right: W - box.left,
    bottom: H - box.top,
  };
}

/** Centre point of a unit's visual bounding box, in canvas coordinates. */
function unitCenter(box: UnitBox, flip: boolean): Point {
  const rect = visualRect(box, flip);
  return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
}

function computePanForZoom(newZoom: number, focal: Point, from: View, fitScale: number): Point {
  const oldScale = fitScale * from.zoom;
  const newScale = fitScale * newZoom;
  const contentX = (focal.x - from.pan.x) / oldScale;
  const contentY = (focal.y - from.pan.y) / oldScale;
  return { x: focal.x - contentX * newScale, y: focal.y - contentY * newScale };
}

export function StationMap({ station, state, selected, onPick, lang, flip }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<Size>({ w: W, h: H });
  const [view, setView] = useState<View>({ zoom: MIN_ZOOM, pan: { x: 0, y: 0 } });

  // Freeze the box used to compute the "fit" scale while a unit is selected:
  // opening the detail panel shrinks the host, but the map should keep its
  // size — the traveller can pan to whatever scrolled out of view instead.
  // Adjusting state during render (rather than via an effect) is the
  // documented way to derive state from a changing prop/value; see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [fitBox, setFitBox] = useState<Size>({ w: W, h: H });
  if (selected == null && (fitBox.w !== measured.w || fitBox.h !== measured.h)) {
    setFitBox(measured);
  }

  const fitScale = Math.min(fitBox.w / W, fitBox.h / H, 1);
  const scale = fitScale * view.zoom;
  const content: Size = { w: W * scale, h: H * scale };
  const pan = clampPan(view.pan, content, measured);

  // Keep a newly selected unit centred in whatever's currently visible —
  // recomputed on every render (not just once) so it stays correct as the
  // detail panel finishes opening and the host's measured size settles,
  // which happens a render or two after `selected` itself changes. A manual
  // pan/zoom (see the gesture and zoom handlers below) cancels the follow so
  // it never fights the traveller's own navigation.
  const [followId, setFollowId] = useState<string | null>(null);
  const [prevSelected, setPrevSelected] = useState<string | null>(null);
  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setFollowId(selected);
  }
  if (followId != null) {
    const unit = station.units.find((u) => u.id === followId);
    if (unit) {
      const center = unitCenter(unit.box, flip);
      const target = clampPan(
        { x: measured.w / 2 - center.x * scale, y: measured.h / 2 - center.y * scale },
        content,
        measured,
      );
      if (target.x !== pan.x || target.y !== pan.y) setView((v) => ({ ...v, pan: target }));
    }
  }

  const gesture = useRef<{
    pointers: Map<number, Point>;
    mode: "none" | "pan" | "pinch";
    startPan: Point;
    startZoom: number;
    startDist: number;
    startMid: Point;
    startPointer: Point;
    moved: boolean;
    suppressClick: boolean;
  }>({
    pointers: new Map(),
    mode: "none",
    startPan: { x: 0, y: 0 },
    startZoom: MIN_ZOOM,
    startDist: 0,
    startMid: { x: 0, y: 0 },
    startPointer: { x: 0, y: 0 },
    moved: false,
    suppressClick: false,
  });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const measure = () => setMeasured({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Desktop scroll-wheel zoom. Registered as a non-passive native listener so
  // preventDefault() can stop the page from scrolling.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const focal = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const factor = Math.exp(-e.deltaY * 0.0015);
      setFollowId(null);
      setView((v) => {
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
        const pan = computePanForZoom(newZoom, focal, v, fitScale);
        const s = fitScale * newZoom;
        return { zoom: newZoom, pan: clampPan(pan, { w: W * s, h: H * s }, measured) };
      });
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [fitScale, measured]);

  const t = strings(lang);
  const track = lang === "nl" ? "Spoor" : "Track";

  // Ambient trains on every other track, alternating direction. Each has its
  // own slow tempo and a negative delay so a train drifts past only now and
  // then, never in lockstep. They render behind the tunnel (see below).
  const RAIL_H = 8;
  const TRAIN_H = 12;
  const trains = station.rails
    .filter((_, i) => i % 2 === 1)
    .map((r, i) => ({
      // centre the train body on the rail band
      top: r.top + RAIL_H / 2 - TRAIN_H / 2,
      dir: i % 2 === 0 ? "rtl" : ("ltr" as const),
      dur: 32 + i * 7,
      delay: -(i * 17),
    }));

  const statusOf = (id: string) => state?.units[id]?.status ?? "ok";
  const statusWord = (id: string) => (statusOf(id) === "out" ? t.out : t.working);

  const isInteractive = (target: EventTarget | null) =>
    target instanceof Element && target.closest("button") != null;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (g.pointers.size === 1) {
      if (isInteractive(e.target)) return;
      g.mode = "pan";
      g.startPan = pan;
      g.startPointer = { x: e.clientX, y: e.clientY };
      g.moved = false;
      e.currentTarget.setPointerCapture(e.pointerId);
    } else if (g.pointers.size === 2) {
      const pts = [...g.pointers.values()];
      g.mode = "pinch";
      g.startDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      g.startZoom = view.zoom;
      g.startPan = pan;
      const rect = hostRef.current?.getBoundingClientRect();
      g.startMid = {
        x: (pts[0].x + pts[1].x) / 2 - (rect?.left ?? 0),
        y: (pts[0].y + pts[1].y) / 2 - (rect?.top ?? 0),
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g.pointers.has(e.pointerId)) return;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (g.mode === "pan" && g.pointers.size === 1) {
      const dx = e.clientX - g.startPointer.x;
      const dy = e.clientY - g.startPointer.y;
      if (!g.moved && Math.hypot(dx, dy) > 4) g.moved = true;
      if (!g.moved) return;
      e.preventDefault();
      setFollowId(null);
      setView((v) => ({
        ...v,
        pan: clampPan({ x: g.startPan.x + dx, y: g.startPan.y + dy }, content, measured),
      }));
    } else if (g.mode === "pinch" && g.pointers.size === 2) {
      e.preventDefault();
      const pts = [...g.pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const rawZoom = g.startZoom * (dist / g.startDist);
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, rawZoom));
      const pan = computePanForZoom(
        newZoom,
        g.startMid,
        { zoom: g.startZoom, pan: g.startPan },
        fitScale,
      );
      const s = fitScale * newZoom;
      setFollowId(null);
      setView({ zoom: newZoom, pan: clampPan(pan, { w: W * s, h: H * s }, measured) });
    }
  };

  const endGesture = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    const wasGesture = (g.mode === "pan" && g.moved) || g.mode === "pinch";
    g.pointers.delete(e.pointerId);
    g.mode = "none";
    if (wasGesture) g.suppressClick = true;
  };

  const onHostClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gesture.current.suppressClick) {
      gesture.current.suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const stepZoom = (factor: number) => {
    const focal = { x: measured.w / 2, y: measured.h / 2 };
    setFollowId(null);
    setView((v) => {
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
      const pan = computePanForZoom(newZoom, focal, v, fitScale);
      const s = fitScale * newZoom;
      return { zoom: newZoom, pan: clampPan(pan, { w: W * s, h: H * s }, measured) };
    });
  };

  const resetZoom = () => {
    setFollowId(null);
    setView({ zoom: MIN_ZOOM, pan: { x: 0, y: 0 } });
  };

  return (
    <div
      ref={hostRef}
      className={styles.host}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
      onClickCapture={onHostClickCapture}
      onDoubleClick={resetZoom}
    >
      <div
        className={styles.canvas}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
        <div className={styles.rotate} data-flip={flip}>
          {station.rails.map((r) => (
            <div key={r.top} className={styles.rail} style={{ top: r.top }} />
          ))}

          <div className={styles.trainField} aria-hidden>
            {trains.map((tr) => (
              <div
                key={tr.top}
                className={styles.train}
                data-dir={tr.dir}
                style={{
                  top: tr.top,
                  animationDuration: `${tr.dur}s`,
                  animationDelay: `${tr.delay}s`,
                }}
              />
            ))}
          </div>

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

          <div className={`${styles.noEsc} ${styles.upright}`} style={station.noEscalatorBox}>
            {station.noEscalator[lang]}
          </div>

          {/* The tunnel bridges over the tracks and platforms, so it paints
              after them — but under the entrance labels, escalators and lifts. */}
          <div className={styles.tunnel} />

          <div className={`${styles.end} ${styles.endTop} ${styles.upright}`}>
            {station.ends.top[lang]}
          </div>
          <div className={`${styles.end} ${styles.endBottom} ${styles.upright}`}>
            {station.ends.bottom[lang]}
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

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlBtn}
          aria-label={t.zoomIn}
          onClick={(e) => {
            e.stopPropagation();
            stepZoom(ZOOM_STEP);
          }}
          disabled={view.zoom >= MAX_ZOOM}
        >
          +
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          aria-label={t.zoomOut}
          onClick={(e) => {
            e.stopPropagation();
            stepZoom(1 / ZOOM_STEP);
          }}
          disabled={view.zoom <= MIN_ZOOM}
        >
          −
        </button>
      </div>
    </div>
  );
}
