# AGENTS.md

Full guidance for AI agents lives in
[`.github/agents/roltrapstuk.md`](.github/agents/roltrapstuk.md). Read it before
making changes. Step-by-step playbooks for recurring tasks are in
[`.github/skills/`](.github/skills/).

Quick reference:

- **Next.js 16, App Router.** Conventions differ from older versions — consult
  `node_modules/next/dist/docs/` for framework APIs rather than memory.
- Run `npm run format && npm run lint && npm run typecheck && npm test && npm run build`
  before treating a change as done. CI runs the same on Node 20 and 22.
- **Conventional Commits** (the PR title is enforced and drives releases).
  Prettier owns formatting; a pre-commit hook runs `lint-staged`.
- Data model: an append-only report log; a unit's status is its most recent
  report. Core logic is in `lib/` (`aggregate.ts`, `store.ts`, `stationState.ts`).
