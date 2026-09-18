export type Locale = "ru" | "en";
export type VerificationStatus = "verified" | "estimated" | "community-reported";
export type DecisionPriority = "fast-payback" | "max-income" | "low-friction";
export type WeeklyAccessRequirement = "auto-shop" | "special-vehicle-work" | "special-cargo-warehouse" | "bunker" | "enhanced";

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
    requiredAsset?: WeeklyAccessRequirement;
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
  "id": "2026-09-17-business-rivalries-gunrunning",
  "startsAt": "2026-09-17",
  "checkedAt": "2026-09-18",
  "validThrough": "2026-09-23",
  "status": "verified",
  "sourceUrl": "https://www.rockstargames.com/newswire/article/ak43aoa18a19o2/compete-across-entrepreneurial-endeavors-in-the-gta-online-business-ri",
  "sourceLabel": "Rockstar Newswire · Business Rivalries",
  "items": {
    "ru": [
      "17-23 сентября: исследовательские миссии бункера дают 2X GTA$/RP и прогресса исследований. Ammu-Nation Contracts и Safeguard Deliveries также дают 2X GTA$/RP.",
      "За три Bunker Research Missions положены разовые GTA$1,000,000 и Camo Ammu-Nation Sweatsuit. Не включай уже полученную награду в будущий доход.",
      "Бесплатен только Grapeseed Bunker до 23 сентября. Улучшения, снабжение и время запуска остаются расходами.",
      "Одно Weekly Challenge с 3 по 23 сентября открывает получение Penaud La Coureuse 24-30 сентября; бесплатное HSW-улучшение доступно на PS5, Xbox Series X|S и PC Enhanced."
    ],
    "en": [
      "September 17-23: Bunker Research Missions pay 2X GTA$/RP and Research Progress. Ammu-Nation Contracts and Safeguard Deliveries also pay 2X GTA$/RP.",
      "Three Bunker Research Missions award a one-time GTA$1,000,000 and Camo Ammu-Nation Sweatsuit. Exclude a reward already earned from future income.",
      "Only Grapeseed Bunker is free through September 23. Upgrades, supplies and setup time still cost you.",
      "One Weekly Challenge September 3-23 qualifies for a Penaud La Coureuse claim September 24-30; the free HSW upgrade is available on PS5, Xbox Series X|S and PC Enhanced."
    ]
  },
  "opportunities": [
    {
      "id": "bunker-research",
      "status": "verified",
      "title": {
        "ru": "Bunker Research Missions",
        "en": "Bunker Research Missions"
      },
      "summary": {
        "ru": "2X выплат и прогресса исследований; за три миссии предусмотрен разовый миллион.",
        "en": "2X payouts and Research Progress, with a one-time million for three missions."
      },
      "decision": {
        "ru": "Нужен доступ к миссиям Agent 14. Включай миллион только до выполнения недельного задания; расчёт требует все три миссии в новом плане. Замерь полный цикл с ожиданием.",
        "en": "Requires access to Agent 14 missions. Include the million only before completing the challenge; this model requires all three missions in the new plan. Measure a full cycle including waits."
      },
      "signal": {
        "ru": "2X · разовый миллион",
        "en": "2X · one-time million"
      },
      "multiplier": 2,
      "fixedReward": 1000000,
      "requiredRunsForReward": 3,
      "requiredAsset": "bunker"
    },
    {
      "id": "ammu-nation-contract",
      "status": "verified",
      "title": {
        "ru": "Ammu-Nation Contract",
        "en": "Ammu-Nation Contract"
      },
      "summary": {
        "ru": "Доставка излишков оружия из бункера даёт двойную выплату до 23 сентября.",
        "en": "Surplus weapon deliveries from your bunker pay double through September 23."
      },
      "decision": {
        "ru": "Нужен доступный Duneloader в бункере. Учитывай ожидание следующей доставки; обычные продажи продукции бункера не получают этот множитель.",
        "en": "Requires the bunker Duneloader to be available. Include the wait for the next delivery; this multiplier does not apply to regular bunker product sales."
      },
      "signal": {
        "ru": "2X · нужен бункер",
        "en": "2X · bunker required"
      },
      "multiplier": 2,
      "requiredAsset": "bunker"
    },
    {
      "id": "community-mission-series",
      "status": "verified",
      "title": {
        "ru": "Community Mission Series",
        "en": "Community Mission Series"
      },
      "summary": {
        "ru": "Избранные миссии дают 3X GTA$/RP до 23 сентября на PS5, Xbox Series X|S и PC Enhanced.",
        "en": "Featured missions pay 3X GTA$/RP through September 23 on PS5, Xbox Series X|S and PC Enhanced."
      },
      "decision": {
        "ru": "Проверь платформу и выбранную миссию в меню Community Series. Покупка бизнеса не требуется.",
        "en": "Check your platform and the featured mission in Community Series. No business purchase is required."
      },
      "signal": {
        "ru": "3X · Enhanced",
        "en": "3X · Enhanced"
      },
      "multiplier": 3,
      "requiredAsset": "enhanced"
    }
  ],
  "closedWindows": [
    {
      "id": "2026-09-10-business-rivalries-bikers",
      "startsAt": "2026-09-10",
      "endedAt": "2026-09-16",
      "title": {
        "ru": "Неделя байкеров завершена",
        "en": "Biker week ended"
      },
      "summary": {
        "ru": "Бонусы MC, Street Dealer Sales, Bike Service и бесплатный Grapeseed Clubhouse завершились 16 сентября. Более раннее окно Executive также закрыто.",
        "en": "MC, Street Dealer Sales, Bike Service bonuses and the free Grapeseed Clubhouse ended September 16. The earlier Executive window has also closed."
      },
      "signal": {
        "ru": "Архив · 10-16 сент.",
        "en": "Archive · Sep 10-16"
      }
    }
  ]
};
