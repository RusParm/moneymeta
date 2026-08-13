export type WowLocale = "ru" | "en";

export interface WowEconomySource {
  label: Record<WowLocale, string>;
  url: string;
  note: Record<WowLocale, string>;
}

export const wowPatchContext = {
  release: "Midnight · Curse of Ula’tek",
  checkedAt: "2026-08-12",
  status: "mixed evidence" as const,
  note: {
    ru: "Текущий контекст Retail подтверждён материалами Blizzard. Рыночные цены, вероятность продажи, комиссия аукциона и исходные значения остаются редактируемой моделью. Их нужно сверять со своим регионом, сервером и категорией товара.",
    en: "The current Retail context is confirmed by Blizzard materials. Market prices, sell-through, the Auction House cut and numeric defaults remain an editable model that must be checked against your region, realm and item category."
  },
  sources: [
    {
      label: { ru: "Blizzard · Curse of Ula’tek", en: "Blizzard · Curse of Ula’tek" },
      url: "https://worldofwarcraft.blizzard.com/news/24294370/curse-of-ulatek-goes-live-august-11-journey-to-the-coiled-isle",
      note: {
        ru: "Текущий контентный контекст Midnight на дату проверки.",
        en: "Current Midnight content context on the check date."
      }
    },
    {
      label: { ru: "Blizzard · улучшения удобства", en: "Blizzard · Quality-of-Life Update" },
      url: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek",
      note: {
        ru: "Официальный источник по сбросу знаний профессии, снижению стоимости создаваемого декора для жилищ и сохранению фильтров аукциона.",
        en: "Official source for the profession knowledge reset, lower crafted Housing decor costs and persistent Auction House filters."
      }
    },
    {
      label: { ru: "Blizzard · региональные массовые товары", en: "Blizzard · Regional Commodities" },
      url: "https://worldofwarcraft.blizzard.com/news/23833174/shadowlands-927-update-notes-now-live",
      note: {
        ru: "Официальное описание регионального рынка массовых товаров.",
        en: "Official description of the region-wide commodities market."
      }
    },
    {
      label: { ru: "Blizzard · заказы на изготовление", en: "Blizzard · Crafting Orders" },
      url: "https://worldofwarcraft.blizzard.com/en-gb/news/23876529/dragonflight-making-it-with-professions",
      note: {
        ru: "Официальное описание публичных, гильдейских и личных заказов, а также распределения материалов между заказчиком и исполнителем.",
        en: "Official description of public, guild and personal Crafting Orders and how reagents can be allocated between customer and crafter."
      }
    },
    {
      label: { ru: "Форумы Blizzard · комиссия аукциона", en: "Blizzard Forums · Auction House fee" },
      url: "https://us.forums.blizzard.com/en/wow/t/auction-house-fee/2089197",
      note: {
        ru: "Дополнительная сверка стандартной комиссии 5% по данным сообщества. Поэтому исходное значение отмечено как полученное от сообщества.",
        en: "Community cross-check for the standard 5% cut; the baseline is therefore community-reported."
      }
    },
    {
      label: { ru: "Портал разработчиков Blizzard · интерфейс игровых данных", en: "Blizzard Developer Portal · Game Data API" },
      url: "https://develop.battle.net/documentation/world-of-warcraft/game-data-apis",
      note: {
        ru: "Основа для будущего автоматического обновления цен и данных WoW Token.",
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
