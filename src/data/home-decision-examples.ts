import type { ScenarioGame, ScenarioLocale } from "./scenario-tools";
import { civilizationComparisonExample as civExample } from "./civ-comparison";
import { gtaSessionExample } from "./gta-session-example";
import { GTA_SESSION_MAX_MINUTES } from "../lib/gta-session";

export type HomeExampleGame = Exclude<ScenarioGame, "dota">;
type Copy = Record<ScenarioLocale, string>;
const both = (ru: string, en: string): Copy => ({ ru, en });
type Field = { key: string; value: number; label: Copy };
interface Example {
  toolKey: string;
  question: Copy;
  inputKey: string;
  inputLabel: Copy;
  inputHint: Copy;
  min: number;
  max: number;
  step: number | "any";
  fields: Field[];
  fixedParameters?: Record<string, string>;
  boundary: Copy;
}

// Illustrative player inputs, not measured game benchmarks or current prices.
// Full-model field names are deliberate: handoff must restore the entire case.
export const homeDecisionExamples: Record<HomeExampleGame, Example> = {
  gta: {
    toolKey: "gta-session",
    question: both("Что успеть за сегодняшний сеанс?", "What fits into today's session?"),
    inputKey: "minutes", inputLabel: both("Сколько минут есть на игру", "Minutes available to play"),
    inputHint: both("Попробуй 60 и 75 минут: при этих вводных меняется выбор занятий. Свои выплаты и время можно указать в полном расчёте.", "Try 60 and 75 minutes: these assumptions change which activities fit. Enter your own receipts and durations in the full planner."),
    min: 0, max: GTA_SESSION_MAX_MINUTES, step: 1,
    fields: [
      { key: "minutes", value: gtaSessionExample.minutes, label: both("Время на игру, минут", "Session time, minutes") },
      { key: "sources", value: gtaSessionExample.sourceCount, label: both("Доступных занятий", "Available activities") },
      ...gtaSessionExample.sources.slice(0, gtaSessionExample.sourceCount).flatMap((source, i) => {
        const name = i === 0 ? both("Продажа готового товара", "Ready-stock sale") : both("Миссия", "Mission");
        return [
          { key: `s${i}-cash`, value: source.cashPerRun, label: both(`${name.ru}: поступление, GTA$`, `${name.en}: cash receipt, GTA$`) },
          { key: `s${i}-duration`, value: source.minutesPerRun, label: both(`${name.ru}: один заход, минут`, `${name.en}: one run, minutes`) },
          { key: `s${i}-entry`, value: source.entryMinutes, label: both(`${name.ru}: дорога и вход, минут`, `${name.en}: travel and entry, minutes`) },
          { key: `s${i}-runs`, value: source.maxRuns, label: both(`${name.ru}: доступно заходов`, `${name.en}: available runs`) }
        ];
      })
    ],
    fixedParameters: Object.fromEntries(gtaSessionExample.sources.flatMap((source, i) => [
      [`s${i}-kind`, source.kind], [`s${i}-available`, source.available ? "yes" : "no"],
      ...(i < gtaSessionExample.sourceCount ? [] : [
        [`s${i}-cash`, String(source.cashPerRun)], [`s${i}-duration`, String(source.minutesPerRun)],
        [`s${i}-entry`, String(source.entryMinutes)], [`s${i}-runs`, String(source.maxRuns)]
      ])
    ])),
    boundary: both("Условные выплаты, не данные конкретных миссий. Товар уже готов и продаётся один раз; миссия доступна до четырёх раз. Считаются только завершённые заходы, дорога и вход один раз для каждого занятия. Поступления от старого запаса не равны прибыли. Производство, ожидание и бонусы недели не моделируются.", "Illustrative receipts, not payouts for named missions. Stock is already ready and sells once; the mission is available up to four times. Only complete runs count, with travel and entry charged once per activity. Selling existing stock is not the same as profit. Production, waiting and weekly bonuses are not modeled.")
  },
  wow: {
    toolKey: "wow-crafting",
    fixedParameters: { "craft-sales-mode": "percent", "craft-wallet": "25000", "craft-reserve": "5000", "craft-sales-cap": "70", "craft-existing-stock": "0" },
    question: both("Сколько золота вернётся от продажи партии?", "How much gold comes back from selling this batch?"),
    inputKey: "craft-sellthrough", inputLabel: both("Продано из партии, %", "Share of the batch sold, %"),
    inputHint: both("Возьми долю продаж завершённой партии из почты или журнала аукциона. Для будущей партии это только предположение.", "Use a completed batch's sales from your mail or auction log. For the next batch, this is only an assumption."),
    min: 0, max: 100, step: "any",
    fields: [
      { key: "craft-materials", value: 825, label: both("Материалы на один крафт, золото", "Materials per craft, gold") },
      { key: "craft-output", value: 5, label: both("Предметов за крафт", "Items per craft") },
      { key: "craft-price", value: 225, label: both("Цена одного предмета, золото", "Price per item, gold") },
      { key: "craft-count", value: 20, label: both("Число крафтов", "Craft count") },
      { key: "craft-sellthrough", value: 70, label: both("Продано, %", "Sold, %") },
      { key: "craft-cut", value: 5, label: both("Комиссия, %", "Auction cut, %") },
      { key: "craft-deposit", value: 12, label: both("Залог на выход одного крафта, золото", "Deposit per craft's output, gold") }
    ],
    boundary: both("Условная партия, один цикл выставления. Непроданные предметы оценены по затратам на материалы; это не доступное золото. Залог распределён пропорционально продажам.", "Illustrative batch, one listing cycle. Unsold items retain material cost; they are not spendable gold. Deposits are allocated proportionally to sales.")
  },
  "total-war": {
    toolKey: "total-war-war-reserve",
    fixedParameters: { actionDelayPeriods: "1", incomeChangePeriod: "0", incomeChange: "0" },
    question: both("Хватит казны содержать новую армию до цели?", "Can my treasury support the new army until the objective?"),
    inputKey: "horizonPeriods", inputLabel: both("Сколько ходов займёт поход", "Turns the campaign will take"),
    inputHint: both("Считай весь путь до цели и возможную осаду. В полном расчёте подставь казну и содержание с экрана финансов.", "Include travel and a possible siege. In the full tool, use treasury and upkeep figures from your finance screen."),
    min: 1, max: 100, step: 1,
    fields: [
      { key: "treasury", value: 12000, label: both("Казна", "Treasury") },
      { key: "incomePerPeriod", value: 3500, label: both("Доход за ход", "Income per turn") },
      { key: "currentOutflow", value: 2300, label: both("Текущее содержание за ход", "Current upkeep per turn") },
      { key: "newOutflow", value: 1900, label: both("Новая армия за ход", "New army per turn") },
      { key: "oneOffCost", value: 4500, label: both("Разовый найм", "One-off recruitment") },
      { key: "horizonPeriods", value: 8, label: both("Поход, ходов", "Campaign, turns") },
      { key: "reserve", value: 3000, label: both("Неприкосновенный запас", "Protected reserve") }
    ],
    boundary: both("Условная казна и постоянные доходы и расходы. Добыча, потери поселений и победа в войне не предполагаются.", "Illustrative treasury with constant income and costs. Loot, lost settlements and a military victory are not assumed.")
  },
  ck3: {
    toolKey: "ck3-war-chest",
    fixedParameters: { actionDelayPeriods: "1", incomeChangePeriod: "0", incomeChange: "0" },
    question: both("Хватит золота на затяжную войну?", "Can I fund a long war?"),
    inputKey: "newOutflow", inputLabel: both("Дополнительные расходы на войну, золото в месяц", "Extra wartime costs, gold per month"),
    inputHint: both("Сравни расходы при поднятой и распущенной армии. В полном расчёте можно изменить срок войны и разовые затраты.", "Compare spending with your armies raised and disbanded. The full tool also lets you change war duration and one-off costs."),
    min: 0, max: 1000, step: 1,
    fields: [
      { key: "treasury", value: 900, label: both("Казна", "Treasury") },
      { key: "incomePerPeriod", value: 22, label: both("Доход в месяц", "Income per month") },
      { key: "currentOutflow", value: 8, label: both("Мирные расходы в месяц", "Peacetime costs per month") },
      { key: "newOutflow", value: 38, label: both("Военные расходы сверх мирных в месяц", "Extra wartime costs per month") },
      { key: "oneOffCost", value: 150, label: both("Разовые затраты", "One-off costs") },
      { key: "horizonPeriods", value: 24, label: both("Война, месяцев", "War duration, months") },
      { key: "reserve", value: 250, label: both("Оставить на случай кризиса", "Keep for an emergency") }
    ],
    boundary: both("Условная война на 24 месяца. Доход и содержание постоянны; выкуп пленных и другие случайные поступления не заложены.", "Illustrative 24-month war. Income and upkeep stay constant; ransoms and other uncertain proceeds are excluded.")
  },
  civ7: {
    toolKey: "civ7-comparison",
    question: both("Какая постройка даст больше науки к нужному ходу?", "Which building gives more science before the deadline?"),
    inputKey: "comparisonHorizon", inputLabel: both("Сколько ходов осталось до цели", "Turns left until the objective"),
    inputHint: both("Сравни короткий и длинный срок. В полном расчёте подставь стоимость, время строительства и прирост выбранного ресурса из своей партии.", "Compare a short and a long deadline. In the full tool, enter production costs, build times and one resource's extra yield from your game."),
    min: 0, max: 500, step: 1,
    fixedParameters: { comparisonUnit: civExample.unit },
    fields: [
      { key: "comparisonCostA", value: civExample.a.productionCost, label: both("Вариант A: стоимость, производство", "Option A: production cost") },
      { key: "comparisonTurnsA", value: civExample.a.buildTurns, label: both("Вариант A: строительство, ходов", "Option A: build turns") },
      { key: "comparisonYieldA", value: civExample.a.yieldPerTurn, label: both("Вариант A: прирост науки за ход", "Option A: extra science per turn") },
      { key: "comparisonCostB", value: civExample.b.productionCost, label: both("Вариант B: стоимость, производство", "Option B: production cost") },
      { key: "comparisonTurnsB", value: civExample.b.buildTurns, label: both("Вариант B: строительство, ходов", "Option B: build turns") },
      { key: "comparisonYieldB", value: civExample.b.yieldPerTurn, label: both("Вариант B: прирост науки за ход", "Option B: extra science per turn") },
      { key: "comparisonHorizon", value: civExample.horizonTurns, label: both("До цели, ходов", "Turns until the objective") }
    ],
    boundary: both("Два условных варианта, начатых сейчас, с постоянной отдачей после завершения. Сравнивается только наука. Затраты производства показаны отдельно и из науки не вычитаются. Другие эффекты и строительство следующего объекта здесь не учтены.", "Two illustrative alternatives started now, with constant output after completion. Only science is compared. Production costs stay separate and are not deducted from science. Other effects and the next construction project are excluded.")
  }
};

export const homeDotaEvidence = {
  matchId: "8978544633", slot: "0", role: "core", checkedAt: "2026-09-08",
  startMinute: 25, endMinute: 28, hero: "Necrophos", opponent: "Meepo",
  heroGold: 2373, opponentGold: 4082, gapChange: -1709
} as const;
