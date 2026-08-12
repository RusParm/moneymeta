import { describe, expect, it } from "vitest";
import { buybackBaseline, midasBaseline } from "../src/data/dota-economy";
import {
  calculateBuybackMetrics,
  calculateMidasMetrics,
  estimateBuybackCost
} from "../src/lib/dota-economy";

describe("Hand of Midas economics", () => {
  it("values incremental gold instead of treating the full Transmute payout as free value", () => {
    const metrics = calculateMidasMetrics(midasBaseline);

    expect(metrics.incrementalValuePerUse).toBe(120);
    expect(metrics.usesRemaining).toBe(21);
    expect(metrics.grossIncrementalValue).toBe(2_520);
    expect(metrics.netEconomicValue).toBe(320);
  });

  it("moves payback later when the sacrificed creep bounty rises", () => {
    const lowBounty = calculateMidasMetrics({ ...midasBaseline, foregoneCreepBounty: 20 });
    const highBounty = calculateMidasMetrics({ ...midasBaseline, foregoneCreepBounty: 80 });

    expect(highBounty.paybackMatchMinute).toBeGreaterThan(lowBounty.paybackMatchMinute);
  });
});

describe("buyback reserve", () => {
  it("uses the documented net-worth formula", () => {
    expect(estimateBuybackCost(15_000)).toBeCloseTo(1_353.85, 2);
  });

  it("recognizes a reserve that is already funded", () => {
    const metrics = calculateBuybackMetrics(buybackBaseline);

    expect(metrics.state).toBe("ready-now");
    expect(metrics.reserveGap).toBe(0);
    expect(metrics.reserveSurplus).toBeGreaterThan(0);
  });

  it("separates current underfunding from readiness by the next objective", () => {
    const metrics = calculateBuybackMetrics({
      ...buybackBaseline,
      currentGold: 500,
      goldPerMinute: 500,
      secondsToObjective: 120
    });

    expect(metrics.state).toBe("ready-by-objective");
    expect(metrics.reserveGap).toBeGreaterThan(0);
    expect(metrics.projectedGoldAtObjective).toBeGreaterThan(metrics.estimatedCost);
  });
});
