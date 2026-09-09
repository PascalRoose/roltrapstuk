# Architecture decision records

Short, dated records of decisions that shape the codebase and aren't obvious from
reading it. Each one is immutable: if a decision changes, add a new ADR that
supersedes the old one rather than editing history. This is what keeps the "why"
from drifting the way prose docs do.

Copy [`TEMPLATE.md`](TEMPLATE.md) for a new one; number it in sequence.

| # | Title | Status |
| --- | --- | --- |
| [0001](0001-append-only-report-log.md) | Append-only report log, folded at read time | Accepted |
| [0002](0002-three-state-confidence-counter.md) | Three-state confidence counter for unit status | Accepted |
| [0003](0003-anonymous-per-device-reporter-id.md) | Anonymous per-device reporter id, no accounts | Accepted |
| [0004](0004-neon-serverless-driver-with-in-memory-fallback.md) | Neon serverless driver + in-memory fallback store | Accepted |
| [0005](0005-semantic-release-on-every-push.md) | semantic-release on every push to `main` | Accepted |
| [0006](0006-fixed-canvas-station-map.md) | Fixed 402×620 canvas for the station map | Accepted |

ADRs 0001–0006 were recorded on 2026-09-09 from the implementation as it already
stood; the decisions themselves date to the project's start.
