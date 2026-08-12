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
  quellingBlade: item("quelling_blade", "Quelling Blade, источник last-hit дохода", "Quelling Blade, last-hit income source", "QB"),
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
  antiMage: hero("antimage", "Anti-Mage, carry-линза", "Anti-Mage, carry lens", "AM"),
  axe: hero("axe", "Axe, initiator-линза", "Axe, initiator lens", "AXE"),
  crystalMaiden: hero("crystal_maiden", "Crystal Maiden, support-линза", "Crystal Maiden, support lens", "CM"),
  dragonKnight: hero("dragon_knight", "Dragon Knight, returner marker", "Dragon Knight, returner marker", "DK"),
  alchemist: hero("alchemist", "Alchemist, replay economy marker", "Alchemist, replay economy marker", "ALC")
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
    phase: { ru: "0:00 → lane", en: "0:00 → lane" },
    summary: {
      ru: "Last hits, пассивное золото и ранние kills создают первый бюджет. Но одинаковый net worth может быть собран с разной ценой по карте.",
      en: "Last hits, passive gold and early kills form the first budget. Equal net worth can still carry a very different map cost."
    },
    decision: {
      ru: "Отдели устойчивый доход линии от разового kill gold и не строй весь item timing на лучшем возможном старте.",
      en: "Separate repeatable lane income from one-off kill gold; do not build the entire timing around a best-case lane."
    },
    signal: { ru: "CS + passive GPM", en: "CS + passive GPM" },
    href: "#player-paths",
    media: dotaMedia.quellingBlade
  },
  {
    code: "02",
    title: { ru: "Фарм-пропускная способность", en: "Farm throughput" },
    phase: { ru: "waves ↔ jungle", en: "waves ↔ jungle" },
    summary: {
      ru: "Предметы ускорения превращают свободные волны и лагеря в будущий net worth, но требуют пространства и времени до следующей драки.",
      en: "Acceleration items turn available waves and camps into future net worth, but consume space and time before the next fight."
    },
    decision: {
      ru: "Проверь, существует ли на карте безопасный объём фарма, который реально загрузит купленный accelerator.",
      en: "Confirm the map actually contains enough safe farm to keep the accelerator utilized."
    },
    signal: { ru: "доступные waves / min", en: "available waves / min" },
    href: "#role-lenses",
    media: dotaMedia.maelstrom
  },
  {
    code: "03",
    title: { ru: "Распределение золота", en: "Gold allocation" },
    phase: { ru: "tempo ↔ growth", en: "tempo ↔ growth" },
    summary: {
      ru: "Каждая покупка выбирает между силой сейчас, ускорением будущего дохода и сохранением ликвидности на buyback.",
      en: "Every purchase chooses between immediate power, future income acceleration and preserving buyback liquidity."
    },
    decision: {
      ru: "Сравни окно окупаемости greed-предмета с ожидаемым концом матча и ближайшим objective.",
      en: "Compare a greed item's payback window with the expected match end and nearest objective."
    },
    signal: { ru: "payback minute", en: "payback minute" },
    href: "#midas-irr",
    media: dotaMedia.handOfMidas
  },
  {
    code: "04",
    title: { ru: "Item timing", en: "Item timing" },
    phase: { ru: "power spike", en: "power spike" },
    summary: {
      ru: "Золото становится стратегической ценностью только после покупки и доставки предмета. До этого оно остаётся потенциальной силой.",
      en: "Gold becomes strategic value only when the item is purchased and delivered. Until then, it remains potential power."
    },
    decision: {
      ru: "Планируй timing вместе с TP, доставкой и позицией команды. Одной минуты появления предмета в инвентаре недостаточно.",
      en: "Plan the timing together with TP, delivery and team position. The inventory timestamp alone is not enough."
    },
    signal: { ru: "gold → usable power", en: "gold → usable power" },
    href: "#role-lenses",
    media: dotaMedia.blink
  },
  {
    code: "05",
    title: { ru: "Objective window", en: "Objective window" },
    phase: { ru: "Roshan / tower", en: "Roshan / tower" },
    summary: {
      ru: "Timing монетизируется через Roshan, tower, Tormentor или контроль карты. Без objective преимущество может остаться нереализованным.",
      en: "A timing is monetized through Roshan, towers, Tormentor or map control. Without an objective, the advantage can remain unrealized."
    },
    decision: {
      ru: "До покупки спроси, какой objective команда сможет забрать именно этим приростом силы.",
      en: "Before buying, name the objective the team can secure with this exact increase in power."
    },
    signal: { ru: "timing → map value", en: "timing → map value" },
    href: "#decision-deck",
    media: dotaMedia.aegis
  },
  {
    code: "06",
    title: { ru: "Buyback liquidity", en: "Buyback liquidity" },
    phase: { ru: "second life", en: "second life" },
    summary: {
      ru: "Непотраченное золото может быть опционом на вторую жизнь. Его ценность растёт рядом с решающим objective и падает без возможности вернуться в бой.",
      en: "Unspent gold can be an option on a second life. Its value rises near a decisive objective and falls when re-entry is impossible."
    },
    decision: {
      ru: "Сравни силу нового компонента с ожидаемой ценностью второй жизни и реальным способом быстро вернуться.",
      en: "Compare the component's power with the expected value of a second life and the actual re-entry route."
    },
    signal: { ru: "200 + NW / 13", en: "200 + NW / 13" },
    href: "#buyback-reserve",
    media: dotaMedia.tp
  },
  {
    code: "07",
    title: { ru: "Закрытие матча", en: "Closing the match" },
    phase: { ru: "high ground", en: "high ground" },
    summary: {
      ru: "Поздняя экономика измеряется не максимальным net worth, а тем, превращается ли преимущество в трон до следующего вражеского timing.",
      en: "Late-game economy is not maximum net worth. It is whether the lead becomes a throne before the next enemy timing."
    },
    decision: {
      ru: "Определи условие закрытия: Aegis, buyback advantage, ключевой cooldown или конкретный siege item.",
      en: "Define the closing condition: Aegis, buyback advantage, a key cooldown or a specific siege item."
    },
    signal: { ru: "lead → Ancient", en: "lead → Ancient" },
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
    label: { ru: "Вернулся в патч", en: "Patch returner" },
    summary: { ru: "Сначала восстановить карту решений, затем оптимизировать цифры.", en: "Rebuild the decision map before optimizing numbers." },
    title: { ru: "Три матча, чтобы снова понимать стоимость минуты", en: "Three matches to understand the value of a minute again" },
    hero: dotaMedia.dragonKnight,
    matches: { ru: "3 матча", en: "3 matches" },
    focus: { ru: "1 роль", en: "1 role" },
    tolerance: { ru: "низкая", en: "low" },
    steps: [
      { title: { ru: "Прочитай delta", en: "Read the delta" }, text: { ru: `Отдели изменения экономики ${currentPatch} от hero balance, который не влияет на твои решения.`, en: `Separate ${currentPatch} economy changes from hero balance that does not affect your decisions.` } },
      { title: { ru: "Зафиксируй timing", en: "Record one timing" }, text: { ru: "Запиши минуту первого ключевого предмета и что команда смогла сделать после него.", en: "Record the first key item minute and what the team achieved after it." } },
      { title: { ru: "Проверь резерв", en: "Check the reserve" }, text: { ru: "Перед поздним objective сравни компонент с buyback, а не покупай автоматически.", en: "Before a late objective, compare the component with buyback instead of auto-buying." } }
    ],
    flipCondition: { ru: "Если роль или герой меняются, не переноси прежний item timing как универсальный benchmark.", en: "If role or hero changes, do not carry the previous item timing over as a universal benchmark." },
    href: {
      ru: "/dota-2/?dota-midas.midas-purchase=12&dota-midas.midas-end=42#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-purchase=12&dota-midas.midas-end=42#midas-irr"
    }
  },
  {
    id: "casual",
    label: { ru: "Мало матчей", en: "Limited matches" },
    summary: { ru: "Один повторяемый вопрос на матч вместо десяти метрик.", en: "One repeatable question per match instead of ten metrics." },
    title: { ru: "Учись через один objective, а не через весь replay", en: "Learn through one objective, not the entire replay" },
    hero: dotaMedia.crystalMaiden,
    matches: { ru: "2-4 / нед.", en: "2-4 / week" },
    focus: { ru: "1 objective", en: "1 objective" },
    tolerance: { ru: "средняя", en: "medium" },
    steps: [
      { title: { ru: "Назови окно", en: "Name the window" }, text: { ru: "Выбери одну ближайшую причину копить золото: Roshan, tower или защиту high ground.", en: "Keep one immediate reason to save gold: Roshan, a tower or high-ground defense." } },
      { title: { ru: "Сверь buyback", en: "Check buyback" }, text: { ru: "Введи net worth, текущее золото и секунды до objective до открытия shop.", en: "Enter net worth, current gold and seconds to objective before opening the shop." } },
      { title: { ru: "Оцени результат", en: "Grade the outcome" }, text: { ru: "Оцени потраченное золото после следующей драки: сработало, не сработало или драки не было.", en: "Grade the spent gold after the next fight: it worked, it failed or no fight happened." } }
    ],
    flipCondition: { ru: "Если команда не может вернуться после buyback, резерв теряет часть ценности. Учитывай позицию и доступный TP.", en: "If the team cannot re-enter after buyback, the reserve loses value. Include position and TP access." },
    href: {
      ru: "/dota-2/?dota-buyback.buyback-networth=9000&dota-buyback.buyback-gold=750&dota-buyback.buyback-gpm=380&dota-buyback.buyback-objective=120&dota-buyback.buyback-risk=45#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=9000&dota-buyback.buyback-gold=750&dota-buyback.buyback-gpm=380&dota-buyback.buyback-objective=120&dota-buyback.buyback-risk=45#buyback-reserve"
    }
  },
  {
    id: "grinder",
    label: { ru: "Replay grinder", en: "Replay grinder" },
    summary: { ru: "Ищет не средний GPM, а момент, где решение изменило траекторию.", en: "Looks beyond average GPM for the decision that changed the trajectory." },
    title: { ru: "Разбирай экономику как цепочку развилок", en: "Review the economy as a chain of forks" },
    hero: dotaMedia.alchemist,
    matches: { ru: "10+ / нед.", en: "10+ / week" },
    focus: { ru: "sensitivity", en: "sensitivity" },
    tolerance: { ru: "высокая", en: "high" },
    steps: [
      { title: { ru: "Сними timeline", en: "Capture timeline" }, text: { ru: "Сохрани четыре точки вместо одного финального GPM: purchase, objective, death и buyback.", en: "Capture four points instead of one final GPM: purchase, objective, death and buyback." } },
      { title: { ru: "Построй counterfactual", en: "Build a counterfactual" }, text: { ru: "Что изменилось бы при покупке на две минуты раньше или при сохранённом резерве.", en: "Test what changes with a two-minute earlier purchase or a preserved reserve." } },
      { title: { ru: "Найди flip", en: "Find the flip" }, text: { ru: "Зафиксируй условие, при котором greed превращается из плюса в потерю tempo.", en: "Record the condition where greed flips from positive value to lost tempo." } }
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
      signal: { ru: "+40 attack speed", en: "+40 attack speed" },
      title: { ru: "Midas получил больше силы сейчас", en: "Midas gained more power now" },
      summary: { ru: `В ${currentPatch} бонус attack speed увеличен с 35 до 40. Денежная часть Transmute в notes не менялась.`, en: `Patch ${currentPatch} increased the attack-speed bonus from 35 to 40. The notes do not change Transmute's cash component.` },
      decision: { ru: "Не двигай gold break-even раньше автоматически. Добавляй extra value только если +40 AS реально меняет героя или ближайший timing.", en: "Do not move cash break-even earlier automatically. Add extra value only when +40 AS changes the hero or the next timing." },
      media: dotaMedia.handOfMidas,
      sourceUrl: `https://www.dota2.com/patches/${currentPatch}`
    },
    {
      signal: { ru: "Madstone bundle", en: "Madstone bundle" },
      title: { ru: "У neutral Transmute есть неденежная опция", en: "Neutral Transmute carries a non-cash option" },
      summary: { ru: "Текущий Midas связан с Madstone-системой при использовании на neutral creep. Это отдельная ценность, а не бесплатное золото.", en: "Current Midas interacts with the Madstone system when used on a neutral creep. That is separate utility, not free gold." },
      decision: { ru: "В sensitivity-поле оцени Madstone отдельно; не смешивай его с гарантированными 160 gold.", en: "Price Madstone separately in sensitivity; do not mix it into the guaranteed 160 gold." },
      media: dotaMedia.maelstrom,
      sourceUrl: "https://www.dota2.com/patches/7.38"
    },
    {
      signal: { ru: "200 + NW / 13", en: "200 + NW / 13" },
      title: { ru: "Buyback baseline исправлен", en: "Buyback baseline corrected" },
      summary: { ru: "Money Meta теперь использует документированную после 7.29 формулу. Старый base cost 100 занижал резерв на 100 gold.", en: "Money Meta now uses the formula documented after 7.29. The old 100 base cost understated the reserve by 100 gold." },
      decision: { ru: "Пересчитай поздние сценарии: небольшой дефицит buyback мог быть скрыт старой моделью.", en: "Recalculate late-game scenarios: the old model could hide a small buyback deficit." },
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
    label: { ru: "Carry economy", en: "Carry economy" },
    hero: dotaMedia.antiMage,
    title: { ru: "Следующий слот должен либо ускорять карту, либо выигрывать timing", en: "The next slot must either accelerate the map or win a timing" },
    question: { ru: "Есть ли безопасный farm, чтобы окупить greed до обязательной драки?", en: "Is there enough safe farm to repay greed before the mandatory fight?" },
    note: { ru: "Anti-Mage здесь служит визуальным примером carry-линзы, а не hero tier или универсальным build order.", en: "Anti-Mage is a visual example of the carry lens, not a hero tier or universal build order." },
    priorities: [
      { media: dotaMedia.battleFury, title: { ru: "Ускоритель", en: "Accelerator" }, signal: { ru: "farmable map", en: "farmable map" }, text: { ru: "Покупка оправдана, если команда может предоставить waves/camps и окно до следующего pressure.", en: "The purchase needs enough waves/camps and a real window before the next pressure point." } },
      { media: dotaMedia.bkb, title: { ru: "Конвертер timing", en: "Timing converter" }, signal: { ru: "fight → objective", en: "fight → objective" }, text: { ru: "Немедленная сила ценнее роста, когда один выигранный fight открывает Roshan или high ground.", en: "Immediate power dominates growth when one fight opens Roshan or high ground." } },
      { media: dotaMedia.tp, title: { ru: "Ликвидность", en: "Liquidity" }, signal: { ru: "buyback + re-entry", en: "buyback + re-entry" }, text: { ru: "Резерв полезен только вместе с TP/позиционной возможностью снова попасть в драку.", en: "A reserve matters only with a TP or positional route back into the fight." } }
    ]
  },
  {
    id: "initiator",
    label: { ru: "Initiator economy", en: "Initiator economy" },
    hero: dotaMedia.axe,
    title: { ru: "Первая покупка создаёт доступ к драке. Следующие повышают качество исполнения", en: "The first purchase creates access; later gold improves execution" },
    question: { ru: "Даёт ли новый предмет команде новую возможность начать или пережить fight?", en: "Does the item create a new way to start or survive the fight?" },
    note: { ru: "Axe обозначает initiator-архетип. Конкретный герой, draft и cooldown всегда важнее статического порядка.", en: "Axe marks the initiator archetype. Hero, draft and cooldowns always override a static order." },
    priorities: [
      { media: dotaMedia.blink, title: { ru: "Доступ", en: "Access" }, signal: { ru: "new initiation", en: "new initiation" }, text: { ru: "Blink может изменить не damage, а сам набор доступных действий. Это дискретный economic payoff.", en: "Blink may change the action set rather than damage. That is a discrete economic payoff." } },
      { media: dotaMedia.bkb, title: { ru: "Надёжность", en: "Reliability" }, signal: { ru: "execution rate", en: "execution rate" }, text: { ru: "Следующее золото повышает вероятность, что уже купленный initiation действительно реализуется.", en: "The next gold raises the probability that purchased initiation is actually realized." } },
      { media: dotaMedia.smoke, title: { ru: "Командная монетизация", en: "Team monetization" }, signal: { ru: "timing together", en: "timing together" }, text: { ru: "Дешёвый расходник способен реализовать дорогой timing быстрее ещё одного компонента.", en: "A cheap consumable can realize an expensive timing faster than another component." } }
    ]
  },
  {
    id: "support",
    label: { ru: "Support economy", en: "Support economy" },
    hero: dotaMedia.crystalMaiden,
    title: { ru: "Маленький бюджет должен покупать вероятность командного результата", en: "A small budget should buy probability of a team outcome" },
    question: { ru: "Какой расход даст ценность даже без идеального личного net worth?", en: "Which spend creates value without perfect personal net worth?" },
    note: { ru: "Crystal Maiden служит визуальным маркером support-линзы. Это framework капитала, а не обязательный item build.", en: "Crystal Maiden is a visual marker for the support lens. This is a capital framework, not a required build." },
    priorities: [
      { media: dotaMedia.observerWard, title: { ru: "Информация", en: "Information" }, signal: { ru: "risk reduction", en: "risk reduction" }, text: { ru: "Vision уменьшает вероятность невыгодной драки и повышает качество следующего objective decision.", en: "Vision lowers the chance of a bad fight and improves the next objective decision." } },
      { media: dotaMedia.forceStaff, title: { ru: "Спасённая ценность", en: "Value preserved" }, signal: { ru: "death avoided", en: "death avoided" }, text: { ru: "Utility окупается через сохранённого core, позицию или cooldown, а не через личный GPM.", en: "Utility pays through a saved core, position or cooldown rather than personal GPM." } },
      { media: dotaMedia.smoke, title: { ru: "Дешёвый catalyst", en: "Cheap catalyst" }, signal: { ru: "map conversion", en: "map conversion" }, text: { ru: "Smoke превращает информацию и timing команды в попытку забрать kill или objective.", en: "Smoke turns information and team timing into an attempt to secure a kill or objective." } }
    ]
  }
];

export const dotaScenarios = [
  {
    id: "midas-early",
    kind: "midas",
    featured: true,
    media: dotaMedia.handOfMidas,
    title: { ru: "Midas на 9-й: хватит ли окна?", en: "Minute-9 Midas: is the window long enough?" },
    text: { ru: "Ранний baseline с концом на 38-й минуте и нулевой ценой Madstone.", en: "Early baseline with a minute-38 end and zero Madstone value." },
    href: {
      ru: "/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=0&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=9&dota-midas.midas-end=38#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=0&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=9&dota-midas.midas-end=38#midas-irr"
    }
  },
  {
    id: "midas-late",
    kind: "midas",
    featured: false,
    media: dotaMedia.handOfMidas,
    title: { ru: "Midas на 18-й: слишком поздно?", en: "Minute-18 Midas: too late?" },
    text: { ru: "Тот же предмет и тот же конец матча, но payback window уже сильно короче.", en: "Same item and match end, but a sharply shorter payback window." },
    href: {
      ru: "/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=0&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=18&dota-midas.midas-end=38#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=0&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=18&dota-midas.midas-end=38#midas-irr"
    }
  },
  {
    id: "midas-madstone",
    kind: "sensitivity",
    featured: false,
    media: dotaMedia.maelstrom,
    title: { ru: "Сколько стоит Madstone для тебя?", en: "What is Madstone worth to you?" },
    text: { ru: "Sensitivity: 35 gold другой ценности на use отдельно от гарантированного Transmute.", en: "Sensitivity with 35 gold of other value per use, separate from guaranteed Transmute." },
    href: {
      ru: "/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=35&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=12&dota-midas.midas-end=38#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=35&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=12&dota-midas.midas-end=38#midas-irr"
    }
  },
  {
    id: "support-reserve",
    kind: "buyback",
    featured: false,
    media: dotaMedia.observerWard,
    title: { ru: "Support перед Roshan", en: "Support before Roshan" },
    text: { ru: "9k net worth, 750 gold и две минуты до objective.", en: "9k net worth, 750 gold and two minutes to the objective." },
    href: {
      ru: "/dota-2/?dota-buyback.buyback-networth=9000&dota-buyback.buyback-gold=750&dota-buyback.buyback-gpm=380&dota-buyback.buyback-objective=120&dota-buyback.buyback-risk=45#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=9000&dota-buyback.buyback-gold=750&dota-buyback.buyback-gpm=380&dota-buyback.buyback-objective=120&dota-buyback.buyback-risk=45#buyback-reserve"
    }
  },
  {
    id: "core-reserve",
    kind: "buyback",
    featured: true,
    media: dotaMedia.bkb,
    title: { ru: "Core: компонент или вторая жизнь", en: "Core: component or second life" },
    text: { ru: "18k net worth, 1 200 gold и 90 секунд до решающей драки.", en: "18k net worth, 1,200 gold and 90 seconds to a decisive fight." },
    href: {
      ru: "/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve"
    }
  },
  {
    id: "high-ground-reserve",
    kind: "buyback",
    featured: false,
    media: dotaMedia.aegis,
    title: { ru: "High ground через минуту", en: "High ground in one minute" },
    text: { ru: "25k net worth и узкое окно: увидишь gap, projected gold и coverage.", en: "25k net worth in a narrow window: see gap, projected gold and coverage." },
    href: {
      ru: "/dota-2/?dota-buyback.buyback-networth=25000&dota-buyback.buyback-gold=1800&dota-buyback.buyback-gpm=700&dota-buyback.buyback-objective=60&dota-buyback.buyback-risk=65#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=25000&dota-buyback.buyback-gold=1800&dota-buyback.buyback-gpm=700&dota-buyback.buyback-objective=60&dota-buyback.buyback-risk=65#buyback-reserve"
    }
  }
] as const;

export const dotaMediaPolicy = {
  owner: "Valve",
  source: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/",
  placement: "editorial mechanic and role identification inside the Dota 2 analysis hub",
  licenseBasis: "editorial identification pending commercial-rights review",
  checkedAt: "2026-08-12",
  removable: true
};
