export type InsightLocale = "ru" | "en";
export type InsightGame = "gta" | "dota" | "wow";

interface InsightSection {
  heading: string;
  paragraphs: string[];
}

interface LocalizedInsight {
  title: string;
  description: string;
  kicker: string;
  thesis: string;
  readTime: string;
  takeaways: string[];
  sections: InsightSection[];
  toolLabel: string;
}

export interface Insight {
  slug: string;
  game: InsightGame;
  updatedAt: string;
  toolPath: Record<InsightLocale, string>;
  content: Record<InsightLocale, LocalizedInsight>;
}

export const insights: Insight[] = [
  {
    slug: "gta-online-what-to-buy-with-2-5m",
    game: "gta",
    updatedAt: "2026-08-12",
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#next-move",
      en: "/en/gta-online/calculators/business-roi/#next-move"
    },
    content: {
      ru: {
        title: "Что купить в GTA Online с GTA$2,5 млн после долгого перерыва",
        description: "Разбираем следующий лучший бизнес для solo-returner через окупаемость, чистую прибыль и операционную нагрузку.",
        kicker: "GTA Online · Capital allocation",
        thesis: "При baseline-допущениях Money Meta первым рассматривает Кислотную лабораторию: не потому что она всегда «S-tier», а потому что при ограниченном времени сочетает доступный вход, высокую капитальную эффективность и удобную solo-продажу.",
        readTime: "6 мин",
        takeaways: [
          "Стартовая модель: GTA$1,0 млн вложений и около GTA$275 тыс. чистыми за полный цикл.",
          "Расчётная окупаемость — примерно 17 часов производства, а не 17 часов активного grind.",
          "Ответ меняется, если у тебя уже есть инфраструктура Nightclub, действует релевантный бонус или главная цель — максимальный active income."
        ],
        sections: [
          {
            heading: "Короткий ответ",
            paragraphs: [
              "Для solo-игрока, который вернулся после перерыва, главный риск — потратить почти весь капитал на актив с длинной окупаемостью и тяжёлой операционкой. Поэтому сравнивать нужно не headline payout, а чистый cash flow после supplies, время производства и реальную сложность продажи.",
              "В текущем estimated-наборе Кислотная лаборатория требует около GTA$1,0 млн стартовых вложений. Полная продажа в baseline составляет GTA$335 тыс., supplies — GTA$60 тыс., поэтому чистая прибыль цикла оценивается в GTA$275 тыс. Это даёт около 27,5% virtual ROI на цикл."
            ]
          },
          {
            heading: "Почему не самый большой payout",
            paragraphs: [
              "Большая сумма продажи сама по себе ничего не говорит об эффективности. Дорогой актив может генерировать больше за цикл, но дольше производить товар, требовать несколько машин или постоянно отвлекать игрока. Для casual/solo это превращает красивую цифру в плохое использование времени.",
              "Money Meta отдельно показывает production hours и active friction. Окупаемость Acid Lab около 17 часов означает время работы бизнеса внутри игры. Ручного времени нужно существенно меньше — и это принципиально отличается от гайдов, которые смешивают passive production и активный grind в один показатель."
            ]
          },
          {
            heading: "Когда рекомендация изменится",
            paragraphs: [
              "Если у тебя уже куплены связанные бизнесы, Nightclub может стать стратегически важнее, чем показывает его упрощённая standalone-модель. Если действует двойной бонус на конкретные продажи, относительный рейтинг тоже изменится. А grinder с пятнадцатью часами в неделю может сознательно принять больше friction ради высокого потолка дохода.",
              "Поэтому правильный вывод звучит не «всем покупать Acid Lab», а «при этих вводных Acid Lab — наиболее устойчивый первый ход». Измени бюджет, доступное время и цель в decision engine — и проверь, сохраняется ли ответ для твоего профиля."
            ]
          }
        ],
        toolLabel: "Получить персональный Next Best Move"
      },
      en: {
        title: "What to buy in GTA Online with GTA$2.5m after a long break",
        description: "Find the next best solo-returner business through payback, net profit and operating friction.",
        kicker: "GTA Online · Capital allocation",
        thesis: "Under the baseline assumptions, Money Meta looks at the Acid Lab first — not because it is always S-tier, but because limited-time solo players get an attractive mix of entry cost, capital efficiency and sale convenience.",
        readTime: "6 min",
        takeaways: [
          "Baseline case: GTA$1.0m invested and roughly GTA$275k net per full cycle.",
          "Estimated payback is about 17 production hours, not 17 hours of active grinding.",
          "The answer changes when you already own Nightclub infrastructure, a relevant bonus is active, or maximum active income is the objective."
        ],
        sections: [
          {
            heading: "The short answer",
            paragraphs: [
              "A returning solo player faces one major risk: deploying almost all available capital into an asset with slow payback and heavy operating friction. The useful comparison is not headline payout. It is net cash flow after supplies, production time and the practical difficulty of realizing the sale.",
              "In the current estimated dataset, the Acid Lab requires roughly GTA$1.0m of starting capital. A baseline full sale is GTA$335k and supplies cost GTA$60k, leaving GTA$275k of net cycle profit — about 27.5% virtual ROI per cycle."
            ]
          },
          {
            heading: "Why the largest payout is not the answer",
            paragraphs: [
              "A large sale number does not equal efficiency. A more expensive asset may produce more per cycle while taking longer, requiring multiple vehicles or constantly pulling the player away from other activities. For a casual solo player, that turns an impressive headline into a poor use of time.",
              "Money Meta separates production hours from active friction. Acid Lab payback of roughly 17 hours means in-game production time. The manual workload is much lower — a critical distinction that many guides erase when they put passive production and active grind into one hourly number."
            ]
          },
          {
            heading: "When the recommendation changes",
            paragraphs: [
              "If you already own connected businesses, the Nightclub can be strategically more valuable than its simplified standalone model suggests. A 2x sale bonus changes relative rankings. A grinder with fifteen weekly hours may rationally accept more friction for a higher income ceiling.",
              "The correct conclusion is not ‘everyone should buy an Acid Lab.’ It is ‘under these inputs, the Acid Lab is the most resilient first move.’ Change budget, available time and objective in the decision engine to see whether that remains true for your profile."
            ]
          }
        ],
        toolLabel: "Get a personal Next Best Move"
      }
    }
  },
  {
    slug: "dota-2-hand-of-midas-real-payback",
    game: "dota",
    updatedAt: "2026-08-12",
    toolPath: { ru: "/dota-2/#midas-irr", en: "/en/dota-2/#midas-irr" },
    content: {
      ru: {
        title: "Когда Hand of Midas реально окупается — и почему 160 золота вводят в заблуждение",
        description: "Считаем incremental value Midas, минуту break-even и realized ROI до ожидаемого конца матча.",
        kicker: "Dota 2 · Timing economics",
        thesis: "Transmute даёт 160 золота, но не создаёт 160 золота чистой ценности: без Midas крип всё равно принёс бы bounty. При baseline-покупке на 12-й минуте предмет окупается примерно к 39-й; если матч закончится на 35-й, инвестиция останется в минусе.",
        readTime: "5 мин",
        takeaways: [
          "Incremental value baseline: 160 gold Transmute минус 40 gold упущенного bounty = 120 gold на use.",
          "Для возврата стоимости 2 200 gold требуется 19 применений — break-even около 39-й минуты.",
          "XP, attack speed и hero-specific tempo важны, но их нельзя честно свести к одной универсальной денежной цифре."
        ],
        sections: [
          {
            heading: "Ошибка в обычном расчёте",
            paragraphs: [
              "Самый распространённый подход умножает 160 золота на количество Transmute и называет результат доходом Midas. Но это gross value. Альтернатива — убить того же крипа обычным способом и получить его bounty. Экономическая ценность предмета равна только разнице между этими сценариями.",
              "При baseline bounty 40 золота один use создаёт 120 incremental gold. Стоимость предмета 2 200 gold делится на эту величину: нужно 19 применений. При 90-секундном восстановлении заряда и первой активации сразу после покупки на 12-й минуте break-even наступает примерно на 39-й."
            ]
          },
          {
            heading: "Почему ожидаемая длительность матча решает всё",
            paragraphs: [
              "Если матч закончится на 42-й минуте, модель успевает провести 21 Transmute. Gross incremental value составит 2 520 gold, net economic value после цены предмета — 320 gold, а realized ROI — около 14,5%.",
              "При завершении на 35-й минуте останется только 16 применений. Они создадут 1 920 incremental gold — на 280 меньше стоимости предмета. Один и тот же Midas может быть положительной или отрицательной инвестицией только из-за изменившегося временного окна."
            ]
          },
          {
            heading: "Что формула сознательно не решает",
            paragraphs: [
              "Midas даёт attack speed, дополнительный XP и может взаимодействовать с патчевыми механиками. Для конкретного героя эти эффекты способны перевесить денежный минус — или не компенсировать потерянный tempo. Универсальная цена такого эффекта была бы выдуманной точностью.",
              "Используй поле Other value, если готов сам оценить hero-specific эффект. Модель не выбирает предмет вместо тебя; она показывает, какую часть решения ты принимаешь как доказуемую экономику, а какую — как игровой judgement."
            ]
          }
        ],
        toolLabel: "Проверить свой Midas-сценарий"
      },
      en: {
        title: "When Hand of Midas actually pays back — and why 160 gold is misleading",
        description: "Calculate Midas incremental value, break-even minute and realized ROI through the expected match end.",
        kicker: "Dota 2 · Timing economics",
        thesis: "Transmute pays 160 gold, but it does not create 160 gold of pure value: the creep had a normal bounty. In the baseline minute-12 purchase, Midas breaks even around minute 39; if the match ends at 35, the investment remains negative.",
        readTime: "5 min",
        takeaways: [
          "Baseline incremental value: 160 Transmute gold minus 40 foregone creep bounty = 120 gold per use.",
          "Recovering a 2,200 gold cost needs 19 uses, putting break-even near minute 39.",
          "XP, attack speed and hero-specific tempo matter, but no honest universal gold value exists for them."
        ],
        sections: [
          {
            heading: "The error in the usual calculation",
            paragraphs: [
              "The common shortcut multiplies 160 gold by the number of Transmutes and calls the result Midas income. That is gross value. The alternative is killing the same creep normally and collecting its bounty. The item's economic value is only the difference between those two outcomes.",
              "With a 40 gold baseline bounty, each use creates 120 incremental gold. Divide the 2,200 gold item cost by that value and the model needs 19 uses. With a 90-second charge restore and an immediate first use after a minute-12 purchase, break-even arrives around minute 39."
            ]
          },
          {
            heading: "Why expected match length decides the case",
            paragraphs: [
              "If the game ends at minute 42, the model gets 21 Transmutes. Gross incremental value is 2,520 gold, net economic value after item cost is 320 gold and realized ROI is roughly 14.5%.",
              "If the game ends at minute 35, only 16 uses remain. They create 1,920 incremental gold — 280 below item cost. The same Midas becomes a positive or negative investment purely because the available payback window changed."
            ]
          },
          {
            heading: "What the formula deliberately does not solve",
            paragraphs: [
              "Midas provides attack speed, extra XP and patch-specific interactions. For one hero those effects may outweigh a monetary loss; for another they may not compensate for surrendered tempo. Assigning one universal value would be invented precision.",
              "Use Other value when you are willing to price the hero-specific effect yourself. The model does not choose the item for you. It separates the provable economic part of the decision from game judgement."
            ]
          }
        ],
        toolLabel: "Test your Midas scenario"
      }
    }
  },
  {
    slug: "wow-listed-gold-per-hour-vs-real-gph",
    game: "wow",
    updatedAt: "2026-08-12",
    toolPath: { ru: "/wow/#farm-liquidity", en: "/en/wow/#farm-liquidity" },
    content: {
      ru: {
        title: "Почему 3 420 gold/hour в WoW могут быть только 1 957 реального золота",
        description: "Разбираем liquidity haircut: sell-through, Auction House cut, расходы и стоимость непроданного inventory.",
        kicker: "WoW Retail · Market liquidity",
        thesis: "Гайд обычно умножает добычу на текущую цену и получает listed GPH. Но пока товар не продан, это стоимость inventory, а не золото. В baseline-сценарии 3 420 listed GPH превращаются примерно в 1 957 effective GPH.",
        readTime: "6 мин",
        takeaways: [
          "90 единиц в час × 38 gold = 3 420 listed GPH.",
          "При 65% sell-through, 5% AH cut и 155 gold расходов effective GPH падает примерно до 1 957.",
          "За двухчасовую сессию около 2 394 gold остаются в inventory at risk по текущей цене."
        ],
        sections: [
          {
            heading: "Listed value — это ещё не cash",
            paragraphs: [
              "Игрок добывает 90 единиц товара в час и видит цену 38 gold за штуку. Простое умножение даёт 3 420 gold/hour. Эта цифра корректно описывает стоимость созданного inventory по текущему листингу — но не денежный результат.",
              "Чтобы получить золото, товар должен найти покупателя. Если за один цикл листинга продаётся 65% объёма, только эта часть проходит через рынок. После стандартного 5% Auction House cut выручка дополнительно уменьшается."
            ]
          },
          {
            heading: "Как получается effective GPH",
            paragraphs: [
              "Baseline-модель применяет 65% sell-through и 5% комиссию к 3 420 listed GPH, затем вычитает 120 gold почасовых расходов и 35 gold ожидаемых relisting losses. Результат — около 1 957 effective gold/hour.",
              "Monetization rate составляет примерно 57,2%. Это не означает, что остальные 42,8% исчезли: часть стоимости остаётся в непроданном товаре. Но этим inventory нельзя оплатить покупку сейчас, и для его реализации потребуются время, новые листинги или снижение цены."
            ]
          },
          {
            heading: "Ликвидность важнее красивой цены",
            paragraphs: [
              "За двухчасовую сессию непроданные 35% добычи имеют listed value около 2 394 gold. Если продолжать фармить быстрее, чем рынок поглощает объём, working capital будет расти, а реальная скорость накопления золота — отставать от обещания гайда.",
              "Поэтому сравнивай фармы по effective GPH и inventory at risk. Высокая цена хороша только вместе с достаточным объёмом спроса. Введи собственные данные по предмету, региону и sell-through — baseline нужен как стартовая гипотеза, а не универсальная истина."
            ]
          }
        ],
        toolLabel: "Посчитать мой effective gold/hour"
      },
      en: {
        title: "Why 3,420 gold/hour in WoW may be only 1,957 of real gold",
        description: "Understand the liquidity haircut from sell-through, Auction House cut, expenses and unsold inventory.",
        kicker: "WoW Retail · Market liquidity",
        thesis: "A guide usually multiplies farmed units by current price and reports listed GPH. Until the goods sell, that is inventory value — not gold. In the baseline scenario, 3,420 listed GPH becomes roughly 1,957 effective GPH.",
        readTime: "6 min",
        takeaways: [
          "90 units per hour × 38 gold = 3,420 listed GPH.",
          "At 65% sell-through, a 5% AH cut and 155 gold of expenses, effective GPH falls to roughly 1,957.",
          "Across a two-hour session, about 2,394 gold remains in inventory at risk at the current price."
        ],
        sections: [
          {
            heading: "Listed value is not cash yet",
            paragraphs: [
              "A player farms 90 units per hour and sees a 38 gold unit price. Simple multiplication gives 3,420 gold/hour. That accurately describes the marked value of created inventory at the current listing price — not the realized outcome.",
              "The goods need a buyer before they become gold. If 65% of volume sells in one listing cycle, only that portion passes through the market. The standard 5% Auction House cut reduces proceeds again."
            ]
          },
          {
            heading: "How effective GPH is derived",
            paragraphs: [
              "The baseline model applies 65% sell-through and the 5% cut to 3,420 listed GPH, then subtracts 120 gold of hourly expenses and 35 gold of expected relisting losses. The result is roughly 1,957 effective gold/hour.",
              "The monetization rate is about 57.2%. The remaining 42.8% has not necessarily vanished; part of it sits in unsold goods. But inventory cannot fund a purchase now, and realizing it needs time, another listing or a lower price."
            ]
          },
          {
            heading: "Liquidity matters more than an attractive price",
            paragraphs: [
              "Across a two-hour session, the unsold 35% of production has a listed value of roughly 2,394 gold. Keep farming faster than the market absorbs supply and working capital rises while actual gold accumulation falls behind the guide's promise.",
              "Compare farms using effective GPH and inventory at risk. A high price is useful only with enough demand behind it. Enter your own item, region and sell-through data — the baseline is a starting hypothesis, not a universal truth."
            ]
          }
        ],
        toolLabel: "Calculate my effective gold/hour"
      }
    }
  }
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((insight) => insight.slug === slug);
}
