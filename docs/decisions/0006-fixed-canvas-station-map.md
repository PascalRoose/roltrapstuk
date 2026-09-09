# 0006. Fixed 402×620 canvas for the station map

- **Status:** Accepted
- **Date:** 2026-09-09

## Context

The core screen is a schematic of the pedestrian tunnel with every escalator,
lift, rail, platform plate and track label placed just so. It has to scale to any
viewport, support a 180° flip (city-centre up ↔ Paleiskwartier up), and be
authorable per station without writing layout code each time
([add-station playbook](../../.github/skills/add-station.md)).

## Decision

Every geometric value in a `StationDef` — `Box` (`left`/`top`/`width`/`height`),
`RailDef.top`, `TrackLabelDef.top`, `PlateDef.top` — is an absolute pixel
coordinate in a fixed **402 × 620** space.

`components/StationMap.tsx` lays that space out once as positioned HTML elements,
then scales the whole thing to fit its container via a `ResizeObserver`. `flip`
rotates the canvas 180° and counter-rotates the labels so text stays upright.

## Consequences

- A station is pure data — a list of coordinates, no per-station layout code.
- Responsive scaling is a single CSS transform; nothing reflows.
- Authoring is predictable: open the reference image, read off pixels, done.
- The elements are real HTML (not SVG), so chips are focusable and tappable
  without extra work.
- Hand-authoring coordinates is fiddly and easy to get slightly wrong.
- No reflow means extreme aspect ratios just letterbox the canvas.
- `402 × 620` is a load-bearing constant, referenced in the types, the component,
  and several docs — changing it is a cross-cutting edit.

## Alternatives considered

- **SVG with a `viewBox`.** Same coordinate approach, but the interaction and
  accessibility story for the tappable chips is easier with HTML elements.
- **A fl/grid layout engine.** Can't express the tunnel geometry (a central
  channel with units hanging off specific platform positions) without a pile of
  bespoke rules.
