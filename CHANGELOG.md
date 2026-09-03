# Changelog

All notable changes to this project are documented here. From 0.1.0 onward this
file is maintained by [release-please](https://github.com/googleapis/release-please)
from [Conventional Commits](https://www.conventionalcommits.org/).

## [0.1.3](https://github.com/PascalRoose/roltrapstuk/compare/roltrapstuk-v0.1.2...roltrapstuk-v0.1.3) (2026-09-03)


### Features

* add subtle ambient motion to the station view ([#17](https://github.com/PascalRoose/roltrapstuk/issues/17)) ([cb1bc7c](https://github.com/PascalRoose/roltrapstuk/commit/cb1bc7ce2ac0eb108049ddff248cac081bf2e39b))
* open infoscreen upon first visit ([#16](https://github.com/PascalRoose/roltrapstuk/issues/16)) ([7261cfd](https://github.com/PascalRoose/roltrapstuk/commit/7261cfd0d297a896c2ced82e9ea2c805612a8fd0))


### Bug Fixes

* changed about text and removed the words 'again' ([#14](https://github.com/PascalRoose/roltrapstuk/issues/14)) ([f4d5385](https://github.com/PascalRoose/roltrapstuk/commit/f4d53859d04c66270694948d8e3781df7147a949))

## [0.1.2](https://github.com/PascalRoose/roltrapstuk/compare/roltrapstuk-v0.1.1...roltrapstuk-v0.1.2) (2026-09-03)


### Features

* make the station map zoomable and pannable ([#11](https://github.com/PascalRoose/roltrapstuk/issues/11)) ([4a611bc](https://github.com/PascalRoose/roltrapstuk/commit/4a611bc49d73e0a4505edfbf65acc1f1127912f7))


### Bug Fixes

* scale station map to fit viewport height ([#8](https://github.com/PascalRoose/roltrapstuk/issues/8)) ([644b616](https://github.com/PascalRoose/roltrapstuk/commit/644b616d82b73d435713cd7f85f3cc0c6d1c7a0d))

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
