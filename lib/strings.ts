import type { Lang } from "@/lib/types";

export interface Strings {
  outShort: string;
  okShort: string;
  unsureShort: string;
  tapHint: string;
  latest: string;
  working: string;
  out: string;
  unsureOut: string;
  unsureOk: string;
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
  zoomIn: string;
  zoomOut: string;
  zoomReset: string;
}

const en: Strings = {
  outShort: "broken",
  okShort: "working",
  unsureShort: "reported",
  tapHint: "Tap an escalator or lift to see its latest report",
  latest: "LATEST REPORT",
  working: "Working",
  out: "Broken",
  unsureOut: "Reported broken",
  unsureOk: "Reported working",
  reportOut: "Report as broken",
  reportOk: "Report as working",
  thanks: "Reported. Thank you.",
  undo: "Undo my report",
  doneOut: "Your report is on the map. Other travellers see it straight away.",
  doneOk: "Your report is on the map. Thanks for the update.",
  noReports: "No reports yet",
  noReportsSub: "Assumed working until someone reports otherwise",
  lastOut: "Reported broken",
  lastOk: "Reported working",
  youOut: "You reported it broken",
  youOk: "You reported it working",
  travellers: (n) => (n === 1 ? "1 traveller reported this" : `${n} travellers reported this`),
  records: (n) => (n === 1 ? "1 report on record" : `${n} reports on record`),
  whyTitle: "About this app",
  why1: "Sometimes it seems like half of the escalators in 's-Hertogenbosch are out of order. To make it more clear which escalators and lifts are broken, and for how long, this app was created.",
  why2: "Tap one of the escalators or lifts to make a report and help other travellers stay informed.",
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
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  zoomReset: "Reset zoom",
};

const nl: Strings = {
  outShort: "kapot",
  okShort: "werkend",
  unsureShort: "gemeld",
  tapHint: "Klik op een roltrap of lift voor de laatste melding",
  latest: "LAATSTE MELDING",
  working: "Werkt",
  out: "Kapot",
  unsureOut: "Kapot gemeld",
  unsureOk: "Werkend gemeld",
  reportOut: "Meld als kapot",
  reportOk: "Meld als werkend",
  thanks: "Gemeld. Bedankt.",
  undo: "Melding ongedaan maken",
  doneOut: "Je melding staat op de kaart. Andere reizigers zien het direct.",
  doneOk: "Je melding staat op de kaart. Bedankt voor de update.",
  noReports: "Nog geen meldingen",
  noReportsSub: "Gaat uit van werkend tot iemand iets anders meldt",
  lastOut: "Gemeld als kapot",
  lastOk: "Gemeld als werkend",
  youOut: "Jij meldde dit als kapot",
  youOk: "Jij meldde dit als werkend",
  travellers: (n) => (n === 1 ? "1 reiziger meldde dit" : `${n} reizigers meldden dit`),
  records: (n) => (n === 1 ? "1 melding bekend" : `${n} meldingen bekend`),
  whyTitle: "Over deze app",
  why1: "Soms lijkt het wel alsof de helft van de roltrappen in 's-Hertogenbosch stilstaat. Om inzichtelijker te maken welke roltrappen en liften kapot zijn, en hoelang ze al zo zijn, is deze app gemaakt.",
  why2: "Klik op een van de roltrappen of liften om een melding te maken en help andere reizigers op de hoogte te stellen.",
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
  zoomIn: "Inzoomen",
  zoomOut: "Uitzoomen",
  zoomReset: "Zoom herstellen",
};

const TABLE: Record<Lang, Strings> = { en, nl };

export function strings(lang: Lang): Strings {
  return TABLE[lang] ?? en;
}
