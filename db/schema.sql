-- Report log. One row per traveller report; the app derives current status
-- from the most recent row per unit. The application also creates this on first
-- use (see lib/store.ts), so running this by hand is optional.

create table if not exists reports (
  id          bigint generated always as identity primary key,
  station     text not null,
  unit_id     text not null,
  kind        text not null check (kind in ('out', 'ok')),
  reporter_id text,
  created_at  timestamptz not null default now()
);

create index if not exists reports_station_created_idx
  on reports (station, created_at desc);
