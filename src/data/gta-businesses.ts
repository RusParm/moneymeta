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
  gameVersion: "GTA Online — July 2026 estimate set",
  status: "estimated",
  sourceNote: {
    ru: "Рабочая оценка на основе открытых описаний механик. Перед публикацией v1 требуется повторная игровая проверка.",
    en: "Working estimate based on public mechanic descriptions. In-game revalidation is required before v1 publication."
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
    name: { ru: "Ночной клуб — базовая модель", en: "Nightclub — base model" },
    summary: {
      ru: "Низкий friction и пассивный поток; текущая модель не включает синергию всех складских товаров.",
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
  checkedAt: string;
  validThrough: string;
  status: VerificationStatus;
  items: Record<Locale, string[]>;
}

export const weeklyMeta: WeeklyMetaSnapshot = {
  checkedAt: "2026-07-01",
  validThrough: "2026-07-09",
  status: "community-reported",
  items: {
    ru: [
      "Архивный пример: продажи Acid Lab x2 GTA$/RP.",
      "Архивный пример: отдельные контракты и бизнес-активы получали временные бонусы."
    ],
    en: [
      "Archived example: Acid Lab sales at 2x GTA$/RP.",
      "Archived example: selected contracts and business assets received temporary bonuses."
    ]
  }
};
