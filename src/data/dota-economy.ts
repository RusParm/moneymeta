export type DotaLocale = "ru" | "en";

export interface EconomySource {
  label: Record<DotaLocale, string>;
  url: string;
  note: Record<DotaLocale, string>;
}

export const dotaPatchContext = {
  patch: "7.41e",
  checkedAt: "2026-08-19",
  status: "mixed" as const,
  note: {
    ru: "Контекст патча и формула выкупа подтверждены официальными примечаниями Valve. Текущие характеристики Hand of Midas дополнительно сверены с данными игрового сообщества. Все исходные значения можно изменить в калькуляторе.",
    en: "Patch context and the buyback formula are confirmed by Valve's official notes. Current Midas stats are additionally community-cross-checked; every numeric default remains editable."
  },
  sources: [
    {
      label: { ru: "Valve · патч 7.41e", en: "Valve · Patch 7.41e" },
      url: "https://www.dota2.com/patches/7.41e",
      note: {
        ru: "Актуальный патч: прибавка Hand of Midas к скорости атаки увеличена с 35 до 40.",
        en: "Current patch context; Hand of Midas attack speed increased from 35 to 40."
      }
    },
    {
      label: { ru: "Valve · патч 7.41", en: "Valve · Patch 7.41" },
      url: "https://www.dota2.com/patches/7.41",
      note: {
        ru: "Изменения экономики нейтральных предметов и стоимости Madstone первого уровня.",
        en: "Context for the new neutral-item economy and Tier 1 Madstone cost."
      }
    },
    {
      label: { ru: "Valve · патч 7.40", en: "Valve · Patch 7.40" },
      url: "https://www.dota2.com/patches/7.40",
      note: {
        ru: "Восстановление заряда Transmute было снижено до 90 секунд.",
        en: "Transmute charge restore time was reduced to 90 seconds."
      }
    },
    {
      label: { ru: "Valve · патч 7.38", en: "Valve · Patch 7.38" },
      url: "https://www.dota2.com/patches/7.38",
      note: {
        ru: "Официальное введение набора Madstone при применении Transmute к нейтральному крипу.",
        en: "Official introduction of a Madstone Bundle on neutral Transmute."
      }
    },
    {
      label: { ru: "Valve · патч 7.29", en: "Valve · Patch 7.29" },
      url: "https://www.dota2.com/patches/7.29",
      note: {
        ru: "Официально опубликованная базовая формула выкупа: целая часть от 200 + общая стоимость героя / 13.",
        en: "The documented current baseline buyback formula: floor(200 + Net Worth / 13)."
      }
    },
    {
      label: { ru: "Dotabuff · Hand of Midas", en: "Dotabuff · Hand of Midas" },
      url: "https://www.dotabuff.com/items/hand-of-midas",
      note: {
        ru: "Дополнительная сверка стоимости предмета и золота за Transmute по данным игрового сообщества.",
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
