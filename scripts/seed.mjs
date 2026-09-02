// Seed a few demo reports so a fresh database isn't empty.
// Usage: DATABASE_URL=... node scripts/seed.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("Set DATABASE_URL (or POSTGRES_URL) first.");
  process.exit(1);
}

const sql = neon(url);
const STATION = "denbosch";
const MIN = 60 * 1000;

/** [unitId, kind, minutesAgo, reporterId] */
const rows = [
  ["E6", "out", 90, "seed-a"],
  ["E6", "out", 70, "seed-b"],
  ["E6", "out", 40, "seed-c"],
  ["L4", "out", 180, "seed-d"],
  ["L4", "out", 120, "seed-e"],
  ["E9", "out", 26 * 60, "seed-f"],
  ["E9", "ok", 25 * 60, "seed-g"],
  ["E4", "ok", 3 * 24 * 60, "seed-h"],
];

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

for (const [unitId, kind, minutesAgo, reporterId] of rows) {
  const at = new Date(Date.now() - minutesAgo * MIN).toISOString();
  await sql`
    insert into reports (station, unit_id, kind, reporter_id, created_at)
    values (${STATION}, ${unitId}, ${kind}, ${reporterId}, ${at})
  `;
}

console.log(`Seeded ${rows.length} reports for ${STATION}.`);
