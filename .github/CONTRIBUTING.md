# Contributing

Thanks for helping keep the escalators honest.

## Ways to help

- **Report a wrong status _in the app itself_**, not here — that's the whole point.
- **Bugs and ideas** for the app: open an [issue](https://github.com/PascalRoose/roltrapstuk/issues).
- **Code**: small fixes and clearly-scoped features are welcome as PRs. For
  anything larger, open an issue first so we can agree on the approach.

## Development

Requires Node ≥ 20.9 (`.nvmrc` pins 22).

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm install` also installs the Git hooks (via Husky): **pre-commit** runs
`lint-staged` (Prettier + ESLint on staged files); **pre-push** runs `typecheck`
and the tests. Bypass with `--no-verify` when you need to.

### Dev container

There's a [dev container](../.devcontainer/) (VS Code / GitHub Codespaces) with
Node 22 and a Postgres service already wired up — open the repo in the container
and `DATABASE_URL` points at it, so `npm run dev` and `npm run db:seed` work
against real Postgres with no setup.

### Database

No database is needed locally — an in-memory store is used when `DATABASE_URL`
is unset (reports reset on restart). To work against real Postgres, put a Neon
connection string in `.env.local` (or use the dev container).

Before opening a PR:

```bash
npm run format     # prettier --write
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs all of these on Node 20 and 22.

## Commits and PR titles

This repo uses [Conventional Commits](https://www.conventionalcommits.org/).
`release-please` reads them to produce the changelog and version bumps, so the
**PR title** must be a conventional message (it's checked in CI and becomes the
squash-merge commit):

```
feat: add Utrecht Centraal
fix: undo now clears the confirmation on desktop
docs: explain the in-memory fallback
```

While the project is pre-1.0, `feat:` bumps the minor version and `fix:` the
patch version.

## Adding a station

See the step-by-step guide: [`.github/skills/add-station.md`](skills/add-station.md).
In short: add a `StationDef` under `lib/stations/` (copy `denbosch.ts`), register
it in `lib/stations/index.ts`, and it gets a `/<slug>` route automatically.

## Scope

roltrapstuk is deliberately small: one tap to read, one tap to report, no
accounts, no personal data. Changes that keep it that way have the easiest path in.
