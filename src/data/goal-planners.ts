import type { HubLocale, HubLocalized, HubPortalId } from "./hub-portals";
import { hubPortals } from "./hub-portals";
import type { RunwayState } from "../lib/runway";

export type GoalPlannerRole = "current" | "target" | "reserve" | "rate" | "horizon" | "clock" | "deadline";

export interface GoalPlannerField {
  role: GoalPlannerRole;
  label: HubLocalized;
  hint: HubLocalized;
  defaultValue: number;
  min: number;
  step: number;
}

export interface GoalPlannerConfig {
  hub: HubPortalId;
  eyebrow: HubLocalized;
  title: HubLocalized;
  description: HubLocalized;
  question: HubLocalized;
  payoff: HubLocalized;
  periodLabel: HubLocalized;
  periodShort: HubLocalized;
  valuePrefix: string;
  valueSuffix: HubLocalized;
  rateSuffix: HubLocalized;
  guideSlug: string;
  fields: GoalPlannerField[];
  status: Record<RunwayState, { title: HubLocalized; text: HubLocalized }>;
  steps: Array<{ code: string; title: HubLocalized; text: HubLocalized }>;
}

const t = (ru: string, en: string): HubLocalized => ({ ru, en });
const field = (
  role: GoalPlannerRole,
  ru: string,
  en: string,
  hintRu: string,
  hintEn: string,
  defaultValue: number,
  min: number,
  step: number
): GoalPlannerField => ({ role, label: t(ru, en), hint: t(hintRu, hintEn), defaultValue, min, step });

const sharedSteps = {
  gta: [
    { code: "01", title: t("Зафиксируй полную цену", "Lock the full cost"), text: t("Цель и неприкосновенный остаток должны стоять рядом, а не конкурировать после покупки.", "Keep the target and untouchable cash floor in the same calculation instead of reconciling them after purchase.") },
    { code: "02", title: t("Введи чистый недельный поток", "Use weekly net flow"), text: t("Не подставляй валовую продажу: учитывай сырьё и доход, который реально успеваешь забирать.", "Do not use headline sale value: account for supplies and the flow you can actually realize.") },
    { code: "03", title: t("Сравни с датой решения", "Compare with the decision date"), text: t("Если темп не проходит срок, меняй покупку, поток или дедлайн - не резерв.", "If the pace misses the deadline, change the purchase, flow or date rather than silently spending the reserve.") }
  ],
  dota: [
    { code: "01", title: t("Раздели предмет и резерв", "Separate item and buffer"), text: t("Цена предмета отвечает за силу сейчас, резерв - за свободу после ошибки или смерти.", "Item cost buys power now; the buffer preserves optionality after a mistake or death.") },
    { code: "02", title: t("Считай от текущей минуты", "Start at the current minute"), text: t("Золото, заработанное до этого момента, уже в банке. Для тайминга важен только оставшийся разрыв.", "Earlier GPM is already in the bank. Only the remaining gap belongs in the timing calculation.") },
    { code: "03", title: t("Проверь цену задержки", "Price the delay"), text: t("Опоздание на контрольную точку может сделать более дешёвый компонент сильнее полной сборки.", "Missing the decision window can make a cheaper component stronger than completing the full item.") }
  ],
  wow: [
    { code: "01", title: t("Используй ликвидное золото", "Use liquid gold"), text: t("Запасы на аукционе не финансируют цель, пока рынок не превратил их в деньги.", "Auction inventory does not fund the target until the market converts it into cash.") },
    { code: "02", title: t("Подставь эффективный доход в час", "Enter effective GPH"), text: t("Снижай заявленный доход на непроданный остаток, комиссии и повторные выставления.", "Haircut advertised GPH for unsold stock, fees and relisting friction.") },
    { code: "03", title: t("Ограничь недельное время", "Cap weekly time"), text: t("План обязан помещаться в реальный график, а не в идеальную фарм-сессию.", "The plan must fit the real week, not an idealized farming session.") }
  ],
  "total-war": [
    { code: "01", title: t("Назови цену войны", "Name the war cost"), text: t("Сложи набор армий, ожидаемый дефицит и один неприятный разовый платёж.", "Combine army setup, expected deficit and one adverse one-off payment.") },
    { code: "02", title: t("Оставь неприкосновенный пол", "Keep a treasury floor"), text: t("Казна после подготовки должна сохранять реакцию на второй фронт и срочный найм.", "The post-preparation treasury should still absorb a second front or emergency recruitment.") },
    { code: "03", title: t("Сверь с числом ходов", "Check the turn countdown"), text: t("Если нужный поток не успевает, урезай масштаб войны или откладывай необязательную стройку.", "If the required flow cannot land in time, reduce war scope or delay optional construction.") }
  ],
  ck3: [
    { code: "01", title: t("Определи резерв наследника", "Define the heir buffer"), text: t("Отдельно учти наёмников, подарки, фракции и разовый кризис перехода.", "Separate mercenaries, gifts, factions and one transition shock.") },
    { code: "02", title: t("Считай чистый месячный поток", "Use monthly net flow"), text: t("Проверь доход после поднятых войск и других обязательств, а не лучший мирный месяц.", "Use flow after raised troops and other commitments, not the best peaceful month.") },
    { code: "03", title: t("Не инвестируй срок наследника дважды", "Do not spend the heir horizon twice"), text: t("Один и тот же будущий доход не может одновременно окупать стройку и формировать резерв.", "The same future income cannot both repay construction and build the succession reserve.") }
  ]
} satisfies Record<HubPortalId, GoalPlannerConfig["steps"]>;

export const goalPlanners: Record<HubPortalId, GoalPlannerConfig> = {
  gta: {
    hub: "gta",
    eyebrow: t("GTA Online · горизонт покупки", "GTA Online · purchase runway"),
    title: t("Успеешь ли к покупке, не обнуляя банк", "Can you fund the purchase without emptying the bank?"),
    description: t("Соедини полную цену цели, текущий банк, резерв и чистый недельный поток. Модель покажет срок и темп, который нужен к выбранной дате.", "Connect total target cost, current cash, a protected reserve and weekly net flow. The model returns the runway and pace required by your date."),
    question: t("Проходит ли покупка по сроку и ликвидности?", "Does the purchase fit both timing and liquidity?"),
    payoff: t("Получишь недельный темп, дефицит и запас на дедлайне", "Get the weekly pace, funding gap and deadline slack"),
    periodLabel: t("недель до цели", "weeks to target"),
    periodShort: t("нед.", "wk"),
    valuePrefix: "GTA$",
    valueSuffix: t("", ""),
    rateSuffix: t("/нед.", "/wk"),
    guideSlug: "gta-online-goal-runway-with-reserve",
    fields: [
      field("current", "Текущий банк", "Current cash", "Ликвидные GTA$ сейчас", "Liquid GTA$ available now", 1250000, 0, 50000),
      field("target", "Полная цена цели", "Full target cost", "Покупка вместе с обязательными улучшениями", "Purchase plus required upgrades", 4000000, 0, 50000),
      field("reserve", "Резерв после покупки", "Post-purchase reserve", "Сумма, которую нельзя тратить", "Cash that must remain untouched", 250000, 0, 25000),
      field("rate", "Чистый поток в неделю", "Weekly net flow", "После сырья и реальной нагрузки", "After supplies and actual operating friction", 650000, 0, 25000),
      field("horizon", "Недель до дедлайна", "Weeks until deadline", "Когда решение должно быть профинансировано", "When the decision must be funded", 4, 0, 0.5)
    ],
    status: {
      funded: { title: t("Цель уже профинансирована", "The target is already funded"), text: t("Покупка проходит без использования защищённого остатка.", "The purchase fits without consuming the protected cash floor.") },
      "on-track": { title: t("Темп проходит дедлайн", "The pace clears the deadline"), text: t("Текущий чистый поток финансирует цель и сохраняет резерв в выбранный срок.", "Current net flow funds the target and preserves the reserve by the selected date.") },
      close: { title: t("Разрыв небольшой, но срок не проходит", "The gap is close, but the date misses"), text: t("Усиль один денежный цикл или перенеси необязательный расход - резерв трогать не нужно.", "Improve one cash cycle or defer an optional expense; the reserve does not need to move.") },
      "off-track": { title: t("План требует пересборки", "The plan needs a rebuild"), text: t("При текущем темпе цель не укладывается в срок. Меняй стоимость, поток или дату.", "At the current pace the target misses the date. Change cost, flow or timing.") }
    },
    steps: sharedSteps.gta
  },
  dota: {
    hub: "dota",
    eyebrow: t("Dota 2 · тайминг предмета", "Dota 2 · item timing"),
    title: t("Предмет к нужной минуте без потери резерва", "Hit the item timing without sacrificing the buffer"),
    description: t("Проверь, к какой минуте текущий темп золота закрывает оставшуюся стоимость предмета и выбранный запас.", "Test when current GPM covers the remaining item cost plus the gold buffer you want to preserve."),
    question: t("Успевает ли сборка к контрольной точке матча?", "Does the build land before the match window?"),
    payoff: t("Получишь минуту готовности и нужное золото в минуту", "Get the ready minute and required GPM"),
    periodLabel: t("минут до готовности", "minutes until ready"),
    periodShort: t("мин", "min"),
    valuePrefix: "",
    valueSuffix: t(" золота", " gold"),
    rateSuffix: t(" золота/мин", " GPM"),
    guideSlug: "dota-2-item-timing-with-buyback-buffer",
    fields: [
      field("current", "Золото сейчас", "Current gold", "Доступное золото в текущую минуту", "Spendable gold at the current minute", 1850, 0, 50),
      field("target", "Остаточная цена предмета", "Remaining item cost", "Только ещё не купленные компоненты", "Only components not yet purchased", 3200, 0, 50),
      field("reserve", "Резерв после покупки", "Post-purchase buffer", "Золото, которое не входит в предмет", "Gold that does not belong to the item", 900, 0, 50),
      field("rate", "Золота в минуту", "Current GPM", "Рабочий темп, а не лучший отрезок", "Sustainable pace, not the best recent burst", 540, 0, 10),
      field("clock", "Текущая минута", "Current minute", "Откуда начинается оставшийся расчёт", "Where the remaining calculation starts", 14, 0, 0.5),
      field("deadline", "Нужная минута", "Target minute", "Контрольная точка драки или объекта", "Fight or objective decision window", 20, 0, 0.5)
    ],
    status: {
      funded: { title: t("Предмет и резерв уже закрыты", "Item and buffer are already covered"), text: t("Можно принять решение сейчас, не ожидая следующий денежный цикл.", "The decision is funded now without waiting for another gold cycle.") },
      "on-track": { title: t("Тайминг проходит", "The timing is on track"), text: t("При текущем темпе предмет и резерв готовы до выбранной минуты.", "At current GPM, both item and buffer are ready before the selected minute.") },
      close: { title: t("Тайминг опаздывает ненамного", "The timing is narrowly late"), text: t("Проверь более дешёвый компонент, безопасный фарм или перенос контрольной точки.", "Consider a cheaper component, safer farm or a later decision window.") },
      "off-track": { title: t("Сборка конфликтует с окном", "The build conflicts with the window"), text: t("Полный предмет и резерв не помещаются в этот темп. Нужна другая последовательность компонентов или цель.", "The full item and buffer do not fit this pace. Change component order or objective.") }
    },
    steps: sharedSteps.dota
  },
  wow: {
    hub: "wow",
    eyebrow: t("WoW Retail · цель по ликвидному золоту", "WoW Retail · liquid-gold goal"),
    title: t("Сколько игровых часов до цели по реальному доходу", "How many play hours to the goal at effective GPH?"),
    description: t("Отдели ликвидное золото от запасов и используй доход в час после продаж, комиссий и непроданного остатка.", "Separate liquid gold from inventory and use hourly income after sales, fees and unsold stock."),
    question: t("Укладывается ли рыночный путь в мой недельный график?", "Does the market route fit my weekly schedule?"),
    payoff: t("Получишь требуемый доход в час и запас по сроку", "Get required GPH and deadline slack"),
    periodLabel: t("игровых часов до цели", "play hours to target"),
    periodShort: t("ч", "h"),
    valuePrefix: "",
    valueSuffix: t(" золота", " gold"),
    rateSuffix: t("/ч", "/h"),
    guideSlug: "wow-gold-goal-effective-gph",
    fields: [
      field("current", "Ликвидное золото", "Liquid gold", "Без непроданных предметов", "Excludes unsold inventory", 85000, 0, 1000),
      field("target", "Цена цели", "Goal cost", "Полная сумма покупки или резерва", "Full purchase or reserve amount", 250000, 0, 1000),
      field("reserve", "Оборотный капитал", "Working-capital floor", "Золото для следующего рыночного цикла", "Gold reserved for the next market cycle", 30000, 0, 1000),
      field("rate", "Эффективное золото в час", "Effective GPH", "После ликвидности, комиссии и расходов", "After liquidity, fees and costs", 14500, 0, 100),
      field("horizon", "Игровых часов до срока", "Play hours before deadline", "Реальный доступный бюджет времени", "Actual time budget available", 12, 0, 0.5)
    ],
    status: {
      funded: { title: t("Цель уже ликвидна", "The goal is already liquid"), text: t("Покупка и оборотный капитал покрыты без продажи запасов.", "The purchase and working-capital floor are covered without selling inventory.") },
      "on-track": { title: t("Рыночный путь проходит срок", "The market route clears the deadline"), text: t("Эффективного дохода в час достаточно в рамках доступного времени.", "Effective GPH is sufficient within the available play time.") },
      close: { title: t("Нужна ещё одна короткая сессия", "One short session closes the gap"), text: t("Не масштабируй запасы: сначала добери ликвидность текущим проверенным циклом.", "Do not scale inventory; close the gap with the currently validated cash cycle.") },
      "off-track": { title: t("Цель не помещается в график", "The goal does not fit the schedule"), text: t("Пересмотри эффективный доход в час, цену цели или доступные часы; не выдавай запасы за деньги.", "Revisit effective GPH, goal cost or available hours instead of counting inventory as cash.") }
    },
    steps: sharedSteps.wow
  },
  "total-war": {
    hub: "total-war",
    eyebrow: t("Total War: Warhammer III · казна до войны", "Total War: Warhammer III · treasury countdown"),
    title: t("Успеет ли казна к началу войны", "Will the treasury be ready before the war?"),
    description: t("Сложи цену подготовки и резерв второго фронта, затем сравни разрыв с чистым доходом и числом ходов до объявления войны.", "Combine preparation cost with a second-front floor, then compare the gap with net income and turns before declaration."),
    question: t("Финансирует ли текущий темп выбранный масштаб войны?", "Can current flow fund the selected war scope?"),
    payoff: t("Получишь требуемый доход за ход и запас казны", "Get required income per turn and treasury slack"),
    periodLabel: t("ходов до готовности", "turns until ready"),
    periodShort: t("ход.", "turn"),
    valuePrefix: "",
    valueSuffix: t(" золота", " gold"),
    rateSuffix: t("/ход", "/turn"),
    guideSlug: "total-war-war-chest-countdown",
    fields: [
      field("current", "Казна сейчас", "Current treasury", "Свободное золото до новых приказов", "Uncommitted gold before new orders", 6500, 0, 100),
      field("target", "Цена подготовки", "Preparation cost", "Набор, пополнение и ожидаемый дефицит", "Recruitment, replenishment and expected deficit", 8000, 0, 100),
      field("reserve", "Резерв второго фронта", "Second-front floor", "Неприкосновенный остаток после подготовки", "Untouchable cash after preparation", 2500, 0, 100),
      field("rate", "Чистый доход за ход", "Net income per turn", "После уже принятых обязательств", "After existing commitments", 1450, 0, 50),
      field("horizon", "Ходов до войны", "Turns before war", "Сколько экономических тиков осталось", "Remaining economic ticks", 4, 0, 1)
    ],
    status: {
      funded: { title: t("Подготовка уже профинансирована", "Preparation is already funded"), text: t("Казна покрывает выбранный масштаб и сохраняет второй фронт.", "The treasury covers the selected scope and preserves the second-front floor.") },
      "on-track": { title: t("Казна успевает", "The treasury is on schedule"), text: t("Текущий чистый доход закрывает подготовку до выбранного хода.", "Current net income funds preparation before the selected turn.") },
      close: { title: t("Разрыв равен примерно одному ходу", "The gap is roughly one turn"), text: t("Отложи необязательную стройку или сократи первый набор, не убирая резерв.", "Delay optional construction or trim initial recruitment without removing the reserve.") },
      "off-track": { title: t("Масштаб войны не финансируется", "The war scope is not funded"), text: t("Сократи обязательства, перенеси войну или найди подтверждённый новый поток.", "Reduce commitments, delay the war or secure a verified new income stream.") }
    },
    steps: sharedSteps["total-war"]
  },
  ck3: {
    hub: "ck3",
    eyebrow: t("Crusader Kings III · резерв перехода", "Crusader Kings III · transition runway"),
    title: t("Хватит ли золота наследнику к переходу власти", "Will the heir have enough gold at succession?"),
    description: t("Сопоставь текущую казну, резерв наследника, чистый месячный доход и рабочий горизонт до опасного перехода.", "Compare current treasury, the heir buffer, monthly net income and the working horizon before a risky transition."),
    question: t("Сохраняет ли текущий план свободу действий наследника?", "Does the current plan preserve the heir's optionality?"),
    payoff: t("Получишь требуемый доход в месяц и остаток резерва", "Get required monthly income and buffer slack"),
    periodLabel: t("месяцев до готовности", "months until ready"),
    periodShort: t("мес.", "mo"),
    valuePrefix: "",
    valueSuffix: t(" золота", " gold"),
    rateSuffix: t("/мес.", "/mo"),
    guideSlug: "ck3-succession-buffer-countdown",
    fields: [
      field("current", "Казна сейчас", "Current treasury", "Ликвидное золото правителя", "The ruler's liquid gold", 420, 0, 10),
      field("target", "Резерв наследника", "Heir buffer", "Наёмники, подарки и фракции", "Mercenaries, gifts and factions", 650, 0, 10),
      field("reserve", "Разовый кризис", "One-off crisis allowance", "Дополнительный платёж плохого сценария", "Extra payment in the adverse case", 180, 0, 10),
      field("rate", "Чистый доход в месяц", "Monthly net income", "После войск и текущих обязательств", "After troops and current commitments", 18, 0, 1),
      field("horizon", "Месяцев до перехода", "Months to transition", "Рабочий, а не предсказанный точный срок", "A working horizon, not a precise prediction", 24, 0, 1)
    ],
    status: {
      funded: { title: t("Резерв наследника уже собран", "The heir buffer is already funded"), text: t("Казна покрывает переход и дополнительный кризис без будущего дохода.", "The treasury covers transition and the extra shock without future income.") },
      "on-track": { title: t("Переход обеспечен по базовому темпу", "The transition is funded at baseline pace"), text: t("Текущий чистый доход собирает резерв в рабочем горизонте.", "Current net income builds the buffer within the working horizon.") },
      close: { title: t("Резерв почти собран", "The buffer is nearly funded"), text: t("Отложи последнюю необязательную активность и повтори жёсткий сценарий.", "Delay the last optional activity and rerun the adverse case.") },
      "off-track": { title: t("Наследник получает слишком узкий старт", "The heir inherits too little room"), text: t("Снизь текущие расходы, продли горизонт или уменьши параллельные обязательства.", "Reduce current spending, extend the horizon or remove a parallel commitment.") }
    },
    steps: sharedSteps.ck3
  }
};

export const goalPlannerList = Object.values(goalPlanners);

export function getGoalPlannerPath(id: HubPortalId, lang: HubLocale): string {
  const prefix = lang === "en" ? "/en" : "";
  return `${prefix}/${hubPortals[id].slug}/goal-planner/`;
}
