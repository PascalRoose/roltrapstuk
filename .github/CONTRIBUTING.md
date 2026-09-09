# Contributing

Thanks for helping keep the escalators honest.

## Ways to help

- **Report a wrong status _in the app itself_**, not here — that's the whole point.
- **Bugs and ideas** for the app: open an [issue](https://github.com/PascalRoose/roltrapstuk/issues).
- **Code**: small fixes and clearly-scoped features are welcome as PRs. For
  anything larger, open an issue first so we can agree on the approach.

## Development

Requires Node ≥ 22.12 (`.nvmrc` pins 22).

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

CI runs all of these on Node 22 and 24.

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org/).
`semantic-release` reads the commits that land on `main` to produce the changelog
and version bumps, so **every commit message** must be a conventional message —
`commitlint` (config in [`commitlint.config.mjs`](../commitlint.config.mjs))
checks each one locally via the Husky `commit-msg` hook and again in CI on every
PR commit.

```
feat: add Utrecht Centraal
fix: undo now clears the confirmation on desktop
docs: explain the in-memory fallback
```

PRs are merged with a **merge commit** (not squashed), so the individual commits
are what get released — keep the branch history clean. A `Release preview`
comment on the PR shows the version and notes the merge will publish.

Every push to `main` runs the release workflow directly — there is no release
PR. It bumps the version, updates `CHANGELOG.md`, commits both back to `main`,
tags, and publishes a GitHub Release; a push with no releasable commits is a
no-op. `fix:` bumps the patch version, `feat:` the minor, and a breaking change
the major — either the standard `!` / `BREAKING CHANGE:` footer on any type, or a
`breaking:` type as shorthand.

## Adding a station

See the step-by-step guide: [`.github/skills/add-station.md`](skills/add-station.md).
In short: add a `StationDef` under `lib/stations/` (copy `denbosch.ts`), register
it in `lib/stations/index.ts`, and it gets a `/<slug>` route automatically.

## Scope

roltrapstuk is deliberately small: one tap to read, one tap to report, no
accounts, no personal data. Changes that keep it that way have the easiest path in.
