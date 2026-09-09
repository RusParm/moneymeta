export function strategyDecisionCopy(lang: "ru" | "en", game: string, model: string) {
  const ru = lang === "ru";
  const turn = game === "total-war";
  const succession = model === "succession-buffer";
  return {
    title: succession
      ? (ru ? "Выдержит ли казна расходы переходного периода" : "Can the treasury absorb transition costs?")
      : turn
        ? (ru ? "Нанять армию сейчас или отложить" : "Recruit now or postpone?")
        : (ru ? "Начать войну сейчас или сохранить казну" : "Start the war now or preserve cash?"),
    intro: ru
      ? "Сравни три денежных сценария на одну конечную дату: начать сейчас, отложить новые обязательства или оставить текущие. Проверь резерв на каждом шаге, включая разовый платёж."
      : "Compare three cash paths to the same end date: act now, postpone the added commitment or keep existing commitments. Check the reserve at every step, including the upfront payment.",
    inputs: ru
      ? "Возьми казну, доход до вычета расходов и текущие расходы из экономики кампании. Если используешь уже чистый баланс, укажи его в поле дохода, а текущие расходы поставь 0. Новый расход должен быть только прибавкой к текущему."
      : "Use campaign cash, income before expenses and existing expenses. If you enter an already net balance as income, set existing expenses to 0. New upkeep must be only the increase over existing expenses.",
    sourceHint: succession
      ? (ru ? "Это проверка заданных расходов и изменения дохода. Распределение владений и фактический доход наследника здесь не рассчитываются." : "This tests entered costs and an income change. It does not calculate the distribution of holdings or the heir's actual income.")
      : turn
        ? (ru ? "Для нового содержания используй полное изменение расхода после найма, включая доступные в кампании модификаторы. Будущую добычу без отдельного допущения не прибавляем." : "Use the full upkeep increase after recruitment, including modifiers shown in your campaign. Future loot is not assumed.")
        : (ru ? "Сравни расходы до и после поднятия войск. Репарации, добыча и результат войны не предсказываются." : "Compare expenses before and after raising forces. Reparations, loot and the outcome of war are not predicted."),
    changes: ru ? "Отсрочка и изменение дохода" : "Delay and income change",
    delay: turn
      ? (ru ? "Отсрочка найма, ходов" : "Recruitment delay, turns")
      : (ru ? "Отсрочка новых расходов, месяцев" : "Added-cost delay, months"),
    changePeriod: turn
      ? (ru ? "Изменение дохода с хода, 0 = выключено" : "Income changes from turn, 0 = off")
      : (ru ? "Изменение дохода с месяца, 0 = выключено" : "Income changes from month, 0 = off"),
    change: turn
      ? (ru ? "Изменение дохода за ход, + или −" : "Income change per turn, + or −")
      : (ru ? "Изменение дохода за месяц, + или −" : "Income change per month, + or −"),
    changeHelp: ru
      ? "Изменение действует с указанного периода во всех вариантах. Например, −10 означает падение дохода на 10. Это твоё допущение; 0 в номере периода выключает его."
      : "The change applies from the selected period in every alternative. For example, −10 means income falls by 10. This is your assumption; period 0 disables it.",
    timing: turn
      ? (ru ? "Отсрочка переносит и платёж за найм, и начало нового содержания. До этого момента новой армии нет. Одинаковая конечная дата не означает одинаковый военный результат." : "Delaying moves both the recruitment payment and the start of added upkeep. The new army is unavailable until then. The same end date does not imply the same military outcome.")
      : (ru ? "Отсрочка переносит весь новый расход вместе с разовым платежом. Она подходит только для действий, которые можно отложить. Обязательный кризис или наследование перенести нельзя." : "Delaying moves the whole added commitment, including its upfront payment. It applies only to actions you can postpone. An unavoidable crisis or succession cannot be rescheduled."),
    final: ru ? "Казна у цели: начать сейчас" : "Cash at target: act now",
    minimum: ru ? "Наименьший остаток: начать сейчас" : "Lowest cash: act now",
    breach: ru ? "Первое нарушение резерва" : "First reserve breach",
    maxAdded: turn
      ? (ru ? "Допустимое новое содержание / ход" : "Affordable added upkeep / turn")
      : (ru ? "Допустимый новый расход / мес." : "Affordable added outflow / month"),
    incomeThresholdTitle: ru ? "Доход для старта сейчас" : "Income needed to act now",
    incomeThresholdHelp: ru
      ? "Меняем только доход с первого периода. Введённое будущее изменение дохода, сроки и все расходы сохраняются. Это условие бюджета при старте сейчас."
      : "Only income from the first period changes. Your entered future income change, timing and all costs stay in place. This is a budget condition for acting now.",
    incomeThresholdImmediate: ru
      ? "Резерв затронут уже при разовом платеже. Более высокий будущий доход не исправит этот момент: сначала нужен запас в начальной казне или меньший платёж."
      : "The upfront payment already breaches the reserve. Higher future income cannot fix that checkpoint: first increase initial cash or reduce the payment.",
    incomeThresholdRange: ru
      ? "Нужный доход выходит за доступный диапазон ввода. Проверь платёж, расходы и начальную казну."
      : "The required income is outside the supported input range. Review the payment, costs and initial cash.",
    incomeThresholdBelowRange: ru
      ? "При остальных введённых условиях резерв сохраняется во всём доступном диапазоне дохода. Расчётный порог ниже минимального значения поля."
      : "Under the other entered assumptions, the reserve is preserved throughout the supported income range. The calculated threshold is below the field's minimum.",
    none: ru ? "Нет в выбранном горизонте" : "None within this horizon",
    immediate: ru ? "Сразу при платеже" : "Immediately on payment",
    impossible: ru ? "Не хватает даже при 0" : "Shortfall even at 0",
    safe: ru ? "Начать сейчас: резерв сохранён на каждом шаге" : "Act now: reserve preserved at every step",
    unsafe: ru ? "Начать сейчас: резерв будет затронут" : "Act now: the reserve is breached",
    invalid: ru ? "Заполни поля допустимыми числами. Периоды должны быть целыми, горизонт от 1 до 600. Расчёт пока скрыт." : "Enter valid numbers. Periods must be whole numbers and the horizon must be 1 to 600. Results are hidden until then.",
    choice: ru ? "Сценарий" : "Scenario",
    cash: ru ? "Казна у цели" : "Cash at target",
    first: ru ? "Резерв" : "Reserve",
    now: ru ? "Начать сейчас" : "Act now",
    later: ru ? "Отложить" : "Postpone",
    keep: ru ? "Без новых обязательств" : "Keep existing commitments",
    tableLabel: ru ? "Три варианта на одну конечную дату" : "Three alternatives to the same end date",
    path: ru ? "Показать движение казны и порядок расчёта" : "Show the cash paths and calculation order",
    period: turn ? (ru ? "Ход" : "Turn") : (ru ? "Месяц" : "Month"),
    pathHelp: ru
      ? "Строка 0 показывает казну сразу после платежа при старте сейчас. Затем в конце каждого периода прибавляется доход и вычитаются расходы. При отсрочке платёж списывается после указанного числа полных периодов, новое содержание начинается со следующего. Равенство резерву допустимо. Доходы и расходы внутри периода не моделируются."
      : "Row 0 is cash immediately after paying to act now. Each period then adds income and subtracts expenses. A delayed action is paid after the chosen number of complete periods; added upkeep starts in the next period. Equality with the reserve is allowed. Intra-period income and expense timing is not modeled.",
    after: ru ? "После игры открой сохранённый расчёт, замени казну и баланс фактическими значениями и сократи горизонт до оставшихся ходов или месяцев." : "After playing, reopen the saved calculation, replace cash and flow with observed values and shorten the horizon to the remaining turns or months."
  };
}
