# 0004. Neon serverless driver + in-memory fallback store

- **Status:** Accepted
- **Date:** 2026-09-09

## Context

The app deploys to Vercel, where request handlers are short-lived and a
traditional connection pool is a liability. It should also run locally and in CI
with nothing configured. The data access surface is tiny — list, add, undo
([`lib/store.ts`](../../lib/store.ts)).

## Decision

Use `@neondatabase/serverless` — the `neon()` HTTP query function — against a Neon
database. Vercel's Neon integration sets `DATABASE_URL` (`POSTGRES_URL` is also
accepted).

`getStore()` picks the implementation at runtime: the Postgres-backed store when a
connection string is set, otherwise an in-memory store that keeps one array on
`globalThis`. The in-memory store throws if `NODE_ENV === "production"`. The
`reports` table and its index self-create on first query.

## Consequences

- No pooling story to get wrong on serverless; each query is an HTTP round trip.
- `npm run dev` and `npm test` work with zero configuration — tests exercise the
  route handlers against the in-memory store.
- **The driver speaks HTTP/WebSockets to a Neon endpoint, not the Postgres wire
  protocol.** A plain local or containerised Postgres does *not* work without a
  proxy. This broke the dev container, which pointed `DATABASE_URL` at a
  `postgres:` service — removed in commit `819e490`. Anyone wiring up local
  Postgres needs a Neon proxy or a different driver.
- The in-memory store resets on every restart and is not shared across processes
  or serverless instances — fine for dev, never for anything real.

## Alternatives considered

- **`pg` / `postgres` over TCP.** Works against any Postgres including a local
  container, but needs a deliberate pooling/connection strategy on Vercel.
  Reconsider if local-Postgres parity becomes important.
- **Prisma / Drizzle.** An ORM and a migration toolchain for a single
  three-column table is more machinery than the problem.
