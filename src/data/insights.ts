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
        title: "Почему самая большая сумма продажи — не лучший бизнес",
        description: "Разбираем разницу между headline payout, net profit, production throughput и payback капитала.",
        kicker: "GTA Online · Unit economics",
        thesis: "GTA$500 тыс. на экране продажи могут выглядеть сильнее GTA$335 тыс., но решение меняют supplies, длительность производства и стартовые вложения. Gross — это начало расчёта, а не вывод.",
        readTime: "5 мин",
        takeaways: [
          "Counterfeit Cash показывает GTA$500 тыс. gross и GTA$450 тыс. net в baseline, но производит цикл около 9,4 часа.",
          "Acid Lab показывает меньший gross, но примерно GTA$59,8 тыс. net на production-hour против GTA$47,9 тыс.",
          "Капитальная окупаемость в модели — около 17 часов у Acid Lab против примерно 49 у Counterfeit Cash."
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
              "Friction ceiling заранее удаляет активы, которые конфликтуют со стилем игры. Это не объявляет их плохими — они просто не подходят текущему мандату."
            ]
          },
          {
            heading: "Спокойная недельная архитектура",
            paragraphs: [
              "Первый слой — один solo-friendly production loop. Второй — текущая active-cash возможность из Pulse. Третий — резерв капитала, чтобы не пропустить редкое окно и не покупать supplies с пустым банком.",
              "Такой план выглядит менее эффектно, чем длинный список активностей, но лучше удерживается из недели в неделю. Повторяемость и есть реальный compounding."
            ]
          },
          {
            heading: "Как получить ответ под себя",
            paragraphs: [
              "Открой готовый casual-сценарий и поменяй только три вещи: банк, часы и friction. Decision engine пересчитает shortlist, не заставляя тебя заново изучать всю мету.",
              "Если готов принять friction 5–6/10, расширь потолок и посмотри, когда Bunker возвращается в выборку. Это и есть sensitivity, которая важнее универсального топа."
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
              "If you accept friction of 5–6/10, raise the ceiling and watch when Bunker returns. That sensitivity is more useful than a universal top list."
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
          "Nightclub нужно оценивать как слой над уже существующим портфелем и отдельно — как новый capital allocation."
        ],
        sections: [
          {
            heading: "Почему Nightclub поднимается в solo ranking",
            paragraphs: [
              "В low-friction lens большой вес получают solo suitability и операционная простота. Nightclub закономерно выглядит сильным, потому что baseline требует мало активных минут.",
              "Но score отвечает ровно на заданный вопрос. Он не доказывает, что GTA$2 млн setup — лучший первый расход для игрока без связанной инфраструктуры."
            ]
          },
          {
            heading: "Standalone и portfolio — две модели",
            paragraphs: [
              "Standalone-модель сравнивает самостоятельный денежный поток. Portfolio-модель должна учитывать, какие feeder-активы уже есть, сколько дополнительного времени требуется и какой объём капитала заморожен во всей системе.",
              "Смешивание этих двух моделей создаёт ложную точность. Money Meta оставляет warehouse-синергию вне baseline до полноценной проверяемой модели."
            ]
          },
          {
            heading: "Как принять решение сейчас",
            paragraphs: [
              "Если Nightclub уже встроен в твою систему, оценивай следующий маржинальный апгрейд, а не повторно всю историческую цену. Если инфраструктуры нет, сравни полный setup с Acid Lab и Bunker по payback.",
              "Portfolio Optimizer пока использует прозрачный упрощённый цикл. Он полезен для constraints, но не заменяет отдельную Nightclub warehouse-модель — это явно обозначенное ограничение, а не скрытый пробел."
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
              "Portfolio Optimizer currently uses a transparent simplified cycle. It helps test constraints, but it does not replace a dedicated Nightclub warehouse model — an explicit limitation, not a hidden gap."
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
    gameVersion: "GTA Online · Summer Heist Event · Aug 6–12 2026",
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
        thesis: "Weekly-бонус меняет порядок действий, но не всегда меняет лучшую долгосрочную покупку. В окне 6–12 августа правильная последовательность начинается со входного GTA$1 млн и первого свежего Cayo-run, а production-рейтинг остаётся отдельным.",
        readTime: "5 мин",
        takeaways: [
          "До конца 12 августа официальный event даёт GTA$1 млн за вход; начисление может занять до 72 часов.",
          "Первое свежее прохождение Cayo Perico в этом окне гарантирует Panther Statue.",
          "2X/3X активности — временный active-cash слой; они не применяются автоматически к постоянным production-бизнесам."
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
              "Гарантированная Panther Statue на первом свежем Cayo-прохождении — opportunity with expiry. Она заслуживает места выше обычного рутинного цикла, если игрок способен завершить run в срок.",
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
        thesis: "A weekly bonus changes action order but does not always change the best long-term purchase. In the August 6–12 window, the sequence starts with the GTA$1m login value and a first fresh Cayo run while production rankings remain separate.",
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
    gameVersion: "Dota 2 · Patch 7.41 baseline",
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
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
