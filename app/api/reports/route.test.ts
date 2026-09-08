import { beforeEach, describe, expect, it } from "vitest";
import { POST, DELETE } from "@/app/api/reports/route";
import { readStationState } from "@/lib/stationState";
import type { StationState } from "@/lib/types";

// No DATABASE_URL in the test env → lib/store.ts uses the in-memory store,
// which keeps a single array on globalThis. Truncate it in place so the
// store's captured reference stays valid.
beforeEach(() => {
  const g = globalThis as { __roltrapReports?: unknown[] };
  if (g.__roltrapReports) g.__roltrapReports.length = 0;
  else g.__roltrapReports = [];
});

const REPORTER = "vitest-reporter-0001";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }) as never,
  );
}

function del(body: unknown) {
  return DELETE(
    new Request("http://localhost/api/reports", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }) as never,
  );
}

describe("POST /api/reports", () => {
  it("records a report and returns the fresh station state", async () => {
    const res = await post({
      station: "denbosch",
      unitId: "E6",
      kind: "out",
      reporterId: REPORTER,
    });
    expect(res.status).toBe(200);
    const state = (await res.json()) as StationState;
    // a single broken report only moves a working unit to "unsure"
    expect(state.units.E6.status).toBe("unsure");
    expect(state.units.E6.total).toBe(1);

    // and it is actually persisted
    const reread = await readStationState("denbosch");
    expect(reread?.units.E6.status).toBe("unsure");
  });

  it.each([
    ["unknown station", { station: "nope", unitId: "E6", kind: "out", reporterId: REPORTER }],
    ["unknown unit", { station: "denbosch", unitId: "ZZ9", kind: "out", reporterId: REPORTER }],
    ["invalid kind", { station: "denbosch", unitId: "E6", kind: "maybe", reporterId: REPORTER }],
    ["missing reporterId", { station: "denbosch", unitId: "E6", kind: "out" }],
    ["short reporterId", { station: "denbosch", unitId: "E6", kind: "out", reporterId: "x" }],
  ])("rejects %s with 400", async (_label, body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
  });

  it("rejects a non-JSON body with 400", async () => {
    const res = await POST(
      new Request("http://localhost/api/reports", { method: "POST", body: "{" }) as never,
    );
    expect(res.status).toBe(400);
  });

  it("rejects a second report from the same device on the same unit with 409", async () => {
    await post({ station: "denbosch", unitId: "E6", kind: "out", reporterId: REPORTER });
    const res = await post({ station: "denbosch", unitId: "E6", kind: "ok", reporterId: REPORTER });
    expect(res.status).toBe(409);

    // the second report was not recorded
    const reread = await readStationState("denbosch");
    expect(reread?.units.E6.total).toBe(1);
  });

  it("lets a device report again once it has undone its report", async () => {
    await post({ station: "denbosch", unitId: "E6", kind: "out", reporterId: REPORTER });
    await del({ station: "denbosch", unitId: "E6", reporterId: REPORTER });
    const res = await post({ station: "denbosch", unitId: "E6", kind: "ok", reporterId: REPORTER });
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/reports", () => {
  it("undoes the caller's own report", async () => {
    await post({ station: "denbosch", unitId: "E6", kind: "out", reporterId: REPORTER });

    const res = await del({ station: "denbosch", unitId: "E6", reporterId: REPORTER });
    expect(res.status).toBe(200);
    const state = (await res.json()) as StationState & { undone: boolean };
    expect(state.undone).toBe(true);
    expect(state.units.E6.status).toBe("ok");
    expect(state.units.E6.total).toBe(0);
  });

  it("reports undone:false when there is nothing to undo", async () => {
    const res = await del({ station: "denbosch", unitId: "E6", reporterId: REPORTER });
    const state = (await res.json()) as { undone: boolean };
    expect(state.undone).toBe(false);
  });
});
