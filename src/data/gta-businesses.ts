export type Locale = "ru" | "en";
export type VerificationStatus = "verified" | "estimated" | "community-reported";
export type DecisionPriority = "fast-payback" | "max-income" | "low-friction";
export type WeeklyAccessRequirement = "auto-shop" | "special-vehicle-work" | "special-cargo-warehouse" | "bunker" | "enhanced" | "bail-office" | "dispatch-work";

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
  "id": "2026-10-01-halloween-week-one",
  "startsAt": "2026-10-01",
  "checkedAt": "2026-10-06",
  "validThrough": "2026-10-07",
  "status": "verified",
  "sourceUrl": "https://www.rockstargames.com/newswire/article/39a22k25434a53/experience-halloween-thrills-all-throughout-october-in-gta-online",
  "sourceLabel": "Rockstar Newswire · Halloween 2026",
  "items": {
    "ru": [
      "1-7 октября: поймай две цели Bail Office и получи разовые GTA$100,000. Включай награду в план только если ещё не выполнил это задание.",
      "Bail Office Targets и Dispatch Work дают 2X GTA$/RP в октябре; Halloween Survivals дают 3X. Выплаты за конкретный заход и его длительность нужно замерить в игре.",
      "Месячные GTA$2,000,000 требуют все пять недельных заданий и поступают в течение 72 часов после выполнения. Этот бонус не входит в доход текущего сеанса.",
      "Следующее задание начнётся 8 октября. Текущий недельный расчёт перестанет применять бонус задания после 7 октября."
    ],
    "en": [
      "October 1-7: secure two Bail Office Bounties for a one-time GTA$100,000. Include it only if this challenge is not already completed.",
      "Bail Office Targets and Dispatch Work pay 2X GTA$/RP in October; Halloween Survivals pay 3X. Measure the payout and full duration of your chosen run in-game.",
      "The monthly GTA$2,000,000 requires all five weekly challenges and arrives within 72 hours of completion. It is excluded from this session’s cash.",
      "The next challenge begins October 8. This weekly calculation stops applying the challenge bonus after October 7."
    ]
  },
  "opportunities": [
    {
      "id": "bail-office-bounties",
      "status": "verified",
      "title": {
        "ru": "Bail Office: две цели",
        "en": "Bail Office: two bounties"
      },
      "summary": {
        "ru": "Двойные выплаты; разовые GTA$100,000 за две цели 1-7 октября.",
        "en": "Double payouts; a one-time GTA$100,000 for two bounties October 1-7."
      },
      "decision": {
        "ru": "Подтверди доступ к заданиям Bail Office. Для бонуса модель требует две цели в новом плане; уже полученную награду отключи.",
        "en": "Confirm access to Bail Office jobs. The model requires two bounties in the new plan for the bonus; disable any reward already earned."
      },
      "signal": {
        "ru": "2X · задание на GTA$100,000",
        "en": "2X · GTA$100,000 challenge"
      },
      "multiplier": 2,
      "fixedReward": 100000,
      "requiredRunsForReward": 2,
      "requiredAsset": "bail-office"
    },
    {
      "id": "dispatch-work",
      "status": "verified",
      "title": {
        "ru": "Dispatch Work",
        "en": "Dispatch Work"
      },
      "summary": {
        "ru": "Работа Винсента приносит 2X GTA$/RP в октябре.",
        "en": "Vincent’s Dispatch Work pays 2X GTA$/RP in October."
      },
      "decision": {
        "ru": "Проверь доступ к Dispatch Work. Введи обычную выплату без 2X и полный цикл с дорогой и ожиданием.",
        "en": "Confirm access to Dispatch Work. Enter the normal payout before 2X and the full cycle including travel and waits."
      },
      "signal": {
        "ru": "2X · нужен доступ",
        "en": "2X · access required"
      },
      "multiplier": 2,
      "requiredAsset": "dispatch-work"
    },
    {
      "id": "halloween-survivals",
      "status": "verified",
      "title": {
        "ru": "Halloween Survivals",
        "en": "Halloween Survivals"
      },
      "summary": {
        "ru": "Хэллоуинские выживания приносят 3X GTA$/RP.",
        "en": "Halloween Survivals pay 3X GTA$/RP."
      },
      "decision": {
        "ru": "Используй замер на том числе волн, которое стабильно проходишь. Длительность и награда зависят от результата.",
        "en": "Use a sample for the number of waves you can reliably finish. Time and rewards depend on your result."
      },
      "signal": {
        "ru": "3X · выживания",
        "en": "3X · Survivals"
      },
      "multiplier": 3
    }
  ],
  "closedWindows": [
    {
      "id": "2026-09-17-business-rivalries-gunrunning",
      "startsAt": "2026-09-17",
      "endedAt": "2026-09-23",
      "title": {
        "ru": "Сентябрьская неделя бункеров завершена",
        "en": "September Gunrunning week ended"
      },
      "summary": {
        "ru": "Множители и разовый миллион Business Rivalries закончились 23 сентября. Они не переносятся в октябрьский расчёт.",
        "en": "Business Rivalries multipliers and its one-time million ended September 23. They do not carry into October’s calculation."
      },
      "signal": {
        "ru": "Архив · 17-23 сентября",
        "en": "Archive · September 17-23"
      }
    }
  ]
};
