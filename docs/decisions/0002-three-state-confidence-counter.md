# 0002. Three-state confidence counter for unit status

- **Status:** Accepted
- **Date:** 2026-09-09

## Context

Folding the report log ([ADR 0001](0001-append-only-report-log.md)) into a status
needs a rule. Requirements pull in different directions:

- A single mistaken or malicious report must not flip a unit's displayed status.
- A genuine breakage should still surface quickly, without needing a quorum.
- Travellers report in both directions ("it's broken" and "it's working again"),
  so the rule has to be symmetric.
- It has to stay simple enough to hold in your head and to test exhaustively.

## Decision

A three-state traffic light per unit: `ok` (green), `unsure` (orange), `out`
(red).

A confidence counter starts at `+1` and is clamped to `[-1, +1]`. Each report in
chronological order moves it one step: `ok` → `+1`, `out` → `-1`. The sign maps
to the status: `> 0` is `ok`, `< 0` is `out`, `0` is `unsure`.

So from a working unit, one `out` report reaches `unsure`; a second settles it to
`out`. One report the other way always cancels an `unsure`. Consecutive reports
the same way just hold the clamp. A unit with no reports is `ok`. There is no
time decay.

## Consequences

- One bad report only ever reaches `unsure` — visible, but not a false alarm.
- Breaking and fixing use the identical mechanism.
- The fold is a four-line loop and every transition has a test.
- `unsure` is genuinely useful to the reader: "someone flagged this, unconfirmed".
- **No self-healing.** If a unit is fixed but nobody reports `ok`, it stays `out`
  indefinitely. Accepted — a stale `out` is safer than a stale `ok`, and the
  `last` timestamp shown in the UI hints at staleness.
- The counter clamp means the 3rd+ report the same way carries no weight; the
  model doesn't track "5 people say it's broken" vs "2".
- An abuser with two device ids can still settle a state. This model raises the
  cost, it doesn't prevent it ([ADR 0003](0003-anonymous-per-device-reporter-id.md)).

## Alternatives considered

- **Majority vote over a recent window.** Needs report volume this app won't have,
  and offers no natural "unsure" state.
- **Last report wins.** Too jumpy — one tap flips the map.
- **Time-decayed score.** More moving parts and tuning for no clear benefit at
  this traffic level.
