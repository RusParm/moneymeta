export type FrontierLocale = "ru" | "en";
export type FrontierHubId = "civ7" | "fable";
export type FrontierHubStatus = "live" | "watch";
export type FrontierSectionSlug = "economy" | "meta" | "tools" | "launch-watch" | "sources";

export type FrontierLocalized = Record<FrontierLocale, string>;

export interface FrontierSource {
  id: string;
  label: FrontierLocalized;
  title: FrontierLocalized;
  url: string;
  publishedAt?: string;
  checkedAt: string;
}

export interface FrontierEvidence {
  id: string;
  status: "verified" | "announced" | "unknown";
  mark: string;
  title: FrontierLocalized;
  claim: FrontierLocalized;
  boundary: FrontierLocalized;
  sourceId?: string;
}

export interface FrontierSection {
  slug: FrontierSectionSlug;
  code: string;
  mark: string;
  label: FrontierLocalized;
  title: FrontierLocalized;
  description: FrontierLocalized;
  question: FrontierLocalized;
  outcome: FrontierLocalized;
}

export interface FrontierStage {
  mark: string;
  title: FrontierLocalized;
  text: FrontierLocalized;
  decision: FrontierLocalized;
}

export interface FrontierHub {
  id: FrontierHubId;
  slug: string;
  status: FrontierHubStatus;
  name: string;
  shortName: string;
  publisher: string;
  title: FrontierLocalized;
  description: FrontierLocalized;
  eyebrow: FrontierLocalized;
  heading: FrontierLocalized;
  lede: FrontierLocalized;
  version: FrontierLocalized;
  checkedAt: string;
  staleAfterDays: number;
  promise: FrontierLocalized;
  proof: Array<{ value: string; label: FrontierLocalized }>;
  sections: FrontierSection[];
  stages: FrontierStage[];
  evidence: FrontierEvidence[];
  sources: FrontierSource[];
  openQuestions: FrontierLocalized[];
}

const t = (ru: string, en: string): FrontierLocalized => ({ ru, en });

const section = (
  slug: FrontierSectionSlug,
  code: string,
  mark: string,
  label: FrontierLocalized,
  title: FrontierLocalized,
  description: FrontierLocalized,
  question: FrontierLocalized,
  outcome: FrontierLocalized
): FrontierSection => ({ slug, code, mark, label, title, description, question, outcome });

export const civilizationHub: FrontierHub = {
  id: "civ7",
  slug: "civilization-7",
  status: "live",
  name: "Sid Meier's Civilization VII",
  shortName: "Civilization VII",
  publisher: "2K",
  title: t(
    "Экономика Civilization VII: постройки, поселения и экономическая победа | Money Meta",
    "Civilization VII economy: buildings, settlements and Economic Victory | Money Meta"
  ),
  description: t(
    "Живой хаб Civilization VII для решений по развитию поселений, окупаемости строительства и разрыву до экономической победы после обновления Test of Time.",
    "A live Civilization VII hub for settlement development, building payback and the Economic Victory gap after the Test of Time update."
  ),
  eyebrow: t("CIVILIZATION VII · ЖИВАЯ ЭКОНОМИКА", "CIVILIZATION VII · LIVE ECONOMY"),
  heading: t(
    "Большая цифра на клетке ещё не делает ход хорошим.",
    "The biggest number on a tile does not make the move good."
  ),
  lede: t(
    "Сравни стоимость производства, момент отдачи и цель эпохи. Все значения берутся из твоей партии, а правила текущей версии подтверждаются официальными материалами.",
    "Compare production cost, the moment value arrives and the objective for this Age. Every number comes from your game while current rules stay tied to official material."
  ),
  version: t("Обновление 1.4.1 · Test of Time", "Update 1.4.1 · Test of Time"),
  checkedAt: "2026-09-01",
  staleAfterDays: 45,
  promise: t(
    "Money Meta не выбирает цивилизацию за тебя. Он показывает, успеет ли решение вернуть вложение, что ты откладываешь ради него и сколько ещё не хватает до цели.",
    "Money Meta does not choose a civilization for you. It shows whether a move can return its cost, what it delays and how much remains before the objective."
  ),
  proof: [
    { value: "1.4.1", label: t("текущая проверенная версия", "current verified version") },
    { value: "3", label: t("редактируемые модели", "editable models") },
    { value: "4", label: t("официальных источника", "official sources") },
    { value: "0", label: t("вымышленных значений", "invented values") }
  ],
  sections: [
    section(
      "economy",
      "01",
      "⌂",
      t("Экономика", "Economy"),
      t("Как поселение превращает производство в победу", "How a settlement converts production into victory"),
      t("Цепочка от клетки и специализации до здания, ресурсов, валового продукта и выбранной победы.", "The chain from tiles and specialization to buildings, Resources, GDP and the chosen victory."),
      t("Где мой следующий ход создаёт накопительный эффект?", "Where does my next move create compounding value?"),
      t("Увидишь узкое место и цену отложенного решения", "See the bottleneck and the cost of delay")
    ),
    section(
      "meta",
      "02",
      "1.4",
      t("Текущая версия", "Current version"),
      t("Что Test of Time действительно изменил", "What Test of Time actually changed"),
      t("Новые правила цивилизаций, Triumphs, побед, правительств и празднований без переноса старых гайдов в новую систему.", "The new civilization, Triumph, victory, Government and Celebration rules without carrying old guides into a new system."),
      t("Какое старое правило больше нельзя применять автоматически?", "Which old rule should no longer be applied automatically?"),
      t("Отделишь подтверждённое изменение от нашей интерпретации", "Separate a verified change from our interpretation")
    ),
    section(
      "tools",
      "03",
      "Σ",
      t("Инструменты", "Tools"),
      t("Проверь решение на цифрах своей партии", "Test the move with numbers from your game"),
      t("Окно окупаемости постройки, выбор развития поселения и разрыв до экономической победы с локальным сохранением сценария.", "A building payback window, settlement development choice and Economic Victory gap with local scenario persistence."),
      t("Успевает ли этот ход создать ценность до моего контрольного срока?", "Can this move create value before my checkpoint?"),
      t("Получишь вывод, чувствительность и следующий проверяемый шаг", "Get a conclusion, sensitivity and one testable next step")
    )
  ],
  stages: [
    {
      mark: "01",
      title: t("Собери фактические вводные", "Capture the actual inputs"),
      text: t("Стоимость, срок строительства и прирост бери из текущего поселения, а не из чужого идеального примера.", "Use the cost, build time and output delta from the current settlement, not somebody else's ideal example."),
      decision: t("Факт партии", "Game state")
    },
    {
      mark: "02",
      title: t("Назови контрольный срок", "Name the checkpoint"),
      text: t("Следующая война, переход эпохи, завершение Triumph или момент проверки победы задают реальную ценность времени.", "The next war, Age transition, Triumph or victory checkpoint defines the real value of time."),
      decision: t("Горизонт", "Horizon")
    },
    {
      mark: "03",
      title: t("Сравни с отложенным ходом", "Compare the delayed move"),
      text: t("Здание конкурирует с поселенцем, юнитом, специалистом и другим районом. В модели остаётся только та польза, которую ты готов защитить.", "A building competes with a Settler, unit, Specialist and another district. Keep only the value you are prepared to defend in the model."),
      decision: t("Цена выбора", "Trade-off")
    },
    {
      mark: "04",
      title: t("Повтори после изменения", "Rerun after the change"),
      text: t("Новый ресурс, правительство, праздник или соседняя постройка меняют вводные. Сценарий хранится локально и остаётся редактируемым.", "A new Resource, Government, Celebration or adjacent building changes the inputs. The scenario stays local and editable."),
      decision: t("Повторная проверка", "Review")
    }
  ],
  evidence: [
    {
      id: "time-tested-civs",
      status: "verified",
      mark: "AGE",
      title: t("Любая цивилизация в любой эпохе", "Any civilization in any Age"),
      claim: t("После Test of Time игрок может начать и продолжить кампанию выбранной цивилизацией в любой эпохе.", "After Test of Time, a player can start and continue a campaign as a chosen civilization in any Age."),
      boundary: t("Это не делает все сочетания одинаково сильными. Эффект конкретных бонусов всё равно зависит от партии.", "This does not make every combination equally strong. The value of specific bonuses still depends on the game."),
      sourceId: "civ-140"
    },
    {
      id: "triumphs",
      status: "verified",
      mark: "TRI",
      title: t("Legacy Paths заменены Triumphs", "Legacy Paths became Triumphs"),
      claim: t("Обновление 1.4.0 заменило Legacy Paths системой Triumphs и переработало победы.", "Update 1.4.0 replaced Legacy Paths with Triumphs and reworked victories."),
      boundary: t("Старый маршрут развития нельзя переносить без проверки новой цели и условий победы.", "An old development route cannot be carried forward without checking the new objective and victory rules."),
      sourceId: "civ-140"
    },
    {
      id: "economic-gdp",
      status: "verified",
      mark: "GDP",
      title: t("Экономическая победа строится через валовой продукт", "Economic Victory is built through GDP"),
      claim: t("Официальный справочник связывает валовой продукт с размещёнными ресурсами, Treasure Convoys и золотыми постройками.", "The official guide connects GDP to slotted Resources, Treasure Convoys and Gold Buildings."),
      boundary: t("Точные значения берутся из интерфейса текущей партии. Money Meta не подставляет универсальные числа.", "Exact values come from the current game interface. Money Meta does not substitute universal numbers."),
      sourceId: "civ-victories"
    },
    {
      id: "contextual-development",
      status: "verified",
      mark: "CTX",
      title: t("Самая большая цифра может вводить в заблуждение", "The biggest number can mislead"),
      claim: t("Официальный разбор развития поселений связывает выбор с лидером, политиками, соседством, атрибутами, чудесами и специалистами.", "The official settlement guide ties the choice to leaders, policies, adjacency, attributes, Wonders and Specialists."),
      boundary: t("Модель оценивает срок и обмен, но не заменяет позиционный контекст карты.", "The model evaluates timing and trade-offs, but cannot replace the positional context of the map."),
      sourceId: "civ-settlements"
    },
    {
      id: "hotseat-governments",
      status: "verified",
      mark: "1.4.1",
      title: t("Правительства и празднования переработаны", "Governments and Celebrations were reworked"),
      claim: t("Обновление 1.4.1 добавило Archipelago, Hotseat и переработало правительства и празднования.", "Update 1.4.1 added Archipelago and Hotseat and reworked Governments and Celebrations."),
      boundary: t("Это контекст версии. Оно не задаёт один лучший экономический порядок для всех лидеров.", "This is version context. It does not define one best economic order for every leader."),
      sourceId: "civ-141"
    }
  ],
  sources: [
    {
      id: "civ-140",
      label: t("Civilization VII · заметки обновления", "Civilization VII · update notes"),
      title: t("Обновление 1.4.0: Test of Time", "Update 1.4.0: Test of Time"),
      url: "https://civilization.2k.com/civ-vii/game-update-notes/2026-may-19-patch-1-4-0/",
      publishedAt: "2026-05-19",
      checkedAt: "2026-09-01"
    },
    {
      id: "civ-141",
      label: t("Civilization VII · заметки обновления", "Civilization VII · update notes"),
      title: t("Обновление 1.4.1", "Update 1.4.1"),
      url: "https://civilization.2k.com/civ-vii/game-update-notes/2026-jun-23-patch-1-4-1/",
      publishedAt: "2026-06-23",
      checkedAt: "2026-09-01"
    },
    {
      id: "civ-victories",
      label: t("Civilization VII · официальный справочник", "Civilization VII · official guide"),
      title: t("Победы", "Victories"),
      url: "https://civilization.2k.com/civ-vii/game-guide/gameplay/victories/",
      checkedAt: "2026-09-01"
    },
    {
      id: "civ-settlements",
      label: t("Civilization VII · официальный справочник", "Civilization VII · official guide"),
      title: t("Развитие поселений", "Developing Settlements"),
      url: "https://civilization.2k.com/civ-vii/game-guide/gameplay/developing-settlements/",
      checkedAt: "2026-09-01"
    }
  ],
  openQuestions: [
    t("Как меняется ценность одного хода между лидерами, картами и уровнями сложности?", "How does the value of one turn change across leaders, maps and difficulty levels?"),
    t("Какие сочетания ресурсов стабильно закрывают разрыв до экономической победы?", "Which Resource combinations consistently close the Economic Victory gap?"),
    t("Когда развитие города проигрывает ещё одному специализированному поселению?", "When does city development lose to another specialized settlement?")
  ]
};

export const fableHub: FrontierHub = {
  id: "fable",
  slug: "fable",
  status: "watch",
  name: "Fable",
  shortName: "Fable",
  publisher: "Xbox Game Studios",
  title: t(
    "Экономика Fable: работа, собственность, цены и репутация | Money Meta",
    "Fable economy: jobs, property, prices and reputation | Money Meta"
  ),
  description: t(
    "Предрелизное досье Fable с подтверждёнными экономическими механиками, явными неизвестными и протоколом измерений после выхода игры осенью 2026 года.",
    "A pre-release Fable dossier with confirmed economic mechanics, explicit unknowns and a post-launch measurement protocol for Autumn 2026."
  ),
  eyebrow: t("FABLE · ПРЕДРЕЛИЗНОЕ ДОСЬЕ", "FABLE · PRE-RELEASE DOSSIER"),
  heading: t(
    "В Альбионе уже есть экономика. Её формул пока нет.",
    "Albion already has an economy. Its formulas are not public yet."
  ),
  lede: t(
    "Playground Games подтвердила работу, собственность, репутацию и влияние на цены. До релиза мы собираем доказательства и вопросы, а не рисуем фальшивую окупаемость.",
    "Playground Games has confirmed jobs, property, reputation and price effects. Before launch, we collect evidence and questions instead of publishing fake payback numbers."
  ),
  version: t("Релиз заявлен на осень 2026", "Announced for Autumn 2026"),
  checkedAt: "2026-09-01",
  staleAfterDays: 30,
  promise: t(
    "В день релиза хаб начнёт не с тир-листа. Сначала мы запишем условия, повторим наблюдения и только потом превратим устойчивые диапазоны в модель.",
    "On release day, the hub will not start with a tier list. We will record conditions, repeat observations and only then turn stable ranges into a model."
  ),
  proof: [
    { value: "1000+", label: t("заявленных постоянных жителей", "announced persistent residents") },
    { value: "5", label: t("подтверждённых сигналов", "confirmed signals") },
    { value: "6", label: t("явных неизвестных", "explicit unknowns") },
    { value: "0", label: t("предрелизных калькуляторов", "pre-release calculators") }
  ],
  sections: [
    section(
      "economy",
      "01",
      "£",
      t("Экономические сигналы", "Economy signals"),
      t("Что уже подтверждено про деньги и общество", "What is confirmed about money and society"),
      t("Работа, собственность, распорядок жителей, локальная репутация и цены с точной границей каждого утверждения.", "Jobs, property, resident routines, local reputation and prices with a precise boundary around every claim."),
      t("Какие экономические действия действительно существуют?", "Which economic actions are actually confirmed?"),
      t("Получишь карту фактов без домыслов о формулах", "Get a fact map without invented formulas")
    ),
    section(
      "launch-watch",
      "02",
      "72H",
      t("Первые 72 часа", "First 72 hours"),
      t("Как превратить релизный шум в проверяемые данные", "How to turn launch noise into testable data"),
      t("Версия, поселение, репутация, обязательные расходы, время и повторные попытки записываются до первого совета.", "Version, settlement, reputation, required costs, time and repeated attempts are captured before the first recommendation."),
      t("Что нужно измерить до публикации первой модели?", "What must be measured before the first model is published?"),
      t("Получишь готовый протокол наблюдения и критерии допуска", "Get a measurement protocol and publication gates")
    ),
    section(
      "sources",
      "03",
      "SRC",
      t("Доказательства", "Evidence"),
      t("Каждое утверждение ведёт к первоисточнику", "Every claim leads to a primary source"),
      t("Датированный реестр Xbox Wire и явный список того, чего разработчики пока не раскрыли.", "A dated Xbox Wire registry and an explicit list of what the developers have not revealed."),
      t("Откуда взят факт и где заканчивается вывод?", "Where does the fact come from and where does the inference stop?"),
      t("Сможешь проверить основание каждого тезиса", "Verify the basis of every material claim")
    )
  ],
  stages: [
    {
      mark: "01",
      title: t("Запиши состояние мира", "Capture the world state"),
      text: t("Версия, платформа, поселение, этап сюжета, местная репутация и доступные действия создают контекст наблюдения.", "Version, platform, settlement, story stage, local reputation and available actions define the observation context."),
      decision: t("Контекст", "Context")
    },
    {
      mark: "02",
      title: t("Посчитай полный вход", "Count the full entry cost"),
      text: t("Цена объекта, обязательные улучшения, рабочее время и потерянная альтернатива записываются отдельно.", "Property price, required upgrades, working time and the delayed alternative are recorded separately."),
      decision: t("Полная цена", "Full cost")
    },
    {
      mark: "03",
      title: t("Повтори при тех же условиях", "Repeat under matched conditions"),
      text: t("Один результат остаётся наблюдением. Диапазон появляется только после нескольких сопоставимых попыток.", "One result remains an observation. A range appears only after several comparable attempts."),
      decision: t("Повторяемость", "Repeatability")
    },
    {
      mark: "04",
      title: t("Проверь изменение репутации", "Test the reputation change"),
      text: t("Сравни одинаковую корзину и действие в одном поселении до и после устойчивого изменения отношения жителей.", "Compare the same basket and action in one settlement before and after a stable reputation change."),
      decision: t("Причина", "Causality")
    }
  ],
  evidence: [
    {
      id: "release-window",
      status: "announced",
      mark: "2026",
      title: t("Релиз заявлен на осень 2026", "Launch is announced for Autumn 2026"),
      claim: t("Xbox называет осень 2026 года и перечисляет Xbox Series X|S, Xbox PC, Xbox Cloud, Steam и PlayStation 5.", "Xbox names Autumn 2026 and lists Xbox Series X|S, Xbox PC, Xbox Cloud, Steam and PlayStation 5."),
      boundary: t("Точная дата и состояние релизной версии в источнике не указаны.", "The source does not provide an exact date or final launch build state."),
      sourceId: "fable-overview"
    },
    {
      id: "reputation-prices",
      status: "verified",
      mark: "REP",
      title: t("Репутация зависит от поселения и влияет на цены", "Reputation is local and can affect prices"),
      claim: t("Разработчики описывают разную репутацию в поселениях и её влияние на отношение людей и цены в магазинах.", "The developers describe settlement-specific reputation affecting how people react and the prices found in shops."),
      boundary: t("Формула, величина скидки и список затронутых товаров пока не раскрыты.", "The formula, discount size and affected goods have not been disclosed."),
      sourceId: "fable-overview"
    },
    {
      id: "living-population",
      status: "announced",
      mark: "1000+",
      title: t("Более тысячи постоянных жителей", "More than one thousand persistent residents"),
      claim: t("Playground Games заявляет более тысячи жителей с характерами, ролями, распорядком, работой и домом.", "Playground Games says the world contains more than one thousand residents with personalities, roles, routines, jobs and homes."),
      boundary: t("Это заявленный масштаб симуляции, а не подтверждённая производительность или глубина каждой экономической цепочки.", "This is the announced simulation scale, not verified performance or depth for every economic chain."),
      sourceId: "fable-population"
    },
    {
      id: "jobs-property",
      status: "announced",
      mark: "JOB",
      title: t("Работа, дом и брак подтверждены", "Jobs, homes and marriage are confirmed"),
      claim: t("Официальный обзор говорит, что герой может устроиться на работу, поселиться и вступить в брак.", "The official overview says the hero can get a job, settle down and marry."),
      boundary: t("Доходы, затраты времени, ограничения и связь этих систем с сюжетом пока неизвестны.", "Income, time costs, restrictions and story dependencies remain unknown."),
      sourceId: "fable-overview"
    },
    {
      id: "landlord-blacksmith",
      status: "announced",
      mark: "OWN",
      title: t("Упомянуты арендодатель и кузнец", "Landlord and blacksmith paths are named"),
      claim: t("Официальное описание прямо упоминает возможность разбогатеть как арендодатель или кузнец.", "The official product description explicitly names becoming rich as a landlord or blacksmith."),
      boundary: t("Это подтверждает направление игры, но не окупаемость, масштаб владения или лучший способ заработка.", "This confirms the direction of play, not payback, ownership scale or a best money-making route."),
      sourceId: "fable-overview"
    },
    {
      id: "economic-formulas",
      status: "unknown",
      mark: "?",
      title: t("Экономические формулы не опубликованы", "Economic formulas are not published"),
      claim: t("Разработчики обещают подробнее рассказать о социальной и экономической симуляции до релиза.", "The developers say more about the social and economic simulation will be shared before launch."),
      boundary: t("До этого момента Money Meta не публикует цены, доходность и универсальные рейтинги.", "Until then, Money Meta will not publish prices, returns or universal rankings."),
      sourceId: "fable-overview"
    }
  ],
  sources: [
    {
      id: "fable-overview",
      label: t("Xbox Wire · интервью с разработчиками", "Xbox Wire · developer interview"),
      title: t("Подробный обзор Fable", "Fable deep dive"),
      url: "https://news.xbox.com/en-us/2026/01/22/fable-interview-overview-details-developer-direct-2026/",
      publishedAt: "2026-01-22",
      checkedAt: "2026-09-01"
    },
    {
      id: "fable-population",
      label: t("Xbox Wire · интервью с разработчиками", "Xbox Wire · developer interview"),
      title: t("Как устроено живое население Fable", "How Fable's living population works"),
      url: "https://news.xbox.com/en-us/2026/06/10/fable-living-population-details-explained-xbox-games-showcase-2026/",
      publishedAt: "2026-06-10",
      checkedAt: "2026-09-01"
    }
  ],
  openQuestions: [
    t("Как именно местная репутация меняет цены покупки и продажи?", "How exactly does local reputation change buy and sell prices?"),
    t("Можно ли владеть несколькими объектами и какие расходы несёт собственник?", "Can the player own multiple properties and which costs does ownership create?"),
    t("Как считается оплата работы и ограничено ли число рабочих циклов?", "How are wages calculated and are work cycles limited?"),
    t("Есть ли у товаров, домов и услуг локальные рынки или единые цены?", "Do goods, homes and services have local markets or global prices?"),
    t("Какие действия устойчиво меняют репутацию и насколько обратим эффект?", "Which actions reliably change reputation and how reversible is the effect?"),
    t("Будет ли доступен поддерживаемый экспорт сохранения или другой безопасный источник данных?", "Will a supported save export or another safe data source be available?")
  ]
};

export const frontierHubs: Record<FrontierHubId, FrontierHub> = {
  civ7: civilizationHub,
  fable: fableHub
};

export const frontierHubList = Object.values(frontierHubs);

export function getFrontierPath(id: FrontierHubId, lang: FrontierLocale, sectionSlug?: FrontierSectionSlug): string {
  const prefix = lang === "ru" ? "" : "/en";
  const base = `${prefix}/${frontierHubs[id].slug}/`;
  return sectionSlug ? `${base}${sectionSlug}/` : base;
}

export function getFrontierSource(hub: FrontierHub, id?: string): FrontierSource | undefined {
  return id ? hub.sources.find((source) => source.id === id) : undefined;
}
