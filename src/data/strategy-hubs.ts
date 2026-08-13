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
  sourceLabel: Localized;
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
  worldCode: Localized;
  checkedAt: string;
  version: Localized;
  currencyUnit: Localized;
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
    loadout: Array<{ mark: string; label: Localized; value: Localized }>;
  };
  manifesto: {
    kicker: Localized;
    title: Localized;
    text: Localized;
    principles: Array<{ title: Localized; text: Localized }>;
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
    sources: Array<{ label: Localized; url: string; note: Localized }>;
  };
}

const ruEn = (ru: string, en: string): Localized => ({ ru, en });

export const totalWarHub: StrategyHubData = {
  id: "total-war",
  slug: "total-war",
  name: "Total War: Warhammer III",
  shortName: "Total War",
  publisher: "SEGA / Creative Assembly",
  worldCode: ruEn("КАПИТАЛ КАМПАНИИ / 8.1", "CAMPAIGN CAPITAL / 8.1"),
  checkedAt: "2026-08-12",
  version: ruEn("Патч 8.1", "Patch 8.1"),
  currencyUnit: ruEn("зол.", "gold"),
  periodUnit: ruEn("ход.", "turns"),
  meta: {
    title: ruEn("Экономика Total War: Warhammer III: казна, армии и провинции | Money Meta", "Total War: Warhammer III Economy Hub: treasury, armies and provinces | Money Meta"),
    description: ruEn("Интерактивный разбор экономики Total War: Warhammer III: движение золота, пути игрока, изменения патча 8.1 и модели для зданий, военного резерва и захвата.", "An interactive Total War: Warhammer III campaign economy with capital map, player paths, Patch 8.1 Pulse and models for buildings, war reserves and conquest choices.")
  },
  hero: {
    live: ruEn("Патч 8.1 · проверено 2026-08-12", "Patch 8.1 · checked 2026-08-12"),
    eyebrow: ruEn("Total War: Warhammer III · экономика кампании", "Total War: Warhammer III · Campaign Economy"),
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
      { mark: "¤", label: ruEn("КАЗНА", "TREASURY"), value: ruEn("Военный резерв", "War chest") },
      { mark: "P", label: ruEn("ПРОВИНЦИЯ", "PROVINCE"), value: ruEn("Окупаемость зданий", "Building ROI") },
      { mark: "A", label: ruEn("АРМИЯ", "ARMY"), value: ruEn("Запас на содержание", "Upkeep runway") },
      { mark: "C", label: ruEn("ЗАХВАТ", "CONQUEST"), value: ruEn("Разграбить или удержать", "Sack vs hold") }
    ]
  },
  manifesto: {
    kicker: ruEn("Подход Money Meta · экономика кампании", "Money Meta doctrine · campaign edition"),
    title: ruEn("Экономика кампании работает с задержкой, но бьёт не слабее армии.", "Campaign economy is a weapon with a delay."),
    text: ruEn("Здание начинает приносить пользу через несколько ходов, новая армия постоянно расходует казну, а захват меняет и доход, и риски. Поэтому мы оцениваем каждое решение вместе с горизонтом, резервом и запасным сценарием.", "A building pays later, a new army creates permanent burn, and conquest changes both income and exposure. Every decision therefore needs a horizon, a reserve and a counterfactual."),
    principles: [
      { title: ruEn("ОКУПАЕМОСТЬ", "PAYBACK"), text: ruEn("Стоимость здания нужно оценивать вместе с доходом и числом ходов, когда оно будет работать.", "Read building cost with income and active turns.") },
      { title: ruEn("ЗАПАС ПРОЧНОСТИ", "RUNWAY"), text: ruEn("Армия доступна только тогда, когда казна покрывает найм, содержание и обязательный резерв.", "An army is affordable only after recruitment and the emergency reserve.") },
      { title: ruEn("ТЕМП", "TEMPO"), text: ruEn("Будущий доход может уступить силе, которая нужна прямо сейчас.", "Delayed income can lose to power required now.") },
      { title: ruEn("РИСК", "RISK"), text: ruEn("Доход пограничной провинции менее надёжен, чем доход защищённой столицы.", "A frontier province and a capital do not have equal cash-flow reliability.") }
    ]
  },
  economyNodes: [
    { id: "treasury", code: "01", mark: "¤", title: ruEn("Казна", "Treasury"), phase: ruEn("Ликвидность", "Liquidity"), summary: ruEn("Непотраченное золото сохраняет варианты: найм, срочная армия, дипломатия или ремонт.", "Unspent gold preserves options for recruitment, an emergency army, diplomacy or repairs."), signal: ruEn("Свободное золото", "Deployable gold"), decision: ruEn("Отдели военный резерв от капитала, который можно инвестировать.", "Separate the war reserve from capital available for investment."), href: "#war-reserve" },
    { id: "income", code: "02", mark: "I", title: ruEn("Доход", "Income"), phase: ruEn("Поток за ход", "Per-turn flow"), summary: ruEn("Налоги, здания, торговля и особенности фракции формируют регулярный приток золота.", "Taxes, buildings, trade and faction mechanics create recurring inflow."), signal: ruEn("Чистый доход за ход", "Net per turn"), decision: ruEn("Считай доход после текущего содержания, а не до него.", "Measure income after existing upkeep, not before it."), href: "#building-payback" },
    { id: "province", code: "03", mark: "P", title: ruEn("Провинция", "Province"), phase: ruEn("Инфраструктура", "Infrastructure"), summary: ruEn("Рост, порядок и здания превращают ранние вложения в будущую мощь провинции.", "Growth, control and buildings turn early capital into future capacity."), signal: ruEn("Доход после задержки", "Income after delay"), decision: ruEn("Проверь, успеет ли вложение окупиться за нужное число ходов.", "Test whether the investment pays back inside the real campaign horizon."), href: "#building-payback" },
    { id: "recruit", code: "04", mark: "R", title: ruEn("Найм", "Recruit"), phase: ruEn("Разовый расход", "One-off capex"), summary: ruEn("Найм даёт силу сейчас, но уменьшает резерв ещё до первой победы.", "Recruitment buys power now while reducing the reserve before the first win."), signal: ruEn("Стоимость развёртывания", "Deployment cost"), decision: ruEn("Добавь стоимость найма к содержанию на весь планируемый поход.", "Add recruitment cost to upkeep across the planned campaign."), href: "#war-reserve" },
    { id: "upkeep", code: "05", mark: "A", title: ruEn("Содержание", "Upkeep"), phase: ruEn("Постоянный расход", "Recurring burn"), summary: ruEn("Вторую армию можно позволить себе сегодня и обанкротиться из-за неё через несколько ходов.", "A second army can be affordable today and bankrupt the faction several turns later."), signal: ruEn("На сколько ходов хватит казны", "Army runway"), decision: ruEn("Проверь остаток казны у цели и максимальный безопасный расход.", "Check cash at target and maximum safe outflow."), href: "#war-reserve" },
    { id: "conquest", code: "06", mark: "C", title: ruEn("Захват", "Conquest"), phase: ruEn("Разовая добыча или доход", "Income or payout"), summary: ruEn("Разграбление даёт золото сразу, а удержание создаёт будущий доход и новую границу.", "A sack creates liquidity; holding creates future flow and a new frontier."), signal: ruEn("Сейчас или каждый ход", "Immediate vs recurring"), decision: ruEn("Сравни варианты на одном горизонте с риском потери дохода.", "Compare both options on one horizon with loss risk included."), href: "#conquest-choice" },
    { id: "reinvest", code: "07", mark: "↻", title: ruEn("Новые вложения", "Reinvest"), phase: ruEn("Цикл роста кампании", "Campaign flywheel"), summary: ruEn("Победа становится экономическим преимуществом только после правильного распределения добычи.", "A victory becomes an economic advantage only after the spoils are allocated well."), signal: ruEn("Золото в темп", "Gold into tempo"), decision: ruEn("Направь добычу в экономику, резерв или следующую армию в зависимости от главного ограничения.", "Allocate between economy, reserve and the next army based on the current bottleneck."), href: "#decision-deck" }
  ],
  paths: [
    {
      id: "returner", mark: "R", label: ruEn("После перерыва", "Returner"), title: ruEn("Сначала верни контроль над кампанией, потом расширяйся", "Restore control before expanding"), summary: ruEn("Для старого сохранения, где сначала нужно вспомнить доходы, фронты и обязательства, а уже потом продолжать прежний план.", "For a campaign resumed after a break, where understanding cash flow, fronts and obligations matters more than continuing the old plan immediately."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("10 ходов", "10 turns") }, { label: ruEn("Резерв", "Reserve"), value: ruEn("1 армия", "1 army") }, { label: ruEn("Риск", "Risk"), value: ruEn("низкий", "low") }],
      steps: [{ title: ruEn("Зафиксируй положение", "Take a snapshot"), text: ruEn("Запиши размер казны, чистый доход, содержание и угрозы на каждом фронте.", "Record treasury, net income, upkeep and threats on every front.") }, { title: ruEn("Закрой главный риск", "Freeze one risk"), text: ruEn("Оставь резерв на срочный найм или временную потерю дохода.", "Keep a reserve for emergency recruitment or lost income.") }, { title: ruEn("Сделай обратимый ход", "Make a reversible move"), text: ruEn("Выбери короткое вложение или локальную цель до большого расширения.", "Choose a short investment or local objective before major expansion.") }],
      flip: ruEn("План меняется, когда ближайший противник уже способен открыть новый фронт.", "The plan changes when the nearest rival can already open a new front."), href: "#war-reserve"
    },
    {
      id: "casual", mark: "T", label: ruEn("Короткие сессии", "Limited turns"), title: ruEn("Максимум прогресса без десяти параллельных задач", "Maximum progress without ten parallel systems"), summary: ruEn("Для коротких сессий: одна цель, одна очередь строительства и понятный момент, когда пора остановиться.", "For short sessions: one objective, one investment queue and a clear stop condition."),
      constraints: [{ label: ruEn("Сессия", "Session"), value: ruEn("5 ходов", "5 turns") }, { label: ruEn("Фронты", "Fronts"), value: ruEn("1 активный", "1 active") }, { label: ruEn("Темп", "Tempo"), value: ruEn("стабильный", "steady") }],
      steps: [{ title: ruEn("Выбери одно ограничение", "Pick one bottleneck"), text: ruEn("Доход, порядок, найм или оборона, но не всё одновременно.", "Income, control, recruitment or defense, but not all at once.") }, { title: ruEn("Задай горизонт", "Set the horizon"), text: ruEn("Реши, что должно измениться через пять ходов.", "Define what must be different in five turns.") }, { title: ruEn("Закрой цикл", "Close the loop"), text: ruEn("Закончи сессию с уже понятным следующим действием.", "End the session with the next action already prepared.") }],
      flip: ruEn("Если появляется угроза столице, инвестиционный план уступает ликвидности.", "If the capital is threatened, the investment plan yields to liquidity."), href: "#building-payback"
    },
    {
      id: "grinder", mark: "O", label: ruEn("Оптимизатор", "Optimizer"), title: ruEn("Управляй империей как портфелем фронтов", "Run the empire as a portfolio of fronts"), summary: ruEn("Для высокой сложности и длинных кампаний, где важны цена следующей армии, риск на границах и ценность каждого хода.", "For high difficulty and long campaigns, where the marginal army, frontier risk and turn value matter."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("20+ ходов", "20+ turns") }, { label: ruEn("Фронты", "Fronts"), value: ruEn("3+", "3+") }, { label: ruEn("Риск", "Risk"), value: ruEn("сценарный", "modeled") }],
      steps: [{ title: ruEn("Оцени следующую армию", "Price the marginal army"), text: ruEn("Считай её дополнительное содержание и угрозу, которую она снимает, а не средние расходы всех войск.", "Measure the new burn and the threat it removes, not average upkeep.") }, { title: ruEn("Снизь оценку пограничного дохода", "Discount frontier income"), text: ruEn("Поток с нестабильной границы не равен доходу защищённого ядра.", "Flow from an unstable frontier is not equal to income from the protected core.") }, { title: ruEn("Вкладывайся в главное ограничение", "Reinvest by bottleneck"), text: ruEn("Каждую добычу направляй туда, где сейчас упирается следующая победа.", "Send each payout to the constraint blocking the next victory.") }],
      flip: ruEn("Если расширение уводит чистый доход в минус, сначала закрепи уже захваченное.", "When expansion creates negative net flow, priority returns to consolidation."), href: "#conquest-choice"
    }
  ],
  pulse: {
    title: ruEn("Патч 8.1 меняет давление на кампанию, но считать всё равно нужно", "Patch 8.1 changes campaign pressure without replacing unit economics"),
    text: ruEn("Здесь подтверждённые изменения Creative Assembly отделены от значений, которые зависят от твоей фракции и сохранения.", "Pulse separates confirmed Creative Assembly changes from editable values in your faction and save."),
    changes: [
      { mark: "AI", signal: ruEn("Проверено · патч 8.1", "Verified · Patch 8.1"), title: ruEn("На позднем этапе ИИ активнее расширяется", "Late-game AI looks for expansion"), summary: ruEn("Creative Assembly снизила приоритет оборонительных задач на позднем этапе и немного повысила приоритет атак на силы противника.", "Creative Assembly reduced late-game defensive task priority and slightly raised tasks targeting enemy forces."), decision: ruEn("Держи больший резерв на границе, если план зависит от долгой мирной окупаемости.", "Keep a larger frontier reserve when the plan depends on a long peaceful payback."), sourceLabel: ruEn("Creative Assembly · патч 8.1", "Creative Assembly · Patch 8.1"), sourceUrl: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101" },
      { mark: "LM", signal: ruEn("Проверено · патч 8.1", "Verified · Patch 8.1"), title: ruEn("Новые особые постройки и технологии требуют пересчёта", "New landmarks and technologies require a rerun"), summary: ruEn("Патч 8.1 добавил особые постройки и технологии, поэтому старые универсальные приоритеты больше нельзя переносить без проверки.", "Patch 8.1 added landmarks and technologies, so old universal building priorities should not be carried over without checking."), decision: ruEn("Введи фактическую стоимость и прирост дохода своей провинции в модель окупаемости здания.", "Enter the actual cost and income delta from your province in Building Payback."), sourceLabel: ruEn("Creative Assembly · патч 8.1", "Creative Assembly · Patch 8.1"), sourceUrl: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101" },
      { mark: "CT", signal: ruEn("Проверено · обновление 8.0", "Verified · Update 8.0"), title: ruEn("Катай получил отдельную ветку технологий провинций", "Cathay gained a province-tech layer"), summary: ruEn("Обновление 8.0 разделило технологии Катая на военные и провинциальные, а также ускорило рост поселений.", "Update 8.0 split Cathay technologies into military and provinces and improved settlement growth."), decision: ruEn("Для Катая сравни вложения в провинцию с немедленной боевой ценностью на одном горизонте.", "For Cathay, compare province investment with immediate military value on one horizon."), sourceLabel: ruEn("Creative Assembly · обновление 8.0", "Creative Assembly · Update 8.0"), sourceUrl: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/98-total-war-warhammer-iii-update-8-0-patch-notes" }
    ]
  },
  lenses: [
    {
      id: "stability", label: ruEn("Ранняя стабильность", "Early stability"), question: ruEn("Что укрепляет первые 15 ходов?", "What strengthens the first 15 turns?"), formula: ruEn("40% ликвидность · 35% окупаемость · 25% оборона", "40% liquidity · 35% payback · 25% defense"), note: ruEn("Это порядок действий, а не рейтинг фракций. Точные значения берутся из конкретной кампании.", "This is an order of operations, not a faction tier list. Exact values come from the campaign."),
      cards: [
        { mark: "¤", title: ruEn("Резерв казны", "Treasury reserve"), grade: "A", fit: 91, text: ruEn("Позволяет ответить на внезапную армию или потерю дохода поселения.", "Preserves an answer to a surprise army or lost settlement income."), metrics: [{ label: ruEn("Ликвидность", "Liquidity"), value: ruEn("Высокая", "High") }, { label: ruEn("Задержка", "Delay"), value: ruEn("0 ходов", "0 turns") }] },
        { mark: "P", title: ruEn("Здание с быстрой окупаемостью", "Short income building"), grade: "A", fit: 84, text: ruEn("Работает, если успевает окупиться до следующей большой войны.", "Works when payback fits before the next war window."), metrics: [{ label: ruEn("Доход", "Income"), value: ruEn("Регулярный", "Recurring") }, { label: ruEn("Риск", "Risk"), value: ruEn("Зависит от провинции", "Province-specific") }] },
        { mark: "A", title: ruEn("Вторая армия", "Second army"), grade: "B", fit: 68, text: ruEn("Сильный ход ради темпа, если у цели в казне всё ещё остаётся резерв.", "A strong tempo move only with positive cash at target."), metrics: [{ label: ruEn("Сила сейчас", "Power now"), value: ruEn("Высокая", "High") }, { label: ruEn("Расход", "Burn"), value: ruEn("Постоянный", "Recurring") }] }
      ]
    },
    {
      id: "expansion", label: ruEn("Расширение", "Expansion"), question: ruEn("Куда направить добычу после победы?", "Where should post-victory gold go?"), formula: ruEn("40% главное ограничение · 35% ценность на горизонте · 25% риск", "40% bottleneck · 35% horizon value · 25% risk"), note: ruEn("Лучший вариант меняется, если новая граница требует отдельной армии или поселение невозможно удержать.", "The leader changes when the new frontier needs another army or the settlement cannot be held."),
      cards: [
        { mark: "C", title: ruEn("Укрепление провинции", "Province consolidation"), grade: "A", fit: 88, text: ruEn("Решает проблемы с порядком, ростом и доходом в уже защищённой зоне.", "Closes control, growth and income bottlenecks in an already protected area."), metrics: [{ label: ruEn("Накопительный эффект", "Compounding"), value: ruEn("Высокий", "High") }, { label: ruEn("Фронт", "Front"), value: ruEn("Стабильный", "Stable") }] },
        { mark: "¤", title: ruEn("Военный резерв", "War chest"), grade: "A", fit: 82, text: ruEn("Сохраняет свободу действий перед контратакой или внезапным новым фронтом.", "Buys optionality before a counterattack or surprise front."), metrics: [{ label: ruEn("Гибкость", "Flexibility"), value: ruEn("Максимум", "Maximum") }, { label: ruEn("Доход", "Income"), value: ruEn("0", "0") }] },
        { mark: "A", title: ruEn("Новая армия", "New army"), grade: "B", fit: 73, text: ruEn("Оправдана, если быстрее открывает новую добычу, чем опустошает казну.", "Works when it unlocks the next payout faster than it drains the treasury."), metrics: [{ label: ruEn("Темп", "Tempo"), value: ruEn("Высокий", "High") }, { label: ruEn("Содержание", "Upkeep"), value: ruEn("Высокое", "High") }] }
      ]
    },
    {
      id: "late", label: ruEn("Давление поздней игры", "Late-game pressure"), question: ruEn("Что защищает длинную кампанию от каскадного кризиса?", "What protects a long campaign from cascading failure?"), formula: ruEn("45% запас казны · 30% прикрытие фронтов · 25% ценность следующего шага", "45% runway · 30% front coverage · 25% marginal value"), note: ruEn("В патче 8.1 ИИ поздней игры чаще расширяется, поэтому мирный сценарий нужно проверять и при появлении нового фронта.", "Patch 8.1 makes late-game AI more expansion-oriented, so a peaceful baseline needs sensitivity."),
      cards: [
        { mark: "¤", title: ruEn("Резерв на несколько фронтов", "Multi-front reserve"), grade: "A", fit: 93, text: ruEn("Одновременно покрывает найм, отрицательный чистый доход и ремонт.", "Covers recruitment, negative flow and repairs together."), metrics: [{ label: ruEn("Запас", "Runway"), value: ruEn("8+ ходов", "8+ turns") }, { label: ruEn("Фронты", "Fronts"), value: ruEn("2+", "2+") }] },
        { mark: "R", title: ruEn("Глубина найма", "Recruitment depth"), grade: "A", fit: 85, text: ruEn("Сокращает задержку между угрозой и появлением боеспособной армии.", "Reduces the delay between threat and a combat-ready army."), metrics: [{ label: ruEn("Свобода действий", "Optionality"), value: ruEn("Высокая", "High") }, { label: ruEn("Разовый расход", "Capex"), value: ruEn("Средний", "Medium") }] },
        { mark: "P", title: ruEn("Ещё одно доходное здание", "Another income building"), grade: "C", fit: 57, text: ruEn("Полезно только если граница останется защищённой дольше срока окупаемости.", "Useful only when the frontier stays safe beyond payback."), metrics: [{ label: ruEn("Окупаемость", "Payback"), value: ruEn("Долгая", "Long") }, { label: ruEn("Риск", "Risk"), value: ruEn("Высокий", "High") }] }
      ]
    }
  ],
  scenarios: [
    { mark: "P", mode: ruEn("Окупаемость здания", "Building ROI"), eyebrow: ruEn("20 ходов", "20 turns"), question: ruEn("Окупится ли доходное здание до следующей большой войны?", "Will the income building pay back before the next major war?"), outcome: ruEn("Модель покажет окупаемость с учётом риска, чистую ценность и доходность за выбранный срок.", "The model returns risk-adjusted payback, horizon net value and ROI."), href: "#building-payback" },
    { mark: "A", mode: ruEn("Запас на армию", "Army runway"), eyebrow: ruEn("Вторая армия", "Second army"), question: ruEn("Могу ли я нанять её сейчас и не потратить резерв?", "Can I recruit it now without breaking the reserve?"), outcome: ruEn("Остаток казны у цели покажет разницу между доступным наймом и устойчивым содержанием.", "Cash at target separates an affordable purchase from sustainable upkeep."), href: "#war-reserve" },
    { mark: "C", mode: ruEn("Выбор после захвата", "Conquest choice"), eyebrow: ruEn("Разграбить или занять", "Sack vs occupy"), question: ruEn("Что ценнее на горизонте 12 ходов?", "Which option is worth more across 12 turns?"), outcome: ruEn("Оба варианта сравниваются с учётом задержки и риска потерять регулярный доход.", "Both options are compared with delay and recurring-income risk."), href: "#conquest-choice" },
    { mark: "F", mode: ruEn("Пограничная провинция", "Frontier case"), eyebrow: ruEn("25% риск", "25% risk"), question: ruEn("Стоит ли вкладываться в нестабильную границу?", "Should I invest in an unstable frontier?"), outcome: ruEn("Поправка на риск покажет, когда привлекательный доход уже не оправдывает замороженное золото.", "A risk haircut shows when attractive income stops paying for capital lock-up."), href: "#building-payback" },
    { mark: "¤", mode: ruEn("Военный резерв", "War chest"), eyebrow: ruEn("8 ходов", "8 turns"), question: ruEn("Какой расход выдержит казна до цели?", "How much burn can the treasury carry to the objective?"), outcome: ruEn("Модель вычислит максимальный устойчивый расход и безопасный запас ходов.", "The model calculates maximum sustainable outflow and safe runway."), href: "#war-reserve" },
    { mark: "L", mode: ruEn("План поздней игры", "Late-game plan"), eyebrow: ruEn("Патч 8.1", "Patch 8.1"), question: ruEn("Как увеличить резерв против более активного ИИ?", "How should the reserve change against more active AI?"), outcome: ruEn("Увеличь срок похода, новый расход и обязательный резерв, чтобы проверить худший сценарий.", "Raise horizon, new outflow and reserve to stress-test the case."), href: "#war-reserve" }
  ],
  models: [
    {
      id: "building-payback", kind: "investment", mark: "P", kicker: ruEn("Модель 01 · вложение в провинцию", "Model 01 · province capex"), title: ruEn("Окупаемость здания: успеет ли оно вернуть вложенное золото", "Building Payback: will the building return its gold"), text: ruEn("Введи фактическую стоимость, прирост дохода, задержку строительства, число ходов и риск потери потока. Значения не привязаны к одной фракции.", "Enter actual cost, income delta, construction delay, horizon and the risk of losing the flow. The model assumes no universal faction values."), note: ruEn("Поправка на риск является допущением сценария, а не скрытой игровой формулой.", "The risk haircut is a scenario assumption, not a hidden game formula."),
      inputs: [
        { key: "cost", label: ruEn("Стоимость, золото", "Cost, gold"), value: 4000, min: 0, step: 100 },
        { key: "incomePerPeriod", label: ruEn("Новый доход / ход", "New income / turn"), value: 350, step: 25 },
        { key: "delayPeriods", label: ruEn("Задержка, ходов", "Delay, turns"), value: 2, min: 0, step: 1 },
        { key: "horizonPeriods", label: ruEn("Горизонт, ходов", "Horizon, turns"), value: 20, min: 1, step: 1 },
        { key: "riskPercent", label: ruEn("Риск потери потока, %", "Flow-loss risk, %"), value: 10, min: 0, max: 100, step: 5 }
      ],
      results: [
        { key: "netValue", label: ruEn("Чистая ценность", "Net value"), format: "currency", accent: "positive" },
        { key: "paybackPeriods", label: ruEn("Окупаемость", "Payback"), format: "periods", accent: "primary" },
        { key: "roiPercent", label: ruEn("Доходность за период", "Horizon ROI"), format: "percent" },
        { key: "riskAdjustedIncome", label: ruEn("Доход с учётом риска", "Risk-adjusted income"), format: "currency" },
        { key: "grossValue", label: ruEn("Ценность до вычета стоимости", "Value before cost"), format: "currency" },
        { key: "activePeriods", label: ruEn("Активных ходов", "Active turns"), format: "periods" }
      ]
    },
    {
      id: "war-reserve", kind: "reserve", mark: "A", kicker: ruEn("Модель 02 · деньги на армию", "Model 02 · army liquidity"), title: ruEn("Военный резерв: действительно ли тебе по карману новая армия", "War Reserve: is the new army truly affordable"), text: ruEn("Найм имеет смысл только с учётом его стоимости, текущего содержания, нового расхода и неприкосновенного резерва.", "The purchase passes only after recruitment cost, existing upkeep, new burn and the emergency reserve."), note: ruEn("Максимальный устойчивый расход показывает, сколько всего можно тратить за ход на выбранном горизонте.", "Maximum sustainable outflow is total affordable per-turn spending across the selected horizon."),
      inputs: [
        { key: "treasury", label: ruEn("Казна, золото", "Treasury, gold"), value: 12000, min: 0, step: 500 },
        { key: "incomePerPeriod", label: ruEn("Доход / ход", "Income / turn"), value: 3500, step: 100 },
        { key: "currentOutflow", label: ruEn("Текущее содержание / ход", "Current upkeep / turn"), value: 2300, min: 0, step: 100 },
        { key: "newOutflow", label: ruEn("Новое содержание / ход", "New upkeep / turn"), value: 1200, min: 0, step: 100 },
        { key: "oneOffCost", label: ruEn("Стоимость найма", "Recruitment cost"), value: 4500, min: 0, step: 250 },
        { key: "horizonPeriods", label: ruEn("До цели, ходов", "Turns to objective"), value: 8, min: 1, step: 1 },
        { key: "reserve", label: ruEn("Неприкосновенный резерв", "Emergency reserve"), value: 3000, min: 0, step: 250 }
      ],
      results: [
        { key: "cashAtTarget", label: ruEn("Казна у цели", "Cash at objective"), format: "currency", accent: "primary" },
        { key: "buffer", label: ruEn("Сверх резерва", "Above reserve"), format: "currency", accent: "positive" },
        { key: "netFlow", label: ruEn("Чистый доход / ход", "Net / turn"), format: "currency" },
        { key: "safePeriods", label: ruEn("Ходов до резерва", "Runway to reserve"), format: "periods" },
        { key: "maxSustainableOutflow", label: ruEn("Максимальный общий расход", "Max total outflow"), format: "currency" },
        { key: "coveragePercent", label: ruEn("Покрытие резерва", "Reserve coverage"), format: "percent" }
      ]
    },
    {
      id: "conquest-choice", kind: "comparison", mark: "C", kicker: ruEn("Модель 03 · распределение капитала", "Model 03 · capital allocation"), title: ruEn("Разграбить или занять: золото сейчас или будущий доход", "Sack vs Occupy: immediate payout or future flow"), text: ruEn("Для каждого варианта укажи разовую ценность, доход за ход, задержку и риск. Бери цифры с экрана конкретного поселения.", "Options A and B each receive immediate value, recurring value, delay and risk. Enter values from the actual settlement screen."), note: ruEn("Стратегическую ценность позиции можно добавить к разовой ценности варианта, но это будет экспертная оценка, а не игровая формула.", "Non-cash strategic value can be added to an option's immediate value and should be treated as judgement."),
      inputs: [
        { key: "aImmediate", label: ruEn("A · разовая ценность", "A · immediate value"), value: 12000, step: 500, group: "a" },
        { key: "aRecurring", label: ruEn("A · доход / ход", "A · recurring / turn"), value: 0, step: 100, group: "a" },
        { key: "aDelay", label: ruEn("A · задержка", "A · delay"), value: 0, min: 0, step: 1, group: "a" },
        { key: "aRiskPercent", label: ruEn("A · риск, %", "A · risk, %"), value: 10, min: 0, max: 100, step: 5, group: "a" },
        { key: "bImmediate", label: ruEn("B · разовая ценность", "B · immediate value"), value: -3500, step: 500, group: "b" },
        { key: "bRecurring", label: ruEn("B · доход / ход", "B · recurring / turn"), value: 1300, step: 100, group: "b" },
        { key: "bDelay", label: ruEn("B · задержка", "B · delay"), value: 2, min: 0, step: 1, group: "b" },
        { key: "bRiskPercent", label: ruEn("B · риск, %", "B · risk, %"), value: 25, min: 0, max: 100, step: 5, group: "b" },
        { key: "horizonPeriods", label: ruEn("Общий горизонт, ходов", "Shared horizon, turns"), value: 12, min: 1, step: 1 }
      ],
      results: [
        { key: "winner", label: ruEn("Лучший вариант", "Best value"), format: "winner", accent: "primary" },
        { key: "advantage", label: ruEn("Преимущество", "Advantage"), format: "currency", accent: "positive" },
        { key: "optionAValue", label: ruEn("A · итоговая ценность", "A · value"), format: "currency" },
        { key: "optionBValue", label: ruEn("B · итоговая ценность", "B · value"), format: "currency" }
      ],
      winnerLabels: { a: ruEn("A · разграбить", "A · Sack / cash"), b: ruEn("B · занять", "B · Occupy / hold"), tie: ruEn("Почти равны", "Near tie") }
    }
  ],
  briefs: [
    { mark: "P", audience: "returner", status: "estimated", kicker: ruEn("Окупаемость провинции", "Province ROI"), title: ruEn("Почему дешёвое здание может оказаться дорогим решением", "Why a cheap building can be an expensive decision"), text: ruEn("Цена без срока окупаемости и задержки не показывает, от какой ранней армии ты отказываешься.", "Cost without horizon and delay misses the opportunity cost of an early army."), takeaway: ruEn("Сначала срок окупаемости, потом место в рейтинге.", "Payback turn before tier."), href: "#building-payback" },
    { mark: "A", audience: "casual", status: "estimated", kicker: ruEn("Финансы армии", "Army finance"), title: ruEn("Вторая армия: доступна сейчас, неустойчива потом", "The second army: affordable now, unsustainable later"), text: ruEn("Стоимость найма и содержание нужно проверять в одном расчёте движения казны.", "Recruitment cost and upkeep belong in one cash-flow test."), takeaway: ruEn("Проверяй остаток казны у цели.", "Check cash at target."), href: "#war-reserve" },
    { mark: "C", audience: "grinder", status: "estimated", kicker: ruEn("Захват", "Conquest"), title: ruEn("Когда разграбление выгоднее оккупации", "When sacking beats occupation"), text: ruEn("Короткий горизонт, высокий риск на границе и срочная потребность в золоте повышают ценность разовой добычи.", "A short horizon, high frontier risk and urgent liquidity raise payout value."), takeaway: ruEn("Используй один горизонт для обоих вариантов.", "Use one horizon for both options."), href: "#conquest-choice" },
    { mark: "¤", audience: "returner", status: "estimated", kicker: ruEn("Возвращение в кампанию", "Recovery"), title: ruEn("Пять цифр, которые нужно записать после перерыва", "Five numbers to record after a break"), text: ruEn("Размер казны, чистый доход, содержание, возможности найма и число активных фронтов.", "Treasury, net income, upkeep, recruitment capacity and active front count."), takeaway: ruEn("Сначала зафиксируй положение, потом действуй.", "Snapshot before action."), href: "#player-paths" },
    { mark: "AI", audience: "grinder", status: "verified", kicker: ruEn("Патч 8.1", "Patch 8.1"), title: ruEn("Как более активный ИИ поздней игры меняет резерв", "How a more active late-game AI changes the reserve"), text: ruEn("Долгую мирную окупаемость нужно проверять сценарием с неожиданным новым фронтом.", "Long peaceful payback needs a new-front stress case."), takeaway: ruEn("Проверка разных сценариев важнее одной красивой цифры.", "Sensitivity beats one number."), href: "#campaign-pulse" },
    { mark: "T", audience: "casual", status: "estimated", kicker: ruEn("План на ходы", "Turn plan"), title: ruEn("План на пять ходов для короткой сессии", "A five-turn plan for a short session"), text: ruEn("Одна цель, одно главное ограничение, понятная точка остановки и готовый следующий ход.", "One objective, one bottleneck, one stop condition and a prepared next move."), takeaway: ruEn("Меньше переключений, больше завершённых циклов.", "Less context, more completed loops."), href: "#player-paths" }
  ],
  methodology: {
    title: ruEn("Официальные изменения отдельно. Твои цифры отдельно.", "Official patch context on one layer. Your campaign values on another."),
    text: ruEn("Money Meta не выдаёт усреднённую экономику фракций за проверенный факт. Каждая модель начинается со значений конкретной кампании, которые можно изменить.", "Money Meta does not present a universal faction economy as verified fact. Every model starts with editable values from the actual campaign."),
    modelNote: ruEn("Все исходные значения в калькуляторах являются демонстрационными сценариями Money Meta, а не игровыми нормативами.", "Every calculator baseline is a Money Meta demonstration scenario with estimated status."),
    disclaimer: ruEn("Total War, Total War: Warhammer и связанные названия являются собственностью их правообладателей. Money Meta является независимым аналитическим продуктом.", "Total War, Total War: Warhammer and related names belong to their respective owners. Money Meta is an independent analytical product."),
    roadmap: ruEn("После пользовательской проверки добавим шаблоны фракций, снимки провинций и заметки по сохранениям.", "Next layer after user validation: faction presets, province snapshots and campaign save notes."),
    sources: [
      { label: ruEn("Creative Assembly · патч 8.1", "Creative Assembly · Patch 8.1"), url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101", note: ruEn("Текущая версия, поведение ИИ кампании, особые постройки и технологии.", "Current version, Campaign AI, landmarks and technologies.") },
      { label: ruEn("Creative Assembly · обновление 8.0", "Creative Assembly · Update 8.0"), url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/98-total-war-warhammer-iii-update-8-0-patch-notes", note: ruEn("Разделение военных и провинциальных технологий Катая, а также изменения роста.", "Cathay military/province tech split and growth context.") }
    ]
  }
};

export const crusaderKingsHub: StrategyHubData = {
  id: "ck3",
  slug: "crusader-kings-3",
  name: "Crusader Kings III",
  shortName: "CK3",
  publisher: "Paradox Interactive",
  worldCode: ruEn("КАЗНА ДИНАСТИИ / 1.19.0.6", "DYNASTY LEDGER / 1.19.0.6"),
  checkedAt: "2026-08-12",
  version: ruEn("1.19.0.6", "1.19.0.6"),
  currencyUnit: ruEn("зол.", "gold"),
  periodUnit: ruEn("мес.", "months"),
  meta: {
    title: ruEn("Экономика Crusader Kings III: домен, войны и наследование | Money Meta", "Crusader Kings III Economy Hub: domain, wars and succession | Money Meta"),
    description: ruEn("Интерактивный разбор экономики Crusader Kings III: путь золота, стили правления, изменения версии 1.19 и модели для зданий, военного резерва и наследования.", "An interactive Crusader Kings III economy with a gold map, ruler paths, Update 1.19 Pulse and models for buildings, war reserves and succession.")
  },
  hero: {
    live: ruEn("Версия 1.19.0.6 · проверено 2026-08-12", "Update 1.19.0.6 · checked 2026-08-12"),
    eyebrow: ruEn("Crusader Kings III · экономика династии", "Crusader Kings III · Dynasty Economy"),
    heading: ruEn("Ты управляешь не золотом. Ты финансируешь выживание династии.", "You do not manage gold. You finance the survival of a dynasty."),
    lede: ruEn("Свяжи доход домена, профессиональные полки, войны, активности и наследование. Смотри не только на месячный плюс, но и на казну, которую получит следующий правитель.", "Connect domain income, men-at-arms, wars, activities and succession. Read more than monthly profit: model the treasury the next ruler inherits."),
    primary: ruEn("Открыть карту династии", "Open the dynasty map"),
    secondary: ruEn("Проверить резерв наследника", "Test the succession buffer"),
    proof: [
      ["7", ruEn("звеньев золота", "gold links")],
      ["3", ruEn("пути правителя", "ruler paths")],
      ["3", ruEn("живые модели", "live models")],
      ["Q4", ruEn("следим за Silk & Silver", "Silk & Silver watch")]
    ],
    loadout: [
      { mark: "D", label: ruEn("ДОМЕН", "DOMAIN"), value: ruEn("Окупаемость зданий", "Building ROI") },
      { mark: "W", label: ruEn("ВОЙНА", "WAR"), value: ruEn("Запас казны", "Treasury runway") },
      { mark: "S", label: ruEn("НАСЛЕДОВАНИЕ", "SUCCESSION"), value: ruEn("Резерв наследника", "Heir buffer") },
      { mark: "T", label: ruEn("ТОРГОВЛЯ", "TRADE"), value: ruEn("Ждём в IV квартале", "Q4 watch") }
    ]
  },
  manifesto: {
    kicker: ruEn("Подход Money Meta · экономика династии", "Money Meta doctrine · dynasty edition"),
    title: ruEn("Богатое правление может оставить бедного наследника.", "A rich reign can leave a poor heir."),
    text: ruEn("Строительство, война и престижные активности конкурируют за одну казну, а наследование меняет момент, когда риск особенно опасен. Решение нужно оценивать и по финансам нынешнего правителя, и по устойчивости следующего.", "Buildings, war and prestige activities compete for one treasury, while succession changes risk timing. A decision is judged by current cash flow and the next ruler's resilience."),
    principles: [
      { title: ruEn("ДОМЕН", "DOMAIN"), text: ruEn("Ценность здания определяется приростом месячного дохода и сроком окупаемости.", "A building matters through marginal monthly income and payback.") },
      { title: ruEn("РЕЗЕРВ", "RESERVE"), text: ruEn("Перед войной проверь постоянные расходы, разовые затраты и неприкосновенный запас.", "A war starts after burn, one-off cost and emergency buffer are tested.") },
      { title: ruEn("НАСЛЕДОВАНИЕ", "SUCCESSION"), text: ruEn("Казна наследника является отдельной финансовой целью.", "The heir's treasury is a separate capital objective.") },
      { title: ruEn("СВОБОДА ДЕЙСТВИЙ", "OPTIONALITY"), text: ruEn("Золото покупает наёмников, подарки, активности и выход из кризиса.", "Gold buys mercenaries, gifts, activities and a way out of crisis.") }
    ]
  },
  economyNodes: [
    { id: "domain", code: "01", mark: "D", title: ruEn("Домен", "Domain"), phase: ruEn("Источник дохода", "Productive asset"), summary: ruEn("Личные владения создают самый управляемый слой ежемесячного дохода.", "Personal holdings create the most controllable layer of monthly income."), signal: ruEn("Доход владений", "Holding income"), decision: ruEn("Сравни прирост дохода от следующего здания со сроком его окупаемости.", "Compare the next building's marginal income with its payback."), href: "#domain-payback" },
    { id: "tax", code: "02", mark: "V", title: ruEn("Налоги", "Taxes"), phase: ruEn("Доход державы", "Realm flow"), summary: ruEn("Налоги вассалов зависят от устройства державы и хуже поддаются контролю, чем личный домен.", "Vassal taxes depend on realm structure and are less controllable than the personal domain."), signal: ruEn("Месячный приток", "Monthly inflow"), decision: ruEn("Не считай все источники дохода державы одинаково надёжными.", "Do not treat every layer of realm income as equally reliable."), href: "#economy-lenses" },
    { id: "treasury", code: "03", mark: "¤", title: ruEn("Казна", "Treasury"), phase: ruEn("Ликвидность", "Liquidity"), summary: ruEn("Золото в казне сохраняет варианты, которые нельзя быстро восстановить во время кризиса.", "Gold in the treasury preserves options that cannot be rebuilt quickly during a crisis."), signal: ruEn("Аварийный резерв", "Emergency buffer"), decision: ruEn("Задай нижнюю границу казны, которую не должны пробивать здания и активности.", "Set a floor that buildings and activities cannot cross."), href: "#succession-buffer" },
    { id: "building", code: "04", mark: "B", title: ruEn("Строительство", "Build"), phase: ruEn("Отложенный рост", "Delayed compounding"), summary: ruEn("Затраты на здание превращаются в ежемесячный доход только после завершения строительства.", "Building cost becomes monthly flow only after construction delay."), signal: ruEn("Месяцев до окупаемости", "Payback months"), decision: ruEn("Проверь, окупится ли здание до войны или вероятной передачи власти.", "Test whether the building pays back before war or the succession window."), href: "#domain-payback" },
    { id: "army", code: "05", mark: "W", title: ruEn("Армия", "Army"), phase: ruEn("Постоянные обязательства", "Recurring commitments"), summary: ruEn("Профессиональные полки и война превращают спокойный профицит в постоянный расход.", "Men-at-arms and war turn a calm surplus into burn."), signal: ruEn("На сколько хватит казны", "War runway"), decision: ruEn("Считай военные расходы и разовые затраты отдельно.", "Model wartime outflow and one-off cost separately."), href: "#war-chest" },
    { id: "prestige", code: "06", mark: "A", title: ruEn("Активности", "Activities"), phase: ruEn("Золото в влияние", "Gold into influence"), summary: ruEn("Пиры, туры и другие активности могут приносить неденежную пользу, но всё равно уменьшают запас золота.", "Feasts, tours and other activities can create non-cash return while consuming liquidity."), signal: ruEn("Цена упущенной возможности", "Opportunity cost"), decision: ruEn("Сравни активность с лучшим другим применением золота.", "Compare an activity with the best available use of gold."), href: "#decision-deck" },
    { id: "succession", code: "07", mark: "S", title: ruEn("Наследование", "Succession"), phase: ruEn("Передача системы", "System transfer"), summary: ruEn("Новый правитель получает казну вместе с возможными фракциями, войнами и расходами переходного периода.", "A new ruler inherits the treasury alongside possible factions, wars and transition costs."), signal: ruEn("Ликвидность наследника", "Heir liquidity"), decision: ruEn("Планируй резерв, который переживёт передачу власти.", "Plan a reserve that survives the transfer of power."), href: "#succession-buffer" }
  ],
  paths: [
    {
      id: "returner", mark: "R", label: ruEn("После перерыва", "Returner"), title: ruEn("Сначала вспомни обязательства державы, затем снимай игру с паузы", "Understand realm commitments before pressing Play"), summary: ruEn("Для старого сохранения: владения, наследование, фракции, войны и месячный баланс собираются в одну понятную картину.", "For an old save: holdings, succession, factions, wars and monthly flow become one snapshot."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("24 мес.", "24 months") }, { label: ruEn("Фокус", "Focus"), value: ruEn("стабильность", "stability") }, { label: ruEn("Резерв", "Reserve"), value: ruEn("250 золота", "250 gold") }],
      steps: [{ title: ruEn("Открой книгу учёта", "Open the Ledger"), text: ruEn("Сверь владения, доходы, расходы и военные потери до нового решения.", "Review holdings, income, expenses and war losses before a new decision.") }, { title: ruEn("Оцени близость наследования", "Find the succession window"), text: ruEn("Возраст, здоровье, наследник и фракции определяют срочность резерва.", "Age, health, heir and factions determine reserve urgency.") }, { title: ruEn("Сделай один безопасный ход", "Make one safe move"), text: ruEn("Вложение допустимо, только если после него остаётся аварийный резерв.", "An investment passes only when it leaves the emergency buffer.") }],
      flip: ruEn("Если наследование близко, ликвидность важнее здания с долгой окупаемостью.", "When succession is imminent, long building payback yields to liquidity."), href: "#succession-buffer"
    },
    {
      id: "casual", mark: "C", label: ruEn("Строитель династии", "Dynasty builder"), title: ruEn("Строй устойчивое ядро, а не самую большую державу", "Build a resilient core, not the largest realm"), summary: ruEn("Для спокойной кампании, где важны развитие домена, управляемые войны и чистая передача власти.", "For a calmer campaign focused on domain compounding, controllable wars and clean transfers of power."),
      constraints: [{ label: ruEn("Войны", "Wars"), value: ruEn("по резерву", "reserve-gated") }, { label: ruEn("Домен", "Domain"), value: ruEn("ядро", "core") }, { label: ruEn("Риск", "Risk"), value: ruEn("средний", "medium") }],
      steps: [{ title: ruEn("Укрепи основные владения", "Strengthen core holdings"), text: ruEn("Вкладывайся туда, что с высокой вероятностью останется у основной линии.", "Invest where the main line is likely to retain control.") }, { title: ruEn("Финансируй одну цель", "Fund one objective"), text: ruEn("Война или активность получают отдельный бюджет, а не всю казну.", "A war or activity receives a budget, not the whole treasury.") }, { title: ruEn("Передай резерв", "Transfer a buffer"), text: ruEn("Заверши правление с неприкосновенным запасом для наследника.", "End the reign with a cash floor for the heir.") }],
      flip: ruEn("Если наследник слаб или фракции набирают силу, целевой резерв нужно повысить.", "If the heir is weak or factions are growing, raise the reserve target."), href: "#domain-payback"
    },
    {
      id: "grinder", mark: "O", label: ruEn("Оптимизатор державы", "Realm optimizer"), title: ruEn("Управляй золотом с учётом войн и передачи власти", "Optimize gold around wars and transfers of power"), summary: ruEn("Для сложной империи с несколькими типами расходов, где казну нужно оценивать с поправкой на риск.", "For a complex empire with several spending layers where risk-adjusted treasury matters."),
      constraints: [{ label: ruEn("Горизонт", "Horizon"), value: ruEn("120 мес.", "120 months") }, { label: ruEn("Сценарии", "Cases"), value: ruEn("обычный + стрессовый", "base + stress") }, { label: ruEn("Резерв", "Reserve"), value: ruEn("динамический", "dynamic") }],
      steps: [{ title: ruEn("Раздели расходы по ситуациям", "Separate spending layers"), text: ruEn("Мир, война, активности и наследование должны иметь разные оценки расходов.", "Peace, war, activities and succession need separate outflow assumptions.") }, { title: ruEn("Считай прирост от следующего здания", "Model the marginal building"), text: ruEn("Следующий слот оценивается по приросту дохода, а не по общему доходу владения.", "Judge the next slot by income delta, not total holding income.") }, { title: ruEn("Проверь тяжёлое наследование", "Stress-test succession"), text: ruEn("Добавь войну с фракцией и расходы переходного периода в худший сценарий.", "Add a faction war and transition cost to the downside case.") }],
      flip: ruEn("Если худший сценарий съедает резерв, расширение нужно приостановить.", "When the downside case breaks the reserve, expansion pauses."), href: "#war-chest"
    }
  ],
  pulse: {
    title: ruEn("Версия 1.19 улучшила книгу учёта. В IV квартале 2026 года изменится сама торговля.", "Update 1.19 delivered a stronger Ledger. Q4 2026 will change trade itself."),
    text: ruEn("Здесь официальные обновления Paradox связаны с тем, что уже можно измерять и с чем нужно дождаться релиза.", "Pulse connects official Paradox updates with what can be measured now and what must wait for release."),
    changes: [
      { mark: "1.19", signal: ruEn("Проверено · актуальная версия", "Verified · live"), title: ruEn("Текущая версия 1.19.0.6", "Current version is 1.19.0.6"), summary: ruEn("Последнее исправление для актуальной версии опубликовано 25 мая 2026 года. Экономические модели привязаны к ветке 1.19, но значения в них вводит сам игрок.", "The latest live hotfix was published on May 25, 2026. The economy models are versioned to 1.19 while inputs remain user supplied."), decision: ruEn("Перед продолжением старого сохранения проверь версию игры и набор модификаций.", "Check version and mods before carrying an old save snapshot forward."), sourceLabel: ruEn("Paradox · версия 1.19.0.6", "Paradox · Update 1.19.0.6"), sourceUrl: "https://store.steampowered.com/news/app/1158310/view/677373278422041207" },
      { mark: "L", signal: ruEn("Проверено · версия 1.19", "Verified · Update 1.19"), title: ruEn("Книга учёта стала удобной точкой входа", "The Ledger became a practical starting point"), summary: ruEn("Версия 1.19 добавила военные потери, новые показатели владений и дополнительные действия в книге учёта.", "Update 1.19 added war losses and more values and actions for holdings in the Ledger."), decision: ruEn("Собери исходные данные из книги учёта до оценки здания или военного резерва.", "Build the baseline from the Ledger before evaluating a building or war reserve."), sourceLabel: ruEn("Paradox · версия 1.19 Scribe", "Paradox · 1.19 Scribe"), sourceUrl: "https://store.steampowered.com/news/app/1158310/view/552395313313219108" },
      { mark: "T", signal: ruEn("Проверено · релиз в IV квартале 2026", "Verified · coming Q4 2026"), title: ruEn("Silk & Silver добавит торговую экономику", "Silk & Silver will add a trade economy"), summary: ruEn("Paradox заявляет семьи торговцев, торговлю экзотическими товарами, конкуренцию республик и монополии на маршрутах.", "Paradox describes merchant families, exotic-goods trade, republic competition and route monopolies."), decision: ruEn("До релиза не выдумываем точные формулы торговли. Готовим структуру расчётов и обновим раздел после проверки в игре.", "No invented trade formulas before release. Prepare the framework and update the hub after live validation."), sourceLabel: ruEn("Paradox · глава V", "Paradox · Chapter V"), sourceUrl: "https://www.paradoxinteractive.com/games/crusader-kings-iii/add-ons/crusader-kings-iii-chapter-v" }
    ]
  },
  lenses: [
    {
      id: "small-realm", label: ruEn("Малая держава", "Small realm"), question: ruEn("Куда направить первые 600 золота?", "Where should the first 600 gold go?"), formula: ruEn("40% контроль · 35% окупаемость · 25% свобода действий", "40% control · 35% payback · 25% optionality"), note: ruEn("Точная очередь зданий зависит от типа владения, культуры, местности и того, как долго оно останется у твоей линии.", "Exact building order depends on holding, culture, terrain and ownership horizon."),
      cards: [
        { mark: "D", title: ruEn("Здание в основном домене", "Core domain building"), grade: "A", fit: 89, text: ruEn("Даёт регулярный доход во владении, которое планируется удерживать поколениями.", "Recurring income in a holding intended to stay with the line for generations."), metrics: [{ label: ruEn("Контроль", "Control"), value: ruEn("Высокий", "High") }, { label: ruEn("Окупаемость", "Payback"), value: ruEn("Измеримая", "Measurable") }] },
        { mark: "¤", title: ruEn("Резерв на наследование", "Succession reserve"), grade: "A", fit: 85, text: ruEn("Сохраняет возможность нанять наёмников, раздать подарки или выйти из кризиса фракций.", "Preserves mercenaries, gifts and an exit from a faction crisis."), metrics: [{ label: ruEn("Ликвидность", "Liquidity"), value: ruEn("Максимум", "Maximum") }, { label: ruEn("Доход", "Income"), value: ruEn("0", "0") }] },
        { mark: "A", title: ruEn("Престижная активность", "Prestige activity"), grade: "B", fit: 64, text: ruEn("Может принести большую неденежную пользу, но не должна съедать резерв.", "Can be strong on non-cash return without breaking the buffer."), metrics: [{ label: ruEn("Польза", "Utility"), value: ruEn("Зависит от ситуации", "Scenario-based") }, { label: ruEn("Ликвидность", "Liquidity"), value: ruEn("Низкая", "Low") }] }
      ]
    },
    {
      id: "pre-war", label: ruEn("Перед войной", "Pre-war"), question: ruEn("Что должно быть профинансировано до объявления?", "What must be funded before declaring?"), formula: ruEn("45% запас казны · 35% ценность цели · 20% худший исход", "45% runway · 35% objective value · 20% downside"), note: ruEn("Казус белли ещё не является финансовым планом. Начни с ожидаемой длительности войны и военных расходов.", "A casus belli is not a financial plan. Start with war duration and wartime outflow."),
      cards: [
        { mark: "W", title: ruEn("Военная казна", "War chest"), grade: "A", fit: 94, text: ruEn("Покрывает отрицательный баланс, подкрепления и ошибку в оценке длительности войны.", "Covers negative flow, reinforcement and duration error."), metrics: [{ label: ruEn("Запас", "Runway"), value: ruEn("24 мес.", "24 months") }, { label: ruEn("Резерв", "Buffer"), value: ruEn("Положительный", "Positive") }] },
        { mark: "M", title: ruEn("Возможности профессиональных полков", "Men-at-arms capacity"), grade: "A", fit: 81, text: ruEn("Дополнительная сила оправдана, если новый расход не уничтожает послевоенный резерв.", "Power works when new outflow does not destroy the post-war reserve."), metrics: [{ label: ruEn("Сила", "Power"), value: ruEn("Высокая", "High") }, { label: ruEn("Расход", "Burn"), value: ruEn("Постоянный", "Recurring") }] },
        { mark: "B", title: ruEn("Новое здание", "New building"), grade: "C", fit: 55, text: ruEn("Долгая окупаемость проигрывает срочной подготовке к войне.", "Long payback is weak before an immediate war window."), metrics: [{ label: ruEn("Окупаемость", "Payback"), value: ruEn("Позже", "Later") }, { label: ruEn("Темп", "Tempo"), value: ruEn("Низкий", "Low") }] }
      ]
    },
    {
      id: "succession", label: ruEn("Передача власти", "Succession"), question: ruEn("Что должен получить наследник кроме титула?", "What should the heir receive besides a title?"), formula: ruEn("50% ликвидность · 30% риск фракций · 20% регулярный профицит", "50% liquidity · 30% faction risk · 20% recurring surplus"), note: ruEn("Целевой резерв растёт, если наследник слаб, преемство оспаривается или идёт внешняя война.", "Raise the reserve target for a weak heir, disputed succession or external war."),
      cards: [
        { mark: "S", title: ruEn("Ликвидность наследника", "Heir liquidity"), grade: "A", fit: 96, text: ruEn("Позволяет реагировать, пока новый правитель ещё не восстановил контроль.", "Funds a response before the new ruler restores control."), metrics: [{ label: ruEn("Доступ", "Access"), value: ruEn("Сразу", "Immediate") }, { label: ruEn("Гибкость", "Flexibility"), value: ruEn("Максимум", "Maximum") }] },
        { mark: "D", title: ruEn("Устойчивый профицит домена", "Durable domain surplus"), grade: "A", fit: 87, text: ruEn("Снижает ежемесячную нагрузку после передачи власти.", "Reduces monthly burn after the transfer of power."), metrics: [{ label: ruEn("Поток", "Flow"), value: ruEn("Регулярный", "Recurring") }, { label: ruEn("Контроль", "Control"), value: ruEn("Высокий", "High") }] },
        { mark: "A", title: ruEn("Последняя дорогая активность", "One last expensive activity"), grade: "D", fit: 38, text: ruEn("Полезна только тогда, когда её польза выше ценности свободы действий, которую потеряет наследник.", "Works only when utility exceeds the heir's lost optionality."), metrics: [{ label: ruEn("Казна", "Cash"), value: ruEn("Отток", "Outflow") }, { label: ruEn("Риск", "Risk"), value: ruEn("Высокий", "High") }] }
      ]
    }
  ],
  scenarios: [
    { mark: "B", mode: ruEn("Окупаемость домена", "Domain ROI"), eyebrow: ruEn("120 месяцев", "120 months"), question: ruEn("Окупится ли следующее здание при этом правителе?", "Will the next building pay back during this reign?"), outcome: ruEn("Модель покажет доход с учётом риска, месяц окупаемости и доходность за выбранный срок.", "The model returns risk-adjusted income, payback month and horizon ROI."), href: "#domain-payback" },
    { mark: "W", mode: ruEn("Военная казна", "War chest"), eyebrow: ruEn("24 месяца", "24 months"), question: ruEn("Хватит ли казны на затяжную войну?", "Can the treasury fund a long war?"), outcome: ruEn("Военные расходы, разовые затраты и резерв объединяются в один расчёт движения казны.", "Wartime burn, one-off cost and reserve become one cash-flow test."), href: "#war-chest" },
    { mark: "S", mode: ruEn("Наследование", "Succession"), eyebrow: ruEn("18 месяцев", "18 months"), question: ruEn("Какой резерв на самом деле получит наследник?", "What buffer will the heir actually receive?"), outcome: ruEn("Расходы переходного периода и временный отток вычитаются до передачи власти.", "Transition cost and temporary outflow are deducted before the transfer."), href: "#succession-buffer" },
    { mark: "D", mode: ruEn("Риск потери владения", "Ownership risk"), eyebrow: ruEn("Раздел наследства", "Partition"), question: ruEn("Стоит ли строить там, что может уйти другой линии?", "Should I build where another line may inherit?"), outcome: ruEn("Поправка на риск уменьшит ценность здания без ложной точности.", "A risk haircut reduces building value without invented precision."), href: "#domain-payback" },
    { mark: "M", mode: ruEn("Содержание армии", "Army upkeep"), eyebrow: ruEn("Новый полк", "New regiment"), question: ruEn("Как расходы на новый профессиональный полк меняют запас казны?", "How does new men-at-arms outflow change runway?"), outcome: ruEn("Измени новый расход и сравни послевоенную казну с целевым резервом.", "Change new outflow and compare post-war cash with the reserve target."), href: "#war-chest" },
    { mark: "T", mode: ruEn("Будущая торговля", "Trade watch"), eyebrow: ruEn("IV квартал 2026", "Q4 2026"), question: ruEn("Что уже известно про Silk & Silver?", "What is already known about Silk & Silver?"), outcome: ruEn("Только подтверждённый объём изменений, без выдуманных формул до выхода дополнения.", "Confirmed scope only, with no invented formulas before live release."), href: "#dynasty-pulse" }
  ],
  models: [
    {
      id: "domain-payback", kind: "investment", mark: "D", kicker: ruEn("Модель 01 · вложение в домен", "Model 01 · domain capex"), title: ruEn("Окупаемость домена: сколько месяцев нужно зданию", "Domain Payback: how many months the building needs"), text: ruEn("Вводи только прирост месячного дохода от нового уровня, время строительства, срок владения и риск потерять этот поток.", "Enter only the new building level's marginal monthly income, construction delay, ownership horizon and flow-loss risk."), note: ruEn("Модель не оценивает военные модификаторы и другую неденежную пользу. Их нужно учитывать отдельно как экспертное суждение.", "The model does not price military modifiers or other non-cash utility. Keep them in a separate judgement layer."),
      inputs: [
        { key: "cost", label: ruEn("Стоимость, золото", "Cost, gold"), value: 600, min: 0, step: 25 },
        { key: "incomePerPeriod", label: ruEn("Новый доход / мес.", "New income / month"), value: 1.8, step: 0.1 },
        { key: "delayPeriods", label: ruEn("Строительство, мес.", "Construction, months"), value: 12, min: 0, step: 1 },
        { key: "horizonPeriods", label: ruEn("Срок владения, мес.", "Ownership horizon, months"), value: 120, min: 1, step: 6 },
        { key: "riskPercent", label: ruEn("Риск потери потока, %", "Flow-loss risk, %"), value: 10, min: 0, max: 100, step: 5 }
      ],
      results: [
        { key: "netValue", label: ruEn("Чистая ценность", "Net value"), format: "currency", accent: "positive" },
        { key: "paybackPeriods", label: ruEn("Окупаемость", "Payback"), format: "periods", accent: "primary" },
        { key: "roiPercent", label: ruEn("Доходность за период", "Horizon ROI"), format: "percent" },
        { key: "riskAdjustedIncome", label: ruEn("Доход с учётом риска", "Risk-adjusted income"), format: "currency" },
        { key: "grossValue", label: ruEn("Ценность до вычета стоимости", "Value before cost"), format: "currency" },
        { key: "activePeriods", label: ruEn("Активных месяцев", "Active months"), format: "periods" }
      ]
    },
    {
      id: "war-chest", kind: "reserve", mark: "W", kicker: ruEn("Модель 02 · деньги на войну", "Model 02 · war liquidity"), title: ruEn("Военная казна: переживут ли финансы выбранную войну", "War Chest: will the treasury survive the war"), text: ruEn("Отдели мирные расходы от новых военных, добавь разовые затраты и задай резерв, который нельзя тратить.", "Separate peaceful expenses from new wartime outflow, add one-off cost and set the reserve that cannot be spent."), note: ruEn("Если чистый баланс положительный, в рамках простой модели казна не иссякнет. Это всё равно не гарантирует победу.", "When net flow is positive, runway is infinite inside this simple model. That is not a guarantee of victory."),
      inputs: [
        { key: "treasury", label: ruEn("Казна, золото", "Treasury, gold"), value: 900, min: 0, step: 25 },
        { key: "incomePerPeriod", label: ruEn("Доход / мес.", "Income / month"), value: 22, step: 1 },
        { key: "currentOutflow", label: ruEn("Мирные расходы / мес.", "Peace expenses / month"), value: 8, min: 0, step: 1 },
        { key: "newOutflow", label: ruEn("Новые военные расходы / мес.", "New war outflow / month"), value: 18, min: 0, step: 1 },
        { key: "oneOffCost", label: ruEn("Разовые затраты", "One-off cost"), value: 150, min: 0, step: 25 },
        { key: "horizonPeriods", label: ruEn("Война, месяцев", "War duration, months"), value: 24, min: 1, step: 1 },
        { key: "reserve", label: ruEn("Неприкосновенный резерв", "Emergency reserve"), value: 250, min: 0, step: 25 }
      ],
      results: [
        { key: "cashAtTarget", label: ruEn("Казна после войны", "Post-war cash"), format: "currency", accent: "primary" },
        { key: "buffer", label: ruEn("Сверх резерва", "Above reserve"), format: "currency", accent: "positive" },
        { key: "netFlow", label: ruEn("Баланс на войне / мес.", "War net / month"), format: "currency" },
        { key: "safePeriods", label: ruEn("Месяцев до резерва", "Runway to reserve"), format: "periods" },
        { key: "maxSustainableOutflow", label: ruEn("Максимальный общий расход", "Max total outflow"), format: "currency" },
        { key: "coveragePercent", label: ruEn("Покрытие резерва", "Reserve coverage"), format: "percent" }
      ]
    },
    {
      id: "succession-buffer", kind: "reserve", mark: "S", kicker: ruEn("Модель 03 · устойчивость династии", "Model 03 · dynasty continuity"), title: ruEn("Резерв наследника: сколько ликвидности он получит", "Succession Buffer: how much liquidity the heir receives"), text: ruEn("Казна растёт на текущем чистом балансе, затем принимает на себя временные расходы переходного периода, разовую цену кризиса и обязательный резерв наследника.", "Treasury grows through current net flow, then absorbs transition outflow, one-off crisis cost and the required heir reserve."), note: ruEn("Новый расход здесь означает временную цену перехода: подарки, поднятые войска, наёмников или другой тяжёлый сценарий.", "New outflow is the temporary transition cost: gifts, raised forces, mercenaries or another stress case."),
      inputs: [
        { key: "treasury", label: ruEn("Казна сейчас, золото", "Treasury now, gold"), value: 800, min: 0, step: 25 },
        { key: "incomePerPeriod", label: ruEn("Доход / мес.", "Income / month"), value: 20, step: 1 },
        { key: "currentOutflow", label: ruEn("Обычные расходы / мес.", "Normal outflow / month"), value: 9, min: 0, step: 1 },
        { key: "newOutflow", label: ruEn("Расходы перехода / мес.", "Transition outflow / month"), value: 6, min: 0, step: 1 },
        { key: "oneOffCost", label: ruEn("Разовые расходы кризиса", "Crisis one-off cost"), value: 300, min: 0, step: 25 },
        { key: "horizonPeriods", label: ruEn("До стабилизации, мес.", "Months to stability"), value: 18, min: 1, step: 1 },
        { key: "reserve", label: ruEn("Целевой резерв наследника", "Heir reserve target"), value: 250, min: 0, step: 25 }
      ],
      results: [
        { key: "cashAtTarget", label: ruEn("Казна после перехода", "Post-transition cash"), format: "currency", accent: "primary" },
        { key: "buffer", label: ruEn("Запас наследника сверх цели", "Heir buffer"), format: "currency", accent: "positive" },
        { key: "netFlow", label: ruEn("Баланс перехода / мес.", "Transition net / month"), format: "currency" },
        { key: "safePeriods", label: ruEn("Месяцев до нижней границы", "Runway to floor"), format: "periods" },
        { key: "maxSustainableOutflow", label: ruEn("Максимальный общий расход", "Max total outflow"), format: "currency" },
        { key: "coveragePercent", label: ruEn("Покрытие резерва наследника", "Heir reserve coverage"), format: "percent" }
      ]
    }
  ],
  briefs: [
    { mark: "D", audience: "returner", status: "estimated", kicker: ruEn("Окупаемость домена", "Domain ROI"), title: ruEn("Почему общий доход владения не измеряет следующее здание", "Why total holding income does not price the next building"), text: ruEn("Решение создаёт только прирост дохода от нового уровня.", "The decision creates only the next level's marginal income."), takeaway: ruEn("Считай прирост, а не общую сумму.", "Model the delta, not the total."), href: "#domain-payback" },
    { mark: "W", audience: "casual", status: "estimated", kicker: ruEn("Финансы войны", "War finance"), title: ruEn("Казус белли без финансового плана", "A casus belli without a cash-flow plan"), text: ruEn("Длительность, военные расходы и резерв важнее суммы золота в момент объявления.", "Duration, wartime outflow and reserve matter more than gold at declaration."), takeaway: ruEn("Смотри на казну после войны, а не до неё.", "Cash after war, not before war."), href: "#war-chest" },
    { mark: "S", audience: "grinder", status: "estimated", kicker: ruEn("Наследование", "Succession"), title: ruEn("Казна как наследуемый защитный актив", "Treasury as an inherited defensive asset"), text: ruEn("Ликвидность покупает время, пока штраф за короткое правление и фракции ещё давят.", "Liquidity buys time while short reign and factions still apply pressure."), takeaway: ruEn("Резерв наследника является отдельной целью.", "The heir buffer is a separate objective."), href: "#succession-buffer" },
    { mark: "L", audience: "returner", status: "verified", kicker: ruEn("Версия 1.19", "Update 1.19"), title: ruEn("Книга учёта: сводка державы за 60 секунд", "The Ledger as a 60-second realm snapshot"), text: ruEn("Владения, их показатели и военные потери дают хорошую точку входа после перерыва.", "Holdings, values and war losses create a starting point after a break."), takeaway: ruEn("Сначала данные, затем действие.", "Data before action."), href: "#dynasty-pulse" },
    { mark: "T", audience: "grinder", status: "verified", kicker: ruEn("Silk & Silver", "Silk & Silver"), title: ruEn("Что мы не будем придумывать до IV квартала", "What we will not invent before Q4"), text: ruEn("Торговые пути и монополии подтверждены, но точных доходов и формул ещё нет.", "Trade routes and monopolies are confirmed; exact income and formulas are not."), takeaway: ruEn("Объём изменений подтверждён, механики ещё ждём.", "Scope verified, mechanics pending."), href: "#dynasty-pulse" },
    { mark: "A", audience: "casual", status: "estimated", kicker: ruEn("Цена упущенной возможности", "Opportunity cost"), title: ruEn("Когда активность стоит дороже своей цены", "When an activity costs more than its price tag"), text: ruEn("Потраченное золото может лишить наследника аварийного выхода в момент передачи власти.", "Spent gold can remove an emergency option from the succession window."), takeaway: ruEn("Сравни пользу со стоимостью потерянной свободы действий.", "Compare utility with lost optionality."), href: "#economy-lenses" }
  ],
  methodology: {
    title: ruEn("Официальные данные о версии отдельно. Допущения по державе отдельно.", "Verified release context on one layer. Realm assumptions on another."),
    text: ruEn("Money Meta связывает официальные изменения Paradox с решениями игрока, но не выдаёт пользовательские доходы, расходы или оценки риска за данные издателя.", "Money Meta connects official Paradox changes to player decisions without presenting user income, costs or risk as publisher data."),
    modelNote: ruEn("Исходные числа в моделях являются демонстрационными сценариями. Замени их значениями из книги учёта и экранов своих владений.", "Model baselines are demonstration scenarios. Replace them with values from your Ledger and holding screens."),
    disclaimer: ruEn("Crusader Kings и связанные названия являются собственностью Paradox Interactive. Money Meta является независимым аналитическим продуктом.", "Crusader Kings and related names are property of Paradox Interactive. Money Meta is an independent analytical product."),
    roadmap: ruEn("После выхода Silk & Silver и проверки в игре добавим окупаемость торговых путей, портфель торговца и модели конкуренции республик.", "After Silk & Silver and live validation, add trade-route ROI, merchant portfolio and republic competition models."),
    sources: [
      { label: ruEn("Paradox · версия 1.19.0.6", "Paradox · Update 1.19.0.6"), url: "https://store.steampowered.com/news/app/1158310/view/677373278422041207", note: ruEn("Актуальная версия на дату проверки.", "Current live version on the checked date.") },
      { label: ruEn("Paradox · версия 1.19 Scribe", "Paradox · 1.19 Scribe"), url: "https://store.steampowered.com/news/app/1158310/view/552395313313219108", note: ruEn("Изменения книги учёта, сведения о военных потерях и интерфейсе.", "Ledger, war losses and UI context.") },
      { label: ruEn("Paradox · глава V", "Paradox · Chapter V"), url: "https://www.paradoxinteractive.com/games/crusader-kings-iii/add-ons/crusader-kings-iii-chapter-v", note: ruEn("Официально заявленные возможности Silk & Silver и окно выхода в IV квартале 2026 года.", "Official Silk & Silver scope and Q4 2026 window.") }
    ]
  }
};
