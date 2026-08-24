import type { Insight } from "./insights";

const totalWarSource = {
  label: { ru: "Creative Assembly · заметки патча 8.1", en: "Creative Assembly · Patch 8.1 notes" },
  url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101"
};

const totalWarUpdate80Source = {
  label: { ru: "Creative Assembly · заметки обновления 8.0", en: "Creative Assembly · Update 8.0 notes" },
  url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/98"
};

const totalWarHotfixSource = {
  label: { ru: "Creative Assembly · хотфикс 8.1.1", en: "Creative Assembly · Hotfix 8.1.1" },
  url: "https://community.creative-assembly.com/total-war/total-war-warhammer/forums/7-patch-notes-amp-announcements/threads/14865"
};

const totalWarEndTimesSource = {
  label: { ru: "Creative Assembly · Lords of the End Times", en: "Creative Assembly · Lords of the End Times" },
  url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/102"
};

const ck3Source = {
  label: { ru: "Paradox · обновление Crusader Kings III 1.19.0.6", en: "Paradox · Crusader Kings III Update 1.19.0.6" },
  url: "https://store.steampowered.com/news/app/1158310/view/677373278422041207"
};

export const strategyInsights = [
  {
    slug: "total-war-campaign-capital-presets-field-guide",
    game: "totalwar",
    format: "guide",
    updatedAt: "2026-08-24",
    gameVersion: { ru: "Total War: Warhammer III · хотфикс 8.1.1 · экономика патча 8.1", en: "Total War: Warhammer III · Hotfix 8.1.1 · Patch 8.1 economy" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/total-war/tools/campaign-presets/", en: "/en/total-war/tools/campaign-presets/" },
    sources: [totalWarHotfixSource, totalWarSource, totalWarUpdate80Source, totalWarEndTimesSource],
    content: {
      ru: {
        title: "Четыре режима казны Total War: полевой гайд по фазам кампании",
        description: "Как перевести состояние кампании Total War: Warhammer III в стресс-тест казны для развития, войны, закрепления и второго фронта.",
        kicker: "Total War: Warhammer III · штаб кампании",
        thesis: "Один и тот же запас золота означает разные вещи перед стройкой, войной и после захвата. Поэтому сначала нужно назвать фазу кампании, затем защитить обязательный резерв и только после этого проверять новое вложение. Пресет не выбирает за игрока и не подставляет цену фракции. Он не даёт забыть расход, который обычно становится виден через несколько ходов.",
        answerLabel: "Короткий порядок перед концом хода",
        answer: "Назови контрольный ход, отдели защищённый резерв, посчитай новый постоянный расход и проведи один плохой сценарий с потерей дохода и срочным платежом.",
        readTime: "11 мин",
        takeaways: [
          "Чистый доход вводится после текущего содержания. Новая армия идёт отдельной строкой.",
          "Фракционный пресет Cathay опирается только на подтверждённое разделение технологий Military и Provinces. Все экономические значения остаются вводными сохранения.",
          "Анонс обновления на 24 сентября является датой пересмотра, а не частью живой формулы патча 8.1."
        ],
        sections: [
          {
            heading: "Сначала сделай снимок, который помещается на одном экране",
            paragraphs: [
              "Запиши казну и чистый доход после уже существующего содержания. Затем отдельно добавь разовую цену нового решения, его постоянный расход, число ходов до пересмотра и резерв, который нельзя тратить. Это базовый сценарий без неприятного сюрприза.",
              "Для стресс-сценария нужны ещё три значения: доход территории под угрозой, сколько ходов он может отсутствовать и один срочный платёж. Это не попытка угадать ИИ. Ты проверяешь, останется ли у плана выход, если спокойная линия не сработает."
            ]
          },
          {
            heading: "Развитие Grand Cathay: источник задаёт направление, не очередь строительства",
            paragraphs: [
              "В заметках обновления 8.0 Creative Assembly разделила технологии Cathay на Military и Provinces. Ветка Provinces относится к управлению провинциями, экономике и действиям кампании. Это достаточная опора для отдельного режима развития, но не для универсального списка технологий или готовой цены вложения.",
              "В этом режиме контрольный ход ставится перед следующей большой войной. Стройка проходит только тогда, когда стресс-остаток сохраняет резерв, а отдельная модель окупаемости показывает возврат вложения до контрольной точки. Прирост дохода нужно брать с экрана конкретного решения."
            ]
          },
          {
            heading: "Перед войной: цена найма является только первым платежом",
            paragraphs: [
              "Пограничная мобилизация начинается с разовой цены набора, но решение определяется новым содержанием на всём горизонте. Если поток становится отрицательным, плану нужна конкретная дата выхода: мир, добыча, роспуск дорогого набора или другой подтверждённый источник денег.",
              "Стресс-сценарий добавляет временную потерю пограничного дохода и один срочный ответ. Когда после этого казна ниже защищённого остатка, армия может быть доступна сегодня, но кампания ещё не готова её содержать."
            ]
          },
          {
            heading: "После захвата: новая территория может быть активом и обязательством одновременно",
            paragraphs: [
              "После победы легко смотреть только на добычу и будущий доход. Сначала собери расходы первых ходов: восстановление, срочные постройки, пополнение и защиту новой границы. Если удержание требует отдельной армии, её содержание относится к цене территории.",
              "Не растягивай ожидаемый доход до конца кампании. Выбери реальную точку пересмотра и проверь, успевает ли территория создать свободный капитал внутри этого окна. Если весь поток уходит на защиту, экономическая ценность удержания пока равна не доходу, а стратегической позиции."
            ]
          },
          {
            heading: "Поздняя игра: второй фронт проверяется отдельными деньгами",
            paragraphs: [
              "Патч 8.1 изменил приоритеты ИИ кампании, в том числе снизил вес части оборонительных задач поздней игры и немного повысил приоритет действий против сил противника. Это подтверждённый контекст для стресс-теста, но не универсальная вероятность нападения.",
              "Выдели доход, потеря которого ломает длинную войну, и цену одного срочного ответа на другом направлении. Если этот случай использует резерв первого фронта, план считает одни деньги дважды. Масштаб войны нужно сократить до уровня, при котором второй ответ остаётся профинансирован."
            ]
          },
          {
            heading: "24 сентября является точкой пересмотра, а не будущей цифрой",
            paragraphs: [
              "Creative Assembly объявила Lords of the End Times и крупное обновление на 24 сентября 2026 года. В анонс входят новые лорды, переработки и изменения кампании. Пока обновление не вышло, этот материал не подтверждает новые доходы, расходы или формулы.",
              "Сохрани ссылку на свой сценарий и после релиза снова проверь официальный список изменений. До этого момента рабочим слоем остаются хотфикс 8.1.1, экономический контекст патча 8.1 и фактические значения твоего сохранения."
            ]
          }
        ],
        toolLabel: "Открыть штаб кампании"
      },
      en: {
        title: "Four Total War treasury modes: a campaign-phase field guide",
        description: "Turn a Total War: Warhammer III save state into a treasury stress test for development, war, consolidation and second-front pressure.",
        kicker: "Total War: Warhammer III · Campaign command",
        thesis: "The same gold balance means different things before construction, before war and after conquest. Name the campaign phase first, protect the required reserve and only then test the new commitment. A preset neither chooses for the player nor inserts a faction price. It prevents the cost that appears several turns later from disappearing from the decision.",
        answerLabel: "The short order before ending the turn",
        answer: "Set a review turn, separate the protected reserve, price the new recurring burn and run one adverse case with temporary income loss and an emergency payment.",
        readTime: "11 min",
        takeaways: [
          "Enter net income after current upkeep. Put the new army on its own line.",
          "The Cathay preset uses only the sourced Military and Provinces technology split. Every economic value remains a save-specific input.",
          "The September 24 update announcement is a review date, not part of the live Patch 8.1 formula."
        ],
        sections: [
          {
            heading: "Begin with a snapshot that fits on one screen",
            paragraphs: [
              "Record treasury and net income after existing upkeep. Then separate the one-off price of the decision, its recurring burn, turns to review and the reserve that cannot be spent. This is the base case without disruption.",
              "The stress case needs three more inputs: income exposed to loss, the number of disrupted turns and one emergency response cost. This is not an AI forecast. It tests whether the plan retains an exit when the calm line fails."
            ]
          },
          {
            heading: "Grand Cathay development: the source defines direction, not a build order",
            paragraphs: [
              "Creative Assembly's Update 8.0 notes split Cathayan technologies into Military and Provinces. The Provinces branch covers provincial management, economy and campaign actions. That supports a dedicated development mode, but not a universal technology order or ready-made investment price.",
              "In this mode, the review turn sits before the next major war. Construction passes only when stress cash preserves the reserve and the separate payback model returns capital before that point. Read marginal income from the actual campaign decision."
            ]
          },
          {
            heading: "Before war: recruitment price is only the first payment",
            paragraphs: [
              "Frontier mobilization begins with recruitment cost, but recurring upkeep across the horizon determines sustainability. Negative flow needs a dated exit: peace, loot, disbanding an expensive force or another observable source of cash.",
              "The stress case adds temporary frontier income loss and one emergency response. When treasury then falls below the protected floor, the army may be affordable today while the campaign is not ready to carry it."
            ]
          },
          {
            heading: "After conquest: territory can be an asset and a liability together",
            paragraphs: [
              "Loot and future flow are visible after victory. First collect the opening-turn costs: recovery, urgent construction, replenishment and defence of the new frontier. If holding requires another army, assign its upkeep to the territory.",
              "Do not extend expected flow to the end of the campaign. Set a real review point and test whether the territory creates deployable capital inside that window. If defence consumes all flow, the value of holding is currently positional rather than financial."
            ]
          },
          {
            heading: "Late game: the second front needs separate funding",
            paragraphs: [
              "Patch 8.1 changed campaign AI priorities, including less weight on some late-game defensive tasks and slightly more priority on actions targeting enemy forces. This is sourced context for a stress test, not a universal attack probability.",
              "Identify the income whose loss breaks the long war and price one emergency response elsewhere. If that case spends the first front's reserve, the plan assigns the same gold twice. Reduce war scope until the second response remains funded."
            ]
          },
          {
            heading: "September 24 is a review point, not a future value",
            paragraphs: [
              "Creative Assembly announced Lords of the End Times and a major update for September 24, 2026. The announcement covers new lords, reworks and campaign changes. Before release, it confirms no new income, cost or formula.",
              "Save the scenario link and review official notes again after release. Until then, Hotfix 8.1.1, Patch 8.1 context and actual values from the save remain the working layer."
            ]
          }
        ],
        toolLabel: "Open campaign command"
      }
    }
  },
  {
    slug: "total-war-warhammer-3-building-payback-before-war",
    game: "totalwar",
    format: "guide",
    updatedAt: "2026-08-18",
    gameVersion: { ru: "Total War: Warhammer III · патч 8.1", en: "Total War: Warhammer III · Patch 8.1" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/total-war/tools/#building-payback", en: "/en/total-war/tools/#building-payback" },
    sources: [totalWarSource],
    content: {
      ru: {
        title: "Окупится ли здание до следующей войны: гайд по горизонту кампании",
        description: "Как сравнить прирост дохода, задержку строительства, риск границы и цену потерянного темпа до нажатия кнопки строительства.",
        kicker: "Total War: Warhammer III · развитие провинции",
        thesis: "Доходное здание стоит покупать не потому, что его эффект положительный, а когда прирост потока успевает вернуть вложение до момента, в котором кампании снова понадобится ликвидность. Патч 8.1 делает позднюю кампанию менее предсказуемой из-за более активного ИИ, поэтому спокойный горизонт нужно обязательно проверять сценарием нового фронта.",
        readTime: "9 мин",
        takeaways: [
          "Считай только прирост дохода от выбранного уровня, а не весь доход поселения.",
          "Горизонт заканчивается перед войной, угрозой провинции или другой точкой, где золото снова получает высокую цену.",
          "Если решение проходит только в мирном сценарии, оно не является устойчивым вложением для нестабильной границы."
        ],
        sections: [
          {
            heading: "Начни с прироста, который создаёт именно это решение",
            paragraphs: [
              "Запиши цену следующего уровня, число ходов строительства и дополнительный доход после завершения. Не включай уже существующий поток провинции: он будет получен независимо от новой покупки и не окупает её повторно.",
              "Отдельно пометь неденежные эффекты. Рост, контроль, найм или стратегический доступ могут быть важнее прямого дохода, но им не нужна выдуманная универсальная цена. Денежную окупаемость и стратегическую пользу лучше держать рядом, а не смешивать в одно число."
            ]
          },
          {
            heading: "Поставь реальную точку окончания расчёта",
            paragraphs: [
              "Горизонт не обязан совпадать с концом кампании. Практическая точка пересмотра наступает перед следующей большой войной, наймом новой армии или моментом, когда провинция может оказаться под ударом. Именно тогда свободная казна снова конкурирует со зданием.",
              "Если строительство занимает несколько ходов, доход начинает работать только после задержки. Считай полезные ходы после завершения, а не весь период от нажатия кнопки до контрольной точки."
            ]
          },
          {
            heading: "Проведи сценарий неожиданного фронта",
            paragraphs: [
              "В официальных заметках патча 8.1 Creative Assembly описывает изменения приоритетов ИИ и более динамичное поведение поздних фракций. Это не даёт готового процента риска для твоей кампании, но требует отдельного стресс-сценария.",
              "Сократи горизонт, добавь вероятность потери дохода и проверь остаток казны после покупки. Если новый фронт заставит отменить найм или пробить обязательный резерв, цена здания включает потерянную свободу действий."
            ]
          },
          {
            heading: "Зафиксируй правило до следующего хода",
            paragraphs: [
              "Решение проходит, когда окупаемость укладывается в нужный горизонт, остаток не нарушает военный резерв, а стратегическая польза соответствует текущему ограничению. Любое из этих условий может стать причиной отложить покупку.",
              "Запиши дату пересмотра в терминах кампании: после разведки границы, окончания войны или накопления заданной казны. Тогда расчёт становится рабочим правилом, а не разовой красивой цифрой."
            ]
          }
        ],
        toolLabel: "Проверить окупаемость здания"
      },
      en: {
        title: "Will the building pay back before the next war? A campaign-horizon guide",
        description: "Compare marginal income, construction delay, frontier risk and lost tempo before pressing the build button.",
        kicker: "Total War: Warhammer III · Province development",
        thesis: "An income building is worth buying when its marginal flow returns capital before the campaign needs liquidity again, not merely because the effect is positive. Patch 8.1 makes a calm late-game horizon less dependable through more active AI, so the peaceful case needs a new-front stress test.",
        readTime: "9 min",
        takeaways: [
          "Model only the marginal income created by this level, not the settlement's total flow.",
          "End the horizon before war, provincial threat or another point where liquid gold becomes expensive again.",
          "A decision that works only in the peaceful case is not a resilient frontier investment."
        ],
        sections: [
          {
            heading: "Begin with the delta created by this decision",
            paragraphs: [
              "Record the next level's cost, construction turns and additional income after completion. Exclude existing provincial flow: it arrives without the purchase and cannot repay the same capital twice.",
              "Keep non-cash effects in a separate judgement. Growth, control, recruitment access or strategic position can matter more than direct income, but they do not need an invented universal gold value. Put financial payback beside strategic utility instead of forcing them into one number."
            ]
          },
          {
            heading: "Set a real end point for the calculation",
            paragraphs: [
              "The horizon does not have to be the end of the campaign. A practical review point arrives before the next major war, another army or a credible threat to the province. That is when deployable treasury competes with the building again.",
              "If construction takes several turns, income starts only after the delay. Count productive turns after completion, not the entire period from click to review point."
            ]
          },
          {
            heading: "Run an unexpected-front case",
            paragraphs: [
              "Creative Assembly's official Patch 8.1 notes describe AI priority changes and more dynamic late-game factions. They do not provide a universal probability for your campaign, but they do justify a separate stress case.",
              "Shorten the horizon, add an income-loss risk and inspect treasury after the purchase. If a new front cancels recruitment or breaks the required reserve, lost optionality belongs to the decision cost."
            ]
          },
          {
            heading: "Write the rule before ending the turn",
            paragraphs: [
              "The building passes when payback fits the real horizon, remaining cash respects the war reserve and strategic utility solves the current constraint. Any one condition can postpone the purchase.",
              "Record a campaign review trigger: after scouting the frontier, ending the war or rebuilding a target treasury. That turns the calculation into an operating rule instead of a one-off attractive number."
            ]
          }
        ],
        toolLabel: "Test building payback"
      }
    }
  },
  {
    slug: "total-war-warhammer-3-sack-or-occupy-frontier",
    game: "totalwar",
    format: "guide",
    updatedAt: "2026-08-18",
    gameVersion: { ru: "Total War: Warhammer III · патч 8.1", en: "Total War: Warhammer III · Patch 8.1" },
    evidenceStatus: "estimated",
    audiences: ["casual", "grinder"],
    toolPath: { ru: "/total-war/tools/#conquest-choice", en: "/en/total-war/tools/#conquest-choice" },
    sources: [totalWarSource],
    content: {
      ru: {
        title: "Разграбить или удержать: как оценить захват на нестабильной границе",
        description: "Пошаговое сравнение разовой добычи и будущего дохода с одним горизонтом, задержкой восстановления и риском потери провинции.",
        kicker: "Total War: Warhammer III · решение после захвата",
        thesis: "Оккупация выигрывает не по общему будущему доходу, а только когда поток успевает реализоваться после восстановления и переживает риск границы. Разграбление становится сильнее при коротком горизонте, срочной потребности в ликвидности и высокой цене нового обязательства.",
        readTime: "8 мин",
        takeaways: [
          "Сравнивай разграбление и удержание на одном числе ходов.",
          "Доход захваченной провинции начинается после задержки и требует учёта расходов на удержание.",
          "Новая территория может быть активом на карте и обязательством для казны одновременно."
        ],
        sections: [
          {
            heading: "Зафиксируй одно окно решения",
            paragraphs: [
              "Выбери контрольную точку: окончание текущей войны, подход следующей армии противника или момент, когда казне снова понадобится заданный резерв. Обе альтернативы должны пройти через одинаковое число ходов.",
              "Разовая добыча попадает в казну сразу и может превратиться в подкрепление или срочное строительство. Удержание создаёт будущий поток, но сначала замораживает капитал в восстановлении и защите."
            ]
          },
          {
            heading: "Считай только реализуемый поток провинции",
            paragraphs: [
              "Запиши доход после периода восстановления, затем вычти дополнительные расходы, которые появляются из-за новой границы. Если для защиты нужна отдельная армия, её содержание относится не к абстрактной войне, а к цене удержания.",
              "Не включай долгий поток за пределами контрольной точки только потому, что провинция теоретически может жить вечно. Кампания платит за ликвидность и темп сейчас, а не за недостижимую сумму на бесконечном горизонте."
            ]
          },
          {
            heading: "Добавь риск потери и цену нового фронта",
            paragraphs: [
              "Риск не обязан быть точной статистикой. Достаточно сравнить базовый сценарий с жёстким: доход ниже, восстановление дольше, а провинция теряется до конца горизонта. Разница показывает чувствительность решения.",
              "Патч 8.1 усиливает потребность в таком тесте для поздней кампании: более активные приоритеты ИИ повышают ценность запаса на неожиданную реакцию, хотя не дают универсального ответа для каждой границы."
            ]
          },
          {
            heading: "Раздели экономический вывод и стратегическую цель",
            paragraphs: [
              "Модель может выбрать разграбление по золоту, а стратегический проход, ресурс или уничтожение угрозы всё равно сделать удержание правильным. Зафиксируй эту причину отдельно, чтобы не маскировать её выдуманной доходностью.",
              "Финальная запись должна содержать выбранный вариант, горизонт, обязательный резерв и условие пересмотра. Это делает решение объяснимым даже через несколько сессий."
            ]
          }
        ],
        toolLabel: "Сравнить разграбление и удержание"
      },
      en: {
        title: "Sack or hold: pricing a conquest on an unstable frontier",
        description: "Compare immediate loot and future flow across one horizon with recovery delay and province-loss risk.",
        kicker: "Total War: Warhammer III · Post-conquest decision",
        thesis: "Occupation wins only when recurring flow can be realized after recovery and survives frontier risk, not because total future income is large. Sacking becomes stronger under a short horizon, urgent liquidity needs and a high cost of adding another commitment.",
        readTime: "8 min",
        takeaways: [
          "Compare sacking and holding across the same number of turns.",
          "Captured income starts after recovery and must carry the cost of holding the province.",
          "New territory can be a map asset and a treasury liability at the same time."
        ],
        sections: [
          {
            heading: "Lock one decision window",
            paragraphs: [
              "Choose a review point: the end of the current war, arrival of another enemy army or the moment treasury must regain a target reserve. Both alternatives need the same number of turns.",
              "Loot enters treasury now and can become reinforcement or urgent infrastructure. Holding creates future flow while locking capital into recovery and defence first."
            ]
          },
          {
            heading: "Count only realizable provincial flow",
            paragraphs: [
              "Record income after recovery and subtract the additional commitments created by the frontier. If another army is required to defend it, that upkeep belongs to the cost of holding rather than an abstract war budget.",
              "Do not pull distant income beyond the review point into the case simply because the province could theoretically exist forever. The campaign pays for liquidity and tempo now, not an unreachable infinite-horizon total."
            ]
          },
          {
            heading: "Add loss risk and the cost of another front",
            paragraphs: [
              "Risk does not need false precision. Compare a baseline with a hard case: lower income, longer recovery and loss before the horizon ends. The difference exposes decision sensitivity.",
              "Patch 8.1 makes the test more important in late campaigns. More active AI priorities increase the value of response liquidity without creating one universal answer for every border."
            ]
          },
          {
            heading: "Separate the financial result from the strategic objective",
            paragraphs: [
              "The model may prefer sacking on gold while access, a resource or removal of a threat still makes occupation correct. Record that strategic reason separately instead of hiding it inside invented ROI.",
              "The final note should state the choice, horizon, required reserve and review trigger. The decision remains explainable several sessions later."
            ]
          }
        ],
        toolLabel: "Compare sack and hold"
      }
    }
  },
  {
    slug: "ck3-1-19-domain-building-before-succession",
    game: "ck3",
    format: "guide",
    updatedAt: "2026-08-18",
    gameVersion: { ru: "Crusader Kings III · версия 1.19.0.6", en: "Crusader Kings III · version 1.19.0.6" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/crusader-kings-3/tools/#domain-payback", en: "/en/crusader-kings-3/tools/#domain-payback" },
    sources: [ck3Source],
    content: {
      ru: {
        title: "Строить ли перед наследованием: окупаемость домена в версии 1.19",
        description: "Как проверить следующее здание по приросту дохода, сроку строительства, риску раздела и казне, которая останется наследнику.",
        kicker: "Crusader Kings III · решение по домену",
        thesis: "Здание перед наследованием должно окупаться не на абстрактной бесконечности, а внутри вероятного горизонта владения и без разрушения резерва нового правителя. Книга учёта версии 1.19 помогает зафиксировать положение, но решение всё равно требует отделить общий доход владения от прироста нового уровня.",
        readTime: "9 мин",
        takeaways: [
          "Записывай прирост дохода следующего уровня, а не весь поток владения.",
          "Риск потерять владение при разделе уменьшает ожидаемую ценность длинной окупаемости.",
          "Казна после строительства должна проходить отдельный сценарий слабого наследника и фракций."
        ],
        sections: [
          {
            heading: "Сними состояние державы до строительства",
            paragraphs: [
              "Открой Книгу учёта и запиши текущий ежемесячный поток, личные владения, потери недавней войны и свободную казну. Обновление 1.19 расширило представление показателей, поэтому этот экран подходит для короткого аудита после перерыва.",
              "Раздели владения на ядро основной линии и те, которые могут уйти при наследовании. Один и тот же уровень здания имеет разный полезный горизонт в этих двух группах."
            ]
          },
          {
            heading: "Изолируй прирост от следующего уровня",
            paragraphs: [
              "В модель входит цена, время строительства и только дополнительный ежемесячный доход. Общий поток владения не создаётся текущим решением и поэтому не должен ускорять его окупаемость.",
              "Военные, контрольные и другие неденежные эффекты запиши отдельно. Они могут оправдать строительство, но вывод должен честно показывать, что решение принято не только ради золота."
            ]
          },
          {
            heading: "Сократи горизонт до вероятной передачи власти",
            paragraphs: [
              "Оцени число месяцев, в течение которых нынешний правитель и основная линия с высокой вероятностью сохранят доход. Вычти время строительства: недостроенный объект ещё не возвращает капитал.",
              "Для спорного владения проведи второй сценарий с риском потери потока. Не нужно притворяться, что вероятность известна точно. Достаточно увидеть, насколько быстро хороший результат ломается при менее удачном разделе."
            ]
          },
          {
            heading: "Сравни здание с резервом наследника",
            paragraphs: [
              "После покупки проверь, сколько золота перейдёт следующему правителю после временных расходов, возможных подарков, найма или реакции на фракцию. Золото в казне не даёт прямого дохода, но сохраняет варианты в самый хрупкий момент правления.",
              "Если здание окупается только после вероятной передачи власти и оставляет наследника без аварийного выхода, отложи покупку до следующей точки пересмотра. Это не отказ от развития, а перенос капитала в более подходящий горизонт."
            ]
          }
        ],
        toolLabel: "Проверить окупаемость домена"
      },
      en: {
        title: "Should you build before succession? Domain payback in version 1.19",
        description: "Test the next building through marginal income, construction time, partition risk and the treasury left to the heir.",
        kicker: "Crusader Kings III · Domain decision",
        thesis: "A pre-succession building must pay inside a plausible ownership horizon without breaking the next ruler's buffer, not across abstract infinity. The 1.19 Ledger helps capture the state, but the decision still requires separating total holding income from the next level's marginal flow.",
        readTime: "9 min",
        takeaways: [
          "Record the next level's marginal income, not total holding flow.",
          "Partition risk reduces the expected value of long payback in a vulnerable holding.",
          "Treasury after construction needs a separate weak-heir and faction stress case."
        ],
        sections: [
          {
            heading: "Capture realm state before building",
            paragraphs: [
              "Open the Ledger and record current monthly flow, personal holdings, recent war losses and deployable treasury. Update 1.19 expanded the values shown there, making it a useful short audit after a break.",
              "Separate the primary line's core holdings from land exposed to succession. The same building level has a different useful horizon in each group."
            ]
          },
          {
            heading: "Isolate the next level's marginal flow",
            paragraphs: [
              "The model takes cost, construction time and only additional monthly income. Existing holding flow is not created by the current decision and cannot accelerate its payback.",
              "Record military, control and other non-cash effects separately. They can justify the building, but the conclusion should state honestly that gold is not the only return."
            ]
          },
          {
            heading: "Shorten the horizon to the likely transfer",
            paragraphs: [
              "Estimate how many months the current ruler and primary line are likely to keep the flow. Subtract construction time: an unfinished project does not return capital yet.",
              "For a contested holding, run a second case with income-loss risk. False precision is unnecessary. The useful question is how quickly a good result breaks under a less favourable partition."
            ]
          },
          {
            heading: "Compare the building with the heir buffer",
            paragraphs: [
              "After spending, inspect how much gold reaches the next ruler after transition outflow, possible gifts, recruitment or faction response. Treasury produces no direct return but preserves options at the most fragile point of a reign.",
              "If payback arrives only after likely succession and leaves no emergency route for the heir, postpone the project to the next review point. That is capital moved into a better horizon, not a rejection of development."
            ]
          }
        ],
        toolLabel: "Test domain payback"
      }
    }
  },
  {
    slug: "ck3-war-chest-before-declaring-war",
    game: "ck3",
    format: "guide",
    updatedAt: "2026-08-18",
    gameVersion: { ru: "Crusader Kings III · версия 1.19.0.6", en: "Crusader Kings III · version 1.19.0.6" },
    evidenceStatus: "estimated",
    audiences: ["casual", "grinder"],
    toolPath: { ru: "/crusader-kings-3/tools/#war-chest", en: "/en/crusader-kings-3/tools/#war-chest" },
    sources: [ck3Source],
    content: {
      ru: {
        title: "Военная казна до объявления войны: сценарий плохого исхода",
        description: "Как объединить текущий поток, военные расходы, разовые затраты, длительность и обязательный резерв в один план до нажатия кнопки войны.",
        kicker: "Crusader Kings III · финансы войны",
        thesis: "Доступный казус белли не означает доступную войну. План проходит только тогда, когда казна выдерживает более долгий конфликт, разовые расходы и нужный резерв после мира, а близкое наследование не превращает победу в финансовый кризис следующего правителя.",
        readTime: "8 мин",
        takeaways: [
          "Разделяй постоянный военный отток и разовые расходы на реакцию.",
          "Проверяй казну после войны, а не только баланс в день объявления.",
          "Если конфликт пересекается с наследованием, резерв войны и резерв наследника нельзя тратить дважды."
        ],
        sections: [
          {
            heading: "Зафиксируй мирный поток и стартовую казну",
            paragraphs: [
              "Возьми из Книги учёта текущий ежемесячный доход и обычные расходы. Отдельно запиши свободную казну после уже обещанных строек, активностей и подарков. Обещанный капитал не является военным резервом.",
              "Не используй лучший недавний месяц как норму. Нужен поток, который сохранится при поднятых армиях и возможных перебоях, а не максимум спокойного периода."
            ]
          },
          {
            heading: "Раздели расходы войны на два слоя",
            paragraphs: [
              "Первый слой повторяется каждый месяц: содержание поднятых войск и другие регулярные обязательства. Второй возникает рывками: наём, подарки, поездка, выкуп или внезапная реакция на новый фронт.",
              "Смешивание этих слоёв скрывает риск. Небольшой ежемесячный дефицит может быть устойчивым при короткой войне, но один крупный платёж уничтожит запас раньше, чем закончится осада."
            ]
          },
          {
            heading: "Проведи длинный и плохой сценарий",
            paragraphs: [
              "Увеличь ожидаемую длительность, подними военный отток и добавь один разовый кризис. Затем сравни остаток с минимальной казной, которую правитель не должен пробивать даже после победы.",
              "Если модель показывает отрицательный остаток, ответ не обязательно состоит в отмене войны. Можно уменьшить масштаб, накопить запас, выбрать другую дату или заранее убрать параллельное обязательство."
            ]
          },
          {
            heading: "Проверь пересечение с наследованием",
            paragraphs: [
              "Близкая передача власти требует отдельного сценария: новый правитель может получить войну вместе с коротким правлением и фракциями. Один и тот же золотой не может одновременно финансировать затяжной конфликт и аварийный резерв наследника.",
              "Перед объявлением запиши три числа: допустимый ежемесячный отток, обязательный остаток и точку, после которой война требует пересмотра. Это превращает уверенность в управляемый финансовый план."
            ]
          }
        ],
        toolLabel: "Провести стресс-тест военной казны"
      },
      en: {
        title: "The war chest before declaring war: run the bad case",
        description: "Combine current flow, wartime burn, one-off costs, duration and a required reserve before pressing the war button.",
        kicker: "Crusader Kings III · War finance",
        thesis: "An available casus belli does not make the war affordable. The plan passes only when treasury survives a longer conflict, one-off response costs and the required post-war reserve, while nearby succession does not turn victory into the next ruler's financial crisis.",
        readTime: "8 min",
        takeaways: [
          "Separate recurring wartime burn from one-off response costs.",
          "Inspect treasury after the war, not only the balance on declaration day.",
          "When war overlaps succession, the war reserve and heir buffer cannot spend the same gold twice."
        ],
        sections: [
          {
            heading: "Capture peacetime flow and starting cash",
            paragraphs: [
              "Use the Ledger for current monthly income and ordinary expenses. Record deployable treasury after committed construction, activities and gifts. Promised capital is not part of the war chest.",
              "Do not use the best recent month as the baseline. You need flow that survives raised armies and disruption, not the maximum from a calm period."
            ]
          },
          {
            heading: "Split war cost into two layers",
            paragraphs: [
              "The first layer repeats every month: raised-troop upkeep and other recurring commitments. The second arrives in jumps: hiring, gifts, travel, ransom or a sudden response to another front.",
              "Combining them hides risk. A small monthly deficit may be manageable in a short war, while one large payment breaks the buffer before the siege ends."
            ]
          },
          {
            heading: "Run the long and bad case",
            paragraphs: [
              "Increase expected duration, raise wartime burn and add one one-off crisis. Compare remaining cash with the floor the ruler should not break even after victory.",
              "A negative result does not always cancel the war. Reduce scope, build the buffer, choose another date or remove a parallel commitment first."
            ]
          },
          {
            heading: "Test the succession overlap",
            paragraphs: [
              "Nearby transfer needs its own case: the next ruler can inherit the war alongside short reign and factions. The same gold cannot finance a long conflict and the heir emergency buffer at once.",
              "Before declaring, record three values: sustainable monthly burn, required ending cash and the trigger that forces a review. Confidence becomes a manageable financial plan."
            ]
          }
        ],
        toolLabel: "Stress-test the war chest"
      }
    }
  }
] satisfies Insight[];
