import type { Lang } from "@/lib/types";

export interface Strings {
  outShort: string;
  okShort: string;
  tapHint: string;
  latest: string;
  working: string;
  out: string;
  reportOut: string;
  reportOk: string;
  thanks: string;
  undo: string;
  doneOut: string;
  doneOk: string;
  noReports: string;
  noReportsSub: string;
  lastOut: string;
  lastOk: string;
  lastOkAgain: string;
  youOut: string;
  youOk: string;
  travellers: (n: number) => string;
  records: (n: number) => string;
  whyTitle: string;
  why1: string;
  why2: string;
  gotIt: string;
  sourceCode: string;
  settings: string;
  language: string;
  appearance: string;
  orientation: string;
  light: string;
  dark: string;
  system: string;
  flipOff: string;
  flipOn: string;
  done: string;
  justNow: string;
  minAgo: (n: number) => string;
  yesterday: string;
  daysAgo: (n: number) => string;
  offline: string;
}

const en: Strings = {
  outShort: "broken",
  okShort: "working",
  tapHint: "Tap an escalator or lift to see its latest report",
  latest: "LATEST REPORT",
  working: "Working",
  out: "Broken",
  reportOut: "Report as broken",
  reportOk: "Report as working again",
  thanks: "Reported. Thank you.",
  undo: "Undo my report",
  doneOut: "Marked as broken on the map. Other travellers see it straight away.",
  doneOk: "Marked as working again. Thanks for the update.",
  noReports: "No reports yet",
  noReportsSub: "Assumed working until someone reports otherwise",
  lastOut: "Reported broken",
  lastOk: "Reported working",
  lastOkAgain: "Reported working again",
  youOut: "You reported it broken",
  youOk: "You reported it working again",
  travellers: (n) => (n === 1 ? "1 traveller reported this" : `${n} travellers reported this`),
  records: (n) => (n === 1 ? "1 report on record" : `${n} reports on record`),
  whyTitle: "About this app",
  why1: "Half the escalators at 's-Hertogenbosch seem to be standing still, and you only find out when you are already at the bottom of the stairs with a suitcase.",
  why2: "Nobody publishes that. So travellers keep it up to date here: tap anything on the map to see the last report, then tap the button to say whether it is broken or running again.",
  gotIt: "Got it",
  sourceCode: "Source code on GitHub",
  settings: "Settings",
  language: "LANGUAGE",
  appearance: "APPEARANCE",
  orientation: "MAP ORIENTATION",
  light: "Light",
  dark: "Dark",
  system: "System",
  flipOff: "City center up",
  flipOn: "Paleiskwartier up",
  done: "Done",
  justNow: "Just now",
  minAgo: (n) => `${n} min ago`,
  yesterday: "Yesterday",
  daysAgo: (n) => `${n} days ago`,
  offline: "Can't reach the server — showing the last known status",
};

const nl: Strings = {
  outShort: "kapot",
  okShort: "werkend",
  tapHint: "Tik op een roltrap of lift voor de laatste melding",
  latest: "LAATSTE MELDING",
  working: "Werkt",
  out: "Kapot",
  reportOut: "Meld als kapot",
  reportOk: "Meld als weer werkend",
  thanks: "Gemeld. Bedankt.",
  undo: "Melding ongedaan maken",
  doneOut: "Op de kaart gemarkeerd als kapot. Andere reizigers zien het direct.",
  doneOk: "Gemarkeerd als weer werkend. Bedankt voor de update.",
  noReports: "Nog geen meldingen",
  noReportsSub: "Gaat uit van werkend tot iemand iets anders meldt",
  lastOut: "Gemeld als kapot",
  lastOk: "Gemeld als werkend",
  lastOkAgain: "Gemeld als weer werkend",
  youOut: "Jij meldde dit als kapot",
  youOk: "Jij meldde dit als weer werkend",
  travellers: (n) => (n === 1 ? "1 reiziger meldde dit" : `${n} reizigers meldden dit`),
  records: (n) => (n === 1 ? "1 melding bekend" : `${n} meldingen bekend`),
  whyTitle: "Over deze app",
  why1: "De helft van de roltrappen op 's-Hertogenbosch staat stil, en je merkt het pas als je met je koffer onderaan de trap staat.",
  why2: "Niemand publiceert dat. Reizigers houden het hier bij: tik op de kaart voor de laatste melding en meld daarna zelf of iets kapot is of weer loopt.",
  gotIt: "Duidelijk",
  sourceCode: "Broncode op GitHub",
  settings: "Instellingen",
  language: "TAAL",
  appearance: "WEERGAVE",
  orientation: "KAARTRICHTING",
  light: "Licht",
  dark: "Donker",
  system: "Systeem",
  flipOff: "Centrum boven",
  flipOn: "Paleiskwartier boven",
  done: "Klaar",
  justNow: "Zojuist",
  minAgo: (n) => `${n} min geleden`,
  yesterday: "Gisteren",
  daysAgo: (n) => `${n} dagen geleden`,
  offline: "Server niet bereikbaar — laatst bekende status wordt getoond",
};

const TABLE: Record<Lang, Strings> = { en, nl };

export function strings(lang: Lang): Strings {
  return TABLE[lang] ?? en;
}
