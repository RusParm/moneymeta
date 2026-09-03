import type { DotaItemsLocale } from "./dota-items";

export const dotaMatchAuditConfig = {
  provider: "OpenDota",
  endpoint: "https://api.opendota.com/api/matches",
  relayEndpoint: "/api/dota-match",
  directTimeoutMs: 30_000,
  relayTimeoutMs: 55_000,
  publicMatchBase: "https://www.opendota.com/matches",
  docsUrl: "https://docs.opendota.com/",
  currentPatchId: 60,
  checkedAt: "2026-09-03",
  demoMatchId: 8978544633,
  demoCheckedAt: "2026-09-02"
} as const;

export const getDotaMatchAuditPath = (lang: DotaItemsLocale) => lang === "ru"
  ? "/dota-2/matches/audit/"
  : "/en/dota-2/matches/audit/";
