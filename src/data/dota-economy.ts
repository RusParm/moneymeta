export type DotaLocale = "ru" | "en";

export interface EconomySource {
  label: string;
  url: string;
  note: Record<DotaLocale, string>;
}

export const dotaPatchContext = {
  patch: "7.41",
  checkedAt: "2026-08-11",
  status: "community-reported" as const,
  note: {
    ru: "Patch context подтверждён официальными notes Valve. Числовые defaults — редактируемый baseline, а не обещание вечной актуальности.",
    en: "The patch context is confirmed by Valve's official notes. Numeric defaults are an editable baseline, not a claim of permanent accuracy."
  },
  sources: [
    {
      label: "Valve · Patch 7.41",
      url: "https://www.dota2.com/patches/7.41",
      note: {
        ru: "Текущий patch context и изменение взаимодействия Hand of Midas с Madstone.",
        en: "Current patch context and the Hand of Midas interaction with Madstone."
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
      label: "Valve · Patch 7.11",
      url: "https://www.dota2.com/patches/7.11",
      note: {
        ru: "Последняя официально зафиксированная базовая формула buyback: 100 + Net Worth / 13.",
        en: "The last officially documented baseline buyback formula: 100 + Net Worth / 13."
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
