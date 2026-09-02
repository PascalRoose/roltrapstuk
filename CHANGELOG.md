# Changelog

All notable changes to this project are documented here. From 0.1.0 onward this
file is maintained by [release-please](https://github.com/googleapis/release-please)
from [Conventional Commits](https://www.conventionalcommits.org/).

## [0.1.1](https://github.com/PascalRoose/roltrapstuk/compare/roltrapstuk-v0.1.0...roltrapstuk-v0.1.1) (2026-09-02)


### Features

* add GitHub link to the station header ([#7](https://github.com/PascalRoose/roltrapstuk/issues/7)) ([bbdf939](https://github.com/PascalRoose/roltrapstuk/commit/bbdf9392dbc685744e663564d6e8728c8206718a))
* crowdsourced escalator and lift status for 's-Hertogenbosch ([#1](https://github.com/PascalRoose/roltrapstuk/issues/1)) ([f19fd00](https://github.com/PascalRoose/roltrapstuk/commit/f19fd0076a719cca11f32d2cc9f262b971a498c2))

## 0.1.0 (2026-09-02)

Initial release.

### Features

- Interactive station map for 's-Hertogenbosch with every escalator and lift as a
  crowdsourced status chip (green = working, red = broken).
- One-tap "broken" / "working" reporting backed by Postgres, with a 15-minute
  undo window tied to an anonymous per-device id.
- English / Dutch, light / dark / system themes, and a map-orientation toggle;
  preferences persist per device.
- Responsive: bottom-sheet layout on mobile, side panel on desktop.

### Build / infra

- Next.js App Router + `@neondatabase/serverless`, deployable to Vercel with an
  in-memory fallback store for local development.
- CI (lint, format, typecheck, Vitest + coverage, build on Node 20 & 22), CodeQL,
  dependency review, Dependabot, and gitleaks secret scanning.
