export type DotaLocale = "ru" | "en";

export interface EconomySource {
  label: string;
  url: string;
  note: Record<DotaLocale, string>;
}

export const dotaPatchContext = {
  patch: "7.41e",
  checkedAt: "2026-08-12",
  status: "mixed" as const,
  note: {
    ru: "Patch context и формула buyback подтверждены официальными notes Valve. Текущие характеристики Midas дополнительно сверены по community-источнику; все числовые defaults остаются редактируемым baseline.",
    en: "Patch context and the buyback formula are confirmed by Valve's official notes. Current Midas stats are additionally community-cross-checked; every numeric default remains editable."
  },
  sources: [
    {
      label: "Valve · Patch 7.41e",
      url: "https://www.dota2.com/patches/7.41e",
      note: {
        ru: "Текущий patch context; бонус attack speed Hand of Midas увеличен с 35 до 40.",
        en: "Current patch context; Hand of Midas attack speed increased from 35 to 40."
      }
    },
    {
      label: "Valve · Patch 7.41",
      url: "https://www.dota2.com/patches/7.41",
      note: {
        ru: "Контекст новой neutral-item экономики и стоимости Madstone для Tier 1.",
        en: "Context for the new neutral-item economy and Tier 1 Madstone cost."
      }
    },
    {
      label: "Valve · Patch 7.40",
      url: "https://www.dota2.com/patches/7.40",
      note: {
        ru: "Восстановление заряда Transmute было снижено до 90 секунд.",
        en: "Transmute charge restore time was reduced to 90 seconds."
      }
    },
    {
      label: "Valve · Patch 7.38",
      url: "https://www.dota2.com/patches/7.38",
      note: {
        ru: "Официальное введение Madstone Bundle при neutral Transmute.",
        en: "Official introduction of a Madstone Bundle on neutral Transmute."
      }
    },
    {
      label: "Valve · Patch 7.29",
      url: "https://www.dota2.com/patches/7.29",
      note: {
        ru: "Действующая документированная базовая формула buyback: floor(200 + Net Worth / 13).",
        en: "The documented current baseline buyback formula: floor(200 + Net Worth / 13)."
      }
    },
    {
      label: "Dotabuff · Hand of Midas",
      url: "https://www.dotabuff.com/items/hand-of-midas",
      note: {
        ru: "Community cross-check стоимости предмета и золота Transmute на дату проверки.",
        en: "Community cross-check for item cost and Transmute gold on the check date."
      }
    }
  ] satisfies EconomySource[]
};

export const midasBaseline = {
  itemCost: 2_200,
  transmuteGold: 160,
  foregoneCreepBounty: 40,
  otherValuePerUse: 0,
  chargeRestoreSeconds: 90,
  purchaseMinute: 12,
  expectedEndMinute: 42
};

export const buybackBaseline = {
  netWorth: 15_000,
  currentGold: 2_000,
  goldPerMinute: 550,
  secondsToObjective: 120,
  deathProbabilityPercent: 30
};

export const buybackBaseCost = 200;
