import "server-only";
import { neon } from "@neondatabase/serverless";
import type { RawReport, ReportKind } from "@/lib/types";
import { UNDO_WINDOW_MS } from "@/lib/aggregate";

export interface NewReport {
  station: string;
  unitId: string;
  kind: ReportKind;
  reporterId: string;
}

export interface Store {
  list(station: string): Promise<RawReport[]>;
  add(r: NewReport): Promise<void>;
  /** remove the caller's most recent report for a unit, if still within the undo window */
  undo(station: string, unitId: string, reporterId: string): Promise<boolean>;
}

const CONNECTION = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const UNDO_MINUTES = Math.round(UNDO_WINDOW_MS / 60000);

/* ------------------------------------------------------------------ Postgres */

function makePostgresStore(): Store {
  const sql = neon(CONNECTION);

  const schemaReady = (async () => {
    await sql`
      create table if not exists reports (
        id bigint generated always as identity primary key,
        station text not null,
        unit_id text not null,
        kind text not null check (kind in ('out', 'ok')),
        reporter_id text,
        created_at timestamptz not null default now()
      )
    `;
    await sql`
      create index if not exists reports_station_created_idx
        on reports (station, created_at desc)
    `;
  })();

  return {
    async list(station) {
      await schemaReady;
      const rows = (await sql`
        select unit_id, kind, reporter_id, created_at
        from reports
        where station = ${station}
        order by created_at desc
        limit 4000
      `) as Array<{
        unit_id: string;
        kind: ReportKind;
        reporter_id: string | null;
        created_at: string | Date;
      }>;
      return rows
        .map((r) => ({
          unitId: r.unit_id,
          kind: r.kind,
          reporterId: r.reporter_id,
          at: new Date(r.created_at).toISOString(),
        }))
        .reverse();
    },

    async add({ station, unitId, kind, reporterId }) {
      await schemaReady;
      await sql`
        insert into reports (station, unit_id, kind, reporter_id)
        values (${station}, ${unitId}, ${kind}, ${reporterId})
      `;
    },

    async undo(station, unitId, reporterId) {
      await schemaReady;
      const deleted = (await sql`
        delete from reports
        where id = (
          select id from reports
          where station = ${station}
            and unit_id = ${unitId}
            and reporter_id = ${reporterId}
          order by created_at desc
          limit 1
        )
        and created_at > now() - make_interval(mins => ${UNDO_MINUTES})
        returning id
      `) as Array<{ id: string }>;
      return deleted.length > 0;
    },
  };
}

/* -------------------------------------------------------------------- Memory */

/** Dev fallback when no database is configured. Resets on restart. */
function makeMemoryStore(): Store {
  const g = globalThis as unknown as { __roltrapReports?: Array<RawReport & { station: string }> };
  g.__roltrapReports ??= [];
  const log = g.__roltrapReports;

  return {
    async list(station) {
      return log
        .filter((r) => r.station === station)
        .map((r) => ({ unitId: r.unitId, kind: r.kind, at: r.at, reporterId: r.reporterId }));
    },
    async add({ station, unitId, kind, reporterId }) {
      log.push({ station, unitId, kind, reporterId, at: new Date().toISOString() });
    },
    async undo(station, unitId, reporterId) {
      for (let i = log.length - 1; i >= 0; i--) {
        const r = log[i];
        if (r.station !== station || r.unitId !== unitId || r.reporterId !== reporterId) continue;
        if (Date.now() - new Date(r.at).getTime() > UNDO_WINDOW_MS) return false;
        log.splice(i, 1);
        return true;
      }
      return false;
    },
  };
}

/* ------------------------------------------------------------------- picker */

let store: Store | null = null;

export function getStore(): Store {
  if (store) return store;
  if (CONNECTION) {
    store = makePostgresStore();
  } else {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "No database configured. Set DATABASE_URL (or POSTGRES_URL) — see .env.example.",
      );
    }
    console.warn(
      "[roltrapstuk] No DATABASE_URL set — using in-memory store (reports reset on restart).",
    );
    store = makeMemoryStore();
  }
  return store;
}

export function hasDatabase(): boolean {
  return CONNECTION.length > 0;
}
