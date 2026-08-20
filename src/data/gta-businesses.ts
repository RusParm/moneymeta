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
  }>;
}

export const weeklyMeta: WeeklyMetaSnapshot = {
  checkedAt: "2026-08-19",
  validThrough: "2026-08-26",
  status: "verified",
  sourceUrl: "https://www.rockstargames.com/newswire/article/9k2kok31k3a8k9/declare-your-allegiance-and-determine-who-owns-los-santos-in-the-brand",
  sourceLabel: "Rockstar Newswire · Brand Wars",
  items: {
    ru: [
      "До 26 августа: бесплатно забери Declasse Hotring Sabre и отдели эту экономию от дохода бизнеса.",
      "4X GTA$/RP действует в испытаниях и событиях свободного режима; 21-23 августа VIP Work приносит 5X GTA$/RP.",
      "Временные множители не применяются автоматически к долгосрочным моделям производственных активов."
    ],
    en: [
      "Through August 26: claim the Declasse Hotring Sabre for free and keep that acquisition saving separate from business income.",
      "Freemode Challenges and Events pay 4X GTA$/RP; VIP Work pays 5X GTA$/RP from August 21 through 23.",
      "Temporary multipliers are not automatically applied to long-horizon production-asset models."
    ]
  },
  opportunities: [
    {
      id: "free-hotring-sabre",
      status: "verified",
      title: { ru: "Забери бесплатный автомобиль", en: "Claim the free vehicle" },
      summary: {
        ru: "Declasse Hotring Sabre доступен бесплатно до 26 августа.",
        en: "The Declasse Hotring Sabre is free through August 26."
      },
      decision: {
        ru: "Забери актив, если он тебе нужен, но не записывай сэкономленную цену в регулярную прибыль.",
        en: "Claim it if it fits your garage, but do not count the saved purchase price as recurring profit."
      },
      signal: { ru: "Бесплатно", en: "Free" }
    },
    {
      id: "freemode-boost",
      status: "verified",
      title: { ru: "Проверь свободный режим", en: "Test the Freemode boost" },
      summary: {
        ru: "Испытания и события свободного режима приносят 4X GTA$/RP до 26 августа.",
        en: "Freemode Challenges and Events pay 4X GTA$/RP through August 26."
      },
      decision: {
        ru: "Сравни фактическую выплату и время двух-трёх событий со своим обычным маршрутом, прежде чем менять всю неделю.",
        en: "Compare the realized payout and time from two or three events with your normal route before changing the whole week."
      },
      signal: { ru: "4X до 26 авг.", en: "4X through Aug 26" }
    },
    {
      id: "vip-work-weekend",
      status: "verified",
      title: { ru: "Подготовь короткое окно VIP Work", en: "Prepare the VIP Work window" },
      summary: {
        ru: "С 21 по 23 августа VIP Work приносит 5X GTA$/RP.",
        en: "VIP Work pays 5X GTA$/RP from August 21 through 23."
      },
      decision: {
        ru: "Выдели один короткий сеанс, если у тебя уже есть доступ. Не покупай дорогую инфраструктуру только ради трёхдневного множителя.",
        en: "Reserve one short session when access already exists. Do not buy expensive infrastructure only for a three-day multiplier."
      },
      signal: { ru: "5X · 21-23 авг.", en: "5X · Aug 21-23" }
    }
  ]
};
