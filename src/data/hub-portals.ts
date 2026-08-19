import { dotaPatchContext } from "./dota-economy";
import { weeklyMeta } from "./gta-businesses";
import { insights } from "./insights";
import { crusaderKingsHub, totalWarHub } from "./strategy-hubs";
import { wowPatchContext } from "./wow-economy";

export type HubLocale = "ru" | "en";
export type HubPortalId = "gta" | "dota" | "wow" | "total-war" | "ck3";
export const HUB_SECTION_SLUGS = ["economy", "player-paths", "meta", "guides", "tools"] as const;
export type HubSectionSlug = (typeof HUB_SECTION_SLUGS)[number];
export type HubLocalized = Record<HubLocale, string>;

export interface HubEditorialMedia {
  src: string;
  alt: HubLocalized;
  caption: HubLocalized;
  sourceLabel: string;
  sourceUrl: string;
  position?: string;
}

export interface HubSectionConfig {
  slug: HubSectionSlug;
  code: string;
  mark: string;
  label: HubLocalized;
  title: HubLocalized;
  description: HubLocalized;
  payoff: HubLocalized;
  question: HubLocalized;
}

export interface HubPortalConfig {
  id: HubPortalId;
  slug: string;
  name: string;
  shortName: string;
  publisher: string;
  title: HubLocalized;
  description: HubLocalized;
  eyebrow: HubLocalized;
  heading: HubLocalized;
  lede: HubLocalized;
  valueTitle: HubLocalized;
  valueText: HubLocalized;
  version: HubLocalized;
  checkedAt: string;
  sourceLabel: HubLocalized;
  sourceUrl: string;
  stats: Array<{ value: string; label: HubLocalized }>;
  sections: HubSectionConfig[];
  media: HubEditorialMedia[];
}

const t = (ru: string, en: string): HubLocalized => ({ ru, en });
const section = (
  slug: HubSectionSlug,
  code: string,
  mark: string,
  label: HubLocalized,
  title: HubLocalized,
  description: HubLocalized,
  payoff: HubLocalized,
  question: HubLocalized
): HubSectionConfig => ({ slug, code, mark, label, title, description, payoff, question });

const guideCount = (game: "gta" | "dota" | "wow" | "totalwar" | "ck3") =>
  String(insights.filter((insight) => insight.game === game).length);

export const hubPortals: Record<HubPortalId, HubPortalConfig> = {
  gta: {
    id: "gta",
    slug: "gta-online",
    name: "GTA Online",
    shortName: "GTA",
    publisher: "Rockstar Games",
    title: t("Экономика GTA Online: бизнесы, капитал и маршруты игрока | Money Meta", "GTA Online economy: businesses, capital and player routes | Money Meta"),
    description: t("Портал решений по экономике GTA Online: отдельные страницы для денежного цикла, пути игрока, недельной меты, гайдов и расчётов.", "A GTA Online economy decision portal with dedicated pages for the cash loop, player routes, weekly meta, guides and calculators."),
    eyebrow: t("GTA Online · экономика без универсального тир-листа", "GTA Online · economy without a universal tier list"),
    heading: t("Сначала вопрос. Потом цифры. И только затем покупка.", "Question first. Numbers second. Purchase last."),
    lede: t("Money Meta связывает твой банк, время на игру и цель с конкретным следующим ходом. Не листай одну бесконечную страницу: выбери задачу и открой нужный слой.", "Money Meta connects your bank, play time and objective to one concrete next move. Pick the decision and open the relevant layer instead of scrolling one endless page."),
    valueTitle: t("Не список выплат, а система принятия решений", "Not a payout list. A decision system."),
    valueText: t("Мы отделяем валовую продажу от чистого потока, производственное время от ручной нагрузки и временный бонус от постоянной экономики.", "We separate headline sale value from net flow, production time from active friction and a temporary bonus from the permanent economy."),
    version: t("Brand Wars · до 26 августа", "Brand Wars · through August 26"),
    checkedAt: weeklyMeta.checkedAt,
    sourceLabel: t("Rockstar Newswire", "Rockstar Newswire"),
    sourceUrl: weeklyMeta.sourceUrl,
    stats: [
      { value: "7", label: t("звеньев денежного цикла", "cash-loop links") },
      { value: "3", label: t("маршрута игрока", "player routes") },
      { value: "3", label: t("живые модели", "live models") },
      { value: guideCount("gta"), label: t("полных разборов", "full analyses") }
    ],
    sections: [
      section("economy", "01", "$", t("Экономика", "Economy"), t("Куда на самом деле уходит GTA$", "Where GTA$ actually moves"), t("Весь цикл от свободного капитала и сырья до чистой продажи и повторного вложения.", "The full loop from deployable capital and supplies to net sale proceeds and reinvestment."), t("Увидишь узкое место денежного цикла", "Find the bottleneck in the cash loop"), t("Какой этап съедает мой капитал или время?", "Which stage consumes my capital or time?")),
      section("player-paths", "02", "П", t("Маршруты", "Player paths"), t("План для твоего банка и режима игры", "A plan for your bank and play pattern"), t("Отдельные системы для возвращения после перерыва, коротких сессий и развитого портфеля.", "Separate operating systems for returners, short sessions and developed portfolios."), t("Получишь порядок следующих трёх действий", "Get the next three actions in order"), t("Что делать первым именно в моём положении?", "What should I do first in my position?")),
      section("meta", "03", "W", t("Мета", "Meta"), t("Что меняет текущая неделя", "What the current week changes"), t("Brand Wars, временные множители и условные рейтинги без превращения события в вечный совет.", "Brand Wars, temporary multipliers and conditional rankings without turning an event into permanent advice."), t("Отделишь короткое окно от постоянной стратегии", "Separate a short window from permanent strategy"), t("Стоит ли менять план из-за бонуса этой недели?", "Should this week's bonus change the plan?")),
      section("guides", "04", "Г", t("Гайды", "Guides"), t("Аудиты, сравнения и готовые протоколы", "Audits, comparisons and field protocols"), t("Полные разборы с вводными, границами применимости, первоисточниками и переходом в модель.", "Complete analyses with inputs, boundaries, primary sources and a direct route into the model."), t("Прочитаешь решение, а не пересказ механик", "Read a decision, not a mechanics recap"), t("Как провести конкретное решение от вопроса до проверки?", "How do I take a decision from question to verification?")),
      section("tools", "05", "Σ", t("Инструменты", "Tools"), t("Считать до покупки, а не после", "Calculate before buying, not after"), t("Окупаемость бизнеса, срок до цели и распределение портфеля с редактируемыми вводными.", "Business payback, time to goal and portfolio allocation with editable inputs."), t("Проверишь решение на своих цифрах", "Test the decision with your own numbers"), t("Ускоряет ли эта покупка мою реальную цель?", "Does this purchase accelerate my actual goal?"))
    ],
    media: [{
      src: "https://media-rockstargames-com.akamaized.net/tina-uploads/posts/9k2kok31k3a8k9/46944605c1257bcb4dca1dbc4ffe515cd55cddda.jpg",
      alt: t("Официальный кадр события Brand Wars в GTA Online", "Official GTA Online Brand Wars event artwork"),
      caption: t("Текущий редакционный контекст: Brand Wars. Бонусы проверяются отдельно от постоянной модели бизнеса.", "Current editorial context: Brand Wars. Bonuses stay separate from the permanent business model."),
      sourceLabel: "Rockstar Games",
      sourceUrl: weeklyMeta.sourceUrl,
      position: "50% 45%"
    }]
  },

  dota: {
    id: "dota",
    slug: "dota-2",
    name: "Dota 2",
    shortName: "Dota",
    publisher: "Valve",
    title: t("Экономика Dota 2: тайминги, роли и золото в патче 7.41e | Money Meta", "Dota 2 economy: timings, roles and gold in Patch 7.41e | Money Meta"),
    description: t("Портал решений по экономике матча Dota 2: карта золота, пути по ролям, контекст патча, гайды и расчёты Midas и выкупа.", "A Dota 2 match-economy portal with gold flow, role paths, patch context, guides and Midas and buyback tools."),
    eyebrow: t("Dota 2 · экономика матча · патч 7.41e", "Dota 2 · match economy · Patch 7.41e"),
    heading: t("Предмет ценен не ценой. Ценен моментом, который он выигрывает.", "An item is not valuable for its price. It is valuable for the timing it wins."),
    lede: t("Свяжи фарм, роль, ближайшую цель и цену смерти. Каждый раздел отвечает на отдельный вопрос, а официальные иконки Valve помогают считывать сценарий ещё до текста.", "Connect farm, role, the next objective and death cost. Every page answers one decision, while official Valve imagery makes the scenario legible before the copy."),
    valueTitle: t("Экономика матча как цепочка конверсий", "Match economy as a chain of conversions"),
    valueText: t("Золото превращается в предмет, предмет в окно силы, окно силы в объект на карте. Если цепочка рвётся, высокая стоимость героя не даёт преимущества.", "Gold becomes an item, the item becomes a timing and the timing becomes a map objective. If that chain breaks, net worth does not become advantage."),
    version: t(`Патч ${dotaPatchContext.patch}`, `Patch ${dotaPatchContext.patch}`),
    checkedAt: dotaPatchContext.checkedAt,
    sourceLabel: t("Официальные заметки Valve", "Official Valve patch notes"),
    sourceUrl: `https://www.dota2.com/patches/${dotaPatchContext.patch}`,
    stats: [
      { value: "7", label: t("узлов экономики матча", "match-economy links") },
      { value: "3", label: t("ролевых маршрута", "role routes") },
      { value: "2", label: t("живые модели", "live models") },
      { value: guideCount("dota"), label: t("полных разборов", "full analyses") }
    ],
    sections: [
      section("economy", "01", "QB", t("Экономика", "Economy"), t("Золото по минутам и конверсия в карту", "Gold by minute and conversion into map control"), t("Линия, пропускная способность фарма, распределение золота, цели, смерть и повторный цикл.", "Lane income, farm throughput, gold allocation, objectives, death and the next loop."), t("Увидишь, где стоимость героя перестаёт работать", "See where net worth stops working"), t("Как золото должно превратиться в преимущество?", "How should gold become an advantage?")),
      section("player-paths", "02", "DK", t("Маршруты", "Player paths"), t("Решения по роли и стадии матча", "Decisions by role and match stage"), t("Керри, инициатор и поддержка получают разный порядок проверок перед покупкой.", "Carry, initiator and support use a different order of checks before buying."), t("Сопоставишь покупку со своей задачей", "Match the purchase to your job"), t("Как моя роль создаёт ценность в ближайшие пять минут?", "How does my role create value in the next five minutes?")),
      section("meta", "03", "7.41e", t("Мета", "Meta"), t("Что патч меняет в решениях, а не в списках", "What the patch changes in decisions, not lists"), t("Три проверенных изменения, их экономический смысл и граница между фактом патча и нашей интерпретацией.", "Three verified changes, their economic meaning and a clear boundary between patch fact and interpretation."), t("Поймёшь, какой старый шаблон нужно перепроверить", "Know which old habit needs retesting"), t("Как 7.41e меняет мой следующий выбор?", "How does 7.41e change my next choice?")),
      section("guides", "04", "CM", t("Гайды", "Guides"), t("Разборы реплея и протоколы решений", "Replay reviews and decision protocols"), t("От первого двадцатиминутного отчёта до резерва на выкуп перед Рошаном.", "From a first-20-minute ledger to buyback reserve before Roshan."), t("Получишь конкретные отметки для следующего реплея", "Get concrete checkpoints for the next replay"), t("Что именно искать в повторе, кроме KDA?", "What should I inspect in a replay beyond KDA?")),
      section("tools", "05", "HM", t("Инструменты", "Tools"), t("Midas, выкуп и готовые сценарии", "Midas, buyback and prepared scenarios"), t("Окупаемость ускорения и запас на второй шанс с вводными конкретного матча.", "Acceleration payback and second-life liquidity with match-specific inputs."), t("Проверишь решение до того, как окно закроется", "Test the decision before the window closes"), t("Хватит ли времени окупить жадность или сохранить выкуп?", "Is there enough time to repay greed or preserve buyback?"))
    ],
    media: []
  },

  wow: {
    id: "wow",
    slug: "wow",
    name: "World of Warcraft Retail",
    shortName: "WoW",
    publisher: "Blizzard Entertainment",
    title: t("Экономика WoW Retail: аукцион, профессии и ликвидность | Money Meta", "WoW Retail economy: Auction House, professions and liquidity | Money Meta"),
    description: t("Портал решений по рынку WoW Retail: денежный цикл, пути профессий, актуальный контекст, гайды и калькуляторы реальной маржи.", "A WoW Retail market decision portal for cash flow, profession paths, current context, guides and realized-margin calculators."),
    eyebrow: t("WoW Retail · рынок после Curse of Ula’tek", "WoW Retail · market after Curse of Ula’tek"),
    heading: t("Цена выставления не равна золоту, которым можно распорядиться.", "A listed price is not gold you can deploy."),
    lede: t("Проследи капитал от материалов до фактической продажи. Выбери роль на рынке, оцени ликвидность и открой только тот раздел, который нужен для следующего решения.", "Follow capital from reagents to an actual sale. Choose a market role, price liquidity and open only the layer needed for the next decision."),
    valueTitle: t("Рынок виден только после поправки на продажу", "The market appears only after sell-through"),
    valueText: t("Money Meta соединяет маржу, комиссию, вероятность продажи, объём партии и твоё время. Непроданный запас остаётся капиталом под риском, а не прибылью.", "Money Meta connects margin, fees, sell-through, batch size and player time. Unsold inventory remains capital at risk, not profit."),
    version: t(wowPatchContext.release, wowPatchContext.release),
    checkedAt: wowPatchContext.checkedAt,
    sourceLabel: t("Официальные материалы Blizzard", "Official Blizzard notes"),
    sourceUrl: wowPatchContext.sources[0]!.url,
    stats: [
      { value: "7", label: t("звеньев рынка", "market links") },
      { value: "3", label: t("рыночных маршрута", "market routes") },
      { value: "3", label: t("живые модели", "live models") },
      { value: guideCount("wow"), label: t("полных разборов", "full analyses") }
    ],
    sections: [
      section("economy", "01", "АУК", t("Экономика", "Economy"), t("От материалов до полученного золота", "From reagents to realized gold"), t("Баланс ликвидности, карта рынка и разница между запасом по цене выставления и деньгами в сумках.", "A liquidity ledger, market map and the difference between listed inventory and gold in bags."), t("Увидишь капитал, который рынок ещё не вернул", "See capital the market has not returned"), t("Сколько моего богатства действительно ликвидно?", "How much of my wealth is actually liquid?")),
      section("player-paths", "02", "ЗН", t("Маршруты", "Player paths"), t("Сбор, производство или заказы", "Gathering, crafting or orders"), t("Три рыночные роли с разным риском капитала, требованиями к знаниям и нагрузкой на время.", "Three market roles with different capital risk, Knowledge requirements and time load."), t("Выберешь короткий проверяемый цикл", "Choose a short, testable loop"), t("Какой маршрут подходит моему капиталу и времени?", "Which route fits my capital and time?")),
      section("meta", "03", "УЛ", t("Мета", "Meta"), t("Curse of Ula’tek и изменения спроса", "Curse of Ula’tek and demand shifts"), t("Официальный контекст, рыночные гипотезы и условные рейтинги без обещания универсальной профессии.", "Official context, market hypotheses and conditional rankings without promising one universal profession."), t("Поймёшь, что проверять маленькой партией", "Know what to test with a discovery batch"), t("Как обновление меняет спрос, но не гарантирует маржу?", "How does the update change demand without guaranteeing margin?")),
      section("guides", "04", "КН", t("Гайды", "Guides"), t("Рыночные планы и разбор ловушек", "Market plans and inventory traps"), t("Планы первой недели, размер партии, сброс знаний и сравнение фарма с производством.", "Opening-week plans, batch sizing, Knowledge reset and gathering versus crafting."), t("Получишь протокол проверки рынка", "Get a market-verification protocol"), t("Как войти в рынок без дорогой ошибки?", "How do I enter a market without an expensive mistake?")),
      section("tools", "05", "Σ", t("Инструменты", "Tools"), t("Маржа, ликвидность и минимальная комиссия", "Margin, liquidity and commission floor"), t("Три редактируемые модели и готовые ситуации для рецепта, фарм-сессии и заказа.", "Three editable models and prepared cases for a recipe, farm session and work order."), t("Посчитаешь полученное золото, а не витрину", "Calculate realized gold, not the storefront"), t("Окупается ли этот цикл после всех потерь?", "Does this loop pay after every haircut?"))
    ],
    media: [
      {
        src: "https://bnetcmsus-a.akamaihd.net/cms/blog_header/y9/Y9MLNA68JATD1785199316292.png",
        alt: t("Официальная иллюстрация Curse of Ula’tek", "Official Curse of Ula’tek artwork"),
        caption: t("Curse of Ula’tek задаёт текущий контекст. Цены и вероятность продажи остаются вводными игрока.", "Curse of Ula’tek sets the current context. Prices and sell-through remain player inputs."),
        sourceLabel: "Blizzard Entertainment",
        sourceUrl: wowPatchContext.sources[0]!.url,
        position: "50% 42%"
      },
      {
        src: "https://bnetcmsus-a.akamaihd.net/cms/content_entry_media/0H0U8GIJP4811781742462145.png",
        alt: t("Игровой интерьер WoW из официальных материалов Blizzard", "WoW in-game interior from official Blizzard media"),
        caption: t("Игровой контекст, а не источник рыночной цены", "Game context, not a market-price source"),
        sourceLabel: "Blizzard Entertainment",
        sourceUrl: wowPatchContext.sources[0]!.url
      },
      {
        src: "https://bnetcmsus-a.akamaihd.net/cms/content_entry_media/1FVUAV0S0JDB1781742460514.png",
        alt: t("Игровая локация WoW из официальных материалов Blizzard", "WoW in-game location from official Blizzard media"),
        caption: t("Новый контент меняет спрос, но не гарантирует продажу", "New content changes demand; it does not guarantee a sale"),
        sourceLabel: "Blizzard Entertainment",
        sourceUrl: wowPatchContext.sources[0]!.url
      }
    ]
  },

  "total-war": {
    id: "total-war",
    slug: "total-war",
    name: totalWarHub.name,
    shortName: "Total War",
    publisher: totalWarHub.publisher,
    title: totalWarHub.meta.title,
    description: totalWarHub.meta.description,
    eyebrow: t("Total War: Warhammer III · экономика кампании · патч 8.1", "Total War: Warhammer III · campaign economy · Patch 8.1"),
    heading: t("Сильная армия выигрывает битву. Устойчивая казна выигрывает войну.", "A strong army wins a battle. A resilient treasury wins the war."),
    lede: t("Раздели движение золота, развитие провинции, военный резерв и решения после захвата. Каждый вопрос получил отдельную страницу и явный горизонт в ходах.", "Separate gold flow, provincial development, the war reserve and post-conquest choices. Each question now has its own page and an explicit turn horizon."),
    valueTitle: t("Цена решения видна только на горизонте кампании", "Decision value appears across the campaign horizon"),
    valueText: t("Мы объединяем разовую цену, содержание, задержку строительства, риск границы и остаток казны у цели. Так доступная покупка отделяется от устойчивого плана.", "We connect one-off cost, upkeep, construction delay, frontier risk and cash at the objective. That separates an affordable purchase from a sustainable plan."),
    version: totalWarHub.version,
    checkedAt: totalWarHub.checkedAt,
    sourceLabel: t("Creative Assembly · Patch 8.1", "Creative Assembly · Patch 8.1"),
    sourceUrl: totalWarHub.pulse.changes[0]!.sourceUrl,
    stats: [
      { value: "7", label: t("узлов кампании", "campaign links") },
      { value: "3", label: t("пути кампании", "campaign routes") },
      { value: "3", label: t("живые модели", "live models") },
      { value: guideCount("totalwar"), label: t("полных гайда", "full guides") }
    ],
    sections: [
      section("economy", "01", "¤", t("Экономика", "Economy"), t("Путь золота через всю кампанию", "Gold through the entire campaign"), t("Казна, доход, провинции, найм, содержание, захват и повторное вложение в одной карте.", "Treasury, income, provinces, recruitment, upkeep, conquest and reinvestment in one map."), t("Найдёшь ограничение текущей фазы", "Find the constraint of the current phase"), t("Где кампания теряет темп или резерв?", "Where does the campaign lose tempo or reserve?")),
      section("player-paths", "02", "P", t("Маршруты", "Player paths"), t("Развитие, стабильность или экспансия", "Development, stability or expansion"), t("Три системы кампании с ограничениями, порядком действий и условием смены плана.", "Three campaign systems with constraints, action order and a condition that changes the plan."), t("Получишь рабочий порядок на следующие ходы", "Get an operating order for the next turns"), t("Какой режим соответствует моей границе и казне?", "Which mode fits my frontier and treasury?")),
      section("meta", "03", "8.1", t("Мета", "Meta"), t("Патч 8.1 через экономические последствия", "Patch 8.1 through economic consequences"), t("Более активный ИИ, новые ориентиры кампании и решения по фазам без универсального рейтинга фракций.", "More active AI, new campaign signals and phase decisions without a universal faction ranking."), t("Поймёшь, какой запас нужен против нового риска", "Know which buffer the new risk requires"), t("Как патч меняет горизонт моего решения?", "How does the patch change the decision horizon?")),
      section("guides", "04", "L", t("Гайды", "Guides"), t("Полевые планы для казны и границы", "Field plans for treasury and frontier"), t("Полные гайды по резерву, окупаемости здания и выбору между разграблением и удержанием.", "Full guides for the war reserve, building payback and sack-versus-hold decisions."), t("Получишь пошаговый сценарий, а не совет в вакууме", "Get a stepwise case, not advice in a vacuum"), t("Как проверить решение перед следующей войной?", "How do I test a decision before the next war?")),
      section("tools", "05", "Σ", t("Инструменты", "Tools"), t("Здание, военный резерв и захват", "Building, war reserve and conquest"), t("Три модели с редактируемым горизонтом, риском и обязательным остатком казны.", "Three models with editable horizon, risk and required treasury floor."), t("Проведёшь худший сценарий до конца хода", "Run the downside case before ending the turn"), t("Выдержит ли план неожиданный новый фронт?", "Can the plan survive an unexpected new front?"))
    ],
    media: [
      {
        src: "https://medias.community.creative-assembly.com/forums/ca-kinggobbo-4380/twwh3_Patch_Notes_G2G_blog_banner_1920x432_8.1.jpg",
        alt: t("Официальный баннер патча 8.1 Total War: Warhammer III", "Official Total War: Warhammer III Patch 8.1 banner"),
        caption: t("Патч 8.1: официальный контекст кампании, отдельно от редактируемых чисел модели.", "Patch 8.1: official campaign context, separate from editable model values."),
        sourceLabel: "Creative Assembly",
        sourceUrl: totalWarHub.pulse.changes[0]!.sourceUrl,
        position: "50% 50%"
      },
      {
        src: "https://medias.community.creative-assembly.com/forums/ca-kinggobbo-4380/house-of-secrets.png",
        alt: t("House of Secrets, официальный игровой кадр Total War: Warhammer III", "House of Secrets, official Total War: Warhammer III game image"),
        caption: t("Доходное здание оценивается по приросту и сроку, а не по красивому эффекту", "An income building is priced by marginal flow and horizon, not by the headline effect"),
        sourceLabel: "Creative Assembly",
        sourceUrl: totalWarHub.pulse.changes[0]!.sourceUrl
      },
      {
        src: "https://medias.community.creative-assembly.com/forums/ca-kinggobbo-4380/terracotta_road.png",
        alt: t("Terracotta Road, официальный игровой кадр Total War: Warhammer III", "Terracotta Road, official Total War: Warhammer III game image"),
        caption: t("Новый ориентир на карте имеет цену только внутри конкретной кампании", "A new map landmark gains value only inside a specific campaign"),
        sourceLabel: "Creative Assembly",
        sourceUrl: totalWarHub.pulse.changes[0]!.sourceUrl
      }
    ]
  },

  ck3: {
    id: "ck3",
    slug: "crusader-kings-3",
    name: crusaderKingsHub.name,
    shortName: "CK3",
    publisher: crusaderKingsHub.publisher,
    title: crusaderKingsHub.meta.title,
    description: crusaderKingsHub.meta.description,
    eyebrow: t("Crusader Kings III · экономика династии · версия 1.19.0.6", "Crusader Kings III · dynasty economy · version 1.19.0.6"),
    heading: t("Хорошее правление оставляет наследнику не только титул, но и свободу действий.", "A strong reign leaves the heir more than a title. It leaves options."),
    lede: t("Свяжи домен, строительство, войну, активности и наследование в один финансовый горизонт. А будущую торговлю держи в списке наблюдения до релиза, не в текущих формулах.", "Connect domain, building, war, activities and succession inside one financial horizon. Keep future trade on a watchlist until release, not inside current formulas."),
    valueTitle: t("Казна является наследуемым защитным активом", "The treasury is an inherited defensive asset"),
    valueText: t("Модель сравнивает прирост дохода с горизонтом владения, военным оттоком и расходами передачи власти. Ликвидность сохраняет варианты в момент, когда восстановить её труднее всего.", "The model compares marginal income with ownership horizon, wartime burn and transition cost. Liquidity preserves options precisely when rebuilding it is hardest."),
    version: crusaderKingsHub.version,
    checkedAt: crusaderKingsHub.checkedAt,
    sourceLabel: t("Paradox · обновление 1.19.0.6", "Paradox · Update 1.19.0.6"),
    sourceUrl: crusaderKingsHub.pulse.changes[0]!.sourceUrl,
    stats: [
      { value: "7", label: t("звеньев династии", "dynasty links") },
      { value: "3", label: t("пути правления", "ruler routes") },
      { value: "3", label: t("живые модели", "live models") },
      { value: guideCount("ck3"), label: t("полных гайда", "full guides") }
    ],
    sections: [
      section("economy", "01", "Д", t("Экономика", "Economy"), t("Монета от домена до наследника", "One gold from domain to heir"), t("Домен, налоги, казна, здания, армия, активности и наследование как единая система.", "Domain, taxes, treasury, buildings, army, activities and succession as one system."), t("Увидишь, какое обязательство переживёт правителя", "See which commitment outlives the ruler"), t("Куда уходит золото на горизонте правления?", "Where does gold move across the reign?")),
      section("player-paths", "02", "К", t("Маршруты", "Player paths"), t("Строитель домена, защитник или экспансионист", "Domain builder, stabilizer or expansionist"), t("Три пути с разным горизонтом, целевым резервом и риском наследования.", "Three paths with different horizons, reserve targets and succession risk."), t("Получишь порядок до следующей точки пересмотра", "Get an order through the next review point"), t("Какой режим правления соответствует моему риску?", "Which operating mode fits my succession risk?")),
      section("meta", "03", "1.19", t("Мета", "Meta"), t("Текущая версия и отдельный список наблюдения", "Current version and a separate watchlist"), t("Книга учёта версии 1.19, проверенные исправления и будущий Silk & Silver без выдуманных доходов.", "The 1.19 Ledger, verified fixes and future Silk & Silver without invented income formulas."), t("Отделишь живую механику от анонса", "Separate live mechanics from announced scope"), t("Что уже можно учитывать, а что ещё нельзя моделировать?", "What can be modeled now and what is not live yet?")),
      section("guides", "04", "Л", t("Гайды", "Guides"), t("Планы для домена, войны и наследования", "Plans for domain, war and succession"), t("Полные гайды по книге учёта, окупаемости здания и военной казне перед объявлением войны.", "Full guides for the Ledger, building payback and the war chest before declaring war."), t("Получишь сценарий с плохим исходом, а не идеальную линию", "Get a downside case, not an ideal line"), t("Как оставить следующему правителю устойчивый старт?", "How do I leave the next ruler a resilient opening?")),
      section("tools", "05", "Σ", t("Инструменты", "Tools"), t("Домен, война и резерв наследника", "Domain, war and heir buffer"), t("Три модели с редактируемым сроком, риском потери владения и расходами перехода.", "Three models with editable horizon, holding-loss risk and transition cost."), t("Проверишь решение при слабом наследнике", "Test the decision under a weak-heir case"), t("Останется ли свобода действий после передачи власти?", "Will optionality survive the transfer of power?"))
    ],
    media: [{
      src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1158310/07b3c23cd831fb520b8192f03e687e4fab535eef/capsule_616x353.jpg",
      alt: t("Официальная капсула Crusader Kings III", "Official Crusader Kings III capsule artwork"),
      caption: t("Текущий рабочий слой: версия 1.19.0.6. Будущая торговля не включена в расчёты.", "Current working layer: version 1.19.0.6. Future trade is not included in calculations."),
      sourceLabel: "Paradox Interactive / Steam",
      sourceUrl: crusaderKingsHub.pulse.changes[0]!.sourceUrl,
      position: "50% 35%"
    }]
  }
};

export const hubPortalList = Object.values(hubPortals);

export function getHubPath(id: HubPortalId, lang: HubLocale, sectionSlug?: HubSectionSlug): string {
  const prefix = lang === "en" ? "/en" : "";
  const base = `${prefix}/${hubPortals[id].slug}/`;
  return sectionSlug ? `${base}${sectionSlug}/` : base;
}

export function getHubByRouteSlug(slug: string): HubPortalConfig | undefined {
  return hubPortalList.find((hub) => hub.slug === slug);
}
