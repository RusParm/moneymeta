import { getGoalPlannerPath } from "./goal-planners";
import { getHubPath, type HubLocale, type HubLocalized, type HubPortalId, type HubSectionSlug } from "./hub-portals";

export type HubJourneyDestination =
  | { kind: "section"; section: HubSectionSlug }
  | { kind: "planner"; section: "tools" }
  | { kind: "insight"; section: "guides"; slug: string };

export interface HubJourneyStep {
  code: string;
  title: HubLocalized;
  instruction: HubLocalized;
  checkpoint: HubLocalized;
  destination: HubJourneyDestination;
}

export interface HubJourney {
  hub: HubPortalId;
  slug: string;
  code: string;
  title: HubLocalized;
  description: HubLocalized;
  audience: HubLocalized;
  window: HubLocalized;
  startingPoint: HubLocalized;
  successSignal: HubLocalized;
  failureSignal: HubLocalized;
  principles: [HubLocalized, HubLocalized, HubLocalized];
  steps: [HubJourneyStep, HubJourneyStep, HubJourneyStep, HubJourneyStep];
}

const t = (ru: string, en: string): HubLocalized => ({ ru, en });
const section = (section: HubSectionSlug): HubJourneyDestination => ({ kind: "section", section });
const planner = (): HubJourneyDestination => ({ kind: "planner", section: "tools" });
const insight = (slug: string): HubJourneyDestination => ({ kind: "insight", section: "guides", slug });
const step = (
  code: string,
  title: HubLocalized,
  instruction: HubLocalized,
  checkpoint: HubLocalized,
  destination: HubJourneyDestination
): HubJourneyStep => ({ code, title, instruction, checkpoint, destination });

export const hubJourneys: Record<HubPortalId, HubJourney[]> = {
  gta: [
    {
      hub: "gta",
      slug: "buy-without-reset",
      code: "GTA-01",
      title: t("Купить бизнес и не вернуться к нулю", "Buy a business without returning to zero"),
      description: t("Маршрут от узкого места текущего денежного цикла до даты покупки с защищённым остатком.", "A route from the current cash-loop bottleneck to a purchase date with a protected cash floor."),
      audience: t("Банк от GTA$1 млн до GTA$5 млн", "GTA$1M to GTA$5M bankroll"),
      window: t("2-6 игровых недель", "2-6 play weeks"),
      startingPoint: t("Цель выбрана, но непонятно, ускорит ли она следующий денежный цикл.", "The target is chosen, but its effect on the next cash cycle is unclear."),
      successSignal: t("После покупки остаются резерв, сырьё и понятный следующий источник дохода.", "The purchase leaves a reserve, supplies and a clear next income source."),
      failureSignal: t("Цена закрывается только последними деньгами или валовой продажей без расходов.", "The price works only by spending the last cash or counting gross sales before costs."),
      principles: [
        t("Резерв считается частью полной цены решения.", "The reserve is part of the full decision cost."),
        t("Недельный поток берётся после сырья и ручной нагрузки.", "Weekly flow is measured after supplies and active friction."),
        t("Покупка должна финансировать следующий ход, а не забирать его.", "The purchase must fund the next move instead of removing it.")
      ],
      steps: [
        step("01", t("Найди узкое место денежного цикла", "Find the cash-loop bottleneck"), t("Отметь, где капитал простаивает: в сырье, производстве, продаже или ожидании следующей сессии.", "Identify where capital waits: supplies, production, sale or the next playable session."), t("Ты можешь назвать один этап, который ограничивает чистый недельный поток.", "You can name the one stage limiting weekly net flow."), section("economy")),
        step("02", t("Выбери режим под реальные часы", "Choose a route for real play time"), t("Сопоставь возвращение, короткие сессии или развитый портфель со своим банком и календарём.", "Match the returner, short-session or developed-portfolio path to your bankroll and schedule."), t("Следующие три действия помещаются в твой обычный игровой режим.", "The next three actions fit your normal play pattern."), section("player-paths")),
        step("03", t("Закрой цену и резерв к дате", "Fund the price and reserve by the date"), t("Введи текущий банк, полную стоимость улучшений, защищённый остаток и чистый недельный поток.", "Enter current cash, full upgrade cost, protected floor and weekly net flow."), t("Планировщик показывает срок и положительный запас на контрольной дате.", "The planner returns a runway and positive slack at the checkpoint."), planner()),
        step("04", t("Проведи плохой сценарий", "Run the adverse case"), t("Снизь поток на один денежный цикл и проверь, какая часть покупки должна быть отложена первой.", "Remove one cash cycle and identify which part of the purchase should be deferred first."), t("Даже плохой сценарий не тратит резерв и не останавливает производство.", "The adverse case still preserves the reserve and keeps production moving."), insight("gta-online-goal-runway-with-reserve"))
      ]
    },
    {
      hub: "gta",
      slug: "four-hour-week",
      code: "GTA-02",
      title: t("Собрать систему на четыре часа в неделю", "Build a four-hour weekly system"),
      description: t("Путь для игрока, которому нужен устойчивый доход без второй работы внутри игры.", "A route for a player who wants durable income without turning the game into a second job."),
      audience: t("Короткие сессии и непредсказуемый график", "Short sessions and an unpredictable schedule"),
      window: t("Одна рабочая неделя", "One operating week"),
      startingPoint: t("Доход есть, но он распадается на слишком много ручных действий.", "Income exists, but it is fragmented across too many active chores."),
      successSignal: t("Каждая сессия имеет одну задачу, а пассивные циклы работают между входами.", "Every session has one job while passive cycles run between logins."),
      failureSignal: t("Маршрут требует ежедневной проверки нескольких бизнесов и продаёт занятость как прибыль.", "The route requires daily checks across several businesses and mistakes busyness for profit."),
      principles: [
        t("Сначала ограничение времени, потом выбор актива.", "Time constraint comes before asset choice."),
        t("Ручная нагрузка сравнивается с чистой прибылью.", "Active workload is compared with net profit."),
        t("Один устойчивый цикл сильнее пяти незаконченных.", "One durable loop beats five unfinished ones.")
      ],
      steps: [
        step("01", t("Выбери короткий операционный режим", "Choose a short operating mode"), t("Зафиксируй число сессий и максимальную длину одного входа до выбора бизнеса.", "Fix the number of sessions and maximum session length before choosing a business."), t("Твои часы заданы как жёсткий предел, а не как пожелание.", "Your available hours are a hard ceiling, not a preference."), section("player-paths")),
        step("02", t("Убери лишние звенья", "Remove unnecessary links"), t("Оставь только те производственные и продажные этапы, которые реально помещаются между сессиями.", "Keep only the production and sale stages that truly fit between sessions."), t("У каждого оставшегося звена есть понятная причина находиться в цикле.", "Every remaining link has a clear reason to stay in the loop."), section("economy")),
        step("03", t("Сравни доход с ручной нагрузкой", "Compare income with active load"), t("Проверь окупаемость и портфель при четырёх доступных часах, а не при идеальной неделе.", "Test payback and portfolio allocation at four available hours, not an ideal week."), t("Модель не требует времени, которого у тебя обычно нет.", "The model does not require time you usually do not have."), section("tools")),
        step("04", t("Собери недельный протокол", "Build the weekly protocol"), t("Распредели четыре часа между подготовкой, продажей и одним действием роста.", "Split four hours between preparation, sale and one growth action."), t("Неделя заканчивается деньгами и следующим решением, а не складом незавершённых задач.", "The week ends with cash and a next decision, not a backlog of unfinished chores."), insight("gta-online-best-business-four-hours-week"))
      ]
    },
    {
      hub: "gta",
      slug: "weekly-bonus-triage",
      code: "GTA-03",
      title: t("Решить, меняет ли бонус недельный план", "Decide whether a weekly bonus changes the plan"),
      description: t("Четыре проверки, которые отделяют короткое окно от дорогого отклонения от стратегии.", "Four checks that separate a short opportunity from an expensive strategic detour."),
      audience: t("Игрок с работающим портфелем", "Player with an operating portfolio"),
      window: t("До конца текущего события", "Until the current event ends"),
      startingPoint: t("Бонус выглядит выгодно, но требует покупки, подготовки или смены привычного цикла.", "The bonus looks attractive but requires a purchase, setup or a change to the normal loop."),
      successSignal: t("Событие ускоряет уже нужное действие и не создаёт бесполезный актив после недели.", "The event accelerates an already useful action and does not leave a dead asset afterward."),
      failureSignal: t("Вся выгода исчезает после цены входа, сырья и потерянного основного цикла.", "The upside disappears after entry cost, supplies and the displaced core loop."),
      principles: [
        t("Бонус меняет порядок, а не автоматически ценность актива.", "A bonus changes order, not automatically asset value."),
        t("Цена переключения входит в расчёт недели.", "Switching cost belongs in the weekly calculation."),
        t("После события актив должен оставаться полезным.", "The asset must remain useful after the event.")
      ],
      steps: [
        step("01", t("Зафиксируй точное окно события", "Lock the exact event window"), t("Проверь срок, множитель и обязательные условия в официальном контексте недели.", "Verify the end date, multiplier and eligibility in the official weekly context."), t("Ты знаешь, сколько полных циклов реально помещается до окончания бонуса.", "You know how many complete cycles truly fit before the bonus ends."), section("meta")),
        step("02", t("Найди вытесненный денежный цикл", "Identify the displaced cash loop"), t("Назови доход и время, которые потеряет основной портфель из-за переключения.", "Name the income and time the core portfolio loses because of the switch."), t("У бонусного маршрута есть полная цена переключения.", "The bonus route has a complete switching cost."), section("economy")),
        step("03", t("Посчитай покупку после бонуса", "Price the purchase after the bonus"), t("Сравни окупаемость актива в обычную неделю и проверь остаток банка после входа.", "Compare normal-week payback and check the remaining bankroll after entry."), t("Решение остаётся приемлемым даже без временного множителя.", "The decision remains acceptable without the temporary multiplier."), section("tools")),
        step("04", t("Прими решение по трём исходам", "Choose among three outcomes"), t("Ускорить запланированное, использовать уже купленное или пропустить событие без чувства потери.", "Accelerate a planned move, exploit an owned asset or skip the event without false urgency."), t("Выбранный исход поддерживает долгую цель, а не только цифру этой недели.", "The chosen outcome supports the long objective, not only this week's number."), insight("gta-online-when-weekly-bonus-changes-plan"))
      ]
    }
  ],
  dota: [
    {
      hub: "dota",
      slug: "item-before-objective",
      code: "DOTA-01",
      title: t("Собрать предмет к объекту и сохранить запас", "Finish the item before the objective and keep a buffer"),
      description: t("Маршрут связывает текущую минуту, роль, темп золота и окно следующей драки.", "A route connecting the current minute, role, gold pace and the next fight window."),
      audience: t("Керри, мидер или активная третья позиция", "Carry, mid or active offlaner"),
      window: t("Следующие 4-8 минут", "The next 4-8 minutes"),
      startingPoint: t("Предмет выбран, но его готовность не сопоставлена с ближайшим объектом.", "The item is chosen, but its completion is not tied to the next objective."),
      successSignal: t("Предмет и запас готовы до выхода команды на карту.", "The item and buffer are ready before the team moves onto the map."),
      failureSignal: t("Полная сборка появляется после окна силы или оставляет героя без запаса после смерти.", "The full build lands after the power window or leaves no buffer after a death."),
      principles: [
        t("Стоимость становится ценностью только внутри нужного окна.", "Cost becomes value only inside the relevant window."),
        t("Оставшаяся цена считается от золота сейчас.", "Remaining cost starts from current gold."),
        t("Запас после покупки не принадлежит предмету.", "The post-purchase buffer does not belong to the item.")
      ],
      steps: [
        step("01", t("Назови конверсию золота", "Name the gold conversion"), t("Свяжи предмет с башней, Рошаном, защитой территории или конкретным способом начать драку.", "Tie the item to a tower, Roshan, territory defense or a concrete way to start the fight."), t("У предмета есть один объект и одна контрольная минута.", "The item has one objective and one checkpoint minute."), section("economy")),
        step("02", t("Проверь задачу своей роли", "Check the job of your role"), t("Определи, должна ли покупка дать урон, доступ к цели, инициацию или выживание.", "Decide whether the purchase must provide damage, access, initiation or survival."), t("Компоненты оцениваются по задаче, а не только по полной сборке.", "Components are judged by the job, not only by the completed item."), section("player-paths")),
        step("03", t("Посчитай минуту готовности", "Calculate the ready minute"), t("Введи золото сейчас, остаточную цену, рабочий темп, запас и минуту объекта.", "Enter current gold, remaining cost, sustainable pace, buffer and objective minute."), t("Модель подтверждает готовность до окна или показывает точную величину опоздания.", "The model confirms readiness before the window or exposes the exact delay."), planner()),
        step("04", t("Выбери полную сборку или компонент", "Choose full item or component"), t("Если срок не проходит, сохрани эффект для драки более дешёвым компонентом и пересчитай запас.", "If the timing misses, preserve the fight effect with a cheaper component and rerun the buffer."), t("Покупка усиливает ближайшее действие и не лишает следующего решения.", "The purchase strengthens the next action without removing the following decision."), insight("dota-2-item-timing-with-buyback-buffer"))
      ]
    },
    {
      hub: "dota",
      slug: "buyback-before-roshan",
      code: "DOTA-02",
      title: t("Сохранить второй шанс перед Рошаном", "Preserve a second life before Roshan"),
      description: t("Маршрут для решения между компонентом сейчас и ликвидностью на решающую драку.", "A route for choosing between a component now and liquidity for the decisive fight."),
      audience: t("Ключевой герой перед спорным объектом", "Key hero before a contested objective"),
      window: t("Одна драка и следующий выход", "One fight and the next map move"),
      startingPoint: t("Золото почти закрывает компонент, но смерть может закончить окно команды.", "Gold almost completes a component, but one death can end the team's window."),
      successSignal: t("Команда понимает цену смерти и заранее выбирает, когда запас можно тратить.", "The team understands death cost and decides in advance when the reserve can be spent."),
      failureSignal: t("Решение принимается после смерти, когда таймер и потерянный объект уже нельзя вернуть.", "The decision is made after death, when the timer and lost objective cannot be recovered."),
      principles: [
        t("Запас оценивается через объект, а не через страх смерти.", "The reserve is priced through the objective, not fear of dying."),
        t("Компонент обязан изменить вероятность драки сейчас.", "The component must change the fight probability now."),
        t("Правило трат формулируется до контакта с соперником.", "The spending rule is set before contact with the opponent.")
      ],
      steps: [
        step("01", t("Определи свою функцию в драке", "Define your fight function"), t("Зафиксируй, что команда потеряет без твоего повторного выхода: урон, контроль или возможность закончить объект.", "State what the team loses without your second life: damage, control or objective completion."), t("Цена отсутствия описана одним игровым последствием.", "The cost of absence is expressed as one game consequence."), section("player-paths")),
        step("02", t("Проверь текущую версию решения", "Check the current decision context"), t("Отдели реальные изменения патча от привычки хранить или тратить золото автоматически.", "Separate actual patch changes from the habit of always holding or always spending gold."), t("Старый шаблон подтверждён текущими условиями матча.", "The old habit has been validated against current match conditions."), section("meta")),
        step("03", t("Сравни запас с ценой компонента", "Compare reserve with component cost"), t("Посчитай стоимость второго шанса, доступное золото и время до объекта при текущем темпе.", "Calculate second-life cost, available gold and time to the objective at current pace."), t("Ты знаешь, какой компонент можно купить без потери обязательного остатка.", "You know which component fits without consuming the required reserve."), section("tools")),
        step("04", t("Запиши условие траты", "Write the spending condition"), t("Разреши покупку только если компонент меняет драку сильнее, чем сохранённый повторный выход.", "Allow the purchase only when the component changes the fight more than the preserved second life."), t("Решение можно объяснить команде до начала объекта одной фразой.", "The decision can be explained to the team in one sentence before the objective."), insight("dota-2-buyback-reserve-before-roshan"))
      ]
    },
    {
      hub: "dota",
      slug: "replay-tempo-audit",
      code: "DOTA-03",
      title: t("Разобрать потерянный темп по четырём минутам", "Audit lost tempo through four timestamps"),
      description: t("Полевой разбор реплея без ловушки KDA: доход, покупка, выход и конверсия в карту.", "A replay audit beyond KDA: income, purchase, map move and conversion into control."),
      audience: t("Игрок после непонятного поражения", "Player after a confusing loss"),
      window: t("Один реплей, 15 минут разбора", "One replay, 15-minute review"),
      startingPoint: t("Стоимость героя выглядит нормальной, но команда всё равно теряет карту.", "Hero net worth looks acceptable, yet the team still loses the map."),
      successSignal: t("Найдена первая минута, где золото перестало превращаться в действие.", "The first minute where gold stopped becoming action is identified."),
      failureSignal: t("Разбор заканчивается общим выводом про плохую команду или недостаточный фарм.", "The review ends with a generic conclusion about bad teammates or insufficient farm."),
      principles: [
        t("Сначала первая потерянная конверсия, не последняя ошибка.", "Find the first lost conversion, not the final mistake."),
        t("Каждая покупка сверяется со следующим выходом.", "Every purchase is checked against the next map move."),
        t("Вывод обязан изменить одну отметку следующего матча.", "The conclusion must change one checkpoint in the next match.")
      ],
      steps: [
        step("01", t("Отметь четыре контрольные минуты", "Mark four timestamps"), t("Зафиксируй конец линии, первую крупную покупку, первый спорный объект и момент потери территории.", "Capture lane end, first major purchase, first contested objective and the moment territory was lost."), t("У реплея есть четыре кадра для сравнения, а не сплошной пересказ.", "The replay has four comparable frames instead of a continuous retelling."), section("economy")),
        step("02", t("Сверь действие с ролью", "Compare the action with the role"), t("На каждой отметке спроси, выполнял ли герой свою ближайшую задачу по карте.", "At each timestamp, ask whether the hero performed the role's next map job."), t("Для каждой минуты названа ожидаемая работа героя.", "Each timestamp has an expected job for the hero."), section("player-paths")),
        step("03", t("Отдели патч от исполнения", "Separate patch context from execution"), t("Проверь только те изменения версии, которые действительно касаются предмета, героя или выбранного окна.", "Check only version changes that actually affect the item, hero or selected window."), t("Ни одна ошибка исполнения не спрятана за общим словом про мету.", "No execution error is hidden behind a generic meta explanation."), section("meta")),
        step("04", t("Сформулируй одну новую отметку", "Write one new checkpoint"), t("Выбери минуту, ресурс и действие, которые будешь проверять в следующей игре.", "Choose the minute, resource and action to inspect in the next match."), t("Вывод можно проверить в одном следующем реплее.", "The conclusion can be tested in one next replay."), insight("dota-2-replay-economy-four-timestamps"))
      ]
    }
  ],
  wow: [
    {
      hub: "wow",
      slug: "liquid-goal",
      code: "WOW-01",
      title: t("Дойти до цели по ликвидному золоту", "Reach a goal with liquid gold"),
      description: t("Маршрут отделяет деньги в сумках от запасов на аукционе и переводит цель в реальные игровые часы.", "A route separating gold in bags from auction inventory and translating a goal into real play hours."),
      audience: t("Игрок с запасами и конкретной покупкой", "Player with inventory and a concrete purchase"),
      window: t("Одна-две игровые недели", "One or two play weeks"),
      startingPoint: t("Общая стоимость запасов выглядит высокой, но свободного золота для цели не хватает.", "Total inventory value looks high, but spendable gold is short of the goal."),
      successSignal: t("Цель закрывается фактическими продажами, а оборотный капитал остаётся на следующий цикл.", "The goal is funded by realized sales while working capital remains for the next cycle."),
      failureSignal: t("План считает все выставленные предметы проданными по текущей цене.", "The plan assumes every listed item sells at the current price."),
      principles: [
        t("Запас становится деньгами только после продажи.", "Inventory becomes money only after a sale."),
        t("Доход в час уменьшается на непроданный объём и комиссии.", "Hourly income is reduced for unsold volume and fees."),
        t("Оборотный капитал не тратится ради красивой даты.", "Working capital is not spent to produce a prettier date.")
      ],
      steps: [
        step("01", t("Собери баланс ликвидности", "Build the liquidity balance"), t("Раздели золото в сумках, материалы, выставленные товары и уже полученную выручку.", "Separate bag gold, materials, listed goods and realized proceeds."), t("Только одна строка баланса доступна для покупки прямо сейчас.", "Only one balance line is available for an immediate purchase."), section("economy")),
        step("02", t("Выбери короткий рыночный цикл", "Choose a short market loop"), t("Сопоставь сбор, производство или заказы со своим капиталом, знаниями и временем.", "Match gathering, crafting or orders to capital, knowledge and available time."), t("Маршрут можно проверить маленьким объёмом без дорогого входа.", "The route can be tested at small volume without an expensive commitment."), section("player-paths")),
        step("03", t("Переведи цель в игровые часы", "Translate the goal into play hours"), t("Введи ликвидное золото, цену цели, оборотный остаток, эффективный доход и доступное время.", "Enter liquid gold, goal cost, working-capital floor, effective income and available time."), t("Планировщик показывает достижимый срок без продажи запасов на бумаге.", "The planner returns a feasible runway without treating paper inventory as sold."), planner()),
        step("04", t("Проверь скорость фактических продаж", "Validate realized sale speed"), t("Сравни заявленный доход с тем, сколько золота реально вернулось после комиссий и повторных выставлений.", "Compare advertised income with gold actually returned after fees and relisting."), t("Цель проходит по фактическому темпу, а не по витринной цене.", "The goal clears at realized pace, not storefront value."), insight("wow-gold-goal-effective-gph"))
      ]
    },
    {
      hub: "wow",
      slug: "small-batch-market-test",
      code: "WOW-02",
      title: t("Проверить рынок маленькой партией", "Test a market with a small batch"),
      description: t("Маршрут от гипотезы спроса до размера партии, который не запирает весь капитал.", "A route from demand hypothesis to a batch size that does not lock the full bankroll."),
      audience: t("Новая ниша, рецепт или сезонный спрос", "New niche, recipe or seasonal demand"),
      window: t("Один цикл выставления", "One listing cycle"),
      startingPoint: t("Маржа выглядит высокой, но скорость продажи и глубина спроса неизвестны.", "Margin looks high, but sale speed and demand depth are unknown."),
      successSignal: t("Первая партия возвращает капитал и даёт основание увеличить объём на один шаг.", "The first batch returns capital and justifies one controlled increase in volume."),
      failureSignal: t("Весь бюджет превращается в одинаковый запас до первой подтверждённой продажи.", "The entire budget becomes identical inventory before the first confirmed sale."),
      principles: [
        t("Гипотеза спроса проверяется минимальным объёмом.", "Demand is tested with the minimum viable volume."),
        t("Маржа без скорости продажи не определяет размер партии.", "Margin without sale speed does not determine batch size."),
        t("Масштабирование следует за возвратом капитала.", "Scale follows capital return.")
      ],
      steps: [
        step("01", t("Сформулируй причину спроса", "State the demand reason"), t("Свяжи предмет с текущим контентом, расходом игроков или повторяемой потребностью.", "Tie the item to current content, player consumption or a repeatable need."), t("Гипотеза объясняет, кто купит предмет и зачем именно сейчас.", "The hypothesis explains who buys the item and why now."), section("meta")),
        step("02", t("Проверь свободный капитал", "Check deployable capital"), t("Отдели золото для теста от обязательного остатка и уже запертых запасов.", "Separate test capital from the protected floor and already locked inventory."), t("Неудачная партия не останавливает следующий рыночный цикл.", "A failed batch does not stop the next market cycle."), section("economy")),
        step("03", t("Посчитай фактическую маржу партии", "Calculate realized batch margin"), t("Добавь комиссию, вероятность продажи, повторные выставления и число создаваемых предметов.", "Include fees, sell-through, relisting and the number of crafted items."), t("Модель показывает прибыль на проданную часть и капитал под риском отдельно.", "The model separates profit on sold units from capital still at risk."), section("tools")),
        step("04", t("Задай правило следующей партии", "Set the next-batch rule"), t("Увеличивай объём только после заданной доли продаж и возврата исходного капитала.", "Increase volume only after a defined sell-through threshold and recovery of starting capital."), t("Размер следующей партии определяется результатом теста, а не уверенностью в цене.", "The next batch size is determined by test results, not confidence in the listing price."), insight("wow-batch-size-inventory-trap"))
      ]
    },
    {
      hub: "wow",
      slug: "limited-time-route",
      code: "WOW-03",
      title: t("Выбрать рынок при ограниченном времени", "Choose a market route with limited time"),
      description: t("Сравнение сбора, производства и заказов через реальную нагрузку на сессию.", "A comparison of gathering, crafting and orders through actual session workload."),
      audience: t("3-6 часов в неделю", "3-6 hours per week"),
      window: t("Две тестовые сессии", "Two test sessions"),
      startingPoint: t("Доходные маршруты известны, но непонятно, какой из них помещается в график.", "Profitable routes are known, but it is unclear which one fits the schedule."),
      successSignal: t("Выбран один цикл, который даёт ликвидный результат в рамках обычной недели.", "One loop produces a liquid result inside a normal week."),
      failureSignal: t("Расчёт игнорирует поиск покупателей, выставление, дорогу и непроданный остаток.", "The calculation ignores buyer search, listing, travel and unsold inventory."),
      principles: [
        t("Время обслуживания рынка входит в доходность.", "Market servicing time belongs in profitability."),
        t("Короткий цикл должен заканчиваться ликвидным результатом.", "A short loop must end in a liquid result."),
        t("Сложность знаний оплачивается только устойчивой маржой.", "Knowledge complexity is justified only by durable margin.")
      ],
      steps: [
        step("01", t("Выбери роль по ограничению", "Choose the role by constraint"), t("Сравни доступный капитал, знания профессии и длину одной сессии до оценки дохода.", "Compare deployable capital, profession knowledge and session length before evaluating income."), t("Один маршрут исключён заранее по реальному ограничению.", "One route is eliminated early by a real constraint."), section("player-paths")),
        step("02", t("Разложи полный рыночный цикл", "Map the full market loop"), t("Добавь получение материалов, создание, выставление, ожидание, повторную продажу и возврат золота.", "Include sourcing, crafting, listing, waiting, relisting and gold recovery."), t("У цикла есть полная длительность от первой минуты до денег в сумках.", "The loop has a full duration from the first minute to gold in bags."), section("economy")),
        step("03", t("Сравни три модели на одной неделе", "Compare three models in one week"), t("Посчитай маржу производства, ликвидность фарма и минимальную комиссию заказа на одинаковом бюджете времени.", "Calculate crafting margin, farm liquidity and order commission floor on the same time budget."), t("Маршруты сравниваются по фактическому золоту за доступную неделю.", "Routes are compared by realized gold in the available week."), section("tools")),
        step("04", t("Проведи две тестовые сессии", "Run two test sessions"), t("Первая сессия проверяет производство, вторая фиксирует продажи и фактическую нагрузку.", "The first session tests production; the second records sales and actual workload."), t("Решение основано на двух наблюдаемых циклах, а не на чужой лучшей сессии.", "The decision rests on two observed cycles, not someone else's best session."), insight("wow-gathering-vs-crafting-limited-time"))
      ]
    }
  ],
  "total-war": [
    {
      hub: "total-war",
      slug: "war-chest-before-declaration",
      code: "TW-01",
      title: t("Собрать казну до объявления войны", "Build the war chest before declaring war"),
      description: t("Маршрут связывает масштаб войны, число ходов, содержание и резерв второго фронта.", "A route connecting war scope, turns, upkeep and a second-front reserve."),
      audience: t("Кампания перед новой войной", "Campaign before a new war"),
      window: t("3-8 ходов", "3-8 turns"),
      startingPoint: t("Армия доступна по цене найма, но полная нагрузка войны ещё не посчитана.", "The army is affordable to recruit, but the full burden of war is not yet priced."),
      successSignal: t("К началу войны оплачены подготовка, ожидаемый дефицит и один плохой новый фронт.", "At declaration, setup, expected deficit and one adverse new front are funded."),
      failureSignal: t("Казна заканчивается после первого пополнения или срочного найма.", "The treasury is exhausted after the first replenishment or emergency recruitment."),
      principles: [
        t("Цена войны включает содержание после найма.", "War cost includes upkeep after recruitment."),
        t("Резерв второго фронта не финансирует первый.", "The second-front reserve does not fund the first front."),
        t("Масштаб армии подчиняется горизонту в ходах.", "Army scope is constrained by the turn horizon.")
      ],
      steps: [
        step("01", t("Найди ограничение текущей фазы", "Find the phase constraint"), t("Раздели казну, чистый доход, незавершённые стройки и уже принятые военные обязательства.", "Separate treasury, net income, unfinished construction and existing military commitments."), t("Назван один ресурс, который ограничивает начало войны.", "One resource limiting the war start is identified."), section("economy")),
        step("02", t("Выбери режим границы", "Choose the frontier mode"), t("Определи, нужна ли кампания развитию, стабилизации или немедленной экспансии.", "Decide whether the campaign needs development, stabilization or immediate expansion."), t("Масштаб войны соответствует состоянию границы, а не только силе основной армии.", "War scope matches frontier condition, not only the main army's strength."), section("player-paths")),
        step("03", t("Посчитай ход готовности", "Calculate the ready turn"), t("Введи цену подготовки, обязательный остаток, чистый доход и число ходов до объявления.", "Enter preparation cost, protected floor, net income and turns before declaration."), t("Планировщик показывает положительный запас на выбранном ходу.", "The planner shows positive slack on the selected turn."), planner()),
        step("04", t("Проведи второй фронт", "Run the second-front case"), t("Добавь один срочный платёж и один ход повышенного дефицита до финального решения.", "Add one emergency payment and one turn of elevated deficit before the final decision."), t("Плохой сценарий не отменяет ключевой набор и не обнуляет казну.", "The adverse case does not cancel core recruitment or empty the treasury."), insight("total-war-war-chest-countdown"))
      ]
    },
    {
      hub: "total-war",
      slug: "building-before-frontier",
      code: "TW-02",
      title: t("Построить до войны или сохранить ликвидность", "Build before war or preserve liquidity"),
      description: t("Проверка здания через срок окупаемости, военное окно и риск более активного противника.", "A building decision tested through payback, war timing and the risk of a more active opponent."),
      audience: t("Провинция перед напряжённой границей", "Province before a contested frontier"),
      window: t("4-12 ходов", "4-12 turns"),
      startingPoint: t("Здание полезно в долгой кампании, но может забрать деньги у ближайшей войны.", "The building is useful long term but may consume cash needed for the next war."),
      successSignal: t("Доход здания возвращает вложение до военного окна, а резерв остаётся целым.", "Building income repays the investment before the war window while the reserve stays intact."),
      failureSignal: t("Окупаемость заканчивается после момента, когда армии уже нужны деньги.", "Payback ends after the moment when armies already need the cash."),
      principles: [
        t("Горизонт окупаемости заканчивается у военного решения.", "The payback horizon ends at the war decision."),
        t("Строительство конкурирует с наймом за одну казну.", "Construction competes with recruitment for one treasury."),
        t("Риск границы увеличивает цену неликвидности.", "Frontier risk increases the cost of illiquidity.")
      ],
      steps: [
        step("01", t("Проверь, что изменил патч", "Check what the patch changed"), t("Отдели подтверждённую активность ИИ от общих ожиданий о сложности кампании.", "Separate verified AI behavior changes from general expectations about campaign difficulty."), t("Риск границы описан конкретным дополнительным обязательством.", "Frontier risk is expressed as a concrete additional commitment."), section("meta")),
        step("02", t("Определи свободную казну", "Define deployable treasury"), t("Вычти содержание, ближайшее пополнение и обязательный военный остаток до оценки стройки.", "Subtract upkeep, near-term replenishment and the protected war floor before pricing construction."), t("Стоимость здания не использует деньги, уже обещанные армии.", "Building cost does not use money already committed to the army."), section("economy")),
        step("03", t("Сравни окупаемость с окном войны", "Compare payback with the war window"), t("Посчитай стоимость, задержку строительства, доход за ход и доступный горизонт.", "Calculate cost, construction delay, income per turn and the available horizon."), t("Вложение возвращается до войны или явно помечено как долгий выбор.", "The investment repays before war or is explicitly treated as a long-term choice."), section("tools")),
        step("04", t("Прими решение по трём исходам", "Choose among three outcomes"), t("Строить сейчас, отложить до мирного окна или выбрать более дешёвый промежуточный уровень.", "Build now, defer to a peaceful window or choose a cheaper intermediate tier."), t("Решение сохраняет возможность реагировать на неожиданный фронт.", "The decision preserves the ability to react to an unexpected front."), insight("total-war-warhammer-3-building-payback-before-war"))
      ]
    },
    {
      hub: "total-war",
      slug: "conquest-aftermath",
      code: "TW-03",
      title: t("Решить судьбу захваченного поселения", "Decide what to do with a captured settlement"),
      description: t("Маршрут сравнивает разграбление, удержание и темп следующего похода через полную цену границы.", "A route comparing sack, hold and next-campaign tempo through full frontier cost."),
      audience: t("Армия после дорогой победы", "Army after an expensive victory"),
      window: t("Текущий ход и 5 ходов после", "Current turn plus the next 5"),
      startingPoint: t("Разовая добыча видна сразу, а стоимость удержания разбросана по будущим ходам.", "One-off loot is visible immediately while holding cost is spread across future turns."),
      successSignal: t("Выбор финансирует следующий объект и не создаёт границу, которую нечем защищать.", "The choice funds the next objective without creating a frontier that cannot be defended."),
      failureSignal: t("Решение максимизирует текущую выплату и игнорирует восстановление, порядок и гарнизон.", "The decision maximizes current payout while ignoring recovery, order and garrison burden."),
      principles: [
        t("Разовая добыча сравнивается с многими ходами удержания.", "One-off loot is compared with multiple turns of holding cost."),
        t("Новая граница считается обязательством.", "A new frontier is treated as a commitment."),
        t("Следующий объект задаёт ценность текущего выбора.", "The next objective defines the value of the current choice.")
      ],
      steps: [
        step("01", t("Назови следующий объект кампании", "Name the next campaign objective"), t("Определи, должна ли армия продолжать наступление, восстанавливаться или закреплять провинцию.", "Decide whether the army must continue, recover or consolidate the province."), t("Есть один приоритет на следующие пять ходов.", "There is one priority for the next five turns."), section("player-paths")),
        step("02", t("Посчитай полную цену удержания", "Price the full holding cost"), t("Добавь восстановление, порядок, гарнизон, возможную вторую армию и задержку следующего похода.", "Include recovery, control, garrison, possible second army and delay to the next campaign."), t("Удержание имеет цену в золоте и темпе.", "Holding has both a gold cost and a tempo cost."), section("economy")),
        step("03", t("Сравни три исхода", "Compare three outcomes"), t("Проведи разграбление, оккупацию и отказ через одинаковый горизонт и риск возврата врага.", "Run sack, occupy and abandon through the same horizon and recapture risk."), t("Каждый исход показывает казну и позицию армии у следующего решения.", "Each outcome exposes treasury and army position at the next decision."), section("tools")),
        step("04", t("Выбери темп, а не выплату", "Choose tempo, not payout"), t("Прими исход, который лучше финансирует следующий объект с учётом новой границы.", "Choose the outcome that best funds the next objective after frontier cost."), t("Разовая цифра не скрывает обязательства следующих ходов.", "The one-off number no longer hides future-turn obligations."), insight("total-war-warhammer-3-sack-or-occupy-frontier"))
      ]
    }
  ],
  ck3: [
    {
      hub: "ck3",
      slug: "succession-ready-realm",
      code: "CK3-01",
      title: t("Подготовить наследника к переходу власти", "Prepare the heir for succession"),
      description: t("Маршрут связывает казну, фракции, наёмников и рабочий горизонт до опасного перехода.", "A route connecting treasury, factions, mercenaries and the working horizon before a risky transition."),
      audience: t("Правитель с уязвимым наследником", "Ruler with a vulnerable heir"),
      window: t("12-36 игровых месяцев", "12-36 in-game months"),
      startingPoint: t("Точная дата неизвестна, но цена слабого старта наследника уже понятна.", "The exact date is unknown, but the cost of a weak start for the heir is already visible."),
      successSignal: t("Наследник получает деньги на наёмников, подарки и один неожиданный кризис.", "The heir receives funds for mercenaries, gifts and one unexpected shock."),
      failureSignal: t("Последние деньги вложены в долгую стройку, которая не помогает в первые месяцы перехода.", "The last cash is locked in a long building that does not help during the first months of succession."),
      principles: [
        t("Горизонт перехода является рабочим сценарием, не предсказанием.", "The succession horizon is a working scenario, not a prediction."),
        t("Резерв наследника отделён от текущих амбиций правителя.", "The heir reserve is separate from the ruler's current ambitions."),
        t("Один плохой кризис входит в базовую проверку.", "One adverse shock belongs in the baseline check.")
      ],
      steps: [
        step("01", t("Собери обязательства перехода", "List transition obligations"), t("Отдельно оцени наёмников, подарки ключевым вассалам, фракции и возможный разовый платёж.", "Price mercenaries, gifts to key vassals, factions and a possible one-off payment separately."), t("У перехода есть полная денежная цена, а не только сумма наёмников.", "The transition has a full cash cost, not only a mercenary number."), section("economy")),
        step("02", t("Выбери режим до наследования", "Choose the pre-succession mode"), t("Определи, нужно ли развивать домен, стабилизировать вассалов или остановить внешнюю экспансию.", "Decide whether to develop the domain, stabilize vassals or stop external expansion."), t("Каждое текущее действие поддерживает старт наследника.", "Every current action supports the heir's opening position."), section("player-paths")),
        step("03", t("Посчитай месяцы до резерва", "Calculate months to the buffer"), t("Введи казну, резерв наследника, плохой разовый сценарий, чистый доход и рабочий горизонт.", "Enter treasury, heir buffer, one-off adverse case, monthly net income and working horizon."), t("Планировщик показывает положительный остаток к выбранной точке.", "The planner shows positive slack at the selected checkpoint."), planner()),
        step("04", t("Не потрать горизонт дважды", "Do not spend the horizon twice"), t("Проверь, не используется ли один будущий доход одновременно для стройки и резерва наследника.", "Check whether the same future income is funding both construction and the heir buffer."), t("У каждого будущего месяца есть только одно назначение в плане.", "Every future month has only one assignment in the plan."), insight("ck3-succession-buffer-countdown"))
      ]
    },
    {
      hub: "ck3",
      slug: "war-without-empty-treasury",
      code: "CK3-02",
      title: t("Начать войну без пустой казны", "Start a war without an empty treasury"),
      description: t("Маршрут проверяет цель войны, длительность, наёмников и запас на плохой исход.", "A route testing war objective, duration, mercenaries and a reserve for the adverse case."),
      audience: t("Правитель перед объявлением войны", "Ruler before declaring war"),
      window: t("6-24 игровых месяца", "6-24 in-game months"),
      startingPoint: t("Начальная армия выглядит сильнее, но длительность войны и второй кризис не посчитаны.", "The opening army looks stronger, but war duration and a second crisis are not priced."),
      successSignal: t("Казна выдерживает содержание войск, один затяжной этап и обязательный остаток после мира.", "The treasury absorbs raised troops, one prolonged phase and a protected post-war floor."),
      failureSignal: t("План проходит только при быстрой победе без потерь и фракций дома.", "The plan works only with a quick, lossless victory and no faction pressure at home."),
      principles: [
        t("Ценность цели войны сравнивается с полной ценой кампании.", "War-goal value is compared with full campaign cost."),
        t("Поднятые войска меняют чистый месячный поток.", "Raised troops change monthly net flow."),
        t("Послевоенный остаток планируется до объявления.", "The post-war floor is planned before declaration.")
      ],
      steps: [
        step("01", t("Проверь давление дома", "Check pressure at home"), t("Оцени фракции, наследование и обязательства, которые могут потребовать золото во время войны.", "Assess factions, succession and obligations that may require gold during the war."), t("Домашний риск выражен конкретным резервом.", "Domestic risk is expressed as a concrete reserve."), section("meta")),
        step("02", t("Посчитай поток с поднятыми войсками", "Calculate flow with troops raised"), t("Используй доход после содержания армии и текущих обязательств, а не мирный максимум.", "Use income after army upkeep and current obligations, not the peaceful maximum."), t("Месячный дефицит отражает реальный военный режим.", "Monthly deficit reflects the actual wartime state."), section("economy")),
        step("03", t("Проведи нормальный и плохой исход", "Run normal and adverse outcomes"), t("Сравни длительность, потери, наёмников и послевоенную казну в двух сценариях.", "Compare duration, losses, mercenaries and post-war treasury across two scenarios."), t("Оба исхода показывают, когда приходится отказаться от цели войны.", "Both outcomes show when the war goal should be abandoned."), section("tools")),
        step("04", t("Задай условие объявления", "Set the declaration condition"), t("Объявляй войну только после достижения казны и месячного потока, которые проходят плохой сценарий.", "Declare only after treasury and monthly flow clear the adverse case."), t("Решение имеет измеримый порог до нажатия кнопки войны.", "The decision has a measurable threshold before pressing declare war."), insight("ck3-war-chest-before-declaring-war"))
      ]
    },
    {
      hub: "ck3",
      slug: "domain-before-succession",
      code: "CK3-03",
      title: t("Инвестировать в домен до наследования", "Invest in the domain before succession"),
      description: t("Проверка долгой стройки через доход, задержку, наследника и потребность в ликвидности.", "A long-building decision tested through income, delay, the heir and liquidity needs."),
      audience: t("Правитель с сильным доменом и близким переходом", "Ruler with a strong domain and a near transition"),
      window: t("24-60 игровых месяцев", "24-60 in-game months"),
      startingPoint: t("Здание полезно династии, но может не вернуть деньги до уязвимого перехода.", "The building helps the dynasty but may not return cash before a vulnerable transition."),
      successSignal: t("Инвестиция окупается в рабочем горизонте и не уменьшает резерв наследника.", "The investment repays inside the working horizon without reducing the heir reserve."),
      failureSignal: t("Положительный долгий доход скрывает нехватку денег в первые месяцы нового правителя.", "Positive long-term income hides a cash shortage in the new ruler's opening months."),
      principles: [
        t("Окупаемость заканчивается у точки, где нужна ликвидность.", "Payback ends where liquidity is needed."),
        t("Полезное здание может быть несвоевременным.", "A useful building can still be mistimed."),
        t("Наследник получает и актив, и обязательства вместе.", "The heir inherits both the asset and the obligations.")
      ],
      steps: [
        step("01", t("Определи рабочий горизонт", "Define the working horizon"), t("Выбери консервативное число месяцев до перехода без попытки предсказать точную дату.", "Choose a conservative number of months to succession without pretending to predict the exact date."), t("Окупаемость проверяется на одном явном горизонте.", "Payback is tested against one explicit horizon."), section("meta")),
        step("02", t("Отдели резерв наследника", "Separate the heir reserve"), t("Вычти деньги на фракции, подарки, наёмников и плохой разовый платёж до оценки стройки.", "Subtract funds for factions, gifts, mercenaries and one adverse payment before pricing construction."), t("Цена здания не использует деньги перехода.", "Building cost does not consume transition money."), section("economy")),
        step("03", t("Посчитай задержку и возврат", "Calculate delay and return"), t("Сопоставь стоимость, месяцы строительства, новый доход и остаток до перехода.", "Compare cost, construction months, new income and the remaining pre-succession window."), t("Модель показывает, сколько месяцев актив реально приносит пользу до контрольной точки.", "The model shows how many months the asset actually produces value before the checkpoint."), section("tools")),
        step("04", t("Выбери стройку, паузу или резерв", "Choose build, defer or reserve"), t("Строй сейчас только если окупаемость и старт наследника проходят одновременно.", "Build now only when both payback and the heir's opening position clear the test."), t("Долгий рост не покупается ценой немедленной уязвимости.", "Long-term growth is not purchased with immediate vulnerability."), insight("ck3-1-19-domain-building-before-succession"))
      ]
    }
  ]
};

export const hubJourneyList = Object.values(hubJourneys).flat();

export function getHubJourney(hub: HubPortalId, slug: string): HubJourney | undefined {
  return hubJourneys[hub].find((journey) => journey.slug === slug);
}

export function getHubJourneyPath(journey: Pick<HubJourney, "hub" | "slug">, lang: HubLocale): string {
  const prefix = lang === "en" ? "/en" : "";
  const hubSlug = getHubPath(journey.hub, "ru").split("/").filter(Boolean)[0];
  return `${prefix}/${hubSlug}/playbooks/${journey.slug}/`;
}

export function getHubJourneyStepPath(journey: HubJourney, step: HubJourneyStep, lang: HubLocale): string {
  const destination = step.destination;
  if (destination.kind === "planner") return getGoalPlannerPath(journey.hub, lang);
  if (destination.kind === "insight") return `${lang === "en" ? "/en" : ""}/insights/${destination.slug}/`;
  return getHubPath(journey.hub, lang, destination.section);
}
