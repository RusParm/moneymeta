import type { DotaItemsLocale } from "./dota-items";

export const dotaMatchAuditConfig = {
  provider: "OpenDota",
  endpoint: "https://api.opendota.com/api/matches",
  publicMatchBase: "https://www.opendota.com/matches",
  docsUrl: "https://docs.opendota.com/",
  currentPatchId: 60,
  checkedAt: "2026-09-02",
  demoMatchId: 8978544633,
  demoCheckedAt: "2026-09-02"
} as const;

export const getDotaMatchAuditPath = (lang: DotaItemsLocale) => lang === "ru"
  ? "/dota-2/matches/audit/"
  : "/en/dota-2/matches/audit/";
