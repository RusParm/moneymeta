export type StrategyLocale = "ru" | "en";
export type Localized = Record<StrategyLocale, string>;

export interface StrategyEconomyNode {
  id: string;
  code: string;
  mark: string;
  title: Localized;
  phase: Localized;
  summary: Localized;
  signal: Localized;
  decision: Localized;
  href: string;
}

export interface StrategyPath {
  id: string;
  mark: string;
  label: Localized;
  title: Localized;
  summary: Localized;
  constraints: Array<{ label: Localized; value: Localized }>;
  steps: Array<{ title: Localized; text: Localized }>;
  flip: Localized;
  href: string;
}

export interface StrategyPulseChange {
  mark: string;
  signal: Localized;
  title: Localized;
  summary: Localized;
  decision: Localized;
  sourceLabel: string;
  sourceUrl: string;
}

export interface StrategyLens {
  id: string;
  label: Localized;
  question: Localized;
  formula: Localized;
  note: Localized;
  cards: Array<{
    mark: string;
    title: Localized;
    grade: string;
    fit: number;
    text: Localized;
    metrics: Array<{ label: Localized; value: Localized }>;
  }>;
}

export interface StrategyScenario {
  mark: string;
  mode: Localized;
  eyebrow: Localized;
  question: Localized;
  outcome: Localized;
  href: string;
}

export type StrategyModelKind = "investment" | "reserve" | "comparison";
export type StrategyResultFormat = "currency" | "percent" | "periods" | "number" | "winner";

export interface StrategyModel {
  id: string;
  kind: StrategyModelKind;
  mark: string;
  kicker: Localized;
  title: Localized;
  text: Localized;
  note: Localized;
  inputs: Array<{
    key: string;
    label: Localized;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    group?: "a" | "b";
  }>;
  results: Array<{
    key: string;
    label: Localized;
    format: StrategyResultFormat;
    accent?: "primary" | "positive" | "warning";
  }>;
  winnerLabels?: { a: Localized; b: Localized; tie: Localized };
}

export interface StrategyBrief {
  mark: string;
  audience: "returner" | "casual" | "grinder";
  status: "verified" | "estimated";
  kicker: Localized;
  title: Localized;
  text: Localized;
  takeaway: Localized;
  href: string;
}

export interface StrategyHubData {
  id: "total-war" | "ck3";
  slug: string;
  name: string;
  shortName: string;
  publisher: string;
  worldCode: string;
  checkedAt: string;
  version: string;
  currencyUnit: string;
  periodUnit: Localized;
  meta: { title: Localized; description: Localized };
  hero: {
    live: Localized;
    eyebrow: Localized;
    heading: Localized;
    lede: Localized;
    primary: Localized;
    secondary: Localized;
    proof: Array<[string, Localized]>;
    loadout: Array<{ mark: string; label: string; value: Localized }>;
  };
  manifesto: {
    kicker: Localized;
    title: Localized;
    text: Localized;
    principles: Array<{ title: string; text: Localized }>;
  };
  economyNodes: StrategyEconomyNode[];
  paths: StrategyPath[];
  pulse: {
    title: Localized;
    text: Localized;
    changes: StrategyPulseChange[];
  };
  lenses: StrategyLens[];
  scenarios: StrategyScenario[];
  models: StrategyModel[];
  briefs: StrategyBrief[];
  methodology: {
    title: Localized;
    text: Localized;
    modelNote: Localized;
    disclaimer: Localized;
    roadmap: Localized;
    sources: Array<{ label: string; url: string; note: Localized }>;
  };
}

const ruEn = (ru: string, en: string): Localized => ({ ru, en });

export const totalWarHub: StrategyHubData = {
  id: "total-war",
  slug: "total-war",
  name: "Total War: Warhammer III",
  shortName: "Total War",
  publisher: "SEGA / Creative Assembly",
  worldCode: "CAMPAIGN CAPITAL / 8.1",
  checkedAt: "2026-08-12",
  version: "Patch 8.1",
  currencyUnit: "gold",
  periodUnit: ruEn("ход.", "turns"),
  meta: {
    title: ruEn("Total War: Warhammer III Economy Hub: казна, армии и провинции | Money Meta", "Total War: Warhammer III Economy Hub: treasury, armies and provinces | Money Meta"),
    description: ruEn("Интерактивная экономика кампании Total War: Warhammer III: карта капитала, пути игрока, Patch 8.1 Pulse и модели зданий, военного резерва и захвата.", "An interactive Total War: Warhammer III campaign economy with capital map, player paths, Patch 8.1 Pulse and models for buildings, war reserves and conquest choices.")
  },
  hero: {
    live: ruEn("Patch 8.1 · проверено 2026-08-12", "Patch 8.1 · checked 2026-08-12"),
    eyebrow: ruEn("Total War: Warhammer III · Campaign Economy", "Total War: Warhammer III · Campaign Economy"),
    heading: ruEn("Армия выигрывает битву. Казна решает, переживёшь ли войну.", "An army wins the battle. The treasury decides whether you survive the war."),
    lede: ruEn("Свяжи доход провинций, строительство, содержание армий и захват территорий в одну систему. Проверяй решение в горизонте ходов, а не по самой большой цифре на экране.", "Connect provincial income, construction, army upkeep and conquest into one system. Test a decision across a turn horizon instead of chasing the largest number on screen."),
    primary: ruEn("Открыть карту кампании", "Open the campaign map"),
    secondary: ruEn("Рассчитать военный резерв", "Calculate the war reserve"),
    proof: [
      ["7", ruEn("узлов экономики", "economy links")],
      ["3", ruEn("пути кампании", "campaign paths")],
      ["3", ruEn("живые модели", "live models")],
      ["8.1", ruEn("официальный контекст", "official context")]
    ],
    loadout: [
      { mark: "¤", label: "TREASURY", value: ruEn("War chest", "War chest") },
      { mark: "P", label: "PROVINCE", value: ruEn("Building ROI", "Building ROI") },
      { mark: "A", label: "ARMY", value: ruEn("Upkeep runway", "Upkeep runway") },
      { mark: "C", label: "CONQUEST", value: ruEn("Sack vs hold", "Sack vs hold") }
    ]
  },
  manifesto: {
    kicker: ruEn("Money Meta doctrine · campaign edition", "Money Meta doctrine · campaign edition"),
    title: ruEn("Экономика кампании является оружием с задержкой.", "Campaign economy is a weapon with a delay."),
    text: ruEn("Здание отдаёт результат через несколько ходов, новая армия создаёт постоянный burn, а захват меняет и доход, и линию риска. Поэтому каждое решение получает горизонт, резерв и альтернативный сценарий.", "A building pays later, a new army creates permanent burn, and conquest changes both income and exposure. Every decision therefore needs a horizon, a reserve and a counterfactual."),
    principles: [
      { title: "PAYBACK", text: ruEn("Стоимость здания читается вместе с доходом и числом активных ходов.", "Read building cost with income and active turns.") },
      { title: "RUNWAY", text: ruEn("Армия считается доступной только после recruitment и обязательного резерва.", "An army is affordable only after recruitment and the emergency reserve.") },
      { title: "TEMPO", text: ruEn("Отложенный доход может проиграть силе, которая нужна прямо сейчас.", "Delayed income can lose to power required now.") },
      { title: "RISK", text: ruEn("Пограничная провинция и столица не имеют одинаковой надёжности cash flow.", "A frontier province and a capital do not have equal cash-flow reliability.") }
    ]
  },
  economyNodes: [
    { id: "treasury", code: "01", mark: "¤", title: ruEn("Казна", "Treasury"), phase: ruEn("Ликвидность", "Liquidity"), summary: ruEn("Непотраченное золото сохраняет варианты: найм, срочная армия, дипломатия или ремонт.", "Unspent gold preserves options for recruitment, an emergency army, diplomacy or repairs."), signal: ruEn("Свободное золото", "Deployable gold"), decision: ruEn("Отдели военный резерв от капитала, который можно инвестировать.", "Separate the war reserve from capital available for investment."), href: "#war-reserve" },
    { id: "income", code: "02", mark: "I", title: ruEn("Доход", "Income"), phase: ruEn("Поток за ход", "Per-turn flow"), summary: ruEn("Налоги, здания, торговля и фракционные механики формируют recurring inflow.", "Taxes, buildings, trade and faction mechanics create recurring inflow."), signal: ruEn("Net за ход", "Net per turn"), decision: ruEn("Считай доход после текущего содержания, а не до него.", "Measure income after existing upkeep, not before it."), href: "#building-payback" },
    { id: "province", code: "03", mark: "P", title: ruEn("Провинция", "Province"), phase: ruEn("Инфраструктура", "Infrastructure"), summary: ruEn("Growth, порядок и здания превращают ранний капитал в будущую производительность.", "Growth, control and buildings turn early capital into future capacity."), signal: ruEn("Доход после задержки", "Income after delay"), decision: ruEn("Проверь, успеет ли инвестиция окупиться в реальном горизонте кампании.", "Test whether the investment pays back inside the real campaign horizon."), href: "#building-payback" },
    { id: "recruit", code: "04", mark: "R", title: ruEn("Найм", "Recruit"), phase: ruEn("Разовый capex", "One-off capex"), summary: ruEn("Recruitment покупает силу сейчас, но уменьшает резерв до первой победы.", "Recruitment buys power now while reducing the reserve before the first win."), signal: ruEn("Цена развёртывания", "Deployment cost"), decision: ruEn("Добавь стоимость найма к содержанию на весь планируемый поход.", "Add recruitment cost to upkeep across the planned campaign."), href: "#war-reserve" },
    { id: "upkeep", code: "05", mark: "A", title: ruEn("Содержание", "Upkeep"), phase: ruEn("Постоянный burn", "Recurring burn"), summary: ruEn("Вторая армия может быть доступна сегодня и банкротить фракцию через несколько ходов.", "A second army can be affordable today and bankrupt the faction several turns later."), signal: ruEn("Runway армии", "Army runway"), decision: ruEn("Проверь cash at target и максимальный безопасный outflow.", "Check cash at target and maximum safe outflow."), href: "#war-reserve" },
    { id: "conquest", code: "06", mark: "C", title: ruEn("Захват", "Conquest"), phase: ruEn("Доход или payout", "Income or payout"), summary: ruEn("Разовый sack даёт ликвидность, удержание создаёт будущий поток и новую границу.", "A sack creates liquidity; holding creates future flow and a new frontier."), signal: ruEn("Immediate vs recurring", "Immediate vs recurring"), decision: ruEn("Сравни варианты на одном горизонте с риском потери дохода.", "Compare both options on one horizon with loss risk included."), href: "#conquest-choice" },
    { id: "reinvest", code: "07", mark: "↻", title: ruEn("Реинвест", "Reinvest"), phase: ruEn("Campaign flywheel", "Campaign flywheel"), summary: ruEn("Победа становится экономическим преимуществом только после правильного распределения добычи.", "A victory becomes an economic advantage only after the spoils are allocated well."), signal: ruEn("Золото в темп", "Gold into tempo"), decision: ruEn("Выбери между экономикой, резервом и следующей армией по текущему bottleneck.", "Allocate between economy, reserve and the next army based on the current bottleneck."), href: "#decision-deck" }
  ],
  paths: [
    {
      id: "returner", mark: "R", label: ruEn("Вернулся", "Returner"), title: ruEn("Сначала восстанови управляемость, затем расширяйся", "Restore control before expanding"), summary: ruEn("Для кампании после перерыва, где важнее понять cash flow, фронты и обязательства, чем сразу продолжить старый план.", "For a campaign resumed after a break, where understanding cash flow, fronts and obligations matters more than continuing the old plan immediately."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("10 ходов", "10 turns") }, { label: ruEn("Резерв", "Reserve"), value: ruEn("1 армия", "1 army") }, { label: ruEn("Риск", "Risk"), value: ruEn("низкий", "low") }],
      steps: [{ title: ruEn("Сними snapshot", "Take a snapshot"), text: ruEn("Запиши treasury, net income, upkeep и угрозы на каждом фронте.", "Record treasury, net income, upkeep and threats on every front.") }, { title: ruEn("Заморозь один риск", "Freeze one risk"), text: ruEn("Оставь резерв на срочный recruitment или потерянный доход.", "Keep a reserve for emergency recruitment or lost income.") }, { title: ruEn("Сделай обратимый ход", "Make a reversible move"), text: ruEn("Выбери короткую инвестицию или локальную цель до большого расширения.", "Choose a short investment or local objective before major expansion.") }],
      flip: ruEn("План меняется, когда ближайший противник уже способен открыть новый фронт.", "The plan changes when the nearest rival can already open a new front."), href: "#war-reserve"
    },
    {
      id: "casual", mark: "T", label: ruEn("Limited turns", "Limited turns"), title: ruEn("Максимум прогресса без десяти параллельных систем", "Maximum progress without ten parallel systems"), summary: ruEn("Для игрока с короткими сессиями: одна цель, одна инвестиционная очередь и понятный stop condition.", "For short sessions: one objective, one investment queue and a clear stop condition."),
      constraints: [{ label: ruEn("Сессия", "Session"), value: ruEn("5 ходов", "5 turns") }, { label: ruEn("Фронты", "Fronts"), value: ruEn("1 активный", "1 active") }, { label: ruEn("Темп", "Tempo"), value: ruEn("стабильный", "steady") }],
      steps: [{ title: ruEn("Выбери один bottleneck", "Pick one bottleneck"), text: ruEn("Доход, порядок, найм или оборона, но не всё одновременно.", "Income, control, recruitment or defense, but not all at once.") }, { title: ruEn("Задай горизонт", "Set the horizon"), text: ruEn("Реши, что должно измениться через пять ходов.", "Define what must be different in five turns.") }, { title: ruEn("Закрой цикл", "Close the loop"), text: ruEn("Закончи сессию с готовым следующим действием.", "End the session with the next action already prepared.") }],
      flip: ruEn("Если появляется угроза столице, инвестиционный план уступает ликвидности.", "If the capital is threatened, the investment plan yields to liquidity."), href: "#building-payback"
    },
    {
      id: "grinder", mark: "O", label: ruEn("Optimizer", "Optimizer"), title: ruEn("Управляй империей как портфелем фронтов", "Run the empire as a portfolio of fronts"), summary: ruEn("Для высокой сложности и длинных кампаний, где важны marginal army, риск границы и value каждого хода.", "For high difficulty and long campaigns, where the marginal army, frontier risk and turn value matter."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("20+ ходов", "20+ turns") }, { label: ruEn("Фронты", "Fronts"), value: ruEn("3+", "3+") }, { label: ruEn("Риск", "Risk"), value: ruEn("сценарный", "modeled") }],
      steps: [{ title: ruEn("Оцени marginal army", "Price the marginal army"), text: ruEn("Считай не среднее содержание, а новый burn и какую угрозу он снимает.", "Measure the new burn and the threat it removes, not average upkeep.") }, { title: ruEn("Дисконтируй frontier income", "Discount frontier income"), text: ruEn("Поток с нестабильной границы не равен доходу защищённого ядра.", "Flow from an unstable frontier is not equal to income from the protected core.") }, { title: ruEn("Реинвестируй по bottleneck", "Reinvest by bottleneck"), text: ruEn("Каждый payout направляй в ограничение, которое мешает следующей победе.", "Send each payout to the constraint blocking the next victory.") }],
      flip: ruEn("Если expansion создаёт отрицательный net, приоритет возвращается к консолидации.", "When expansion creates negative net flow, priority returns to consolidation."), href: "#conquest-choice"
    }
  ],
  pulse: {
    title: ruEn("Patch 8.1 меняет давление кампании, но не отменяет unit economics", "Patch 8.1 changes campaign pressure without replacing unit economics"),
    text: ruEn("Pulse отделяет подтверждённые изменения Creative Assembly от редактируемых значений твоей фракции и сохранения.", "Pulse separates confirmed Creative Assembly changes from editable values in your faction and save."),
    changes: [
      { mark: "AI", signal: ruEn("Verified · Patch 8.1", "Verified · Patch 8.1"), title: ruEn("Поздний AI сильнее ищет расширение", "Late-game AI looks for expansion"), summary: ruEn("Creative Assembly снизила late-game приоритет оборонительных задач и немного усилила задачи против сил противника.", "Creative Assembly reduced late-game defensive task priority and slightly raised tasks targeting enemy forces."), decision: ruEn("Держи frontier reserve выше, если твой план зависит от долгой мирной окупаемости.", "Keep a larger frontier reserve when the plan depends on a long peaceful payback."), sourceLabel: "Creative Assembly · Patch 8.1", sourceUrl: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101" },
      { mark: "LM", signal: ruEn("Verified · Patch 8.1", "Verified · Patch 8.1"), title: ruEn("Новые landmarks и технологии требуют пересчёта", "New landmarks and technologies require a rerun"), summary: ruEn("Patch 8.1 добавил landmarks и technologies, поэтому старые универсальные приоритеты зданий нельзя переносить без проверки.", "Patch 8.1 added landmarks and technologies, so old universal building priorities should not be carried over without checking."), decision: ruEn("Вводи фактическую стоимость и delta-income из своей провинции в Building Payback.", "Enter the actual cost and income delta from your province in Building Payback."), sourceLabel: "Creative Assembly · Patch 8.1", sourceUrl: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101" },
      { mark: "CT", signal: ruEn("Verified · Update 8.0", "Verified · Update 8.0"), title: ruEn("Cathay получила отдельный province-tech слой", "Cathay gained a province-tech layer"), summary: ruEn("Update 8.0 разделил технологии Cathay на military и provinces и улучшил growth поселений.", "Update 8.0 split Cathay technologies into military and provinces and improved settlement growth."), decision: ruEn("Для Cathay сравни province investment с немедленной боевой ценностью на одном горизонте.", "For Cathay, compare province investment with immediate military value on one horizon."), sourceLabel: "Creative Assembly · Update 8.0", sourceUrl: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/98-total-war-warhammer-iii-update-8-0-patch-notes" }
    ]
  },
  lenses: [
    {
      id: "stability", label: ruEn("Ранняя стабильность", "Early stability"), question: ruEn("Что укрепляет первые 15 ходов?", "What strengthens the first 15 turns?"), formula: ruEn("40% liquidity · 35% payback · 25% defense", "40% liquidity · 35% payback · 25% defense"), note: ruEn("Это порядок действий, а не faction tier list. Точные значения вводятся из кампании.", "This is an order of operations, not a faction tier list. Exact values come from the campaign."),
      cards: [
        { mark: "¤", title: ruEn("Резерв казны", "Treasury reserve"), grade: "A", fit: 91, text: ruEn("Сохраняет ответ на внезапную армию или потерю settlement income.", "Preserves an answer to a surprise army or lost settlement income."), metrics: [{ label: ruEn("Ликвидность", "Liquidity"), value: ruEn("Высокая", "High") }, { label: ruEn("Задержка", "Delay"), value: ruEn("0 ходов", "0 turns") }] },
        { mark: "P", title: ruEn("Короткое income-здание", "Short income building"), grade: "A", fit: 84, text: ruEn("Работает, если payback помещается до следующего окна войны.", "Works when payback fits before the next war window."), metrics: [{ label: ruEn("Доход", "Income"), value: ruEn("Recurring", "Recurring") }, { label: ruEn("Риск", "Risk"), value: ruEn("По провинции", "Province-specific") }] },
        { mark: "A", title: ruEn("Вторая армия", "Second army"), grade: "B", fit: 68, text: ruEn("Сильный tempo-ход только при положительном cash at target.", "A strong tempo move only with positive cash at target."), metrics: [{ label: ruEn("Сила сейчас", "Power now"), value: ruEn("Высокая", "High") }, { label: ruEn("Burn", "Burn"), value: ruEn("Постоянный", "Recurring") }] }
      ]
    },
    {
      id: "expansion", label: ruEn("Расширение", "Expansion"), question: ruEn("Куда направить добычу после победы?", "Where should post-victory gold go?"), formula: ruEn("40% bottleneck · 35% horizon value · 25% risk", "40% bottleneck · 35% horizon value · 25% risk"), note: ruEn("Лидер меняется, если новая граница требует отдельной армии или settlement не удержать.", "The leader changes when the new frontier needs another army or the settlement cannot be held."),
      cards: [
        { mark: "C", title: ruEn("Консолидация провинции", "Province consolidation"), grade: "A", fit: 88, text: ruEn("Закрывает control, growth и income bottleneck в уже защищённой зоне.", "Closes control, growth and income bottlenecks in an already protected area."), metrics: [{ label: ruEn("Compounding", "Compounding"), value: ruEn("Высокий", "High") }, { label: ruEn("Фронт", "Front"), value: ruEn("Стабильный", "Stable") }] },
        { mark: "¤", title: ruEn("Военный резерв", "War chest"), grade: "A", fit: 82, text: ruEn("Покупает optionality перед контратакой и непредвиденным фронтом.", "Buys optionality before a counterattack or surprise front."), metrics: [{ label: ruEn("Гибкость", "Flexibility"), value: ruEn("Максимум", "Maximum") }, { label: ruEn("Доход", "Income"), value: ruEn("0", "0") }] },
        { mark: "A", title: ruEn("Новая армия", "New army"), grade: "B", fit: 73, text: ruEn("Оправдана, если открывает новый payout быстрее, чем съедает казну.", "Works when it unlocks the next payout faster than it drains the treasury."), metrics: [{ label: ruEn("Tempo", "Tempo"), value: ruEn("Высокий", "High") }, { label: ruEn("Upkeep", "Upkeep"), value: ruEn("Высокий", "High") }] }
      ]
    },
    {
      id: "late", label: ruEn("Late game pressure", "Late-game pressure"), question: ruEn("Что защищает длинную кампанию от каскадного кризиса?", "What protects a long campaign from cascading failure?"), formula: ruEn("45% runway · 30% front coverage · 25% marginal value", "45% runway · 30% front coverage · 25% marginal value"), note: ruEn("Patch 8.1 делает late-game AI более склонным к расширению, поэтому мирный baseline нуждается в sensitivity.", "Patch 8.1 makes late-game AI more expansion-oriented, so a peaceful baseline needs sensitivity."),
      cards: [
        { mark: "¤", title: ruEn("Мультифронтовый резерв", "Multi-front reserve"), grade: "A", fit: 93, text: ruEn("Покрывает recruitment, отрицательный net и ремонт одновременно.", "Covers recruitment, negative flow and repairs together."), metrics: [{ label: ruEn("Runway", "Runway"), value: ruEn("8+ ходов", "8+ turns") }, { label: ruEn("Фронты", "Fronts"), value: ruEn("2+", "2+") }] },
        { mark: "R", title: ruEn("Recruitment depth", "Recruitment depth"), grade: "A", fit: 85, text: ruEn("Сокращает задержку между угрозой и боеспособной армией.", "Reduces the delay between threat and a combat-ready army."), metrics: [{ label: ruEn("Опциональность", "Optionality"), value: ruEn("Высокая", "High") }, { label: ruEn("Capex", "Capex"), value: ruEn("Средний", "Medium") }] },
        { mark: "P", title: ruEn("Ещё одно income-здание", "Another income building"), grade: "C", fit: 57, text: ruEn("Полезно только если граница защищена дольше периода окупаемости.", "Useful only when the frontier stays safe beyond payback."), metrics: [{ label: ruEn("Payback", "Payback"), value: ruEn("Длинный", "Long") }, { label: ruEn("Риск", "Risk"), value: ruEn("Высокий", "High") }] }
      ]
    }
  ],
  scenarios: [
    { mark: "P", mode: ruEn("Building ROI", "Building ROI"), eyebrow: ruEn("20 ходов", "20 turns"), question: ruEn("Окупится ли income-здание до следующей большой войны?", "Will the income building pay back before the next major war?"), outcome: ruEn("Модель покажет risk-adjusted payback, net value и ROI горизонта.", "The model returns risk-adjusted payback, horizon net value and ROI."), href: "#building-payback" },
    { mark: "A", mode: ruEn("Army runway", "Army runway"), eyebrow: ruEn("Вторая армия", "Second army"), question: ruEn("Могу ли я нанять её сейчас и не пробить резерв?", "Can I recruit it now without breaking the reserve?"), outcome: ruEn("Cash at target отделит доступную покупку от устойчивого содержания.", "Cash at target separates an affordable purchase from sustainable upkeep."), href: "#war-reserve" },
    { mark: "C", mode: ruEn("Conquest choice", "Conquest choice"), eyebrow: ruEn("Sack vs occupy", "Sack vs occupy"), question: ruEn("Что ценнее на горизонте 12 ходов?", "Which option is worth more across 12 turns?"), outcome: ruEn("Оба варианта сравниваются с задержкой и риском потери recurring income.", "Both options are compared with delay and recurring-income risk."), href: "#conquest-choice" },
    { mark: "F", mode: ruEn("Frontier case", "Frontier case"), eyebrow: ruEn("25% риск", "25% risk"), question: ruEn("Стоит ли инвестировать в нестабильную границу?", "Should I invest in an unstable frontier?"), outcome: ruEn("Risk haircut покажет, когда красивый income перестаёт окупать capital lock-up.", "A risk haircut shows when attractive income stops paying for capital lock-up."), href: "#building-payback" },
    { mark: "¤", mode: ruEn("War chest", "War chest"), eyebrow: ruEn("8 ходов", "8 turns"), question: ruEn("Какой burn выдержит казна до цели?", "How much burn can the treasury carry to the objective?"), outcome: ruEn("Модель вычислит max sustainable outflow и безопасный runway.", "The model calculates maximum sustainable outflow and safe runway."), href: "#war-reserve" },
    { mark: "L", mode: ruEn("Late-game plan", "Late-game plan"), eyebrow: ruEn("Patch 8.1", "Patch 8.1"), question: ruEn("Как усилить reserve при более активном AI?", "How should the reserve change against more active AI?"), outcome: ruEn("Увеличь horizon, new outflow и reserve, чтобы проверить худший сценарий.", "Raise horizon, new outflow and reserve to stress-test the case."), href: "#war-reserve" }
  ],
  models: [
    {
      id: "building-payback", kind: "investment", mark: "P", kicker: ruEn("Model 01 · province capex", "Model 01 · province capex"), title: ruEn("Building Payback: успеет ли здание вернуть золото", "Building Payback: will the building return its gold"), text: ruEn("Введи фактическую стоимость, delta-income, задержку строительства, горизонт и риск потери потока. Модель не предполагает одну фракцию.", "Enter actual cost, income delta, construction delay, horizon and the risk of losing the flow. The model assumes no universal faction values."), note: ruEn("Risk haircut является сценарным допущением, а не скрытой игровой формулой.", "The risk haircut is a scenario assumption, not a hidden game formula."),
      inputs: [
        { key: "cost", label: ruEn("Стоимость, gold", "Cost, gold"), value: 4000, min: 0, step: 100 },
        { key: "incomePerPeriod", label: ruEn("Новый доход / ход", "New income / turn"), value: 350, step: 25 },
        { key: "delayPeriods", label: ruEn("Задержка, ходов", "Delay, turns"), value: 2, min: 0, step: 1 },
        { key: "horizonPeriods", label: ruEn("Горизонт, ходов", "Horizon, turns"), value: 20, min: 1, step: 1 },
        { key: "riskPercent", label: ruEn("Риск потери потока, %", "Flow-loss risk, %"), value: 10, min: 0, max: 100, step: 5 }
      ],
      results: [
        { key: "netValue", label: ruEn("Net value", "Net value"), format: "currency", accent: "positive" },
        { key: "paybackPeriods", label: ruEn("Окупаемость", "Payback"), format: "periods", accent: "primary" },
        { key: "roiPercent", label: ruEn("ROI горизонта", "Horizon ROI"), format: "percent" },
        { key: "riskAdjustedIncome", label: ruEn("Доход после risk", "Risk-adjusted income"), format: "currency" },
        { key: "grossValue", label: ruEn("Value до cost", "Value before cost"), format: "currency" },
        { key: "activePeriods", label: ruEn("Активных ходов", "Active turns"), format: "periods" }
      ]
    },
    {
      id: "war-reserve", kind: "reserve", mark: "A", kicker: ruEn("Model 02 · army liquidity", "Model 02 · army liquidity"), title: ruEn("War Reserve: доступна ли новая армия на самом деле", "War Reserve: is the new army truly affordable"), text: ruEn("Покупка проходит тест только после recruitment cost, текущего upkeep, нового burn и обязательного emergency reserve.", "The purchase passes only after recruitment cost, existing upkeep, new burn and the emergency reserve."), note: ruEn("Max sustainable outflow показывает общий допустимый расход за ход при заданном горизонте.", "Maximum sustainable outflow is total affordable per-turn spending across the selected horizon."),
      inputs: [
        { key: "treasury", label: ruEn("Казна, gold", "Treasury, gold"), value: 12000, min: 0, step: 500 },
        { key: "incomePerPeriod", label: ruEn("Доход / ход", "Income / turn"), value: 3500, step: 100 },
        { key: "currentOutflow", label: ruEn("Текущий upkeep / ход", "Current upkeep / turn"), value: 2300, min: 0, step: 100 },
        { key: "newOutflow", label: ruEn("Новый upkeep / ход", "New upkeep / turn"), value: 1200, min: 0, step: 100 },
        { key: "oneOffCost", label: ruEn("Recruitment cost", "Recruitment cost"), value: 4500, min: 0, step: 250 },
        { key: "horizonPeriods", label: ruEn("До цели, ходов", "Turns to objective"), value: 8, min: 1, step: 1 },
        { key: "reserve", label: ruEn("Emergency reserve", "Emergency reserve"), value: 3000, min: 0, step: 250 }
      ],
      results: [
        { key: "cashAtTarget", label: ruEn("Казна у цели", "Cash at objective"), format: "currency", accent: "primary" },
        { key: "buffer", label: ruEn("Сверх резерва", "Above reserve"), format: "currency", accent: "positive" },
        { key: "netFlow", label: ruEn("Net / ход", "Net / turn"), format: "currency" },
        { key: "safePeriods", label: ruEn("Runway до резерва", "Runway to reserve"), format: "periods" },
        { key: "maxSustainableOutflow", label: ruEn("Max общий outflow", "Max total outflow"), format: "currency" },
        { key: "coveragePercent", label: ruEn("Reserve coverage", "Reserve coverage"), format: "percent" }
      ]
    },
    {
      id: "conquest-choice", kind: "comparison", mark: "C", kicker: ruEn("Model 03 · capital allocation", "Model 03 · capital allocation"), title: ruEn("Sack vs Occupy: immediate payout или будущий поток", "Sack vs Occupy: immediate payout or future flow"), text: ruEn("Вариант A и B получают immediate value, recurring value, задержку и риск. Вводи цифры из конкретного settlement screen.", "Options A and B each receive immediate value, recurring value, delay and risk. Enter values from the actual settlement screen."), note: ruEn("Неденежная позиционная ценность может быть добавлена в immediate value выбранного варианта и должна быть помечена как judgement.", "Non-cash strategic value can be added to an option's immediate value and should be treated as judgement."),
      inputs: [
        { key: "aImmediate", label: ruEn("A · immediate value", "A · immediate value"), value: 12000, step: 500, group: "a" },
        { key: "aRecurring", label: ruEn("A · recurring / ход", "A · recurring / turn"), value: 0, step: 100, group: "a" },
        { key: "aDelay", label: ruEn("A · задержка", "A · delay"), value: 0, min: 0, step: 1, group: "a" },
        { key: "aRiskPercent", label: ruEn("A · риск, %", "A · risk, %"), value: 10, min: 0, max: 100, step: 5, group: "a" },
        { key: "bImmediate", label: ruEn("B · immediate value", "B · immediate value"), value: -3500, step: 500, group: "b" },
        { key: "bRecurring", label: ruEn("B · recurring / ход", "B · recurring / turn"), value: 1300, step: 100, group: "b" },
        { key: "bDelay", label: ruEn("B · задержка", "B · delay"), value: 2, min: 0, step: 1, group: "b" },
        { key: "bRiskPercent", label: ruEn("B · риск, %", "B · risk, %"), value: 25, min: 0, max: 100, step: 5, group: "b" },
        { key: "horizonPeriods", label: ruEn("Общий горизонт, ходов", "Shared horizon, turns"), value: 12, min: 1, step: 1 }
      ],
      results: [
        { key: "winner", label: ruEn("Лучший value", "Best value"), format: "winner", accent: "primary" },
        { key: "advantage", label: ruEn("Преимущество", "Advantage"), format: "currency", accent: "positive" },
        { key: "optionAValue", label: ruEn("A · value", "A · value"), format: "currency" },
        { key: "optionBValue", label: ruEn("B · value", "B · value"), format: "currency" }
      ],
      winnerLabels: { a: ruEn("A · Sack / cash", "A · Sack / cash"), b: ruEn("B · Occupy / hold", "B · Occupy / hold"), tie: ruEn("Почти равны", "Near tie") }
    }
  ],
  briefs: [
    { mark: "P", audience: "returner", status: "estimated", kicker: ruEn("Province ROI", "Province ROI"), title: ruEn("Почему дешёвое здание может быть дорогим решением", "Why a cheap building can be an expensive decision"), text: ruEn("Цена без горизонта и задержки не показывает opportunity cost ранней армии.", "Cost without horizon and delay misses the opportunity cost of an early army."), takeaway: ruEn("Сначала payback turn, потом tier.", "Payback turn before tier."), href: "#building-payback" },
    { mark: "A", audience: "casual", status: "estimated", kicker: ruEn("Army finance", "Army finance"), title: ruEn("Вторая армия: доступна сейчас, неустойчива потом", "The second army: affordable now, unsustainable later"), text: ruEn("Recruitment cost и upkeep должны жить в одном cash-flow тесте.", "Recruitment cost and upkeep belong in one cash-flow test."), takeaway: ruEn("Проверяй cash at target.", "Check cash at target."), href: "#war-reserve" },
    { mark: "C", audience: "grinder", status: "estimated", kicker: ruEn("Conquest", "Conquest"), title: ruEn("Когда sack сильнее захвата", "When sacking beats occupation"), text: ruEn("Короткий горизонт, высокий frontier risk и срочная ликвидность повышают ценность payout.", "A short horizon, high frontier risk and urgent liquidity raise payout value."), takeaway: ruEn("Одинаковый горизонт для обоих вариантов.", "Use one horizon for both options."), href: "#conquest-choice" },
    { mark: "¤", audience: "returner", status: "estimated", kicker: ruEn("Recovery", "Recovery"), title: ruEn("Пять цифр, которые нужно записать после перерыва", "Five numbers to record after a break"), text: ruEn("Treasury, net income, upkeep, recruitment capacity и число активных фронтов.", "Treasury, net income, upkeep, recruitment capacity and active front count."), takeaway: ruEn("Snapshot раньше действия.", "Snapshot before action."), href: "#player-paths" },
    { mark: "AI", audience: "grinder", status: "verified", kicker: ruEn("Patch 8.1", "Patch 8.1"), title: ruEn("Как более активный late-game AI меняет reserve", "How a more active late-game AI changes the reserve"), text: ruEn("Длинная peaceful-окупаемость требует стресс-сценария с новым фронтом.", "Long peaceful payback needs a new-front stress case."), takeaway: ruEn("Sensitivity важнее одной цифры.", "Sensitivity beats one number."), href: "#campaign-pulse" },
    { mark: "T", audience: "casual", status: "estimated", kicker: ruEn("Turn plan", "Turn plan"), title: ruEn("Пятитурновый план для короткой сессии", "A five-turn plan for a short session"), text: ruEn("Одна цель, один bottleneck, один stop condition и готовый следующий ход.", "One objective, one bottleneck, one stop condition and a prepared next move."), takeaway: ruEn("Меньше контекста, больше завершённых циклов.", "Less context, more completed loops."), href: "#player-paths" }
  ],
  methodology: {
    title: ruEn("Официальный patch context отдельно. Твои числа отдельно.", "Official patch context on one layer. Your campaign values on another."),
    text: ruEn("Money Meta не выдаёт универсальную faction economy за проверенный факт. Каждая модель начинается с редактируемых значений конкретной кампании.", "Money Meta does not present a universal faction economy as verified fact. Every model starts with editable values from the actual campaign."),
    modelNote: ruEn("Все baseline-значения в калькуляторах являются демонстрационными сценариями Money Meta и имеют статус estimated.", "Every calculator baseline is a Money Meta demonstration scenario with estimated status."),
    disclaimer: ruEn("Total War, Total War: Warhammer и связанные названия являются собственностью их правообладателей. Money Meta является независимым аналитическим продуктом.", "Total War, Total War: Warhammer and related names belong to their respective owners. Money Meta is an independent analytical product."),
    roadmap: ruEn("Следующий слой после пользовательской проверки: faction presets, province snapshots и campaign save notes.", "Next layer after user validation: faction presets, province snapshots and campaign save notes."),
    sources: [
      { label: "Creative Assembly · Patch 8.1", url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101", note: ruEn("Текущая версия, Campaign AI, landmarks и technologies.", "Current version, Campaign AI, landmarks and technologies.") },
      { label: "Creative Assembly · Update 8.0", url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/98-total-war-warhammer-iii-update-8-0-patch-notes", note: ruEn("Cathay military/province tech split и growth context.", "Cathay military/province tech split and growth context.") }
    ]
  }
};

export const crusaderKingsHub: StrategyHubData = {
  id: "ck3",
  slug: "crusader-kings-3",
  name: "Crusader Kings III",
  shortName: "CK3",
  publisher: "Paradox Interactive",
  worldCode: "DYNASTY LEDGER / 1.19.0.6",
  checkedAt: "2026-08-12",
  version: "1.19.0.6",
  currencyUnit: "gold",
  periodUnit: ruEn("мес.", "months"),
  meta: {
    title: ruEn("Crusader Kings III Economy Hub: домен, войны и наследование | Money Meta", "Crusader Kings III Economy Hub: domain, wars and succession | Money Meta"),
    description: ruEn("Интерактивная экономика Crusader Kings III: карта золота, пути правителя, Update 1.19 Pulse и модели зданий, военного резерва и наследования.", "An interactive Crusader Kings III economy with a gold map, ruler paths, Update 1.19 Pulse and models for buildings, war reserves and succession.")
  },
  hero: {
    live: ruEn("Update 1.19.0.6 · проверено 2026-08-12", "Update 1.19.0.6 · checked 2026-08-12"),
    eyebrow: ruEn("Crusader Kings III · Dynasty Economy", "Crusader Kings III · Dynasty Economy"),
    heading: ruEn("Ты управляешь не золотом. Ты финансируешь выживание династии.", "You do not manage gold. You finance the survival of a dynasty."),
    lede: ruEn("Свяжи доход домена, men-at-arms, войны, активности и наследование. Смотри не только на месячный плюс, но и на то, какой treasury получит следующий правитель.", "Connect domain income, men-at-arms, wars, activities and succession. Read more than monthly profit: model the treasury the next ruler inherits."),
    primary: ruEn("Открыть карту династии", "Open the dynasty map"),
    secondary: ruEn("Проверить succession buffer", "Test the succession buffer"),
    proof: [
      ["7", ruEn("звеньев золота", "gold links")],
      ["3", ruEn("пути правителя", "ruler paths")],
      ["3", ruEn("живые модели", "live models")],
      ["Q4", ruEn("Silk & Silver watch", "Silk & Silver watch")]
    ],
    loadout: [
      { mark: "D", label: "DOMAIN", value: ruEn("Building ROI", "Building ROI") },
      { mark: "W", label: "WAR", value: ruEn("Treasury runway", "Treasury runway") },
      { mark: "S", label: "SUCCESSION", value: ruEn("Heir buffer", "Heir buffer") },
      { mark: "T", label: "TRADE", value: ruEn("Q4 watch", "Q4 watch") }
    ]
  },
  manifesto: {
    kicker: ruEn("Money Meta doctrine · dynasty edition", "Money Meta doctrine · dynasty edition"),
    title: ruEn("Богатое правление может оставить бедного наследника.", "A rich reign can leave a poor heir."),
    text: ruEn("Строительство, война и prestige-активности конкурируют за одну казну, а succession меняет timing риска. Решение оценивается по cash flow текущего правителя и устойчивости следующего.", "Buildings, war and prestige activities compete for one treasury, while succession changes risk timing. A decision is judged by current cash flow and the next ruler's resilience."),
    principles: [
      { title: "DOMAIN", text: ruEn("Здание ценно через marginal monthly income и время окупаемости.", "A building matters through marginal monthly income and payback.") },
      { title: "RESERVE", text: ruEn("Война начинается после проверки burn, one-off cost и emergency buffer.", "A war starts after burn, one-off cost and emergency buffer are tested.") },
      { title: "SUCCESSION", text: ruEn("Treasury наследника является отдельной целью капитала.", "The heir's treasury is a separate capital objective.") },
      { title: "OPTIONALITY", text: ruEn("Gold покупает наёмников, подарки, активности и выход из кризиса.", "Gold buys mercenaries, gifts, activities and a way out of crisis.") }
    ]
  },
  economyNodes: [
    { id: "domain", code: "01", mark: "D", title: ruEn("Домен", "Domain"), phase: ruEn("Производственный актив", "Productive asset"), summary: ruEn("Личные holdings создают наиболее управляемый слой ежемесячного дохода.", "Personal holdings create the most controllable layer of monthly income."), signal: ruEn("Доход holdings", "Holding income"), decision: ruEn("Сравни marginal income следующего здания с его payback.", "Compare the next building's marginal income with its payback."), href: "#domain-payback" },
    { id: "tax", code: "02", mark: "V", title: ruEn("Налоги", "Taxes"), phase: ruEn("Realm flow", "Realm flow"), summary: ruEn("Vassal taxes зависят от структуры realm и менее подконтрольны, чем личный домен.", "Vassal taxes depend on realm structure and are less controllable than the personal domain."), signal: ruEn("Monthly inflow", "Monthly inflow"), decision: ruEn("Не считай весь realm income одинаково надёжным.", "Do not treat every layer of realm income as equally reliable."), href: "#economy-lenses" },
    { id: "treasury", code: "03", mark: "¤", title: ruEn("Казна", "Treasury"), phase: ruEn("Ликвидность", "Liquidity"), summary: ruEn("Gold в treasury сохраняет варианты, которые нельзя быстро восстановить во время кризиса.", "Gold in the treasury preserves options that cannot be rebuilt quickly during a crisis."), signal: ruEn("Emergency buffer", "Emergency buffer"), decision: ruEn("Задай floor, ниже которого не уходят здания и активности.", "Set a floor that buildings and activities cannot cross."), href: "#succession-buffer" },
    { id: "building", code: "04", mark: "B", title: ruEn("Строительство", "Build"), phase: ruEn("Отложенный compounding", "Delayed compounding"), summary: ruEn("Building cost превращается в ежемесячный поток только после construction delay.", "Building cost becomes monthly flow only after construction delay."), signal: ruEn("Payback months", "Payback months"), decision: ruEn("Проверь, окупится ли здание до войны или succession window.", "Test whether the building pays back before war or the succession window."), href: "#domain-payback" },
    { id: "army", code: "05", mark: "W", title: ruEn("Армия", "Army"), phase: ruEn("Постоянные обязательства", "Recurring commitments"), summary: ruEn("Men-at-arms и война превращают спокойный surplus в burn.", "Men-at-arms and war turn a calm surplus into burn."), signal: ruEn("War runway", "War runway"), decision: ruEn("Считай отдельный wartime outflow и one-off cost.", "Model wartime outflow and one-off cost separately."), href: "#war-chest" },
    { id: "prestige", code: "06", mark: "A", title: ruEn("Активности", "Activities"), phase: ruEn("Gold в влияние", "Gold into influence"), summary: ruEn("Пиры, туры и другие активности могут создавать неденежный return, но всё равно расходуют liquidity.", "Feasts, tours and other activities can create non-cash return while consuming liquidity."), signal: ruEn("Opportunity cost", "Opportunity cost"), decision: ruEn("Сравни activity с лучшим доступным использованием gold.", "Compare an activity with the best available use of gold."), href: "#decision-deck" },
    { id: "succession", code: "07", mark: "S", title: ruEn("Наследование", "Succession"), phase: ruEn("Передача системы", "System transfer"), summary: ruEn("Новый правитель получает treasury вместе с возможными фракциями, войнами и расходами перехода.", "A new ruler inherits the treasury alongside possible factions, wars and transition costs."), signal: ruEn("Heir liquidity", "Heir liquidity"), decision: ruEn("Планируй reserve, который должен пережить момент передачи власти.", "Plan a reserve that survives the transfer of power."), href: "#succession-buffer" }
  ],
  paths: [
    {
      id: "returner", mark: "R", label: ruEn("Вернулся", "Returner"), title: ruEn("Сначала пойми обязательства realm, затем нажимай Play", "Understand realm commitments before pressing Play"), summary: ruEn("Для старого сохранения: holdings, succession, factions, wars и monthly flow собираются в один snapshot.", "For an old save: holdings, succession, factions, wars and monthly flow become one snapshot."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("24 мес.", "24 months") }, { label: ruEn("Фокус", "Focus"), value: ruEn("стабильность", "stability") }, { label: ruEn("Резерв", "Reserve"), value: ruEn("250 gold", "250 gold") }],
      steps: [{ title: ruEn("Открой Ledger", "Open the Ledger"), text: ruEn("Сверь holdings, income, expenses и военные потери до нового решения.", "Review holdings, income, expenses and war losses before a new decision.") }, { title: ruEn("Найди succession window", "Find the succession window"), text: ruEn("Возраст, здоровье, наследник и factions определяют срочность резерва.", "Age, health, heir and factions determine reserve urgency.") }, { title: ruEn("Один безопасный ход", "Make one safe move"), text: ruEn("Инвестиция проходит только если оставляет emergency buffer.", "An investment passes only when it leaves the emergency buffer.") }],
      flip: ruEn("При неминуемой succession долгий building payback уступает ликвидности.", "When succession is imminent, long building payback yields to liquidity."), href: "#succession-buffer"
    },
    {
      id: "casual", mark: "C", label: ruEn("Dynasty builder", "Dynasty builder"), title: ruEn("Строй устойчивое ядро, а не самый большой realm", "Build a resilient core, not the largest realm"), summary: ruEn("Для спокойной кампании, где важны domain compounding, controllable wars и чистая передача власти.", "For a calmer campaign focused on domain compounding, controllable wars and clean transfers of power."),
      constraints: [{ label: ruEn("Войны", "Wars"), value: ruEn("по резерву", "reserve-gated") }, { label: ruEn("Домен", "Domain"), value: ruEn("ядро", "core") }, { label: ruEn("Риск", "Risk"), value: ruEn("средний", "medium") }],
      steps: [{ title: ruEn("Укрепи core holdings", "Strengthen core holdings"), text: ruEn("Инвестируй туда, что с высокой вероятностью останется у основной линии.", "Invest where the main line is likely to retain control.") }, { title: ruEn("Финансируй одну цель", "Fund one objective"), text: ruEn("Война или activity получают отдельный бюджет, не весь treasury.", "A war or activity receives a budget, not the whole treasury.") }, { title: ruEn("Передай buffer", "Transfer a buffer"), text: ruEn("Заверши правление с cash floor для наследника.", "End the reign with a cash floor for the heir.") }],
      flip: ruEn("Если наследник слаб или factions растут, reserve target повышается.", "If the heir is weak or factions are growing, raise the reserve target."), href: "#domain-payback"
    },
    {
      id: "grinder", mark: "O", label: ruEn("Realm optimizer", "Realm optimizer"), title: ruEn("Оптимизируй золото вокруг войн и передачи власти", "Optimize gold around wars and transfers of power"), summary: ruEn("Для сложной империи с несколькими типами расходов, где важен risk-adjusted treasury.", "For a complex empire with several spending layers where risk-adjusted treasury matters."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("120 мес.", "120 months") }, { label: ruEn("Сценарии", "Cases"), value: ruEn("base + stress", "base + stress") }, { label: ruEn("Резерв", "Reserve"), value: ruEn("динамический", "dynamic") }],
      steps: [{ title: ruEn("Раздели spending layers", "Separate spending layers"), text: ruEn("Peace, war, activities и succession должны иметь разные outflow.", "Peace, war, activities and succession need separate outflow assumptions.") }, { title: ruEn("Считай marginal building", "Model the marginal building"), text: ruEn("Следующий слот оценивается по delta-income, а не общему доходу holding.", "Judge the next slot by income delta, not total holding income.") }, { title: ruEn("Стрессуй наследование", "Stress-test succession"), text: ruEn("Добавь faction war и transition cost в худший сценарий.", "Add a faction war and transition cost to the downside case.") }],
      flip: ruEn("Когда downside-case ломает reserve, expansion приостанавливается.", "When the downside case breaks the reserve, expansion pauses."), href: "#war-chest"
    }
  ],
  pulse: {
    title: ruEn("Update 1.19 дал лучший Ledger. Q4 2026 изменит саму торговлю.", "Update 1.19 delivered a stronger Ledger. Q4 2026 will change trade itself."),
    text: ruEn("Pulse связывает официальные обновления Paradox с тем, что стоит измерять сейчас и что нельзя моделировать до релиза.", "Pulse connects official Paradox updates with what can be measured now and what must wait for release."),
    changes: [
      { mark: "1.19", signal: ruEn("Verified · live", "Verified · live"), title: ruEn("Текущая версия 1.19.0.6", "Current version is 1.19.0.6"), summary: ruEn("Последний live hotfix опубликован 25 мая 2026 года. Экономические модели привязаны к ветке 1.19, но их inputs остаются пользовательскими.", "The latest live hotfix was published on May 25, 2026. The economy models are versioned to 1.19 while inputs remain user supplied."), decision: ruEn("Перед переносом старого save snapshot проверь версию и моды.", "Check version and mods before carrying an old save snapshot forward."), sourceLabel: "Paradox · Update 1.19.0.6", sourceUrl: "https://store.steampowered.com/news/app/1158310/view/677373278422041207" },
      { mark: "L", signal: ruEn("Verified · Update 1.19", "Verified · Update 1.19"), title: ruEn("Ledger стал практической точкой входа", "The Ledger became a practical starting point"), summary: ruEn("Update 1.19 добавил war losses и больше значений и действий для holdings в Ledger.", "Update 1.19 added war losses and more values and actions for holdings in the Ledger."), decision: ruEn("Собери baseline из Ledger до того, как оценивать building или war reserve.", "Build the baseline from the Ledger before evaluating a building or war reserve."), sourceLabel: "Paradox · 1.19 Scribe", sourceUrl: "https://store.steampowered.com/news/app/1158310/view/552395313313219108" },
      { mark: "T", signal: ruEn("Verified · coming Q4 2026", "Verified · coming Q4 2026"), title: ruEn("Silk & Silver добавит trade economy", "Silk & Silver will add a trade economy"), summary: ruEn("Paradox заявляет merchant families, trade exotic goods, republic competition и monopolies на routes.", "Paradox describes merchant families, exotic-goods trade, republic competition and route monopolies."), decision: ruEn("До релиза не выдумываем точные trade формулы. Готовим framework и обновляем хаб после live-проверки.", "No invented trade formulas before release. Prepare the framework and update the hub after live validation."), sourceLabel: "Paradox · Chapter V", sourceUrl: "https://www.paradoxinteractive.com/games/crusader-kings-iii/add-ons/crusader-kings-iii-chapter-v" }
    ]
  },
  lenses: [
    {
      id: "small-realm", label: ruEn("Малый realm", "Small realm"), question: ruEn("Куда направить первые 600 gold?", "Where should the first 600 gold go?"), formula: ruEn("40% control · 35% payback · 25% optionality", "40% control · 35% payback · 25% optionality"), note: ruEn("Точная очередь зданий зависит от holding, culture, terrain и ownership horizon.", "Exact building order depends on holding, culture, terrain and ownership horizon."),
      cards: [
        { mark: "D", title: ruEn("Core domain building", "Core domain building"), grade: "A", fit: 89, text: ruEn("Recurring доход в holding, который планируется удерживать поколениями.", "Recurring income in a holding intended to stay with the line for generations."), metrics: [{ label: ruEn("Контроль", "Control"), value: ruEn("Высокий", "High") }, { label: ruEn("Payback", "Payback"), value: ruEn("Измеримый", "Measurable") }] },
        { mark: "¤", title: ruEn("Succession reserve", "Succession reserve"), grade: "A", fit: 85, text: ruEn("Сохраняет наёмников, подарки и выход из faction crisis.", "Preserves mercenaries, gifts and an exit from a faction crisis."), metrics: [{ label: ruEn("Ликвидность", "Liquidity"), value: ruEn("Максимум", "Maximum") }, { label: ruEn("Доход", "Income"), value: ruEn("0", "0") }] },
        { mark: "A", title: ruEn("Prestige activity", "Prestige activity"), grade: "B", fit: 64, text: ruEn("Может быть сильна по неденежному return, но не должна ломать buffer.", "Can be strong on non-cash return without breaking the buffer."), metrics: [{ label: ruEn("Utility", "Utility"), value: ruEn("Сценарная", "Scenario-based") }, { label: ruEn("Liquidity", "Liquidity"), value: ruEn("Низкая", "Low") }] }
      ]
    },
    {
      id: "pre-war", label: ruEn("Перед войной", "Pre-war"), question: ruEn("Что должно быть профинансировано до объявления?", "What must be funded before declaring?"), formula: ruEn("45% runway · 35% objective value · 20% downside", "45% runway · 35% objective value · 20% downside"), note: ruEn("Casus belli не является financial plan. Модель начинается с war duration и wartime outflow.", "A casus belli is not a financial plan. Start with war duration and wartime outflow."),
      cards: [
        { mark: "W", title: ruEn("War chest", "War chest"), grade: "A", fit: 94, text: ruEn("Покрывает отрицательный flow, reinforcement и ошибку по длительности.", "Covers negative flow, reinforcement and duration error."), metrics: [{ label: ruEn("Runway", "Runway"), value: ruEn("24 мес.", "24 months") }, { label: ruEn("Buffer", "Buffer"), value: ruEn("Положительный", "Positive") }] },
        { mark: "M", title: ruEn("Men-at-arms capacity", "Men-at-arms capacity"), grade: "A", fit: 81, text: ruEn("Сила оправдана, если новый outflow не уничтожает post-war reserve.", "Power works when new outflow does not destroy the post-war reserve."), metrics: [{ label: ruEn("Power", "Power"), value: ruEn("Высокая", "High") }, { label: ruEn("Burn", "Burn"), value: ruEn("Recurring", "Recurring") }] },
        { mark: "B", title: ruEn("Новое здание", "New building"), grade: "C", fit: 55, text: ruEn("Длинный payback слаб перед немедленным военным окном.", "Long payback is weak before an immediate war window."), metrics: [{ label: ruEn("Payback", "Payback"), value: ruEn("Позже", "Later") }, { label: ruEn("Tempo", "Tempo"), value: ruEn("Низкий", "Low") }] }
      ]
    },
    {
      id: "succession", label: ruEn("Передача власти", "Succession"), question: ruEn("Что должен получить наследник кроме титула?", "What should the heir receive besides a title?"), formula: ruEn("50% liquidity · 30% faction risk · 20% recurring surplus", "50% liquidity · 30% faction risk · 20% recurring surplus"), note: ruEn("Reserve target растёт при слабом наследнике, disputed succession и внешней войне.", "Raise the reserve target for a weak heir, disputed succession or external war."),
      cards: [
        { mark: "S", title: ruEn("Heir liquidity", "Heir liquidity"), grade: "A", fit: 96, text: ruEn("Финансирует реакцию до того, как новый ruler восстановит контроль.", "Funds a response before the new ruler restores control."), metrics: [{ label: ruEn("Доступ", "Access"), value: ruEn("Сразу", "Immediate") }, { label: ruEn("Гибкость", "Flexibility"), value: ruEn("Максимум", "Maximum") }] },
        { mark: "D", title: ruEn("Устойчивый domain surplus", "Durable domain surplus"), grade: "A", fit: 87, text: ruEn("Снижает monthly burn после передачи власти.", "Reduces monthly burn after the transfer of power."), metrics: [{ label: ruEn("Flow", "Flow"), value: ruEn("Recurring", "Recurring") }, { label: ruEn("Control", "Control"), value: ruEn("Высокий", "High") }] },
        { mark: "A", title: ruEn("Последняя дорогая activity", "One last expensive activity"), grade: "D", fit: 38, text: ruEn("Полезна только если её utility выше стоимости потерянной optionality наследника.", "Works only when utility exceeds the heir's lost optionality."), metrics: [{ label: ruEn("Cash", "Cash"), value: ruEn("Отток", "Outflow") }, { label: ruEn("Risk", "Risk"), value: ruEn("Высокий", "High") }] }
      ]
    }
  ],
  scenarios: [
    { mark: "B", mode: ruEn("Domain ROI", "Domain ROI"), eyebrow: ruEn("120 месяцев", "120 months"), question: ruEn("Окупится ли следующее здание при этом правителе?", "Will the next building pay back during this reign?"), outcome: ruEn("Модель покажет risk-adjusted income, payback month и horizon ROI.", "The model returns risk-adjusted income, payback month and horizon ROI."), href: "#domain-payback" },
    { mark: "W", mode: ruEn("War chest", "War chest"), eyebrow: ruEn("24 месяца", "24 months"), question: ruEn("Хватит ли treasury на затяжную войну?", "Can the treasury fund a long war?"), outcome: ruEn("Wartime burn, one-off cost и reserve становятся одним cash-flow тестом.", "Wartime burn, one-off cost and reserve become one cash-flow test."), href: "#war-chest" },
    { mark: "S", mode: ruEn("Succession", "Succession"), eyebrow: ruEn("18 месяцев", "18 months"), question: ruEn("Какой buffer реально получит наследник?", "What buffer will the heir actually receive?"), outcome: ruEn("Transition cost и временный outflow вычитаются до передачи власти.", "Transition cost and temporary outflow are deducted before the transfer."), href: "#succession-buffer" },
    { mark: "D", mode: ruEn("Ownership risk", "Ownership risk"), eyebrow: ruEn("Partition", "Partition"), question: ruEn("Стоит ли строить там, что может уйти другой линии?", "Should I build where another line may inherit?"), outcome: ruEn("Risk haircut уменьшит value здания без выдуманной точности.", "A risk haircut reduces building value without invented precision."), href: "#domain-payback" },
    { mark: "M", mode: ruEn("Army upkeep", "Army upkeep"), eyebrow: ruEn("Новый regiment", "New regiment"), question: ruEn("Как новый men-at-arms outflow меняет runway?", "How does new men-at-arms outflow change runway?"), outcome: ruEn("Измени new outflow и сравни post-war cash с reserve target.", "Change new outflow and compare post-war cash with the reserve target."), href: "#war-chest" },
    { mark: "T", mode: ruEn("Trade watch", "Trade watch"), eyebrow: ruEn("Q4 2026", "Q4 2026"), question: ruEn("Что уже известно про Silk & Silver?", "What is already known about Silk & Silver?"), outcome: ruEn("Только подтверждённый scope, без invented formulas до live-релиза.", "Confirmed scope only, with no invented formulas before live release."), href: "#dynasty-pulse" }
  ],
  models: [
    {
      id: "domain-payback", kind: "investment", mark: "D", kicker: ruEn("Model 01 · domain capex", "Model 01 · domain capex"), title: ruEn("Domain Payback: сколько месяцев нужно зданию", "Domain Payback: how many months the building needs"), text: ruEn("Вводи только marginal monthly income нового уровня здания, construction delay, ownership horizon и риск потерять поток.", "Enter only the new building level's marginal monthly income, construction delay, ownership horizon and flow-loss risk."), note: ruEn("Модель не оценивает military modifiers и другую неденежную utility. Добавляй их в judgement отдельно.", "The model does not price military modifiers or other non-cash utility. Keep them in a separate judgement layer."),
      inputs: [
        { key: "cost", label: ruEn("Стоимость, gold", "Cost, gold"), value: 600, min: 0, step: 25 },
        { key: "incomePerPeriod", label: ruEn("Новый доход / мес.", "New income / month"), value: 1.8, step: 0.1 },
        { key: "delayPeriods", label: ruEn("Строительство, мес.", "Construction, months"), value: 12, min: 0, step: 1 },
        { key: "horizonPeriods", label: ruEn("Ownership horizon, мес.", "Ownership horizon, months"), value: 120, min: 1, step: 6 },
        { key: "riskPercent", label: ruEn("Риск потери потока, %", "Flow-loss risk, %"), value: 10, min: 0, max: 100, step: 5 }
      ],
      results: [
        { key: "netValue", label: ruEn("Net value", "Net value"), format: "currency", accent: "positive" },
        { key: "paybackPeriods", label: ruEn("Окупаемость", "Payback"), format: "periods", accent: "primary" },
        { key: "roiPercent", label: ruEn("ROI горизонта", "Horizon ROI"), format: "percent" },
        { key: "riskAdjustedIncome", label: ruEn("Доход после risk", "Risk-adjusted income"), format: "currency" },
        { key: "grossValue", label: ruEn("Value до cost", "Value before cost"), format: "currency" },
        { key: "activePeriods", label: ruEn("Активных месяцев", "Active months"), format: "periods" }
      ]
    },
    {
      id: "war-chest", kind: "reserve", mark: "W", kicker: ruEn("Model 02 · war liquidity", "Model 02 · war liquidity"), title: ruEn("War Chest: переживёт ли казна выбранную войну", "War Chest: will the treasury survive the war"), text: ruEn("Отдели peaceful expenses от нового wartime outflow, добавь one-off cost и задай reserve, который нельзя тратить.", "Separate peaceful expenses from new wartime outflow, add one-off cost and set the reserve that cannot be spent."), note: ruEn("Если net flow положительный, runway является бесконечным внутри простой модели. Это не гарантия победы.", "When net flow is positive, runway is infinite inside this simple model. That is not a guarantee of victory."),
      inputs: [
        { key: "treasury", label: ruEn("Казна, gold", "Treasury, gold"), value: 900, min: 0, step: 25 },
        { key: "incomePerPeriod", label: ruEn("Доход / мес.", "Income / month"), value: 22, step: 1 },
        { key: "currentOutflow", label: ruEn("Мирные расходы / мес.", "Peace expenses / month"), value: 8, min: 0, step: 1 },
        { key: "newOutflow", label: ruEn("Новый war outflow / мес.", "New war outflow / month"), value: 18, min: 0, step: 1 },
        { key: "oneOffCost", label: ruEn("One-off cost", "One-off cost"), value: 150, min: 0, step: 25 },
        { key: "horizonPeriods", label: ruEn("Война, месяцев", "War duration, months"), value: 24, min: 1, step: 1 },
        { key: "reserve", label: ruEn("Emergency reserve", "Emergency reserve"), value: 250, min: 0, step: 25 }
      ],
      results: [
        { key: "cashAtTarget", label: ruEn("Казна после войны", "Post-war cash"), format: "currency", accent: "primary" },
        { key: "buffer", label: ruEn("Сверх резерва", "Above reserve"), format: "currency", accent: "positive" },
        { key: "netFlow", label: ruEn("War net / мес.", "War net / month"), format: "currency" },
        { key: "safePeriods", label: ruEn("Runway до резерва", "Runway to reserve"), format: "periods" },
        { key: "maxSustainableOutflow", label: ruEn("Max общий outflow", "Max total outflow"), format: "currency" },
        { key: "coveragePercent", label: ruEn("Reserve coverage", "Reserve coverage"), format: "percent" }
      ]
    },
    {
      id: "succession-buffer", kind: "reserve", mark: "S", kicker: ruEn("Model 03 · dynasty continuity", "Model 03 · dynasty continuity"), title: ruEn("Succession Buffer: какую ликвидность получит наследник", "Succession Buffer: how much liquidity the heir receives"), text: ruEn("Treasury растёт на текущем net flow, затем получает transition outflow, one-off crisis cost и обязательный heir reserve.", "Treasury grows through current net flow, then absorbs transition outflow, one-off crisis cost and the required heir reserve."), note: ruEn("New outflow здесь является временной стоимостью перехода: gifts, raised forces, mercenaries или другой stress-case.", "New outflow is the temporary transition cost: gifts, raised forces, mercenaries or another stress case."),
      inputs: [
        { key: "treasury", label: ruEn("Казна сейчас, gold", "Treasury now, gold"), value: 800, min: 0, step: 25 },
        { key: "incomePerPeriod", label: ruEn("Доход / мес.", "Income / month"), value: 20, step: 1 },
        { key: "currentOutflow", label: ruEn("Обычные расходы / мес.", "Normal outflow / month"), value: 9, min: 0, step: 1 },
        { key: "newOutflow", label: ruEn("Transition outflow / мес.", "Transition outflow / month"), value: 6, min: 0, step: 1 },
        { key: "oneOffCost", label: ruEn("Crisis one-off cost", "Crisis one-off cost"), value: 300, min: 0, step: 25 },
        { key: "horizonPeriods", label: ruEn("До стабилизации, мес.", "Months to stability"), value: 18, min: 1, step: 1 },
        { key: "reserve", label: ruEn("Heir reserve target", "Heir reserve target"), value: 250, min: 0, step: 25 }
      ],
      results: [
        { key: "cashAtTarget", label: ruEn("Казна после перехода", "Post-transition cash"), format: "currency", accent: "primary" },
        { key: "buffer", label: ruEn("Heir buffer", "Heir buffer"), format: "currency", accent: "positive" },
        { key: "netFlow", label: ruEn("Transition net / мес.", "Transition net / month"), format: "currency" },
        { key: "safePeriods", label: ruEn("Runway до floor", "Runway to floor"), format: "periods" },
        { key: "maxSustainableOutflow", label: ruEn("Max общий outflow", "Max total outflow"), format: "currency" },
        { key: "coveragePercent", label: ruEn("Heir reserve coverage", "Heir reserve coverage"), format: "percent" }
      ]
    }
  ],
  briefs: [
    { mark: "D", audience: "returner", status: "estimated", kicker: ruEn("Domain ROI", "Domain ROI"), title: ruEn("Почему общий доход holding не измеряет следующее здание", "Why total holding income does not price the next building"), text: ruEn("Решение создаёт только marginal income нового уровня.", "The decision creates only the next level's marginal income."), takeaway: ruEn("Считай delta, не total.", "Model the delta, not the total."), href: "#domain-payback" },
    { mark: "W", audience: "casual", status: "estimated", kicker: ruEn("War finance", "War finance"), title: ruEn("Casus belli без cash-flow плана", "A casus belli without a cash-flow plan"), text: ruEn("Длительность, wartime outflow и reserve важнее суммы gold в момент объявления.", "Duration, wartime outflow and reserve matter more than gold at declaration."), takeaway: ruEn("Cash after war, не cash before war.", "Cash after war, not before war."), href: "#war-chest" },
    { mark: "S", audience: "grinder", status: "estimated", kicker: ruEn("Succession", "Succession"), title: ruEn("Treasury как наследуемый defensive asset", "Treasury as an inherited defensive asset"), text: ruEn("Ликвидность покупает время, пока short reign и factions ещё давят.", "Liquidity buys time while short reign and factions still apply pressure."), takeaway: ruEn("Heir buffer является отдельной целью.", "The heir buffer is a separate objective."), href: "#succession-buffer" },
    { mark: "L", audience: "returner", status: "verified", kicker: ruEn("Update 1.19", "Update 1.19"), title: ruEn("Ledger как 60-секундный snapshot realm", "The Ledger as a 60-second realm snapshot"), text: ruEn("Holdings, values и war losses дают точку входа после перерыва.", "Holdings, values and war losses create a starting point after a break."), takeaway: ruEn("Сначала данные, затем действие.", "Data before action."), href: "#dynasty-pulse" },
    { mark: "T", audience: "grinder", status: "verified", kicker: ruEn("Silk & Silver", "Silk & Silver"), title: ruEn("Что мы не будем придумывать до Q4", "What we will not invent before Q4"), text: ruEn("Trade routes и monopolies подтверждены, точные доходы и формулы ещё нет.", "Trade routes and monopolies are confirmed; exact income and formulas are not."), takeaway: ruEn("Scope verified, mechanics pending.", "Scope verified, mechanics pending."), href: "#dynasty-pulse" },
    { mark: "A", audience: "casual", status: "estimated", kicker: ruEn("Opportunity cost", "Opportunity cost"), title: ruEn("Когда activity дороже своего price tag", "When an activity costs more than its price tag"), text: ruEn("Потраченный gold может удалить emergency option из succession window.", "Spent gold can remove an emergency option from the succession window."), takeaway: ruEn("Сравни utility с lost optionality.", "Compare utility with lost optionality."), href: "#economy-lenses" }
  ],
  methodology: {
    title: ruEn("Verified release context отдельно. Realm assumptions отдельно.", "Verified release context on one layer. Realm assumptions on another."),
    text: ruEn("Money Meta связывает официальные изменения Paradox с решениями игрока, но не выдаёт пользовательские income, costs или risk за данные издателя.", "Money Meta connects official Paradox changes to player decisions without presenting user income, costs or risk as publisher data."),
    modelNote: ruEn("Baseline-числа в моделях являются демонстрационными сценариями. Замени их значениями из своего Ledger и holding screens.", "Model baselines are demonstration scenarios. Replace them with values from your Ledger and holding screens."),
    disclaimer: ruEn("Crusader Kings и связанные названия являются собственностью Paradox Interactive. Money Meta является независимым аналитическим продуктом.", "Crusader Kings and related names are property of Paradox Interactive. Money Meta is an independent analytical product."),
    roadmap: ruEn("После Silk & Silver и live-проверки добавим trade route ROI, merchant portfolio и republic competition models.", "After Silk & Silver and live validation, add trade-route ROI, merchant portfolio and republic competition models."),
    sources: [
      { label: "Paradox · Update 1.19.0.6", url: "https://store.steampowered.com/news/app/1158310/view/677373278422041207", note: ruEn("Текущая live-версия на дату проверки.", "Current live version on the checked date.") },
      { label: "Paradox · 1.19 Scribe", url: "https://store.steampowered.com/news/app/1158310/view/552395313313219108", note: ruEn("Ledger, war losses и UI context.", "Ledger, war losses and UI context.") },
      { label: "Paradox · Chapter V", url: "https://www.paradoxinteractive.com/games/crusader-kings-iii/add-ons/crusader-kings-iii-chapter-v", note: ruEn("Официальный scope Silk & Silver и окно Q4 2026.", "Official Silk & Silver scope and Q4 2026 window.") }
    ]
  }
};
