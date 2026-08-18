import type { WowLocale } from "./wow-economy";
import type { WowMarketRouteMetrics, WowRankingLens } from "../lib/wow-economy";

type Localized = Record<WowLocale, string>;

export type WowMarkTone = "arcane" | "nature" | "ember" | "gold" | "void" | "frost";

export interface WowMarketMark {
  glyph: string;
  code: Localized;
  tone: WowMarkTone;
  label: Localized;
}

export const wowMarks = {
  gather: { glyph: "✦", code: { ru: "МАТ", en: "MAT" }, tone: "nature", label: { ru: "Материалы", en: "Materials" } },
  capital: { glyph: "◇", code: { ru: "КАП", en: "CAP" }, tone: "gold", label: { ru: "Капитал", en: "Capital" } },
  knowledge: { glyph: "⌁", code: { ru: "ЗН", en: "KNO" }, tone: "arcane", label: { ru: "Знания профессии", en: "Profession knowledge" } },
  craft: { glyph: "◆", code: { ru: "ИЗГ", en: "CRF" }, tone: "ember", label: { ru: "Производство", en: "Crafting" } },
  orders: { glyph: "◎", code: { ru: "ЗАК", en: "ORD" }, tone: "frost", label: { ru: "Заказы", en: "Orders" } },
  market: { glyph: "◈", code: { ru: "АУК", en: "AH" }, tone: "arcane", label: { ru: "Аукцион", en: "Auction House" } },
  liquidity: { glyph: "◒", code: { ru: "ЛИК", en: "LIQ" }, tone: "void", label: { ru: "Ликвидность", en: "Liquidity" } },
  reinvest: { glyph: "↻", code: { ru: "ОБР", en: "ROI" }, tone: "gold", label: { ru: "Реинвестирование", en: "Reinvestment" } },
  consumable: { glyph: "✧", code: { ru: "РАС", en: "CON" }, tone: "ember", label: { ru: "Расходники", en: "Consumables" } },
  decor: { glyph: "⬡", code: { ru: "ДЕК", en: "DEC" }, tone: "void", label: { ru: "Декор", en: "Decor" } }
} satisfies Record<string, WowMarketMark>;

export interface WowEconomyNode {
  code: string;
  title: Localized;
  phase: Localized;
  summary: Localized;
  decision: Localized;
  signal: Localized;
  href: string;
  mark: WowMarketMark;
}

export const wowEconomyNodes: WowEconomyNode[] = [
  {
    code: "01",
    title: { ru: "Поток материалов", en: "Material flow" },
    phase: { ru: "добыть или купить", en: "gather or buy" },
    summary: {
      ru: "Материалы поступают через личный фарм, аукцион или заказчика. Даже самостоятельно добытый ресурс имеет рыночную стоимость.",
      en: "Reagents enter through personal gathering, the Auction House or the customer. A self-farmed material still carries a market opportunity cost."
    },
    decision: {
      ru: "Сравни реальный доход от фарма в час с ценой покупки. Не считай собственные материалы бесплатными при расчёте маржи.",
      en: "Compare effective gathering GPH with the purchase price. Never treat self-farmed reagents as free inside crafting margin."
    },
    signal: { ru: "цена покупки против реального дохода в час", en: "buy price vs effective GPH" },
    href: "#farm-liquidity",
    mark: wowMarks.gather
  },
  {
    code: "02",
    title: { ru: "Оборотный капитал", en: "Working capital" },
    phase: { ru: "золото становится товаром", en: "gold becomes inventory" },
    summary: {
      ru: "Покупка большой партии превращает ликвидное золото в товар. Пока он не продан, финансировать следующий рыночный ход нечем.",
      en: "A large batch converts liquid gold into stock. Until it sells, the next market move has no funding."
    },
    decision: {
      ru: "Ограничь партию объёмом, который рынок способен поглотить за выбранный цикл продаж.",
      en: "Cap the batch at the volume the market can absorb within the chosen listing cycle."
    },
    signal: { ru: "капитал под риском", en: "capital at risk" },
    href: "#crafting-margin",
    mark: wowMarks.capital
  },
  {
    code: "03",
    title: { ru: "Специализация", en: "Specialization" },
    phase: { ru: "распределение знаний", en: "knowledge allocation" },
    summary: {
      ru: "Знания профессии создают производственное преимущество. Но узкая специализация полезна только там, где есть повторяемый спрос.",
      en: "Profession Knowledge creates a production moat, but narrow specialization matters only where repeat demand exists."
    },
    decision: {
      ru: "Перед сбросом выбери рыночную роль: массовый товар, дорогие заказы или собственная цепочка поставок.",
      en: "Before a reset, choose a market role: mass goods, high-value orders or your own supply chain."
    },
    signal: { ru: "знания → доступ к рынку", en: "knowledge → market access" },
    href: "#player-paths",
    mark: wowMarks.knowledge
  },
  {
    code: "04",
    title: { ru: "Изготовление", en: "Craft conversion" },
    phase: { ru: "материалы → товар", en: "reagents → output" },
    summary: {
      ru: "Рецепт создаёт ценность только после учёта материалов, комиссии, неудачных размещений и реальной вероятности продажи.",
      en: "A recipe creates value only after materials, fees, failed listings and the actual probability of a sale."
    },
    decision: {
      ru: "Проверь цену безубыточности и ожидаемую прибыль до изготовления партии. Положительная разница до комиссии аукциона ещё не является прибылью.",
      en: "Check break-even and expected profit before batching. A positive pre-fee spread is not profit."
    },
    signal: { ru: "ожидаемая маржа за цикл", en: "expected margin / cycle" },
    href: "#crafting-margin",
    mark: wowMarks.craft
  },
  {
    code: "05",
    title: { ru: "Канал реализации", en: "Sale channel" },
    phase: { ru: "аукцион или заказ", en: "AH or order" },
    summary: {
      ru: "Аукцион продаёт товар рынку. Заказ на изготовление продаёт конкретному клиенту доступ к твоему навыку и времени.",
      en: "The Auction House sells an item to the market. A Crafting Order sells skill access and execution to a specific customer."
    },
    decision: {
      ru: "Выбери канал, где твоё преимущество приносит деньги: ликвидная партия или комиссия выше минимально разумного уровня.",
      en: "Choose the channel that monetizes your edge: a liquid batch or a commission above its economic floor."
    },
    signal: { ru: "вероятность продажи или комиссия", en: "sell-through or commission" },
    href: "#order-floor",
    mark: wowMarks.orders
  },
  {
    code: "06",
    title: { ru: "Ликвидность рынка", en: "Market liquidity" },
    phase: { ru: "цена выставления → золото", en: "listed value → gold" },
    summary: {
      ru: "Высокая цена бесполезна без покупателя. Доля продаж, повторные размещения и снижение цены определяют, какая часть товара станет золотом.",
      en: "A high price is useless without a buyer. Sell-through, relisting and markdown determine how much inventory becomes cash."
    },
    decision: {
      ru: "Считай реальный доход в час и долю товара, которая действительно превращается в золото. Доход по цене аукциона используй только как верхнюю границу.",
      en: "Use effective GPH and monetization rate. Treat listed GPH only as an upper bound."
    },
    signal: { ru: "полученное золото / цена выставления", en: "cash / listed value" },
    href: "#farm-liquidity",
    mark: wowMarks.liquidity
  },
  {
    code: "07",
    title: { ru: "Реинвестирование", en: "Reinvestment" },
    phase: { ru: "золото → следующий цикл", en: "cash → next cycle" },
    summary: {
      ru: "Полученная прибыль финансирует следующую партию, инструменты или новую специализацию. Непроданный товар нельзя автоматически масштабировать.",
      en: "Realized profit funds the next batch, tools or specialization. Unsold stock should never be scaled automatically."
    },
    decision: {
      ru: "Увеличивай объём только после подтверждённых продаж. Рост запасов без притока золота является сигналом остановиться.",
      en: "Scale only after confirmed sell-through. Rising inventory without cash conversion is a stop signal."
    },
    signal: { ru: "полученная прибыль → рост", en: "realized profit → scale" },
    href: "#market-rankings",
    mark: wowMarks.reinvest
  }
];

export interface WowPlayerPath {
  id: "returner" | "casual" | "operator";
  label: Localized;
  summary: Localized;
  title: Localized;
  mark: WowMarketMark;
  capital: Localized;
  time: Localized;
  complexity: Localized;
  steps: Array<{ title: Localized; text: Localized }>;
  flipCondition: Localized;
  href: Record<WowLocale, string>;
}

export const wowPlayerPaths: WowPlayerPath[] = [
  {
    id: "returner",
    label: { ru: "Вернулся в Retail", en: "Retail returner" },
    summary: { ru: "Сначала восстановить понимание рынка, потом выбирать профессию.", en: "Rebuild the market map before choosing a profession." },
    title: { ru: "За один вечер пойми, где твой старый план профессии больше не работает", en: "Use one evening to find where the old profession plan stopped working" },
    mark: wowMarks.knowledge,
    capital: { ru: "до 25 тыс.", en: "up to 25k" },
    time: { ru: "2-4 ч / нед.", en: "2-4 h / week" },
    complexity: { ru: "низкая", en: "low" },
    steps: [
      { title: { ru: "Проведи ревизию товаров", en: "Audit inventory" }, text: { ru: "Раздели запасы на ликвидные массовые товары, старые материалы и позиции без понятного спроса.", en: "Separate liquid commodities, legacy materials and goods with no visible demand." } },
      { title: { ru: "Выбери одну роль на рынке", en: "Choose one market role" }, text: { ru: "Сбор материалов, массовое производство или заказы. Не распределяй знания до выбора роли.", en: "Gathering, mass crafting or orders. Do not allocate Knowledge before choosing the role." } },
      { title: { ru: "Проверь продажи", en: "Verify cash conversion" }, text: { ru: "Сделай маленькую партию и измерь долю продаж до масштабирования.", en: "Run a small batch and measure sell-through before scaling." } }
    ],
    flipCondition: { ru: "Если старые рецепты сохраняют устойчивый спрос и положительную ожидаемую маржу, сброс не обязателен.", en: "If old recipes still have repeat demand and positive expected margin, a reset is not automatically necessary." },
    href: { ru: "/wow/#market-pulse", en: "/en/wow/#market-pulse" }
  },
  {
    id: "casual",
    label: { ru: "Мало времени", en: "Limited time" },
    summary: { ru: "Ликвидность и короткий цикл важнее максимальной теоретической прибыли.", en: "Liquidity and short cycles beat maximum theoretical profit." },
    title: { ru: "Пусть рынок работает быстрее, чем заполняются твои сумки", en: "Make the market work faster than your bags fill up" },
    mark: wowMarks.market,
    capital: { ru: "25-100 тыс.", en: "25k-100k" },
    time: { ru: "3-6 ч / нед.", en: "3-6 h / week" },
    complexity: { ru: "средняя", en: "medium" },
    steps: [
      { title: { ru: "Сначала продай", en: "Sell first" }, text: { ru: "Перед новой сессией посмотри, сколько товара с прошлого раза действительно стало золотом.", en: "Before another session, check how much previous inventory actually became gold." } },
      { title: { ru: "Сократи партию", en: "Cut the batch" }, text: { ru: "Пусть один цикл размещения проверяет спрос, а не замораживает весь банк.", en: "Let one listing cycle test demand instead of freezing the whole bank." } },
      { title: { ru: "Считай реальный доход в час", en: "Use effective GPH" }, text: { ru: "Цена на аукционе без учёта вероятности продажи не должна определять выбор фарма.", en: "An AH price without sell-through should not decide what to farm." } }
    ],
    flipCondition: { ru: "Если товар продаётся быстро и почти полностью, можно увеличить партию до следующего разумного предела.", en: "When nearly all volume sells quickly, scale the batch to the next liquidity threshold." },
    href: { ru: "/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=65#farm-liquidity", en: "/en/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=65#farm-liquidity" }
  },
  {
    id: "operator",
    label: { ru: "Опытный торговец", en: "Market operator" },
    summary: { ru: "Управляет несколькими циклами и ищет устойчивое преимущество.", en: "Runs several loops and looks for repeatable edge." },
    title: { ru: "Раздели прибыль, товары и капитал профессии на три разных баланса", en: "Keep profit, inventory and profession capital in three separate ledgers" },
    mark: wowMarks.capital,
    capital: { ru: "от 100 тыс.", en: "100k+" },
    time: { ru: "8+ ч / нед.", en: "8+ h / week" },
    complexity: { ru: "высокая", en: "high" },
    steps: [
      { title: { ru: "Раздели каналы", en: "Segment channels" }, text: { ru: "Партии для аукциона, личные заказы и сбор материалов должны иметь отдельные расчёты.", en: "AH batches, personal orders and gathering need separate unit economics." } },
      { title: { ru: "Определи минимум", en: "Set the floor" }, text: { ru: "Комиссия за заказ должна покрывать материалы, запас на повторное изготовление и стоимость времени.", en: "An order commission must cover materials, recraft reserve and time cost." } },
      { title: { ru: "Масштабируй подтверждённое преимущество", en: "Scale realized edge" }, text: { ru: "Увеличивай капитал только там, где несколько циклов уже подтвердили приток золота.", en: "Increase capital only where several cycles have confirmed cash conversion." } }
    ],
    flipCondition: { ru: "Если запасы растут быстрее продаж, останови производство даже при положительной расчётной марже.", en: "If inventory grows faster than sales, stop production even when headline margin is positive." },
    href: { ru: "/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180#order-floor", en: "/en/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180#order-floor" }
  }
];

export const wowPulse = {
  release: "Curse of Ula’tek",
  checkedAt: "2026-08-18",
  staleAfterDays: 30,
  sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek",
  status: "verified" as const,
  changes: [
    {
      signal: { ru: "1 сброс на профессию", en: "1 reset / profession" },
      title: { ru: "Знания профессии можно перераспределить", en: "Profession Knowledge can be reallocated" },
      summary: { ru: "Curse of Ula’tek добавляет один сброс потраченных очков знаний для каждой профессии.", en: "Curse of Ula’tek adds one reset of spent Knowledge Points for each profession." },
      decision: { ru: "Не сбрасывай знания до выбора рыночной роли и проверки спроса. Это редкая возможность перераспределить капитал, а не бесплатный эксперимент.", en: "Do not reset before choosing a market role and demand signals. This is a scarce capital-allocation option, not a free experiment." },
      mark: wowMarks.knowledge,
      sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek"
    },
    {
      signal: { ru: "декор стал дешевле", en: "lower decor costs" },
      title: { ru: "Большинство предметов декора Midnight стало дешевле изготавливать", en: "Most Midnight decor became cheaper to craft" },
      summary: { ru: "Blizzard снизила стоимость большинства создаваемых предметов декора для жилищ. Старые исходные затраты больше нельзя переносить автоматически.", en: "Blizzard reduced the cost of most crafted Housing decor. Old cost baselines cannot be carried forward automatically." },
      decision: { ru: "Пересчитай стоимость материалов, цену безубыточности и размер партии. Более дешёвое изготовление может одновременно увеличить предложение и сократить маржу.", en: "Recalculate material cost, break-even and batch size. Cheaper crafting can raise supply and compress margin at the same time." },
      mark: wowMarks.decor,
      sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek"
    },
    {
      signal: { ru: "фильтры сохраняются", en: "persistent AH filters" },
      title: { ru: "Аукцион сохраняет фильтры", en: "Auction House filters now persist" },
      summary: { ru: "Фильтры сохраняются после закрытия аукциона. Это упрощает работу, но не меняет рыночную маржу.", en: "Filters persist after closing the AH. This lowers operating friction but does not change market margin." },
      decision: { ru: "Используй сохранённые наборы поиска для повторяемого анализа, но не учитывай удобство как прибыль в золоте.", en: "Use saved search sets for repeatable scanning, but do not count convenience as gold profit." },
      mark: wowMarks.market,
      sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek"
    }
  ]
};

export interface WowMarketRoute {
  id: string;
  title: Localized;
  summary: Localized;
  mark: WowMarketMark;
  metrics: WowMarketRouteMetrics;
}

export const wowMarketRoutes: WowMarketRoute[] = [
  { id: "gathering", title: { ru: "Региональные массовые товары", en: "Regional commodities" }, summary: { ru: "Собирай ликвидные материалы и оценивай их через реальный доход в час, а не по красивой цене на аукционе.", en: "Gather liquid materials and value them through effective GPH, not the AH sticker price." }, mark: wowMarks.gather, metrics: { capitalAccess: 9, liquidity: 8, timeFit: 7, specializationMoat: 3, priceResilience: 6, lowFriction: 7 } },
  { id: "commodity-craft", title: { ru: "Переработка массовых материалов", en: "Commodity conversion" }, summary: { ru: "Превращай материалы в массовый товар только при положительной марже после комиссии и подтверждённом объёме продаж.", en: "Convert reagents into mass output only with positive post-fee margin and confirmed volume." }, mark: wowMarks.craft, metrics: { capitalAccess: 6, liquidity: 9, timeFit: 7, specializationMoat: 6, priceResilience: 5, lowFriction: 6 } },
  { id: "consumables", title: { ru: "Партии расходников", en: "Consumable batches" }, summary: { ru: "Повторяемый спрос может быть сильным, но конкуренция и давление на цены требуют короткого цикла продаж.", en: "Repeat demand can be strong, but competition and price compression require a short inventory cycle." }, mark: wowMarks.consumable, metrics: { capitalAccess: 5, liquidity: 9, timeFit: 6, specializationMoat: 7, priceResilience: 6, lowFriction: 5 } },
  { id: "orders", title: { ru: "Заказы на изготовление", en: "Crafting Orders" }, summary: { ru: "Зарабатывай на доступе к навыку через обоснованную комиссию, не замораживая большую партию на открытом рынке.", en: "Monetize skill access through a commission floor without freezing a large open-market batch." }, mark: wowMarks.orders, metrics: { capitalAccess: 8, liquidity: 7, timeFit: 8, specializationMoat: 9, priceResilience: 8, lowFriction: 6 } },
  { id: "intermediates", title: { ru: "Специализированные полуфабрикаты", en: "Specialized intermediates" }, summary: { ru: "Поставляй другим мастерам узкое звено цепочки производства, где специализация снижает прямую конкуренцию.", en: "Supply a narrow link in another crafter's chain where profession edge reduces direct competition." }, mark: wowMarks.capital, metrics: { capitalAccess: 5, liquidity: 8, timeFit: 6, specializationMoat: 8, priceResilience: 7, lowFriction: 5 } },
  { id: "decor", title: { ru: "Декор и коллекционные предметы", en: "Decor and collectibles" }, summary: { ru: "Высокая потенциальная наценка сопровождается медленными продажами и большим риском зависшего товара.", en: "High potential markup comes with slow sell-through and a larger risk of stranded stock." }, mark: wowMarks.decor, metrics: { capitalAccess: 4, liquidity: 3, timeFit: 5, specializationMoat: 7, priceResilience: 4, lowFriction: 4 } }
];

const weights = (values: [number, number, number, number, number, number]): WowRankingLens["weights"] => ({
  capitalAccess: values[0], liquidity: values[1], timeFit: values[2], specializationMoat: values[3], priceResilience: values[4], lowFriction: values[5]
});

export const wowRankingLenses: Array<WowRankingLens & { label: Localized; question: Localized; formula: Localized; note: Localized }> = [
  { id: "returner", label: { ru: "Вернуться без ошибки", en: "Return safely" }, question: { ru: "Какой маршрут проще проверить небольшим капиталом?", en: "Which route is easiest to validate with limited capital?" }, formula: { ru: "25% доступность · 25% ликвидность · 15% время · 15% устойчивость · 15% простота · 5% специализация", en: "25% access · 25% liquidity · 15% time · 15% resilience · 15% low friction · 5% moat" }, note: { ru: "Оценка показывает доступность и проверяемость маршрута, но не обещает конкретный доход в час. Реальные цены вводятся в калькуляторах.", en: "The score measures access and testability, not promised gold/hour. Actual prices belong in the calculators." }, weights: weights([25, 25, 15, 5, 15, 15]) },
  { id: "limited-time", label: { ru: "Мало времени", en: "Limited time" }, question: { ru: "Где быстрее получить золото при коротких сессиях?", en: "Where is cash conversion fastest in short sessions?" }, formula: { ru: "30% время · 25% ликвидность · 15% простота · 10% доступность · 10% специализация · 10% устойчивость", en: "30% time · 25% liquidity · 15% low friction · 10% access · 10% moat · 10% resilience" }, note: { ru: "Высокая теоретическая маржа проигрывает, если товар требует постоянного повторного размещения или долгого поиска клиента.", en: "High theoretical margin loses when an item needs constant relisting or a long customer search." }, weights: weights([10, 25, 30, 10, 10, 15]) },
  { id: "specialist", label: { ru: "Защитить преимущество", en: "Build a moat" }, question: { ru: "Где знания и повторяемый процесс лучше защищают преимущество?", en: "Where do Knowledge and repeatable process protect the edge?" }, formula: { ru: "35% специализация · 25% устойчивость · 15% ликвидность · 10% время · 10% простота · 5% доступность", en: "35% moat · 25% resilience · 15% liquidity · 10% time · 10% low friction · 5% access" }, note: { ru: "Специализация без спроса не создаёт преимущества. Перед распределением знаний нужен реальный поток заказов или история устойчивых продаж.", en: "Specialization without demand is not a moat. Knowledge allocation needs real order flow or a repeat sell-through history." }, weights: weights([5, 15, 10, 35, 25, 10]) }
];

export type WowScenarioKind = "craft" | "farm" | "order" | "allocation" | "event";

export const wowScenarios: Array<{
  id: string;
  kind: WowScenarioKind;
  featured: boolean;
  mark: WowMarketMark;
  title: Localized;
  text: Localized;
  href: Record<WowLocale, string>;
}> = [
  { id: "craft-liquid", kind: "craft", featured: true, mark: wowMarks.craft, title: { ru: "Рецепт продаётся в 70% циклов", en: "The recipe sells in 70% of cycles" }, text: { ru: "Проверь маржу после комиссии, цену безубыточности и капитал под риском для партии из 20 изделий.", en: "Test post-fee margin, break-even and capital at risk for a 20-craft batch." }, href: { ru: "/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=225&wow-crafting.craft-sellthrough=70&wow-crafting.craft-count=20#crafting-margin", en: "/en/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=225&wow-crafting.craft-sellthrough=70&wow-crafting.craft-count=20#crafting-margin" } },
  { id: "craft-thin", kind: "craft", featured: false, mark: wowMarks.decor, title: { ru: "Цена упала на 20% после роста предложения", en: "Price fell 20% after new supply" }, text: { ru: "Увидишь, когда положительная разница в цене превращается в отрицательную ожидаемую маржу.", en: "See when a positive spread turns into negative expected margin." }, href: { ru: "/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=180&wow-crafting.craft-sellthrough=55&wow-crafting.craft-count=20#crafting-margin", en: "/en/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=180&wow-crafting.craft-sellthrough=55&wow-crafting.craft-count=20#crafting-margin" } },
  { id: "farm-liquid", kind: "farm", featured: false, mark: wowMarks.gather, title: { ru: "Ликвидный фарм материалов", en: "A liquid material farm" }, text: { ru: "Сравни 3 420 золота в час по цене аукциона с золотом, которое действительно проходит через рынок.", en: "Compare 3,420 listed GPH with the gold that actually clears the market." }, href: { ru: "/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=75&wow-farm.farm-session=2#farm-liquidity", en: "/en/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=75&wow-farm.farm-session=2#farm-liquidity" } },
  { id: "farm-trap", kind: "farm", featured: false, mark: wowMarks.liquidity, title: { ru: "Дорогой товар продаётся только на 25%", en: "An expensive item sells only 25%" }, text: { ru: "Проверь долю превращения в золото и объём товара, который останется после длинной сессии.", en: "Test monetization rate and the inventory left after a long session." }, href: { ru: "/wow/?wow-farm.farm-units=40&wow-farm.farm-price=120&wow-farm.farm-sellthrough=25&wow-farm.farm-session=3#farm-liquidity", en: "/en/wow/?wow-farm.farm-units=40&wow-farm.farm-price=120&wow-farm.farm-sellthrough=25&wow-farm.farm-session=3#farm-liquidity" } },
  { id: "order-accept", kind: "order", featured: true, mark: wowMarks.orders, title: { ru: "Комиссия покрывает навык и время", en: "Commission covers skill and time" }, text: { ru: "Сравни 2 500 золота за заказ с материалами, запасом на повторное изготовление и своим целевым доходом в час.", en: "2,500 gold per order against materials, recraft reserve and your target GPH." }, href: { ru: "/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180&wow-order.order-minutes=6&wow-order.order-target-gph=8000#order-floor", en: "/en/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180&wow-order.order-minutes=6&wow-order.order-target-gph=8000#order-floor" } },
  { id: "order-decline", kind: "order", featured: false, mark: wowMarks.capital, title: { ru: "Большое вознаграждение, но дорогие материалы исполнителя", en: "A large tip with expensive crafter reagents" }, text: { ru: "Заявленная комиссия может оказаться ниже минимально разумного уровня после учёта материалов и времени.", en: "Headline commission can fall below the economic floor after materials and time." }, href: { ru: "/wow/?wow-order.order-commission=1800&wow-order.order-materials=900&wow-order.order-recraft=250&wow-order.order-minutes=8&wow-order.order-target-gph=7000#order-floor", en: "/en/wow/?wow-order.order-commission=1800&wow-order.order-materials=900&wow-order.order-recraft=250&wow-order.order-minutes=8&wow-order.order-target-gph=7000#order-floor" } },
  { id: "knowledge-reset", kind: "allocation", featured: false, mark: wowMarks.knowledge, title: { ru: "Стоит ли сбрасывать знания профессии сейчас?", en: "Should the profession reset be used now?" }, text: { ru: "Сначала выбери рыночную роль, проверь спрос и сделай тестовую партию. Только затем меняй распределение знаний.", en: "Choose a market role, demand proof and a test batch before changing Knowledge allocation." }, href: { ru: "/wow/#player-paths", en: "/en/wow/#player-paths" } },
  { id: "season-window", kind: "event", featured: false, mark: wowMarks.reinvest, title: { ru: "Новый сезон меняет спрос, но не гарантирует маржу", en: "A new season changes demand, not guaranteed margin" }, text: { ru: "Используй маленькую пробную партию и увеличивай объём только после первых подтверждённых продаж.", en: "Use a small discovery batch and scale only after the first confirmed sell-through." }, href: { ru: "/wow/#market-pulse", en: "/en/wow/#market-pulse" } }
];
