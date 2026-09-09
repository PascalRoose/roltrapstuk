# 0003. Anonymous per-device reporter id, no accounts

- **Status:** Accepted
- **Date:** 2026-09-09

## Context

Two features need to know "who" filed a report: undo (only your own), and the
"one active report per unit per device" guard that stops one person hammering a
unit. But the project scope is explicit — no accounts, no personal data, one tap
to report.

## Decision

`hooks/useReporterId.ts` generates a random UUID the first time it's needed and
stores it in `localStorage` under `roltrapstuk.reporterId`. It is sent in the
body of every report and as `?r=` on status polls.

The server stores it in `reports.reporter_id` and uses it for exactly two things:
deriving each unit's `yours` field, and authorising an undo. It is never treated
as an identity, never logged for analytics, never shown to other users.

## Consequences

- No auth system, no session store, nothing that counts as personal data.
- Undo and per-device dedupe work.
- Clearing site data just mints a new id on the next visit — acceptable
  degradation.
- **The id is client-supplied and unverified.** It can be spoofed, rotated, or
  replayed trivially. The dedupe guard is a speed bump, not a control; abuse
  resistance really rests on [ADR 0002](0002-three-state-confidence-counter.md).
- Not stable across a person's devices or browsers — "your" report is
  per-browser.
- `reporter_id` is nullable in the schema so rows without one (older data, direct
  inserts) still aggregate.

## Alternatives considered

- **IP address.** Privacy-hostile, and station wifi / mobile NAT would collide
  many travellers onto one address.
- **Real accounts.** Directly against scope; kills the one-tap flow.
- **Signed cookie / token from the server.** Still not identity, and adds a
  key-management surface for no real gain over a random id.
