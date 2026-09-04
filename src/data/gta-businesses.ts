export type Locale = "ru" | "en";
export type VerificationStatus = "verified" | "estimated" | "community-reported";
export type DecisionPriority = "fast-payback" | "max-income" | "low-friction";

export interface DataProvenance {
  checkedAt: string;
  gameVersion: string;
  status: VerificationStatus;
  sourceNote: Record<Locale, string>;
}

export interface GtaBusiness {
  id: string;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  setupCost: number;
  fullSale: number;
  supplyCost: number;
  productionHours: number;
  activeMinutesPerCycle: number;
  friction: number;
  soloSuitability: number;
  provenance: DataProvenance;
}

const sharedProvenance: DataProvenance = {
  checkedAt: "2026-07-01",
  gameVersion: "GTA Online · расчётный набор за июль 2026",
  status: "estimated",
  sourceNote: {
    ru: "Рабочая оценка на основе открытых описаний механик. Для статуса «проверено» требуется повторная проверка в игре.",
    en: "Working estimate based on public mechanic descriptions. In-game revalidation is required before verified status."
  }
};

export const gtaBusinesses: GtaBusiness[] = [
  {
    id: "acid",
    name: { ru: "Кислотная лаборатория", en: "Acid Lab" },
    summary: {
      ru: "Низкий порог входа, сильная окупаемость и удобная соло-продажа.",
      en: "Low entry cost, strong payback and a solo-friendly sale flow."
    },
    setupCost: 1_000_000,
    fullSale: 335_000,
    supplyCost: 60_000,
    productionHours: 4.6,
    activeMinutesPerCycle: 35,
    friction: 4,
    soloSuitability: 9,
    provenance: sharedProvenance
  },
  {
    id: "coke",
    name: { ru: "Кокаиновый склад", en: "Cocaine Lockup" },
    summary: {
      ru: "Высокая прибыль цикла, но продажа и обслуживание менее удобны для соло.",
      en: "Strong cycle profit, with a less convenient solo sale and operating loop."
    },
    setupCost: 1_380_000,
    fullSale: 420_000,
    supplyCost: 60_000,
    productionHours: 5,
    activeMinutesPerCycle: 50,
    friction: 7,
    soloSuitability: 5,
    provenance: sharedProvenance
  },
  {
    id: "bunker",
    name: { ru: "Бункер", en: "Bunker" },
    summary: {
      ru: "Сильный универсальный актив с хорошей прибылью и средним порогом контроля.",
      en: "A strong all-round asset with good profit and moderate operating effort."
    },
    setupCost: 2_375_000,
    fullSale: 250_000,
    supplyCost: 75_000,
    productionHours: 3,
    activeMinutesPerCycle: 35,
    friction: 5,
    soloSuitability: 8,
    provenance: sharedProvenance
  },
  {
    id: "meth",
    name: { ru: "Метлаб", en: "Meth Lab" },
    summary: {
      ru: "Неплохой денежный поток, но слабее по капитальной эффективности и удобству.",
      en: "Reasonable cash generation, but weaker capital efficiency and convenience."
    },
    setupCost: 2_341_500,
    fullSale: 475_000,
    supplyCost: 60_000,
    productionHours: 8,
    activeMinutesPerCycle: 50,
    friction: 7,
    soloSuitability: 5,
    provenance: sharedProvenance
  },
  {
    id: "cash",
    name: { ru: "Фальшивые деньги", en: "Counterfeit Cash" },
    summary: {
      ru: "Доступный дополнительный поток, но длительная окупаемость ухудшает приоритет покупки.",
      en: "Useful incremental cash flow, but a long payback weakens its purchase priority."
    },
    setupCost: 2_335_000,
    fullSale: 500_000,
    supplyCost: 50_000,
    productionHours: 9.4,
    activeMinutesPerCycle: 45,
    friction: 7,
    soloSuitability: 5,
    provenance: sharedProvenance
  },
  {
    id: "weed",
    name: { ru: "Плантация", en: "Weed Farm" },
    summary: {
      ru: "Нишевый актив: слабая базовая эффективность без недельных бонусов.",
      en: "A niche asset with weak baseline efficiency outside bonus weeks."
    },
    setupCost: 2_205_000,
    fullSale: 420_000,
    supplyCost: 50_000,
    productionHours: 9,
    activeMinutesPerCycle: 45,
    friction: 7,
    soloSuitability: 5,
    provenance: sharedProvenance
  },
  {
    id: "club",
    name: { ru: "Ночной клуб: базовая модель", en: "Nightclub - base model" },
    summary: {
      ru: "Мало ручной работы и есть пассивный доход. Текущая модель не учитывает совместную работу всех складских товаров.",
      en: "Low friction and passive cash flow; the current model excludes full warehouse synergies."
    },
    setupCost: 2_000_000,
    fullSale: 50_000,
    supplyCost: 0,
    productionHours: 1,
    activeMinutesPerCycle: 12,
    friction: 2,
    soloSuitability: 10,
    provenance: sharedProvenance
  }
];

export interface WeeklyMetaSnapshot {
  id: string;
  startsAt: string;
  checkedAt: string;
  validThrough: string;
  status: VerificationStatus;
  sourceUrl: string;
  sourceLabel: string;
  items: Record<Locale, string[]>;
  opportunities: Array<{
    id: string;
    status: VerificationStatus;
    title: Record<Locale, string>;
    summary: Record<Locale, string>;
    decision: Record<Locale, string>;
    signal: Record<Locale, string>;
    multiplier: number;
    fixedReward?: number;
    requiredRunsForReward?: number;
    requiredAsset?: "auto-shop";
  }>;
  closedWindows: Array<{
    id: string;
    startsAt: string;
    endedAt: string;
    title: Record<Locale, string>;
    summary: Record<Locale, string>;
    signal: Record<Locale, string>;
  }>;
}

export const weeklyMeta: WeeklyMetaSnapshot = {
  id: "2026-08-27-random-transform",
  startsAt: "2026-08-27",
  checkedAt: "2026-09-01",
  validThrough: "2026-09-02",
  status: "verified",
  sourceUrl: "https://www.rockstargames.com/newswire/article/o3921k3734ok35/take-in-triple-rewards-shifting-shape-in-new-random-transform-races",
  sourceLabel: "Rockstar Newswire · Random Transform Races",
  items: {
    ru: [
      "До 2 сентября: Random Transform Races приносят 3X GTA$/RP.",
      "Drift Races приносят 2X GTA$/RP и репутации LS Car Meet. За три завершённых заезда недельное испытание добавляет GTA$100,000.",
      "Auto Shop Robbery Contracts приносят 2X GTA$/RP до 2 сентября. Покупка Auto Shop только ради короткого окна не считается автоматической рекомендацией."
    ],
    en: [
      "Through September 2: Random Transform Races pay 3X GTA$/RP.",
      "Drift Races pay 2X GTA$/RP and LS Car Meet Rep. Completing three races adds the GTA$100,000 Weekly Challenge reward.",
      "Auto Shop Robbery Contracts pay 2X GTA$/RP through September 2. Buying an Auto Shop only for this short window is not an automatic recommendation."
    ]
  },
  opportunities: [
    {
      id: "random-transform-races",
      status: "verified",
      title: { ru: "Random Transform Races", en: "Random Transform Races" },
      summary: {
        ru: "Новые случайные трансформ-гонки приносят тройную выплату GTA$ и RP до 2 сентября.",
        en: "The new random transform races pay triple GTA$ and RP through September 2."
      },
      decision: {
        ru: "Открой маршрут без покупки актива и сравни фактическую выплату за один заезд со своим обычным GTA$/ч.",
        en: "Enter without buying an asset and compare one observed race payout with your normal GTA$/h."
      },
      signal: { ru: "3X · до 2 сент.", en: "3X · through Sep 2" },
      multiplier: 3
    },
    {
      id: "drift-races",
      status: "verified",
      title: { ru: "Drift Races", en: "Drift Races" },
      summary: {
        ru: "Дрифт-гонки приносят двойную выплату и GTA$100,000 после трёх завершённых заездов.",
        en: "Drift Races pay double, with GTA$100,000 added after three completed races."
      },
      decision: {
        ru: "Сначала проверь, помещаются ли три заезда в сеанс. Разовая награда учитывается только после достижения порога.",
        en: "First check whether three races fit the session. The one-time reward counts only after the threshold is reached."
      },
      signal: { ru: "2X + GTA$100K", en: "2X + GTA$100K" },
      multiplier: 2,
      fixedReward: 100_000,
      requiredRunsForReward: 3
    },
    {
      id: "auto-shop-robbery-contracts",
      status: "verified",
      title: { ru: "Auto Shop Robbery Contracts", en: "Auto Shop Robbery Contracts" },
      summary: {
        ru: "Контракты ограблений Auto Shop приносят двойную выплату GTA$ и RP до 2 сентября.",
        en: "Auto Shop Robbery Contracts pay double GTA$ and RP through September 2."
      },
      decision: {
        ru: "Считай маршрут только при уже купленном Auto Shop. Короткий бонус сам по себе не доказывает окупаемость новой покупки.",
        en: "Model the route only when you already own an Auto Shop. A short bonus does not prove that a new purchase pays back."
      },
      signal: { ru: "2X · нужен Auto Shop", en: "2X · Auto Shop required" },
      multiplier: 2,
      requiredAsset: "auto-shop"
    }
  ],
  closedWindows: [
    {
      id: "six-times-weekend",
      startsAt: "2026-08-28",
      endedAt: "2026-08-30",
      title: { ru: "Спецокно 6X уже закрыто", en: "The 6X weekend window has closed" },
      summary: {
        ru: "С 28 по 30 августа отдельные Drift и Transform Races приносили 6X GTA$/RP. На 1 сентября это только архивный факт.",
        en: "Select Drift and Transform Races paid 6X GTA$/RP from August 28 through 30. On September 1 this is archive context only."
      },
      signal: { ru: "Архив · 28-30 авг.", en: "Archive · Aug 28-30" }
    }
  ]
};
