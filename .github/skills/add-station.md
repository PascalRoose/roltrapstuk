---
title: Add a station
summary: Write a station's StationDef (units, tunnel-map geometry, EN/NL copy), register it, verify.
---

# Add a station

A station is **one file** under `lib/stations/` plus a one-line registration in
`lib/stations/index.ts`. It then gets a `/<slug>` route, a sitemap entry, and
works with the existing API and UI unchanged.

## Steps

1. **Create `lib/stations/<slug>.ts`** exporting a `StationDef` (the type is in
   `lib/types.ts`). Start from the template below and from
   `lib/stations/denbosch.ts` as the worked example.
   - `slug`: URL-friendly short name — lowercase, letters only, how locals say it
     (`denbosch`, `utrecht`, `eindhoven`). This is the route.
   - `name`: the real station name for display (`'s-Hertogenbosch`,
     `Utrecht Centraal`).
2. **Register** it in `lib/stations/index.ts`: import the export and add it to the
   `STATIONS` map. Leave `DEFAULT_STATION` alone unless asked to change it.
3. **Verify**:
   ```bash
   npm run typecheck && npm test && npm run build
   npm run dev            # then open /<slug>
   ```
   Every chip must sit inside the map with no overlap; the `a`/`b` track labels
   should line up with the platform plates; arrows should point the way the stair
   actually carries a traveller.
4. If the layout is non-trivial, add a short note to the file's top comment
   describing the real-world layout (see `denbosch.ts`).

## The map coordinate system

`components/StationMap.tsx` renders a fixed **402 × 620** canvas and scales it to
fit. Every `box`, rail `top`, plate `top`, and label `top` is a pixel coordinate
in that space. Key landmarks (from `components/StationMap.module.css`):

- **Tunnel**: the vertical channel at **x 150–252**. "Up" / "toward the tunnel"
  is the reference direction for arrows.
- **Left of tunnel** (x < ~148) and **right of tunnel** (x > ~254): escalators and
  lifts sit here, next to the platform they serve. The `a` half of a platform is
  on one side, `b` on the other.
- `rails`: dashed platform-edge lines spanning the full width at a given `top`.
- `plates`: grey blocks (`left:20 right:20`, height 62) behind a group of tracks.
- `trackLabels`: the small `1a` / `3b` chips pinned to the far left (`side:"l"`)
  or right (`side:"r"`) at a given `top`.
- **Entrance** escalators (top and bottom of the map) are tall and narrow
  (~`26 × 56`), glyph `▲` (up, toward tunnel) or `▼` (down).
- **Platform** escalators are wide and short (~`62 × 22`), glyph `◀` or `▶` —
  the arrow points the way the stair carries you (toward the tunnel = up).
- **Lifts** are ~`34 × 34`, `type: "lift"` (no glyph — the component draws the
  lift mark).

Work top-to-bottom: for each platform group place the plate, its rails and a/b
labels, then the up/down escalator pair on each side, then the lift. Keep the
vertical rhythm consistent with `denbosch.ts` (~140 px between platform groups,
entrance blocks near `top:32` and `top:528`).

## StationDef template

```ts
import type { StationDef } from "@/lib/types";

/**
 * <Station name> — <one line on the real layout: how many entrances, where the
 * tunnel runs, which tracks cross it>.
 * Geometry is against the 402 x 620 canvas StationMap scales to fit.
 */
export const <camelName>: StationDef = {
  slug: "<slug>",
  name: "<Display Name>",
  kicker: { en: "TRAIN STATION", nl: "TREINSTATION" },
  ends: {
    top: { en: "<NORTH SIDE>", nl: "<NOORDKANT>" },
    bottom: { en: "<SOUTH SIDE>", nl: "<ZUIDKANT>" },
  },
  // Only if a platform has no escalator (lift only):
  noEscalator: { en: "NO ESCALATOR", nl: "GEEN ROLTRAP" },
  noEscalatorBox: { left: 86, top: 167, width: 62, height: 46 },

  rails: [{ top: 229 }, { top: 284 } /* … one per platform edge */],
  plates: [{ top: 159 } /* … one per track group */],
  trackLabels: [
    { side: "l", top: 224, text: "1a" },
    { side: "r", top: 224, text: "1b" },
    // …
  ],

  units: [
    {
      id: "F1", // stable id: F/B = front/back entrance, E = platform escalator, L = lift
      type: "escalator",
      glyph: "▼",
      name: { en: "Front entrance · up", nl: "Voorzijde · omhoog" },
      sub: { en: "<from> → <to>", nl: "<van> → <naar>" },
      box: { left: 172, top: 32, width: 26, height: 56 },
    },
    {
      id: "L1",
      type: "lift",
      name: { en: "Front entrance lift", nl: "Lift voorzijde" },
      sub: { en: "<a> ↔ <b>", nl: "<a> ↔ <b>" },
      box: { left: 252, top: 43, width: 34, height: 34 },
    },
    // …
  ],
};
```

## Copy rules

- Every user-facing string is `{ en, nl }`. Match `denbosch.ts`: `sub` reads
  `"<origin> → <destination>"` for escalators, `"<a> ↔ <b>"` for lifts.
- Station data owns only station strings. Do **not** touch `lib/strings.ts` —
  that's app chrome (buttons, hints), shared across stations.
- `id`s are opaque and permanent — they key the report log in the database.
  Never renumber existing ids; only append.
