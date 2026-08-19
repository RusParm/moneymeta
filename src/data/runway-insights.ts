import type { Insight } from "./insights";

const gtaSource = {
  label: { ru: "Rockstar Newswire · Brand Wars", en: "Rockstar Newswire · Brand Wars" },
  url: "https://www.rockstargames.com/newswire/article/9k2kok31k3a8k9/declare-your-allegiance-and-determine-who-owns-los-santos-in-the-brand"
};

const dotaSource = {
  label: { ru: "Valve · Dota 2 · патч 7.41e", en: "Valve · Dota 2 · Patch 7.41e" },
  url: "https://www.dota2.com/patches/7.41e"
};

const wowSource = {
  label: { ru: "Blizzard · Curse of Ula’tek", en: "Blizzard · Curse of Ula’tek" },
  url: "https://worldofwarcraft.blizzard.com/news/24294370/curse-of-ulatek-now-live-journey-to-the-coiled-isle"
};

const totalWarSource = {
  label: { ru: "Creative Assembly · заметки патча 8.1", en: "Creative Assembly · Patch 8.1 notes" },
  url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101"
};

const ck3Source = {
  label: { ru: "Paradox · обновление Crusader Kings III 1.19.0.6", en: "Paradox · Crusader Kings III Update 1.19.0.6" },
  url: "https://store.steampowered.com/news/app/1158310/view/677373278422041207"
};

export const runwayInsights = [
  {
    slug: "gta-online-goal-runway-with-reserve",
    game: "gta",
    format: "guide",
    updatedAt: "2026-08-19",
    gameVersion: { ru: "GTA Online · Brand Wars · проверено 18 августа 2026", en: "GTA Online · Brand Wars · checked August 18, 2026" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/gta-online/goal-planner/", en: "/en/gta-online/goal-planner/" },
    sources: [gtaSource],
    content: {
      ru: {
        title: "План до покупки в GTA Online: цель, срок и резерв в одной модели",
        description: "Как посчитать реальный горизонт большой покупки, не смешивая валовую продажу, чистый недельный поток и деньги, которые нельзя тратить.",
        kicker: "GTA Online · планирование капитала",
        thesis: "Большая покупка готова не тогда, когда банк впервые касается цены на витрине, а когда оплачены обязательные улучшения, сохранён рабочий резерв и следующий денежный цикл не ломается. Горизонт нужно строить от чистого недельного потока и заранее выбранной даты решения.",
        readTime: "8 мин",
        takeaways: [
          "Полная цена цели включает обязательные улучшения и расходы первого запуска, а не только базовую покупку.",
          "Резерв - отдельное ограничение. Его нельзя превращать в недостающую часть бюджета ради красивого дедлайна.",
          "Если срок не проходит, сначала меняют необязательные расходы, чистый поток или дату, а не подменяют чистую прибыль валовой продажей."
        ],
        sections: [
          {
            heading: "Сначала определи полную цену решения",
            paragraphs: [
              "Цена на экране покупки часто является только входом. Для рабочего актива могут понадобиться улучшения, стартовое сырьё и капитал на первый цикл. Запиши одну сумму, после которой выбранная система действительно готова выполнять задачу.",
              "Не прибавляй всё желаемое оборудование автоматически. Раздели обязательное для модели и косметическое или удобное. Иначе планировщик будет откладывать полезную покупку ради расходов, которые не меняют денежный цикл."
            ]
          },
          {
            heading: "Защити следующий ход резервом",
            paragraphs: [
              "После покупки игроку всё ещё нужны деньги на сырьё, транспорт, неудачную продажу или другой активный маршрут. Этот остаток не приносит красивой доходности, но сохраняет возможность действовать, если сценарий окажется хуже базового.",
              "Введи резерв отдельным числом и считай цель профинансированной только при условии, что банк покрывает и покупку, и этот пол. Если приходится обнуляться, модель должна честно показать дефицит."
            ]
          },
          {
            heading: "Используй чистый недельный поток",
            paragraphs: [
              "Не умножай максимальную продажу на число сессий. Вычти сырьё и учитывай только циклы, которые реально успеваешь запустить и закрыть. Пассивное производство не равно активному времени, но деньги появляются лишь после выполненной продажи.",
              "Временный бонус Brand Wars может ускорить отдельный маршрут, однако он не должен навсегда повышать базовый темп. Сделай два сценария: текущую неделю и обычный период после события."
            ]
          },
          {
            heading: "Пересобери план по одному рычагу",
            paragraphs: [
              "Если цель не проходит срок, не меняй сразу все поля. Сначала убери необязательную покупку перед целью. Затем проверь один дополнительный подтверждённый денежный цикл. Только после этого переноси дату или выбирай более дешёвую ступень.",
              "Сохрани ссылку на сценарий и вернись после одной недели. Замени расчётный поток фактическим, сравни прогноз с банком и зафиксируй новую дату. Так план превращается в рабочий контроль, а не одноразовый калькулятор."
            ]
          }
        ],
        toolLabel: "Посчитать горизонт покупки"
      },
      en: {
        title: "GTA Online purchase runway: target, date and reserve in one model",
        description: "Calculate a real large-purchase horizon without mixing headline sales, weekly net flow and cash that must remain untouched.",
        kicker: "GTA Online · Capital planning",
        thesis: "A large purchase is not ready when the bank first touches the storefront price. Required upgrades must be funded, an operating reserve must survive and the next cash cycle must remain intact. Build the runway from weekly net flow and a decision date chosen in advance.",
        readTime: "8 min",
        takeaways: [
          "Full target cost includes required upgrades and first-cycle expenses, not only the base purchase.",
          "The reserve is a separate constraint. Do not turn it into missing budget to make the deadline look viable.",
          "When the date fails, change optional spending, net flow or timing before replacing net profit with a headline sale."
        ],
        sections: [
          {
            heading: "Define the full cost of the decision",
            paragraphs: [
              "The store price is often only the entry point. A working asset may need upgrades, initial supplies and cash for the first cycle. Write one amount after which the selected system is actually ready to perform its job.",
              "Do not automatically add every desirable convenience. Separate what the model requires from cosmetic or optional spending. Otherwise the planner delays a useful purchase for costs that do not change the cash loop."
            ]
          },
          {
            heading: "Protect the next move with a reserve",
            paragraphs: [
              "After buying, the player still needs money for supplies, transport, a failed sale or another active route. The balance produces no attractive return, but it preserves the ability to respond when reality lands below the baseline.",
              "Enter that reserve independently and call the target funded only when cash covers both the purchase and the floor. If the plan requires zeroing the bank, the model should expose the shortfall."
            ]
          },
          {
            heading: "Use weekly net flow",
            paragraphs: [
              "Do not multiply the largest sale by the number of sessions. Remove supplies and count only cycles you can actually start and realize. Passive production is not active time, yet cash still arrives only after a completed sale.",
              "A temporary Brand Wars bonus may accelerate one route, but it should not permanently raise the baseline pace. Run one scenario for the live week and another for the ordinary period after the event."
            ]
          },
          {
            heading: "Rebuild one lever at a time",
            paragraphs: [
              "When the target misses the date, do not change every input. Remove one optional purchase before the goal, then test one additional verified cash cycle. Only then move the date or choose a cheaper step.",
              "Save the scenario URL and return after one week. Replace estimated flow with realized flow, compare the forecast with the bank and set the new date. The planner becomes an operating control instead of a one-off calculator."
            ]
          }
        ],
        toolLabel: "Calculate the purchase runway"
      }
    }
  },
  {
    slug: "dota-2-item-timing-with-buyback-buffer",
    game: "dota",
    format: "guide",
    updatedAt: "2026-08-19",
    gameVersion: { ru: "Dota 2 · патч 7.41e", en: "Dota 2 · Patch 7.41e" },
    evidenceStatus: "estimated",
    audiences: ["casual", "grinder"],
    toolPath: { ru: "/dota-2/goal-planner/", en: "/en/dota-2/goal-planner/" },
    sources: [dotaSource],
    content: {
      ru: {
        title: "Тайминг предмета в Dota 2 без скрытой потери резерва",
        description: "Пошаговая модель оставшейся стоимости предмета, текущего золота в минуту, контрольной точки и запаса после покупки.",
        kicker: "Dota 2 · экономика матча",
        thesis: "Предмет к нужной минуте нельзя считать простым делением цены на темп золота. Уже купленные компоненты и текущий банк уменьшают разрыв, а выбранный резерв увеличивает его. Решение полезно только относительно конкретной драки, объекта или угрозы смерти.",
        readTime: "8 мин",
        takeaways: [
          "Считай только оставшуюся цену сборки и начинай горизонт с текущей минуты.",
          "Резерв после покупки - отдельная стратегическая цена, а не часть самого предмета.",
          "Опоздание к контрольной точке может сделать дешёвый компонент сильнее полной сборки."
        ],
        sections: [
          {
            heading: "Заморозь состояние матча сейчас",
            paragraphs: [
              "Запиши текущую минуту, доступное золото и компоненты, которые уже лежат в инвентаре или тайнике. Их историческая цена больше не относится к оставшемуся разрыву. План отвечает только на вопрос, сколько ещё нужно заработать.",
              "Используй устойчивый темп золота, а не лучший отрезок после серии удачных драк. Если карта становится опаснее или фарм придётся делить, создай второй сценарий с пониженным темпом."
            ]
          },
          {
            heading: "Назови контрольную точку",
            paragraphs: [
              "Двадцатая минута сама по себе ничего не значит. Привяжи её к событию: следующему Рошану, защите вышки, пику силы союзника или моменту, когда соперник закончит свою сборку.",
              "Теперь задержка имеет цену. Предмет на минуту позже может быть приемлемым при спокойной карте и бесполезным, если окно команды уже закрылось."
            ]
          },
          {
            heading: "Отдели покупку от резерва",
            paragraphs: [
              "После крупного предмета игрок может остаться без возможности выкупиться, купить расходник или быстро изменить маршрут. Не присваивай этому риску универсальную стоимость: введи тот запас золота, который нужен именно в текущей позиции.",
              "Запусти два случая: полная сборка с резервом и более дешёвый компонент с тем же резервом. Сравни не только минуту готовности, но и силу решения в контрольной драке."
            ]
          },
          {
            heading: "Выбери действие при опоздании",
            paragraphs: [
              "Нужное золото в минуту не является приказом фармить опаснее. Если темп не проходит, сначала проверь другой порядок компонентов, безопасный источник золота или перенос командного действия.",
              "После матча сравни прогнозную минуту с фактической. Причиной расхождения может быть смерть, вынужденная поддержка команды или слишком оптимистичный темп. Следующий расчёт должен учитывать наблюдение, а не защищать старую цифру."
            ]
          }
        ],
        toolLabel: "Проверить тайминг предмета"
      },
      en: {
        title: "Dota 2 item timing without silently spending the buffer",
        description: "A step-by-step model for remaining item cost, current GPM, the match checkpoint and gold that must survive the purchase.",
        kicker: "Dota 2 · Match economy",
        thesis: "An item timing is not price divided by GPM. Purchased components and current gold reduce the remaining gap, while the chosen buffer increases it. The answer matters only relative to a fight, objective or death-risk window.",
        readTime: "8 min",
        takeaways: [
          "Use only the remaining build cost and start the runway at the current minute.",
          "The post-purchase buffer is a separate strategic price, not part of the item itself.",
          "Missing the checkpoint can make a cheaper component stronger than full completion."
        ],
        sections: [
          {
            heading: "Freeze the current match state",
            paragraphs: [
              "Record the current minute, spendable gold and components already in inventory or stash. Their historical price no longer belongs to the remaining gap. The plan asks only how much more must be earned.",
              "Use sustainable current GPM rather than the best burst after several successful fights. If the map is becoming dangerous or farm will be shared, run a second case with a lower pace."
            ]
          },
          {
            heading: "Name the checkpoint",
            paragraphs: [
              "Minute twenty means nothing by itself. Tie it to an event: the next Roshan, a tower defense, an ally power spike or the moment an opponent completes a build.",
              "Delay now has a price. One minute late may be acceptable on a quiet map and useless when the team's window has already closed."
            ]
          },
          {
            heading: "Separate the purchase from the buffer",
            paragraphs: [
              "After a large item, a player can lose the ability to buy back, purchase consumables or change route quickly. Do not assign one universal value to that risk. Enter the gold floor required by this position.",
              "Run two cases: full completion with the buffer and a cheaper component with the same buffer. Compare not only ready time but the decision's power in the checkpoint fight."
            ]
          },
          {
            heading: "Choose an action when the timing misses",
            paragraphs: [
              "Required GPM is not an instruction to farm more dangerously. When the pace fails, test a different component order, safer income or a later coordinated move first.",
              "After the match, compare forecast and realized minute. Death, forced team support or an optimistic pace may explain the gap. The next calculation should absorb the observation rather than defend the old number."
            ]
          }
        ],
        toolLabel: "Test the item timing"
      }
    }
  },
  {
    slug: "wow-gold-goal-effective-gph",
    game: "wow",
    format: "guide",
    updatedAt: "2026-08-19",
    gameVersion: { ru: "WoW Retail · Midnight: Curse of Ula’tek", en: "WoW Retail · Midnight: Curse of Ula’tek" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/wow/goal-planner/", en: "/en/wow/goal-planner/" },
    sources: [wowSource],
    content: {
      ru: {
        title: "Цель по золоту в WoW: срок по ликвидности, а не по витринному доходу",
        description: "Как превратить цену цели, доступные часы и реальный денежный цикл в план, который не считает непроданные запасы готовым золотом.",
        kicker: "WoW Retail · ликвидность рынка",
        thesis: "Путь к цели измеряется золотом, которое реально вернулось в банк. Запасы, положительная маржа и красивый доход в час полезны только после поправки на продажи, комиссии, повторные выставления и оборотный капитал следующего цикла.",
        readTime: "8 мин",
        takeaways: [
          "Отделяй ликвидное золото от стоимости предметов, которые рынок ещё не купил.",
          "Эффективный доход в час должен отражать реализованные продажи после комиссий и расходов.",
          "Оборотный капитал остаётся в модели после достижения цели, иначе следующий цикл остановится."
        ],
        sections: [
          {
            heading: "Начни с ликвидного баланса",
            paragraphs: [
              "Посчитай золото на персонажах и в доступном банке, но не прибавляй полную цену выставленных товаров. Пока покупатель не появился, это запас с неопределённым сроком и ценой реализации.",
              "Если часть инвентаря продаётся стабильно, создай отдельный осторожный сценарий с ожидаемой долей продаж. Не превращай весь аукцион в наличность одним полем."
            ]
          },
          {
            heading: "Построй эффективный доход в час",
            paragraphs: [
              "Для сбора вычти расходы и уменьши заявленный доход на долю материалов, которые не продаются в выбранном цикле. Для крафта используй маржу после комиссии, ожидаемую долю продаж и фактический размер партии.",
              "Возьми несколько обычных сессий, а не лучший час. Рынок с высоким потолком, но редкими продажами может давать худший срок до цели, чем более простой ликвидный маршрут."
            ]
          },
          {
            heading: "Сохрани оборотный капитал",
            paragraphs: [
              "После достижения цели профессии всё ещё нужны реагенты, листинги и возможность проверить следующую партию. Если покупка забирает весь банк, высокая маржа не спасает остановившийся цикл.",
              "Запиши минимальную сумму, которая должна остаться после цели. Она может быть небольшой для сбора и выше для производственного портфеля. Это пользовательская граница, а не официальная механика."
            ]
          },
          {
            heading: "Проверь план на реальной неделе",
            paragraphs: [
              "Введи только часы, которые действительно доступны до срока. План не должен требовать ежедневной проверки аукциона, если твой режим - две длинные сессии по выходным.",
              "Через неделю замени расчётный доход на реализованный поток. Если запасы выросли быстрее банка, снизь темп производства до продажи текущего объёма. Цель выигрывает от оборота, а не от большого оценочного инвентаря."
            ]
          }
        ],
        toolLabel: "Посчитать срок по эффективному доходу"
      },
      en: {
        title: "WoW gold goal: a liquidity runway, not storefront GPH",
        description: "Turn goal cost, available hours and the realized cash cycle into a plan that does not count unsold inventory as finished gold.",
        kicker: "WoW Retail · Market liquidity",
        thesis: "The path to a goal is measured in gold that actually returns to the bank. Inventory, positive margin and attractive GPH become useful only after sale rate, fees, relisting and next-cycle working capital are accounted for.",
        readTime: "8 min",
        takeaways: [
          "Separate liquid gold from items the market has not purchased yet.",
          "Effective GPH should reflect realized sales after fees and costs.",
          "Working capital remains in the model after the goal or the next cycle stops."
        ],
        sections: [
          {
            heading: "Start with the liquid balance",
            paragraphs: [
              "Count gold on characters and in accessible banks, but do not add the full sticker price of listed goods. Until a buyer appears, that value has an uncertain realization date and price.",
              "If part of the inventory sells consistently, build a separate cautious case with expected sell-through. Do not convert the entire auction house into cash with one field."
            ]
          },
          {
            heading: "Build effective GPH",
            paragraphs: [
              "For gathering, remove expenses and haircut advertised income for materials not sold in the chosen cycle. For crafting, use post-fee margin, expected sell-through and realized batch size.",
              "Use several ordinary sessions rather than the best hour. A high-ceiling market with rare sales can produce a worse goal date than a simple liquid route."
            ]
          },
          {
            heading: "Preserve working capital",
            paragraphs: [
              "After the goal, the profession still needs reagents, listings and room to test the next batch. If the purchase consumes the bank, strong unit margin cannot rescue a stopped cycle.",
              "Enter the minimum amount that must remain after the goal. It may be small for gathering and higher for a production portfolio. This is a user boundary, not an official mechanic."
            ]
          },
          {
            heading: "Test the plan against a real week",
            paragraphs: [
              "Enter only hours genuinely available before the deadline. The plan should not require daily auction checks when your routine is two longer weekend sessions.",
              "After one week, replace GPH with realized flow. If inventory grew faster than cash, stop scaling production until current stock sells. The goal benefits from turnover, not a large appraised inventory."
            ]
          }
        ],
        toolLabel: "Calculate the effective-GPH runway"
      }
    }
  },
  {
    slug: "total-war-war-chest-countdown",
    game: "totalwar",
    format: "guide",
    updatedAt: "2026-08-19",
    gameVersion: { ru: "Total War: Warhammer III · патч 8.1", en: "Total War: Warhammer III · Patch 8.1" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/total-war/goal-planner/", en: "/en/total-war/goal-planner/" },
    sources: [totalWarSource],
    content: {
      ru: {
        title: "Казна до войны в Total War: цена подготовки по ходам",
        description: "Планируем набор, ожидаемый дефицит и резерв второго фронта на одном горизонте до объявления войны.",
        kicker: "Total War: Warhammer III · военный горизонт",
        thesis: "Война профинансирована не тогда, когда казна покрывает первый набор. План должен выдерживать подготовку, ожидаемый операционный дефицит и неприкосновенный запас на неожиданную реакцию. Число ходов до войны превращает это требование в проверяемый темп.",
        readTime: "8 мин",
        takeaways: [
          "Цена подготовки включает набор, пополнение и ожидаемый дефицит выбранного горизонта.",
          "Резерв второго фронта остаётся после подготовки и не является скрытым бюджетом войны.",
          "Если требуемый доход за ход слишком высок, меняй масштаб или дату до объявления войны."
        ],
        sections: [
          {
            heading: "Собери полную цену подготовки",
            paragraphs: [
              "Раздели разовые и повторяющиеся расходы. В первый слой попадают набор и немедленное пополнение. Во второй - ожидаемая разница между доходом и содержанием на протяжении рабочей длины войны.",
              "Не пытайся предсказать всю кампанию одной цифрой. Возьми конкретную операцию и один горизонт, после которого решение будет пересмотрено."
            ]
          },
          {
            heading: "Назначь пол казны",
            paragraphs: [
              "Новый фронт может потребовать срочного найма, дипломатического платежа или восстановления после неожиданной потери. Резерв сохраняет эти варианты и не обязан окупаться напрямую.",
              "Выбери сумму, ниже которой казна не должна падать после подготовки. Повтори расчёт с большим полом, если Patch 8.1 или твоя карта усиливают риск активной реакции ИИ. Это сценарий, а не универсальная оценка патча."
            ]
          },
          {
            heading: "Считай чистый поток оставшихся ходов",
            paragraphs: [
              "Используй доход после существующих армий и обязательств. Не подставляй показатель мирной казны, если часть новых расходов уже подтверждена и начнётся до войны.",
              "Количество ходов до объявления - реальный ресурс. Стройка, которая окупится позднее, может быть хорошей долгосрочно и одновременно мешать конкретному военному дедлайну."
            ]
          },
          {
            heading: "Прими решение до кнопки войны",
            paragraphs: [
              "Если казна почти успевает, отложи одну необязательную стройку или сократи первую волну набора. Если разрыв велик, перенос даты честнее, чем ставка на идеальные разграбления.",
              "Сохрани сценарий перед объявлением и проверь после первых ходов. Фактический дефицит и длительность пополнения обновят следующий план лучше, чем общий совет о размере военной казны."
            ]
          }
        ],
        toolLabel: "Проверить казну до войны"
      },
      en: {
        title: "Total War war-chest countdown: pricing preparation by turn",
        description: "Plan recruitment, expected deficit and a second-front reserve across one horizon before declaring war.",
        kicker: "Total War: Warhammer III · War runway",
        thesis: "A war is not funded when the treasury merely covers initial recruitment. The plan must carry preparation, expected operating deficit and an untouchable response floor. Turns before declaration convert that requirement into a testable pace.",
        readTime: "8 min",
        takeaways: [
          "Preparation cost includes recruitment, replenishment and expected deficit across the chosen horizon.",
          "The second-front floor survives preparation and is not hidden war budget.",
          "When required income per turn is unrealistic, change scope or date before declaring."
        ],
        sections: [
          {
            heading: "Build the full preparation cost",
            paragraphs: [
              "Separate one-off and recurring expenses. Recruitment and immediate replenishment belong in the first layer. Expected income minus upkeep across the working war length belongs in the second.",
              "Do not predict an entire campaign with one number. Choose a specific operation and a horizon after which the decision will be reviewed."
            ]
          },
          {
            heading: "Set a treasury floor",
            paragraphs: [
              "A new front may require emergency recruitment, a diplomatic payment or recovery after an unexpected loss. The reserve preserves those options and does not need a direct return.",
              "Choose the cash floor that must remain after preparation. Rerun with a higher floor when Patch 8.1 or the actual map increases the risk of active AI response. That remains a scenario, not a universal rating of the patch."
            ]
          },
          {
            heading: "Count net flow across remaining turns",
            paragraphs: [
              "Use income after existing armies and commitments. Do not enter the peaceful treasury rate when confirmed new expenses begin before declaration.",
              "Turns before war are a real resource. A building can be strong over the campaign and still conflict with the specific military deadline."
            ]
          },
          {
            heading: "Decide before pressing the war button",
            paragraphs: [
              "When the treasury narrowly misses, delay one optional building or trim the first recruitment wave. When the gap is large, moving the date is more honest than assuming perfect sack income.",
              "Save the scenario before declaring and review after the opening turns. Real deficit and replenishment length improve the next plan more than a universal war-chest recommendation."
            ]
          }
        ],
        toolLabel: "Test the pre-war treasury"
      }
    }
  },
  {
    slug: "ck3-succession-buffer-countdown",
    game: "ck3",
    format: "guide",
    updatedAt: "2026-08-19",
    gameVersion: { ru: "Crusader Kings III · версия 1.19.0.6", en: "Crusader Kings III · version 1.19.0.6" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/crusader-kings-3/goal-planner/", en: "/en/crusader-kings-3/goal-planner/" },
    sources: [ck3Source],
    content: {
      ru: {
        title: "Резерв наследника в CK3: сколько месяцев нужно казне",
        description: "Планируем ликвидный старт следующего правителя через рабочий горизонт, чистый доход и отдельный разовый кризис.",
        kicker: "Crusader Kings III · переход власти",
        thesis: "Наследнику нужна не абстрактно большая казна, а запас под конкретные первые решения: войска, подарки, фракции и один плохой сюрприз. Рабочий горизонт до перехода не предсказывает точную дату - он показывает, совместимы ли текущие расходы с устойчивым стартом.",
        readTime: "8 мин",
        takeaways: [
          "Резерв наследника строится от решений первых месяцев, а не от круглой суммы без назначения.",
          "Чистый месячный доход нужно считать после войск и текущих обязательств.",
          "Будущий поток нельзя одновременно тратить на окупаемость стройки и формирование того же резерва."
        ],
        sections: [
          {
            heading: "Разложи первые риски наследника",
            paragraphs: [
              "Запиши возможные расходы первых месяцев: наём войск, подарки ключевым вассалам, выкуп, поездку или другой подтверждённый для твоей партии ответ. Не обязан случиться каждый пункт - модель нужна для выбранного жёсткого случая.",
              "Отдели основной резерв от одного разового кризиса. Так видно, какой слой ломает план и можно ли убрать параллельное обязательство."
            ]
          },
          {
            heading: "Используй рабочий, а не точный горизонт",
            paragraphs: [
              "Дата наследования неопределённа. Выбери период, в котором хочешь проверить устойчивость, и повтори модель для более раннего перехода. Разница показывает чувствительность текущих расходов.",
              "Короткий горизонт - не прогноз смерти. Это плохой сценарий, который помогает понять, не оставляет ли последняя стройка или война наследнику слишком узкий старт."
            ]
          },
          {
            heading: "Не завышай месячный поток",
            paragraphs: [
              "Введи доход после поднятых войск, содержания двора и уже принятых обязательств. Лучший мирный месяц не подходит, если план предполагает войну или активность до перехода.",
              "Если владение может уйти другой линии, его будущий доход не должен полностью финансировать резерв основного наследника. Проверь отдельный сценарий с потерей спорного потока."
            ]
          },
          {
            heading: "Освободи наследнику варианты",
            paragraphs: [
              "При небольшом дефиците отложи последнюю необязательную активность или стройку. При большом разрыве сократи параллельную войну, пересмотри пол резерва по конкретным рискам и проверь более ранний переход.",
              "Сохрани сценарий и обновляй его после изменения здоровья, фракций или владений. Будущие механики Silk & Silver не входят в живой расчёт до релиза и проверки; текущий резерв остаётся привязан к версии 1.19.0.6."
            ]
          }
        ],
        toolLabel: "Посчитать горизонт резерва"
      },
      en: {
        title: "CK3 succession buffer: how many months does the treasury need?",
        description: "Plan a liquid opening for the next ruler through a working horizon, net income and one separate transition shock.",
        kicker: "Crusader Kings III · Succession",
        thesis: "The heir does not need an abstractly large treasury. The buffer should fund specific opening decisions: troops, gifts, factions and one adverse surprise. A working transition horizon does not predict the exact date; it tests whether current spending is compatible with a resilient start.",
        readTime: "8 min",
        takeaways: [
          "Build the heir buffer from opening decisions rather than an unexplained round number.",
          "Monthly net income must be measured after troops and current commitments.",
          "Future flow cannot both repay construction and build the same succession reserve."
        ],
        sections: [
          {
            heading: "Break down the heir's opening risks",
            paragraphs: [
              "List plausible costs in the opening months: troops, gifts to key vassals, ransom, travel or another response supported by the actual campaign. Not every item must happen; the model tests the chosen adverse case.",
              "Separate the core reserve from one transition shock. That reveals which layer breaks the plan and whether a parallel commitment can be removed."
            ]
          },
          {
            heading: "Use a working horizon, not an exact date",
            paragraphs: [
              "Succession timing is uncertain. Choose a period across which resilience matters and rerun for an earlier transfer. The difference exposes sensitivity to current spending.",
              "A short horizon is not a death prediction. It is an adverse case that reveals whether the final building or war leaves the heir too little room."
            ]
          },
          {
            heading: "Do not overstate monthly flow",
            paragraphs: [
              "Enter income after raised troops, court upkeep and existing commitments. The best peaceful month does not fit a plan that includes war or another activity before succession.",
              "If a holding can move to another line, its future income should not fully finance the primary heir's reserve. Run a second case without the exposed flow."
            ]
          },
          {
            heading: "Preserve options for the heir",
            paragraphs: [
              "For a small shortfall, delay the last optional activity or building. For a large gap, reduce a parallel war, rebuild the buffer from named risks and test an earlier transition.",
              "Save the scenario and update it when health, factions or holdings change. Future Silk & Silver mechanics remain outside the live model until release and verification; the current runway stays bound to version 1.19.0.6."
            ]
          }
        ],
        toolLabel: "Calculate the succession runway"
      }
    }
  }
] satisfies Insight[];
