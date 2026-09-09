# Maintaining

One-time and occasional maintainer tasks. Day-to-day contribution flow is in
[CONTRIBUTING.md](../.github/CONTRIBUTING.md).

## One-time GitHub setup

All done — kept as a record in case the repo is ever recreated.

- [x] Fill in the enforcement contact in [CODE_OF_CONDUCT.md](../.github/CODE_OF_CONDUCT.md).
- [x] **Settings → General**: set Description, Website, and Topics
      (`gh repo edit --description "…" --homepage "https://…" --add-topic nextjs --add-topic …`).
- [x] **Settings → General → Pull Requests**: allow **merge commits** and enable
      **"Allow auto-merge"**. PRs merge with a merge commit (not squash) so the
      individual branch commits are what `semantic-release` reads; auto-merge is
      used by the Dependabot patch auto-merge workflow.
- [x] **Settings → Deploy keys**: add the public half of an SSH deploy key with
      **"Allow write access"** and put its private half in the
      `SEMANTIC_RELEASE_DEPLOY_KEY` secret. `semantic-release` pushes the
      version-bump commit back to `main` with this key so it authenticates as the
      key and can bypass branch protection (a `GITHUB_TOKEN` push can't). See
      [`.github/workflows/release.yml`](../.github/workflows/release.yml).
- [x] **Settings → Secrets and variables → Actions**: optionally set `GH_TOKEN`
      (the release job falls back to `GITHUB_TOKEN`) for the GitHub API calls
      `@semantic-release/github` makes.
- [x] **Settings → Code security**: enable Dependabot alerts, Dependabot security
      updates, secret scanning, push protection, and **Private vulnerability
      reporting** (the SECURITY.md advisory link depends on it).
- [x] **Settings → Rules → Rulesets** (or Branch protection) on `main`: require the
      `CI` status check and require a PR before merging.
- [x] Flip the repo to **public**.

## Releases

Automatic. [`semantic-release`](https://github.com/semantic-release/semantic-release)
runs on every push to `main`
([`.github/workflows/release.yml`](../.github/workflows/release.yml),
config in [`.releaserc.json`](../.releaserc.json)): it analyses the
Conventional-Commit messages since the last tag and, when something is
releasable, bumps the version, updates `CHANGELOG.md`, commits both back to
`main`, tags (`roltrapstuk-v<version>`), and publishes a GitHub Release. A push
with no releasable commits is a no-op. **There is no release PR to merge.**

`fix:` → patch, `feat:` → minor, breaking change → major (`!` / `BREAKING CHANGE:`
footer on any type, or the `breaking:` type as shorthand). Each PR gets a
`Release preview` comment showing the version and notes the merge will publish.
The package is `private`, so nothing is published to npm.

## Deploy

Vercel's Git integration builds every push (production on `main`, previews on
PRs). Add the Neon integration once (Storage tab) so `DATABASE_URL` is set in
production — the `reports` table self-creates on first use
([`db/schema.sql`](../db/schema.sql) is the same DDL, kept for reference). Running
`npm run db:seed` against the production `DATABASE_URL` gives a non-empty first
impression.
