import type { DecisionPriority, Locale } from "./gta-businesses";

export interface GtaEconomyNode {
  id: string;
  code: string;
  title: Record<Locale, string>;
  phase: Record<Locale, string>;
  summary: Record<Locale, string>;
  decision: Record<Locale, string>;
  signal: Record<Locale, string>;
  href: string;
}

export const gtaEconomyNodes: GtaEconomyNode[] = [
  {
    id: "capital",
    code: "01",
    title: { ru: "Капитал", en: "Capital" },
    phase: { ru: "Точка входа", en: "Entry point" },
    summary: {
      ru: "Банк — это запас вариантов. Потраченный GTA$ становится неликвидным активом, пока бизнес не вернёт вложения.",
      en: "Cash is optionality. Once spent, GTA$ becomes an illiquid asset until the business earns the capital back."
    },
    decision: {
      ru: "Отдели рабочий капитал от суммы, которую готов надолго заморозить в покупке.",
      en: "Separate operating cash from the amount you are willing to lock into an acquisition."
    },
    signal: { ru: "GTA$ доступно", en: "GTA$ deployable" },
    href: "#player-paths"
  },
  {
    id: "acquisition",
    code: "02",
    title: { ru: "Покупка", en: "Acquire" },
    phase: { ru: "Capital lock-up", en: "Capital lock-up" },
    summary: {
      ru: "Цена недвижимости и обязательных улучшений определяет реальный вход, а не рекламная цена одного объекта.",
      en: "Property plus required upgrades define the real entry cost — not the headline property price alone."
    },
    decision: {
      ru: "Сравни полную стоимость запуска с окупаемостью и тем, что у тебя уже куплено.",
      en: "Compare full setup cost with payback and the infrastructure you already own."
    },
    signal: { ru: "7 активов в модели", en: "7 modeled assets" },
    href: "#conditional-rankings"
  },
  {
    id: "supply",
    code: "03",
    title: { ru: "Ресурсы", en: "Supply" },
    phase: { ru: "Cash или время", en: "Cash or time" },
    summary: {
      ru: "Закупка supplies уменьшает маржу, а добыча вручную превращает экономию денег в активный grind.",
      en: "Buying supplies reduces margin; sourcing them manually converts saved cash into active grind."
    },
    decision: {
      ru: "Оцени supplies как trade-off между чистой прибылью и ценой собственного времени.",
      en: "Treat supplies as a trade-off between net profit and the value of your time."
    },
    signal: { ru: "Маржа ↔ время", en: "Margin ↔ time" },
    href: "/gta-online/calculators/business-roi/#model-lab"
  },
  {
    id: "production",
    code: "04",
    title: { ru: "Производство", en: "Produce" },
    phase: { ru: "Время в онлайне", en: "Online time" },
    summary: {
      ru: "Товар создаётся во время работы игры. Production hours нельзя выдавать за количество ручного grind.",
      en: "Stock is created while the game is running. Production hours are not the same as manual grind hours."
    },
    decision: {
      ru: "Смотри одновременно profit per production hour и active minutes per cycle.",
      en: "Read profit per production hour together with active minutes per cycle."
    },
    signal: { ru: "Пассивный compounding", en: "Passive compounding" },
    href: "#conditional-rankings"
  },
  {
    id: "storage",
    code: "05",
    title: { ru: "Запас", en: "Store" },
    phase: { ru: "Inventory risk", en: "Inventory risk" },
    summary: {
      ru: "Готовый товар ещё не деньги. Большой склад увеличивает потенциальную продажу, но может усложнить solo-доставку.",
      en: "Finished stock is not cash yet. A fuller warehouse increases the sale value but can make solo delivery harder."
    },
    decision: {
      ru: "Не накапливай объём выше своего реального окна продажи и допустимого friction.",
      en: "Do not build stock beyond your realistic sale window and friction tolerance."
    },
    signal: { ru: "Inventory at risk", en: "Inventory at risk" },
    href: "#player-paths"
  },
  {
    id: "sale",
    code: "06",
    title: { ru: "Продажа", en: "Sell" },
    phase: { ru: "Момент ликвидности", en: "Liquidity event" },
    summary: {
      ru: "Только завершённая продажа превращает inventory в GTA$. Машины, сессия и бонусы меняют реальный результат.",
      en: "Only a completed sale turns inventory into GTA$. Vehicles, lobby conditions and bonuses change the realized result."
    },
    decision: {
      ru: "Считай net после supplies и проверяй, выполнима ли доставка твоим составом.",
      en: "Calculate net after supplies and confirm the delivery is realistic for your group size."
    },
    signal: { ru: "Headline → net", en: "Headline → net" },
    href: "#scenario-deck"
  },
  {
    id: "reinvest",
    code: "07",
    title: { ru: "Реинвест", en: "Reinvest" },
    phase: { ru: "Портфель", en: "Portfolio" },
    summary: {
      ru: "Следующая покупка должна дополнять текущий цикл, а не просто повторять самый популярный tier list.",
      en: "The next purchase should complement the existing loop instead of copying the most popular tier list."
    },
    decision: {
      ru: "Оптимизируй набор активов под общий бюджет и активные часы, а не каждый бизнес по отдельности.",
      en: "Optimize the asset set for total budget and active hours, not each business in isolation."
    },
    signal: { ru: "Cash flow → рост", en: "Cash flow → growth" },
    href: "/gta-online/calculators/business-roi/#portfolio"
  }
];

export type GtaPlayerProfile = "returner" | "casual" | "grinder";

export interface GtaPlayerPath {
  id: GtaPlayerProfile;
  label: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  budget: number;
  weeklyHours: number;
  priority: DecisionPriority;
  maxFriction: number;
  steps: Array<{
    title: Record<Locale, string>;
    text: Record<Locale, string>;
  }>;
  flipCondition: Record<Locale, string>;
}

export const gtaPlayerPaths: GtaPlayerPath[] = [
  {
    id: "returner",
    label: { ru: "Вернулся", en: "Returner" },
    title: { ru: "Восстановить cash flow без дорогой ошибки", en: "Rebuild cash flow without an expensive mistake" },
    summary: {
      ru: "Baseline: GTA$2,5 млн, 6 часов в неделю, средняя терпимость к операционке.",
      en: "Baseline: GTA$2.5m, six hours a week and medium operating tolerance."
    },
    budget: 2_500_000,
    weeklyHours: 6,
    priority: "fast-payback",
    maxFriction: 6,
    steps: [
      {
        title: { ru: "Проверь Pulse", en: "Check the Pulse" },
        text: { ru: "Сначала забери ограниченные по времени выплаты и только затем фиксируй бюджет.", en: "Claim time-limited value first, then lock the budget you can actually deploy." }
      },
      {
        title: { ru: "Начни с обратимого сравнения", en: "Start with a reversible comparison" },
        text: { ru: "Сопоставь Acid Lab, Bunker и уже имеющиеся активы по net, payback и friction.", en: "Compare Acid Lab, Bunker and assets you already own by net, payback and friction." }
      },
      {
        title: { ru: "Сохрани резерв", en: "Keep a reserve" },
        text: { ru: "Не вкладывай весь банк: следующий цикл требует supplies и свободы для временных возможностей.", en: "Do not deploy the entire bank; the next cycle needs supplies and room for temporary opportunities." }
      }
    ],
    flipCondition: {
      ru: "Ответ меняется, если ключевая инфраструктура уже куплена или weekly-бонус прямо усиливает другой актив.",
      en: "The answer changes when key infrastructure is already owned or a weekly bonus directly boosts another asset."
    }
  },
  {
    id: "casual",
    label: { ru: "Solo / casual", en: "Solo / casual" },
    title: { ru: "Максимум ценности за четыре спокойных часа", en: "Maximize value across four calm hours" },
    summary: {
      ru: "Baseline: GTA$2,5 млн, 4 часа в неделю, friction не выше 4/10.",
      en: "Baseline: GTA$2.5m, four hours a week and friction capped at 4/10."
    },
    budget: 2_500_000,
    weeklyHours: 4,
    priority: "low-friction",
    maxFriction: 4,
    steps: [
      {
        title: { ru: "Поставь friction ceiling", en: "Set a friction ceiling" },
        text: { ru: "Сразу убери циклы, которые регулярно требуют неприятной solo-логистики.", en: "Remove loops that routinely require uncomfortable solo logistics." }
      },
      {
        title: { ru: "Один production loop", en: "Run one production loop" },
        text: { ru: "Выбери актив, который реально обслуживать каждую неделю, а не идеальный портфель на бумаге.", en: "Choose one asset you can service every week, not a theoretical perfect portfolio." }
      },
      {
        title: { ru: "Активные деньги — по Pulse", en: "Use the Pulse for active cash" },
        text: { ru: "Свободное время направляй в текущий boosted route, не меняя долгосрочную модель бизнеса.", en: "Put spare time into the current boosted route without distorting the long-term business model." }
      }
    ],
    flipCondition: {
      ru: "Если готов терпеть friction 5–6/10, Bunker и более широкий набор активов возвращаются в выборку.",
      en: "If you accept friction of 5–6/10, Bunker and a wider asset set re-enter the shortlist."
    }
  },
  {
    id: "grinder",
    label: { ru: "Grinder", en: "Grinder" },
    title: { ru: "Оптимизировать не бизнес, а недельный портфель", en: "Optimize the weekly portfolio, not one business" },
    summary: {
      ru: "Baseline: GTA$6 млн, 15 часов в неделю, высокий допуск к ручной работе.",
      en: "Baseline: GTA$6m, 15 hours a week and high tolerance for active work."
    },
    budget: 6_000_000,
    weeklyHours: 15,
    priority: "max-income",
    maxFriction: 10,
    steps: [
      {
        title: { ru: "Раздели active и passive", en: "Separate active and passive" },
        text: { ru: "Не сравнивай heist-час и production-hour как одну и ту же единицу времени.", en: "Do not treat a heist hour and a production hour as the same unit of time." }
      },
      {
        title: { ru: "Ищи портфельную роль", en: "Assign a portfolio role" },
        text: { ru: "Каждому активу нужна функция: cash engine, low-touch layer или weekly-bonus option.", en: "Every asset needs a job: cash engine, low-touch layer or weekly-bonus option." }
      },
      {
        title: { ru: "Проверь sensitivity", en: "Test sensitivity" },
        text: { ru: "Меняй supplies, бонус и производство в Model Lab до покупки, а не после.", en: "Change supplies, bonus and production assumptions in Model Lab before buying, not after." }
      }
    ],
    flipCondition: {
      ru: "Оптимальный набор меняется вместе с активным временем: ограничение по логистике может быть важнее бюджета.",
      en: "The optimal set changes with active time; logistics can bind before capital does."
    }
  }
];

export type GtaScenarioMode = "next-move" | "model" | "portfolio";

export interface GtaScenario {
  id: string;
  mode: GtaScenarioMode;
  eyebrow: Record<Locale, string>;
  question: Record<Locale, string>;
  outcome: Record<Locale, string>;
  hash: string;
  parameters: Record<string, string>;
}

export const gtaScenarios: GtaScenario[] = [
  {
    id: "first-million",
    mode: "next-move",
    eyebrow: { ru: "GTA$1,1 млн", en: "GTA$1.1m" },
    question: { ru: "Какой первый production-актив помещается в бюджет?", en: "Which first production asset fits the budget?" },
    outcome: { ru: "Фильтр оставляет доступный low-entry сценарий и показывает, почему он проходит.", en: "The filter keeps an affordable low-entry scenario and explains why it qualifies." },
    hash: "next-move",
    parameters: {
      "gta-next-move.profile": "returner",
      "gta-next-move.budget": "1100000",
      "gta-next-move.hours": "5",
      "gta-next-move.priority": "fast-payback",
      "gta-next-move.friction": "6"
    }
  },
  {
    id: "returner-2-5m",
    mode: "next-move",
    eyebrow: { ru: "Returner · GTA$2,5 млн", en: "Returner · GTA$2.5m" },
    question: { ru: "Что купить после долгого перерыва?", en: "What should I buy after a long break?" },
    outcome: { ru: "Один следующий ход, две альтернативы и условие, при котором лидер меняется.", en: "One next move, two alternatives and the condition that changes the leader." },
    hash: "next-move",
    parameters: {
      "gta-next-move.profile": "returner",
      "gta-next-move.budget": "2500000",
      "gta-next-move.hours": "6",
      "gta-next-move.priority": "fast-payback",
      "gta-next-move.friction": "6"
    }
  },
  {
    id: "four-hours",
    mode: "next-move",
    eyebrow: { ru: "4 часа / неделя", en: "4 hours / week" },
    question: { ru: "Что оставить в ротации solo/casual игроку?", en: "What should a solo/casual player keep in rotation?" },
    outcome: { ru: "Сценарий ставит friction ceiling 4/10 и снижает ценность тяжёлой операционки.", en: "The scenario caps friction at 4/10 and discounts heavy operating work." },
    hash: "next-move",
    parameters: {
      "gta-next-move.profile": "casual",
      "gta-next-move.budget": "2500000",
      "gta-next-move.hours": "4",
      "gta-next-move.priority": "low-friction",
      "gta-next-move.friction": "4"
    }
  },
  {
    id: "five-million-portfolio",
    mode: "portfolio",
    eyebrow: { ru: "GTA$5 млн · portfolio", en: "GTA$5m · portfolio" },
    question: { ru: "Какой набор активов помещается в два активных часа?", en: "Which asset set fits two active hours?" },
    outcome: { ru: "Оптимизатор перебирает комбинации по капиталу и активному времени.", en: "The optimizer searches combinations under capital and active-time constraints." },
    hash: "portfolio",
    parameters: {
      "gta-portfolio.portfolio-budget": "5000000",
      "gta-portfolio.portfolio-hours": "2"
    }
  },
  {
    id: "bonus-sensitivity",
    mode: "model",
    eyebrow: { ru: "+50% к продаже", en: "+50% sale bonus" },
    question: { ru: "Как временный бонус меняет окупаемость?", en: "How does a temporary bonus change payback?" },
    outcome: { ru: "Model Lab пересчитает gross, net, vROI и payback, не меняя baseline-данные.", en: "Model Lab recalculates gross, net, vROI and payback without mutating baseline data." },
    hash: "model-lab",
    parameters: {
      "gta-business.business": "acid",
      "gta-business.setup": "1000000",
      "gta-business.sale": "335000",
      "gta-business.supply": "60000",
      "gta-business.production": "4.6",
      "gta-business.bonus": "50",
      "gta-business.weekly": "8"
    }
  },
  {
    id: "bunker-owned",
    mode: "model",
    eyebrow: { ru: "Уже есть Bunker", en: "Bunker already owned" },
    question: { ru: "Почему setup cost меняет весь вывод?", en: "Why does setup cost change the whole conclusion?" },
    outcome: { ru: "Обнули стартовые вложения и увидишь разницу между buy decision и run decision.", en: "Set setup cost to zero to separate the buy decision from the run decision." },
    hash: "model-lab",
    parameters: {
      "gta-business.business": "bunker",
      "gta-business.setup": "0",
      "gta-business.sale": "250000",
      "gta-business.supply": "75000",
      "gta-business.production": "3",
      "gta-business.bonus": "0",
      "gta-business.weekly": "8"
    }
  }
];
