import type { CivilizationComparisonInput, CivilizationComparisonResult, CivilizationYield } from "./civ-comparison";

export const civilizationComparisonCopy = (lang: "ru" | "en") => lang === "ru" ? {
  kicker: "ДВА ВАРИАНТА · ОДИН РЕСУРС",
  title: "Что даст больше к нужному ходу?",
  intro: "Возьми стоимость и срок двух построек из своей партии. Сравни их прирост одного ресурса. Золото, наука и культура остаются в своих единицах; переводить их в производство не нужно.",
  example: "Вводные ниже условные. Подставь два доступных тебе варианта.",
  unit: "Какой ресурс сравниваем",
  horizon: "Срок от текущего хода",
  a: "Вариант A", b: "Вариант B",
  cost: "Стоимость в производстве",
  turns: "До завершения, ходов",
  yield: "Прирост выбранного ресурса за ход",
  inputHelp: "Укажи прирост от постройки, а не весь доход поселения. Включи известные бонусы и содержание в этом же ресурсе. Обе постройки рассматриваются отдельно, как следующий выбор.",
  result: "Сравнение к выбранному сроку",
  outputA: "A: накопленный прирост", outputB: "B: накопленный прирост",
  costA: "A: затраты производства", costB: "B: затраты производства",
  invalid: "Заполни все поля допустимыми числами. Сроки укажи целыми ходами. Пока вводные неполные, сравнение не рассчитывается.",
  path: "Как меняется преимущество по ходам",
  turn: "Ход от текущего", pathA: "Прирост A", pathB: "Прирост B",
  paybackTitle: "Возврат производства",
  delayTitle: "Если стройка задержится",
  delayHelp: "Меняется только срок завершения одного варианта. Прирост, затраты, второй вариант и контрольный ход остаются прежними.",
  paybackNote: "Здесь стоимость и прирост выражены в производстве, поэтому их можно вычесть. Для сравнения вычитается полная стоимость постройки. Больше произведённого не всегда означает больше после затрат.",
  netA: "A: после затрат", netB: "B: после затрат", paybackA: "A: вернёт затраты на ходу", paybackB: "B: вернёт затраты на ходу",
  noPayback: "не возвращает при этих вводных",
  unavailablePayback: "за пределами расчётного диапазона",
  boundary: "Модель считает постоянный прирост начиная с первого хода после завершения. Она не оценивает другие ресурсы, доступность постройки, смену эпохи, рост города или потерянную возможность построить что-то ещё. Более дорогой вариант оставляет меньше производства на другие задачи."
} : {
  kicker: "TWO CHOICES · ONE RESOURCE",
  title: "Which gives more by your target turn?",
  intro: "Take the cost and completion time of two buildings from your game. Compare their gain in one resource. Gold, Science and Culture keep their own units; no conversion to production is needed.",
  example: "These inputs are illustrative. Replace them with two choices available in your game.",
  unit: "Resource to compare",
  horizon: "Turns from now",
  a: "Choice A", b: "Choice B",
  cost: "Production cost",
  turns: "Turns until completion",
  yield: "Added resource per turn",
  inputHelp: "Enter the building's added yield, not the settlement's total. Include known bonuses and upkeep in that same resource. Each building is considered separately as your next choice.",
  result: "Comparison at your checkpoint",
  outputA: "A: cumulative added yield", outputB: "B: cumulative added yield",
  costA: "A: production committed", costB: "B: production committed",
  invalid: "Complete every field with valid numbers. Use whole turns for timing. The comparison is unavailable while inputs are incomplete.",
  path: "How the lead changes over time",
  turn: "Turns from now", pathA: "Added yield A", pathB: "Added yield B",
  paybackTitle: "Production payback",
  delayTitle: "If construction takes longer",
  delayHelp: "Only one choice's completion time changes. Yield, cost, the other choice and your checkpoint stay the same.",
  paybackNote: "Cost and yield both use production here, so they can be subtracted. The comparison deducts the full building cost. More production earned does not always mean more after costs.",
  netA: "A: after cost", netB: "B: after cost", paybackA: "A: recovers cost on turn", paybackB: "B: recovers cost on turn",
  noPayback: "not recovered at these inputs",
  unavailablePayback: "outside the calculation range",
  boundary: "The model counts a constant added yield from the first turn after completion. It does not value other resources, building availability, an Age transition, city growth or the missed opportunity to build something else. The more expensive choice leaves less production for other tasks."
};

export const civilizationYieldNames = (lang: "ru" | "en"): Record<CivilizationYield, string> => lang === "ru"
  ? { production: "Производство", gold: "Золото", science: "Наука", culture: "Культура" }
  : { production: "Production", gold: "Gold", science: "Science", culture: "Culture" };

export function presentCivilizationComparison(input: CivilizationComparisonInput, value: CivilizationComparisonResult, lang: "ru" | "en") {
  const ru = lang === "ru";
  const format = new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: 3 });
  const number = (n: number) => format.format(n);
  const resource = civilizationYieldNames(lang)[value.unit].toLocaleLowerCase(ru ? "ru-RU" : "en-US");
  const outputA = `${number(value.a.totalYield)} · ${resource}`;
  const outputB = `${number(value.b.totalYield)} · ${resource}`;
  const title = value.leader === "tie"
    ? ru ? `К ходу ${number(value.horizonTurns)} накопленный прирост одинаков` : `Cumulative yield is tied at turn ${number(value.horizonTurns)}`
    : ru ? `К ходу ${number(value.horizonTurns)} накопленный прирост выше у ${value.leader.toUpperCase()}` : `Choice ${value.leader.toUpperCase()} has more cumulative yield by turn ${number(value.horizonTurns)}`;
  let tradeoff = "";
  let condition = "";
  if (value.leader !== "tie") {
    const winner = value.leader;
    const loser = winner === "a" ? "b" : "a";
    const costDifference = input[winner].productionCost - input[loser].productionCost;
    tradeoff = ru
      ? `Прирост выше на ${number(Math.abs(value.yieldDifference))} (${resource}). ${costDifference === 0 ? "Затраты производства одинаковы." : `При этом вариант ${winner.toUpperCase()} требует на ${number(Math.abs(costDifference))} производства ${costDifference > 0 ? "больше" : "меньше"}.`}`
      : `Added yield is ${number(Math.abs(value.yieldDifference))} higher (${resource}). ${costDifference === 0 ? "Production costs are equal." : `Choice ${winner.toUpperCase()} commits ${number(Math.abs(costDifference))} ${costDifference > 0 ? "more" : "less"} production.`}`;
    const threshold = value[loser].yieldToTieOther;
    if (threshold === null) {
      condition = ru ? `Вариант ${loser.toUpperCase()} ещё не даёт прироста к сроку. Чтобы изменить сравнение, сократи срок его завершения или отодвинь контрольный ход.`
        : `Choice ${loser.toUpperCase()} has not started earning by the checkpoint. An earlier completion or a later checkpoint could change the comparison.`;
    } else {
      // Show an attainable, strictly higher rate on a 0.001 grid, never a rounded-down tie threshold.
      const overtakingYield = (Math.floor(threshold * 1000) + 1) / 1000;
      condition = overtakingYield > 100000
        ? ru ? `Вариант ${loser.toUpperCase()} не успевает обогнать другой в допустимом диапазоне прироста. Проверь более раннее завершение или другой контрольный срок.`
          : `Choice ${loser.toUpperCase()} cannot overtake within the supported yield range. Check an earlier completion or a different checkpoint.`
        : ru ? `При приросте ${number(overtakingYield)} (${resource}) за ход вариант ${loser.toUpperCase()} уже даст больше к этому сроку. Срок завершения и остальные вводные остаются прежними.`
        : `At ${number(overtakingYield)} added ${resource} per turn, choice ${loser.toUpperCase()} would give more by this checkpoint, with completion time and all other inputs unchanged.`;
    }
  } else {
    tradeoff = ru ? "При равном приросте сравни затраты производства и другие полезные эффекты в своей партии."
      : "With equal added yield, compare production costs and the other useful effects in your game.";
    condition = value.a.activeTurns === 0 && value.b.activeTurns === 0
      ? ru ? "Оба варианта начнут давать прирост позже выбранного срока." : "Both choices start earning after your selected checkpoint."
      : ru ? "Разный прирост за ход или другой срок может изменить равенство. Более низкая цена сама по себе не увеличивает выбранный ресурс." : "A different yield rate or checkpoint may break the tie. A lower cost does not itself increase the selected resource.";
  }
  const crossover = value.crossover
    ? ru ? `Сначала впереди ${value.crossover.from.toUpperCase()}. Вариант ${value.crossover.to.toUpperCase()} впервые обгонит его на ходу ${number(value.crossover.firstLeadTurn)}${value.crossover.firstLeadTurn > value.horizonTurns ? ", уже после твоего срока" : ""}.`
      : `${value.crossover.from.toUpperCase()} leads first. Choice ${value.crossover.to.toUpperCase()} first overtakes it on turn ${number(value.crossover.firstLeadTurn)}${value.crossover.firstLeadTurn > value.horizonTurns ? ", after your checkpoint" : ""}.`
    : value.crossoverUnavailable
      ? ru ? "Смена лидера находится за пределами расчётного диапазона. Точный ход не указан." : "The reversal lies outside the calculation range. No exact turn is shown."
    : ru ? "При постоянных вводных смены установившегося лидера нет. Начальные ходы с нулевым приростом не считаются сменой лидера."
      : "With constant inputs there is no later reversal of an established lead. Initial turns with zero yield are not a lead change.";
  const slack = value.completionSlack;
  let delayCondition = ru ? "Сейчас накопленный прирост одинаков. Запас задержки для лидера не рассчитывается, пока нет преимущества одного варианта."
    : "Cumulative yield is tied. A leader's delay allowance is unavailable until one choice is ahead.";
  let delayNext = "";
  let delayButton = "";
  if (slack) {
    const choice = slack.choice.toUpperCase();
    const other = slack.choice === "a" ? "B" : "A";
    delayCondition = ru
      ? `${slack.next ? slack.extraTurns > 0 ? `Запас по сроку для ${choice}: ${number(slack.extraTurns)} ход.` : `У ${choice} нет запаса на задержку.` : `Вариант ${choice} сохраняет преимущество даже при самом позднем доступном сроке.`} При завершении через ${number(slack.latestCompletionTurn)} ход. он даст ${number(slack.outputAtBoundary)} (${resource}) против ${number(slack.otherOutput)} у ${other} к ходу ${number(value.horizonTurns)}.`
      : `${slack.next ? slack.extraTurns > 0 ? `Choice ${choice} has ${number(slack.extraTurns)} turns of delay allowance.` : `Choice ${choice} has no room for a delay.` : `Choice ${choice} still leads at the latest supported completion time.`} Finishing in ${number(slack.latestCompletionTurn)} turns gives ${number(slack.outputAtBoundary)} ${resource}, compared with ${number(slack.otherOutput)} from ${other} at turn ${number(value.horizonTurns)}.`;
    if (slack.next) {
      delayNext = ru
        ? `Если ${choice} завершится через ${number(slack.next.completionTurn)} ход., он даст ${number(slack.next.output)} (${resource}). ${slack.next.leader === "tie" ? "Накопленный прирост будет одинаков." : `Впереди будет ${other} с приростом ${number(slack.otherOutput)}.`}`
        : `If ${choice} finishes in ${number(slack.next.completionTurn)} turns, it gives ${number(slack.next.output)} ${resource}. ${slack.next.leader === "tie" ? "Cumulative yield is tied." : `${other} leads with ${number(slack.otherOutput)}.`}`;
      delayButton = ru ? `Проверить завершение ${choice} через ${number(slack.next.completionTurn)} ход.`
        : `Check ${choice} finishing in ${number(slack.next.completionTurn)} turns`;
    } else {
      delayNext = ru ? "В пределах доступных сроков завершения до 200 ходов лидер не меняется. За этой границей задержка не проверялась."
        : "The leader does not change within the supported completion times up to 200 turns. Delays beyond this range were not checked.";
    }
  }
  return { title, tradeoff, condition, crossover, outputA, outputB, number, delayCondition, delayNext, delayButton };
}
