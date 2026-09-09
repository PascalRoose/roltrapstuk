---
title: Write an ADR
summary: Record an architecture decision in docs/decisions/ — number it, keep it immutable, update the index.
---

# Write an ADR

An architecture decision record captures a choice that shapes the codebase and
isn't obvious from reading it, together with the reasoning. They live in
[`docs/decisions/`](../../docs/decisions/) and are **immutable**: a decision that
later changes gets a new ADR that supersedes the old one — never an edit to the
old record.

**Write one when** you pick between real alternatives for something structural:
the data model, a dependency with lock-in, the release flow, an API-shape
convention — or when you reverse an earlier ADR.

**Skip it for** reversible local choices, formatting, or anything a code comment
already explains.

## Steps

1. **Pick the number** — the next integer after the highest in
   `docs/decisions/`, zero-padded to four digits (`0007`).
2. **Copy `docs/decisions/TEMPLATE.md`** to
   `docs/decisions/NNNN-short-kebab-title.md`. The title is a specific imperative
   phrase ("Move report storage to X"), not "X decision".
3. **Fill the sections** — aim for one screen:
   - **Status** — `Accepted` for a decision being taken now; `Proposed` only if
     it needs sign-off first.
   - **Date** — today, `YYYY-MM-DD`.
   - **Context** — the forces: what problem, what constraints, why it's a real
     choice. No solution here.
   - **Decision** — what we're doing, in plain declarative sentences.
   - **Consequences** — what follows, *including* the costs, limits and new risks
     being accepted. An ADR with only upsides is unfinished.
   - **Alternatives considered** — the options rejected, and why.
4. **If this ADR supersedes an earlier one**, set the old ADR's Status to
   `Superseded by [NNNN](NNNN-...)`. That is the only permitted edit to a past
   record.
5. **Add a row** to the table in `docs/decisions/README.md`.
6. **Cross-link** — if the ADR governs code that also has prose docs
   (`docs/architecture.md`, `docs/api.md`), link the ADR from there.
7. Run `npm run format` so Prettier normalises the Markdown. No other build step.

## Conventions

- One decision per record. Deciding two things is two ADRs.
- Don't rewrite an ADR to match how things turned out — supersede it.
- Reference a commit hash or PR number where a consequence actually played out in
  the history (see `0004` and `0005`).
