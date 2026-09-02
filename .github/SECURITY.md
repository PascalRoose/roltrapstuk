# Security policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately via GitHub's
**[Security advisories](https://github.com/PascalRoose/roltrapstuk/security/advisories/new)**
page rather than opening a public issue. Expect an initial response within a few days.

roltrapstuk stores no personal data — reports are anonymous, attributed only to
a random per-device id. There is no authentication and no user accounts.

## Automated checks

- **CodeQL** (`security-and-quality`) on every push, PR, and weekly.
- **Dependency review** on PRs; **Dependabot** for weekly dependency and
  GitHub Actions updates.
- **gitleaks** secret scanning on push, PR, and weekly (in addition to GitHub's
  native push protection for this public repo).
