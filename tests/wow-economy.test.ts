import { describe, expect, it } from "vitest";
import { craftingBaseline, farmBaseline, inventoryTurnBaseline, orderBaseline } from "../src/data/wow-economy";
import { calculateCraftingMetrics, calculateFarmMetrics, calculateInventoryTurn, calculateMarketLedger, calculateWorkOrderMetrics, rankWowMarketRoutes } from "../src/lib/wow-economy";

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

describe("WoW crafting order floor", () => {
  it("prices crafter materials, recraft risk and time into the minimum commission", () => {
    const metrics = calculateWorkOrderMetrics(orderBaseline);

    expect(metrics.minimumCommission).toBeCloseTo(1_430, 2);
    expect(metrics.cashProfitPerOrder).toBe(1_870);
    expect(metrics.economicProfitPerOrder).toBeCloseTo(1_070, 2);
    expect(metrics.state).toBe("accept");
  });

  it("declines an order that pays less than its economic floor", () => {
    const metrics = calculateWorkOrderMetrics({ ...orderBaseline, commissionGold: 900 });

    expect(metrics.economicProfitPerOrder).toBeLessThan(0);
    expect(metrics.state).toBe("decline");
  });

  it("clamps invalid costs and scales a batch", () => {
    const metrics = calculateWorkOrderMetrics({
      ...orderBaseline,
      crafterMaterialCost: -100,
      orders: 3
    });

    expect(metrics.minimumCommission).toBeCloseTo(980, 2);
    expect(metrics.batchEconomicProfit).toBeCloseTo(metrics.economicProfitPerOrder * 3, 2);
  });
});

describe("WoW market ledger", () => {
  it("separates listed inventory from expected cash", () => {
    const metrics = calculateMarketLedger({ liquidGold: 80_000, listedInventoryValue: 120_000, sellThroughPercent: 55, auctionHouseCutPercent: 5, weeklyOperatingSpend: 25_000, cycleDays: 7 });

    expect(metrics.expectedInventoryCash).toBe(62_700);
    expect(metrics.inventoryAtRisk).toBeCloseTo(54_000, 2);
    expect(metrics.liquidCapitalNow).toBe(55_000);
    expect(metrics.liquidityRatioPercent).toBeCloseTo(27.5, 2);
    expect(metrics.state).toBe("balanced");
  });

  it("flags a portfolio dominated by slow inventory", () => {
    const metrics = calculateMarketLedger({ liquidGold: 10_000, listedInventoryValue: 150_000, sellThroughPercent: 20, auctionHouseCutPercent: 5, weeklyOperatingSpend: 8_000, cycleDays: 7 });
    expect(metrics.state).toBe("inventory-heavy");
    expect(metrics.inventoryAtRisk).toBeGreaterThan(metrics.expectedInventoryCash);
  });
});

describe("WoW inventory turn planner", () => {
  it("protects the reserve before setting a batch ceiling", () => {
    const metrics = calculateInventoryTurn(inventoryTurnBaseline);

    expect(metrics.deploymentBudget).toBe(25_000);
    expect(metrics.safeBatchUnits).toBe(30);
    expect(metrics.capitalDeployed).toBe(24_750);
    expect(metrics.cashAfterDeployment).toBeGreaterThanOrEqual(inventoryTurnBaseline.protectedReserve);
  });

  it("keeps unsold stock separate from first-cycle cash", () => {
    const metrics = calculateInventoryTurn(inventoryTurnBaseline);

    expect(metrics.expectedFirstCycleCash).toBeCloseTo(17_634.375, 3);
    expect(metrics.expectedRemainingUnits).toBeCloseTo(2.73375, 5);
    expect(metrics.remainingCapitalAtCost).toBeGreaterThan(0);
    expect(metrics.state).toBe("scalable");
  });

  it("blocks scaling when the sale price is below the net cost", () => {
    const metrics = calculateInventoryTurn({ ...inventoryTurnBaseline, salePricePerUnit: 800 });

    expect(metrics.expectedFirstCycleProfit).toBeLessThan(0);
    expect(metrics.state).toBe("negative-margin");
  });

  it("flags a slow market as an inventory trap", () => {
    const metrics = calculateInventoryTurn({ ...inventoryTurnBaseline, sellThroughPercentPerCycle: 15, targetCycles: 3 });

    expect(metrics.expectedRemainingUnits).toBeGreaterThan(metrics.safeBatchUnits * 0.4);
    expect(metrics.state).toBe("inventory-trap");
  });
});

describe("WoW conditional market rankings", () => {
  const routes = [
    { id: "liquid", metrics: { capitalAccess: 8, liquidity: 10, timeFit: 8, specializationMoat: 2, priceResilience: 7, lowFriction: 8 } },
    { id: "specialist", metrics: { capitalAccess: 4, liquidity: 4, timeFit: 5, specializationMoat: 10, priceResilience: 8, lowFriction: 4 } }
  ];

  it("changes the leader when the player objective changes", () => {
    const casual = rankWowMarketRoutes(routes, {
      id: "casual",
      weights: { capitalAccess: 20, liquidity: 30, timeFit: 25, specializationMoat: 5, priceResilience: 10, lowFriction: 10 }
    });
    const specialist = rankWowMarketRoutes(routes, {
      id: "specialist",
      weights: { capitalAccess: 5, liquidity: 5, timeFit: 10, specializationMoat: 55, priceResilience: 20, lowFriction: 5 }
    });

    expect(casual[0]?.route.id).toBe("liquid");
    expect(specialist[0]?.route.id).toBe("specialist");
  });
});
