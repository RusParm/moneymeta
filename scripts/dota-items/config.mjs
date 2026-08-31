export const dotaItemsConfig = Object.freeze({
  schemaVersion: 1,
  provider: "opendota",
  patch: "7.41e",
  patchFamily: "7.41",
  patchStartedAt: "2026-07-30T00:00:00.000Z",
  patchSourceUrl: "https://www.dota2.com/patches/7.41e",
  minimumSample: 200,
  minimumClassifiedPlayersPerMatch: 8,
  itemConstantsUrl: "https://api.opendota.com/api/constants/items",
  itemConstantsFallbackUrl: "https://raw.githubusercontent.com/odota/dotaconstants/master/build/items.json",
  patchConstantsUrl: "https://api.opendota.com/api/constants/patch",
  patchConstantsFallbackUrl: "https://raw.githubusercontent.com/odota/dotaconstants/master/build/patch.json",
  explorerUrl: "https://api.opendota.com/api/explorer",
  openDotaUrl: "https://www.opendota.com/",
  openDotaDocsUrl: "https://docs.opendota.com/",
  dotaConstantsUrl: "https://github.com/odota/dotaconstants",
  outputPath: "src/data/snapshots/dota-items-7.41e.json"
});

export const dotaItemsUserAgent = "MoneyMeta/1.13 (https://themoneymeta.com)";
