export type Locale = "ru" | "en";
export type VerificationStatus = "verified" | "estimated" | "community-reported";
export type DecisionPriority = "fast-payback" | "max-income" | "low-friction";
export type WeeklyAccessRequirement = "auto-shop" | "special-vehicle-work" | "special-cargo-warehouse";

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
  id: "2026-09-03-business-rivalries-executive",
  startsAt: "2026-09-03",
  checkedAt: "2026-09-04",
  validThrough: "2026-09-09",
  status: "verified",
  sourceUrl: "https://www.rockstargames.com/newswire/article/ak43aoa18a19o2/compete-across-entrepreneurial-endeavors-in-the-gta-online-business-ri",
  sourceLabel: "Rockstar Newswire · Business Rivalries",
  items: {
    ru: [
      "С 3 по 9 сентября: продай Special Cargo на GTA$1,000,000, чтобы получить ещё GTA$1,000,000 и Yeti x LS Customs Tracksuit.",
      "Special Vehicle Work приносит 4X GTA$/RP, Community Mission Series приносит 3X, а Export Mixed Goods и Madrazo Hits приносят 2X.",
      "Сотрудники складов добывают Special Cargo вдвое быстрее, а офис Arcadius Business Center можно забрать бесплатно до 9 сентября.",
      "Одно выполненное Weekly Challenge с 3 по 23 сентября даёт право забрать Penaud La Coureuse и бесплатное HSW-улучшение с 24 по 30 сентября на поддерживаемых платформах."
    ],
    en: [
      "September 3 to 9: sell GTA$1,000,000 worth of Special Cargo to receive another GTA$1,000,000 and the Yeti x LS Customs Tracksuit.",
      "Special Vehicle Work pays 4X GTA$/RP, the Community Mission Series pays 3X, and Export Mixed Goods and Madrazo Hits pay 2X.",
      "Warehouse staff source Special Cargo at double speed, while the Arcadius Business Center Office is free to claim through September 9.",
      "Completing one Weekly Challenge from September 3 to 23 qualifies you to claim a Penaud La Coureuse and complimentary HSW upgrade September 24 to 30 on supported platforms."
    ]
  },
  opportunities: [
    {
      id: "special-vehicle-work",
      status: "verified",
      title: { ru: "Special Vehicle Work", en: "Special Vehicle Work" },
      summary: {
        ru: "Задания со специальной техникой приносят 4X GTA$ и RP с 3 по 9 сентября.",
        en: "Special Vehicle Work pays 4X GTA$ and RP from September 3 through 9."
      },
      decision: {
        ru: "Считай маршрут только при уже открытом доступе: нужен Executive Office и четыре выполненных задания по доставке Vehicle Cargo. Стоимость инфраструктуры в короткий расчёт не входит.",
        en: "Model this route only with access already unlocked: it requires an Executive Office and four completed Vehicle Cargo source missions. The short-window calculation excludes infrastructure cost."
      },
      signal: { ru: "4X · до 9 сент.", en: "4X · through Sep 9" },
      multiplier: 4,
      requiredAsset: "special-vehicle-work"
    },
    {
      id: "community-mission-series",
      status: "verified",
      title: { ru: "Community Mission Series", en: "Community Mission Series" },
      summary: {
        ru: "Избранные миссии сообщества приносят 3X GTA$ и RP; стартовая подборка действует с 3 по 9 сентября.",
        en: "Featured Community Missions pay 3X GTA$ and RP, with the opening selection live September 3 to 9."
      },
      decision: {
        ru: "Это открытый маршрут без покупки бизнеса. Проверь один полный заход и сравни его фактический темп со своей обычной сессией.",
        en: "This route needs no business purchase. Measure one complete run and compare its realized rate with your normal session."
      },
      signal: { ru: "3X · без покупки", en: "3X · no purchase" },
      multiplier: 3
    },
    {
      id: "export-mixed-goods",
      status: "verified",
      title: { ru: "Export Mixed Goods", en: "Export Mixed Goods" },
      summary: {
        ru: "Экспорт смешанных товаров приносит двойную награду с 3 по 9 сентября.",
        en: "Export Mixed Goods deliveries pay double rewards from September 3 through 9."
      },
      decision: {
        ru: "Используй маршрут только при уже купленных Executive Office и складе Special Cargo. Бесплатный офис снижает порог входа, но стоимость склада всё равно не входит в недельную модель.",
        en: "Use this route only with an Executive Office and Special Cargo Warehouse already available. The free office lowers entry cost, but warehouse acquisition still sits outside the weekly model."
      },
      signal: { ru: "2X · офис и склад", en: "2X · office and warehouse" },
      multiplier: 2,
      requiredAsset: "special-cargo-warehouse"
    }
  ],
  closedWindows: [
    {
      id: "2026-08-27-random-transform",
      startsAt: "2026-08-27",
      endedAt: "2026-09-02",
      title: { ru: "Неделя Random Transform Races закрыта", en: "The Random Transform Races week has closed" },
      summary: {
        ru: "Окно с 3X Random Transform Races, 2X Drift Races и 2X Auto Shop Robbery Contracts закончилось 2 сентября и больше не участвует в расчёте.",
        en: "The 3X Random Transform Races, 2X Drift Races and 2X Auto Shop Robbery Contracts window ended September 2 and no longer enters the calculation."
      },
      signal: { ru: "Архив · 27 авг. - 2 сент.", en: "Archive · Aug 27 to Sep 2" }
    }
  ]
};
