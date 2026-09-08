import type { ScenarioGame, ScenarioLocale } from "./scenario-tools";

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
  boundary: Copy;
}

// Illustrative player inputs, not measured game benchmarks or current prices.
// Full-model field names are deliberate: handoff must restore the entire case.
export const homeDecisionExamples: Record<HomeExampleGame, Example> = {
  gta: {
    toolKey: "gta-goal-runway",
    question: both("Успею накопить на покупку, сохранив запас денег?", "Can I afford the purchase on time and keep a cash reserve?"),
    inputKey: "horizon", inputLabel: both("Через сколько недель хочу купить", "Weeks until I want to buy"),
    inputHint: both("Поставь свой срок. Доход в примере условный; в полном расчёте замени его своим чистым заработком за неделю.", "Set your deadline. This example assumes a weekly income; replace it with your own net earnings in the full tool."),
    min: 1, max: 104, step: 1,
    fields: [
      { key: "current", value: 1_250_000, label: both("На счёте, GTA$", "Cash now, GTA$") },
      { key: "target", value: 4_000_000, label: both("Цена покупки, GTA$", "Purchase price, GTA$") },
      { key: "reserve", value: 250_000, label: both("Оставить после покупки, GTA$", "Keep after buying, GTA$") },
      { key: "rate", value: 650_000, label: both("Условный чистый доход в неделю, GTA$", "Assumed net weekly income, GTA$") },
      { key: "horizon", value: 4, label: both("Срок, недель", "Deadline, weeks") }
    ],
    boundary: both("Это пример с постоянным доходом. Он не учитывает бонусы недели и не обещает такой заработок.", "This example assumes constant income. It does not include weekly bonuses or promise this earning rate.")
  },
  wow: {
    toolKey: "wow-crafting",
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
    toolKey: "civ7-building",
    question: both("Успеет постройка окупиться до нужного хода?", "Will the building pay back before my deadline?"),
    inputKey: "buildingHorizon", inputLabel: both("Сколько ходов осталось до цели", "Turns left until the objective"),
    inputHint: both("Выбери срок, до которого тебе нужна отдача. Стоимость и пользу в примере сравниваем в одних условных единицах.", "Set the deadline by which you need the return. This example compares cost and benefit in the same illustrative units."),
    min: 0, max: 500, step: 1,
    fields: [
      { key: "buildingCost", value: 600, label: both("Стоимость, условных единиц", "Cost, illustrative units") },
      { key: "buildingTurns", value: 5, label: both("Строительство, ходов", "Build time, turns") },
      { key: "buildingBenefit", value: 40, label: both("Польза за ход в тех же единицах", "Benefit per turn in the same units") },
      { key: "buildingHorizon", value: 18, label: both("До цели, ходов", "Turns until the objective") },
      { key: "buildingConfidence", value: 100, label: both("Учтённая доля пользы, %", "Share of benefit included, %") }
    ],
    boundary: both("Условное сравнение, не цена конкретной постройки. Разные ресурсы нельзя складывать без собственной оценки их ценности. Отдача начинается после завершения строительства.", "Illustrative comparison, not a named building's price. Different resources cannot be added without your own valuation. Benefits start after construction finishes.")
  }
};

export const homeDotaEvidence = {
  matchId: "8978544633", slot: "0", role: "core", checkedAt: "2026-09-08",
  startMinute: 25, endMinute: 28, hero: "Necrophos", opponent: "Meepo",
  heroGold: 2373, opponentGold: 4082, gapChange: -1709
} as const;
