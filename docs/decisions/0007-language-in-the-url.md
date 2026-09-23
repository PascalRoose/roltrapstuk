# 0007. Serve each language at its own URL, Dutch by default

- **Status:** Accepted
- **Date:** 2026-09-23

## Context

The language used to be a client-side setting kept in `localStorage`
(`useSettings`), defaulting to English. The server therefore always rendered
English (`<html lang="en">`), and search engines saw a single English page for a
query that is almost always asked in Dutch ("roltrap 's-Hertogenbosch kapot").
One URL cannot carry two languages for a crawler, and there was nothing for
`hreflang` to point at.

## Decision

Dutch is served at `/<slug>` and English at `/en/<slug>`. The language is fixed
by the URL: each language has its own root layout (route groups `app/(nl)` and
`app/(en)/en`), so `<html lang>`, the title, description, canonical URL,
`hreflang` alternates, Open Graph locale and the visible copy are correct in the
server HTML. `StationView` receives `lang` as a prop; the language control in the
settings modal navigates between the two URLs. `lang` is no longer a stored
setting. `/` and `/en` redirect permanently to the default station.

There is deliberately no `Accept-Language` redirect: a URL always returns the
same language, which is what crawlers and shared links need. The pages link to
each other with `hreflang` and a visible language link.

## Consequences

- Dutch searchers get Dutch metadata and content; English pages are still
  indexable and cross-linked.
- Switching language is a full page load (different root layouts), and a device's
  previously stored language preference is ignored.
- There is no top-level `layout.tsx`, so `not-found.tsx` lives in each group;
  a URL that matches no route at all gets Next's default 404 page.
- New station copy needs `seo.title` and `seo.description` in both languages.
- Page-level `openGraph` replaces the layout's wholesale, so the social image
  lives beside each `[station]` page rather than in the layout.

## Alternatives considered

- **Dutch metadata only, keep the toggle.** Smallest change, but English and
  Dutch would still share one URL and one server-rendered language.
- **`app/[lang]/…` with a proxy rewrite for the default language.** One layout,
  but needs `global-not-found` (experimental) and a request-time rewrite.
- **Locale from `Accept-Language` on one URL.** Makes the same URL return
  different content, which search engines cannot index reliably.
