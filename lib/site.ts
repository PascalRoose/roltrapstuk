/**
 * Public base URL — used for canonical links, sitemap, and robots.
 *
 * There is no production domain yet; the default below is a placeholder for the
 * eventual Vercel deployment. Set `NEXT_PUBLIC_SITE_URL` once the real URL exists.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://roltrapstuk.vercel.app"
).replace(/\/$/, "");
