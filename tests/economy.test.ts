import { describe, expect, it } from "vitest";
import { gtaBusinesses } from "../src/data/gta-businesses";
import {
  calculateBusinessMetrics,
  findBestPortfolio,
  isSnapshotStale,
  recommendBusinesses
} from "../src/lib/economy";

describe("economy calculations", () => {
  it("calculates Acid Lab net profit and payback from centralized data", () => {
    const acid = gtaBusinesses.find((business) => business.id === "acid")!;
    const metrics = calculateBusinessMetrics(acid);

    expect(metrics.netPerCycle).toBe(275_000);
    expect(metrics.profitPerProductionHour).toBeCloseTo(59_782.61, 2);
    expect(metrics.paybackProductionHours).toBeCloseTo(16.73, 2);
  });

  it("applies a sale bonus without mutating the source data", () => {
    const bunker = gtaBusinesses.find((business) => business.id === "bunker")!;
    const originalSale = bunker.fullSale;
    const metrics = calculateBusinessMetrics(bunker, 50);

    expect(metrics.grossSale).toBe(375_000);
    expect(bunker.fullSale).toBe(originalSale);
  });
});

describe("decision engine", () => {
  it("recommends an affordable low-entry business", () => {
    const recommendations = recommendBusinesses(gtaBusinesses, {
      budget: 1_100_000,
      weeklyHours: 5,
      priority: "fast-payback",
      maxFriction: 6
    });

    expect(recommendations[0]?.business.id).toBe("acid");
    expect(recommendations[0]?.score).toBeGreaterThan(0);
  });

  it("keeps the optimized portfolio inside both constraints", () => {
    const budget = 5_000_000;
    const activeHours = 2;
    const result = findBestPortfolio(gtaBusinesses, budget, activeHours);

    expect(result).not.toBeNull();
    expect(result!.setupCost).toBeLessThanOrEqual(budget);
    expect(result!.activeHours).toBeLessThanOrEqual(activeHours);
    expect(result!.weeklyProfit).toBeGreaterThan(0);
  });

  it("returns no portfolio when nothing fits", () => {
    expect(findBestPortfolio(gtaBusinesses, 100_000, 1)).toBeNull();
  });

  it("does not label expired weekly data as current", () => {
    expect(isSnapshotStale("2026-07-09", new Date("2026-08-11T12:00:00Z"))).toBe(true);
    expect(isSnapshotStale("2026-08-20", new Date("2026-08-11T12:00:00Z"))).toBe(false);
  });
});
