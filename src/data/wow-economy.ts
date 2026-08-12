export type WowLocale = "ru" | "en";

export interface WowEconomySource {
  label: string;
  url: string;
  note: Record<WowLocale, string>;
}

export const wowPatchContext = {
  release: "Midnight · Curse of Ula’tek",
  checkedAt: "2026-08-12",
  status: "mixed evidence" as const,
  note: {
    ru: "Текущий Retail-контекст подтверждён материалами Blizzard. Рыночные цены, sell-through, комиссия Auction House и числовые defaults остаются редактируемой моделью и требуют сверки с вашим регионом, realm и категорией товара.",
    en: "The current Retail context is confirmed by Blizzard materials. Market prices, sell-through, the Auction House cut and numeric defaults remain an editable model that must be checked against your region, realm and item category."
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
      label: "Blizzard · Quality-of-Life Update",
      url: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek",
      note: {
        ru: "Официальный источник по profession knowledge reset, снижению стоимости crafted Housing decor и Auction House filters.",
        en: "Official source for the profession knowledge reset, lower crafted Housing decor costs and persistent Auction House filters."
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
      label: "Blizzard · Crafting Orders",
      url: "https://worldofwarcraft.blizzard.com/en-gb/news/23876529/dragonflight-making-it-with-professions",
      note: {
        ru: "Официальное описание public, guild и personal Crafting Orders и распределения reagents между заказчиком и crafter.",
        en: "Official description of public, guild and personal Crafting Orders and how reagents can be allocated between customer and crafter."
      }
    },
    {
      label: "Blizzard Forums · Auction House fee",
      url: "https://us.forums.blizzard.com/en/wow/t/auction-house-fee/2089197",
      note: {
        ru: "Community cross-check стандартной комиссии 5%; поэтому статус baseline - community-reported.",
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

export const orderBaseline = {
  commissionGold: 2_500,
  crafterMaterialCost: 450,
  expectedRecraftReserve: 180,
  serviceMinutes: 6,
  targetGoldPerHour: 8_000,
  orders: 5
};
