---
name: roltrapstuk
description: Project context and working agreements for AI agents on the roltrapstuk repo
---

# Working on roltrapstuk

Crowdsourced escalator/lift status for 's-Hertogenbosch station. Next.js App
Router, TypeScript, Postgres (Neon) on Vercel. Read [README.md](../../README.md)
and [CONTRIBUTING.md](../CONTRIBUTING.md) first — this file is the short version
plus the things that trip agents up.

For recurring tasks, check [`.github/skills/`](../skills/) first — step-by-step
playbooks (e.g. adding a station).

## Commands

```bash
npm run dev          # local dev (http://localhost:3000)
npm run format       # prettier --write .
npm run lint         # eslint, --max-warnings 0
npm run typecheck    # tsc --noEmit
npm test             # vitest
npm run coverage     # vitest + v8 coverage (thresholds enforced)
npm run build        # next build
```

Before proposing a change as done, run `format`, `lint`, `typecheck`, `test`, and
`build`. CI runs all of them on Node 20 and 22.

## This is Next.js 16 (App Router)

APIs and conventions differ from older Next.js. When touching framework surface
area, check the bundled docs in `node_modules/next/dist/docs/` rather than relying
on memory. In particular: route `params` and `searchParams` are `Promise`s;
`headers()`/`cookies()` are async; route handlers live in `app/**/route.ts`.

## Architecture

| Path | Responsibility |
| --- | --- |
| `lib/stations/` | Per-station definitions: unit list, map geometry (against a 402×620 canvas), EN/NL copy. Add a station here + register in `index.ts` → it gets a `/<slug>` route. See the [`add-station`](../skills/add-station.md) playbook. |
| `lib/aggregate.ts` | Folds the append-only report log into per-unit state (status = most recent report; no reports = working). Pure, well-tested. |
| `lib/store.ts` | Data access. Postgres via `@neondatabase/serverless` when `DATABASE_URL` is set, else an in-memory store (dev only; refused in production). |
| `lib/stationState.ts` | `store` + `aggregate` → the shape the client renders. |
| `app/api/` | `GET /api/stations/[station]`, `POST` / `DELETE /api/reports`. |
| `app/[station]/page.tsx` | Server component; `force-dynamic`; reads state and renders `StationView`. |
| `components/StationView.tsx` | Top-level client component: SWR polling, selection, report/undo, modals. |
| `components/StationMap.tsx` | The tunnel schematic. Renders a fixed 402×620 canvas scaled to fit via a `ResizeObserver`; `flip` rotates it 180° with counter-rotated labels. |
| `hooks/` | `useSettings` (localStorage + OS theme, via `useSyncExternalStore`), `useReporterId` (anon per-device id). |

## Conventions & gotchas

- **Conventional Commits** — the PR title is checked in CI and drives
  release-please. Pre-1.0: `feat:` bumps minor, `fix:` bumps patch.
- **Prettier owns formatting** (`.prettierrc.json`); ESLint is `eslint-config-next`
  + `eslint-config-prettier`. A pre-commit hook runs `lint-staged`.
- **Tests**: pure logic in `lib/*.test.ts`; the route handlers are tested against
  the in-memory store. `vitest.config.mts` aliases `server-only` to a stub so
  server modules import under Node — keep that alias if you add server-only code.
- **No secrets in the repo.** `.env.example` documents the env vars
  (`DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`). Local dev works with neither set.
- **Theme/lang** are applied pre-hydration by an inline script in
  `app/layout.tsx`; `<html>` has `suppressHydrationWarning` for that reason.
- **Security headers** live in `next.config.ts`. A full script CSP is a known
  follow-up (needs a nonce/middleware).

## Scope

Keep it small: one tap to read, one tap to report, no accounts, no personal data.
