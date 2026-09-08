import { describe, expect, it } from "vitest";
import { calculateReserveDecision, strategyMoneyLimit, type ReserveDecisionScenario } from "../src/lib/strategy-decision";
import { calculateReserveMetrics } from "../src/lib/strategy-economy";

const base: ReserveDecisionScenario = {
  treasury: 12000, incomePerPeriod: 3500, currentOutflow: 2300, newOutflow: 1900,
  oneOffCost: 4500, horizonPeriods: 8, reserve: 3000
};

describe("strategy decision cash paths", () => {
  it("finds the first reserve breach rather than only the final shortfall", () => {
    const result = calculateReserveDecision(base)!;
    expect(result.now).toEqual({ cashAtTarget: 1900, lowestCash: 1900, firstBreachPeriod: 7 });
    expect(result.keep).toEqual({ cashAtTarget: 21600, lowestCash: 12000, firstBreachPeriod: null });
    expect(result.maxAddedOutflow).toBe(1762.5);
    expect(result.extraTreasuryNeeded).toBe(1100);
  });

  it("records an immediate payment breach even if later income restores cash", () => {
    const result = calculateReserveDecision({ ...base, treasury: 1000, oneOffCost: 900, reserve: 300,
      incomePerPeriod: 500, currentOutflow: 100, newOutflow: 0 })!;
    expect(result.now.firstBreachPeriod).toBe(0);
    expect(result.now.cashAtTarget).toBeGreaterThan(300);
    expect(result.maxAddedOutflow).toBeNull();
    expect(result.extraTreasuryNeeded).toBe(200);
  });

  it("accepts exactly the reserve, including after immediate payment", () => {
    const result = calculateReserveDecision({ ...base, treasury: 7500, newOutflow: 1200 })!;
    expect(result.now.lowestCash).toBe(3000);
    expect(result.now.firstBreachPeriod).toBeNull();
    expect(result.maxAddedOutflow).toBe(1200);
    expect(calculateReserveDecision({ ...base, treasury: 7500, newOutflow: 1200.01 })!.now.firstBreachPeriod).toBe(1);
  });

  it("applies a changed income starting in the selected period to every choice", () => {
    const result = calculateReserveDecision({ ...base, incomeChangePeriod: 3, incomeChange: -500 })!;
    expect(result.points[2]!.keep).toBe(14400);
    expect(result.points[3]!.keep).toBe(15100);
    expect(result.points[3]!.now).toBe(4900);
    expect(result.points[3]!.later).toBe(6800);
    expect(result.now.firstBreachPeriod).toBe(5);
  });

  it("does not hide an intermediate breach behind recovery or a positive final balance", () => {
    const result = calculateReserveDecision({ treasury: 700, incomePerPeriod: 10, currentOutflow: 110,
      newOutflow: 20, oneOffCost: 0, horizonPeriods: 6, reserve: 400,
      incomeChangePeriod: 4, incomeChange: 300 })!;
    expect(result.now.firstBreachPeriod).toBe(3);
    expect(result.now.lowestCash).toBe(340);
    expect(result.now.cashAtTarget).toBe(880);
    expect(result.maxAddedOutflow).toBe(0);
    expect(result.extraTreasuryNeeded).toBe(60);
  });

  it("postpones the entire action, including upkeep, without moving the end date", () => {
    const result = calculateReserveDecision({ ...base, actionDelayPeriods: 1 })!;
    expect(result.later.cashAtTarget).toBe(3800);
    expect(result.later.firstBreachPeriod).toBeNull();
    expect(result.points[0]!.later).toBe(12000);
    expect(result.points[1]!.later).toBe(8700);
    expect(result.points).toHaveLength(9);
    const immediate = calculateReserveDecision({ ...base, actionDelayPeriods: 0 })!;
    expect(immediate.later).toEqual(immediate.now);
  });

  it("checks reserve immediately when the delayed payment occurs", () => {
    const result = calculateReserveDecision({ treasury: 1000, incomePerPeriod: 0, currentOutflow: 0,
      newOutflow: 0, oneOffCost: 800, horizonPeriods: 4, reserve: 300, actionDelayPeriods: 2,
      incomeChangePeriod: 3, incomeChange: 500 })!;
    expect(result.later.firstBreachPeriod).toBe(2);
    expect(result.later.lowestCash).toBe(200);
    expect(result.later.cashAtTarget).toBe(1200);
  });

  it("keeps no-change calculations equivalent to the previous model's final cash", () => {
    for (const scenario of [base, { ...base, newOutflow: 1200 }, { ...base, treasury: 9000, incomePerPeriod: -30 }]) {
      const previous = calculateReserveMetrics(scenario);
      expect(calculateReserveDecision(scenario)!.now.cashAtTarget).toBe(previous.cashAtTarget);
      expect(calculateReserveDecision({ ...scenario, incomeChangePeriod: 0, incomeChange: -999 })!.now.cashAtTarget).toBe(previous.cashAtTarget);
    }
  });

  it("does not allow upkeep savings to fix a reserve already broken without new upkeep", () => {
    const result = calculateReserveDecision({ ...base, treasury: 3000, oneOffCost: 0,
      incomePerPeriod: 100, currentOutflow: 200, newOutflow: 0 })!;
    expect(result.maxAddedOutflow).toBeNull();
    expect(result.keep.firstBreachPeriod).toBe(1);
  });

  it("ignores a change outside the horizon and labels a later action beyond it as unstarted", () => {
    const result = calculateReserveDecision({ ...base, incomeChangePeriod: 9, incomeChange: -999,
      actionDelayPeriods: 9 })!;
    expect(result.now.cashAtTarget).toBe(1900);
    expect(result.later).toEqual(result.keep);
    expect(calculateReserveDecision({ ...base, actionDelayPeriods: 8 })!.later.cashAtTarget).toBe(17100);
  });

  it("rejects unusable values instead of silently converting them into a result", () => {
    for (const patch of [{ treasury: NaN }, { incomePerPeriod: Infinity }, { newOutflow: -1 },
      { horizonPeriods: 1.5 }, { horizonPeriods: 601 }, { horizonPeriods: 0 },
      { incomeChangePeriod: -1 }, { actionDelayPeriods: 0.5 }, { incomeChange: NaN }]) {
      expect(calculateReserveDecision({ ...base, ...patch })).toBeNull();
    }
  });

  it("rejects extreme finite money inputs before derived results or display rounding overflow", () => {
    expect(calculateReserveDecision({ ...base, incomePerPeriod: 1e308 })).toBeNull();
    expect(calculateReserveDecision({ ...base, incomePerPeriod: -1e308, reserve: 1e308 })).toBeNull();
    for (const field of ["treasury", "incomePerPeriod", "currentOutflow", "newOutflow", "oneOffCost", "reserve", "incomeChange"]) {
      expect(calculateReserveDecision({ ...base, [field]: strategyMoneyLimit + 1 })).toBeNull();
    }
    expect(calculateReserveDecision({ ...base, incomeChange: -strategyMoneyLimit - 1 })).toBeNull();
    expect(calculateReserveDecision({ ...base, incomePerPeriod: strategyMoneyLimit })!.maxAddedOutflow).toBeLessThanOrEqual(strategyMoneyLimit);
  });
});
