import { dotaPatchContext } from "./dota-economy";

export type InsightLocale = "ru" | "en";
export type InsightGame = "gta" | "dota" | "wow";
export type InsightAudience = "returner" | "casual" | "grinder";
export type InsightEvidence = "verified" | "estimated";

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
  gameVersion: string;
  evidenceStatus: InsightEvidence;
  audiences: InsightAudience[];
  toolPath: Record<InsightLocale, string>;
  content: Record<InsightLocale, LocalizedInsight>;
}

export const insights: Insight[] = [
  {
    slug: "gta-online-what-to-buy-with-2-5m",
    game: "gta",
    updatedAt: "2026-08-12",
    gameVersion: "GTA Online · July 2026 estimate set",
    evidenceStatus: "estimated",
    audiences: ["returner", "casual"],
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
          "Расчётная окупаемость - примерно 17 часов производства, а не 17 часов активного grind.",
          "Ответ меняется, если у тебя уже есть инфраструктура Nightclub, действует релевантный бонус или главная цель - максимальный active income."
        ],
        sections: [
          {
            heading: "Короткий ответ",
            paragraphs: [
              "Для solo-игрока, который вернулся после перерыва, главный риск - потратить почти весь капитал на актив с длинной окупаемостью и тяжёлой операционкой. Поэтому сравнивать нужно не headline payout, а чистый cash flow после supplies, время производства и реальную сложность продажи.",
              "В текущем estimated-наборе Кислотная лаборатория требует около GTA$1,0 млн стартовых вложений. Полная продажа в baseline составляет GTA$335 тыс., supplies - GTA$60 тыс., поэтому чистая прибыль цикла оценивается в GTA$275 тыс. Это даёт около 27,5% virtual ROI на цикл."
            ]
          },
          {
            heading: "Почему не самый большой payout",
            paragraphs: [
              "Большая сумма продажи сама по себе ничего не говорит об эффективности. Дорогой актив может генерировать больше за цикл, но дольше производить товар, требовать несколько машин или постоянно отвлекать игрока. Для casual/solo это превращает красивую цифру в плохое использование времени.",
              "Money Meta отдельно показывает production hours и active friction. Окупаемость Acid Lab около 17 часов означает время работы бизнеса внутри игры. Ручного времени нужно существенно меньше - и это принципиально отличается от гайдов, которые смешивают passive production и активный grind в один показатель."
            ]
          },
          {
            heading: "Когда рекомендация изменится",
            paragraphs: [
              "Если у тебя уже куплены связанные бизнесы, Nightclub может стать стратегически важнее, чем показывает его упрощённая standalone-модель. Если действует двойной бонус на конкретные продажи, относительный рейтинг тоже изменится. А grinder с пятнадцатью часами в неделю может сознательно принять больше friction ради высокого потолка дохода.",
              "Поэтому правильный вывод звучит не «всем покупать Acid Lab», а «при этих вводных Acid Lab - наиболее устойчивый первый ход». Измени бюджет, доступное время и цель в decision engine - и проверь, сохраняется ли ответ для твоего профиля."
            ]
          }
        ],
        toolLabel: "Получить персональный Next Best Move"
      },
      en: {
        title: "What to buy in GTA Online with GTA$2.5m after a long break",
        description: "Find the next best solo-returner business through payback, net profit and operating friction.",
        kicker: "GTA Online · Capital allocation",
        thesis: "Under the baseline assumptions, Money Meta looks at the Acid Lab first - not because it is always S-tier, but because limited-time solo players get an attractive mix of entry cost, capital efficiency and sale convenience.",
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
              "In the current estimated dataset, the Acid Lab requires roughly GTA$1.0m of starting capital. A baseline full sale is GTA$335k and supplies cost GTA$60k, leaving GTA$275k of net cycle profit - about 27.5% virtual ROI per cycle."
            ]
          },
          {
            heading: "Why the largest payout is not the answer",
            paragraphs: [
              "A large sale number does not equal efficiency. A more expensive asset may produce more per cycle while taking longer, requiring multiple vehicles or constantly pulling the player away from other activities. For a casual solo player, that turns an impressive headline into a poor use of time.",
              "Money Meta separates production hours from active friction. Acid Lab payback of roughly 17 hours means in-game production time. The manual workload is much lower - a critical distinction that many guides erase when they put passive production and active grind into one hourly number."
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
    slug: "gta-online-acid-lab-vs-bunker-solo",
    game: "gta",
    updatedAt: "2026-08-12",
    gameVersion: "GTA Online · July 2026 estimate set",
    evidenceStatus: "estimated",
    audiences: ["returner", "casual"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#business-comparison",
      en: "/en/gta-online/calculators/business-roi/#business-comparison"
    },
    content: {
      ru: {
        title: "Acid Lab или Bunker: что сильнее как solo-покупка",
        description: "Сравниваем два популярных production-актива по входу, чистому потоку, окупаемости и solo-friction.",
        kicker: "GTA Online · Asset comparison",
        thesis: "В baseline Acid Lab выглядит сильнее как новая solo-покупка: он требует меньше капитала и возвращает его быстрее. Bunker остаётся близким по production throughput и становится другим решением, если уже куплен.",
        readTime: "5 мин",
        takeaways: [
          "Acid Lab: около GTA$1,0 млн входа, GTA$275 тыс. net за цикл и примерно 17 production-hours до payback.",
          "Bunker: около GTA$2,375 млн входа, GTA$175 тыс. net за baseline-цикл и примерно 41 production-hour до payback.",
          "Если Bunker уже есть, стартовая цена перестаёт быть релевантной: buy decision превращается в run decision."
        ],
        sections: [
          {
            heading: "Почему Acid Lab выигрывает первый раунд",
            paragraphs: [
              "Оба актива в рабочей модели дают похожий чистый поток на час производства: около GTA$59,8 тыс. у Acid Lab и GTA$58,3 тыс. у Bunker. Но капитал на запуск отличается более чем вдвое, поэтому одинаковый throughput не означает одинаковую инвестицию.",
              "Acid Lab также получает более высокий solo score и меньший friction. Для игрока с ограниченным временем это снижает риск накопить товар, который неудобно реализовать."
            ]
          },
          {
            heading: "Когда Bunker становится правильнее",
            paragraphs: [
              "Если Bunker уже куплен, его историческая цена не должна повторно участвовать в решении «запускать ли производство сегодня». При setup cost, близком к нулю, сравниваются только маржа, время и альтернативное использование supplies.",
              "Bunker может также иметь полезность вне узкой cash-flow модели. Money Meta не присваивает этой полезности выдуманную денежную цену: её нужно добавить в собственный сценарий как отдельное решение."
            ]
          },
          {
            heading: "Практический вывод",
            paragraphs: [
              "Новый solo-returner сначала сравнивает Acid Lab как более устойчивую точку входа. Владелец Bunker сначала проверяет текущую операционную маржу и только потом решает, нужен ли ещё один актив.",
              "Открой Model Lab, выбери оба бизнеса и измени setup cost на реальную для тебя сумму. Это самый быстрый способ отделить общий tier list от твоей экономики."
            ]
          }
        ],
        toolLabel: "Сравнить Acid Lab и Bunker"
      },
      en: {
        title: "Acid Lab or Bunker: which is the stronger solo purchase",
        description: "Compare two production assets by entry cost, net flow, payback and solo friction.",
        kicker: "GTA Online · Asset comparison",
        thesis: "In the baseline, Acid Lab is the stronger new solo purchase because it locks less capital and pays back faster. Bunker stays close on production throughput and becomes a different decision when it is already owned.",
        readTime: "5 min",
        takeaways: [
          "Acid Lab: roughly GTA$1.0m entry, GTA$275k net per cycle and about 17 production hours to payback.",
          "Bunker: roughly GTA$2.375m entry, GTA$175k net per baseline cycle and about 41 production hours to payback.",
          "Once Bunker is already owned, setup price is no longer relevant: the buy decision becomes a run decision."
        ],
        sections: [
          {
            heading: "Why Acid Lab wins the first round",
            paragraphs: [
              "Both assets generate similar baseline net flow per production hour: roughly GTA$59.8k for Acid Lab and GTA$58.3k for Bunker. Setup capital differs by more than two times, so similar throughput does not make them similar investments.",
              "Acid Lab also carries a higher solo score and lower friction. For a time-constrained player, that reduces the risk of building inventory that is inconvenient to realize."
            ]
          },
          {
            heading: "When Bunker becomes the better decision",
            paragraphs: [
              "If Bunker is already owned, its historical price should not enter the question of whether to run production today. With setup cost near zero, the relevant comparison becomes margin, time and the alternative use of supplies.",
              "Bunker can also provide utility outside the narrow cash-flow model. Money Meta does not invent a universal GTA$ value for that utility; add it as a separate judgement in your own scenario."
            ]
          },
          {
            heading: "The practical conclusion",
            paragraphs: [
              "A new solo returner should test Acid Lab first as the more resilient entry point. A Bunker owner should test current operating margin before deciding another asset is needed.",
              "Open Model Lab, select both businesses and replace setup cost with the amount that is real for you. That separates a general tier list from your economy."
            ]
          }
        ],
        toolLabel: "Compare Acid Lab and Bunker"
      }
    }
  },
  {
    slug: "gta-online-headline-payout-vs-net-profit",
    game: "gta",
    updatedAt: "2026-08-12",
    gameVersion: "GTA Online · July 2026 estimate set",
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#model-lab",
      en: "/en/gta-online/calculators/business-roi/#model-lab"
    },
    content: {
      ru: {
        title: "Почему самая большая сумма продажи - не лучший бизнес",
        description: "Разбираем разницу между headline payout, net profit, production throughput и payback капитала.",
        kicker: "GTA Online · Unit economics",
        thesis: "GTA$500 тыс. на экране продажи могут выглядеть сильнее GTA$335 тыс., но решение меняют supplies, длительность производства и стартовые вложения. Gross - это начало расчёта, а не вывод.",
        readTime: "5 мин",
        takeaways: [
          "Counterfeit Cash показывает GTA$500 тыс. gross и GTA$450 тыс. net в baseline, но производит цикл около 9,4 часа.",
          "Acid Lab показывает меньший gross, но примерно GTA$59,8 тыс. net на production-hour против GTA$47,9 тыс.",
          "Капитальная окупаемость в модели - около 17 часов у Acid Lab против примерно 49 у Counterfeit Cash."
        ],
        sections: [
          {
            heading: "Gross payout отвечает не на тот вопрос",
            paragraphs: [
              "Сумма финальной продажи говорит, сколько денег приходит до учёта части расходов. Она не показывает, сколько капитала было заморожено, сколько времени товар производился и насколько тяжело было завершить доставку.",
              "Поэтому GTA$500 тыс. gross у Counterfeit Cash нельзя напрямую сравнивать с GTA$335 тыс. у Acid Lab. Сначала нужно перейти к net и разделить его на время производства."
            ]
          },
          {
            heading: "Два знаменателя, два разных вывода",
            paragraphs: [
              "Net per production-hour отвечает на вопрос о скорости потока. Virtual ROI отвечает, насколько эффективно работает стартовый капитал за цикл. Payback показывает, сколько production-hours нужно для возврата вложений.",
              "Актив способен быть неплохим по одному знаменателю и слабым по другому. Именно поэтому Money Meta не прячет решение за одной большой цифрой score."
            ]
          },
          {
            heading: "Как читать weekly-бонус",
            paragraphs: [
              "Бонус к продаже временно увеличивает gross и net, но не отменяет setup cost и operational friction. Его нужно применять к конкретному сценарию, а не навсегда повышать бизнес в tier list.",
              "В Model Lab введи sale bonus, который реально действует, и сравни результат с нулевым baseline. Так видно, является ли неделя окном для продажи или причиной покупать новый актив."
            ]
          }
        ],
        toolLabel: "Пересчитать gross в реальный net"
      },
      en: {
        title: "Why the largest sale number is not the best business",
        description: "Separate headline payout from net profit, production throughput and capital payback.",
        kicker: "GTA Online · Unit economics",
        thesis: "A GTA$500k sale can look stronger than GTA$335k, but supplies, production duration and setup capital change the decision. Gross is the beginning of the calculation, not the conclusion.",
        readTime: "5 min",
        takeaways: [
          "Counterfeit Cash shows GTA$500k gross and GTA$450k net in the baseline, but one cycle takes roughly 9.4 hours.",
          "Acid Lab has lower gross yet roughly GTA$59.8k net per production hour versus GTA$47.9k.",
          "Modeled capital payback is roughly 17 hours for Acid Lab versus about 49 for Counterfeit Cash."
        ],
        sections: [
          {
            heading: "Gross payout answers the wrong question",
            paragraphs: [
              "The final sale number shows cash arriving before some costs. It does not show locked capital, production duration or how difficult the delivery was to realize.",
              "That is why GTA$500k of Counterfeit Cash gross cannot be compared directly with GTA$335k from Acid Lab. Move to net first, then divide by production time."
            ]
          },
          {
            heading: "Two denominators, two different conclusions",
            paragraphs: [
              "Net per production hour measures the speed of flow. Virtual ROI measures how efficiently starting capital works across a cycle. Payback estimates the production time required to recover the investment.",
              "An asset can look useful on one denominator and weak on another. Money Meta therefore refuses to hide the decision behind one oversized score."
            ]
          },
          {
            heading: "How to read a weekly bonus",
            paragraphs: [
              "A sale bonus temporarily lifts gross and net, but it does not remove setup cost or operating friction. Apply it to the specific scenario instead of permanently promoting the business in a tier list.",
              "Enter the active sale bonus in Model Lab and compare it with the zero-bonus baseline. That shows whether the week creates a sale window or a reason to buy a new asset."
            ]
          }
        ],
        toolLabel: "Turn gross payout into real net"
      }
    }
  },
  {
    slug: "gta-online-best-business-four-hours-week",
    game: "gta",
    updatedAt: "2026-08-12",
    gameVersion: "GTA Online · July 2026 estimate set",
    evidenceStatus: "estimated",
    audiences: ["casual", "returner"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/?gta-next-move.profile=casual&gta-next-move.budget=2500000&gta-next-move.hours=4&gta-next-move.priority=low-friction&gta-next-move.friction=4#next-move",
      en: "/en/gta-online/calculators/business-roi/?gta-next-move.profile=casual&gta-next-move.budget=2500000&gta-next-move.hours=4&gta-next-move.priority=low-friction&gta-next-move.friction=4#next-move"
    },
    content: {
      ru: {
        title: "Лучший GTA Online бизнес, если есть только четыре часа в неделю",
        description: "Строим спокойный solo-сценарий с friction ceiling, а не максимизируем теоретический доход.",
        kicker: "GTA Online · Limited-time route",
        thesis: "При четырёх часах в неделю узким местом становится не только капитал, но и операционное внимание. Сначала отсекаются активы с friction выше 4/10, затем сравниваются только реально обслуживаемые циклы.",
        readTime: "5 мин",
        takeaways: [
          "Baseline-профиль: GTA$2,5 млн, 4 часа, low-friction objective и ceiling 4/10.",
          "Acid Lab остаётся сильным production-кандидатом; базовый Nightclub выглядит легко в обслуживании, но его warehouse-синергия не включена.",
          "Временный boosted route заполняет свободное активное время, не меняя долгосрочный рейтинг активов."
        ],
        sections: [
          {
            heading: "Почему максимум GTA$/hour может быть ловушкой",
            paragraphs: [
              "Теоретически сильный бизнес бесполезен, если короткая игровая сессия регулярно заканчивается незавершённой логистикой. Для casual-профиля стабильное выполнение цикла ценнее небольшого преимущества в таблице.",
              "Friction ceiling заранее удаляет активы, которые конфликтуют со стилем игры. Это не объявляет их плохими - они просто не подходят текущему мандату."
            ]
          },
          {
            heading: "Спокойная недельная архитектура",
            paragraphs: [
              "Первый слой - один solo-friendly production loop. Второй - текущая active-cash возможность из Pulse. Третий - резерв капитала, чтобы не пропустить редкое окно и не покупать supplies с пустым банком.",
              "Такой план выглядит менее эффектно, чем длинный список активностей, но лучше удерживается из недели в неделю. Повторяемость и есть реальный compounding."
            ]
          },
          {
            heading: "Как получить ответ под себя",
            paragraphs: [
              "Открой готовый casual-сценарий и поменяй только три вещи: банк, часы и friction. Decision engine пересчитает shortlist, не заставляя тебя заново изучать всю мету.",
              "Если готов принять friction 5-6/10, расширь потолок и посмотри, когда Bunker возвращается в выборку. Это и есть sensitivity, которая важнее универсального топа."
            ]
          }
        ],
        toolLabel: "Запустить сценарий на 4 часа"
      },
      en: {
        title: "The best GTA Online business with only four hours a week",
        description: "Build a calm solo scenario with a friction ceiling instead of maximizing theoretical income.",
        kicker: "GTA Online · Limited-time route",
        thesis: "At four hours a week, operating attention becomes a constraint alongside capital. Assets above friction 4/10 are removed first; only realistic serviceable loops are compared.",
        readTime: "5 min",
        takeaways: [
          "Baseline profile: GTA$2.5m, four hours, a low-friction objective and a 4/10 ceiling.",
          "Acid Lab remains a strong production candidate; base Nightclub is easy to operate, but warehouse synergy is not modeled.",
          "A temporary boosted route fills spare active time without changing the long-term asset ranking."
        ],
        sections: [
          {
            heading: "Why maximum GTA$/hour can be a trap",
            paragraphs: [
              "A theoretically strong business is useless when a short play session routinely ends with unfinished logistics. For a casual profile, completing the loop consistently matters more than a small table advantage.",
              "A friction ceiling removes assets that conflict with the play style. It does not call them bad; they simply fail the current mandate."
            ]
          },
          {
            heading: "A calm weekly architecture",
            paragraphs: [
              "Layer one is a single solo-friendly production loop. Layer two is the current active-cash opportunity from Pulse. Layer three is a capital reserve so a rare window or the next supply purchase does not arrive to an empty bank.",
              "The plan looks less impressive than a long activity list, but it survives from week to week. Repeatability is the source of real compounding."
            ]
          },
          {
            heading: "Get the answer for your case",
            paragraphs: [
              "Open the prepared casual scenario and change only three things: bank, hours and friction. The decision engine recalculates the shortlist without asking you to relearn the entire meta.",
              "If you accept friction of 5-6/10, raise the ceiling and watch when Bunker returns. That sensitivity is more useful than a universal top list."
            ]
          }
        ],
        toolLabel: "Run the four-hour scenario"
      }
    }
  },
  {
    slug: "gta-online-nightclub-standalone-vs-portfolio",
    game: "gta",
    updatedAt: "2026-08-12",
    gameVersion: "GTA Online · July 2026 estimate set",
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#portfolio",
      en: "/en/gta-online/calculators/business-roi/#portfolio"
    },
    content: {
      ru: {
        title: "Nightclub: хороший standalone cash flow или портфельный актив?",
        description: "Почему низкий friction ещё не делает Nightclub лучшей первой покупкой и как учитывать инфраструктурную синергию.",
        kicker: "GTA Online · Portfolio role",
        thesis: "Базовая модель Nightclub измеряет low-touch cash flow и поэтому высоко ставит его в solo lens. Но полный инвестиционный кейс зависит от feeder-инфраструктуры, которую нельзя честно спрятать в одну standalone-цифру.",
        readTime: "6 мин",
        takeaways: [
          "Текущий baseline моделирует GTA$50 тыс. за час и низкую операционную нагрузку, но не полный warehouse.",
          "Высокий solo score отвечает на вопрос об удобстве, а не автоматически на вопрос о лучшей первой покупке.",
          "Nightclub нужно оценивать как слой над уже существующим портфелем и отдельно - как новый capital allocation."
        ],
        sections: [
          {
            heading: "Почему Nightclub поднимается в solo ranking",
            paragraphs: [
              "В low-friction lens большой вес получают solo suitability и операционная простота. Nightclub закономерно выглядит сильным, потому что baseline требует мало активных минут.",
              "Но score отвечает ровно на заданный вопрос. Он не доказывает, что GTA$2 млн setup - лучший первый расход для игрока без связанной инфраструктуры."
            ]
          },
          {
            heading: "Standalone и portfolio - две модели",
            paragraphs: [
              "Standalone-модель сравнивает самостоятельный денежный поток. Portfolio-модель должна учитывать, какие feeder-активы уже есть, сколько дополнительного времени требуется и какой объём капитала заморожен во всей системе.",
              "Смешивание этих двух моделей создаёт ложную точность. Money Meta оставляет warehouse-синергию вне baseline до полноценной проверяемой модели."
            ]
          },
          {
            heading: "Как принять решение сейчас",
            paragraphs: [
              "Если Nightclub уже встроен в твою систему, оценивай следующий маржинальный апгрейд, а не повторно всю историческую цену. Если инфраструктуры нет, сравни полный setup с Acid Lab и Bunker по payback.",
              "Portfolio Optimizer пока использует прозрачный упрощённый цикл. Он полезен для constraints, но не заменяет отдельную Nightclub warehouse-модель - это явно обозначенное ограничение, а не скрытый пробел."
            ]
          }
        ],
        toolLabel: "Проверить роль Nightclub в портфеле"
      },
      en: {
        title: "Nightclub: standalone cash flow or portfolio asset?",
        description: "Why low friction does not automatically make Nightclub the best first purchase, and how to frame infrastructure synergy.",
        kicker: "GTA Online · Portfolio role",
        thesis: "The base Nightclub model measures low-touch cash flow, so it ranks highly in the solo lens. The full investment case depends on feeder infrastructure that cannot honestly be compressed into one standalone number.",
        readTime: "6 min",
        takeaways: [
          "The current baseline models GTA$50k per hour and low operating work, not the full warehouse.",
          "A high solo score answers the convenience question; it does not automatically answer the best-first-purchase question.",
          "Nightclub should be evaluated as a layer over an existing portfolio and separately as new capital allocation."
        ],
        sections: [
          {
            heading: "Why Nightclub rises in the solo ranking",
            paragraphs: [
              "The low-friction lens assigns heavy weight to solo suitability and operating ease. Nightclub naturally performs well because the baseline needs few active minutes.",
              "The score answers exactly that question. It does not prove that a GTA$2m setup is the best first spend for a player without connected infrastructure."
            ]
          },
          {
            heading: "Standalone and portfolio are two models",
            paragraphs: [
              "A standalone model compares independent cash flow. A portfolio model needs to know which feeder assets are owned, the extra operating time and the total capital locked across the system.",
              "Combining those models creates false precision. Money Meta leaves warehouse synergy out of the baseline until a complete, verifiable model exists."
            ]
          },
          {
            heading: "How to decide now",
            paragraphs: [
              "If Nightclub is already embedded in your system, evaluate the next marginal upgrade instead of charging the full historical price again. Without infrastructure, compare full setup with Acid Lab and Bunker payback.",
              "Portfolio Optimizer currently uses a transparent simplified cycle. It helps test constraints, but it does not replace a dedicated Nightclub warehouse model - an explicit limitation, not a hidden gap."
            ]
          }
        ],
        toolLabel: "Test Nightclub's portfolio role"
      }
    }
  },
  {
    slug: "gta-online-when-weekly-bonus-changes-plan",
    game: "gta",
    updatedAt: "2026-08-12",
    gameVersion: "GTA Online · Summer Heist Event · Aug 6-12 2026",
    evidenceStatus: "verified",
    audiences: ["returner", "casual", "grinder"],
    toolPath: {
      ru: "/gta-online/#weekly-pulse",
      en: "/en/gta-online/#weekly-pulse"
    },
    content: {
      ru: {
        title: "Когда weekly-бонус должен изменить твой план в GTA Online",
        description: "Правило для ограниченных событий: сначала забрать безусловную ценность, затем оценить редкое окно и только потом менять портфель.",
        kicker: "GTA Online · Weekly opportunity cost",
        thesis: "Weekly-бонус меняет порядок действий, но не всегда меняет лучшую долгосрочную покупку. В окне 6-12 августа правильная последовательность начинается со входного GTA$1 млн и первого свежего Cayo-run, а production-рейтинг остаётся отдельным.",
        readTime: "5 мин",
        takeaways: [
          "До конца 12 августа официальный event даёт GTA$1 млн за вход; начисление может занять до 72 часов.",
          "Первое свежее прохождение Cayo Perico в этом окне гарантирует Panther Statue.",
          "2X/3X активности - временный active-cash слой; они не применяются автоматически к постоянным production-бизнесам."
        ],
        sections: [
          {
            heading: "Сначала безусловная ценность",
            paragraphs: [
              "Если награда требует только входа, первым действием становится логин, а не покупка. Это добавляет капитал без заморозки времени и может изменить доступный shortlist уже через одно действие.",
              "По официальному Rockstar Newswire окно действует до конца 12 августа, а начисление GTA$1 млн может занять до 72 часов. Поэтому решение нужно отделить от момента фактического поступления средств."
            ]
          },
          {
            heading: "Затем редкое ограниченное окно",
            paragraphs: [
              "Гарантированная Panther Statue на первом свежем Cayo-прохождении - opportunity with expiry. Она заслуживает места выше обычного рутинного цикла, если игрок способен завершить run в срок.",
              "Но редкий payout не делает Kosatka или любой другой актив автоматически лучшей постоянной покупкой для каждого. Сначала оцени доступ, setup и собственное время."
            ]
          },
          {
            heading: "И только потом меняй базовый портфель",
            paragraphs: [
              "3X Community Mission Series и 2X A Superyacht Life / Assault on Cayo Perico создают временные active routes. Они сравниваются с альтернативой на эту неделю, а не навсегда переписывают unit economics Acid Lab, Bunker или Nightclub.",
              "Money Meta автоматически переводит Pulse в архив после valid-through. Это защищает от одной из самых дорогих ошибок returner-гайдов: выдавать вчерашний бонус за текущую мету."
            ]
          }
        ],
        toolLabel: "Открыть текущий GTA Pulse"
      },
      en: {
        title: "When a weekly bonus should change your GTA Online plan",
        description: "A rule for limited events: claim unconditional value, assess the rare window, then decide whether the portfolio changes.",
        kicker: "GTA Online · Weekly opportunity cost",
        thesis: "A weekly bonus changes action order but does not always change the best long-term purchase. In the August 6-12 window, the sequence starts with the GTA$1m login value and a first fresh Cayo run while production rankings remain separate.",
        readTime: "5 min",
        takeaways: [
          "Through the end of August 12, the official event grants GTA$1m for logging in; delivery can take up to 72 hours.",
          "The first fresh Cayo Perico playthrough in the window guarantees the Panther Statue.",
          "2X/3X activities are a temporary active-cash layer; they are not automatically applied to permanent production businesses."
        ],
        sections: [
          {
            heading: "Claim unconditional value first",
            paragraphs: [
              "When a reward requires only a login, logging in comes before buying. It adds capital without locking time and can change the affordable shortlist through one action.",
              "The official Rockstar Newswire window runs through the end of August 12, and delivery of GTA$1m can take up to 72 hours. Separate the decision from the moment cash actually arrives."
            ]
          },
          {
            heading: "Then assess the rare expiring window",
            paragraphs: [
              "A guaranteed Panther Statue on the first fresh Cayo playthrough is an opportunity with expiry. It deserves priority over a routine loop when the player can finish the run inside the window.",
              "The rare payout does not automatically make Kosatka or any other asset the best permanent purchase for every player. Access, setup and available time still matter."
            ]
          },
          {
            heading: "Only then change the base portfolio",
            paragraphs: [
              "3X Community Mission Series and 2X A Superyacht Life / Assault on Cayo Perico create temporary active routes. Compare them with this week's alternatives; do not permanently rewrite Acid Lab, Bunker or Nightclub unit economics.",
              "Money Meta automatically moves Pulse into archive after valid-through. That prevents one of the most expensive returner-guide errors: presenting yesterday's bonus as current meta."
            ]
          }
        ],
        toolLabel: "Open the current GTA Pulse"
      }
    }
  },
  {
    slug: "dota-2-hand-of-midas-real-payback",
    game: "dota",
    updatedAt: "2026-08-12",
    gameVersion: `Dota 2 · Patch ${dotaPatchContext.patch} baseline`,
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: { ru: "/dota-2/#midas-irr", en: "/en/dota-2/#midas-irr" },
    content: {
      ru: {
        title: "Когда Hand of Midas реально окупается - и почему 160 золота вводят в заблуждение",
        description: "Считаем incremental value Midas, минуту break-even и realized ROI до ожидаемого конца матча.",
        kicker: "Dota 2 · Timing economics",
        thesis: "Transmute даёт 160 золота, но не создаёт 160 золота чистой ценности: без Midas крип всё равно принёс бы bounty. При baseline-покупке на 12-й минуте предмет окупается примерно к 39-й; если матч закончится на 35-й, инвестиция останется в минусе.",
        readTime: "5 мин",
        takeaways: [
          "Incremental value baseline: 160 gold Transmute минус 40 gold упущенного bounty = 120 gold на use.",
          "Для возврата стоимости 2 200 gold требуется 19 применений - break-even около 39-й минуты.",
          "Attack speed, Madstone и hero-specific tempo важны, но их нельзя честно свести к одной универсальной денежной цифре."
        ],
        sections: [
          {
            heading: "Ошибка в обычном расчёте",
            paragraphs: [
              "Самый распространённый подход умножает 160 золота на количество Transmute и называет результат доходом Midas. Но это gross value. Альтернатива - убить того же крипа обычным способом и получить его bounty. Экономическая ценность предмета равна только разнице между этими сценариями.",
              "При baseline bounty 40 золота один use создаёт 120 incremental gold. Стоимость предмета 2 200 gold делится на эту величину: нужно 19 применений. При 90-секундном восстановлении заряда и первой активации сразу после покупки на 12-й минуте break-even наступает примерно на 39-й."
            ]
          },
          {
            heading: "Почему ожидаемая длительность матча решает всё",
            paragraphs: [
              "Если матч закончится на 42-й минуте, модель успевает провести 21 Transmute. Gross incremental value составит 2 520 gold, net economic value после цены предмета - 320 gold, а realized ROI - около 14,5%.",
              "При завершении на 35-й минуте останется только 16 применений. Они создадут 1 920 incremental gold - на 280 меньше стоимости предмета. Один и тот же Midas может быть положительной или отрицательной инвестицией только из-за изменившегося временного окна."
            ]
          },
          {
            heading: "Что формула сознательно не решает",
            paragraphs: [
              "Midas даёт attack speed и взаимодействует с текущей Madstone-механикой. Для конкретного героя эти эффекты способны перевесить денежный минус - или не компенсировать потерянный tempo. Универсальная цена такого эффекта была бы выдуманной точностью.",
              "Используй поле Other value, если готов сам оценить hero-specific эффект. Модель не выбирает предмет вместо тебя; она показывает, какую часть решения ты принимаешь как доказуемую экономику, а какую - как игровой judgement."
            ]
          }
        ],
        toolLabel: "Проверить свой Midas-сценарий"
      },
      en: {
        title: "When Hand of Midas actually pays back - and why 160 gold is misleading",
        description: "Calculate Midas incremental value, break-even minute and realized ROI through the expected match end.",
        kicker: "Dota 2 · Timing economics",
        thesis: "Transmute pays 160 gold, but it does not create 160 gold of pure value: the creep had a normal bounty. In the baseline minute-12 purchase, Midas breaks even around minute 39; if the match ends at 35, the investment remains negative.",
        readTime: "5 min",
        takeaways: [
          "Baseline incremental value: 160 Transmute gold minus 40 foregone creep bounty = 120 gold per use.",
          "Recovering a 2,200 gold cost needs 19 uses, putting break-even near minute 39.",
          "Attack speed, Madstone and hero-specific tempo matter, but no honest universal gold value exists for them."
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
              "If the game ends at minute 35, only 16 uses remain. They create 1,920 incremental gold - 280 below item cost. The same Midas becomes a positive or negative investment purely because the available payback window changed."
            ]
          },
          {
            heading: "What the formula deliberately does not solve",
            paragraphs: [
              "Midas provides attack speed and interacts with the current Madstone mechanic. For one hero those effects may outweigh a monetary loss; for another they may not compensate for surrendered tempo. Assigning one universal value would be invented precision.",
              "Use Other value when you are willing to price the hero-specific effect yourself. The model does not choose the item for you. It separates the provable economic part of the decision from game judgement."
            ]
          }
        ],
        toolLabel: "Test your Midas scenario"
      }
    }
  },
  {
    slug: "dota-2-buyback-reserve-before-roshan",
    game: "dota",
    updatedAt: "2026-08-12",
    gameVersion: `Dota 2 · Patch ${dotaPatchContext.patch} · buyback formula verified`,
    evidenceStatus: "verified",
    audiences: ["returner", "casual", "grinder"],
    toolPath: {
      ru: "/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve"
    },
    content: {
      ru: {
        title: "Сколько золота реально нужно держать на buyback перед Roshan",
        description: "Исправляем старую формулу, считаем reserve gap и отделяем стоимость второй жизни от автоматического запрета покупать предметы.",
        kicker: "Dota 2 · Liquidity reserve",
        thesis: "Buyback - это не просто сумма в интерфейсе, а опцион вернуться в конкретную драку. Действующая документированная база - 200 + Net Worth / 13; старая модель Money Meta с base 100 занижала резерв ровно на 100 gold.",
        readTime: "6 мин",
        takeaways: [
          "При 15 000 net worth baseline buyback равен примерно 1 354 gold, а не 1 254.",
          "При 18 000 net worth и 1 200 gold сейчас резерв дефицитен, но 620 GPM за 90 секунд формируют его до objective.",
          "Профинансированный buyback полезен только при реальной возможности вернуться в fight и повлиять на objective."
        ],
        sections: [
          {
            heading: "Почему формула была занижена",
            paragraphs: [
              "Valve изменила базу buyback в 7.24, а в 7.29 зафиксировала формулу 200 + Net Worth / 13. Использование старого base cost 100 создаёт систематическую ошибку: каждый сценарий выглядит на 100 gold безопаснее, чем он есть.",
              "Разница кажется небольшой, но именно около границы решения она критична. Игрок может потратить компонент и обнаружить, что резерв больше не профинансирован перед Roshan или защитой high ground."
            ]
          },
          {
            heading: "Готов сейчас и готов к objective - разные состояния",
            paragraphs: [
              "При 18 000 net worth buyback оценивается примерно в 1 585 gold. С 1 200 gold сейчас не хватает около 385, но при 620 GPM за следующие 90 секунд модель прогнозирует около 2 130 gold - reserve становится доступен к objective.",
              "Это не совет потратить всё прогнозируемое золото. Forecast нужен, чтобы отличить временный дефицит от ситуации, где farming window физически не закрывает gap."
            ]
          },
          {
            heading: "Когда компонент всё-таки сильнее второй жизни",
            paragraphs: [
              "Buyback сохраняет опциональность, но не гарантирует результат. Если нет TP, ближайшая точка возврата разрушена или герой не успевает в бой, ликвидность не превращается в полезную вторую жизнь.",
              "Сравнивай конкретную силу компонента с ожидаемой ценностью re-entry. Risk-weighted reserve помогает увидеть масштаб ставки, но финальное решение остаётся функцией draft, позиции, cooldowns и objective."
            ]
          }
        ],
        toolLabel: "Открыть сценарий core перед Roshan"
      },
      en: {
        title: "How much gold to actually hold for buyback before Roshan",
        description: "Correct the old formula, calculate the reserve gap and separate the value of a second life from a blanket ban on spending.",
        kicker: "Dota 2 · Liquidity reserve",
        thesis: "Buyback is not just a UI price. It is an option to re-enter a specific fight. The documented baseline is 200 + Net Worth / 13; Money Meta's old 100 base understated every reserve by exactly 100 gold.",
        readTime: "6 min",
        takeaways: [
          "At 15,000 net worth the baseline buyback is roughly 1,354 gold, not 1,254.",
          "At 18,000 net worth and 1,200 current gold the reserve is underfunded now, but 620 GPM over 90 seconds funds it by the objective.",
          "A funded buyback matters only when the hero can re-enter the fight and influence the objective."
        ],
        sections: [
          {
            heading: "Why the formula was understated",
            paragraphs: [
              "Valve raised the buyback base in 7.24 and documented 200 + Net Worth / 13 in 7.29. Keeping the earlier 100 base creates a systematic error: every scenario looks 100 gold safer than it is.",
              "That looks small until the decision sits near the boundary. A player can buy a component and discover the reserve is no longer funded before Roshan or a high-ground defense."
            ]
          },
          {
            heading: "Ready now and ready by the objective are different states",
            paragraphs: [
              "At 18,000 net worth, estimated buyback is roughly 1,585 gold. With 1,200 now, the gap is about 385. At 620 GPM for the next 90 seconds, projected gold reaches roughly 2,130 and the reserve becomes available by the objective.",
              "That forecast is not permission to spend every projected coin. It distinguishes a temporary deficit from a window that physically cannot close the gap."
            ]
          },
          {
            heading: "When the component is still stronger than a second life",
            paragraphs: [
              "Buyback preserves optionality but does not guarantee value. Without TP access, a surviving structure or enough time to re-enter, liquidity never becomes a useful second life.",
              "Compare the component's concrete power with the expected value of re-entry. Risk-weighted reserve shows the size of the stake; draft, position, cooldowns and objective still decide the action."
            ]
          }
        ],
        toolLabel: "Open the core-before-Roshan scenario"
      }
    }
  },
  {
    slug: "dota-2-midas-madstone-noncash-value",
    game: "dota",
    updatedAt: "2026-08-12",
    gameVersion: `Dota 2 · Patch ${dotaPatchContext.patch} baseline`,
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: {
      ru: "/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=35&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=12&dota-midas.midas-end=38#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=35&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=12&dota-midas.midas-end=38#midas-irr"
    },
    content: {
      ru: {
        title: "Как оценивать Madstone и +40 attack speed, не подделывая Midas ROI",
        description: "Отделяем гарантированное золото Transmute от неденежной ценности текущего патча и проверяем sensitivity.",
        kicker: "Dota 2 · Non-cash utility",
        thesis: `В ${dotaPatchContext.patch} Midas даёт +40 attack speed, а neutral Transmute связан с Madstone. Эти эффекты могут изменить решение, но их нельзя молча добавить к 160 gold как гарантированный cash flow.`,
        readTime: "5 мин",
        takeaways: [
          "При покупке на 12-й и конце на 38-й минуте cash-only baseline не успевает окупиться.",
          "Условные 35 gold other value на use сдвигают break-even примерно к 33-й минуте.",
          "Other value - sensitivity пользователя, а не проверенный рыночный курс Madstone или attack speed."
        ],
        sections: [
          {
            heading: "Почему cash model должна оставаться узкой",
            paragraphs: [
              "Transmute гарантирует указанное золото, но sacrificed creep имел собственный bounty. Поэтому cash layer считает только incremental gold после этой альтернативы.",
              "Attack speed и Madstone имеют реальную игровую полезность, однако она зависит от героя, цели neutral Transmute и состояния матча. Универсальный обменный курс превратил бы полезную модель в красивую выдумку."
            ]
          },
          {
            heading: "Что показывает sensitivity на 35 gold",
            paragraphs: [
              "При minute-12 покупке и minute-38 конце cash-only модель получает 18 uses: 2 160 incremental gold и остаётся на 40 gold ниже цены предмета. Payback наступил бы только около 39-й.",
              "Если пользователь оценивает Madstone и attack speed вместе в 35 additional value на use, incremental value растёт до 155. Тогда требуется 15 uses и break-even сдвигается примерно на 33-ю минуту."
            ]
          },
          {
            heading: "Как не превратить sensitivity в самообман",
            paragraphs: [
              "Введи other value до просмотра результата и запиши, что именно она означает. После матча проверь: изменил ли attack speed фарм или fight, и принесла ли Madstone-опция фактическую полезность.",
              "Если оценка существует только затем, чтобы сделать ROI положительным, оставь cash baseline нулевым. Модель должна спорить с решением, а не оправдывать уже купленный предмет."
            ]
          }
        ],
        toolLabel: "Проверить Madstone sensitivity"
      },
      en: {
        title: "How to value Madstone and +40 attack speed without faking Midas ROI",
        description: "Separate guaranteed Transmute gold from patch-specific non-cash value and run a sensitivity case.",
        kicker: "Dota 2 · Non-cash utility",
        thesis: `In ${dotaPatchContext.patch} Midas provides +40 attack speed and a neutral Transmute interacts with Madstone. Those effects can change the decision, but they cannot be silently added to 160 gold as guaranteed cash flow.`,
        readTime: "5 min",
        takeaways: [
          "With a minute-12 purchase and minute-38 finish, the cash-only baseline fails to pay back.",
          "A hypothetical 35 gold of other value per use moves break-even to roughly minute 33.",
          "Other value is user sensitivity, not a verified exchange rate for Madstone or attack speed."
        ],
        sections: [
          {
            heading: "Why the cash model should remain narrow",
            paragraphs: [
              "Transmute guarantees its stated gold, but the sacrificed creep had a bounty. The cash layer therefore counts only incremental gold above that alternative.",
              "Attack speed and Madstone can create real game value, but it depends on hero, neutral target and match state. One universal exchange rate would turn a useful model into attractive fiction."
            ]
          },
          {
            heading: "What a 35-gold sensitivity shows",
            paragraphs: [
              "A minute-12 purchase with a minute-38 finish gets 18 uses in the cash-only model: 2,160 incremental gold, still 40 below the item price. Payback would arrive near minute 39.",
              "If the user values Madstone and attack speed together at 35 additional gold per use, incremental value becomes 155. Fifteen uses are enough and break-even moves to roughly minute 33."
            ]
          },
          {
            heading: "Keep sensitivity from becoming self-justification",
            paragraphs: [
              "Enter other value before viewing the answer and state what it represents. After the match, test whether attack speed changed farm or fighting and whether the Madstone option produced actual utility.",
              "If the estimate exists only to force positive ROI, keep the cash baseline at zero. The model should challenge the purchase, not rationalize it."
            ]
          }
        ],
        toolLabel: "Test Madstone sensitivity"
      }
    }
  },
  {
    slug: "dota-2-why-gpm-without-item-timing-is-incomplete",
    game: "dota",
    updatedAt: "2026-08-12",
    gameVersion: `Dota 2 · Patch ${dotaPatchContext.patch} framework`,
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/dota-2/#economy-map", en: "/en/dota-2/#economy-map" },
    content: {
      ru: {
        title: "Почему хороший GPM ничего не доказывает без item timing",
        description: "Связываем доход с минутой покупки, ближайшим objective и фактической конверсией преимущества.",
        kicker: "Dota 2 · Timing quality",
        thesis: "Финальный GPM измеряет скорость накопления, но стирает момент, когда золото стало usable power. Два игрока с одинаковым GPM могут создать совершенно разную ценность для карты.",
        readTime: "5 мин",
        takeaways: [
          "Записывай не только GPM, но и минуту purchase, delivery и первого objective после timing.",
          "Непотраченное золото до покупки - потенциальная сила; после покупки без fight оно может остаться нереализованной силой.",
          "Лучший replay-вопрос: что команда получила в следующие 120 секунд после ключевого предмета?"
        ],
        sections: [
          {
            heading: "GPM сжимает слишком много событий",
            paragraphs: [
              "Среднее за матч объединяет сильную линию, безопасные waves, kills и поздний comeback gold. Оно не показывает, когда игрок достиг конкретного budget threshold.",
              "Даже точная минута покупки неполна без доставки и позиции героя. Предмет в stash или на courier ещё не выполняет свою экономическую работу."
            ]
          },
          {
            heading: "Timing должен иметь объект монетизации",
            paragraphs: [
              "BKB, Blink или farming item важны не сами по себе. Они меняют доступный набор действий: начать fight, пережить spells, быстрее очистить карту или угрожать Roshan.",
              "Назови objective до покупки. Если после timing команда продолжила делать то же самое и не получила пространство, измеренный прирост net worth мог не превратиться в стратегическую ценность."
            ]
          },
          {
            heading: "Минимальный post-match scorecard",
            paragraphs: [
              "Зафиксируй четыре точки: purchase minute, delivery minute, первый fight и первый objective. Затем добавь результат - выигран, проигран или не состоялся.",
              "Этот короткий timeline полезнее десяти средних метрик. Он показывает, где экономика закончилась действием, а где красивое число осталось на графике."
            ]
          }
        ],
        toolLabel: "Открыть карту match economy"
      },
      en: {
        title: "Why strong GPM proves nothing without item timing",
        description: "Connect income to purchase minute, the nearest objective and the realized conversion of the lead.",
        kicker: "Dota 2 · Timing quality",
        thesis: "Final GPM measures accumulation speed but erases the moment when gold became usable power. Two players with equal GPM can create completely different map value.",
        readTime: "5 min",
        takeaways: [
          "Record GPM together with purchase, delivery and the first objective after the timing.",
          "Unspent gold is potential power; a delivered item without a fight can still remain unrealized power.",
          "The best replay question is what the team gained in the 120 seconds after the key item."
        ],
        sections: [
          {
            heading: "GPM compresses too many events",
            paragraphs: [
              "A match average combines a strong lane, safe waves, kills and late comeback gold. It does not reveal when the player crossed a specific budget threshold.",
              "Even purchase minute is incomplete without delivery and hero position. An item in stash or on the courier has not started its economic job."
            ]
          },
          {
            heading: "A timing needs an object of monetization",
            paragraphs: [
              "BKB, Blink or a farming item does not matter in isolation. It changes the action set: start a fight, survive spells, clear the map faster or threaten Roshan.",
              "Name the objective before buying. If the team does the same thing after the timing and gains no space, higher net worth may not have become strategic value."
            ]
          },
          {
            heading: "The minimum post-match scorecard",
            paragraphs: [
              "Record four points: purchase minute, delivery minute, first fight and first objective. Add the result - won, lost or never attempted.",
              "That short timeline is more useful than ten averages. It shows where economy ended in action and where an attractive number stayed on the graph."
            ]
          }
        ],
        toolLabel: "Open the match economy map"
      }
    }
  },
  {
    slug: "dota-2-component-or-buyback-before-high-ground",
    game: "dota",
    updatedAt: "2026-08-12",
    gameVersion: `Dota 2 · Patch ${dotaPatchContext.patch} scenario model`,
    evidenceStatus: "estimated",
    audiences: ["casual", "grinder"],
    toolPath: {
      ru: "/dota-2/?dota-buyback.buyback-networth=25000&dota-buyback.buyback-gold=1800&dota-buyback.buyback-gpm=700&dota-buyback.buyback-objective=60&dota-buyback.buyback-risk=65#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=25000&dota-buyback.buyback-gold=1800&dota-buyback.buyback-gpm=700&dota-buyback.buyback-objective=60&dota-buyback.buyback-risk=65#buyback-reserve"
    },
    content: {
      ru: {
        title: "Компонент или buyback за минуту до high ground",
        description: "Разбираем позднюю развилку через reserve gap, re-entry и то, создаёт ли покупка новый способ выиграть fight.",
        kicker: "Dota 2 · Closing liquidity",
        thesis: "Перед high ground вопрос не звучит как «всегда держать buyback». Нужно сравнить две опции: новая сила первой жизни и вероятность полезной второй жизни в конкретной позиции.",
        readTime: "6 мин",
        takeaways: [
          "При 25 000 net worth buyback baseline составляет примерно 2 123 gold.",
          "С 1 800 gold и одной минутой при 700 GPM резерв будет сформирован к objective, если золото не потратить.",
          "Компонент оправдан, когда он дискретно меняет fight; buyback - когда re-entry быстрый и вторая жизнь сохраняет impact."
        ],
        sections: [
          {
            heading: "Сначала посчитай границу",
            paragraphs: [
              "Формула 200 + 25 000 / 13 даёт около 2 123 gold. Текущий gap при 1 800 равен примерно 323, а минута при 700 GPM добавляет около 700. Без покупки резерв формируется до push.",
              "Эта арифметика не выбирает действие. Она только показывает, что покупка на сумму больше прогнозируемого surplus осознанно отменяет вторую жизнь."
            ]
          },
          {
            heading: "Оцени качество первой жизни",
            paragraphs: [
              "Компонент ценен, если завершает BKB, даёт dispel, initiation или другой новый ответ на enemy draft. Небольшой линейный прирост damage редко равен новой стратегической возможности.",
              "Задай проверяемый вопрос: какой spell, позицию или героя эта покупка позволяет пережить или убить? Если ответа нет, reserve сохраняет больше optionality."
            ]
          },
          {
            heading: "Проверь путь второй жизни",
            paragraphs: [
              "Buyback после смерти полезен, когда герой быстро возвращается: TP на живую постройку, Boots of Travel, близкая позиция или оборона собственной базы. Без re-entry резерв может оказаться дорогой иллюзией безопасности.",
              "Money Meta показывает coverage и projected gold, но не скрывает эту границу. Вторая жизнь - не только платёж, а платёж плюс время и доступ к fight."
            ]
          }
        ],
        toolLabel: "Запустить high-ground reserve"
      },
      en: {
        title: "Component or buyback one minute before high ground",
        description: "Analyze the late-game fork through reserve gap, re-entry and whether the purchase creates a new way to win the fight.",
        kicker: "Dota 2 · Closing liquidity",
        thesis: "Before high ground, the rule is not ‘always hold buyback.’ Compare the new power of the first life with the probability that a second life is useful from the current position.",
        readTime: "6 min",
        takeaways: [
          "At 25,000 net worth the baseline buyback is roughly 2,123 gold.",
          "With 1,800 gold and one minute at 700 GPM, the reserve will be funded by the objective if nothing is spent.",
          "A component wins when it discretely changes the fight; buyback wins when re-entry is fast and the second life retains impact."
        ],
        sections: [
          {
            heading: "Calculate the boundary first",
            paragraphs: [
              "The formula 200 + 25,000 / 13 returns roughly 2,123 gold. The current gap at 1,800 is about 323, while one minute at 700 GPM adds roughly 700. Without spending, the reserve is ready by the push.",
              "That arithmetic does not choose the action. It shows that a purchase above projected surplus deliberately cancels the second life."
            ]
          },
          {
            heading: "Grade the quality of the first life",
            paragraphs: [
              "A component is valuable when it completes BKB, adds dispel, initiation or another new answer to the enemy draft. A small linear damage increase rarely equals a new strategic capability.",
              "Ask a testable question: which spell, position or hero can this purchase now survive or kill? Without an answer, the reserve preserves more optionality."
            ]
          },
          {
            heading: "Check the route for the second life",
            paragraphs: [
              "A post-death buyback matters when the hero returns quickly: TP to a surviving structure, Boots of Travel, close positioning or a base defense. Without re-entry, the reserve can become an expensive illusion of safety.",
              "Money Meta shows coverage and projected gold without hiding this boundary. A second life is not only payment; it is payment plus time and access to the fight."
            ]
          }
        ],
        toolLabel: "Run the high-ground reserve scenario"
      }
    }
  },
  {
    slug: "dota-2-replay-economy-four-timestamps",
    game: "dota",
    updatedAt: "2026-08-12",
    gameVersion: `Dota 2 · Patch ${dotaPatchContext.patch} replay framework`,
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: { ru: "/dota-2/#player-paths", en: "/en/dota-2/#player-paths" },
    content: {
      ru: {
        title: "Четыре timestamps, которые превращают replay в экономический разбор",
        description: "Purchase, objective, death и buyback помогают найти решение, изменившее траекторию, вместо охоты за одной плохой минутой.",
        kicker: "Dota 2 · Replay review",
        thesis: "Полный replay слишком богат событиями, чтобы учиться на всём сразу. Четыре экономические точки создают короткую причинную цепочку и позволяют построить реалистичный counterfactual.",
        readTime: "5 мин",
        takeaways: [
          "Запиши purchase/delivery, первый objective, первую дорогую смерть и решение о buyback.",
          "Для каждого события укажи доступные альтернативы, а не только фактический результат.",
          "Проверь сценарий ±2 минуты или с сохранённым резервом - это sensitivity, а не поиск виноватого."
        ],
        sections: [
          {
            heading: "Почему четыре точки лучше полного дневника",
            paragraphs: [
              "Попытка отметить каждую ошибку превращает replay в список без приоритета. Экономический review ищет моменты, где капитал менял доступный набор действий.",
              "Purchase показывает конверсию gold в power, objective - реализацию timing, death - уничтоженную опциональность, buyback - решение купить вторую жизнь."
            ]
          },
          {
            heading: "Строй counterfactual, который можно проверить",
            paragraphs: [
              "Вместо «надо было играть лучше» спроси: что изменилось бы при покупке на две минуты раньше, другом компоненте или сохранённых 400 gold? Ответ должен вести к наблюдаемому fight или objective.",
              "Если альтернативный ход не меняет доступные действия команды, он вряд ли является главной экономической развилкой матча."
            ]
          },
          {
            heading: "Сохрани одно правило на следующий матч",
            paragraphs: [
              "Review завершён только тогда, когда появляется короткое правило: например, проверить buyback до покупки после 35-й минуты при живом Roshan.",
              "Один repeatable trigger сильнее длинного списка выводов. Через серию матчей он создаёт собственный dataset, из которого Money Meta сможет строить персональные benchmarks."
            ]
          }
        ],
        toolLabel: "Выбрать replay-путь"
      },
      en: {
        title: "Four timestamps that turn a replay into an economy review",
        description: "Purchase, objective, death and buyback reveal the decision that changed the trajectory instead of hunting one bad minute.",
        kicker: "Dota 2 · Replay review",
        thesis: "A full replay contains too much to learn from everything at once. Four economic points create a short causal chain and support a realistic counterfactual.",
        readTime: "5 min",
        takeaways: [
          "Record purchase/delivery, the first objective, the first expensive death and the buyback decision.",
          "For every event, state the available alternatives instead of only the observed result.",
          "Test the scenario at ±2 minutes or with the reserve preserved - sensitivity, not blame."
        ],
        sections: [
          {
            heading: "Why four points beat a complete diary",
            paragraphs: [
              "Trying to mark every mistake turns a replay into an unranked list. An economy review looks for moments where capital changed the available action set.",
              "Purchase captures gold becoming power, objective captures timing realization, death destroys optionality and buyback purchases a second life."
            ]
          },
          {
            heading: "Build a counterfactual you can test",
            paragraphs: [
              "Replace ‘play better’ with a concrete question: what changes with a purchase two minutes earlier, a different component or 400 gold preserved? The answer should lead to an observable fight or objective.",
              "If the alternative does not change the team's possible actions, it is unlikely to be the match's primary economic fork."
            ]
          },
          {
            heading: "Keep one rule for the next match",
            paragraphs: [
              "A review is complete only when it creates a short rule - for example, check buyback before any purchase after minute 35 while Roshan is alive.",
              "One repeatable trigger is stronger than a long conclusion list. Across matches, it creates a personal dataset that Money Meta can later turn into benchmarks."
            ]
          }
        ],
        toolLabel: "Choose the replay-review path"
      }
    }
  },
  {
    slug: "wow-listed-gold-per-hour-vs-real-gph",
    game: "wow",
    updatedAt: "2026-08-12",
    gameVersion: "WoW Retail · Midnight baseline",
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
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
            heading: "Listed value - это ещё не cash",
            paragraphs: [
              "Игрок добывает 90 единиц товара в час и видит цену 38 gold за штуку. Простое умножение даёт 3 420 gold/hour. Эта цифра корректно описывает стоимость созданного inventory по текущему листингу - но не денежный результат.",
              "Чтобы получить золото, товар должен найти покупателя. Если за один цикл листинга продаётся 65% объёма, только эта часть проходит через рынок. После стандартного 5% Auction House cut выручка дополнительно уменьшается."
            ]
          },
          {
            heading: "Как получается effective GPH",
            paragraphs: [
              "Baseline-модель применяет 65% sell-through и 5% комиссию к 3 420 listed GPH, затем вычитает 120 gold почасовых расходов и 35 gold ожидаемых relisting losses. Результат - около 1 957 effective gold/hour.",
              "Monetization rate составляет примерно 57,2%. Это не означает, что остальные 42,8% исчезли: часть стоимости остаётся в непроданном товаре. Но этим inventory нельзя оплатить покупку сейчас, и для его реализации потребуются время, новые листинги или снижение цены."
            ]
          },
          {
            heading: "Ликвидность важнее красивой цены",
            paragraphs: [
              "За двухчасовую сессию непроданные 35% добычи имеют listed value около 2 394 gold. Если продолжать фармить быстрее, чем рынок поглощает объём, working capital будет расти, а реальная скорость накопления золота - отставать от обещания гайда.",
              "Поэтому сравнивай фармы по effective GPH и inventory at risk. Высокая цена хороша только вместе с достаточным объёмом спроса. Введи собственные данные по предмету, региону и sell-through - baseline нужен как стартовая гипотеза, а не универсальная истина."
            ]
          }
        ],
        toolLabel: "Посчитать мой effective gold/hour"
      },
      en: {
        title: "Why 3,420 gold/hour in WoW may be only 1,957 of real gold",
        description: "Understand the liquidity haircut from sell-through, Auction House cut, expenses and unsold inventory.",
        kicker: "WoW Retail · Market liquidity",
        thesis: "A guide usually multiplies farmed units by current price and reports listed GPH. Until the goods sell, that is inventory value - not gold. In the baseline scenario, 3,420 listed GPH becomes roughly 1,957 effective GPH.",
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
              "A player farms 90 units per hour and sees a 38 gold unit price. Simple multiplication gives 3,420 gold/hour. That accurately describes the marked value of created inventory at the current listing price - not the realized outcome.",
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
              "Compare farms using effective GPH and inventory at risk. A high price is useful only with enough demand behind it. Enter your own item, region and sell-through data - the baseline is a starting hypothesis, not a universal truth."
            ]
          }
        ],
        toolLabel: "Calculate my effective gold/hour"
      }
    }
  },
  {
    slug: "wow-crafting-margin-after-auction-house-liquidity",
    game: "wow",
    updatedAt: "2026-08-12",
    gameVersion: "WoW Retail · Curse of Ula’tek market model",
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/wow/#crafting-margin", en: "/en/wow/#crafting-margin" },
    content: {
      ru: {
        title: "Как считать реальную crafting margin после Auction House и ликвидности",
        description: "Переходим от красивого spread к expected profit с учётом AH cut, sell-through, deposit и размера batch.",
        kicker: "WoW Retail · Recipe economics",
        thesis: "Recipe с положительной разницей между output и reagents всё ещё может терять gold. Сначала посчитай net revenue после AH, затем вероятность продажи и только потом решай, сколько crafts финансировать.",
        readTime: "6 мин",
        takeaways: [
          "Материалы по 825 gold и output 5 × 225 дают 300 gold gross spread до комиссий.",
          "AH cut, deposit и 70% sell-through превращают spread в expected profit, который заметно ниже profit-if-sold.",
          "Batch масштабируется по подтверждённому спросу, а не по положительной марже одной единицы."
        ],
        sections: [
          {
            heading: "Spread является только первым фильтром",
            paragraphs: [
              "Если пять единиц output стоят 1 125 gold, а reagents обходятся в 825, экран показывает 300 gold разницы. Но продажа через Auction House забирает комиссию, а неудачный listing cycle добавляет deposit и время.",
              "Поэтому Money Meta разделяет gross revenue, net revenue, profit if sold и expected profit. Эти четыре числа отвечают на разные вопросы и не должны заменять друг друга."
            ]
          },
          {
            heading: "Sell-through меняет размер разумного batch",
            paragraphs: [
              "Вероятность продажи не делает непроданный товар бесполезным, но превращает часть вложений в working capital. Пока stock лежит в bags или на повторном листинге, это золото нельзя направить в следующий рецепт.",
              "Если batch из двадцати crafts продаётся только частично, inventory at risk становится отдельным ограничением. Положительная unit margin не даёт права бесконечно наращивать объём."
            ]
          },
          {
            heading: "Правило перед кнопкой Craft All",
            paragraphs: [
              "Сначала проверь break-even price. Затем введи наблюдаемый sell-through и сделай discovery batch, который не блокирует весь банк. Следующий batch увеличивай только после фактической продажи предыдущего.",
              "Модель не предсказывает цену конкретного realm. Она показывает, при каких цене, комиссии и скорости продажи решение перестаёт создавать value."
            ]
          }
        ],
        toolLabel: "Проверить crafting margin"
      },
      en: {
        title: "How to calculate real crafting margin after the Auction House and liquidity",
        description: "Move from an attractive spread to expected profit after the AH cut, sell-through, deposit and batch size.",
        kicker: "WoW Retail · Recipe economics",
        thesis: "A recipe with a positive gap between output and reagents can still lose gold. Calculate net revenue after the AH, apply sale probability, and only then decide how many crafts to finance.",
        readTime: "6 min",
        takeaways: [
          "Materials at 825 gold and output of 5 × 225 create a 300 gold gross spread before fees.",
          "The AH cut, deposit and 70% sell-through turn that spread into expected profit well below profit-if-sold.",
          "Scale a batch from confirmed demand, not from positive margin on one unit."
        ],
        sections: [
          {
            heading: "Spread is only the first filter",
            paragraphs: [
              "Five output units at 225 gold create 1,125 gold of gross revenue against 825 gold of reagents. The apparent gap is 300, but an Auction House sale carries a cut and an unsuccessful listing adds deposit cost and delay.",
              "Money Meta therefore separates gross revenue, net revenue, profit if sold and expected profit. The four numbers answer different questions and should not replace each other."
            ]
          },
          {
            heading: "Sell-through determines a sensible batch",
            paragraphs: [
              "Sale probability does not make unsold goods worthless, but it turns part of the investment into working capital. Gold tied up in bags or another listing cannot fund the next recipe now.",
              "When a twenty-craft batch sells only partially, inventory at risk becomes a separate constraint. Positive unit margin is not permission to scale without a limit."
            ]
          },
          {
            heading: "A rule before Craft All",
            paragraphs: [
              "Check break-even price first. Add observed sell-through and use a discovery batch that cannot lock the entire bank. Increase the next batch only after the previous one converts to cash.",
              "The model does not forecast a specific realm price. It shows the price, fee and sale-speed conditions where the decision stops creating value."
            ]
          }
        ],
        toolLabel: "Test crafting margin"
      }
    }
  },
  {
    slug: "wow-profession-knowledge-reset-market-role",
    game: "wow",
    updatedAt: "2026-08-12",
    gameVersion: "WoW Retail · Curse of Ula’tek",
    evidenceStatus: "verified",
    audiences: ["returner", "grinder"],
    toolPath: { ru: "/wow/#player-paths", en: "/en/wow/#player-paths" },
    content: {
      ru: {
        title: "Profession Knowledge reset: сначала выбери рынок, потом нажимай",
        description: "Как превратить одноразовый reset из импульсивного respec в решение о рыночной специализации.",
        kicker: "WoW Retail · Knowledge allocation",
        thesis: "Curse of Ula’tek даёт один reset Knowledge Points для каждой профессии. Его value зависит не от идеального дерева само по себе, а от того, открывает ли новая специализация повторяемый спрос.",
        readTime: "6 мин",
        takeaways: [
          "Факт reset подтверждён официальным обновлением Blizzard для Curse of Ula’tek.",
          "До reset нужно выбрать market role: массовый output, specialized intermediate или high-value orders.",
          "Сильная специализация без demand proof создаёт capability, но не создаёт cash flow."
        ],
        sections: [
          {
            heading: "Reset является ограниченным option",
            paragraphs: [
              "Blizzard добавила один reset потраченных Knowledge Points для каждой профессии. Это полезная возможность исправить старый plan, но она не превращает специализацию в бесплатный тестовый полигон.",
              "Если игрок сначала нажимает reset, а потом ищет рынок, он распределяет редкий ресурс без investment thesis. Правильный порядок начинается с роли и спроса."
            ]
          },
          {
            heading: "Определи market role",
            paragraphs: [
              "Массовый commodity craft требует throughput и ликвидности. Specialized intermediate требует устойчивого спроса со стороны других crafters. Crafting Orders требуют клиентского потока, качества исполнения и комиссии выше economic floor.",
              "Один profession tree может выглядеть сильным в вакууме и слабым для твоего времени, капитала или канала продаж. Поэтому player path задаётся до allocation."
            ]
          },
          {
            heading: "Три доказательства перед reset",
            paragraphs: [
              "Запиши, кто покупатель, какой продукт он берёт и как часто это происходит. Затем оцени доступный капитал и сделай маленький market test там, где это возможно.",
              "Reset становится обоснованным, когда новая ветка связывает проверяемый demand с твоим доступом к recipes и временем. Если старый build уже даёт положительную realised margin, изменение не обязательно."
            ]
          }
        ],
        toolLabel: "Выбрать путь до reset"
      },
      en: {
        title: "Profession Knowledge reset: choose the market before clicking",
        description: "Turn a one-time reset from an impulsive respec into a market-specialization decision.",
        kicker: "WoW Retail · Knowledge allocation",
        thesis: "Curse of Ula’tek provides one Knowledge Point reset for each profession. Its value comes not from a perfect tree in isolation, but from whether the new specialization unlocks repeat demand.",
        readTime: "6 min",
        takeaways: [
          "The reset is confirmed in Blizzard's official Curse of Ula’tek quality-of-life update.",
          "Choose a market role before resetting: mass output, specialized intermediates or high-value orders.",
          "A strong specialization without demand proof creates capability, not cash flow."
        ],
        sections: [
          {
            heading: "The reset is a scarce option",
            paragraphs: [
              "Blizzard added one reset of spent Knowledge Points for each profession. It can repair an old plan, but it does not turn specialization into a costless testing environment.",
              "Clicking first and searching for a market later allocates a scarce resource without an investment thesis. The correct sequence begins with role and demand."
            ]
          },
          {
            heading: "Define the market role",
            paragraphs: [
              "Mass commodity crafting needs throughput and liquidity. Specialized intermediates need recurring demand from other crafters. Crafting Orders need customer flow, execution quality and commission above an economic floor.",
              "One profession tree can look strong in isolation and still fail your time, capital or sales channel. Set the player path before the allocation."
            ]
          },
          {
            heading: "Three proofs before the reset",
            paragraphs: [
              "Write down the buyer, the product and the expected purchase frequency. Estimate available capital and run a small market test where possible.",
              "The reset becomes defensible when the new branch connects observed demand with your recipe access and time. If the old build already produces positive realized margin, change is not mandatory."
            ]
          }
        ],
        toolLabel: "Choose a path before resetting"
      }
    }
  },
  {
    slug: "wow-crafting-order-commission-floor",
    game: "wow",
    updatedAt: "2026-08-12",
    gameVersion: "WoW Retail · Crafting Orders model",
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/wow/#order-floor", en: "/en/wow/#order-floor" },
    content: {
      ru: {
        title: "Crafting Order commission: сколько должна стоить твоя работа",
        description: "Строим minimum commission из crafter materials, recraft reserve и альтернативной стоимости времени.",
        kicker: "WoW Retail · Service economics",
        thesis: "Tip не равен profit. Order создаёт value только после материалов crafter, ожидаемого recraft reserve и времени, которое можно было монетизировать другим способом.",
        readTime: "5 мин",
        takeaways: [
          "Baseline floor равен 1 430 gold: 450 materials, 180 reserve и 800 стоимости шести минут.",
          "Commission 2 500 gold даёт 1 870 cash profit и 1 070 economic profit на order.",
          "Order около floor требует переговоров, а не автоматического accept."
        ],
        sections: [
          {
            heading: "Cash profit не учитывает время",
            paragraphs: [
              "Из commission вычитаются материалы, которые предоставляет crafter, и ожидаемый reserve на recraft. Получившийся cash profit показывает денежный остаток, но ещё не стоимость работы.",
              "Если твой target составляет 8 000 gold/hour, шесть минут имеют opportunity cost 800 gold. Эта сумма входит в economic floor даже без прямого расхода из bags."
            ]
          },
          {
            heading: "Minimum commission является переговорной опорой",
            paragraphs: [
              "При baseline-вводных floor составляет 1 430 gold. Commission заметно выше него создаёт положительную margin of safety. Значение рядом с floor уязвимо к дополнительному общению, recraft или ошибке в материалах.",
              "Это не универсальный прайс-лист профессии. Игрок с другим target GPH, скоростью исполнения или reserve получит другой floor."
            ]
          },
          {
            heading: "Batch orders тоже требуют учёта",
            paragraphs: [
              "Пять одинаковых orders могут выглядеть как 12 500 gold revenue. Но batch economic profit масштабирует и прибыль, и скрытую стоимость времени.",
              "Введи реальные minutes, материалы и вероятность recraft. Принимай order, когда он покрывает полную стоимость; договаривайся, когда margin слишком тонкая; отказывайся, когда commission ниже floor."
            ]
          }
        ],
        toolLabel: "Посчитать мой commission floor"
      },
      en: {
        title: "Crafting Order commission: what your work needs to earn",
        description: "Build a minimum commission from crafter materials, recraft reserve and the opportunity cost of time.",
        kicker: "WoW Retail · Service economics",
        thesis: "A tip is not profit. An order creates value only after crafter materials, expected recraft reserve and time that could have been monetized elsewhere.",
        readTime: "5 min",
        takeaways: [
          "The baseline floor is 1,430 gold: 450 materials, 180 reserve and 800 for six minutes.",
          "A 2,500 gold commission creates 1,870 cash profit and 1,070 economic profit per order.",
          "An order near the floor needs negotiation, not an automatic accept."
        ],
        sections: [
          {
            heading: "Cash profit omits time",
            paragraphs: [
              "Subtract crafter-provided materials and expected recraft reserve from commission. The remaining cash profit measures the monetary balance, but not the full cost of the work.",
              "At a target of 8,000 gold/hour, six minutes carry an 800 gold opportunity cost. That belongs in the economic floor even though it never leaves the bags directly."
            ]
          },
          {
            heading: "Minimum commission anchors the negotiation",
            paragraphs: [
              "The baseline inputs produce a 1,430 gold floor. Commission comfortably above it creates positive margin of safety. A value near the floor is vulnerable to extra messaging, a recraft or a material mistake.",
              "This is not a universal profession price list. A different target GPH, service speed or reserve produces a different floor."
            ]
          },
          {
            heading: "Batch orders still need accounting",
            paragraphs: [
              "Five identical orders can look like 12,500 gold of revenue. Batch economic profit scales both earnings and the hidden cost of time.",
              "Enter actual minutes, materials and recraft expectation. Accept when the order covers full cost, negotiate when the margin is thin, and decline when commission falls below the floor."
            ]
          }
        ],
        toolLabel: "Calculate my commission floor"
      }
    }
  },
  {
    slug: "wow-batch-size-inventory-trap",
    game: "wow",
    updatedAt: "2026-08-12",
    gameVersion: "WoW Retail · Curse of Ula’tek market model",
    evidenceStatus: "estimated",
    audiences: ["casual", "grinder"],
    toolPath: { ru: "/wow/?wow-crafting.craft-count=20#crafting-margin", en: "/en/wow/?wow-crafting.craft-count=20#crafting-margin" },
    content: {
      ru: {
        title: "Batch size: как прибыльный craft превращается в inventory trap",
        description: "Почему положительная unit margin не гарантирует, что рынок поглотит двадцать, пятьдесят или сто crafts.",
        kicker: "WoW Retail · Working capital",
        thesis: "Margin отвечает, выгодна ли единица при заданных условиях. Batch size отвечает, сколько таких единиц можно профинансировать до того, как liquidity станет главным риском.",
        readTime: "5 мин",
        takeaways: [
          "Большой batch умножает ожидаемую прибыль и капитал в непроданном stock одновременно.",
          "Sell-through нужно измерять на выбранном listing cycle, а не угадывать по одной успешной продаже.",
          "Scale rule: увеличивай следующий batch только после подтверждённой cash conversion."
        ],
        sections: [
          {
            heading: "Unit economics не содержит объём спроса",
            paragraphs: [
              "Recipe может давать положительный expected profit на один craft. Это доказывает edge только для тестируемой единицы, но ничего не говорит о покупателях на весь планируемый объём.",
              "Когда двадцать crafts выходят на рынок одновременно, собственный supply может увеличить время продажи или заставить снижать цену."
            ]
          },
          {
            heading: "Working capital становится узким местом",
            paragraphs: [
              "Каждый непроданный item сохраняет некоторую стоимость, но забирает ликвидное gold. Игрок продолжает видеть богатый inventory и одновременно теряет возможность купить следующий набор reagents.",
              "Inventory at risk показывает стоимость непроданной части при текущей цене. Это не guaranteed loss, а сумма, судьба которой ещё не определена рынком."
            ]
          },
          {
            heading: "Лестница масштабирования",
            paragraphs: [
              "Начни с discovery batch. Зафиксируй долю и скорость продаж, relisting и markdown. Второй batch увеличивай только там, где первый подтвердил спрос без чрезмерной скидки.",
              "Если stock растёт быстрее realised sales, останови производство даже при положительной headline margin. Цель market operator состоит в обороте капитала, а не в максимальном количестве crafted items."
            ]
          }
        ],
        toolLabel: "Проверить риск большого batch"
      },
      en: {
        title: "Batch size: how a profitable craft becomes an inventory trap",
        description: "Why positive unit margin does not prove that the market can absorb twenty, fifty or one hundred crafts.",
        kicker: "WoW Retail · Working capital",
        thesis: "Margin asks whether one unit is attractive under the inputs. Batch size asks how many units can be financed before liquidity becomes the primary risk.",
        readTime: "5 min",
        takeaways: [
          "A larger batch multiplies expected profit and capital in unsold stock at the same time.",
          "Measure sell-through over a chosen listing cycle instead of guessing from one successful sale.",
          "Scale rule: increase the next batch only after confirmed cash conversion."
        ],
        sections: [
          {
            heading: "Unit economics contains no demand volume",
            paragraphs: [
              "A recipe can produce positive expected profit per craft. That supports an edge for the tested unit, but says nothing about buyers for the full planned volume.",
              "Putting twenty crafts on the market at once can increase sale time or force a markdown as your own supply meets limited demand."
            ]
          },
          {
            heading: "Working capital becomes the constraint",
            paragraphs: [
              "Every unsold item retains some value but removes liquid gold. A player can look wealthy in inventory while losing the ability to fund another reagent cycle.",
              "Inventory at risk measures the current listed value of the unsold portion. It is not a guaranteed loss; it is value whose outcome the market has not settled."
            ]
          },
          {
            heading: "Use a scaling ladder",
            paragraphs: [
              "Start with a discovery batch. Record sale share, time, relisting and markdown. Increase the second batch only where the first confirmed demand without an excessive discount.",
              "If stock grows faster than realized sales, stop production even with positive headline margin. A market operator manages capital turnover, not the largest pile of crafted items."
            ]
          }
        ],
        toolLabel: "Test large-batch risk"
      }
    }
  },
  {
    slug: "wow-gathering-vs-crafting-limited-time",
    game: "wow",
    updatedAt: "2026-08-12",
    gameVersion: "WoW Retail · Curse of Ula’tek market model",
    evidenceStatus: "estimated",
    audiences: ["returner", "casual"],
    toolPath: { ru: "/wow/#market-rankings", en: "/en/wow/#market-rankings" },
    content: {
      ru: {
        title: "Gathering или crafting, если играть несколько часов в неделю",
        description: "Сравниваем два market route по капиталу, ликвидности, time fit, specialization moat и операционной friction.",
        kicker: "WoW Retail · Limited-time route",
        thesis: "При коротких сессиях лучший route определяется не максимальной theoretical margin. Побеждает цикл, который можно проверить малым капиталом и регулярно превращать в cash без растущего stock.",
        readTime: "6 мин",
        takeaways: [
          "Gathering проще запустить и проверить, но его GPH всё равно требует liquidity haircut.",
          "Commodity crafting может дать лучший throughput, если margin и объём продаж уже подтверждены.",
          "Limited-time игрок выбирает короткий cash cycle, а не профессию с самым высоким ceiling."
        ],
        sections: [
          {
            heading: "Gathering снижает entry risk",
            paragraphs: [
              "Сбор материалов требует меньше working capital и позволяет быстро создать тестовый inventory. Для returner это хороший способ увидеть текущие цены и скорость продаж без большого profession bet.",
              "Но AH sticker price нельзя называть доходом. Effective GPH появляется только после sell-through, комиссии, расходов и непроданного остатка."
            ]
          },
          {
            heading: "Crafting создаёт leverage и риск",
            paragraphs: [
              "Crafting превращает доступ к recipes, Knowledge и process в потенциальный moat. Положительная post-fee margin может масштабировать время лучше, чем личный фарм.",
              "Одновременно reagents замораживают gold до продажи output. Без наблюдаемого спроса leverage превращается в inventory risk."
            ]
          },
          {
            heading: "Выбор для короткой недели",
            paragraphs: [
              "Начни с route, который помещается в одну законченную сессию: создать inventory, выставить, проверить продажу и зафиксировать результат. Если gathering стабильно конвертируется, он остаётся рабочей базой.",
              "Переходи в commodity craft, когда можешь назвать break-even, ожидаемый sell-through и максимальный batch. Conditional ranking показывает fit, а calculators проверяют конкретные цены."
            ]
          }
        ],
        toolLabel: "Сравнить market routes"
      },
      en: {
        title: "Gathering or crafting with only a few hours a week",
        description: "Compare two market routes across capital, liquidity, time fit, specialization moat and operating friction.",
        kicker: "WoW Retail · Limited-time route",
        thesis: "With short sessions, maximum theoretical margin does not define the best route. The useful loop is easy to validate with limited capital and repeatedly converts to cash without growing stock.",
        readTime: "6 min",
        takeaways: [
          "Gathering is easier to start and validate, but its GPH still needs a liquidity haircut.",
          "Commodity crafting can produce stronger throughput once margin and sales volume are confirmed.",
          "A limited-time player chooses a short cash cycle, not the profession with the highest ceiling."
        ],
        sections: [
          {
            heading: "Gathering reduces entry risk",
            paragraphs: [
              "Gathering needs less working capital and creates test inventory quickly. For a returner, it reveals current prices and sale speed without a large profession bet.",
              "The AH sticker price is not income. Effective GPH appears only after sell-through, fees, expenses and unsold stock."
            ]
          },
          {
            heading: "Crafting creates leverage and risk",
            paragraphs: [
              "Crafting turns recipe access, Knowledge and process into a potential moat. Positive post-fee margin can scale time better than personal gathering.",
              "Reagents also lock gold until output sells. Without observed demand, leverage becomes inventory risk."
            ]
          },
          {
            heading: "Choose for a short week",
            paragraphs: [
              "Start with a route that fits into one complete loop: create inventory, list it, check the sale and record the result. If gathering converts consistently, it remains a useful base.",
              "Move into commodity crafting when you can state break-even, expected sell-through and maximum batch. Conditional ranking measures fit; calculators test the actual prices."
            ]
          }
        ],
        toolLabel: "Compare market routes"
      }
    }
  }
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((insight) => insight.slug === slug);
}
