import { getScenarioTool, type ScenarioLocale } from "../data/scenario-tools";
import { needsRefresh, type FreshnessPolicy } from "./freshness";
import type { SavedScenario } from "./saved-scenarios";

export interface ScenarioReviewSource { policy: FreshnessPolicy; path: string; }
export interface ScenarioReview {
  needsReview: boolean;
  reasons: string[];
  checks: string[];
  sourcePath?: string;
}

/** Review metadata and assumptions only. Never rewrites a historical result. */
export function reviewScenario(record: SavedScenario, current: {
  engine: string;
  contexts: Record<string, Record<string, string>>;
  sources: Record<string, ScenarioReviewSource>;
}, lang: ScenarioLocale, asOf = new Date()): ScenarioReview {
  const ru = lang === "ru";
  const reasons: string[] = [];
  const tool = getScenarioTool(record.toolKey);
  const source = current.sources[record.toolKey];
  if (record.engineVersion !== current.engine) reasons.push(ru
    ? "Версия сайта изменилась. Повторный расчёт может отличаться; это само по себе не означает изменение игровой формулы."
    : "The site version changed. Recalculation may differ; this alone does not establish a game-formula change.");
  const context = current.contexts[record.lang]?.[record.toolKey];
  if (!record.context || context === undefined || record.context !== context) reasons.push(ru
    ? "Описание данных отличается от сохранённого или отсутствует. Сверь вводные перед повторным расчётом."
    : "The data description differs from the saved one or is missing. Review inputs before recalculating.");
  if (source && needsRefresh(source.policy, asOf)) reasons.push(ru
    ? `Срок проверки источника истёк (дата данных: ${source.policy.checkedAt.slice(0, 10)}). Повторный расчёт использует те же данные и не делает их свежими.`
    : `The source review is overdue (data date: ${source.policy.checkedAt.slice(0, 10)}). Recalculation uses the same data and does not refresh it.`);
  const pair = (r: string[], e: string[]) => ru ? r : e;
  let checks = pair(["Сверь числа с текущим состоянием игры и сохрани новый вариант для сравнения."], ["Check values against your current game and save a new variant to compare."]);
  if (tool?.game === "gta") checks = pair([
    "Проверь доступ к занятиям и бизнесам. Уже проданный запас нельзя продать ещё раз.",
    "Повтори замер выплаты и полного времени захода. Убери закончившиеся бонусы из своих чисел.",
    "Обнови бюджет, припасы и доступное время. Разовые награды учитывай отдельно от повторяемого дохода."
  ], [
    "Check activity and business access. Stock already sold cannot be sold again.",
    "Measure payout and complete-run time again. Remove expired bonuses from your inputs.",
    "Update cash, supplies and available time. Keep one-off rewards separate from repeatable income."
  ]);
  if (tool?.game === "dota") checks = record.toolKey === "dota-compare" || record.toolKey === "dota-item-plan" ? pair([
    "Сверь цены и состав выбранных предметов с магазином текущего патча.",
    "Обнови минуту матча, доступное золото и ожидаемый темп фарма.",
    "Профессиональные тайминги относятся к указанному срезу. Старую выборку нельзя считать нормой нового патча."
  ], [
    "Check selected item prices and recipes against the current patch shop.",
    "Update match minute, available gold and expected farming rate.",
    "Professional timings belong to the labelled snapshot. An older cohort is not a new-patch benchmark."
  ]) : pair([
    "Возьми текущее золото, минуту и стоимость выкупа из этого матча.",
    "Перепроверь ожидаемый фарм и время до цели. Старый темп не гарантирует будущий доход.",
    "Для Midas проверь цену, награду, перезарядку и число оставшихся применений."
  ], [
    "Use gold, minute and buyback cost from this match.",
    "Review expected farming and time to the objective. Past pace does not guarantee future income.",
    "For Midas, check price, reward, cooldown and remaining uses."
  ]);
  if (tool?.game === "wow") checks = pair([
    "Обнови цены материалов и продажи для того же предмета и качества.",
    "Сверь свободное золото и уже имеющийся товар. Непроданный запас ещё не оплатит новую партию.",
    "Проверь фактические продажи, залог и комиссии. Продажи прошлой партии не гарантируют спрос на следующую."
  ], [
    "Update material and sale prices for the same item and quality.",
    "Check available cash and existing stock. Unsold inventory cannot fund the next batch yet.",
    "Review observed sales, deposits and fees. Previous sales do not guarantee demand for the next batch."
  ]);
  if (tool?.game === "total-war" || tool?.game === "ck3") checks = pair([
    "Возьми казну, доход и содержание с текущего экрана финансов.",
    "Проверь срок войны или наследования, разовые расходы и неприкосновенный запас.",
    "Пересмотри ожидаемые изменения дохода. После найма, потери земель или смены правителя старый план может не подойти."
  ], [
    "Read treasury, income and upkeep from the current finance screen.",
    "Check the war or succession horizon, one-off costs and protected reserve.",
    "Review expected income changes. Recruitment, lost land or a new ruler may invalidate the old plan."
  ]);
  if (tool?.game === "civ7") checks = pair([
    "Сверь эпоху, поселение и оставшееся число ходов.",
    "Обнови стоимость, срок завершения и прирост ресурса из текущего города.",
    "Сравнивай один и тот же ресурс. Науку, культуру и производство нельзя складывать как равные величины."
  ], [
    "Check age, settlement and remaining turns.",
    "Update cost, completion time and resource gain from the current city.",
    "Compare the same resource. Science, culture and production are not interchangeable units."
  ]);
  return { needsReview: reasons.length > 0, reasons, checks, ...(source ? { sourcePath: source.path } : {}) };
}
