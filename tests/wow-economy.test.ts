import { describe, expect, it } from "vitest";
import { craftingBaseline, farmBaseline } from "../src/data/wow-economy";
import { calculateCraftingMetrics, calculateFarmMetrics } from "../src/lib/wow-economy";

describe("WoW crafting economics", () => {
  it("deducts the Auction House cut before measuring crafting profit", () => {
    const metrics = calculateCraftingMetrics(craftingBaseline);

    expect(metrics.grossRevenueIfSold).toBe(1_125);
    expect(metrics.netRevenueIfSold).toBeCloseTo(1_068.75, 2);
    expect(metrics.profitIfSold).toBeCloseTo(243.75, 2);
  });

  it("prices failed listings into expected profit and inventory risk", () => {
    const metrics = calculateCraftingMetrics(craftingBaseline);

    expect(metrics.expectedProfitPerCycle).toBeCloseTo(167.025, 3);
    expect(metrics.inventoryCapitalAtRisk).toBeCloseTo(4_950, 2);
    expect(metrics.state).toBe("positive-edge");
  });

  it("detects a negative edge when the market price falls below break-even", () => {
    const metrics = calculateCraftingMetrics({ ...craftingBaseline, salePricePerUnit: 150 });

    expect(metrics.expectedProfitPerCycle).toBeLessThan(0);
    expect(metrics.state).toBe("negative-edge");
  });
});

describe("WoW farm liquidity", () => {
  it("separates listed gold per hour from monetizable gold per hour", () => {
    const metrics = calculateFarmMetrics(farmBaseline);

    expect(metrics.listedGoldPerHour).toBe(3_420);
    expect(metrics.effectiveGoldPerHour).toBeCloseTo(1_956.85, 2);
    expect(metrics.effectiveGoldPerHour).toBeLessThan(metrics.listedGoldPerHour);
  });

  it("recognizes an inventory trap when sell-through collapses", () => {
    const metrics = calculateFarmMetrics({ ...farmBaseline, sellThroughPercent: 20 });

    expect(metrics.state).toBe("inventory-trap");
    expect(metrics.inventoryValueAtRisk).toBeGreaterThan(metrics.expectedSessionGold);
  });
});
