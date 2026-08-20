import type { ImageMetadata } from "astro";
import boobieIke from "../assets/gta-vi/boobie-ike-01.jpg";
import jasonLuciaRobbery from "../assets/gta-vi/jason-lucia-robbery.jpg";
import luciaCaminos from "../assets/gta-vi/lucia-caminos-06.jpg";
import officialCoverArt from "../assets/gta-vi/official-cover-art.jpg";
import viceCity from "../assets/gta-vi/vice-city-01.jpg";

export type GtaViLocale = "ru" | "en";
export type GtaViEvidenceStatus = "confirmed" | "precedent" | "unknown";
export type GtaViSectionId = "overview" | "economy" | "precedent" | "launch";

export interface GtaViLocalizedText {
  ru: string;
  en: string;
}

export interface GtaViSource {
  id: string;
  label: GtaViLocalizedText;
  publisher: string;
  url: string;
  checkedAt: string;
}

export interface GtaViMediaItem {
  id: string;
  asset: ImageMetadata;
  alt: GtaViLocalizedText;
  caption: GtaViLocalizedText;
  credit: string;
  sourceUrl: string;
}

export const gtaViWatch = {
  checkedAt: "2026-08-20",
  staleAfterDays: 8,
  releaseDate: "2026-11-19",
  nextOfficialEvent: {
    date: "2026-08-27",
    time: "15:00 ET",
    title: {
      ru: "Расширенный показ GTA VI",
      en: "Grand Theft Auto VI: An Extended Look"
    }
  },
  platforms: "PlayStation 5 · Xbox Series X|S",
  version: {
    ru: "Дорелизное досье · проверено 20.08.2026",
    en: "Pre-release dossier · checked Aug 20, 2026"
  }
} as const;

export const gtaViSources: GtaViSource[] = [
  {
    id: "official-game",
    label: { ru: "Официальная страница GTA VI", en: "Official GTA VI page" },
    publisher: "Rockstar Games",
    url: "https://www.rockstargames.com/VI",
    checkedAt: gtaViWatch.checkedAt
  },
  {
    id: "leonida",
    label: { ru: "Only in Leonida: персонажи и мир", en: "Only in Leonida: characters and world" },
    publisher: "Rockstar Games",
    url: "https://www.rockstargames.com/VI/only-in-leonida",
    checkedAt: gtaViWatch.checkedAt
  },
  {
    id: "media",
    label: { ru: "Официальные материалы GTA VI", en: "Official GTA VI media" },
    publisher: "Rockstar Games",
    url: "https://www.rockstargames.com/VI/media",
    checkedAt: gtaViWatch.checkedAt
  },
  {
    id: "release-date",
    label: { ru: "Дата выхода 19 ноября 2026 года", en: "November 19, 2026 release date" },
    publisher: "Rockstar Games",
    url: "https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026",
    checkedAt: gtaViWatch.checkedAt
  },
  {
    id: "extended-look",
    label: { ru: "Анонс расширенного показа", en: "Extended Look announcement" },
    publisher: "Rockstar Games",
    url: "https://www.rockstargames.com/newswire/article/9k2kaa1o3297k9/grand-theft-auto-vi-an-extended-look",
    checkedAt: gtaViWatch.checkedAt
  },
  {
    id: "take-two-preorders",
    label: { ru: "Издания, цена и предварительная загрузка", en: "Editions, pricing and preload details" },
    publisher: "Take-Two Interactive",
    url: "https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi",
    checkedAt: gtaViWatch.checkedAt
  }
];

export const gtaViMedia: Record<"cover" | "city" | "robbery" | "boobie" | "lucia", GtaViMediaItem> = {
  cover: {
    id: "official-cover-art",
    asset: officialCoverArt,
    alt: {
      ru: "Официальная обложка GTA VI с Люсией, Джейсоном и сценами Леониды",
      en: "Official GTA VI cover art featuring Lucia, Jason and scenes from Leonida"
    },
    caption: { ru: "Официальная обложка GTA VI", en: "Official GTA VI cover art" },
    credit: "Rockstar Games",
    sourceUrl: "https://www.rockstargames.com/VI/media/artwork-wallpapers"
  },
  city: {
    id: "vice-city-01",
    asset: viceCity,
    alt: {
      ru: "Официальный кадр GTA VI с улицей Вайс-Сити",
      en: "Official GTA VI image showing a Vice City street"
    },
    caption: { ru: "Вайс-Сити, штат Леонида", en: "Vice City, State of Leonida" },
    credit: "Rockstar Games",
    sourceUrl: "https://www.rockstargames.com/VI/media/screenshots"
  },
  robbery: {
    id: "jason-lucia-robbery",
    asset: jasonLuciaRobbery,
    alt: {
      ru: "Официальный кадр GTA VI с Джейсоном и Люсией во время ограбления",
      en: "Official GTA VI image of Jason and Lucia during a robbery"
    },
    caption: { ru: "Джейсон и Люсия во время ограбления", en: "Jason and Lucia during a robbery" },
    credit: "Rockstar Games",
    sourceUrl: "https://www.rockstargames.com/VI/media/screenshots"
  },
  boobie: {
    id: "boobie-ike-01",
    asset: boobieIke,
    alt: {
      ru: "Официальный кадр GTA VI с Буби Айком",
      en: "Official GTA VI image of Boobie Ike"
    },
    caption: { ru: "Буби Айк и его деловая империя", en: "Boobie Ike and his business empire" },
    credit: "Rockstar Games",
    sourceUrl: "https://www.rockstargames.com/VI/media/screenshots"
  },
  lucia: {
    id: "lucia-caminos-06",
    asset: luciaCaminos,
    alt: {
      ru: "Официальный кадр GTA VI с Люсией Каминос",
      en: "Official GTA VI image of Lucia Caminos"
    },
    caption: { ru: "Люсия Каминос", en: "Lucia Caminos" },
    credit: "Rockstar Games",
    sourceUrl: "https://www.rockstargames.com/VI/media/screenshots"
  }
};

export const gtaViConfirmedFacts = [
  {
    id: "release",
    label: { ru: "Дата выхода", en: "Release date" },
    value: { ru: "19 ноября 2026", en: "November 19, 2026" },
    detail: { ru: "Официально объявлена Rockstar Games.", en: "Officially announced by Rockstar Games." },
    sourceId: "release-date"
  },
  {
    id: "platforms",
    label: { ru: "Платформы на старте", en: "Launch platforms" },
    value: { ru: "PS5 и Xbox Series X|S", en: "PS5 and Xbox Series X|S" },
    detail: { ru: "Другие платформы в текущем анонсе не указаны.", en: "No other platforms are listed in the current announcement." },
    sourceId: "official-game"
  },
  {
    id: "mode",
    label: { ru: "Подтвержденный формат", en: "Confirmed format" },
    value: { ru: "Одиночная игра", en: "Single-player" },
    detail: { ru: "Сетевой режим, его дата и экономика пока не объявлены.", en: "An online mode, its date and economy have not been announced." },
    sourceId: "take-two-preorders"
  },
  {
    id: "price",
    label: { ru: "Стандартное издание", en: "Standard Edition" },
    value: { ru: "$79,99 в США", en: "$79.99 US list price" },
    detail: { ru: "Цена относится к официальному сообщению о предзаказах.", en: "Price comes from the official preorder announcement." },
    sourceId: "take-two-preorders"
  }
] as const;

export const gtaViSignals = [
  {
    id: "enterprise",
    status: "confirmed" as const,
    title: { ru: "Бизнесы связаны между собой", en: "Businesses form connected networks" },
    evidence: {
      ru: "Rockstar описывает империю Буби Айка: недвижимость, стрип-клуб, студия и партнерство с Only Raw Records.",
      en: "Rockstar describes Boobie Ike's empire across real estate, a strip club, a recording studio and Only Raw Records."
    },
    boundary: {
      ru: "Это подтверждает устройство мира и сюжетные связи, но не покупку или управление этими активами игроком.",
      en: "This confirms world-building and story relationships, not that the player can buy or operate these assets."
    },
    measure: {
      ru: "После выхода проверим собственность, вложения, постоянные расходы и денежный поток.",
      en: "At launch we will test ownership, investment, recurring costs and cash flow."
    },
    sourceId: "leonida"
  },
  {
    id: "scores",
    status: "confirmed" as const,
    title: { ru: "Ограбления заданы как выбор риска", en: "Robberies are framed as risk decisions" },
    evidence: {
      ru: "Джейсон и Люсия показаны во время ограбления, а Рауль Баутиста официально описан как опытный грабитель банков, который ищет более крупный куш.",
      en: "Jason and Lucia are shown during a robbery, while Raul Bautista is described as a seasoned bank robber looking for bigger scores."
    },
    boundary: {
      ru: "Размер выплат, подготовительные расходы, доли участников и последствия провала не раскрыты.",
      en: "Payouts, setup costs, crew cuts and failure consequences remain undisclosed."
    },
    measure: {
      ru: "Сведем валовую выплату, обязательные расходы, время, вероятность потери и чистый результат.",
      en: "We will record gross payout, required costs, time, loss risk and net outcome."
    },
    sourceId: "leonida"
  },
  {
    id: "shadow-economy",
    status: "confirmed" as const,
    title: { ru: "Теневая экономика вплетена в быт", en: "The shadow economy runs through everyday life" },
    evidence: {
      ru: "Джейсон работает на местных наркоторговцев, а Брайан Хедер ведет контрабанду через лодочную мастерскую и предоставляет жилье в обмен на работу.",
      en: "Jason works for local drug runners, while Brian Heder runs smuggling through a boat yard and provides housing in exchange for work."
    },
    boundary: {
      ru: "Не подтверждены свободная торговля, цепочки поставок или доход от лодочной мастерской.",
      en: "Free trading, supply chains and boat-yard income are not confirmed mechanics."
    },
    measure: {
      ru: "Проверим, какие сюжетные отношения становятся повторяемыми экономическими циклами.",
      en: "We will test which story relationships become repeatable economic loops."
    },
    sourceId: "leonida"
  },
  {
    id: "attention",
    status: "confirmed" as const,
    title: { ru: "Внимание показано как капитал", en: "Attention is presented as capital" },
    evidence: {
      ru: "Dre'Quan развивает музыкальный бизнес, а Real Dimez используют социальные сети для продвижения своей музыки.",
      en: "Dre'Quan is building a music business, while Real Dimez use social media to promote their music."
    },
    boundary: {
      ru: "Это не подтверждает игровую систему популярности, контрактов или дохода от аудитории.",
      en: "This does not confirm a playable fame, contract or audience-revenue system."
    },
    measure: {
      ru: "Отделим сюжетное оформление от любых измеримых механик репутации и дохода.",
      en: "We will separate narrative presentation from measurable reputation and income mechanics."
    },
    sourceId: "leonida"
  }
];

export const gtaViUnknowns = [
  { ru: "Сколько денег будет у игрока в начале и одинаков ли баланс у двух героев?", en: "How much starting cash will the player have, and do both protagonists share a balance?" },
  { ru: "Можно ли покупать недвижимость и действующие бизнесы?", en: "Can the player buy property and operating businesses?" },
  { ru: "Есть ли повторяемые источники дохода помимо заданий?", en: "Are there repeatable income sources beyond missions?" },
  { ru: "Как устроены расходы на оружие, транспорт, лечение и неудачи?", en: "How do weapons, vehicles, recovery and failure costs work?" },
  { ru: "Вернется ли рынок акций и будет ли он связан с действиями игрока?", en: "Will a stock market return, and will player actions affect it?" },
  { ru: "Какие покупки открывают новые возможности, а какие остаются предметами роскоши?", en: "Which purchases unlock capability, and which remain luxury consumption?" },
  { ru: "Существует ли отдельный сетевой режим и когда он может выйти?", en: "Will there be a separate online mode, and when might it launch?" },
  { ru: "Будет ли экономика меняться после выхода через обновления?", en: "Will post-launch updates change the economy?" }
] as const;

export const gtaViPrecedents = [
  {
    lens: { ru: "Валовая выплата и чистый результат", en: "Headline payout versus net result" },
    carries: {
      ru: "Полезно всегда вычитать обязательные расходы и доли участников.",
      en: "It is always useful to subtract required costs and participant cuts."
    },
    doesNotCarry: {
      ru: "Нельзя переносить размеры выплат и структуру ограблений GTA Online.",
      en: "GTA Online payout sizes and heist structures cannot be carried over."
    },
    launchTest: { ru: "Чистые деньги за завершенный цикл", en: "Net cash per completed loop" }
  },
  {
    lens: { ru: "Цена покупки и открываемые возможности", en: "Purchase price versus unlocked capability" },
    carries: {
      ru: "Покупку стоит оценивать по новым маршрутам, экономии времени и доступу.",
      en: "A purchase should be judged by new routes, time saved and access unlocked."
    },
    doesNotCarry: {
      ru: "Нельзя считать, что недвижимость и бизнесы будут устроены как в GTA Online.",
      en: "Property and businesses cannot be assumed to work like GTA Online."
    },
    launchTest: { ru: "Стоимость одного нового преимущества", en: "Cost per newly unlocked capability" }
  },
  {
    lens: { ru: "Время игрока и игровое время", en: "Player time versus world time" },
    carries: {
      ru: "Нужно разделять активную работу, ожидание и путь между действиями.",
      en: "Active work, waiting and travel should be measured separately."
    },
    doesNotCarry: {
      ru: "Нельзя заранее ожидать пассивное производство или таймеры GTA Online.",
      en: "Passive production or GTA Online timers cannot be assumed."
    },
    launchTest: { ru: "Чистый результат на минуту внимания", en: "Net result per minute of attention" }
  },
  {
    lens: { ru: "Риск и стоимость провала", en: "Risk and the cost of failure" },
    carries: {
      ru: "Доход без учета перезапусков и потерь переоценивает маршрут.",
      en: "Income that ignores restarts and losses overstates a route."
    },
    doesNotCarry: {
      ru: "Нельзя переносить правила смертей, розыска или страховки.",
      en: "Death, wanted-level or insurance rules cannot be carried over."
    },
    launchTest: { ru: "Ожидаемый результат с учетом неудач", en: "Expected outcome after failures" }
  },
  {
    lens: { ru: "Связи между активами", en: "Connections between assets" },
    carries: {
      ru: "Ценность одной покупки может зависеть от уже открытых маршрутов.",
      en: "One purchase may be valuable because of routes already unlocked."
    },
    doesNotCarry: {
      ru: "Нельзя предполагать портфельные связи Ночного клуба или мотоклуба.",
      en: "Nightclub or Motorcycle Club portfolio links cannot be assumed."
    },
    launchTest: { ru: "Дополнительная ценность связки", en: "Incremental value of the connection" }
  }
] as const;

export const gtaViLaunchPhases = [
  {
    window: "T-90 → T-1",
    title: { ru: "До релиза", en: "Before release" },
    goal: { ru: "Фиксировать только официальные факты и список открытых вопросов.", en: "Record only official facts and a ledger of open questions." },
    output: { ru: "Версия досье с датой каждой проверки", en: "A versioned dossier with a check date on every claim" }
  },
  {
    window: "0 → 6H",
    title: { ru: "Карта системы", en: "System map" },
    goal: { ru: "Понять валюты, расходы, сохранения, героев и первые ограничения.", en: "Identify currencies, expenses, saves, protagonists and early constraints." },
    output: { ru: "Словарь механик без преждевременных советов", en: "A mechanics glossary without premature recommendations" }
  },
  {
    window: "6 → 24H",
    title: { ru: "Повторяемые циклы", en: "Repeatable loops" },
    goal: { ru: "Трижды повторить доступные источники денег и записать полный цикл.", en: "Repeat available money loops three times and record the full cycle." },
    output: { ru: "Диапазоны выплат, времени и риска", en: "Ranges for payout, time and risk" }
  },
  {
    window: "24 → 72H",
    title: { ru: "Решения о капитале", en: "Capital decisions" },
    goal: { ru: "Проверить покупки, которые меняют доступ, скорость и надежность.", en: "Test purchases that change access, speed and reliability." },
    output: { ru: "Первые проверяемые маршруты и границы уверенности", en: "First testable routes with confidence boundaries" }
  }
] as const;

export const gtaViLaunchMetrics = [
  { code: "CASH-01", name: { ru: "Чистая выплата", en: "Net payout" }, definition: { ru: "Полученные деньги минус обязательные расходы.", en: "Money received minus required costs." } },
  { code: "TIME-01", name: { ru: "Активное время", en: "Active time" }, definition: { ru: "Минуты, когда игрок занят именно этим циклом.", en: "Minutes during which the player is occupied by the loop." } },
  { code: "TIME-02", name: { ru: "Путь и ожидание", en: "Travel and waiting" }, definition: { ru: "Время вне основной задачи, необходимое для результата.", en: "Time outside the core task that is required for the outcome." } },
  { code: "RISK-01", name: { ru: "Стоимость провала", en: "Failure cost" }, definition: { ru: "Потерянные деньги, предметы и время после неудачи.", en: "Cash, items and time lost after failure." } },
  { code: "CAP-01", name: { ru: "Цена доступа", en: "Access cost" }, definition: { ru: "Сумма, которую нужно вложить до первого цикла.", en: "Capital required before the first loop can run." } },
  { code: "CAP-02", name: { ru: "Срок возврата", en: "Payback horizon" }, definition: { ru: "Сколько успешных циклов возвращают вложение.", en: "How many successful loops recover the investment." } },
  { code: "UTIL-01", name: { ru: "Открытые возможности", en: "Capability unlocked" }, definition: { ru: "Новые задания, зоны, действия или экономия времени.", en: "New missions, areas, actions or time savings." } },
  { code: "REL-01", name: { ru: "Повторяемость", en: "Repeatability" }, definition: { ru: "Насколько результат сохраняется между тремя попытками.", en: "How stable the outcome remains across three attempts." } },
  { code: "CONF-01", name: { ru: "Уровень уверенности", en: "Confidence level" }, definition: { ru: "Наблюдение, повторная проверка или подтвержденное правило.", en: "Observation, repeated test or confirmed rule." } }
] as const;

export const gtaViUpdateLog = [
  {
    date: "2026-08-20",
    title: { ru: "Открыто дорелизное досье Money Meta", en: "Money Meta pre-release dossier opened" },
    text: {
      ru: "Собраны официальная дата, платформы, издания и сюжетные сигналы. Неподтвержденные механики вынесены в отдельный список.",
      en: "Official date, platforms, editions and narrative signals were logged. Unconfirmed mechanics were moved to a separate ledger."
    }
  },
  {
    date: "2026-08-27",
    title: { ru: "Следующая плановая проверка", en: "Next scheduled verification" },
    text: {
      ru: "После расширенного показа обновим только те выводы, которые можно привязать к прямому материалу Rockstar.",
      en: "After the Extended Look, we will update only conclusions tied directly to Rockstar material."
    }
  },
  {
    date: "2026-11-19",
    title: { ru: "Переход к измерениям", en: "Measurement begins" },
    text: {
      ru: "После выхода досье сменит режим: вместо гипотез появятся повторяемые замеры и версии игры.",
      en: "At release, the dossier changes mode from hypotheses to repeatable measurements and game-version tracking."
    }
  }
] as const;

export const gtaViRoutes: Record<GtaViSectionId, { path: string; label: GtaViLocalizedText; eyebrow: GtaViLocalizedText; summary: GtaViLocalizedText }> = {
  overview: {
    path: "/gta-6/",
    label: { ru: "Живое досье", en: "Living dossier" },
    eyebrow: { ru: "Стартовая точка", en: "Start here" },
    summary: { ru: "Что подтверждено сейчас, что остается неизвестным и когда будет следующая проверка.", en: "What is confirmed now, what remains unknown and when the next check happens." }
  },
  economy: {
    path: "/gta-6/economy/",
    label: { ru: "Сигналы экономики", en: "Economy signals" },
    eyebrow: { ru: "Факты и границы", en: "Facts and boundaries" },
    summary: { ru: "Что официальный мир говорит о бизнесах, ограблениях, контрабанде и внимании как капитале.", en: "What the official world reveals about businesses, robberies, smuggling and attention as capital." }
  },
  precedent: {
    path: "/gta-6/from-gta-online/",
    label: { ru: "Уроки GTA Online", en: "Lessons from GTA Online" },
    eyebrow: { ru: "Прецедент, не прогноз", en: "Precedent, not prediction" },
    summary: { ru: "Какие способы анализа полезны снова и какие механики нельзя переносить в новую игру.", en: "Which analytical lenses remain useful and which mechanics cannot be carried into the new game." }
  },
  launch: {
    path: "/gta-6/launch-watch/",
    label: { ru: "Первые 72 часа", en: "First 72 hours" },
    eyebrow: { ru: "Протокол измерений", en: "Measurement protocol" },
    summary: { ru: "Как Money Meta будет проверять выплаты, время, риск, покупки и повторяемость без гонки за сырыми советами.", en: "How Money Meta will test payouts, time, risk, purchases and repeatability without rushing out raw advice." }
  }
};

export function getGtaViPath(section: GtaViSectionId, lang: GtaViLocale): string {
  return `${lang === "en" ? "/en" : ""}${gtaViRoutes[section].path}`;
}

export function getGtaViSource(id: string): GtaViSource {
  const source = gtaViSources.find((item) => item.id === id);
  if (!source) throw new Error(`Unknown GTA VI source: ${id}`);
  return source;
}
