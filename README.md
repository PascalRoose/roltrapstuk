# roltrapstuk

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)
[![CodeQL](../../actions/workflows/codeql.yml/badge.svg)](../../actions/workflows/codeql.yml)

Crowdsourced escalator and lift status for **'s-Hertogenbosch** train station.

Half the escalators at 's-Hertogenbosch seem to be standing still, and nobody
publishes which ones. This app lets travellers keep it up to date: tap anything
on the station map to see the last report, then tap one button to say whether it
is broken or running again. Status comes only from travellers — there is no
official feed.

- **Map** of the pedestrian tunnel with every escalator and lift as a tappable
  chip (green = working, red = broken).
- **One-tap reporting** with a 15-minute undo window.
- **English / Dutch**, light / dark / system theme, and a map-orientation toggle
  (City center up ↔ Paleiskwartier up). Preferences persist per device.
- Responsive: a bottom-sheet layout on mobile, a side panel on desktop.

## Stack

- Next.js (App Router) + TypeScript
- Postgres via `@neondatabase/serverless` (Vercel → Storage → Neon)
- SWR for polling the status endpoint (every 20s + on focus)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

Open <http://localhost:3000>. The root redirects to `/denbosch`.

Prefer a container? Open the repo in the [dev container](.devcontainer/) (VS Code
or GitHub Codespaces) — Node 22 and a Postgres service are already wired up, and
`npm install` installs the Git hooks (pre-commit `lint-staged`, pre-push
`typecheck` + tests).

## Checks

```bash
npm run lint        # eslint (flat config, --max-warnings 0)
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run coverage    # vitest + v8 coverage (thresholds enforced)
```

CI runs `npm run format:check`, `lint`, `typecheck`, `coverage` and `build` on
Node 20 and 22 for every push and PR (`.github/workflows/ci.yml`). Also wired up:

- **CodeQL** SAST — `security-and-quality` queries, weekly + on every change.
- **Dependency review** on PRs and **Dependabot** (npm + GitHub Actions, weekly).
- **gitleaks** secret scanning over the full history.

Tests cover the report-log aggregation (`lib/aggregate.ts`), relative-time
formatting, the i18n dictionaries, and the `/api/reports` route handlers
(validation + undo, against the in-memory store).

## Releases

Versioning follows [Conventional Commits](https://www.conventionalcommits.org/)
via [release-please](https://github.com/googleapis/release-please): merging
`feat:` / `fix:` commits to `main` makes the bot open a release PR that bumps the
version and updates [`CHANGELOG.md`](CHANGELOG.md); merging that PR tags the
release and publishes GitHub Release notes. Pre-1.0, `feat:` bumps the minor and
`fix:` the patch. See [CONTRIBUTING.md](.github/CONTRIBUTING.md).

### Database

Set `DATABASE_URL` (or `POSTGRES_URL`) to a Postgres connection string. The
`reports` table is created automatically on first use; `db/schema.sql` has the
definition if you'd rather run it yourself.

**Without a database** the app falls back to an in-memory store so `npm run dev`
works out of the box — reports are lost on restart, and this fallback is refused
in production.

Optional demo data:

```bash
DATABASE_URL=... npm run db:seed
```

## Data model

`reports` is an append-only log — one row per traveller report
(`station`, `unit_id`, `kind` ∈ `out | ok`, `reporter_id`, `created_at`). A
unit's current status is simply its most recent report; a unit with no reports
is assumed to be working. `reporter_id` is a random per-device id kept in
`localStorage`, used only to attribute and undo a report.

## API

| Method   | Route                        | Purpose                                    |
| -------- | ---------------------------- | ------------------------------------------ |
| `GET`    | `/api/stations/[station]`    | Aggregated per-unit status. `?r=` = reporter id (drives `canUndo`). |
| `POST`   | `/api/reports`               | File a report. Body: `{ station, unitId, kind, reporterId }`. |
| `DELETE` | `/api/reports`               | Undo your latest report for a unit (within 15 min). Body: `{ station, unitId, reporterId }`. |

Both write routes return the fresh station state.

## Deploy

Connect the GitHub repo in the Vercel dashboard — Vercel's Git integration builds
and deploys every push and PR, no deploy workflow needed. Add a Neon database from
the Storage tab (it sets `DATABASE_URL` automatically). No other configuration.

## Adding a station

Add a `StationDef` under `lib/stations/`, register it in
`lib/stations/index.ts`, and it gets its own route at `/<slug>`. Unit geometry is
expressed against the 402 × 620 canvas that `StationMap` scales to fit.

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) and the
[Code of Conduct](.github/CODE_OF_CONDUCT.md). AI agents: start with
[`.github/agents/roltrapstuk.md`](.github/agents/roltrapstuk.md). Security
issues: please use a
[private advisory](https://github.com/PascalRoose/roltrapstuk/security/advisories/new)
(see [SECURITY.md](.github/SECURITY.md)).

## Layout

```
app/                        routes, API handlers, metadata (robots/sitemap/manifest)
  [station]/page.tsx        server component — reads state, renders StationView
lib/
  stations/                 per-station definitions (units, map geometry, copy)
  aggregate.ts              report log → per-unit status
  store.ts                  Postgres | in-memory
  strings.ts                en / nl copy
components/                 StationView, StationMap, Header, DetailPanel
  modals/                   Modal shell, Info/Settings, SegmentedControl
hooks/                      useSettings (localStorage + OS theme), useReporterId
db/ scripts/                schema + seed script
test/                       vitest helpers (unit tests are colocated as *.test.ts)
.devcontainer/              VS Code / Codespaces container (Node 22 + Postgres)
.github/                    workflows, community-health files, agents/, skills/
```

## License

[MIT](LICENSE) © Pascal Roose. Not affiliated with NS, ProRail, or the
municipality of 's-Hertogenbosch.
