export type WowLocale = "ru" | "en";

export interface WowEconomySource {
  label: string;
  url: string;
  note: Record<WowLocale, string>;
}

export const wowPatchContext = {
  release: "Midnight · Curse of Ula’tek",
  checkedAt: "2026-08-11",
  status: "community-reported" as const,
  note: {
    ru: "Текущий Retail-контекст подтверждён материалами Blizzard. Комиссия Auction House и числовые defaults остаются редактируемым baseline и требуют сверки с клиентом и вашим рынком.",
    en: "The current Retail context is confirmed by Blizzard materials. The Auction House cut and numeric defaults remain an editable baseline that should be checked against your client and market."
  },
  sources: [
    {
      label: "Blizzard · Curse of Ula’tek",
      url: "https://worldofwarcraft.blizzard.com/news/24294370/curse-of-ulatek-goes-live-august-11-journey-to-the-coiled-isle",
      note: {
        ru: "Текущий контентный контекст Midnight на дату проверки.",
        en: "Current Midnight content context on the check date."
      }
    },
    {
      label: "Blizzard · Content Update Notes",
      url: "https://worldofwarcraft.blizzard.com/news/24293281/curse-of-ulatek-content-update-notes",
      note: {
        ru: "Официальные notes текущего обновления Retail.",
        en: "Official notes for the current Retail update."
      }
    },
    {
      label: "Blizzard · Regional Commodities",
      url: "https://worldofwarcraft.blizzard.com/news/23833174/shadowlands-927-update-notes-now-live",
      note: {
        ru: "Официальное описание регионального рынка для commodities.",
        en: "Official description of the region-wide commodities market."
      }
    },
    {
      label: "Blizzard Forums · Auction House fee",
      url: "https://us.forums.blizzard.com/en/wow/t/auction-house-fee/2089197",
      note: {
        ru: "Community cross-check стандартной комиссии 5%; поэтому статус baseline — community-reported.",
        en: "Community cross-check for the standard 5% cut; the baseline is therefore community-reported."
      }
    },
    {
      label: "Blizzard Developer Portal · Game Data API",
      url: "https://develop.battle.net/documentation/world-of-warcraft/game-data-apis",
      note: {
        ru: "Основа для будущего live-слоя цен и WoW Token без ручного обновления.",
        en: "Foundation for a future live price and WoW Token data layer."
      }
    }
  ] satisfies WowEconomySource[]
};

export const craftingBaseline = {
  materialCostPerCraft: 825,
  outputUnits: 5,
  salePricePerUnit: 225,
  auctionHouseCutPercent: 5,
  depositPerListing: 12,
  sellThroughPercent: 70,
  crafts: 20
};

export const farmBaseline = {
  unitsPerHour: 90,
  marketPricePerUnit: 38,
  sellThroughPercent: 65,
  auctionHouseCutPercent: 5,
  hourlyExpenses: 120,
  relistingLossPerHour: 35,
  sessionHours: 2,
  targetGold: 25_000
};
