export type HubGatewayId = "gta" | "dota" | "wow" | "total-war" | "ck3";
export type HubGatewayLocale = "ru" | "en";
export type HubGatewayLocalized = Record<HubGatewayLocale, string>;

export interface HubGatewayChoice {
  id: string;
  label: HubGatewayLocalized;
  hint: HubGatewayLocalized;
  weights: Record<string, number>;
}

export interface HubGatewayQuestion {
  id: string;
  label: HubGatewayLocalized;
  prompt: HubGatewayLocalized;
  choices: HubGatewayChoice[];
}

export interface HubGatewayOutcome {
  id: string;
  mark: string;
  label: HubGatewayLocalized;
  title: HubGatewayLocalized;
  summary: HubGatewayLocalized;
  reason: HubGatewayLocalized;
  checks: HubGatewayLocalized[];
  primary: { label: HubGatewayLocalized; href: HubGatewayLocalized };
  secondary: { label: HubGatewayLocalized; href: HubGatewayLocalized };
}

export interface HubGatewayConfig {
  id: HubGatewayId;
  kicker: HubGatewayLocalized;
  title: HubGatewayLocalized;
  text: HubGatewayLocalized;
  status: HubGatewayLocalized;
  questions: HubGatewayQuestion[];
  outcomes: HubGatewayOutcome[];
}

const t = (ru: string, en: string): HubGatewayLocalized => ({ ru, en });

export const hubGateways: Record<HubGatewayId, HubGatewayConfig> = {
  gta: {
    id: "gta",
    kicker: t("Быстрый разбор · три выбора", "Quick triage · three choices"),
    title: t("С чего тебе начать в Лос-Сантосе прямо сейчас", "Where should you start in Los Santos right now?"),
    text: t(
      "Выбери текущее положение, доступное время и цель. Хаб отправит тебя не в общий список, а к подходящему расчёту.",
      "Choose your current position, available time and goal. The hub will route you to the relevant calculation instead of a generic list."
    ),
    status: t("Без регистрации · выбор остаётся на устройстве", "No account · choices stay on this device"),
    questions: [
      {
        id: "position",
        label: t("01 · Положение", "01 · Position"),
        prompt: t("Что у тебя уже есть?", "What do you already own?"),
        choices: [
          { id: "returner", label: t("Вернулся после перерыва", "Returning after a break"), hint: t("Сначала нужно восстановить картину", "Rebuild the picture first"), weights: { restart: 4, next: 1 } },
          { id: "capital", label: t("Есть стартовый капитал", "I have starting capital"), hint: t("Нужен первый устойчивый актив", "I need the first durable asset"), weights: { restart: 2, next: 3 } },
          { id: "portfolio", label: t("Есть несколько бизнесов", "I own several businesses"), hint: t("Хочу улучшить связку активов", "I want a better asset mix"), weights: { portfolio: 4 } }
        ]
      },
      {
        id: "time",
        label: t("02 · Время", "02 · Time"),
        prompt: t("Сколько активного времени есть в неделю?", "How much active time do you have each week?"),
        choices: [
          { id: "short", label: t("До 3 часов", "Up to 3 hours"), hint: t("Нужен спокойный цикл", "I need a low-touch loop"), weights: { restart: 3, next: 1 } },
          { id: "medium", label: t("4-8 часов", "4-8 hours"), hint: t("Можно совмещать два источника", "I can combine two income sources"), weights: { next: 3, portfolio: 1 } },
          { id: "long", label: t("Больше 8 часов", "More than 8 hours"), hint: t("Готов управлять портфелем", "I can manage a portfolio"), weights: { portfolio: 3, next: 1 } }
        ]
      },
      {
        id: "goal",
        label: t("03 · Цель", "03 · Goal"),
        prompt: t("Какой результат важнее?", "Which result matters most?"),
        choices: [
          { id: "cashflow", label: t("Стабильный денежный поток", "Stable cash flow"), hint: t("Без постоянной рутины", "Without constant chores"), weights: { restart: 4, next: 1 } },
          { id: "purchase", label: t("Следующая крупная покупка", "The next major purchase"), hint: t("Понять срок до цели", "See the time to goal"), weights: { next: 4 } },
          { id: "efficiency", label: t("Максимум отдачи", "Maximum efficiency"), hint: t("Сравнить весь портфель", "Compare the whole portfolio"), weights: { portfolio: 4 } }
        ]
      }
    ],
    outcomes: [
      {
        id: "restart",
        mark: "G$",
        label: t("Маршрут возвращения", "Returner route"),
        title: t("Сначала восстанови устойчивый денежный поток", "Rebuild durable cash flow first"),
        summary: t(
          "Не начинай с самой дорогой покупки. Выбери простой источник дохода и оставь запас, чтобы новая схема не остановилась после первого цикла.",
          "Do not start with the most expensive purchase. Choose a repeatable income source and keep enough reserve to run the next cycle."
        ),
        reason: t("Ограниченное время делает простоту и свободный капитал важнее максимальной выплаты за одну продажу.", "Limited time makes simplicity and deployable capital more important than the largest single sale."),
        checks: [
          t("Свободный капитал после запуска", "Capital left after setup"),
          t("Активные часы на один цикл", "Active hours per cycle"),
          t("Расходники и подготовка", "Supplies and preparation")
        ],
        primary: { label: t("Выбрать путь игрока", "Open the player path"), href: t("#player-paths", "#player-paths") },
        secondary: { label: t("Проверить следующий ход", "Test the next move"), href: t("/gta-online/calculators/business-roi/#next-move", "/en/gta-online/calculators/business-roi/#next-move") }
      },
      {
        id: "next",
        mark: "Ц",
        label: t("Маршрут к цели", "Goal route"),
        title: t("Посчитай срок до цели до новой покупки", "Calculate time to goal before the next purchase"),
        summary: t(
          "Сравни покупку бизнеса с сохранением капитала на главную цель. Важна не только окупаемость, но и то, насколько решение отодвигает желаемую покупку.",
          "Compare a business purchase with keeping capital for the main goal. Payback matters, but so does the delay created by the investment."
        ),
        reason: t("При среднем запасе времени лучший актив должен ускорять цель, а не просто добавлять ещё один цикл обслуживания.", "With a moderate time budget, the best asset should accelerate the goal instead of adding another maintenance loop."),
        checks: [
          t("Текущий капитал и обязательный запас", "Current capital and reserve"),
          t("Чистая прибыль за неделю", "Weekly net profit"),
          t("Срок до покупки в двух вариантах", "Time to purchase in both cases")
        ],
        primary: { label: t("Рассчитать срок до цели", "Calculate time to goal"), href: t("#hours-to-goal", "#hours-to-goal") },
        secondary: { label: t("Сравнить окупаемость бизнеса", "Compare business payback"), href: t("#business-roi", "#business-roi") }
      },
      {
        id: "portfolio",
        mark: "П",
        label: t("Маршрут портфеля", "Portfolio route"),
        title: t("Собери портфель, а не набор разрозненных бизнесов", "Build a portfolio, not a pile of businesses"),
        summary: t(
          "Распредели капитал между спокойным производством, активным доходом и резервом. Каждый новый актив должен закрывать конкретное ограничение.",
          "Allocate capital across passive production, active income and reserve. Every new asset should solve a specific constraint."
        ),
        reason: t("При большом числе активов узким местом обычно становится время игрока, а не доступ к ещё одной покупке.", "With several assets, player time usually becomes the bottleneck before access to another purchase."),
        checks: [
          t("Пересечение производственных циклов", "Production cycle overlap"),
          t("Доход на активный час", "Return per active hour"),
          t("Доля капитала без назначения", "Unallocated capital share")
        ],
        primary: { label: t("Собрать распределение", "Build the allocation"), href: t("#portfolio-allocation", "#portfolio-allocation") },
        secondary: { label: t("Открыть условные рейтинги", "Open conditional rankings"), href: t("#conditional-rankings", "#conditional-rankings") }
      }
    ]
  },

  dota: {
    id: "dota",
    kicker: t("Разбор момента · три выбора", "Match triage · three choices"),
    title: t("Какое экономическое решение нужно принять в этом матче", "Which economic decision does this match need?"),
    text: t(
      "Укажи стадию матча, свою роль и главный риск. Получишь маршрут к нужной модели или разбору, а не общий совет по сборке.",
      "Choose the match stage, your role and the main risk. Get the relevant model or review path instead of generic build advice."
    ),
    status: t("Патч учитывается отдельно · игровые вводные задаёшь ты", "Patch context is separate · match inputs come from you"),
    questions: [
      {
        id: "stage",
        label: t("01 · Стадия", "01 · Stage"),
        prompt: t("Когда нужно решение?", "When is the decision happening?"),
        choices: [
          { id: "lane", label: t("До 15-й минуты", "Before minute 15"), hint: t("Линия и ускорение", "Lane and acceleration"), weights: { growth: 4, timing: 1 } },
          { id: "mid", label: t("15-30-я минута", "Minutes 15-30"), hint: t("Предмет и ближайшая цель", "Item and next objective"), weights: { timing: 4, growth: 1 } },
          { id: "late", label: t("После 30-й минуты", "After minute 30"), hint: t("Цена смерти и выкуп", "Death cost and buyback"), weights: { liquidity: 4, timing: 1 } }
        ]
      },
      {
        id: "role",
        label: t("02 · Роль", "02 · Role"),
        prompt: t("Как ты создаёшь ценность?", "How do you create value?"),
        choices: [
          { id: "core", label: t("Основной герой", "Core"), hint: t("Фарм и ключевой предмет", "Farm and a key item"), weights: { growth: 3, timing: 2 } },
          { id: "support", label: t("Поддержка", "Support"), hint: t("Сила команды и доступ к драке", "Team power and fight access"), weights: { timing: 3, liquidity: 2 } },
          { id: "flex", label: t("Ситуация меняется", "Flexible role"), hint: t("Нужен выбор по карте", "Let the map state decide"), weights: { timing: 3, liquidity: 1, growth: 1 } }
        ]
      },
      {
        id: "risk",
        label: t("03 · Риск", "03 · Risk"),
        prompt: t("Что может сломать план?", "What can break the plan?"),
        choices: [
          { id: "slow", label: t("Не успею окупить ускорение", "Acceleration may not pay back"), hint: t("Проверить Hand of Midas", "Test Hand of Midas"), weights: { growth: 4 } },
          { id: "fight", label: t("Не хватит силы к драке", "I may miss the fight timing"), hint: t("Связать покупку с целью", "Connect purchase to objective"), weights: { timing: 4 } },
          { id: "death", label: t("Смерть лишит второго шанса", "Death removes the second life"), hint: t("Проверить запас на выкуп", "Test buyback reserve"), weights: { liquidity: 4 } }
        ]
      }
    ],
    outcomes: [
      {
        id: "growth",
        mark: "M",
        label: t("Ускорение экономики", "Economy acceleration"),
        title: t("Сравни ускорение с силой прямо сейчас", "Compare acceleration with immediate power"),
        summary: t(
          "Hand of Midas имеет смысл только тогда, когда оставшегося времени хватает на дополнительные применения, а команда может пережить более слабое окно.",
          "Hand of Midas only works when enough uses remain and the team can survive the weaker timing window."
        ),
        reason: t("Ранняя стадия и роль основного героя повышают ценность роста, но ближайшая драка может полностью изменить ответ.", "An early stage and core role increase the value of growth, but the next fight can reverse the answer."),
        checks: [
          t("Минута покупки", "Purchase minute"),
          t("Ожидаемая длительность матча", "Expected match length"),
          t("Ближайшая цель команды", "Next team objective")
        ],
        primary: { label: t("Рассчитать окупаемость Midas", "Calculate Midas payback"), href: t("#midas-irr", "#midas-irr") },
        secondary: { label: t("Сравнить ролевые решения", "Compare role decisions"), href: t("#role-lenses", "#role-lenses") }
      },
      {
        id: "timing",
        mark: "Ц",
        label: t("Момент силы", "Power timing"),
        title: t("Привяжи покупку к ближайшей цели на карте", "Tie the purchase to the next map objective"),
        summary: t(
          "Предмет ценен не в момент появления в инвентаре, а когда помогает забрать Рошана, башню, пространство или важную драку.",
          "An item creates value when it converts into Roshan, a tower, map space or a decisive fight, not when it enters the inventory."
        ),
        reason: t("Средняя стадия матча наказывает решения без срока реализации. Сначала назови цель, затем оцени покупку.", "The mid game punishes decisions without a conversion window. Name the objective before evaluating the purchase."),
        checks: [
          t("Время до ключевого предмета", "Time to the key item"),
          t("Время до цели на карте", "Time to the map objective"),
          t("Что команда теряет в ожидании", "What the team gives up while waiting")
        ],
        primary: { label: t("Открыть решения по ролям", "Open role decisions"), href: t("#role-lenses", "#role-lenses") },
        secondary: { label: t("Выбрать готовую ситуацию", "Choose a prepared situation"), href: t("#decision-deck", "#decision-deck") }
      },
      {
        id: "liquidity",
        mark: "В",
        label: t("Запас на выкуп", "Buyback liquidity"),
        title: t("Посчитай второй шанс до следующего риска", "Price the second life before the next risk"),
        summary: t(
          "Проверь стоимость выкупа, текущее золото и доход до ближайшей цели. Затем реши, можно ли купить компонент без потери пути обратно в бой.",
          "Check buyback cost, current gold and income before the next objective. Then decide whether a component still leaves a route back into the fight."
        ),
        reason: t("Поздняя стадия резко повышает цену одной смерти. Непотраченное золото здесь может быть полезным резервом.", "The late game sharply increases the cost of one death. Unspent gold can be valuable liquidity here."),
        checks: [
          t("Стоимость выкупа сейчас", "Current buyback cost"),
          t("Золото к началу цели", "Gold at objective time"),
          t("Способ вернуться в драку", "Route back into the fight")
        ],
        primary: { label: t("Рассчитать запас на выкуп", "Calculate buyback reserve"), href: t("#buyback-reserve", "#buyback-reserve") },
        secondary: { label: t("Прочитать разбор перед Рошаном", "Read the pre-Roshan analysis"), href: t("/insights/dota-2-buyback-reserve-before-roshan/", "/en/insights/dota-2-buyback-reserve-before-roshan/") }
      }
    ]
  },

  wow: {
    id: "wow",
    kicker: t("Проверка рынка · три выбора", "Market triage · three choices"),
    title: t("Где твой рынок теряет золото", "Where is your market loop losing gold?"),
    text: t(
      "Выбери роль, состояние капитала и задачу. Получишь расчёт, который отделяет цену выставления от реально полученного золота.",
      "Choose your role, capital state and task. Get the calculation that separates listed value from realized gold."
    ),
    status: t("Цены и вероятность продажи вводишь ты", "Prices and sell-through come from you"),
    questions: [
      {
        id: "role",
        label: t("01 · Роль", "01 · Role"),
        prompt: t("Как ты зарабатываешь?", "How do you make gold?"),
        choices: [
          { id: "gather", label: t("Собираю ресурсы", "Gathering"), hint: t("Продаю результат фарма", "I sell farm output"), weights: { farm: 4, inventory: 1 } },
          { id: "craft", label: t("Изготавливаю товары", "Crafting"), hint: t("Покупаю материалы и продаю изделия", "I buy inputs and sell output"), weights: { craft: 4, inventory: 2 } },
          { id: "orders", label: t("Работаю с заказами", "Crafting orders"), hint: t("Получаю комиссию за услугу", "I earn a service commission"), weights: { order: 4 } }
        ]
      },
      {
        id: "capital",
        label: t("02 · Капитал", "02 · Capital"),
        prompt: t("Где сейчас находится золото?", "Where is the gold right now?"),
        choices: [
          { id: "cash", label: t("В основном в сумках", "Mostly liquid"), hint: t("Можно выбирать новый маршрут", "I can choose a new route"), weights: { craft: 2, farm: 1, order: 1 } },
          { id: "stock", label: t("Застряло в товарах", "Tied up in inventory"), hint: t("Продажи идут медленно", "Sales are slow"), weights: { inventory: 5 } },
          { id: "low", label: t("Капитала почти нет", "Very little capital"), hint: t("Нужен путь с низким входом", "I need a low-entry route"), weights: { farm: 3, order: 2 } }
        ]
      },
      {
        id: "goal",
        label: t("03 · Задача", "03 · Task"),
        prompt: t("Какой вопрос нужно закрыть?", "Which question needs an answer?"),
        choices: [
          { id: "gph", label: t("Сколько золота получаю за час", "How much gold is realized per hour"), hint: t("Учесть долю продаж и расходы", "Include sell-through and expenses"), weights: { farm: 4 } },
          { id: "margin", label: t("Выгоден ли рецепт", "Is the recipe profitable?"), hint: t("Посчитать чистый результат партии", "Calculate batch economics"), weights: { craft: 4, inventory: 1 } },
          { id: "fee", label: t("Какую комиссию просить", "What commission should I charge?"), hint: t("Оценить материалы, время и риск", "Price materials, time and risk"), weights: { order: 4 } }
        ]
      }
    ],
    outcomes: [
      {
        id: "farm",
        mark: "З",
        label: t("Реальный доход", "Realized income"),
        title: t("Считай полученное золото, а не стоимость добычи", "Measure realized gold, not farmed value"),
        summary: t(
          "Скорректируй цену ресурсов на долю продаж, комиссию аукциона, повторные выставления и расходы сессии.",
          "Adjust material value for sell-through, Auction House cut, relisting losses and session expenses."
        ),
        reason: t("При низком капитале сбор ресурсов даёт быстрый вход, но медленная продажа может сделать красивую цену бесполезной.", "Gathering offers a low-capital entry, but slow sales can make an attractive listed price meaningless."),
        checks: [
          t("Проданные единицы за сессию", "Units sold per session"),
          t("Потери на повторных выставлениях", "Relisting losses"),
          t("Чистое золото за час", "Net gold per hour")
        ],
        primary: { label: t("Рассчитать реальный доход", "Calculate realized income"), href: t("#farm-liquidity", "#farm-liquidity") },
        secondary: { label: t("Сравнить рыночные маршруты", "Compare market routes"), href: t("#market-rankings", "#market-rankings") }
      },
      {
        id: "craft",
        mark: "И",
        label: t("Экономика рецепта", "Recipe economics"),
        title: t("Проверь всю партию до первого изготовления", "Test the full batch before crafting"),
        summary: t(
          "Маржа одной единицы не показывает, сколько товара рынок примет. Посчитай чистый результат с учётом комиссии, залога и непроданной части.",
          "Unit margin does not show how much stock the market will absorb. Model the full batch after cuts, deposits and unsold output."
        ),
        reason: t("Свободный капитал позволяет войти в изготовление, но размер партии должен зависеть от продаж, а не от доступного золота.", "Liquid capital allows a crafting entry, but batch size should follow demand instead of available gold."),
        checks: [
          t("Полная себестоимость партии", "Full batch cost"),
          t("Ожидаемая доля продаж", "Expected sell-through"),
          t("Капитал в непроданном остатке", "Capital in unsold stock")
        ],
        primary: { label: t("Рассчитать маржу изготовления", "Calculate crafting margin"), href: t("#crafting-margin", "#crafting-margin") },
        secondary: { label: t("Открыть баланс рынка", "Open the market snapshot"), href: t("#market-ledger", "#market-ledger") }
      },
      {
        id: "order",
        mark: "ЗК",
        label: t("Заказы", "Crafting orders"),
        title: t("Назначь минимальную комиссию до принятия заказа", "Set a commission floor before accepting the order"),
        summary: t(
          "Комиссия должна покрывать твои материалы, запас на повторное изготовление, время и целевую ценность часа.",
          "The commission should cover your materials, recraft reserve, service time and target value per hour."
        ),
        reason: t("Заказы требуют меньше капитала, но бесплатные материалы клиента не делают твоё время бесплатным.", "Orders require less capital, but customer-provided materials do not make your time free."),
        checks: [
          t("Собственные материалы", "Crafter materials"),
          t("Запас на повторное изготовление", "Recraft reserve"),
          t("Минимальная цена времени", "Minimum value of time")
        ],
        primary: { label: t("Рассчитать минимальную комиссию", "Calculate the commission floor"), href: t("#order-floor", "#order-floor") },
        secondary: { label: t("Открыть путь заказов", "Open the order path"), href: t("#player-paths", "#player-paths") }
      },
      {
        id: "inventory",
        mark: "С",
        label: t("Запасы", "Inventory"),
        title: t("Сначала освободи золото из непроданных товаров", "Release gold from slow inventory first"),
        summary: t(
          "Оцени запас по ожидаемой цене продажи, а не по текущей цене выставления. Затем сократи партии и выбери срок выхода.",
          "Value stock at expected realized price instead of the current listing. Then reduce batch size and choose an exit horizon."
        ),
        reason: t("Когда капитал уже связан в товарах, новый выгодный рецепт может ухудшить положение, даже если его маржа положительная.", "When capital is already tied up, another profitable recipe can worsen the position even with a positive margin."),
        checks: [
          t("Возраст непроданного запаса", "Age of unsold stock"),
          t("Ожидаемая цена выхода", "Expected exit price"),
          t("Доля ликвидного золота", "Share of liquid gold")
        ],
        primary: { label: t("Открыть баланс рынка", "Open the market snapshot"), href: t("#market-ledger", "#market-ledger") },
        secondary: { label: t("Проверить размер партии", "Review batch sizing"), href: t("/insights/wow-batch-size-inventory-trap/", "/en/insights/wow-batch-size-inventory-trap/") }
      }
    ]
  },

  "total-war": {
    id: "total-war",
    kicker: t("Разбор кампании · три выбора", "Campaign triage · three choices"),
    title: t("Куда направить следующую тысячу золота", "Where should the next thousand gold go?"),
    text: t(
      "Укажи фазу кампании, давление на границах и главную цель. Получишь маршрут к инвестиции, военному резерву или решению после захвата.",
      "Choose the campaign phase, frontier pressure and main objective. Get a route to investment, war reserve or conquest choice."
    ),
    status: t("Числа кампании вводишь ты · патч проверяется отдельно", "Campaign values come from you · patch context is separate"),
    questions: [
      {
        id: "phase",
        label: t("01 · Фаза", "01 · Phase"),
        prompt: t("На каком этапе кампания?", "What stage is the campaign in?"),
        choices: [
          { id: "early", label: t("Первые 30 ходов", "First 30 turns"), hint: t("Каждая постройка конкурирует с армией", "Every building competes with an army"), weights: { building: 4, reserve: 1 } },
          { id: "middle", label: t("Карта уже разделена", "The map is taking shape"), hint: t("Нужно выбрать темп расширения", "I need an expansion pace"), weights: { reserve: 2, conquest: 3 } },
          { id: "late", label: t("Несколько фронтов", "Multiple fronts"), hint: t("Главное не потерять устойчивость", "Stability matters most"), weights: { reserve: 4, conquest: 1 } }
        ]
      },
      {
        id: "pressure",
        label: t("02 · Давление", "02 · Pressure"),
        prompt: t("Что происходит на границах?", "What is happening on the borders?"),
        choices: [
          { id: "peace", label: t("Есть окно мира", "Peace window"), hint: t("Можно дать инвестиции время", "Investment has time to work"), weights: { building: 4 } },
          { id: "threat", label: t("Возможен новый фронт", "A new front is possible"), hint: t("Нужен запас на неожиданность", "I need an emergency buffer"), weights: { reserve: 4 } },
          { id: "advance", label: t("Готовлю наступление", "Preparing an offensive"), hint: t("Нужно оценить цену захвата", "I need to price conquest"), weights: { conquest: 4, reserve: 1 } }
        ]
      },
      {
        id: "goal",
        label: t("03 · Цель", "03 · Goal"),
        prompt: t("Какой результат нужен через 10-20 ходов?", "What should be true in 10-20 turns?"),
        choices: [
          { id: "income", label: t("Больше чистого дохода", "More net income"), hint: t("Проверить окупаемость провинции", "Test province payback"), weights: { building: 4 } },
          { id: "army", label: t("Устойчивая новая армия", "A sustainable new army"), hint: t("Не пробить обязательный резерв", "Keep the reserve intact"), weights: { reserve: 4 } },
          { id: "land", label: t("Расширить территорию", "Expand territory"), hint: t("Сравнить разграбление и удержание", "Compare sack and occupation"), weights: { conquest: 4 } }
        ]
      }
    ],
    outcomes: [
      {
        id: "building",
        mark: "П",
        label: t("Инвестиция в провинцию", "Province investment"),
        title: t("Проверь, успеет ли здание окупиться до войны", "Test whether the building pays back before war"),
        summary: t(
          "Сравни стоимость, задержку строительства, прирост чистого дохода и риск потерять поток на одном горизонте ходов.",
          "Compare cost, construction delay, incremental net income and loss risk across one turn horizon."
        ),
        reason: t("Окно мира повышает ценность роста, но ранняя армия остаётся ценой упущенной возможности.", "A peace window raises the value of growth, but an early army remains the opportunity cost."),
        checks: [
          t("Ход завершения строительства", "Completion turn"),
          t("Чистый прирост дохода", "Incremental net income"),
          t("Риск нового фронта", "New-front risk")
        ],
        primary: { label: t("Рассчитать окупаемость здания", "Calculate building payback"), href: t("#building-payback", "#building-payback") },
        secondary: { label: t("Открыть путь развития", "Open the development path"), href: t("#player-paths", "#player-paths") }
      },
      {
        id: "reserve",
        mark: "А",
        label: t("Военный резерв", "War reserve"),
        title: t("Отдели доступный найм от устойчивого содержания", "Separate affordable recruitment from sustainable upkeep"),
        summary: t(
          "Добавь стоимость найма, содержание новой армии и длительность похода. Смотри на казну у цели, а не в момент покупки.",
          "Combine recruitment cost, new upkeep and campaign duration. Judge cash at the objective instead of cash at purchase."
        ),
        reason: t("Новый фронт или поздняя стадия делают свободную казну стратегическим активом, а не бездействующим золотом.", "A new front or late campaign turns free treasury into a strategic asset instead of idle gold."),
        checks: [
          t("Разовая стоимость найма", "Recruitment cost"),
          t("Чистый расход за ход", "Net outflow per turn"),
          t("Обязательный остаток казны", "Required treasury floor")
        ],
        primary: { label: t("Рассчитать военный резерв", "Calculate the war reserve"), href: t("#war-reserve", "#war-reserve") },
        secondary: { label: t("Проверить изменения патча", "Review patch changes"), href: t("#campaign-pulse", "#campaign-pulse") }
      },
      {
        id: "conquest",
        mark: "З",
        label: t("Решение после захвата", "Conquest decision"),
        title: t("Сравни разовую добычу с будущим потоком", "Compare immediate loot with future flow"),
        summary: t(
          "Поставь разграбление и удержание на один горизонт. Учти задержку дохода, риск потери провинции и стоимость новой границы.",
          "Put sacking and occupation on one horizon. Include income delay, province-loss risk and the cost of a new frontier."
        ),
        reason: t("При активном расширении самая большая выплата сейчас не всегда создаёт лучший темп на следующие ходы.", "During active expansion, the largest payout today does not always create the best tempo for the next turns."),
        checks: [
          t("Разовая добыча", "Immediate payout"),
          t("Доход после стабилизации", "Income after stabilization"),
          t("Риск и стоимость удержания", "Holding risk and cost")
        ],
        primary: { label: t("Сравнить варианты захвата", "Compare conquest options"), href: t("#conquest-choice", "#conquest-choice") },
        secondary: { label: t("Открыть решения по фазам", "Open campaign lenses"), href: t("#economy-lenses", "#economy-lenses") }
      }
    ]
  },

  ck3: {
    id: "ck3",
    kicker: t("Разбор правления · три выбора", "Reign triage · three choices"),
    title: t("Что должна пережить казна этого правителя", "What must this ruler's treasury survive?"),
    text: t(
      "Укажи этап правления, ближайший риск и цель. Получишь маршрут к развитию домена, финансированию войны или запасу для наследника.",
      "Choose the reign stage, nearest risk and goal. Get a route to domain growth, war finance or the heir buffer."
    ),
    status: t("Механики Silk & Silver не моделируются до выхода", "Silk & Silver mechanics stay unmodeled until release"),
    questions: [
      {
        id: "reign",
        label: t("01 · Правление", "01 · Reign"),
        prompt: t("На каком этапе находится правитель?", "What stage is the ruler in?"),
        choices: [
          { id: "young", label: t("Правление только началось", "The reign just began"), hint: t("Нужно укрепить основу", "Build the base"), weights: { domain: 3, war: 1 } },
          { id: "stable", label: t("Власть устойчива", "The realm is stable"), hint: t("Есть время на развитие", "There is time to invest"), weights: { domain: 4 } },
          { id: "late", label: t("Наследование близко", "Succession is near"), hint: t("Важно передать свободу действий", "Preserve options for the heir"), weights: { succession: 5 } }
        ]
      },
      {
        id: "risk",
        label: t("02 · Риск", "02 · Risk"),
        prompt: t("Что может потребовать золото первым?", "What may demand gold first?"),
        choices: [
          { id: "quiet", label: t("Крупной угрозы нет", "No major threat"), hint: t("Можно вложиться в домен", "The domain can compound"), weights: { domain: 4 } },
          { id: "conflict", label: t("Готовится война", "War is approaching"), hint: t("Нужна казна на весь конфликт", "Fund the whole conflict"), weights: { war: 5 } },
          { id: "factions", label: t("Фракции и слабый наследник", "Factions and a weak heir"), hint: t("Нужен запас переходного периода", "Fund the transition"), weights: { succession: 5, war: 1 } }
        ]
      },
      {
        id: "goal",
        label: t("03 · Цель", "03 · Goal"),
        prompt: t("Что должно стать сильнее?", "What should become stronger?"),
        choices: [
          { id: "income", label: t("Личный доход домена", "Personal domain income"), hint: t("Проверить следующее здание", "Test the next building"), weights: { domain: 4 } },
          { id: "victory", label: t("Способность вести войну", "War capacity"), hint: t("Не исчерпать казну", "Avoid treasury exhaustion"), weights: { war: 4 } },
          { id: "heir", label: t("Устойчивость наследника", "Heir resilience"), hint: t("Передать достаточный запас", "Transfer enough buffer"), weights: { succession: 4 } }
        ]
      }
    ],
    outcomes: [
      {
        id: "domain",
        mark: "Д",
        label: t("Развитие домена", "Domain growth"),
        title: t("Считай прирост от следующего здания, а не весь доход", "Model the next building's delta, not total income"),
        summary: t(
          "Сравни стоимость, задержку строительства и дополнительный месячный доход. Добавь риск потерять владение при наследовании.",
          "Compare cost, construction delay and incremental monthly income. Add the risk of losing the holding at succession."
        ),
        reason: t("Стабильное правление даёт инвестиции время, но длинная окупаемость должна завершиться до вероятного кризиса.", "A stable reign gives investment time, but long payback should finish before the likely crisis window."),
        checks: [
          t("Прирост месячного дохода", "Incremental monthly income"),
          t("Срок завершения и окупаемости", "Completion and payback"),
          t("Риск потери владения", "Holding-loss risk")
        ],
        primary: { label: t("Рассчитать окупаемость домена", "Calculate domain payback"), href: t("#domain-payback", "#domain-payback") },
        secondary: { label: t("Открыть путь правителя", "Open the ruler path"), href: t("#player-paths", "#player-paths") }
      },
      {
        id: "war",
        mark: "В",
        label: t("Финансы войны", "War finance"),
        title: t("Оцени казну после войны, а не перед объявлением", "Judge treasury after war, not before declaration"),
        summary: t(
          "Сложи разовые расходы, ежемесячный военный отток и ожидаемую длительность. Сравни остаток с обязательным резервом.",
          "Combine one-off cost, monthly wartime outflow and expected duration. Compare the result with the required reserve."
        ),
        reason: t("Наличие казны сегодня не означает, что правитель выдержит затяжную войну или второй конфликт.", "Cash today does not mean the ruler can survive a long war or a second conflict."),
        checks: [
          t("Разовые расходы на начало", "One-off starting cost"),
          t("Чистый отток в месяц", "Net monthly outflow"),
          t("Казна в конце конфликта", "Treasury after the conflict")
        ],
        primary: { label: t("Рассчитать военную казну", "Calculate the war chest"), href: t("#war-chest", "#war-chest") },
        secondary: { label: t("Сравнить решения правителя", "Compare ruler decisions"), href: t("#economy-lenses", "#economy-lenses") }
      },
      {
        id: "succession",
        mark: "Н",
        label: t("Наследование", "Succession"),
        title: t("Передай наследнику не сумму, а запас времени", "Transfer time and options, not just a gold number"),
        summary: t(
          "Вычти расходы переходного периода, временный отток и обязательные платежи. Оставшаяся казна должна дать наследнику несколько вариантов ответа.",
          "Subtract transition costs, temporary outflow and mandatory spending. The remaining treasury should preserve several responses for the heir."
        ),
        reason: t("Близкое наследование делает ликвидность защитным активом. Здание с долгой окупаемостью может оставить нового правителя без выхода.", "Near succession turns liquidity into a defensive asset. A long-payback building can leave the new ruler without an exit."),
        checks: [
          t("Расходы переходного периода", "Transition costs"),
          t("Временное снижение дохода", "Temporary income loss"),
          t("Целевой остаток наследника", "Heir treasury target")
        ],
        primary: { label: t("Рассчитать запас наследника", "Calculate the heir buffer"), href: t("#succession-buffer", "#succession-buffer") },
        secondary: { label: t("Проверить контекст династии", "Review dynasty context"), href: t("#dynasty-pulse", "#dynasty-pulse") }
      }
    ]
  }
};

export const getHubGateway = (id: HubGatewayId): HubGatewayConfig => hubGateways[id];
