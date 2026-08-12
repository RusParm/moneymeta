import { describe, expect, it } from "vitest";
import { calculateComparisonMetrics, calculateInvestmentMetrics, calculateReserveMetrics } from "../src/lib/strategy-economy";

describe("strategy investment model", () => {
  it("prices delay, risk and horizon into payback", () => {
    const metrics = calculateInvestmentMetrics({ cost: 4_000, incomePerPeriod: 350, delayPeriods: 2, horizonPeriods: 20, riskPercent: 10 });

    expect(metrics.activePeriods).toBe(18);
    expect(metrics.riskAdjustedIncome).toBeCloseTo(315, 2);
    expect(metrics.paybackPeriods).toBeCloseTo(14.698, 3);
    expect(metrics.netValue).toBe(1_670);
  });

  it("returns infinite payback when the investment creates no positive flow", () => {
    const metrics = calculateInvestmentMetrics({ cost: 600, incomePerPeriod: 0, delayPeriods: 12, horizonPeriods: 120, riskPercent: 0 });
    expect(metrics.paybackPeriods).toBe(Number.POSITIVE_INFINITY);
    expect(metrics.netValue).toBe(-600);
  });
});

describe("strategy reserve model", () => {
  it("separates an affordable one-off purchase from sustainable runway", () => {
    const metrics = calculateReserveMetrics({ treasury: 12_000, incomePerPeriod: 3_500, currentOutflow: 2_300, newOutflow: 1_200, oneOffCost: 4_500, horizonPeriods: 8, reserve: 3_000 });

    expect(metrics.netFlow).toBe(0);
    expect(metrics.cashAtTarget).toBe(7_500);
    expect(metrics.buffer).toBe(4_500);
    expect(metrics.safePeriods).toBe(Number.POSITIVE_INFINITY);
  });

  it("shows when burn breaks the reserve", () => {
    const metrics = calculateReserveMetrics({ treasury: 900, incomePerPeriod: 22, currentOutflow: 8, newOutflow: 30, oneOffCost: 150, horizonPeriods: 24, reserve: 250 });
    expect(metrics.netFlow).toBe(-16);
    expect(metrics.buffer).toBe(116);
    expect(metrics.safePeriods).toBeCloseTo(31.25, 2);
  });
});

describe("strategy comparison model", () => {
  it("compares immediate and recurring options on one horizon", () => {
    const metrics = calculateComparisonMetrics({ aImmediate: 12_000, aRecurring: 0, aDelay: 0, aRiskPercent: 10, bImmediate: -3_500, bRecurring: 1_300, bDelay: 2, bRiskPercent: 25, horizonPeriods: 12 });

    expect(metrics.optionAValue).toBe(12_000);
    expect(metrics.optionBValue).toBe(6_250);
    expect(metrics.winner).toBe("a");
    expect(metrics.advantage).toBe(5_750);
  });
});
