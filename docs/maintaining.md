# Maintaining

One-time and occasional maintainer tasks. Day-to-day contribution flow is in
[CONTRIBUTING.md](../.github/CONTRIBUTING.md).

## One-time GitHub setup

- [x] Fill in the enforcement contact in [CODE_OF_CONDUCT.md](../.github/CODE_OF_CONDUCT.md)
      (currently a `TODO` placeholder).
- [x] **Settings → General**: set Description, Website, and Topics
      (`gh repo edit --description "…" --homepage "https://…" --add-topic nextjs --add-topic …`).
- [x] **Settings → General → Pull Requests**: allow **squash merging only**, and set
      the squash commit message to *"Pull request title and description"*.
      (release-please and the PR-title check both assume squash merges.)
- [x] **Settings → Actions → General → Workflow permissions**: tick
      **"Allow GitHub Actions to create and approve pull requests"** — release-please
      cannot open its release PR without this.
- [x] **Settings → Code security**: enable Dependabot alerts, Dependabot security
      updates, secret scanning, push protection, and **Private vulnerability
      reporting** (the SECURITY.md advisory link depends on it).
- [x] **Settings → Rules → Rulesets** (or Branch protection) on `main`: require the
      `CI` status checks and require a PR before merging.
- [x] Flip the repo to **public**.

## First release (v0.1.0)

`.github/release-please-manifest.json` is pinned at `0.1.0`, so create that first release
by hand; release-please takes over from `0.1.1` / `0.2.0` onward:

```bash
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 --title "v0.1.0" --notes-from-file CHANGELOG.md
```

## Ongoing releases

Land Conventional-Commit PRs on `main`. release-please keeps a **"chore: release"**
PR open with the pending version bump and changelog; merge it to cut the release.

## Deploy

Vercel's Git integration builds every push (production on `main`, previews on PRs).
Add the Neon integration once (Storage tab) so `DATABASE_URL` is set. Run
`db/schema.sql` is not required — the table self-creates — but `npm run db:seed`
against the production `DATABASE_URL` gives a non-empty first impression.
