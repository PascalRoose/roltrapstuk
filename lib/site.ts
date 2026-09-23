/**
 * Public base URL — used for canonical links, sitemap, and robots.
 *
 * Defaults to the production domain; override with `NEXT_PUBLIC_SITE_URL`
 * (e.g. for preview deployments).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://roltrapstuk.paroose.dev"
).replace(/\/$/, "");
