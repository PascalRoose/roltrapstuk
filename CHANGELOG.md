# Changelog

All notable changes to this project are documented here. From 0.1.0 onward this
file is maintained by [semantic-release](https://github.com/semantic-release/semantic-release)
from [Conventional Commits](https://www.conventionalcommits.org/).

## [1.0.0](https://github.com/PascalRoose/roltrapstuk/compare/roltrapstuk-v0.2.0...roltrapstuk-v1.0.0) (2026-09-08)

### ⚠ BREAKING CHANGES

* first major release ([918e739](https://github.com/PascalRoose/roltrapstuk/commit/918e739bbf9c629a717e973ba65995d088812260))

### Bug Fixes

* preserve commit-analyzer options in release preview dry-run ([0bf414e](https://github.com/PascalRoose/roltrapstuk/commit/0bf414e22647b461333285cb89d6c5b924dfa940))

## [0.2.0](https://github.com/PascalRoose/roltrapstuk/compare/roltrapstuk-v0.1.2...roltrapstuk-v0.2.0) (2026-09-08)

### Features

* add orange traffic light ([#19](https://github.com/PascalRoose/roltrapstuk/issues/19)) ([963173f](https://github.com/PascalRoose/roltrapstuk/commit/963173f74b7ee78c3c28135feba4cddf6c9e7a23))
* add subtle ambient motion to the station view ([#17](https://github.com/PascalRoose/roltrapstuk/issues/17)) ([cb1bc7c](https://github.com/PascalRoose/roltrapstuk/commit/cb1bc7ce2ac0eb108049ddff248cac081bf2e39b))
* open infoscreen upon first visit ([#16](https://github.com/PascalRoose/roltrapstuk/issues/16)) ([7261cfd](https://github.com/PascalRoose/roltrapstuk/commit/7261cfd0d297a896c2ced82e9ea2c805612a8fd0))

### Bug Fixes

* changed about text and removed the words 'again' ([#14](https://github.com/PascalRoose/roltrapstuk/issues/14)) ([f4d5385](https://github.com/PascalRoose/roltrapstuk/commit/f4d53859d04c66270694948d8e3781df7147a949))
* pin conventional-changelog preset to writer 8 compatible major ([d8a88b8](https://github.com/PascalRoose/roltrapstuk/commit/d8a88b8e952a1bf8bfe4d8842605c1330f9e3d3f))
* split spoor 7 into a and b ([#18](https://github.com/PascalRoose/roltrapstuk/issues/18)) ([ce1e020](https://github.com/PascalRoose/roltrapstuk/commit/ce1e0208913be8a50d272539e74d17e320709b57))

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
