export interface CraftingInput {
  materialCostPerCraft: number;
  outputUnits: number;
  salePricePerUnit: number;
  auctionHouseCutPercent: number;
  depositPerListing: number;
  sellThroughPercent: number;
  crafts: number;
}

export interface CraftingMetrics {
  grossRevenueIfSold: number;
  netRevenueIfSold: number;
  profitIfSold: number;
  expectedProfitPerCycle: number;
  expectedBatchProfit: number;
  expectedRoiPercent: number;
  breakEvenPricePerUnit: number;
  inventoryCapitalAtRisk: number;
  state: "positive-edge" | "thin-edge" | "negative-edge";
}

export interface FarmInput {
  unitsPerHour: number;
  marketPricePerUnit: number;
  sellThroughPercent: number;
  auctionHouseCutPercent: number;
  hourlyExpenses: number;
  relistingLossPerHour: number;
  sessionHours: number;
  targetGold: number;
}

export interface FarmMetrics {
  listedGoldPerHour: number;
  effectiveGoldPerHour: number;
  monetizationRatePercent: number;
  liquidityHaircutPerHour: number;
  inventoryValueAtRisk: number;
  expectedSessionGold: number;
  hoursToTarget: number;
  state: "liquid" | "discounted" | "inventory-trap";
}

function positive(value: number): number {
  return Math.max(0, Number.isFinite(value) ? value : 0);
}

function percentage(value: number): number {
  return Math.min(100, positive(value)) / 100;
}

export function calculateCraftingMetrics(input: CraftingInput): CraftingMetrics {
  const materialCost = positive(input.materialCostPerCraft);
  const outputUnits = positive(input.outputUnits);
  const salePrice = positive(input.salePricePerUnit);
  const auctionHouseCut = percentage(input.auctionHouseCutPercent);
  const deposit = positive(input.depositPerListing);
  const sellThrough = percentage(input.sellThroughPercent);
  const crafts = positive(input.crafts);

  const grossRevenueIfSold = outputUnits * salePrice;
  const netRevenueIfSold = grossRevenueIfSold * (1 - auctionHouseCut);
  const profitIfSold = netRevenueIfSold - materialCost;
  const expectedProfitPerCycle = sellThrough * profitIfSold - (1 - sellThrough) * deposit;
  const expectedBatchProfit = expectedProfitPerCycle * crafts;
  const deployedCapital = (materialCost + deposit) * crafts;
  const expectedRoiPercent = deployedCapital > 0
    ? expectedBatchProfit / deployedCapital * 100
    : 0;
  const breakEvenDenominator = sellThrough * outputUnits * (1 - auctionHouseCut);
  const breakEvenPricePerUnit = breakEvenDenominator > 0
    ? (sellThrough * materialCost + (1 - sellThrough) * deposit) / breakEvenDenominator
    : Number.POSITIVE_INFINITY;
  const inventoryCapitalAtRisk = materialCost * crafts * (1 - sellThrough);
  const state = expectedProfitPerCycle <= 0
    ? "negative-edge"
    : expectedRoiPercent >= 10 ? "positive-edge" : "thin-edge";

  return {
    grossRevenueIfSold,
    netRevenueIfSold,
    profitIfSold,
    expectedProfitPerCycle,
    expectedBatchProfit,
    expectedRoiPercent,
    breakEvenPricePerUnit,
    inventoryCapitalAtRisk,
    state
  };
}

export function calculateFarmMetrics(input: FarmInput): FarmMetrics {
  const unitsPerHour = positive(input.unitsPerHour);
  const marketPrice = positive(input.marketPricePerUnit);
  const sellThrough = percentage(input.sellThroughPercent);
  const auctionHouseCut = percentage(input.auctionHouseCutPercent);
  const expenses = positive(input.hourlyExpenses);
  const relistingLoss = positive(input.relistingLossPerHour);
  const sessionHours = positive(input.sessionHours);
  const targetGold = positive(input.targetGold);

  const listedGoldPerHour = unitsPerHour * marketPrice;
  const saleProceedsPerHour = listedGoldPerHour * sellThrough * (1 - auctionHouseCut);
  const effectiveGoldPerHour = Math.max(0, saleProceedsPerHour - expenses - relistingLoss);
  const monetizationRatePercent = listedGoldPerHour > 0
    ? effectiveGoldPerHour / listedGoldPerHour * 100
    : 0;
  const liquidityHaircutPerHour = Math.max(0, listedGoldPerHour - effectiveGoldPerHour);
  const inventoryValueAtRisk = listedGoldPerHour * (1 - sellThrough) * sessionHours;
  const expectedSessionGold = effectiveGoldPerHour * sessionHours;
  const hoursToTarget = targetGold === 0
    ? 0
    : effectiveGoldPerHour > 0 ? targetGold / effectiveGoldPerHour : Number.POSITIVE_INFINITY;
  const state = monetizationRatePercent >= 70
    ? "liquid"
    : monetizationRatePercent >= 40 ? "discounted" : "inventory-trap";

  return {
    listedGoldPerHour,
    effectiveGoldPerHour,
    monetizationRatePercent,
    liquidityHaircutPerHour,
    inventoryValueAtRisk,
    expectedSessionGold,
    hoursToTarget,
    state
  };
}
