import { homeDecisionExamples, type HomeExampleGame } from "../data/home-decision-examples";
import { getScenarioTool, localizeScenarioPath, type ScenarioLocale } from "../data/scenario-tools";
import { gtaSessionExample } from "../data/gta-session-example";
import { gtaSessionCopy } from "../data/gta-session-copy";
import { calculateGtaSession } from "./gta-session";
import { calculateCraftingCashFlow } from "./wow-economy";
import { calculateReserveMetrics } from "./strategy-economy";
import { calculateCivilizationComparison } from "./civ-comparison";

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
    gta: ru ? `готовый товар принесёт GTA$ ${f("s0-cash")} за ${f("s0-duration")} минут, один раз. Миссия: GTA$ ${f("s1-cash")} за ${f("s1-duration")} минут, до ${f("s1-runs")} заходов. Дополнительно ${f("s0-entry")} минут на вход в продажу и ${f("s1-entry")} на вход в миссии.` : `ready stock brings GTA$ ${f("s0-cash")} in ${f("s0-duration")} minutes, once. A mission brings GTA$ ${f("s1-cash")} in ${f("s1-duration")} minutes, up to ${f("s1-runs")} runs. Add ${f("s0-entry")} minutes to enter the sale and ${f("s1-entry")} to enter missions.`,
    wow: ru ? `${f("craft-count")} крафтов по ${f("craft-output")} предметов. Материалы ${f("craft-materials")} за крафт; цена ${f("craft-price")} золота за предмет, комиссия ${f("craft-cut")}%.` : `${f("craft-count")} crafts of ${f("craft-output")} items each. Materials cost ${f("craft-materials")} per craft; price ${f("craft-price")} gold per item, with a ${f("craft-cut")}% cut.`,
    "total-war": ru ? `казна ${f("treasury")}, найм ${f("oneOffCost")}, запас ${f("reserve")}. Каждый ход: доход ${f("incomePerPeriod")}, содержание ${f("currentOutflow")} + ${f("newOutflow")} золота.` : `${f("treasury")} treasury, ${f("oneOffCost")} recruitment, ${f("reserve")} reserve. Per turn: ${f("incomePerPeriod")} income, ${f("currentOutflow")} + ${f("newOutflow")} gold upkeep.`,
    ck3: ru ? `казна ${f("treasury")}, разовые затраты ${f("oneOffCost")}, запас ${f("reserve")}. Доход ${f("incomePerPeriod")} и мирные расходы ${f("currentOutflow")} золота в месяц; война на ${f("horizonPeriods")} месяца.` : `${f("treasury")} treasury, ${f("oneOffCost")} one-off costs, ${f("reserve")} reserve. ${f("incomePerPeriod")} income and ${f("currentOutflow")} peacetime costs monthly; a ${f("horizonPeriods")}-month war.`,
    civ7: ru ? `A: ${f("comparisonCostA")} производства, ${f("comparisonTurnsA")} хода, затем +${f("comparisonYieldA")} науки за ход. B: ${f("comparisonCostB")} производства, ${f("comparisonTurnsB")} ходов, затем +${f("comparisonYieldB")} науки за ход.` : `A: ${f("comparisonCostA")} production, ${f("comparisonTurnsA")} build turns, then +${f("comparisonYieldA")} science per turn. B: ${f("comparisonCostB")} production, ${f("comparisonTurnsB")} build turns, then +${f("comparisonYieldB")} science per turn.`
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
  Object.entries(example.fixedParameters ?? {}).forEach(([key, parameter]) => params.set(`${tool.key}.${key}`, parameter));
  const href = `${localizeScenarioPath(tool.path, lang)}?${params}#${tool.anchor}`;
  const ru = lang === "ru";
  const f = (number: number, digits = 0) => new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: digits }).format(number);
  const gold = (number: number) => `${f(number)} ${ru ? "золота" : "gold"}`;
  const signed = (number: number, digits = 0) => `${number > 0 ? "+" : ""}${f(number, digits)}`;
  const metric = (label: string, number: number, display: string): HomeExampleMetric => ({ label, value: number, display });
  const base = { valid: true as const, values, href };
  if (game === "gta") {
    const result = calculateGtaSession({ minutesAvailable: value,
      sources: gtaSessionExample.sources.slice(0, values.sources).map((source, i) => ({ ...source,
        cashPerRun: values[`s${i}-cash`]!, minutesPerRun: values[`s${i}-duration`]!,
        entryMinutes: values[`s${i}-entry`]!, maxRuns: values[`s${i}-runs`]!
      })) });
    if (!result) return { valid: false };
    const blocks = result.best.blocks.map((block) =>
      `${gtaSessionCopy[lang].kinds[gtaSessionExample.sources[block.sourceIndex]!.kind]} × ${block.runs}`
    ).join(" + ");
    return { ...base, state: result.status === "no-positive-fit" ? "caution" : "positive", metrics: [
      metric(ru ? "Максимум поступлений в примере" : "Highest cash receipts in this case", result.best.cash, `GTA$ ${f(result.best.cash)}`),
      metric(ru ? "Если выбрать одно занятие" : "If you choose one activity", result.solo.cash, `GTA$ ${f(result.solo.cash)}`)
    ], consequence: result.status === "no-positive-fit"
      ? (ru ? "За это время ни один полный заход с дорогой не помещается. Незавершённые заходы не приносят расчётной выплаты." : "No complete run including travel fits this session. Unfinished runs add no modeled receipts.")
      : `${blocks}. ` + (ru ? `Занято ${f(result.best.usedMinutes)} минут, свободно ${f(result.best.unusedMinutes)}.` : `Uses ${f(result.best.usedMinutes)} minutes, leaves ${f(result.best.unusedMinutes)} free.`),
      nextAction: result.gainOverSolo > 0
        ? (ru ? `Сочетание даёт на GTA$ ${f(result.gainOverSolo)} больше одного занятия. В полном плане проверь готовность товара, свои выплаты и время.` : `The mix brings GTA$ ${f(result.gainOverSolo)} more than a single activity. Check your stock readiness, receipts and durations in the full plan.`)
        : (ru ? "В полном плане укажи доступные тебе занятия. Свободные минуты не превращаются в дополнительную выплату." : "Enter the activities you can actually run in the full plan. Spare minutes do not become extra receipts.") };
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
  const result = calculateCivilizationComparison({ unit: "science", horizonTurns: value,
    a: { productionCost: values.comparisonCostA!, buildTurns: values.comparisonTurnsA!, yieldPerTurn: values.comparisonYieldA! },
    b: { productionCost: values.comparisonCostB!, buildTurns: values.comparisonTurnsB!, yieldPerTurn: values.comparisonYieldB! }
  });
  if (!result) return { valid: false };
  const lead = result.leader === "tie"
    ? (ru ? "К этому сроку оба варианта дадут одинаковое количество науки." : "Both options deliver the same science by this deadline.")
    : (ru ? `Вариант ${result.leader.toUpperCase()} даст на ${f(Math.abs(result.yieldDifference))} науки больше.` : `Option ${result.leader.toUpperCase()} delivers ${f(Math.abs(result.yieldDifference))} more science.`);
  return { ...base, state: result.leader === "tie" ? "caution" : "positive", metrics: [
    metric(ru ? "Наука от варианта A" : "Science from option A", result.a.totalYield, f(result.a.totalYield)),
    metric(ru ? "Наука от варианта B" : "Science from option B", result.b.totalYield, f(result.b.totalYield))
  ], consequence: lead + (ru ? ` При этом B требует на ${f(-result.productionCostDifference)} производства больше.` : ` B also commits ${f(-result.productionCostDifference)} more production.`),
    nextAction: ru ? `B обгоняет A по накопленной науке с ${f(result.crossover!.firstLeadTurn)}-го хода. Для короткого срока проверь более быструю постройку; другие эффекты сравни отдельно.` : `B overtakes A in cumulative science from turn ${f(result.crossover!.firstLeadTurn)}. For a short deadline, check the faster build; compare other effects separately.` };
}
