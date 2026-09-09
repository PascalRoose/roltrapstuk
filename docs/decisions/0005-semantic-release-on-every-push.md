# 0005. semantic-release on every push to `main`

- **Status:** Accepted
- **Date:** 2026-09-09

## Context

A solo-maintained project that should still ship versioned releases with a
changelog, without manual version bumps, tag ceremony, or a release-PR to babysit.

## Decision

[`semantic-release`](https://github.com/semantic-release/semantic-release) runs in
CI on every push to `main` ([`.github/workflows/release.yml`](../../.github/workflows/release.yml),
config in [`.releaserc.json`](../../.releaserc.json)). It reads the Conventional
Commit messages since the last tag and, when something is releasable, bumps the
version, writes `CHANGELOG.md`, commits both back to `main`, tags
`roltrapstuk-v<version>`, and publishes a GitHub Release.

There is **no release PR**. PRs merge as merge commits (not squash) so the
individual commits are what get analysed. `commitlint` enforces the message
format on every PR commit; a `Release preview` comment shows what the merge will
publish. The workflow pushes to `main` over an SSH deploy key so the version-bump
commit can bypass branch protection, and that commit carries `[skip ci]`.

`fix:` → patch, `feat:` → minor, breaking change → major (`!` / `BREAKING CHANGE:`
footer, or the `breaking:` type as shorthand).

## Consequences

- Releases are effectively free; the changelog is always current; every fix ships
  the moment it lands.
- Commit discipline is mandatory — but it's enforced, not hoped for.
- No batching and no hand-curated release notes; the changelog is exactly the
  commit history.
- Operational cost: a deploy-key secret (`SEMANTIC_RELEASE_DEPLOY_KEY`), an
  `insteadOf` git rewrite in the workflow, and the `[skip ci]` guard to avoid a
  release loop.
- `conventional-changelog-conventionalcommits` is pinned to v8 (commit
  `20e72dc`) — v10 fails at release time with a "Missing helper" error against the
  bundled `conventional-changelog-writer`.

## Alternatives considered

- **release-please.** Keeps a "chore: release" PR open to review before cutting a
  release. This was the original plan (see [maintaining.md](../maintaining.md) —
  now corrected). Rejected: the review step adds nothing for a solo maintainer
  and the PR just accumulates.
- **Manual `npm version` + `git tag`.** Toil, and the kind of thing that gets
  skipped.
