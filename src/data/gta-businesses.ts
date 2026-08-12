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
    ru: "Рабочая оценка на основе открытых описаний механик. Для статуса verified требуется повторная игровая проверка.",
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
  checkedAt: "2026-08-12",
  validThrough: "2026-08-12",
  status: "verified",
  sourceUrl: "https://www.rockstargames.com/newswire/article/4k1k9k1581aa43/plan-the-perfect-getaway-during-the-summer-heist-event",
  sourceLabel: "Rockstar Newswire · Summer Heist Event",
  items: {
    ru: [
      "До 12 августа: GTA$1,000,000 за вход (доставка может занять до 72 часов).",
      "На первом новом прохождении Cayo Perico гарантирована Panther Statue; 3X GTA$/RP действует в Community Mission Series, 2X — в A Superyacht Life и Assault on Cayo Perico.",
      "Эти бонусы не применяются автоматически к production-business моделям ниже."
    ],
    en: [
      "Through August 12: GTA$1,000,000 login bonus (delivery may take up to 72 hours).",
      "The first fresh Cayo Perico playthrough guarantees the Panther Statue; Community Mission Series pays 3X GTA$/RP, while A Superyacht Life and Assault on Cayo Perico pay 2X.",
      "These bonuses are not automatically applied to the production-business models below."
    ]
  },
  opportunities: [
    {
      id: "login-capital",
      status: "verified",
      title: { ru: "Забери входной капитал", en: "Claim the login capital" },
      summary: {
        ru: "Вход в GTA Online до конца 12 августа даёт GTA$1 млн; начисление может занять до 72 часов.",
        en: "Log into GTA Online by the end of August 12 for GTA$1m; delivery can take up to 72 hours."
      },
      decision: {
        ru: "Сначала войди в игру, затем принимай необратимое решение о покупке.",
        en: "Log in before making an irreversible purchase decision."
      },
      signal: { ru: "+GTA$1 млн", en: "+GTA$1m" }
    },
    {
      id: "panther-statue",
      status: "verified",
      title: { ru: "Один редкий Cayo-run", en: "One rare Cayo run" },
      summary: {
        ru: "Первое новое прохождение Cayo Perico в окне 6–12 августа гарантирует Panther Statue.",
        en: "The first fresh Cayo Perico playthrough in the August 6–12 window guarantees the Panther Statue."
      },
      decision: {
        ru: "Закрой старый setup, если он мешает новому первому прохождению; не откладывай окно на потом.",
        en: "Resolve an old setup if it blocks a fresh first playthrough; do not treat the window as permanent."
      },
      signal: { ru: "До 12 авг.", en: "Ends Aug 12" }
    },
    {
      id: "boosted-routes",
      status: "verified",
      title: { ru: "Временный active-cash слой", en: "Temporary active-cash layer" },
      summary: {
        ru: "3X действует в Community Mission Series; 2X — в A Superyacht Life и Assault on Cayo Perico.",
        en: "Community Mission Series pays 3X; A Superyacht Life and Assault on Cayo Perico pay 2X."
      },
      decision: {
        ru: "Используй бусты как временный маршрут cash flow, но не переписывай ими базовую окупаемость production-активов.",
        en: "Use boosts as a temporary cash-flow route without rewriting baseline production-asset payback."
      },
      signal: { ru: "2X–3X", en: "2X–3X" }
    }
  ]
};
