---
title: Add or change an API route
summary: Route-handler conventions — force-dynamic, no-store, the parse() validation pattern, in-memory-store tests, and docs/api.md.
---

# Add or change an API route

Routes live in `app/api/**/route.ts` (Next.js 16 App Router — see
[`.github/agents/roltrapstuk.md`](../agents/roltrapstuk.md)). There are three
today; cut new ones from the same cloth. The public contract is
[`docs/api.md`](../../docs/api.md).

## Steps

1. **Create `app/api/<path>/route.ts`** with one exported async handler per
   method, and:
   ```ts
   export const dynamic = "force-dynamic";
   ```
   Status is always live — never cached or statically rendered.
2. **Read dynamic params as promises** —
   `{ params }: { params: Promise<{ … }> }`, then `await params`. Same for
   `headers()` / `cookies()` if you use them.
3. **Validate in a `parse()` helper** that takes the raw body and returns either
   the clean fields or `{ error: "<reason>" as const }` — mirror
   `app/api/reports/route.ts`. Reject a non-JSON body with
   `400 {"error":"invalid json"}` before calling it.
4. **Match the status conventions** of the existing routes:
   - `400` for any body-validation failure — *including* an unknown station or
     unit named in the body of a write.
   - `404` only for a bad resource in the URL path (see the `GET` route).
   - `409` for a conflicting write.
   - Success: `Response.json(body, { headers: { "cache-control": "no-store" } })`.
5. **Data access goes through `getStore()`** (`lib/store.ts`) — never import
   `@neondatabase/serverless` directly. If you return station state, build it
   with `readStationState()`.
6. **Test** in `app/api/<path>/route.test.ts` against the in-memory store: the
   test env has no `DATABASE_URL`, so `getStore()` is in-memory. Truncate
   `globalThis.__roltrapReports` in `beforeEach` — copy the header comment from
   `route.test.ts`. Cover the happy path, every `parse()` rejection, and the
   non-JSON body.
7. **Document it in `docs/api.md`** — params, body rules, every error string with
   its status, the response shape, a curl example. Keep API docs out of the
   README.
8. **Verify**: `npm run typecheck && npm test && npm run build`.

## Gotchas

- `server-only` modules (`lib/store.ts`, `lib/stationState.ts`) must never reach
  a client bundle. Route handlers are server-only already — a *component*
  importing them is the mistake.
- `vitest.config.mts` aliases `server-only` to a stub so these modules import
  under Node. Keep the alias if you add a new server-only module.
