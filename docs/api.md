# API reference

Three JSON endpoints under `/api`. They exist for the app's own client; there is
no versioning commitment and no published rate limiting.

- **No authentication.** A report carries a client-generated `reporterId` (see
  [ADR 0003](decisions/0003-anonymous-per-device-reporter-id.md)). It is not
  verified — the "one active report per device" rule is a courtesy guard, not
  access control.
- All handlers are `force-dynamic`. Successful responses carry
  `Cache-Control: no-store`.
- Request bodies must be JSON. A malformed body is `400 {"error":"invalid json"}`.
- Shapes (`StationState`, `UnitState`, `ReportKind`) are defined in
  [`lib/types.ts`](../lib/types.ts) and drawn in
  [architecture.md](architecture.md#data-model).

## Shared response shape

`GET` and both write routes return a **`StationState`**:

```jsonc
{
  "slug": "denbosch",
  "generatedAt": "2026-09-09T10:00:00.000Z",
  "units": {
    "E6": {
      "status": "unsure",          // "ok" | "unsure" | "out"
      "last": { "kind": "out", "at": "2026-09-09T09:58:00.000Z" }, // or null
      "streak": 1,                  // most-recent reports sharing `last.kind`
      "total": 1,                   // reports ever filed for this unit
      "yours": "out"               // this device's active report kind, or null
    }
    // ...one entry per unit in the station definition
  }
}
```

`yours` is only populated when the request identifies the device (`?r=` on `GET`,
`reporterId` in a write body) and that device has a report inside the 15-minute
undo window.

---

## GET /api/stations/{station}

Aggregated status for every unit in a station.

| | |
| --- | --- |
| Path param | `station` — station slug, e.g. `denbosch` |
| Query | `r` *(optional)* — this device's reporter id; drives each unit's `yours` |

**200** — a `StationState`.

**404** — `{"error":"unknown station"}` if the slug is not registered.

```bash
curl 's-hertogenbosch.example/api/stations/denbosch?r=6f9e...c1'
```

---

## POST /api/reports

File one report for a unit.

**Body**

| Field | Type | Rule |
| --- | --- | --- |
| `station` | string | must be a registered slug |
| `unitId` | string | must be a unit in that station |
| `kind` | string | `"out"` (broken) or `"ok"` (working) |
| `reporterId` | string | 8–100 characters |

**200** — the report was appended; body is the recomputed `StationState`.

**409** — `{"error":"already reported"}` — this device already has an active
report for this unit (still inside the undo window). Undo it or wait for the
window to pass before reporting again.

**400** — one of, depending on which check fails first:

| `error` | Cause |
| --- | --- |
| `invalid json` | body did not parse |
| `unknown station` | `station` is not a registered slug |
| `invalid kind` | `kind` is not `"out"` or `"ok"` |
| `missing reporterId` | `reporterId` absent or not 8–100 chars |
| `unknown unit` | `unitId` is not in that station |

> Unknown station/unit is `400` here, not `404` — the write routes treat the
> whole body as one validation pass.

```bash
curl -X POST 's-hertogenbosch.example/api/reports' \
  -H 'content-type: application/json' \
  -d '{"station":"denbosch","unitId":"E6","kind":"out","reporterId":"6f9e...c1"}'
```

---

## DELETE /api/reports

Undo this device's most recent report for a unit, if it is still within the
15-minute window.

**Body**

| Field | Type | Rule |
| --- | --- | --- |
| `station` | string | must be a registered slug |
| `unitId` | string | must be a unit in that station |
| `reporterId` | string | 8–100 characters |

**200** — always, when the body is valid. Body is the recomputed `StationState`
plus an `undone` flag:

```jsonc
{ "slug": "denbosch", "generatedAt": "...", "units": { /* ... */ }, "undone": true }
```

`undone` is `false` when there was nothing to remove (no matching report, or it
was already older than the window). This is not an error.

**400** — `invalid json`, `unknown station`, `missing reporterId`, or
`unknown unit`, same as `POST` (there is no `kind` to validate).

```bash
curl -X DELETE 's-hertogenbosch.example/api/reports' \
  -H 'content-type: application/json' \
  -d '{"station":"denbosch","unitId":"E6","reporterId":"6f9e...c1"}'
```
