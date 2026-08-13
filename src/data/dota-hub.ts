import { dotaPatchContext, type DotaLocale } from "./dota-economy";

const currentPatch = dotaPatchContext.patch;

type Localized = Record<DotaLocale, string>;

export interface DotaMediaAsset {
  key: string;
  type: "item" | "hero";
  src: string;
  alt: Localized;
  fallback: string;
  owner: "Valve";
  use: "editorial-identification";
}

const officialCdn = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react";

const item = (key: string, ru: string, en: string, fallback: string): DotaMediaAsset => ({
  key,
  type: "item",
  src: `${officialCdn}/items/${key}.png`,
  alt: { ru, en },
  fallback,
  owner: "Valve",
  use: "editorial-identification"
});

const hero = (key: string, ru: string, en: string, fallback: string): DotaMediaAsset => ({
  key,
  type: "hero",
  src: `${officialCdn}/heroes/${key}.png`,
  alt: { ru, en },
  fallback,
  owner: "Valve",
  use: "editorial-identification"
});

export const dotaMedia = {
  quellingBlade: item("quelling_blade", "Quelling Blade, источник дохода с добиваний", "Quelling Blade, last-hit income source", "QB"),
  handOfMidas: item("hand_of_midas", "Hand of Midas", "Hand of Midas", "HM"),
  maelstrom: item("maelstrom", "Maelstrom", "Maelstrom", "ML"),
  battleFury: item("bfury", "Battle Fury", "Battle Fury", "BF"),
  blink: item("blink", "Blink Dagger", "Blink Dagger", "BL"),
  bkb: item("black_king_bar", "Black King Bar", "Black King Bar", "BKB"),
  observerWard: item("ward_observer", "Observer Ward", "Observer Ward", "OBS"),
  smoke: item("smoke_of_deceit", "Smoke of Deceit", "Smoke of Deceit", "SMK"),
  forceStaff: item("force_staff", "Force Staff", "Force Staff", "FS"),
  aegis: item("aegis", "Aegis of the Immortal", "Aegis of the Immortal", "AEG"),
  tp: item("tpscroll", "Town Portal Scroll", "Town Portal Scroll", "TP"),
  rapier: item("rapier", "Divine Rapier", "Divine Rapier", "DR"),
  antiMage: hero("antimage", "Anti-Mage, пример керри", "Anti-Mage, carry lens", "AM"),
  axe: hero("axe", "Axe, пример инициатора", "Axe, initiator lens", "AXE"),
  crystalMaiden: hero("crystal_maiden", "Crystal Maiden, пример поддержки", "Crystal Maiden, support lens", "CM"),
  dragonKnight: hero("dragon_knight", "Dragon Knight, ориентир для вернувшегося игрока", "Dragon Knight, returner marker", "DK"),
  alchemist: hero("alchemist", "Alchemist, пример для разбора экономики матча", "Alchemist, replay economy marker", "ALC")
} satisfies Record<string, DotaMediaAsset>;

export interface DotaEconomyNode {
  code: string;
  title: Localized;
  phase: Localized;
  summary: Localized;
  decision: Localized;
  signal: Localized;
  href: string;
  media: DotaMediaAsset;
}

export const dotaEconomyNodes: DotaEconomyNode[] = [
  {
    code: "01",
    title: { ru: "Доход линии", en: "Lane income" },
    phase: { ru: "0:00 → линия", en: "0:00 → lane" },
    summary: {
      ru: "Добивания крипов, пассивное золото и ранние убийства создают первый бюджет. Но одинаковая общая стоимость героя может быть получена с разной ценой для команды и карты.",
      en: "Last hits, passive gold and early kills form the first budget. Equal net worth can still carry a very different map cost."
    },
    decision: {
      ru: "Отделяй устойчивый доход с линии от разового золота за убийства. Не рассчитывай время покупки предмета только по лучшему возможному старту.",
      en: "Separate repeatable lane income from one-off kill gold; do not build the entire timing around a best-case lane."
    },
    signal: { ru: "добивания + пассивное золото", en: "CS + passive GPM" },
    href: "#player-paths",
    media: dotaMedia.quellingBlade
  },
  {
    code: "02",
    title: { ru: "Фарм-пропускная способность", en: "Farm throughput" },
    phase: { ru: "линии ↔ лес", en: "waves ↔ jungle" },
    summary: {
      ru: "Предметы для ускорения фарма превращают свободные линии и лагеря в будущую стоимость героя, но требуют пространства и времени до следующей драки.",
      en: "Acceleration items turn available waves and camps into future net worth, but consume space and time before the next fight."
    },
    decision: {
      ru: "Проверь, достаточно ли на карте безопасного фарма, чтобы купленный предмет действительно работал на полную.",
      en: "Confirm the map actually contains enough safe farm to keep the accelerator utilized."
    },
    signal: { ru: "доступные линии в минуту", en: "available waves / min" },
    href: "#role-lenses",
    media: dotaMedia.maelstrom
  },
  {
    code: "03",
    title: { ru: "Распределение золота", en: "Gold allocation" },
    phase: { ru: "сила сейчас ↔ рост позже", en: "tempo ↔ growth" },
    summary: {
      ru: "Каждая покупка требует выбора между немедленной силой, ускорением будущего дохода и сохранением золота на выкуп.",
      en: "Every purchase chooses between immediate power, future income acceleration and preserving buyback liquidity."
    },
    decision: {
      ru: "Сравни срок окупаемости предмета для фарма с ожидаемой продолжительностью матча и ближайшей целью команды.",
      en: "Compare a greed item's payback window with the expected match end and nearest objective."
    },
    signal: { ru: "минута окупаемости", en: "payback minute" },
    href: "#midas-irr",
    media: dotaMedia.handOfMidas
  },
  {
    code: "04",
    title: { ru: "Время покупки", en: "Item timing" },
    phase: { ru: "скачок силы", en: "power spike" },
    summary: {
      ru: "Золото становится стратегической ценностью только после покупки и доставки предмета. До этого оно остаётся потенциальной силой.",
      en: "Gold becomes strategic value only when the item is purchased and delivered. Until then, it remains potential power."
    },
    decision: {
      ru: "Планируй покупку вместе с телепортом, доставкой и позицией команды. Одной минуты появления предмета в инвентаре недостаточно.",
      en: "Plan the timing together with TP, delivery and team position. The inventory timestamp alone is not enough."
    },
    signal: { ru: "золото → готовая сила", en: "gold → usable power" },
    href: "#role-lenses",
    media: dotaMedia.blink
  },
  {
    code: "05",
    title: { ru: "Окно для цели", en: "Objective window" },
    phase: { ru: "Рошан / башня", en: "Roshan / tower" },
    summary: {
      ru: "Своевременная покупка приносит пользу через Рошана, башню, Терзателя или контроль карты. Без конкретной цели преимущество может остаться нереализованным.",
      en: "A timing is monetized through Roshan, towers, Tormentor or map control. Without an objective, the advantage can remain unrealized."
    },
    decision: {
      ru: "До покупки спроси себя, какую цель команда сможет забрать благодаря этому приросту силы.",
      en: "Before buying, name the objective the team can secure with this exact increase in power."
    },
    signal: { ru: "покупка → преимущество на карте", en: "timing → map value" },
    href: "#decision-deck",
    media: dotaMedia.aegis
  },
  {
    code: "06",
    title: { ru: "Запас на выкуп", en: "Buyback liquidity" },
    phase: { ru: "вторая жизнь", en: "second life" },
    summary: {
      ru: "Непотраченное золото может дать вторую жизнь. Его ценность растёт перед решающей целью и падает, если после выкупа нельзя быстро вернуться в бой.",
      en: "Unspent gold can be an option on a second life. Its value rises near a decisive objective and falls when re-entry is impossible."
    },
    decision: {
      ru: "Сравни пользу нового компонента с ценностью второй жизни и возможностью быстро вернуться в бой.",
      en: "Compare the component's power with the expected value of a second life and the actual re-entry route."
    },
    signal: { ru: "200 + стоимость / 13", en: "200 + NW / 13" },
    href: "#buyback-reserve",
    media: dotaMedia.tp
  },
  {
    code: "07",
    title: { ru: "Закрытие матча", en: "Closing the match" },
    phase: { ru: "заход на базу", en: "high ground" },
    summary: {
      ru: "В поздней игре важна не максимальная стоимость героя, а то, успеет ли команда превратить преимущество в победу до следующего усиления соперника.",
      en: "Late-game economy is not maximum net worth. It is whether the lead becomes a throne before the next enemy timing."
    },
    decision: {
      ru: "Определи условие победы: Aegis, преимущество по выкупам, готовность ключевой способности или предмет для захода на базу.",
      en: "Define the closing condition: Aegis, buyback advantage, a key cooldown or a specific siege item."
    },
    signal: { ru: "преимущество → трон", en: "lead → Ancient" },
    href: "#research-library",
    media: dotaMedia.rapier
  }
];

export interface DotaPlayerPath {
  id: "returner" | "casual" | "grinder";
  label: Localized;
  summary: Localized;
  title: Localized;
  hero: DotaMediaAsset;
  matches: Localized;
  focus: Localized;
  tolerance: Localized;
  steps: Array<{ title: Localized; text: Localized }>;
  flipCondition: Localized;
  href: Record<DotaLocale, string>;
}

export const dotaPlayerPaths: DotaPlayerPath[] = [
  {
    id: "returner",
    label: { ru: "Вернулся после перерыва", en: "Patch returner" },
    summary: { ru: "Сначала восстановить карту решений, затем оптимизировать цифры.", en: "Rebuild the decision map before optimizing numbers." },
    title: { ru: "Три матча, чтобы снова понимать стоимость минуты", en: "Three matches to understand the value of a minute again" },
    hero: dotaMedia.dragonKnight,
    matches: { ru: "3 матча", en: "3 matches" },
    focus: { ru: "1 роль", en: "1 role" },
    tolerance: { ru: "низкая", en: "low" },
    steps: [
      { title: { ru: "Посмотри, что изменилось", en: "Read the delta" }, text: { ru: `Отдели изменения экономики в ${currentPatch} от правок героев, которые не влияют на твои решения.`, en: `Separate ${currentPatch} economy changes from hero balance that does not affect your decisions.` } },
      { title: { ru: "Зафиксируй время покупки", en: "Record one timing" }, text: { ru: "Запиши минуту первого ключевого предмета и что команда смогла сделать после него.", en: "Record the first key item minute and what the team achieved after it." } },
      { title: { ru: "Проверь запас", en: "Check the reserve" }, text: { ru: "Перед важной поздней целью сравни покупку компонента с сохранением золота на выкуп.", en: "Before a late objective, compare the component with buyback instead of auto-buying." } }
    ],
    flipCondition: { ru: "Если меняются роль или герой, прежнее время покупки предмета уже нельзя считать универсальным ориентиром.", en: "If role or hero changes, do not carry the previous item timing over as a universal benchmark." },
    href: {
      ru: "/dota-2/?dota-midas.midas-purchase=12&dota-midas.midas-end=42#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-purchase=12&dota-midas.midas-end=42#midas-irr"
    }
  },
  {
    id: "casual",
    label: { ru: "Мало матчей", en: "Limited matches" },
    summary: { ru: "Один повторяемый вопрос на матч вместо десяти метрик.", en: "One repeatable question per match instead of ten metrics." },
    title: { ru: "Разбирай одну цель, а не весь повтор", en: "Learn through one objective, not the entire replay" },
    hero: dotaMedia.crystalMaiden,
    matches: { ru: "2-4 / нед.", en: "2-4 / week" },
    focus: { ru: "1 цель", en: "1 objective" },
    tolerance: { ru: "средняя", en: "medium" },
    steps: [
      { title: { ru: "Назови ближайшую цель", en: "Name the window" }, text: { ru: "Выбери одну причину копить золото: Рошан, башня или защита базы.", en: "Keep one immediate reason to save gold: Roshan, a tower or high-ground defense." } },
      { title: { ru: "Проверь выкуп", en: "Check buyback" }, text: { ru: "Введи общую стоимость героя, текущее золото и время до следующей цели до того, как откроешь магазин.", en: "Enter net worth, current gold and seconds to objective before opening the shop." } },
      { title: { ru: "Оцени результат", en: "Grade the outcome" }, text: { ru: "Оцени потраченное золото после следующей драки: сработало, не сработало или драки не было.", en: "Grade the spent gold after the next fight: it worked, it failed or no fight happened." } }
    ],
    flipCondition: { ru: "Если команда не может продолжить бой после выкупа, запас теряет часть ценности. Учитывай позицию героя и наличие телепорта.", en: "If the team cannot re-enter after buyback, the reserve loses value. Include position and TP access." },
    href: {
      ru: "/dota-2/?dota-buyback.buyback-networth=9000&dota-buyback.buyback-gold=750&dota-buyback.buyback-gpm=380&dota-buyback.buyback-objective=120&dota-buyback.buyback-risk=45#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=9000&dota-buyback.buyback-gold=750&dota-buyback.buyback-gpm=380&dota-buyback.buyback-objective=120&dota-buyback.buyback-risk=45#buyback-reserve"
    }
  },
  {
    id: "grinder",
    label: { ru: "Разбор повторов", en: "Replay grinder" },
    summary: { ru: "Ищет не среднее золото в минуту, а момент, где решение изменило траекторию.", en: "Looks beyond average GPM for the decision that changed the trajectory." },
    title: { ru: "Разбирай экономику как цепочку развилок", en: "Review the economy as a chain of forks" },
    hero: dotaMedia.alchemist,
    matches: { ru: "10+ / нед.", en: "10+ / week" },
    focus: { ru: "чувствительность", en: "sensitivity" },
    tolerance: { ru: "высокая", en: "high" },
    steps: [
      { title: { ru: "Составь хронологию", en: "Capture timeline" }, text: { ru: "Сохрани четыре точки вместо одного среднего показателя золота в минуту: покупку, цель, смерть и выкуп.", en: "Capture four points instead of one final GPM: purchase, objective, death and buyback." } },
      { title: { ru: "Проверь другой сценарий", en: "Build a counterfactual" }, text: { ru: "Посмотри, что изменилось бы при покупке на две минуты раньше или при сохранённом запасе золота.", en: "Test what changes with a two-minute earlier purchase or a preserved reserve." } },
      { title: { ru: "Найди границу", en: "Find the flip" }, text: { ru: "Зафиксируй условие, при котором жадная покупка перестаёт быть выгодной и лишает команду силы в нужный момент.", en: "Record the condition where greed flips from positive value to lost tempo." } }
    ],
    flipCondition: { ru: "Если вывод не меняется ни при одном реалистичном вводе, вероятно, модель измеряет не ту развилку.", en: "If no realistic input changes the answer, the model may be measuring the wrong decision." },
    href: {
      ru: "/dota-2/?dota-midas.midas-purchase=10&dota-midas.midas-end=38&dota-midas.midas-other=35#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-purchase=10&dota-midas.midas-end=38&dota-midas.midas-other=35#midas-irr"
    }
  }
];

export const dotaPulse = {
  patch: currentPatch,
  checkedAt: "2026-08-12",
  staleAfterDays: 45,
  sourceUrl: `https://www.dota2.com/patches/${currentPatch}`,
  status: "verified" as const,
  changes: [
    {
      signal: { ru: "+40 к скорости атаки", en: "+40 attack speed" },
      title: { ru: "Midas получил больше силы сейчас", en: "Midas gained more power now" },
      summary: { ru: `В ${currentPatch} бонус к скорости атаки увеличен с 35 до 40. Денежная часть Transmute в описании патча не менялась.`, en: `Patch ${currentPatch} increased the attack-speed bonus from 35 to 40. The notes do not change Transmute's cash component.` },
      decision: { ru: "Не сдвигай денежную окупаемость раньше автоматически. Добавляй другую ценность, только если +40 к скорости атаки действительно меняют героя или ближайший тайминг.", en: "Do not move cash break-even earlier automatically. Add extra value only when +40 AS changes the hero or the next timing." },
      media: dotaMedia.handOfMidas,
      sourceUrl: `https://www.dota2.com/patches/${currentPatch}`
    },
    {
      signal: { ru: "набор Madstone", en: "Madstone bundle" },
      title: { ru: "Transmute нейтрального крипа даёт дополнительную возможность", en: "Neutral Transmute carries a non-cash option" },
      summary: { ru: "При использовании Midas на нейтральном крипе срабатывает система Madstone. Это отдельная польза, а не бесплатное золото.", en: "Current Midas interacts with the Madstone system when used on a neutral creep. That is separate utility, not free gold." },
      decision: { ru: "Оцени Madstone отдельно в поле дополнительной ценности. Не смешивай его с гарантированными 160 золотом.", en: "Price Madstone separately in sensitivity; do not mix it into the guaranteed 160 gold." },
      media: dotaMedia.maelstrom,
      sourceUrl: "https://www.dota2.com/patches/7.38"
    },
    {
      signal: { ru: "200 + стоимость / 13", en: "200 + NW / 13" },
      title: { ru: "Исходная формула выкупа исправлена", en: "Buyback baseline corrected" },
      summary: { ru: "Money Meta теперь использует формулу, опубликованную после 7.29. Старая базовая стоимость 100 занижала нужный запас на 100 золота.", en: "Money Meta now uses the formula documented after 7.29. The old 100 base cost understated the reserve by 100 gold." },
      decision: { ru: "Пересчитай поздние сценарии: старая модель могла скрывать небольшой дефицит золота на выкуп.", en: "Recalculate late-game scenarios: the old model could hide a small buyback deficit." },
      media: dotaMedia.tp,
      sourceUrl: "https://www.dota2.com/patches/7.29"
    }
  ]
};

export interface DotaRoleLens {
  id: "carry" | "initiator" | "support";
  label: Localized;
  hero: DotaMediaAsset;
  title: Localized;
  question: Localized;
  note: Localized;
  priorities: Array<{
    media: DotaMediaAsset;
    title: Localized;
    signal: Localized;
    text: Localized;
  }>;
}

export const dotaRoleLenses: DotaRoleLens[] = [
  {
    id: "carry",
    label: { ru: "Экономика керри", en: "Carry economy" },
    hero: dotaMedia.antiMage,
    title: { ru: "Следующий слот должен либо ускорять фарм, либо выигрывать важный тайминг", en: "The next slot must either accelerate the map or win a timing" },
    question: { ru: "Есть ли безопасный фарм, чтобы окупить жадную покупку до обязательной драки?", en: "Is there enough safe farm to repay greed before the mandatory fight?" },
    note: { ru: "Anti-Mage здесь служит визуальным примером керри, а не местом героя в рейтинге или универсальной сборкой.", en: "Anti-Mage is a visual example of the carry lens, not a hero tier or universal build order." },
    priorities: [
      { media: dotaMedia.battleFury, title: { ru: "Ускоритель", en: "Accelerator" }, signal: { ru: "безопасная карта для фарма", en: "farmable map" }, text: { ru: "Покупка оправдана, если команда может оставить тебе линии, лес и окно до следующего давления соперника.", en: "The purchase needs enough waves/camps and a real window before the next pressure point." } },
      { media: dotaMedia.bkb, title: { ru: "Реализация тайминга", en: "Timing converter" }, signal: { ru: "драка → цель", en: "fight → objective" }, text: { ru: "Немедленная сила ценнее роста, когда одна выигранная драка открывает Рошана или хайграунд.", en: "Immediate power dominates growth when one fight opens Roshan or high ground." } },
      { media: dotaMedia.tp, title: { ru: "Запас", en: "Liquidity" }, signal: { ru: "выкуп + возвращение в бой", en: "buyback + re-entry" }, text: { ru: "Золото на выкуп полезно, только если позиция героя или телепорт позволяют снова попасть в драку.", en: "A reserve matters only with a TP or positional route back into the fight." } }
    ]
  },
  {
    id: "initiator",
    label: { ru: "Экономика инициатора", en: "Initiator economy" },
    hero: dotaMedia.axe,
    title: { ru: "Первая покупка создаёт доступ к драке. Следующие повышают качество исполнения", en: "The first purchase creates access; later gold improves execution" },
    question: { ru: "Даёт ли новый предмет команде новую возможность начать или пережить драку?", en: "Does the item create a new way to start or survive the fight?" },
    note: { ru: "Axe здесь служит примером инициатора. Конкретный герой, драфт и время перезарядки всегда важнее статичного порядка покупок.", en: "Axe marks the initiator archetype. Hero, draft and cooldowns always override a static order." },
    priorities: [
      { media: dotaMedia.blink, title: { ru: "Доступ", en: "Access" }, signal: { ru: "новая инициация", en: "new initiation" }, text: { ru: "Blink меняет не урон, а сам набор доступных действий. Это отдельный экономический выигрыш.", en: "Blink may change the action set rather than damage. That is a discrete economic payoff." } },
      { media: dotaMedia.bkb, title: { ru: "Надёжность", en: "Reliability" }, signal: { ru: "надёжность исполнения", en: "execution rate" }, text: { ru: "Следующая покупка повышает вероятность, что уже доступная инициация действительно сработает.", en: "The next gold raises the probability that purchased initiation is actually realized." } },
      { media: dotaMedia.smoke, title: { ru: "Командная реализация", en: "Team monetization" }, signal: { ru: "общий тайминг", en: "timing together" }, text: { ru: "Дешёвый расходник способен реализовать дорогой тайминг быстрее, чем ещё один компонент.", en: "A cheap consumable can realize an expensive timing faster than another component." } }
    ]
  },
  {
    id: "support",
    label: { ru: "Экономика поддержки", en: "Support economy" },
    hero: dotaMedia.crystalMaiden,
    title: { ru: "Маленький бюджет должен покупать вероятность командного результата", en: "A small budget should buy probability of a team outcome" },
    question: { ru: "Какая покупка даст пользу команде даже при небольшой личной стоимости героя?", en: "Which spend creates value without perfect personal net worth?" },
    note: { ru: "Crystal Maiden здесь служит примером героя поддержки. Это способ рассуждать о золоте, а не обязательная сборка.", en: "Crystal Maiden is a visual marker for the support lens. This is a capital framework, not a required build." },
    priorities: [
      { media: dotaMedia.observerWard, title: { ru: "Информация", en: "Information" }, signal: { ru: "снижение риска", en: "risk reduction" }, text: { ru: "Обзор уменьшает вероятность невыгодной драки и помогает лучше выбрать следующую цель.", en: "Vision lowers the chance of a bad fight and improves the next objective decision." } },
      { media: dotaMedia.forceStaff, title: { ru: "Спасённая ценность", en: "Value preserved" }, signal: { ru: "предотвращённая смерть", en: "death avoided" }, text: { ru: "Force Staff окупается через спасённого ключевого героя, выгодную позицию или сохранённую способность, а не через личное золото в минуту.", en: "Utility pays through a saved core, position or cooldown rather than personal GPM." } },
      { media: dotaMedia.smoke, title: { ru: "Дешёвый катализатор", en: "Cheap catalyst" }, signal: { ru: "реализация на карте", en: "map conversion" }, text: { ru: "Smoke превращает информацию и общий тайминг в попытку забрать героя или цель.", en: "Smoke turns information and team timing into an attempt to secure a kill or objective." } }
    ]
  }
];

export const dotaScenarios = [
  {
    id: "safe-farm-capacity",
    kind: "farm",
    featured: false,
    media: dotaMedia.battleFury,
    title: { ru: "На карте хватит фарма для ускорителя?", en: "Can the map feed an accelerator?" },
    text: { ru: "До покупки Battle Fury или Maelstrom проверь, хватит ли безопасных линий, леса и времени до обязательной драки.", en: "Check safe waves, camps and time before the mandatory fight before buying Battle Fury or Maelstrom." },
    href: { ru: "/dota-2/#economy-map", en: "/en/dota-2/#economy-map" }
  },
  {
    id: "accelerator-or-fight",
    kind: "timing",
    featured: true,
    media: dotaMedia.bkb,
    title: { ru: "Ускорение фарма или сила в ближайшей драке?", en: "Accelerator or power for the next fight?" },
    text: { ru: "Сравни будущую скорость фарма с целью, которую BKB или другой предмет способен открыть прямо сейчас.", en: "Compare future farm throughput with the objective a BKB or another timing can unlock now." },
    href: { ru: "/dota-2/#role-lenses", en: "/en/dota-2/#role-lenses" }
  },
  {
    id: "midas-early",
    kind: "midas",
    featured: false,
    media: dotaMedia.handOfMidas,
    title: { ru: "Midas на 9-й: хватит ли окна?", en: "Minute-9 Midas: is the window long enough?" },
    text: { ru: "Исходный сценарий: ранний Midas, конец матча на 38-й минуте и нулевая дополнительная ценность Madstone.", en: "Early baseline with a minute-38 end and zero Madstone value." },
    href: {
      ru: "/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=0&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=9&dota-midas.midas-end=38#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=0&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=9&dota-midas.midas-end=38#midas-irr"
    }
  },
  {
    id: "initiation-access",
    kind: "timing",
    featured: false,
    media: dotaMedia.blink,
    title: { ru: "Blink открывает новый способ начать драку?", en: "Does Blink create a new action set?" },
    text: { ru: "Оцени не урон, а доступ к инициации и то, сможет ли команда после первого появления забрать цель.", en: "Measure access to initiation, not damage, and the chance of turning the first reveal into an objective." },
    href: { ru: "/dota-2/#role-lenses", en: "/en/dota-2/#role-lenses" }
  },
  {
    id: "support-utility",
    kind: "utility",
    featured: false,
    media: dotaMedia.forceStaff,
    title: { ru: "Помощь команде или ещё один личный компонент?", en: "Utility or another personal component?" },
    text: { ru: "Сравни личную силу с ценностью спасённого ключевого героя, выгодной позиции или важной способности в следующей драке.", en: "Compare personal power with the value of a saved core, position or cooldown in the next fight." },
    href: { ru: "/dota-2/#role-lenses", en: "/en/dota-2/#role-lenses" }
  },
  {
    id: "core-reserve",
    kind: "buyback",
    featured: true,
    media: dotaMedia.bkb,
    title: { ru: "Ключевой герой: компонент или вторая жизнь", en: "Core: component or second life" },
    text: { ru: "Общая стоимость героя 18 000, 1 200 золота и 90 секунд до решающей драки.", en: "18k net worth, 1,200 gold and 90 seconds to a decisive fight." },
    href: {
      ru: "/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve"
    }
  },
  {
    id: "objective-conversion",
    kind: "objective",
    featured: false,
    media: dotaMedia.aegis,
    title: { ru: "Как тайминг превратится в Aegis, башню или контроль карты?", en: "How does the timing become Aegis, tower or map control?" },
    text: { ru: "Назови способ реализации до покупки. Без него преимущество остаётся потенциальной силой.", en: "Name the conversion path before buying. Without it, the advantage remains potential power." },
    href: { ru: "/dota-2/#economy-map", en: "/en/dota-2/#economy-map" }
  },
  {
    id: "replay-review",
    kind: "review",
    featured: false,
    media: dotaMedia.alchemist,
    title: { ru: "Какая развилка изменила траекторию матча?", en: "Which fork changed the match trajectory?" },
    text: { ru: "Проверь четыре момента: покупку, цель, смерть и выкуп. Не пытайся сразу разобрать весь повтор.", en: "Review purchase, objective, death and buyback instead of trying to audit the whole replay at once." },
    href: { ru: "/insights/dota-2-replay-economy-four-timestamps/", en: "/en/insights/dota-2-replay-economy-four-timestamps/" }
  }
] as const;

export const dotaMediaPolicy = {
  owner: "Valve",
  source: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/",
  placement: {
    ru: "редакционное обозначение механик и ролей в аналитическом разделе Dota 2",
    en: "editorial mechanic and role identification inside the Dota 2 analysis hub"
  },
  licenseBasis: {
    ru: "Редакционное использование до отдельной проверки коммерческих прав",
    en: "editorial identification pending commercial-rights review"
  },
  checkedAt: "2026-08-12",
  removable: true
};
