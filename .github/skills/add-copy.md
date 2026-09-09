---
title: Add or change UI copy
summary: Where a string belongs (app chrome vs station data), the { en, nl } rule, and the dictionary-parity checks.
---

# Add or change UI copy

Every user-facing string is bilingual — `{ en, nl }`. There are two homes for
copy and they never mix.

## Which file

| The string is… | Home | Shape |
| --- | --- | --- |
| App chrome — buttons, hints, labels, modal and state text | `lib/strings.ts` | a key on the `Strings` interface, added to **both** `en` and `nl` |
| About one station — unit names, directions, kickers, end labels | that station's file in `lib/stations/` | `Record<Lang, string>` inline on the `StationDef` |

In doubt: would the string be identical for every station? Then it's chrome.

## Steps — app chrome

1. **Add the key to the `Strings` interface** in `lib/strings.ts`. Use a function
   type (`(n: number) => string`) if it interpolates a value — see `travellers`.
2. **Add it to both `en` and `nl`.** TypeScript fails the build if either is
   missing, and `lib/strings.test.ts` also asserts the two key sets match at
   runtime.
3. **Use it**: `const t = strings(settings.lang); … t.myKey`. Client components
   get `lang` from `useSettings()`; server components pass it down through props.
4. **Verify**: `npm run typecheck && npm test`.

## Steps — station copy

Edit the `StationDef` directly. `sub` reads `"<origin> → <destination>"` for
escalators and `"<a> ↔ <b>"` for lifts — match `denbosch.ts`. The
[`add-station`](add-station.md) skill has the full shape.

## Gotchas

- Don't put station-specific text in `lib/strings.ts`, and don't import
  `lib/strings.ts` into a station file — the split is deliberate.
- `useSettings()` server-renders with the default language (`en`) and re-renders
  after hydration via `useSyncExternalStore`; a client component that shows `nl`
  copy will briefly render `en` on the server. That's expected — don't try to
  "fix" it with a guard.
- Language and theme are applied pre-hydration by the inline script in
  `app/layout.tsx` (`<html>` has `suppressHydrationWarning` for that reason).
- Copy changes need no `docs/` update.
