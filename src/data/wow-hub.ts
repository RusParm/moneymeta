import type { WowLocale } from "./wow-economy";
import type { WowMarketRouteMetrics, WowRankingLens } from "../lib/wow-economy";

type Localized = Record<WowLocale, string>;

export type WowMarkTone = "arcane" | "nature" | "ember" | "gold" | "void" | "frost";

export interface WowMarketMark {
  glyph: string;
  code: string;
  tone: WowMarkTone;
  label: Localized;
}

export const wowMarks = {
  gather: { glyph: "✦", code: "MAT", tone: "nature", label: { ru: "Материалы", en: "Materials" } },
  capital: { glyph: "◇", code: "CAP", tone: "gold", label: { ru: "Капитал", en: "Capital" } },
  knowledge: { glyph: "⌁", code: "KNO", tone: "arcane", label: { ru: "Знания профессии", en: "Profession knowledge" } },
  craft: { glyph: "◆", code: "CRF", tone: "ember", label: { ru: "Производство", en: "Crafting" } },
  orders: { glyph: "◎", code: "ORD", tone: "frost", label: { ru: "Заказы", en: "Orders" } },
  market: { glyph: "◈", code: "AH", tone: "arcane", label: { ru: "Auction House", en: "Auction House" } },
  liquidity: { glyph: "◒", code: "LIQ", tone: "void", label: { ru: "Ликвидность", en: "Liquidity" } },
  reinvest: { glyph: "↻", code: "ROI", tone: "gold", label: { ru: "Реинвестирование", en: "Reinvestment" } },
  consumable: { glyph: "✧", code: "CON", tone: "ember", label: { ru: "Расходники", en: "Consumables" } },
  decor: { glyph: "⬡", code: "DEC", tone: "void", label: { ru: "Decor", en: "Decor" } }
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
    phase: { ru: "gather или buy", en: "gather or buy" },
    summary: {
      ru: "Reagents входят в систему через личный фарм, Auction House или заказчика. Бесплатно добытый материал всё равно имеет рыночную альтернативную стоимость.",
      en: "Reagents enter through personal gathering, the Auction House or the customer. A self-farmed material still carries a market opportunity cost."
    },
    decision: {
      ru: "Сравни effective GPH фарма с ценой покупки. Не называй собственные reagents бесплатными при расчёте craft margin.",
      en: "Compare effective gathering GPH with the purchase price. Never treat self-farmed reagents as free inside crafting margin."
    },
    signal: { ru: "buy price против effective GPH", en: "buy price vs effective GPH" },
    href: "#farm-liquidity",
    mark: wowMarks.gather
  },
  {
    code: "02",
    title: { ru: "Working capital", en: "Working capital" },
    phase: { ru: "gold становится inventory", en: "gold becomes inventory" },
    summary: {
      ru: "Покупка большого batch превращает ликвидное золото в stock. Пока товар не продан, следующий market move финансировать нечем.",
      en: "A large batch converts liquid gold into stock. Until it sells, the next market move has no funding."
    },
    decision: {
      ru: "Ограничь batch объёмом, который рынок способен поглотить за выбранный listing cycle.",
      en: "Cap the batch at the volume the market can absorb within the chosen listing cycle."
    },
    signal: { ru: "capital at risk", en: "capital at risk" },
    href: "#crafting-margin",
    mark: wowMarks.capital
  },
  {
    code: "03",
    title: { ru: "Специализация", en: "Specialization" },
    phase: { ru: "knowledge allocation", en: "knowledge allocation" },
    summary: {
      ru: "Profession Knowledge создаёт производственный moat. Но узкая специализация полезна только там, где есть повторяемый спрос.",
      en: "Profession Knowledge creates a production moat, but narrow specialization matters only where repeat demand exists."
    },
    decision: {
      ru: "Перед reset выбери рыночную роль: массовый товар, high-value order или собственная supply chain.",
      en: "Before a reset, choose a market role: mass goods, high-value orders or your own supply chain."
    },
    signal: { ru: "knowledge → market access", en: "knowledge → market access" },
    href: "#player-paths",
    mark: wowMarks.knowledge
  },
  {
    code: "04",
    title: { ru: "Craft conversion", en: "Craft conversion" },
    phase: { ru: "reagents → output", en: "reagents → output" },
    summary: {
      ru: "Recipe создаёт value только после материалов, комиссии, неудачных листингов и реальной вероятности продажи.",
      en: "A recipe creates value only after materials, fees, failed listings and the actual probability of a sale."
    },
    decision: {
      ru: "Проверь break-even и expected profit до batch. Положительный spread до AH cut не является прибылью.",
      en: "Check break-even and expected profit before batching. A positive pre-fee spread is not profit."
    },
    signal: { ru: "expected margin / cycle", en: "expected margin / cycle" },
    href: "#crafting-margin",
    mark: wowMarks.craft
  },
  {
    code: "05",
    title: { ru: "Канал реализации", en: "Sale channel" },
    phase: { ru: "AH или order", en: "AH or order" },
    summary: {
      ru: "Auction House продаёт товар рынку. Crafting Order продаёт доступ к навыку и исполнению конкретному клиенту.",
      en: "The Auction House sells an item to the market. A Crafting Order sells skill access and execution to a specific customer."
    },
    decision: {
      ru: "Выбери канал, где твой edge монетизируется: ликвидный batch или комиссия выше экономического floor.",
      en: "Choose the channel that monetizes your edge: a liquid batch or a commission above its economic floor."
    },
    signal: { ru: "sell-through или commission", en: "sell-through or commission" },
    href: "#order-floor",
    mark: wowMarks.orders
  },
  {
    code: "06",
    title: { ru: "Market liquidity", en: "Market liquidity" },
    phase: { ru: "listed value → gold", en: "listed value → gold" },
    summary: {
      ru: "Высокая цена бесполезна без покупателя. Sell-through, relisting и markdown определяют, какая доля inventory станет cash.",
      en: "A high price is useless without a buyer. Sell-through, relisting and markdown determine how much inventory becomes cash."
    },
    decision: {
      ru: "Считай effective GPH и monetization rate. Listed GPH используй только как верхнюю границу.",
      en: "Use effective GPH and monetization rate. Treat listed GPH only as an upper bound."
    },
    signal: { ru: "cash / listed value", en: "cash / listed value" },
    href: "#farm-liquidity",
    mark: wowMarks.liquidity
  },
  {
    code: "07",
    title: { ru: "Реинвестирование", en: "Reinvestment" },
    phase: { ru: "cash → next cycle", en: "cash → next cycle" },
    summary: {
      ru: "Реализованная прибыль финансирует следующий batch, tools или новую специализацию. Непроданный stock не должен автоматически масштабироваться.",
      en: "Realized profit funds the next batch, tools or specialization. Unsold stock should never be scaled automatically."
    },
    decision: {
      ru: "Увеличивай объём только после подтверждённого sell-through. Рост inventory без cash conversion является сигналом остановиться.",
      en: "Scale only after confirmed sell-through. Rising inventory without cash conversion is a stop signal."
    },
    signal: { ru: "realized profit → scale", en: "realized profit → scale" },
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
    summary: { ru: "Сначала восстановить market map, потом выбирать профессию.", en: "Rebuild the market map before choosing a profession." },
    title: { ru: "За один вечер пойми, где твой старый profession plan больше не работает", en: "Use one evening to find where the old profession plan stopped working" },
    mark: wowMarks.knowledge,
    capital: { ru: "до 25k", en: "up to 25k" },
    time: { ru: "2-4 ч / нед.", en: "2-4 h / week" },
    complexity: { ru: "низкая", en: "low" },
    steps: [
      { title: { ru: "Проведи inventory audit", en: "Audit inventory" }, text: { ru: "Раздели stock на ликвидные commodities, старые материалы и товары без понятного спроса.", en: "Separate liquid commodities, legacy materials and goods with no visible demand." } },
      { title: { ru: "Выбери одну market role", en: "Choose one market role" }, text: { ru: "Gathering, массовый craft или orders. Не распределяй Knowledge до выбора роли.", en: "Gathering, mass crafting or orders. Do not allocate Knowledge before choosing the role." } },
      { title: { ru: "Проверь cash conversion", en: "Verify cash conversion" }, text: { ru: "Сделай маленький batch и измерь sell-through до масштабирования.", en: "Run a small batch and measure sell-through before scaling." } }
    ],
    flipCondition: { ru: "Если старые recipes уже имеют устойчивый спрос и положительную expected margin, reset не обязателен.", en: "If old recipes still have repeat demand and positive expected margin, a reset is not automatically necessary." },
    href: { ru: "/wow/#market-pulse", en: "/en/wow/#market-pulse" }
  },
  {
    id: "casual",
    label: { ru: "Мало времени", en: "Limited time" },
    summary: { ru: "Ликвидность и короткий цикл важнее максимального theoretical profit.", en: "Liquidity and short cycles beat maximum theoretical profit." },
    title: { ru: "Пусть рынок работает быстрее, чем растёт твой bags inventory", en: "Make the market work faster than your bags fill up" },
    mark: wowMarks.market,
    capital: { ru: "25k-100k", en: "25k-100k" },
    time: { ru: "3-6 ч / нед.", en: "3-6 h / week" },
    complexity: { ru: "средняя", en: "medium" },
    steps: [
      { title: { ru: "Сначала продай", en: "Sell first" }, text: { ru: "Перед новой сессией посмотри, сколько прошлого inventory реально стало gold.", en: "Before another session, check how much previous inventory actually became gold." } },
      { title: { ru: "Сократи batch", en: "Cut the batch" }, text: { ru: "Пусть один listing cycle проверяет спрос, а не замораживает весь банк.", en: "Let one listing cycle test demand instead of freezing the whole bank." } },
      { title: { ru: "Считай effective GPH", en: "Use effective GPH" }, text: { ru: "Цена в AH без sell-through не должна определять выбор фарма.", en: "An AH price without sell-through should not decide what to farm." } }
    ],
    flipCondition: { ru: "Если товар продаётся почти полностью и быстро, можно увеличивать batch до следующего liquidity threshold.", en: "When nearly all volume sells quickly, scale the batch to the next liquidity threshold." },
    href: { ru: "/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=65#farm-liquidity", en: "/en/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=65#farm-liquidity" }
  },
  {
    id: "operator",
    label: { ru: "Market operator", en: "Market operator" },
    summary: { ru: "Управляет несколькими циклами и ищет repeatable edge.", en: "Runs several loops and looks for repeatable edge." },
    title: { ru: "Раздели прибыль, inventory и profession capital на три разных ledger", en: "Keep profit, inventory and profession capital in three separate ledgers" },
    mark: wowMarks.capital,
    capital: { ru: "100k+", en: "100k+" },
    time: { ru: "8+ ч / нед.", en: "8+ h / week" },
    complexity: { ru: "высокая", en: "high" },
    steps: [
      { title: { ru: "Сегментируй каналы", en: "Segment channels" }, text: { ru: "AH batches, personal orders и gathering должны иметь отдельную unit economics.", en: "AH batches, personal orders and gathering need separate unit economics." } },
      { title: { ru: "Зафиксируй floor", en: "Set the floor" }, text: { ru: "Комиссия за order должна покрывать materials, recraft reserve и стоимость времени.", en: "An order commission must cover materials, recraft reserve and time cost." } },
      { title: { ru: "Масштабируй realised edge", en: "Scale realized edge" }, text: { ru: "Увеличивай capital только там, где cash conversion уже подтверждён несколькими циклами.", en: "Increase capital only where several cycles have confirmed cash conversion." } }
    ],
    flipCondition: { ru: "Если inventory растёт быстрее sales, останови производство даже при положительной headline margin.", en: "If inventory grows faster than sales, stop production even when headline margin is positive." },
    href: { ru: "/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180#order-floor", en: "/en/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180#order-floor" }
  }
];

export const wowPulse = {
  release: "Curse of Ula’tek",
  checkedAt: "2026-08-12",
  staleAfterDays: 30,
  sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek",
  status: "verified" as const,
  changes: [
    {
      signal: { ru: "1 reset / profession", en: "1 reset / profession" },
      title: { ru: "Profession Knowledge можно перераспределить", en: "Profession Knowledge can be reallocated" },
      summary: { ru: "Curse of Ula’tek добавляет один reset потраченных Knowledge Points для каждой профессии.", en: "Curse of Ula’tek adds one reset of spent Knowledge Points for each profession." },
      decision: { ru: "Не нажимай reset до выбора market role и списка demand signals. Это редкий capital allocation option, а не бесплатный эксперимент.", en: "Do not reset before choosing a market role and demand signals. This is a scarce capital-allocation option, not a free experiment." },
      mark: wowMarks.knowledge,
      sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek"
    },
    {
      signal: { ru: "lower decor costs", en: "lower decor costs" },
      title: { ru: "Большинство Midnight decor стали дешевле крафтить", en: "Most Midnight decor became cheaper to craft" },
      summary: { ru: "Blizzard снизила стоимость большинства crafted Housing decor. Старый cost baseline больше нельзя переносить автоматически.", en: "Blizzard reduced the cost of most crafted Housing decor. Old cost baselines cannot be carried forward automatically." },
      decision: { ru: "Пересчитай material cost, break-even и batch size. Более дешёвый craft может одновременно усилить supply и сжать margin.", en: "Recalculate material cost, break-even and batch size. Cheaper crafting can raise supply and compress margin at the same time." },
      mark: wowMarks.decor,
      sourceUrl: "https://worldofwarcraft.blizzard.com/en-us/news/24288418/quality-of-life-improvements-coming-in-curse-of-ulatek"
    },
    {
      signal: { ru: "persistent AH filters", en: "persistent AH filters" },
      title: { ru: "Auction House сохраняет фильтры", en: "Auction House filters now persist" },
      summary: { ru: "Фильтры сохраняются после закрытия AH. Это снижает операционную friction, но не меняет рыночную маржу.", en: "Filters persist after closing the AH. This lowers operating friction but does not change market margin." },
      decision: { ru: "Используй сохранённые search sets для повторяемого сканирования, но не добавляй удобство в gold profit.", en: "Use saved search sets for repeatable scanning, but do not count convenience as gold profit." },
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
  { id: "gathering", title: { ru: "Региональные commodities", en: "Regional commodities" }, summary: { ru: "Собирай ликвидные материалы и оценивай их через effective GPH, а не AH sticker price.", en: "Gather liquid materials and value them through effective GPH, not the AH sticker price." }, mark: wowMarks.gather, metrics: { capitalAccess: 9, liquidity: 8, timeFit: 7, specializationMoat: 3, priceResilience: 6, lowFriction: 7 } },
  { id: "commodity-craft", title: { ru: "Commodity conversion", en: "Commodity conversion" }, summary: { ru: "Преобразуй reagents в массовый output только при положительной post-fee margin и подтверждённом объёме.", en: "Convert reagents into mass output only with positive post-fee margin and confirmed volume." }, mark: wowMarks.craft, metrics: { capitalAccess: 6, liquidity: 9, timeFit: 7, specializationMoat: 6, priceResilience: 5, lowFriction: 6 } },
  { id: "consumables", title: { ru: "Consumable batches", en: "Consumable batches" }, summary: { ru: "Повторяемый спрос может быть сильным, но competition и price compression требуют короткого inventory cycle.", en: "Repeat demand can be strong, but competition and price compression require a short inventory cycle." }, mark: wowMarks.consumable, metrics: { capitalAccess: 5, liquidity: 9, timeFit: 6, specializationMoat: 7, priceResilience: 6, lowFriction: 5 } },
  { id: "orders", title: { ru: "Crafting Orders", en: "Crafting Orders" }, summary: { ru: "Монетизируй skill access через commission floor, не замораживая большой batch на открытом рынке.", en: "Monetize skill access through a commission floor without freezing a large open-market batch." }, mark: wowMarks.orders, metrics: { capitalAccess: 8, liquidity: 7, timeFit: 8, specializationMoat: 9, priceResilience: 8, lowFriction: 6 } },
  { id: "intermediates", title: { ru: "Specialized intermediates", en: "Specialized intermediates" }, summary: { ru: "Поставляй другим crafters узкое звено supply chain, где profession edge снижает прямую конкуренцию.", en: "Supply a narrow link in another crafter's chain where profession edge reduces direct competition." }, mark: wowMarks.capital, metrics: { capitalAccess: 5, liquidity: 8, timeFit: 6, specializationMoat: 8, priceResilience: 7, lowFriction: 5 } },
  { id: "decor", title: { ru: "Decor и collectibles", en: "Decor and collectibles" }, summary: { ru: "Высокая потенциальная наценка сопровождается медленным sell-through и большим риском зависшего stock.", en: "High potential markup comes with slow sell-through and a larger risk of stranded stock." }, mark: wowMarks.decor, metrics: { capitalAccess: 4, liquidity: 3, timeFit: 5, specializationMoat: 7, priceResilience: 4, lowFriction: 4 } }
];

const weights = (values: [number, number, number, number, number, number]): WowRankingLens["weights"] => ({
  capitalAccess: values[0], liquidity: values[1], timeFit: values[2], specializationMoat: values[3], priceResilience: values[4], lowFriction: values[5]
});

export const wowRankingLenses: Array<WowRankingLens & { label: Localized; question: Localized; formula: Localized; note: Localized }> = [
  { id: "returner", label: { ru: "Вернуться без ошибки", en: "Return safely" }, question: { ru: "Какой route проще проверить небольшим капиталом?", en: "Which route is easiest to validate with limited capital?" }, formula: { ru: "25% access · 25% liquidity · 15% time · 15% resilience · 15% low friction · 5% moat", en: "25% access · 25% liquidity · 15% time · 15% resilience · 15% low friction · 5% moat" }, note: { ru: "Score оценивает доступность и проверяемость route, а не обещает конкретный gold/hour. Реальные цены вводятся в calculators.", en: "The score measures access and testability, not promised gold/hour. Actual prices belong in the calculators." }, weights: weights([25, 25, 15, 5, 15, 15]) },
  { id: "limited-time", label: { ru: "Мало времени", en: "Limited time" }, question: { ru: "Где быстрее cash conversion при коротких сессиях?", en: "Where is cash conversion fastest in short sessions?" }, formula: { ru: "30% time · 25% liquidity · 15% low friction · 10% access · 10% moat · 10% resilience", en: "30% time · 25% liquidity · 15% low friction · 10% access · 10% moat · 10% resilience" }, note: { ru: "Высокая теоретическая margin проигрывает, если товар требует постоянного relisting или долгого поиска клиента.", en: "High theoretical margin loses when an item needs constant relisting or a long customer search." }, weights: weights([10, 25, 30, 10, 10, 15]) },
  { id: "specialist", label: { ru: "Построить moat", en: "Build a moat" }, question: { ru: "Где Knowledge и repeatable process сильнее защищают edge?", en: "Where do Knowledge and repeatable process protect the edge?" }, formula: { ru: "35% moat · 25% resilience · 15% liquidity · 10% time · 10% low friction · 5% access", en: "35% moat · 25% resilience · 15% liquidity · 10% time · 10% low friction · 5% access" }, note: { ru: "Specialization без demand не является moat. Перед Knowledge allocation нужен реальный order flow или повторяемая sell-through история.", en: "Specialization without demand is not a moat. Knowledge allocation needs real order flow or a repeat sell-through history." }, weights: weights([5, 15, 10, 35, 25, 10]) }
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
  { id: "craft-liquid", kind: "craft", featured: true, mark: wowMarks.craft, title: { ru: "Recipe продаётся в 70% циклов", en: "The recipe sells in 70% of cycles" }, text: { ru: "Проверь post-fee margin, break-even и capital at risk для batch из 20 crafts.", en: "Test post-fee margin, break-even and capital at risk for a 20-craft batch." }, href: { ru: "/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=225&wow-crafting.craft-sellthrough=70&wow-crafting.craft-count=20#crafting-margin", en: "/en/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=225&wow-crafting.craft-sellthrough=70&wow-crafting.craft-count=20#crafting-margin" } },
  { id: "craft-thin", kind: "craft", featured: false, mark: wowMarks.decor, title: { ru: "Цена упала на 20% после нового supply", en: "Price fell 20% after new supply" }, text: { ru: "Увидишь, когда положительный spread превращается в отрицательную expected margin.", en: "See when a positive spread turns into negative expected margin." }, href: { ru: "/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=180&wow-crafting.craft-sellthrough=55&wow-crafting.craft-count=20#crafting-margin", en: "/en/wow/?wow-crafting.craft-materials=825&wow-crafting.craft-output=5&wow-crafting.craft-price=180&wow-crafting.craft-sellthrough=55&wow-crafting.craft-count=20#crafting-margin" } },
  { id: "farm-liquid", kind: "farm", featured: false, mark: wowMarks.gather, title: { ru: "Ликвидный material farm", en: "A liquid material farm" }, text: { ru: "Сравни 3 420 listed GPH с gold, который реально проходит через рынок.", en: "Compare 3,420 listed GPH with the gold that actually clears the market." }, href: { ru: "/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=75&wow-farm.farm-session=2#farm-liquidity", en: "/en/wow/?wow-farm.farm-units=90&wow-farm.farm-price=38&wow-farm.farm-sellthrough=75&wow-farm.farm-session=2#farm-liquidity" } },
  { id: "farm-trap", kind: "farm", featured: false, mark: wowMarks.liquidity, title: { ru: "Дорогой товар продаётся только на 25%", en: "An expensive item sells only 25%" }, text: { ru: "Проверь monetization rate и объём inventory, который останется после длинной сессии.", en: "Test monetization rate and the inventory left after a long session." }, href: { ru: "/wow/?wow-farm.farm-units=40&wow-farm.farm-price=120&wow-farm.farm-sellthrough=25&wow-farm.farm-session=3#farm-liquidity", en: "/en/wow/?wow-farm.farm-units=40&wow-farm.farm-price=120&wow-farm.farm-sellthrough=25&wow-farm.farm-session=3#farm-liquidity" } },
  { id: "order-accept", kind: "order", featured: true, mark: wowMarks.orders, title: { ru: "Commission покрывает skill и время", en: "Commission covers skill and time" }, text: { ru: "2 500 gold за order против materials, recraft reserve и твоего target GPH.", en: "2,500 gold per order against materials, recraft reserve and your target GPH." }, href: { ru: "/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180&wow-order.order-minutes=6&wow-order.order-target-gph=8000#order-floor", en: "/en/wow/?wow-order.order-commission=2500&wow-order.order-materials=450&wow-order.order-recraft=180&wow-order.order-minutes=6&wow-order.order-target-gph=8000#order-floor" } },
  { id: "order-decline", kind: "order", featured: false, mark: wowMarks.capital, title: { ru: "Большой tip, но дорогие crafter reagents", en: "A large tip with expensive crafter reagents" }, text: { ru: "Headline commission может оказаться ниже экономического floor после материалов и времени.", en: "Headline commission can fall below the economic floor after materials and time." }, href: { ru: "/wow/?wow-order.order-commission=1800&wow-order.order-materials=900&wow-order.order-recraft=250&wow-order.order-minutes=8&wow-order.order-target-gph=7000#order-floor", en: "/en/wow/?wow-order.order-commission=1800&wow-order.order-materials=900&wow-order.order-recraft=250&wow-order.order-minutes=8&wow-order.order-target-gph=7000#order-floor" } },
  { id: "knowledge-reset", kind: "allocation", featured: false, mark: wowMarks.knowledge, title: { ru: "Стоит ли тратить profession reset сейчас?", en: "Should the profession reset be used now?" }, text: { ru: "Сначала выбери market role, demand proof и тестовый batch. Только затем меняй Knowledge allocation.", en: "Choose a market role, demand proof and a test batch before changing Knowledge allocation." }, href: { ru: "/wow/#player-paths", en: "/en/wow/#player-paths" } },
  { id: "season-window", kind: "event", featured: false, mark: wowMarks.reinvest, title: { ru: "Новый сезон меняет demand, но не гарантирует margin", en: "A new season changes demand, not guaranteed margin" }, text: { ru: "Используй маленький discovery batch и масштабируй только после первого подтверждённого sell-through.", en: "Use a small discovery batch and scale only after the first confirmed sell-through." }, href: { ru: "/wow/#market-pulse", en: "/en/wow/#market-pulse" } }
];
