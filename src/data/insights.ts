import { dotaPatchContext } from "./dota-economy";
import { guideInsights } from "./guides";
import { runwayInsights } from "./runway-insights";
import { strategyInsights } from "./strategy-insights";

export type InsightLocale = "ru" | "en";
export type InsightGame = "gta" | "dota" | "wow" | "totalwar" | "ck3";
export type InsightAudience = "returner" | "casual" | "grinder";
export type InsightEvidence = "verified" | "estimated";

export const insightGameLabels: Record<InsightGame, string> = {
  gta: "GTA Online",
  dota: "Dota 2",
  wow: "WoW Retail",
  totalwar: "Total War: Warhammer III",
  ck3: "Crusader Kings III"
};

export interface InsightSection {
  heading: string;
  paragraphs: string[];
}

export interface LocalizedInsight {
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
  format?: "analysis" | "guide";
  featuredInHub?: boolean;
  updatedAt: string;
  gameVersion: Record<InsightLocale, string>;
  evidenceStatus: InsightEvidence;
  audiences: InsightAudience[];
  toolPath: Record<InsightLocale, string>;
  sources?: Array<{ label: Record<InsightLocale, string>; url: string }>;
  content: Record<InsightLocale, LocalizedInsight>;
}

const coreInsights: Insight[] = [
  {
    slug: "gta-online-what-to-buy-with-2-5m",
    game: "gta",
    updatedAt: "2026-08-12",
    gameVersion: { ru: "GTA Online · расчётный набор за июль 2026", en: "GTA Online · July 2026 estimate set" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#next-move",
      en: "/en/gta-online/calculators/business-roi/#next-move"
    },
    content: {
      ru: {
        title: "Что купить в GTA Online с GTA$2,5 млн после долгого перерыва",
        description: "Разбираем, какой бизнес лучше купить вернувшемуся одиночному игроку с учётом окупаемости, чистой прибыли и нагрузки.",
        kicker: "GTA Online · куда вложить капитал",
        thesis: "При исходных допущениях Money Meta первой стоит рассмотреть Кислотную лабораторию. Не потому, что она всегда лучшая, а потому, что при ограниченном времени сочетает доступную цену, быструю окупаемость и удобную продажу в одиночку.",
        readTime: "6 мин",
        takeaways: [
          "Стартовая модель: GTA$1,0 млн вложений и около GTA$275 тыс. чистыми за полный цикл.",
          "Расчётная окупаемость: примерно 17 часов производства, а не 17 часов активной игры.",
          "Ответ меняется, если у тебя уже есть инфраструктура Ночного клуба, действует подходящий бонус или главная цель состоит в максимальном активном доходе."
        ],
        sections: [
          {
            heading: "Короткий ответ",
            paragraphs: [
              "Для одиночного игрока после перерыва главный риск состоит в том, чтобы потратить почти весь капитал на бизнес с долгой окупаемостью и тяжёлым обслуживанием. Поэтому сравнивать нужно не красивую сумму продажи, а чистый денежный поток после закупки сырья, время производства и реальную сложность доставки.",
              "В текущем расчётном наборе Кислотная лаборатория требует около GTA$1,0 млн стартовых вложений. Полная продажа приносит GTA$335 тыс., сырьё обходится в GTA$60 тыс., поэтому чистая прибыль цикла оценивается в GTA$275 тыс. Это около 27,5% доходности на цикл."
            ]
          },
          {
            heading: "Почему не стоит гнаться за самой большой выплатой",
            paragraphs: [
              "Большая сумма продажи сама по себе ничего не говорит об эффективности. Дорогой бизнес может приносить больше за цикл, но дольше производить товар, требовать несколько машин или постоянно отвлекать игрока. Для одиночной игры короткими сессиями красивая цифра легко оборачивается плохим использованием времени.",
              "Money Meta отдельно показывает часы производства и объём ручной работы. Окупаемость Кислотной лаборатории около 17 часов означает время работы бизнеса внутри игры. Самому игроку нужно заметно меньше времени. Это важное отличие от гайдов, которые смешивают пассивное производство и активную игру в один показатель."
            ]
          },
          {
            heading: "Когда рекомендация изменится",
            paragraphs: [
              "Если у тебя уже куплены связанные бизнесы, Ночной клуб может стать важнее, чем показывает упрощённый расчёт только для одного актива. Двойной бонус на конкретные продажи тоже меняет относительный рейтинг. А игрок с пятнадцатью часами в неделю может сознательно принять больше ручной работы ради более высокого потолка дохода.",
              "Поэтому вывод звучит не как «всем покупать Кислотную лабораторию», а как «при этих вводных это наиболее устойчивый первый шаг». Измени бюджет, доступное время и цель в инструменте подбора, чтобы проверить ответ для своего профиля."
            ]
          }
        ],
        toolLabel: "Подобрать следующий шаг"
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
    gameVersion: { ru: "GTA Online · расчётный набор за июль 2026", en: "GTA Online · July 2026 estimate set" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#business-comparison",
      en: "/en/gta-online/calculators/business-roi/#business-comparison"
    },
    content: {
      ru: {
        title: "Кислотная лаборатория или Бункер: что лучше для одиночной игры",
        description: "Сравниваем два популярных бизнеса по цене входа, чистому потоку, окупаемости и удобству для одиночного игрока.",
        kicker: "GTA Online · сравнение бизнесов",
        thesis: "В исходном сценарии Кислотная лаборатория выглядит сильнее как новая покупка для одиночного игрока: она требует меньше капитала и быстрее его возвращает. Бункер даёт близкий доход за час производства, но решение меняется, если он у тебя уже куплен.",
        readTime: "5 мин",
        takeaways: [
          "Кислотная лаборатория: около GTA$1,0 млн на запуск, GTA$275 тыс. чистыми за цикл и примерно 17 часов производства до окупаемости.",
          "Бункер: около GTA$2,375 млн на запуск, GTA$175 тыс. чистыми за исходный цикл и примерно 41 час производства до окупаемости.",
          "Если Бункер уже есть, его прежняя цена больше не влияет на решение: теперь нужно понять, стоит ли запускать производство сегодня."
        ],
        sections: [
          {
            heading: "Почему Кислотная лаборатория выигрывает первый раунд",
            paragraphs: [
              "Оба бизнеса в рабочей модели дают похожую чистую прибыль за час производства: около GTA$59,8 тыс. у Кислотной лаборатории и GTA$58,3 тыс. у Бункера. Но цена запуска отличается более чем вдвое, поэтому похожая скорость дохода не означает одинаково выгодное вложение.",
              "Кислотная лаборатория также удобнее для продажи в одиночку и требует меньше ручной работы. Для игрока с ограниченным временем это снижает риск накопить товар, который потом неудобно реализовать."
            ]
          },
          {
            heading: "Когда Бункер становится правильнее",
            paragraphs: [
              "Если Бункер уже куплен, его историческая цена не должна повторно участвовать в решении о запуске производства сегодня. При почти нулевых новых вложениях сравниваются только маржа, время и другое возможное применение сырья.",
              "У Бункера есть польза и за пределами узкого расчёта денежного потока. Money Meta не присваивает ей выдуманную цену: её нужно учитывать в своём сценарии отдельно."
            ]
          },
          {
            heading: "Практический вывод",
            paragraphs: [
              "Вернувшемуся одиночному игроку сначала стоит рассмотреть Кислотную лабораторию как более устойчивую точку входа. Владельцу Бункера сначала нужно проверить текущую маржу, а уже потом решать, нужен ли ещё один бизнес.",
              "Открой модель сравнения, выбери оба бизнеса и укажи реальные для себя затраты на запуск. Так общий рейтинг быстро превращается в ответ для твоей экономики."
            ]
          }
        ],
        toolLabel: "Сравнить Кислотную лабораторию и Бункер"
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
    gameVersion: { ru: "GTA Online · расчётный набор за июль 2026", en: "GTA Online · July 2026 estimate set" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#model-lab",
      en: "/en/gta-online/calculators/business-roi/#model-lab"
    },
    content: {
      ru: {
        title: "Почему самая большая сумма продажи не означает лучший бизнес",
        description: "Разбираем разницу между суммой продажи, чистой прибылью, скоростью производства и окупаемостью капитала.",
        kicker: "GTA Online · экономика одного цикла",
        thesis: "GTA$500 тыс. на экране продажи могут выглядеть сильнее GTA$335 тыс., но решение меняют стоимость сырья, длительность производства и стартовые вложения. Валовая сумма является началом расчёта, а не выводом.",
        readTime: "5 мин",
        takeaways: [
          "Фабрика фальшивых денег показывает GTA$500 тыс. валовой и GTA$450 тыс. чистой прибыли в исходном сценарии, но производит цикл около 9,4 часа.",
          "Кислотная лаборатория даёт меньшую сумму продажи, но около GTA$59,8 тыс. чистыми за час производства против GTA$47,9 тыс.",
          "Окупаемость капитала в модели составляет около 17 часов у Кислотной лаборатории против примерно 49 у Фабрики фальшивых денег."
        ],
        sections: [
          {
            heading: "Сумма продажи отвечает не на тот вопрос",
            paragraphs: [
              "Сумма финальной продажи говорит, сколько денег приходит до учёта части расходов. Она не показывает, сколько капитала было заморожено, сколько времени товар производился и насколько тяжело было завершить доставку.",
              "Поэтому GTA$500 тыс. валовой выручки у Фабрики фальшивых денег нельзя напрямую сравнивать с GTA$335 тыс. у Кислотной лаборатории. Сначала нужно вычесть расходы, а затем разделить чистую прибыль на время производства."
            ]
          },
          {
            heading: "Два знаменателя, два разных вывода",
            paragraphs: [
              "Чистая прибыль за час производства показывает скорость потока. Доходность цикла показывает эффективность стартового капитала. Окупаемость отвечает, сколько часов производства нужно для возврата вложений.",
              "Бизнес может быть сильным по одному показателю и слабым по другому. Поэтому Money Meta не прячет решение за одной итоговой оценкой."
            ]
          },
          {
            heading: "Как учитывать недельный бонус",
            paragraphs: [
              "Бонус к продаже временно увеличивает валовую и чистую прибыль, но не отменяет цену запуска и ручную работу. Его нужно применять к конкретному сценарию, а не навсегда поднимать бизнес в общем рейтинге.",
              "В модели введи бонус, который действует сейчас, и сравни результат с обычным сценарием. Так станет видно, является ли эта неделя хорошим окном для продажи или реальной причиной покупать новый бизнес."
            ]
          }
        ],
        toolLabel: "Пересчитать сумму продажи в чистую прибыль"
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
    gameVersion: { ru: "GTA Online · расчётный набор за июль 2026", en: "GTA Online · July 2026 estimate set" },
    evidenceStatus: "estimated",
    audiences: ["casual", "returner"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/?gta-next-move.profile=casual&gta-next-move.budget=2500000&gta-next-move.hours=4&gta-next-move.priority=low-friction&gta-next-move.friction=4#next-move",
      en: "/en/gta-online/calculators/business-roi/?gta-next-move.profile=casual&gta-next-move.budget=2500000&gta-next-move.hours=4&gta-next-move.priority=low-friction&gta-next-move.friction=4#next-move"
    },
    content: {
      ru: {
        title: "Лучший GTA Online бизнес, если есть только четыре часа в неделю",
        description: "Строим спокойный сценарий для одиночной игры и не гонимся за теоретическим максимумом дохода.",
        kicker: "GTA Online · маршрут при ограниченном времени",
        thesis: "При четырёх часах в неделю не хватает не только капитала, но и внимания. Сначала отсекаем бизнесы с нагрузкой выше 4 из 10, затем сравниваем только те циклы, которые действительно получится обслуживать.",
        readTime: "5 мин",
        takeaways: [
          "Исходный профиль: GTA$2,5 млн, 4 часа в неделю, приоритет на удобство и допустимая нагрузка 4 из 10.",
          "Кислотная лаборатория остаётся сильным производственным бизнесом. Ночной клуб легко обслуживать, но синергия его склада пока не включена в расчёт.",
          "Временная активность с повышенной наградой заполняет свободное игровое время, но не меняет долгосрочный рейтинг бизнесов."
        ],
        sections: [
          {
            heading: "Почему максимум GTA$ в час может быть ловушкой",
            paragraphs: [
              "Теоретически сильный бизнес бесполезен, если короткая игровая сессия регулярно заканчивается незавершённой логистикой. Для игрока с ограниченным временем стабильное завершение цикла ценнее небольшого преимущества в таблице.",
              "Предел нагрузки заранее убирает бизнесы, которые не подходят твоему стилю. Это не делает их плохими. Они просто не отвечают текущей задаче."
            ]
          },
          {
            heading: "Спокойная недельная архитектура",
            paragraphs: [
              "Первый слой: один производственный цикл, который удобно вести в одиночку. Второй: текущая активная возможность из раздела обновлений. Третий: резерв капитала, чтобы не пропустить редкое окно и не покупать сырьё на последние деньги.",
              "Такой план выглядит скромнее длинного списка активностей, но его легче повторять из недели в неделю. Именно повторяемость и создаёт устойчивый рост."
            ]
          },
          {
            heading: "Как получить ответ под себя",
            paragraphs: [
              "Открой готовый сценарий и поменяй только три вещи: размер банка, часы в неделю и допустимую нагрузку. Инструмент пересчитает короткий список, не заставляя заново изучать всю мету.",
              "Если готов принять нагрузку 5 или 6 из 10, подними предел и посмотри, когда Бункер вернётся в выборку. Такая проверка полезнее универсального списка лучших бизнесов."
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
    gameVersion: { ru: "GTA Online · расчётный набор за июль 2026", en: "GTA Online · July 2026 estimate set" },
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#portfolio",
      en: "/en/gta-online/calculators/business-roi/#portfolio"
    },
    content: {
      ru: {
        title: "Ночной клуб: самостоятельный источник дохода или часть портфеля?",
        description: "Почему простое обслуживание ещё не делает Ночной клуб лучшей первой покупкой и как учитывать связанную инфраструктуру.",
        kicker: "GTA Online · роль в портфеле",
        thesis: "Базовая модель Ночного клуба измеряет денежный поток с малым участием игрока и поэтому высоко ставит его по удобству одиночной игры. Но полный инвестиционный расчёт зависит от связанных бизнесов, и эту инфраструктуру нельзя честно спрятать в одну цифру.",
        readTime: "6 мин",
        takeaways: [
          "Текущий исходный сценарий использует GTA$50 тыс. в час и низкую нагрузку, но не моделирует весь склад.",
          "Высокая оценка для одиночной игры говорит об удобстве, а не доказывает, что это лучшая первая покупка.",
          "Ночной клуб нужно отдельно оценивать как надстройку над существующим портфелем и как новое вложение капитала."
        ],
        sections: [
          {
            heading: "Почему Ночной клуб высоко стоит в рейтинге для одиночной игры",
            paragraphs: [
              "В рейтинге по удобству большой вес получают пригодность для одиночной игры и простота обслуживания. Ночной клуб закономерно выглядит сильным, потому что исходный сценарий требует мало активных минут.",
              "Но оценка отвечает только на этот вопрос. Она не доказывает, что GTA$2 млн на запуск являются лучшим первым расходом для игрока без связанных бизнесов."
            ]
          },
          {
            heading: "Самостоятельный бизнес и портфель: две разные модели",
            paragraphs: [
              "Первая модель сравнивает самостоятельный денежный поток. Портфельная модель должна учитывать уже купленные связанные бизнесы, дополнительное время и весь капитал, замороженный в системе.",
              "Смешивание этих подходов создаёт ложную точность. Money Meta пока не включает синергию склада в исходный сценарий, пока для неё нет полноценной проверяемой модели."
            ]
          },
          {
            heading: "Как принять решение сейчас",
            paragraphs: [
              "Если Ночной клуб уже встроен в твою систему, оценивай следующий апгрейд и его прирост, а не всю историческую цену заново. Если инфраструктуры нет, сравни полную стоимость запуска с Кислотной лабораторией и Бункером по окупаемости.",
              "Оптимизатор портфеля пока использует прозрачный упрощённый цикл. Он помогает увидеть ограничения, но не заменяет отдельную модель склада Ночного клуба. Это прямо обозначенная граница расчёта."
            ]
          }
        ],
        toolLabel: "Проверить роль Ночного клуба в портфеле"
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
    updatedAt: "2026-08-18",
    gameVersion: { ru: "GTA Online · Brand Wars · 13-26 августа 2026", en: "GTA Online · Brand Wars · Aug 13-26 2026" },
    evidenceStatus: "verified",
    audiences: ["returner", "casual", "grinder"],
    toolPath: {
      ru: "/gta-online/#weekly-pulse",
      en: "/en/gta-online/#weekly-pulse"
    },
    content: {
      ru: {
        title: "Когда недельный бонус должен изменить твой план в GTA Online",
        description: "Как отделить бесплатный актив, временный множитель и короткое окно заработка от долгосрочной экономики бизнеса.",
        kicker: "GTA Online · цена недельной возможности",
        thesis: "Brand Wars меняет порядок действий до 26 августа, но не переписывает экономику портфеля. Сначала забери бесплатный Hotring Sabre, затем проверь 4X в свободном режиме и только при подходящем сеансе используй трёхдневное окно 5X для VIP Work.",
        readTime: "5 мин",
        takeaways: [
          "Declasse Hotring Sabre можно забрать бесплатно до 26 августа. Это экономия на покупке, а не регулярный доход.",
          "Испытания и события свободного режима дают 4X GTA$/RP до 26 августа.",
          "VIP Work даёт 5X GTA$/RP только 21-23 августа. Покупать дорогую инфраструктуру ради короткого окна обычно рискованно."
        ],
        sections: [
          {
            heading: "Сначала забери то, что не требует вложений",
            paragraphs: [
              "Бесплатный Hotring Sabre является простым первым действием, если автомобиль нужен тебе как часть коллекции или для соответствующих гонок. Он не требует замораживать капитал, поэтому его не нужно сравнивать с покупкой производственного бизнеса.",
              "Не записывай полную цену автомобиля в прибыль недели. Ты избежал расхода только в том случае, если действительно собирался его покупать. В остальных сценариях это бесплатный необязательный актив."
            ]
          },
          {
            heading: "Затем проверь множитель на короткой выборке",
            paragraphs: [
              "4X в испытаниях и событиях свободного режима выглядит убедительно, но итог зависит от того, какие события появляются, сколько длится ожидание и насколько стабильно ты их завершаешь. Проведи два или три цикла и запиши фактическую выплату вместе с полным временем.",
              "Если маршрут оказывается лучше привычного заработка именно для твоего сеанса, используй его до 26 августа. Если ожидание и перемещения съедают преимущество, множитель не обязан становиться главным планом недели."
            ]
          },
          {
            heading: "Короткое окно 5X требует готового доступа",
            paragraphs: [
              "5X на VIP Work действует только с 21 по 23 августа. Для игрока с уже готовым доступом это повод заранее выделить короткий сеанс. Для нового игрока трёхдневное окно не является достаточным основанием для дорогой покупки без отдельного расчёта.",
              "После 23 августа этот маршрут снова нужно сравнить с обычными выплатами, а после 26 августа весь Brand Wars Pulse уйдёт в архив. Кислотная лаборатория, Бункер и Ночной клуб продолжают оцениваться по собственному денежному циклу."
            ]
          }
        ],
        toolLabel: "Открыть текущие обновления GTA Online"
      },
      en: {
        title: "When a weekly bonus should change your GTA Online plan",
        description: "Separate a free asset, a temporary multiplier and a short cash window from long-horizon business economics.",
        kicker: "GTA Online · Weekly opportunity cost",
        thesis: "Brand Wars changes action order through August 26 without rewriting the portfolio. Claim the free Hotring Sabre first, sample 4X Freemode results next, and use the three-day 5X VIP Work window only when it fits an already accessible session.",
        readTime: "5 min",
        takeaways: [
          "The Declasse Hotring Sabre is free through August 26. That is an acquisition saving, not recurring income.",
          "Freemode Challenges and Events pay 4X GTA$/RP through August 26.",
          "VIP Work pays 5X GTA$/RP only from August 21 through 23. New infrastructure for a short window needs a separate case."
        ],
        sections: [
          {
            heading: "Claim the no-capital option first",
            paragraphs: [
              "The free Hotring Sabre is a simple first action when the car belongs in your collection or race plan. It does not lock capital, so it should not be compared with buying a production business.",
              "Do not record the full sticker price as weekly profit. You avoided an expense only when you genuinely planned to buy the vehicle. Otherwise it is a free optional asset."
            ]
          },
          {
            heading: "Sample the multiplier before rebuilding the week",
            paragraphs: [
              "A 4X Freemode headline is compelling, but the realized result depends on which event appears, waiting time and completion consistency. Run two or three cycles and record payout together with the full clock time.",
              "Use the route through August 26 when it beats your normal loop in your actual session. When waiting and travel erase the edge, the multiplier does not need to become the center of the week."
            ]
          },
          {
            heading: "The 5X window works best with existing access",
            paragraphs: [
              "VIP Work pays 5X only from August 21 through 23. For a player with access already in place, that supports one prepared short session. For a new player, three days is not enough evidence for an expensive purchase without a separate payback case.",
              "After August 23 the route returns to its regular comparison, and after August 26 the complete Brand Wars Pulse becomes archive context. Acid Lab, Bunker and Nightclub still follow their own cash cycles."
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
    gameVersion: { ru: `Dota 2 · патч ${dotaPatchContext.patch} · исходный сценарий`, en: `Dota 2 · Patch ${dotaPatchContext.patch} baseline` },
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: { ru: "/dota-2/#midas-irr", en: "/en/dota-2/#midas-irr" },
    content: {
      ru: {
        title: "Когда Hand of Midas реально окупается и почему 160 золота вводят в заблуждение",
        description: "Считаем дополнительную ценность Midas, минуту окупаемости и итоговую доходность до ожидаемого конца матча.",
        kicker: "Dota 2 · экономика таймингов",
        thesis: "Transmute даёт 160 золота, но не создаёт 160 золота чистой ценности: без Midas тот же крип всё равно принёс бы награду. При покупке на 12-й минуте предмет окупается примерно к 39-й. Если матч закончится на 35-й, вложение останется в минусе.",
        readTime: "5 мин",
        takeaways: [
          "Дополнительная ценность в исходном сценарии: 160 золота от Transmute минус 40 золота награды за крипа. Получается 120 золота за применение.",
          "Для возврата стоимости в 2 200 золота требуется 19 применений. Окупаемость наступает примерно к 39-й минуте.",
          "Скорость атаки, Madstone и темп конкретного героя важны, но их нельзя честно свести к одной универсальной денежной цифре."
        ],
        sections: [
          {
            heading: "Ошибка в обычном расчёте",
            paragraphs: [
              "Самый распространённый подход умножает 160 золота на количество применений Transmute и называет результат доходом Midas. Но без предмета тот же крип можно было убить обычным способом и получить награду. Экономическая ценность предмета равна только разнице между этими сценариями.",
              "Если обычная награда за крипа равна 40 золота, одно применение создаёт 120 дополнительного золота. Делим стоимость предмета в 2 200 золота на эту величину и получаем 19 применений. При перезарядке 90 секунд и первой активации сразу после покупки на 12-й минуте окупаемость наступает примерно на 39-й."
            ]
          },
          {
            heading: "Почему ожидаемая длительность матча решает всё",
            paragraphs: [
              "Если матч закончится на 42-й минуте, модель успевает провести 21 Transmute. Дополнительная ценность составит 2 520 золота, чистый результат после цены предмета будет равен 320 золота, а доходность составит около 14,5%.",
              "При завершении на 35-й минуте останется только 16 применений. Они создадут 1 920 дополнительного золота, что на 280 меньше стоимости предмета. Один и тот же Midas может оказаться выгодным или убыточным только из-за длины матча."
            ]
          },
          {
            heading: "Что формула сознательно не решает",
            paragraphs: [
              "Midas даёт скорость атаки и взаимодействует с текущей механикой Madstone. Для конкретного героя эти эффекты могут перевесить денежный минус или не компенсировать потерянный темп. Универсальная цена такого эффекта была бы выдуманной точностью.",
              "Используй поле другой ценности, если готов сам оценить эффект для своего героя. Модель не выбирает предмет вместо тебя. Она показывает, какая часть решения опирается на расчёт, а какая остаётся игровым суждением."
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
    gameVersion: { ru: `Dota 2 · патч ${dotaPatchContext.patch} · формула выкупа проверена`, en: `Dota 2 · Patch ${dotaPatchContext.patch} · buyback formula verified` },
    evidenceStatus: "verified",
    audiences: ["returner", "casual", "grinder"],
    toolPath: {
      ru: "/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=18000&dota-buyback.buyback-gold=1200&dota-buyback.buyback-gpm=620&dota-buyback.buyback-objective=90&dota-buyback.buyback-risk=55#buyback-reserve"
    },
    content: {
      ru: {
        title: "Сколько золота реально нужно держать на выкуп перед Рошаном",
        description: "Исправляем старую формулу, считаем нехватку резерва и отделяем стоимость второй жизни от автоматического запрета покупать предметы.",
        kicker: "Dota 2 · запас ликвидности",
        thesis: "Выкуп представляет собой не просто сумму в интерфейсе, а возможность вернуться в конкретную драку. Действующая документированная формула: 200 + общая стоимость героя / 13. Старая модель Money Meta использовала базу 100 и занижала нужный резерв ровно на 100 золота.",
        readTime: "6 мин",
        takeaways: [
          "При общей стоимости героя 15 000 выкуп стоит примерно 1 354 золота, а не 1 254.",
          "При общей стоимости героя 18 000 и 1 200 золота сейчас резерва не хватает, но 620 золота в минуту позволяют накопить его за 90 секунд до начала драки за цель.",
          "Готовый выкуп полезен только тогда, когда герой действительно успевает вернуться в драку и повлиять на цель."
        ],
        sections: [
          {
            heading: "Почему формула была занижена",
            paragraphs: [
              "Valve изменила базовую стоимость выкупа в 7.24, а в 7.29 закрепила формулу 200 + общая стоимость героя / 13. Старая база 100 создаёт систематическую ошибку: каждый сценарий выглядит на 100 золота безопаснее, чем он есть.",
              "Разница кажется небольшой, но около границы решения она критична. Игрок может купить компонент и обнаружить, что золота на выкуп больше не хватает перед Рошаном или защитой базы."
            ]
          },
          {
            heading: "Готов сейчас и готов к драке за цель: разные состояния",
            paragraphs: [
              "При общей стоимости героя 18 000 выкуп стоит примерно 1 585 золота. Если сейчас есть 1 200, не хватает около 385. При 620 золота в минуту за следующие 90 секунд модель прогнозирует около 2 130 золота, поэтому к началу драки резерв уже будет собран.",
              "Это не совет заранее потратить всё прогнозируемое золото. Прогноз нужен, чтобы отличить временную нехватку от ситуации, где оставшегося времени на фарм физически недостаточно."
            ]
          },
          {
            heading: "Когда компонент всё-таки сильнее второй жизни",
            paragraphs: [
              "Выкуп сохраняет свободу действий, но не гарантирует результат. Если нет телепорта, ближайшая точка возврата разрушена или герой не успевает в бой, золото не превращается в полезную вторую жизнь.",
              "Сравнивай силу конкретного компонента с ожидаемой ценностью возвращения в драку. Резерв с поправкой на риск показывает масштаб ставки, но финальное решение всё равно зависит от драфта, позиции, перезарядок и цели."
            ]
          }
        ],
        toolLabel: "Открыть сценарий кора перед Рошаном"
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
    gameVersion: { ru: `Dota 2 · патч ${dotaPatchContext.patch} · исходный сценарий`, en: `Dota 2 · Patch ${dotaPatchContext.patch} baseline` },
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: {
      ru: "/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=35&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=12&dota-midas.midas-end=38#midas-irr",
      en: "/en/dota-2/?dota-midas.midas-cost=2200&dota-midas.midas-gold=160&dota-midas.midas-bounty=40&dota-midas.midas-other=35&dota-midas.midas-cooldown=90&dota-midas.midas-purchase=12&dota-midas.midas-end=38#midas-irr"
    },
    content: {
      ru: {
        title: "Как оценивать Madstone и +40 к скорости атаки, не подделывая доходность Midas",
        description: "Отделяем гарантированное золото Transmute от неденежной ценности текущего патча и проверяем разные оценки.",
        kicker: "Dota 2 · неденежная польза",
        thesis: `В ${dotaPatchContext.patch} Midas даёт +40 к скорости атаки, а Transmute нейтрального крипа связан с Madstone. Эти эффекты могут изменить решение, но их нельзя молча добавить к 160 золота как гарантированный денежный поток.`,
        readTime: "5 мин",
        takeaways: [
          "При покупке на 12-й минуте и завершении матча на 38-й расчёт только по золоту не успевает окупиться.",
          "Условные 35 золота дополнительной ценности за применение сдвигают окупаемость примерно к 33-й минуте.",
          "Дополнительная ценность является оценкой пользователя, а не проверенным курсом Madstone или скорости атаки."
        ],
        sections: [
          {
            heading: "Почему денежная модель должна оставаться узкой",
            paragraphs: [
              "Transmute гарантирует указанное золото, но выбранный крип имел собственную награду. Поэтому денежная часть модели считает только дополнительное золото по сравнению с обычным убийством.",
              "Скорость атаки и Madstone дают реальную игровую пользу, однако она зависит от героя, цели Transmute и состояния матча. Универсальный обменный курс превратил бы полезную модель в красивую выдумку."
            ]
          },
          {
            heading: "Что меняет оценка в 35 золота",
            paragraphs: [
              "При покупке на 12-й минуте и конце на 38-й денежная модель получает 18 применений: 2 160 дополнительного золота и нехватку 40 золота до цены предмета. Окупаемость наступила бы только около 39-й минуты.",
              "Если пользователь оценивает Madstone и скорость атаки вместе в 35 единиц дополнительной ценности за применение, общий прирост повышается до 155. Тогда требуется 15 применений, а окупаемость сдвигается примерно на 33-ю минуту."
            ]
          },
          {
            heading: "Как не превратить собственную оценку в самообман",
            paragraphs: [
              "Введи дополнительную ценность до просмотра результата и запиши, что именно она означает. После матча проверь, ускорила ли скорость атаки фарм или драку и принесла ли возможность получить Madstone реальную пользу.",
              "Если оценка нужна только затем, чтобы сделать доходность положительной, оставь её равной нулю. Модель должна проверять решение, а не оправдывать уже купленный предмет."
            ]
          }
        ],
        toolLabel: "Проверить влияние Madstone"
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
    gameVersion: { ru: `Dota 2 · патч ${dotaPatchContext.patch} · схема разбора`, en: `Dota 2 · Patch ${dotaPatchContext.patch} framework` },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/dota-2/#economy-map", en: "/en/dota-2/#economy-map" },
    content: {
      ru: {
        title: "Почему много золота в минуту ничего не доказывает без тайминга предмета",
        description: "Связываем доход с минутой покупки, ближайшей целью на карте и реальным использованием преимущества.",
        kicker: "Dota 2 · качество тайминга",
        thesis: "Итоговое золото в минуту измеряет скорость накопления, но не показывает момент, когда золото превратилось в доступную силу. Два игрока с одинаковым показателем могут принести карте совершенно разную пользу.",
        readTime: "5 мин",
        takeaways: [
          "Записывай не только золото в минуту, но и минуту покупки, доставки и первой цели после получения предмета.",
          "Непотраченное золото до покупки является потенциальной силой. Купленный предмет без последующей драки тоже может остаться нереализованным преимуществом.",
          "Главный вопрос при просмотре повтора: что команда получила в следующие 120 секунд после ключевого предмета?"
        ],
        sections: [
          {
            heading: "Среднее золото в минуту скрывает слишком много событий",
            paragraphs: [
              "Среднее за матч объединяет сильную линию, безопасные пачки крипов, убийства и золото за возвращение в игру. Оно не показывает, когда игрок накопил нужную сумму.",
              "Даже точной минуты покупки недостаточно без учёта доставки и позиции героя. Предмет в тайнике или на курьере ещё не выполняет свою экономическую работу."
            ]
          },
          {
            heading: "У тайминга должна быть цель",
            paragraphs: [
              "BKB, Blink или предмет для фарма важны не сами по себе. Они меняют доступный набор действий: начать драку, пережить заклинания, быстрее очистить карту или угрожать Рошану.",
              "Назови цель ещё до покупки. Если после получения предмета команда продолжила делать то же самое и не получила пространство, прирост общей стоимости героя мог так и не превратиться в стратегическую ценность."
            ]
          },
          {
            heading: "Короткая проверка после матча",
            paragraphs: [
              "Зафиксируй четыре точки: минуту покупки, минуту доставки, первую драку и первую цель. Затем добавь результат: выиграли, проиграли или событие не состоялось.",
              "Эта короткая последовательность полезнее десяти средних показателей. Она показывает, где экономика закончилась действием, а где красивое число осталось на графике."
            ]
          }
        ],
        toolLabel: "Открыть карту экономики матча"
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
    gameVersion: { ru: `Dota 2 · патч ${dotaPatchContext.patch} · сценарная модель`, en: `Dota 2 · Patch ${dotaPatchContext.patch} scenario model` },
    evidenceStatus: "estimated",
    audiences: ["casual", "grinder"],
    toolPath: {
      ru: "/dota-2/?dota-buyback.buyback-networth=25000&dota-buyback.buyback-gold=1800&dota-buyback.buyback-gpm=700&dota-buyback.buyback-objective=60&dota-buyback.buyback-risk=65#buyback-reserve",
      en: "/en/dota-2/?dota-buyback.buyback-networth=25000&dota-buyback.buyback-gold=1800&dota-buyback.buyback-gpm=700&dota-buyback.buyback-objective=60&dota-buyback.buyback-risk=65#buyback-reserve"
    },
    content: {
      ru: {
        title: "Компонент или выкуп за минуту до захода на хайграунд",
        description: "Разбираем позднюю развилку через нехватку резерва, возможность вернуться в драку и реальную силу покупки.",
        kicker: "Dota 2 · ликвидность в концовке",
        thesis: "Перед заходом на хайграунд правило «всегда держать выкуп» слишком простое. Нужно сравнить новую силу первой жизни с вероятностью полезно провести вторую жизнь в конкретной позиции.",
        readTime: "6 мин",
        takeaways: [
          "При общей стоимости героя 25 000 выкуп стоит примерно 2 123 золота.",
          "С 1 800 золота и одной минутой при 700 золота в минуту резерв будет собран к началу захода, если ничего не покупать.",
          "Компонент оправдан, когда он заметно меняет драку. Выкуп сильнее, когда герой быстро возвращается и вторая жизнь сохраняет влияние."
        ],
        sections: [
          {
            heading: "Сначала посчитай границу",
            paragraphs: [
              "Формула 200 + 25 000 / 13 даёт около 2 123 золота. При текущих 1 800 не хватает примерно 323, а минута при таком доходе добавляет около 700. Без покупки резерв успевает собраться до атаки.",
              "Эта арифметика не выбирает действие. Она лишь показывает, что покупка дороже прогнозируемого остатка осознанно отменяет вторую жизнь."
            ]
          },
          {
            heading: "Оцени качество первой жизни",
            paragraphs: [
              "Компонент ценен, если завершает BKB, даёт развеивание, инициацию или другой новый ответ на драфт противника. Небольшой линейный прирост урона редко создаёт новую стратегическую возможность.",
              "Задай проверяемый вопрос: какое заклинание, позицию или героя эта покупка позволяет пережить или убить? Если ответа нет, резерв сохраняет больше свободы действий."
            ]
          },
          {
            heading: "Проверь путь второй жизни",
            paragraphs: [
              "Выкуп после смерти полезен, когда герой быстро возвращается: телепорт на живую постройку, Boots of Travel, близкая позиция или оборона собственной базы. Без пути обратно резерв может оказаться дорогой иллюзией безопасности.",
              "Money Meta показывает покрытие и прогноз золота, но не скрывает эту границу. Вторая жизнь требует не только оплаты, но и времени с доступом к драке."
            ]
          }
        ],
        toolLabel: "Проверить резерв перед хайграундом"
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
    gameVersion: { ru: `Dota 2 · патч ${dotaPatchContext.patch} · схема разбора повторов`, en: `Dota 2 · Patch ${dotaPatchContext.patch} replay framework` },
    evidenceStatus: "estimated",
    audiences: ["returner", "grinder"],
    toolPath: { ru: "/dota-2/#player-paths", en: "/en/dota-2/#player-paths" },
    content: {
      ru: {
        title: "Четыре отметки времени, которые превращают повтор в экономический разбор",
        description: "Покупка, цель, смерть и выкуп помогают найти решение, изменившее ход матча, вместо охоты за одной плохой минутой.",
        kicker: "Dota 2 · разбор повтора",
        thesis: "В полном повторе слишком много событий, чтобы учиться на всём сразу. Четыре экономические точки создают короткую причинную цепочку и позволяют проверить реалистичный альтернативный сценарий.",
        readTime: "5 мин",
        takeaways: [
          "Запиши покупку и доставку, первую цель, первую дорогую смерть и решение о выкупе.",
          "Для каждого события укажи доступные альтернативы, а не только фактический результат.",
          "Проверь сценарий со сдвигом на две минуты или с сохранённым резервом. Это проверка решения, а не поиск виноватого."
        ],
        sections: [
          {
            heading: "Почему четыре точки лучше полного дневника",
            paragraphs: [
              "Попытка отметить каждую ошибку превращает повтор в список без приоритета. Экономический разбор ищет моменты, где золото меняло доступный набор действий.",
              "Покупка показывает превращение золота в силу, цель на карте проверяет реализацию тайминга, смерть уничтожает часть свободы действий, а выкуп является решением купить вторую жизнь."
            ]
          },
          {
            heading: "Строй альтернативный сценарий, который можно проверить",
            paragraphs: [
              "Вместо «надо было играть лучше» спроси: что изменилось бы при покупке на две минуты раньше, другом компоненте или сохранённых 400 золота? Ответ должен вести к конкретной драке или цели на карте.",
              "Если альтернативный ход не меняет доступные действия команды, он вряд ли является главной экономической развилкой матча."
            ]
          },
          {
            heading: "Сохрани одно правило на следующий матч",
            paragraphs: [
              "Разбор завершён только тогда, когда появляется короткое правило. Например, проверять выкуп перед покупкой после 35-й минуты, пока Рошан жив.",
              "Одно повторяемое условие полезнее длинного списка выводов. Через серию матчей оно создаёт собственный набор данных, из которого Money Meta сможет строить личные ориентиры."
            ]
          }
        ],
        toolLabel: "Выбрать путь разбора повтора"
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
    gameVersion: { ru: "WoW Retail · Midnight · исходный сценарий", en: "WoW Retail · Midnight baseline" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/wow/#farm-liquidity", en: "/en/wow/#farm-liquidity" },
    content: {
      ru: {
        title: "Почему 3 420 золота в час в WoW могут оказаться только 1 957 реального золота",
        description: "Учитываем долю продаж, комиссию аукциона, расходы и стоимость непроданных запасов.",
        kicker: "WoW Retail · ликвидность рынка",
        thesis: "Обычный гайд умножает добычу на текущую цену и получает заявленный доход в час. Но пока товар не продан, это стоимость запасов, а не золото. В исходном сценарии 3 420 золота в час по цене выставления превращаются примерно в 1 957 реального золота в час.",
        readTime: "6 мин",
        takeaways: [
          "90 единиц в час × 38 золота = 3 420 золота в час по цене выставления.",
          "При продаже 65% объёма, комиссии аукциона 5% и расходах 155 золота реальный доход падает примерно до 1 957 золота в час.",
          "За двухчасовую сессию около 2 394 золота остаются в непроданных запасах по текущей цене."
        ],
        sections: [
          {
            heading: "Цена выставления ещё не означает полученное золото",
            paragraphs: [
              "Игрок добывает 90 единиц товара в час и видит цену 38 золота за штуку. Простое умножение даёт 3 420 золота в час. Эта цифра описывает стоимость созданного запаса по текущей цене выставления, но не денежный результат.",
              "Чтобы получить золото, товар должен найти покупателя. Если за один цикл продаётся 65% объёма, только эта часть превращается в выручку. Затем аукцион удерживает стандартную комиссию 5%."
            ]
          },
          {
            heading: "Как получается реальный доход в час",
            paragraphs: [
              "Модель применяет долю продаж 65% и комиссию 5% к заявленным 3 420 золота в час, затем вычитает 120 золота почасовых расходов и 35 золота ожидаемых потерь на повторных выставлениях. Результат составляет около 1 957 золота в час.",
              "В золото превращается примерно 57,2% заявленной стоимости. Остальные 42,8% не исчезают: часть остаётся в непроданном товаре. Но им нельзя оплатить покупку сейчас, а для продажи потребуются время, повторные выставления или снижение цены."
            ]
          },
          {
            heading: "Ликвидность важнее красивой цены",
            paragraphs: [
              "За двухчасовую сессию непроданные 35% добычи стоят около 2 394 золота по цене выставления. Если фармить быстрее, чем рынок поглощает объём, всё больше капитала будет застревать в запасах, а реальная скорость накопления золота начнёт отставать от обещания гайда.",
              "Поэтому сравнивай способы фарма по реальному доходу в час и стоимости непроданных запасов. Высокая цена полезна только при достаточном спросе. Введи свои данные по предмету, региону и доле продаж: исходный сценарий является отправной точкой, а не универсальной истиной."
            ]
          }
        ],
        toolLabel: "Посчитать мой реальный доход в час"
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
    gameVersion: { ru: "WoW Retail · Curse of Ula’tek · модель рынка", en: "WoW Retail · Curse of Ula’tek market model" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/wow/#crafting-margin", en: "/en/wow/#crafting-margin" },
    content: {
      ru: {
        title: "Как считать реальную маржу крафта после аукциона и с учётом ликвидности",
        description: "Переходим от красивого ценового разрыва к ожидаемой прибыли с учётом комиссии, доли продаж, залога и размера партии.",
        kicker: "WoW Retail · экономика рецепта",
        thesis: "Рецепт с положительной разницей между ценой результата и стоимостью реагентов всё ещё может терять золото. Сначала посчитай чистую выручку после аукциона, затем вероятность продажи и только потом решай, сколько предметов производить.",
        readTime: "6 мин",
        takeaways: [
          "Материалы за 825 золота и результат 5 × 225 дают разницу 300 золота до комиссий.",
          "Комиссия аукциона, залог и доля продаж 70% превращают эту разницу в ожидаемую прибыль, которая заметно ниже прибыли при гарантированной продаже.",
          "Размер партии увеличивается по подтверждённому спросу, а не только из-за положительной маржи одной единицы."
        ],
        sections: [
          {
            heading: "Разница цен является только первым фильтром",
            paragraphs: [
              "Если пять готовых предметов стоят 1 125 золота, а реагенты обходятся в 825, экран показывает разницу 300 золота. Но аукцион удерживает комиссию, а неудачный цикл продажи добавляет потери залога и времени.",
              "Поэтому Money Meta разделяет валовую выручку, чистую выручку, прибыль при продаже и ожидаемую прибыль. Эти четыре числа отвечают на разные вопросы и не должны заменять друг друга."
            ]
          },
          {
            heading: "Доля продаж меняет разумный размер партии",
            paragraphs: [
              "Непроданный товар не становится бесполезным, но часть вложений застревает в запасах. Пока товар лежит в сумках или повторно выставляется, это золото нельзя направить в следующий рецепт.",
              "Если партия из двадцати предметов продаётся только частично, стоимость запасов становится отдельным ограничением. Положительная маржа одной единицы не позволяет бесконечно наращивать объём."
            ]
          },
          {
            heading: "Правило перед созданием всей партии",
            paragraphs: [
              "Сначала проверь цену безубыточности. Затем введи наблюдаемую долю продаж и сделай небольшую пробную партию, которая не замораживает весь банк. Увеличивай следующую партию только после фактической продажи предыдущей.",
              "Модель не предсказывает цену конкретного игрового мира. Она показывает, при какой цене, комиссии и скорости продажи решение перестаёт приносить пользу."
            ]
          }
        ],
        toolLabel: "Проверить маржу крафта"
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
    gameVersion: { ru: "WoW Retail · Curse of Ula’tek", en: "WoW Retail · Curse of Ula’tek" },
    evidenceStatus: "verified",
    audiences: ["returner", "grinder"],
    toolPath: { ru: "/wow/#player-paths", en: "/en/wow/#player-paths" },
    content: {
      ru: {
        title: "Сброс знаний профессии: сначала выбери рынок, потом нажимай",
        description: "Как превратить одноразовый сброс из импульсивной смены специализации в обоснованное рыночное решение.",
        kicker: "WoW Retail · распределение знаний",
        thesis: "Curse of Ula’tek даёт один сброс потраченных очков знаний для каждой профессии. Его ценность зависит не от идеального дерева самого по себе, а от того, открывает ли новая специализация повторяемый спрос.",
        readTime: "6 мин",
        takeaways: [
          "Сброс подтверждён официальным обновлением Blizzard для Curse of Ula’tek.",
          "До сброса нужно выбрать рыночную роль: массовый товар, специализированный промежуточный материал или дорогие заказы.",
          "Сильная специализация без подтверждённого спроса создаёт возможности, но не создаёт денежный поток."
        ],
        sections: [
          {
            heading: "Сброс является ограниченной возможностью",
            paragraphs: [
              "Blizzard добавила один сброс потраченных очков знаний для каждой профессии. Это полезная возможность исправить старый план, но она не превращает специализацию в бесплатный полигон для экспериментов.",
              "Если игрок сначала нажимает сброс, а потом ищет рынок, он расходует редкую возможность без понятной причины. Правильный порядок начинается с роли и спроса."
            ]
          },
          {
            heading: "Определи свою роль на рынке",
            paragraphs: [
              "Массовое производство требует высокой скорости и ликвидного рынка. Специализированный промежуточный материал требует устойчивого спроса со стороны других ремесленников. Заказы на изготовление требуют потока клиентов, качества исполнения и комиссии выше экономически разумного минимума.",
              "Одно дерево профессии может выглядеть сильным в вакууме и плохо подходить твоему времени, капиталу или каналу продаж. Поэтому путь игрока выбирается до распределения очков."
            ]
          },
          {
            heading: "Три проверки перед сбросом",
            paragraphs: [
              "Запиши, кто покупатель, какой товар он берёт и как часто это происходит. Затем оцени доступный капитал и проведи небольшой рыночный тест там, где это возможно.",
              "Сброс становится обоснованным, когда новая ветка связывает проверяемый спрос с твоим доступом к рецептам и временем. Если старая специализация уже даёт положительную фактическую маржу, менять её необязательно."
            ]
          }
        ],
        toolLabel: "Выбрать путь до сброса"
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
    gameVersion: { ru: "WoW Retail · модель заказов на изготовление", en: "WoW Retail · Crafting Orders model" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/wow/#order-floor", en: "/en/wow/#order-floor" },
    content: {
      ru: {
        title: "Комиссия за заказ на изготовление: сколько должна стоить твоя работа",
        description: "Считаем минимальную комиссию с учётом собственных материалов, резерва на повторный крафт и ценности времени.",
        kicker: "WoW Retail · экономика услуг",
        thesis: "Чаевые не равны прибыли. Заказ создаёт ценность только после вычета материалов ремесленника, ожидаемого резерва на повторный крафт и времени, которое можно было использовать для другого заработка.",
        readTime: "5 мин",
        takeaways: [
          "Минимум в исходном сценарии равен 1 430 золота: 450 на материалы, 180 в резерв и 800 как стоимость шести минут.",
          "Комиссия 2 500 золота даёт 1 870 денежной прибыли и 1 070 экономической прибыли на заказ.",
          "Заказ около минимальной границы требует переговоров, а не автоматического принятия."
        ],
        sections: [
          {
            heading: "Денежная прибыль не учитывает время",
            paragraphs: [
              "Из комиссии вычитаются материалы ремесленника и ожидаемый резерв на повторный крафт. Получившаяся денежная прибыль показывает остаток золота, но ещё не полную стоимость работы.",
              "Если твоя цель составляет 8 000 золота в час, шесть минут стоят 800 золота упущенного заработка. Эта сумма входит в экономический минимум, даже если её не пришлось напрямую достать из сумки."
            ]
          },
          {
            heading: "Минимальная комиссия даёт опору для переговоров",
            paragraphs: [
              "При исходных вводных нижняя граница составляет 1 430 золота. Комиссия заметно выше неё создаёт запас безопасности. Значение рядом с минимумом уязвимо к дополнительному общению, повторному крафту или ошибке в материалах.",
              "Это не универсальный прайс-лист профессии. Игрок с другой целевой скоростью заработка, скоростью исполнения или резервом получит другую нижнюю границу."
            ]
          },
          {
            heading: "Серия заказов тоже требует расчёта",
            paragraphs: [
              "Пять одинаковых заказов могут выглядеть как 12 500 золота выручки. Но серия умножает и прибыль, и скрытую стоимость времени.",
              "Введи реальные минуты, материалы и вероятность повторного крафта. Принимай заказ, когда он покрывает полную стоимость; договаривайся, когда запас прибыли слишком мал; отказывайся, когда комиссия ниже минимума."
            ]
          }
        ],
        toolLabel: "Посчитать мою минимальную комиссию"
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
    gameVersion: { ru: "WoW Retail · Curse of Ula’tek · модель рынка", en: "WoW Retail · Curse of Ula’tek market model" },
    evidenceStatus: "estimated",
    audiences: ["casual", "grinder"],
    toolPath: { ru: "/wow/?wow-crafting.craft-count=20#crafting-margin", en: "/en/wow/?wow-crafting.craft-count=20#crafting-margin" },
    content: {
      ru: {
        title: "Размер партии: как прибыльный крафт превращается в ловушку запасов",
        description: "Почему положительная маржа единицы не гарантирует, что рынок поглотит двадцать, пятьдесят или сто предметов.",
        kicker: "WoW Retail · оборотный капитал",
        thesis: "Маржа отвечает, выгодна ли одна единица при заданных условиях. Размер партии показывает, сколько таких единиц можно профинансировать до того, как нехватка ликвидности станет главным риском.",
        readTime: "5 мин",
        takeaways: [
          "Большая партия одновременно умножает ожидаемую прибыль и капитал в непроданных запасах.",
          "Долю продаж нужно измерять за выбранный цикл выставления, а не угадывать по одной удачной сделке.",
          "Правило роста: увеличивай следующую партию только после подтверждённого превращения товара в золото."
        ],
        sections: [
          {
            heading: "Экономика единицы не показывает объём спроса",
            paragraphs: [
              "Рецепт может давать положительную ожидаемую прибыль на один предмет. Это подтверждает преимущество только для тестовой единицы, но ничего не говорит о покупателях на весь планируемый объём.",
              "Когда двадцать предметов выходят на рынок одновременно, собственное предложение может увеличить время продажи или заставить снизить цену."
            ]
          },
          {
            heading: "Оборотный капитал становится узким местом",
            paragraphs: [
              "Каждый непроданный предмет сохраняет некоторую стоимость, но забирает доступное золото. Игрок видит богатые запасы и одновременно теряет возможность купить следующий набор реагентов.",
              "Стоимость запасов под риском показывает непроданную часть по текущей цене. Это не гарантированный убыток, а сумма, судьбу которой ещё не определил рынок."
            ]
          },
          {
            heading: "Лестница масштабирования",
            paragraphs: [
              "Начни с небольшой пробной партии. Зафиксируй долю и скорость продаж, повторные выставления и снижение цены. Увеличивай вторую партию только там, где первая подтвердила спрос без чрезмерной скидки.",
              "Если запасы растут быстрее фактических продаж, останови производство даже при положительной заявленной марже. Цель торговца состоит в обороте капитала, а не в максимальном количестве созданных предметов."
            ]
          }
        ],
        toolLabel: "Проверить риск большой партии"
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
    gameVersion: { ru: "WoW Retail · Curse of Ula’tek · модель рынка", en: "WoW Retail · Curse of Ula’tek market model" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual"],
    toolPath: { ru: "/wow/#market-rankings", en: "/en/wow/#market-rankings" },
    content: {
      ru: {
        title: "Сбор ресурсов или крафт, если играть несколько часов в неделю",
        description: "Сравниваем два рыночных пути по капиталу, ликвидности, затратам времени, силе специализации и ручной нагрузке.",
        kicker: "WoW Retail · путь при ограниченном времени",
        thesis: "При коротких сессиях лучший путь определяется не максимальной теоретической маржей. Побеждает цикл, который можно проверить малым капиталом и регулярно превращать в золото без растущих запасов.",
        readTime: "6 мин",
        takeaways: [
          "Сбор ресурсов проще запустить и проверить, но заявленный доход в час всё равно нужно уменьшать с учётом реальных продаж.",
          "Массовый крафт может дать лучший поток, если маржа и объём продаж уже подтверждены.",
          "Игрок с ограниченным временем выбирает короткий денежный цикл, а не профессию с самым высоким теоретическим потолком."
        ],
        sections: [
          {
            heading: "Сбор ресурсов снижает риск на старте",
            paragraphs: [
              "Сбор материалов требует меньше оборотного капитала и позволяет быстро создать пробный запас. Для вернувшегося игрока это хороший способ увидеть текущие цены и скорость продаж без большой ставки на профессию.",
              "Но цену на аукционе нельзя называть доходом. Реальный доход в час появляется только после учёта доли продаж, комиссии, расходов и непроданного остатка."
            ]
          },
          {
            heading: "Крафт создаёт преимущество и риск",
            paragraphs: [
              "Крафт превращает доступ к рецептам, знаниям и отлаженному процессу в потенциальное преимущество. Положительная маржа после комиссий может масштабировать время лучше личного фарма.",
              "Одновременно реагенты замораживают золото до продажи готового товара. Без наблюдаемого спроса преимущество превращается в риск непроданных запасов."
            ]
          },
          {
            heading: "Выбор для короткой недели",
            paragraphs: [
              "Начни с пути, который помещается в одну законченную сессию: собрать или создать товар, выставить его, проверить продажу и записать результат. Если сбор ресурсов стабильно превращается в золото, он остаётся рабочей основой.",
              "Переходи к массовому крафту, когда можешь назвать цену безубыточности, ожидаемую долю продаж и максимальный размер партии. Рейтинг показывает подходящий путь, а калькуляторы проверяют конкретные цены."
            ]
          }
        ],
        toolLabel: "Сравнить рыночные пути"
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

export const insights: Insight[] = [...guideInsights, ...strategyInsights, ...runwayInsights, ...coreInsights];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((insight) => insight.slug === slug);
}
