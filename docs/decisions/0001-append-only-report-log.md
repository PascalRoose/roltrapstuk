# 0001. Append-only report log, folded at read time

- **Status:** Accepted
- **Date:** 2026-09-09

## Context

The app tracks the status of escalators and lifts from many uncoordinated
traveller reports. It needs to answer "is this broken, and for how long", tolerate
conflicting reports, and let the rules for turning reports into a status evolve
without a data migration.

## Decision

Store every report as an immutable row in a single `reports` table (`station`,
`unit_id`, `kind` ∈ `out | ok`, `reporter_id`, `created_at`). Nothing is updated;
the only deletion is a reporter undoing their own report within 15 minutes
([ADR 0002](0002-three-state-confidence-counter.md),
[ADR 0003](0003-anonymous-per-device-reporter-id.md)).

Current status is not stored. `lib/aggregate.ts` folds the log for a station into
per-unit state on every read, as a pure function of the report list and the
station definition.

## Consequences

- Full history for free — "how long has it been down", auditability, the ability
  to replay.
- The derivation is pure and exhaustively unit-tested; changing the status rules
  is a code change with no migration.
- Writes are trivial (one `INSERT`) and never race.
- The table grows without bound. Acceptable at this scale (one small station,
  low traffic); a retention job can be added later without touching the model.
- Every read is `O(reports for the station)`. Fine for now; an index on
  `(station, created_at)` exists, and a materialised snapshot could be added if a
  station ever gets large.

## Alternatives considered

- **Store computed status per unit and mutate it.** Loses history, reintroduces
  write races, and every rule change becomes a backfill. Rejected.
- **Event log in a dedicated store (Kafka/EventStore/etc.).** Massively
  over-scoped for one Postgres table.
