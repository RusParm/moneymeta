import { homeDecisionExamples, type HomeExampleGame } from "../data/home-decision-examples";
import { getScenarioTool, localizeScenarioPath, type ScenarioLocale } from "../data/scenario-tools";
import { calculateRunway } from "./runway";
import { calculateCraftingCashFlow } from "./wow-economy";
import { calculateReserveMetrics } from "./strategy-economy";
import { calculateBuildingWindow } from "./civilization-economy";

export interface HomeExampleMetric { label: string; value: number; display: string }
export type HomeExampleResult = { valid: false } | {
  valid: true; values: Record<string, number>; href: string;
  metrics: [HomeExampleMetric, HomeExampleMetric]; consequence: string; nextAction: string;
  state: "positive" | "caution";
};

export function homeExampleDefault(game: HomeExampleGame): number {
  const example = homeDecisionExamples[game];
  return example.fields.find((field) => field.key === example.inputKey)!.value;
}

/** Keep the consequential fixed assumptions visible before any interaction. */
export function homeExampleContext(game: HomeExampleGame, lang: ScenarioLocale): string {
  const values = Object.fromEntries(homeDecisionExamples[game].fields.map((field) => [field.key, field.value]));
  const ru = lang === "ru";
  const f = (key: string) => new Intl.NumberFormat(ru ? "ru-RU" : "en-US").format(values[key]!);
  const label = ru ? "Условный пример: " : "Illustrative case: ";
  const cases: Record<HomeExampleGame, string> = {
    gta: ru ? `на счёте ${f("current")}, покупка за ${f("target")}, запас ${f("reserve")} GTA$. Чистый доход ${f("rate")} GTA$ в неделю.` : `${f("current")} in cash, a ${f("target")} purchase, a ${f("reserve")} GTA$ reserve. Net income of ${f("rate")} GTA$ per week.`,
    wow: ru ? `${f("craft-count")} крафтов по ${f("craft-output")} предметов. Материалы ${f("craft-materials")} за крафт; цена ${f("craft-price")} золота за предмет, комиссия ${f("craft-cut")}%.` : `${f("craft-count")} crafts of ${f("craft-output")} items each. Materials cost ${f("craft-materials")} per craft; price ${f("craft-price")} gold per item, with a ${f("craft-cut")}% cut.`,
    "total-war": ru ? `казна ${f("treasury")}, найм ${f("oneOffCost")}, запас ${f("reserve")}. Каждый ход: доход ${f("incomePerPeriod")}, содержание ${f("currentOutflow")} + ${f("newOutflow")} золота.` : `${f("treasury")} treasury, ${f("oneOffCost")} recruitment, ${f("reserve")} reserve. Per turn: ${f("incomePerPeriod")} income, ${f("currentOutflow")} + ${f("newOutflow")} gold upkeep.`,
    ck3: ru ? `казна ${f("treasury")}, разовые затраты ${f("oneOffCost")}, запас ${f("reserve")}. Доход ${f("incomePerPeriod")} и мирные расходы ${f("currentOutflow")} золота в месяц; война на ${f("horizonPeriods")} месяца.` : `${f("treasury")} treasury, ${f("oneOffCost")} one-off costs, ${f("reserve")} reserve. ${f("incomePerPeriod")} income and ${f("currentOutflow")} peacetime costs monthly; a ${f("horizonPeriods")}-month war.`,
    civ7: ru ? `стоимость ${f("buildingCost")} условных единиц, строительство ${f("buildingTurns")} ходов, отдача ${f("buildingBenefit")} тех же единиц за ход после завершения.` : `${f("buildingCost")} illustrative units spent, ${f("buildingTurns")} turns to build, ${f("buildingBenefit")} of the same units per turn after completion.`
  };
  return label + cases[game];
}

/** Validate before domain functions normalize numeric inputs; blanks are not zero. */
export function calculateHomeDecisionExample(game: HomeExampleGame, raw: string | number, lang: ScenarioLocale): HomeExampleResult {
  const example = homeDecisionExamples[game];
  if (typeof raw === "string" && !raw.trim()) return { valid: false };
  const value = Number(raw);
  if (!Number.isFinite(value) || value < example.min || value > example.max
    || (example.step !== "any" && !Number.isInteger(value))) return { valid: false };
  const values = Object.fromEntries(example.fields.map((field) => [field.key, field.key === example.inputKey ? value : field.value]));
  const tool = getScenarioTool(example.toolKey)!;
  const params = new URLSearchParams(Object.entries(values).map(([key, number]) => [`${tool.key}.${key}`, String(number)]));
  const href = `${localizeScenarioPath(tool.path, lang)}?${params}#${tool.anchor}`;
  const ru = lang === "ru";
  const f = (number: number, digits = 0) => new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: digits }).format(number);
  const gold = (number: number) => `${f(number)} ${ru ? "золота" : "gold"}`;
  const signed = (number: number, digits = 0) => `${number > 0 ? "+" : ""}${f(number, digits)}`;
  const metric = (label: string, number: number, display: string): HomeExampleMetric => ({ label, value: number, display });
  const base = { valid: true as const, values, href };
  if (game === "gta") {
    const result = calculateRunway({ current: values.current!, target: values.target!, reserve: values.reserve!, rate: values.rate!, horizon: value });
    const enough = result.slack >= 0;
    return { ...base, state: enough ? "positive" : "caution", metrics: [
      metric(ru ? "На счёте к сроку" : "Cash at the deadline", result.projected, `GTA$ ${f(result.projected)}`),
      metric(ru ? "После покупки и резерва" : "After purchase and reserve", result.slack, `GTA$ ${signed(result.slack)}`)
    ], consequence: enough
      ? (ru ? `Покупка укладывается в срок. Запас GTA$ ${f(values.reserve!)} сохранится.` : `The purchase fits the deadline. The GTA$ ${f(values.reserve!)} reserve stays intact.`)
      : (ru ? `До покупки с запасом не хватает GTA$ ${f(-result.slack)}. Нужен чистый доход GTA$ ${f(Math.ceil(result.requiredRate))} в неделю.` : `You are GTA$ ${f(-result.slack)} short of buying and keeping the reserve. You need GTA$ ${f(Math.ceil(result.requiredRate))} net per week.`),
      nextAction: ru ? `При доходе из примера цель достижима за ${f(result.periods, 2)} недели. Проверь свой заработок и срок.` : `At the example's earning rate, the goal takes ${f(result.periods, 2)} weeks. Check your own income and deadline.` };
  }
  if (game === "wow") {
    const result = calculateCraftingCashFlow({ materialCostPerCraft: values["craft-materials"]!, outputUnits: values["craft-output"]!, salePricePerUnit: values["craft-price"]!, crafts: values["craft-count"]!, sellThroughPercent: value, auctionHouseCutPercent: values["craft-cut"]!, depositPerListing: values["craft-deposit"]! });
    return { ...base, state: result.cashChange >= 0 ? "positive" : "caution", metrics: [
      metric(ru ? "Прибыль партии" : "Batch profit", result.profit, `${signed(result.profit)} ${ru ? "золота" : "gold"}`),
      metric(ru ? "Изменение доступного золота" : "Change in spendable gold", result.cashChange, `${signed(result.cashChange)} ${ru ? "золота" : "gold"}`)
    ], consequence: ru ? `${gold(result.inventoryCost)} остаётся в материалах непроданного товара. Для возврата вложений нужно продать ${f(result.recoveryUnits)} из ${f(result.units)} предметов.` : `${gold(result.inventoryCost)} remains tied to the unsold items' material cost. Recovering the outlay takes ${f(result.recoveryUnits)} of ${f(result.units)} sales.`,
      nextAction: result.cashChange < 0
        ? (ru ? "Перед новой партией проверь, хватит ли свободного золота, пока эта ещё продаётся." : "Before crafting another batch, check your available gold while this one is still selling.")
        : (ru ? "Вложения вернулись при этих продажах. Перед повтором обнови цену и затраты." : "These sales recovered the outlay. Update prices and costs before repeating the batch.") };
  }
  if (game === "total-war" || game === "ck3") {
    const result = calculateReserveMetrics({ treasury: values.treasury!, incomePerPeriod: values.incomePerPeriod!, currentOutflow: values.currentOutflow!, newOutflow: values.newOutflow!, oneOffCost: values.oneOffCost!, horizonPeriods: values.horizonPeriods!, reserve: values.reserve! });
    const enough = result.buffer >= 0;
    const period = game === "total-war" ? (ru ? "ход" : "turn") : (ru ? "месяц" : "month");
    return { ...base, state: enough ? "positive" : "caution", metrics: [
      metric(ru ? "Казна у цели" : "Treasury at the objective", result.cashAtTarget, gold(result.cashAtTarget)),
      metric(ru ? "Сверх неприкосновенного запаса" : "Above the protected reserve", result.buffer, `${signed(result.buffer)} ${ru ? "золота" : "gold"}`)
    ], consequence: enough
      ? (ru ? `Запас ${gold(values.reserve!)} сохранится. Общие расходы могут составить до ${gold(Math.floor(result.maxSustainableOutflow))} за ${period}.` : `The ${gold(values.reserve!)} reserve survives. Total costs can reach ${gold(Math.floor(result.maxSustainableOutflow))} per ${period}.`)
      : (ru ? `Неприкосновенный запас уменьшится на ${gold(-result.buffer)}. Лимит всех расходов для этого срока: ${gold(Math.floor(result.maxSustainableOutflow))} за ${period}.` : `The protected reserve is short by ${gold(-result.buffer)}. Total spending for this deadline must stay within ${gold(Math.floor(result.maxSustainableOutflow))} per ${period}.`),
      nextAction: enough
        ? (ru ? "Проверь ещё один вариант с более долгой войной или меньшим доходом." : "Check another case with a longer war or lower income.")
        : (ru ? "До найма сократи содержание или пересчитай более короткий поход. Победа здесь не предполагается." : "Before recruiting, reduce upkeep or test a shorter campaign. This calculation does not assume victory.") };
  }
  const result = calculateBuildingWindow({ cost: values.buildingCost!, buildTurns: values.buildingTurns!, benefitPerTurn: values.buildingBenefit!, horizonTurns: value, confidencePercent: values.buildingConfidence! });
  return { ...base, state: result.clearsHorizon ? "positive" : "caution", metrics: [
    metric(ru ? "Отдача за вычетом затрат" : "Return after cost", result.netValue, `${signed(result.netValue)} ${ru ? "усл. ед." : "units"}`),
    metric(ru ? "Ход окупаемости от текущего" : "Turns from now to payback", result.paybackTurn!, f(result.paybackTurn!))
  ], consequence: ru ? `После строительства останется ${f(result.activeTurns)} ходов отдачи. К этому сроку постройка вернёт ${f(result.expectedReturn)} из ${f(values.buildingCost!)} затраченных единиц.` : `There are ${f(result.activeTurns)} productive turns after construction. By this deadline, the building returns ${f(result.expectedReturn)} against ${f(values.buildingCost!)} units spent.`,
    nextAction: result.clearsHorizon
      ? (ru ? "Постройка успевает окупиться по этим вводным. Сравни её с другим применением ресурсов." : "The building pays back under these assumptions. Compare it with another use of the resources.")
      : (ru ? "Если ресурсы нужны к этому сроку, сравни более быструю постройку или сохрани их для цели." : "If you need the resources by this deadline, compare a faster building or keep them for the objective.") };
}
