import type { ReserveScenario } from "./strategy-economy";

export const strategyMoneyLimit = 1_000_000_000_000;

/** A conditional budget, not a prediction of campaign events or inheritance. */
export interface ReserveDecisionScenario extends ReserveScenario {
  /** Pay after this many periods; added upkeep starts in the following period. */
  actionDelayPeriods?: number;
  /** 0 disables the income change. Otherwise it applies to this period's flow. */
  incomeChangePeriod?: number;
  /** Signed change to gross income; identical in all three alternatives. */
  incomeChange?: number;
}

export interface ReserveCashPath {
  cashAtTarget: number;
  lowestCash: number;
  firstBreachPeriod: number | null;
}

export interface ReserveDecision {
  now: ReserveCashPath;
  later: ReserveCashPath;
  keep: ReserveCashPath;
  points: Array<{ period: number; now: number; later: number; keep: number }>;
  /** null means even zero added upkeep cannot preserve the reserve. */
  maxAddedOutflow: number | null;
  /** Extra initial cash needed to preserve the reserve at every checkpoint. */
  extraTreasuryNeeded: number;
  delayPeriods: number;
  incomeChangePeriod: number;
  /** Income changes from period 1; the separately entered future change stays in place.
   * null means the immediate payment already breaches the reserve. */
  incomeThreshold: {
    minimumIncome: number;
    adjustment: number;
    limitingPeriod: number;
    /** Rounded upward and checked against every cash checkpoint; null if outside input limits. */
    incomeToApply: number | null;
  } | null;
}

const below = (cash: number, reserve: number) => cash < reserve - 1e-8;

export function calculateReserveDecision(input: ReserveDecisionScenario): ReserveDecision | null {
  const delay = input.actionDelayPeriods ?? 1;
  const changePeriod = input.incomeChangePeriod ?? 0;
  const change = input.incomeChange ?? 0;
  const periods = input.horizonPeriods;
  if (![input.treasury, input.incomePerPeriod, input.currentOutflow, input.newOutflow,
    input.oneOffCost, periods, input.reserve, delay, changePeriod, change].every(Number.isFinite)) return null;
  if ([input.treasury, input.incomePerPeriod, input.currentOutflow, input.newOutflow,
    input.oneOffCost, input.reserve, change].some((n) => Math.abs(n) > strategyMoneyLimit)) return null;
  if ([input.treasury, input.currentOutflow, input.newOutflow, input.oneOffCost, input.reserve].some((n) => n < 0)) return null;
  if (![periods, delay, changePeriod].every((n) => Number.isInteger(n) && n >= 0 && n <= 600) || periods < 1) return null;

  let now = input.treasury - input.oneOffCost;
  let later = input.treasury - (delay === 0 ? input.oneOffCost : 0);
  let keep = input.treasury;
  const points: ReserveDecision["points"] = [{ period: 0, now, later, keep }];
  // For every period p, added upkeep x must satisfy:
  // treasury - cost + cumulative existing net flow - p*x >= reserve.
  let affordable = below(now, input.reserve) ? null : Number.POSITIVE_INFINITY;
  for (let period = 1; period <= periods; period += 1) {
    const income = input.incomePerPeriod + (changePeriod > 0 && period >= changePeriod ? change : 0);
    const existingFlow = income - input.currentOutflow;
    keep += existingFlow;
    now += existingFlow - input.newOutflow;
    later += existingFlow - (period > delay ? input.newOutflow : 0);
    if (period === delay) later -= input.oneOffCost;
    points.push({ period, now, later, keep });
    if (affordable !== null) {
      const bound = (keep - input.oneOffCost - input.reserve) / period;
      affordable = bound < -1e-8 ? null : Math.min(affordable, Math.max(0, bound));
    }
  }
  if (points.some((point) => ![point.now, point.later, point.keep].every(Number.isFinite))) return null;
  const summarize = (choice: "now" | "later" | "keep"): ReserveCashPath => ({
    cashAtTarget: points[points.length - 1]![choice],
    lowestCash: Math.min(...points.map((point) => point[choice])),
    firstBreachPeriod: points.find((point) => below(point[choice], input.reserve))?.period ?? null
  });
  const nowSummary = summarize("now");
  let incomeThreshold: ReserveDecision["incomeThreshold"] = null;
  if (!below(points[0]!.now, input.reserve)) {
    let adjustment = Number.NEGATIVE_INFINITY;
    let limitingPeriod = 1;
    for (const point of points.slice(1)) {
      const bound = (input.reserve - point.now) / point.period;
      if (bound > adjustment) {
        adjustment = bound;
        limitingPeriod = point.period;
      }
    }
    const minimumIncome = input.incomePerPeriod + adjustment;
    // Ceiling protects the reserve. Check the rounded value using the same cash order,
    // including the future income change, before offering it as an editable scenario.
    let incomeToApply: number | null = Math.ceil(minimumIncome * 100) / 100;
    if (Object.is(incomeToApply, -0)) incomeToApply = 0;
    const preservesReserve = (income: number) => {
      let cash = input.treasury - input.oneOffCost;
      for (let period = 1; period <= periods; period += 1) {
        cash += income + (changePeriod > 0 && period >= changePeriod ? change : 0)
          - input.currentOutflow - input.newOutflow;
        if (below(cash, input.reserve)) return false;
      }
      return true;
    };
    // A cent normally suffices; a few steps also cover floating-point accumulation
    // near the supported money limit without advertising an unsafe boundary.
    for (let correction = 0; correction < 4 && !preservesReserve(incomeToApply); correction += 1) {
      incomeToApply = Math.ceil((incomeToApply + 0.01) * 100) / 100;
    }
    if (Math.abs(incomeToApply) > strategyMoneyLimit || !preservesReserve(incomeToApply)) incomeToApply = null;
    incomeThreshold = { minimumIncome, adjustment, limitingPeriod, incomeToApply };
  }
  return {
    now: nowSummary, later: summarize("later"), keep: summarize("keep"), points,
    maxAddedOutflow: affordable,
    extraTreasuryNeeded: Math.max(0, input.reserve - nowSummary.lowestCash),
    delayPeriods: delay,
    incomeChangePeriod: changePeriod,
    incomeThreshold
  };
}
