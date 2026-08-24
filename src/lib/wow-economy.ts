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

export interface WorkOrderInput {
  commissionGold: number;
  crafterMaterialCost: number;
  expectedRecraftReserve: number;
  serviceMinutes: number;
  targetGoldPerHour: number;
  orders: number;
}

export interface WorkOrderMetrics {
  cashProfitPerOrder: number;
  timeCostPerOrder: number;
  economicProfitPerOrder: number;
  minimumCommission: number;
  effectiveGoldPerHour: number;
  batchEconomicProfit: number;
  marginOfSafetyPercent: number;
  state: "accept" | "negotiate" | "decline";
}

export interface MarketLedgerInput {
  liquidGold: number;
  listedInventoryValue: number;
  sellThroughPercent: number;
  auctionHouseCutPercent: number;
  weeklyOperatingSpend: number;
  cycleDays: number;
}

export interface MarketLedgerMetrics {
  expectedInventoryCash: number;
  inventoryAtRisk: number;
  totalMarketCapital: number;
  liquidCapitalNow: number;
  liquidityRatioPercent: number;
  postCycleCash: number;
  capitalVelocityPerWeek: number;
  state: "liquid" | "balanced" | "inventory-heavy";
}

export interface InventoryTurnInput {
  liquidGold: number;
  protectedReserve: number;
  maxDeploymentPercent: number;
  unitCost: number;
  salePricePerUnit: number;
  auctionHouseCutPercent: number;
  sellThroughPercentPerCycle: number;
  cycleDays: number;
  targetCycles: number;
}

export interface InventoryTurnMetrics {
  deploymentBudget: number;
  safeBatchUnits: number;
  capitalDeployed: number;
  cashAfterDeployment: number;
  netSalePricePerUnit: number;
  expectedFirstCycleCash: number;
  expectedFirstCycleProfit: number;
  firstCycleCashRecoveryPercent: number;
  expectedRemainingUnits: number;
  remainingCapitalAtCost: number;
  daysToNinetyPercentSold: number;
  state: "no-budget" | "negative-margin" | "inventory-trap" | "test-batch" | "scalable";
}

export type WowRouteMetric = "capitalAccess" | "liquidity" | "timeFit" | "specializationMoat" | "priceResilience" | "lowFriction";

export interface WowMarketRouteMetrics {
  capitalAccess: number;
  liquidity: number;
  timeFit: number;
  specializationMoat: number;
  priceResilience: number;
  lowFriction: number;
}

export interface WowMarketRouteLike {
  id: string;
  metrics: WowMarketRouteMetrics;
}

export interface WowRankingLens {
  id: string;
  weights: Record<WowRouteMetric, number>;
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

export function calculateWorkOrderMetrics(input: WorkOrderInput): WorkOrderMetrics {
  const commission = positive(input.commissionGold);
  const materialCost = positive(input.crafterMaterialCost);
  const recraftReserve = positive(input.expectedRecraftReserve);
  const serviceMinutes = positive(input.serviceMinutes);
  const targetGoldPerHour = positive(input.targetGoldPerHour);
  const orders = positive(input.orders);

  const cashProfitPerOrder = commission - materialCost - recraftReserve;
  const timeCostPerOrder = serviceMinutes / 60 * targetGoldPerHour;
  const economicProfitPerOrder = cashProfitPerOrder - timeCostPerOrder;
  const minimumCommission = materialCost + recraftReserve + timeCostPerOrder;
  const effectiveGoldPerHour = serviceMinutes > 0
    ? Math.max(0, cashProfitPerOrder) / serviceMinutes * 60
    : cashProfitPerOrder > 0 ? Number.POSITIVE_INFINITY : 0;
  const batchEconomicProfit = economicProfitPerOrder * orders;
  const marginOfSafetyPercent = minimumCommission > 0
    ? (commission - minimumCommission) / minimumCommission * 100
    : commission > 0 ? 100 : 0;
  const state = economicProfitPerOrder <= 0
    ? "decline"
    : marginOfSafetyPercent >= 20 ? "accept" : "negotiate";

  return {
    cashProfitPerOrder,
    timeCostPerOrder,
    economicProfitPerOrder,
    minimumCommission,
    effectiveGoldPerHour,
    batchEconomicProfit,
    marginOfSafetyPercent,
    state
  };
}

export function calculateMarketLedger(input: MarketLedgerInput): MarketLedgerMetrics {
  const liquidGold = positive(input.liquidGold);
  const listedInventoryValue = positive(input.listedInventoryValue);
  const sellThrough = percentage(input.sellThroughPercent);
  const auctionHouseCut = percentage(input.auctionHouseCutPercent);
  const weeklyOperatingSpend = positive(input.weeklyOperatingSpend);
  const cycleDays = Math.max(0.1, positive(input.cycleDays));
  const expectedInventoryCash = listedInventoryValue * sellThrough * (1 - auctionHouseCut);
  const inventoryAtRisk = listedInventoryValue * (1 - sellThrough);
  const totalMarketCapital = liquidGold + listedInventoryValue;
  const liquidCapitalNow = Math.max(0, liquidGold - weeklyOperatingSpend);
  const liquidityRatioPercent = totalMarketCapital > 0 ? liquidCapitalNow / totalMarketCapital * 100 : 0;
  const postCycleCash = Math.max(0, liquidCapitalNow + expectedInventoryCash);
  const capitalVelocityPerWeek = totalMarketCapital > 0
    ? expectedInventoryCash / totalMarketCapital * (7 / cycleDays)
    : 0;
  const state = liquidityRatioPercent >= 55
    ? "liquid"
    : liquidityRatioPercent >= 25 ? "balanced" : "inventory-heavy";

  return {
    expectedInventoryCash,
    inventoryAtRisk,
    totalMarketCapital,
    liquidCapitalNow,
    liquidityRatioPercent,
    postCycleCash,
    capitalVelocityPerWeek,
    state
  };
}

export function calculateInventoryTurn(input: InventoryTurnInput): InventoryTurnMetrics {
  const liquidGold = positive(input.liquidGold);
  const protectedReserve = positive(input.protectedReserve);
  const maxDeployment = percentage(input.maxDeploymentPercent);
  const unitCost = positive(input.unitCost);
  const salePrice = positive(input.salePricePerUnit);
  const auctionHouseCut = percentage(input.auctionHouseCutPercent);
  const sellThrough = percentage(input.sellThroughPercentPerCycle);
  const cycleDays = Math.max(0.1, positive(input.cycleDays));
  const targetCycles = Math.max(1, Math.round(positive(input.targetCycles)));

  const availableAboveReserve = Math.max(0, liquidGold - protectedReserve);
  const deploymentBudget = availableAboveReserve * maxDeployment;
  const safeBatchUnits = unitCost > 0 ? Math.floor(deploymentBudget / unitCost) : 0;
  const capitalDeployed = safeBatchUnits * unitCost;
  const cashAfterDeployment = liquidGold - capitalDeployed;
  const netSalePricePerUnit = salePrice * (1 - auctionHouseCut);
  const expectedSoldFirstCycle = safeBatchUnits * sellThrough;
  const expectedFirstCycleCash = expectedSoldFirstCycle * netSalePricePerUnit;
  const expectedFirstCycleProfit = expectedSoldFirstCycle * (netSalePricePerUnit - unitCost);
  const firstCycleCashRecoveryPercent = capitalDeployed > 0 ? expectedFirstCycleCash / capitalDeployed * 100 : 0;
  const expectedRemainingUnits = safeBatchUnits * Math.pow(1 - sellThrough, targetCycles);
  const remainingCapitalAtCost = expectedRemainingUnits * unitCost;
  const cyclesToNinetyPercentSold = sellThrough <= 0
    ? Number.POSITIVE_INFINITY
    : sellThrough >= 1
      ? 1
      : Math.ceil(Math.log(0.1) / Math.log(1 - sellThrough));
  const daysToNinetyPercentSold = Number.isFinite(cyclesToNinetyPercentSold)
    ? cyclesToNinetyPercentSold * cycleDays
    : Number.POSITIVE_INFINITY;
  const remainingShare = safeBatchUnits > 0 ? expectedRemainingUnits / safeBatchUnits : 1;
  const state = safeBatchUnits === 0
    ? "no-budget"
    : netSalePricePerUnit <= unitCost
      ? "negative-margin"
      : remainingShare > 0.4
        ? "inventory-trap"
        : firstCycleCashRecoveryPercent >= 70 && remainingShare <= 0.2
          ? "scalable"
          : "test-batch";

  return {
    deploymentBudget,
    safeBatchUnits,
    capitalDeployed,
    cashAfterDeployment,
    netSalePricePerUnit,
    expectedFirstCycleCash,
    expectedFirstCycleProfit,
    firstCycleCashRecoveryPercent,
    expectedRemainingUnits,
    remainingCapitalAtCost,
    daysToNinetyPercentSold,
    state
  };
}

export function scoreWowMarketRoute(route: WowMarketRouteLike, lens: WowRankingLens): number {
  const entries = Object.entries(lens.weights) as Array<[WowRouteMetric, number]>;
  const totalWeight = entries.reduce((sum, [, weight]) => sum + positive(weight), 0);
  if (totalWeight === 0) return 0;

  const weighted = entries.reduce((sum, [metric, weight]) => {
    const metricScore = Math.min(10, positive(route.metrics[metric]));
    return sum + metricScore * positive(weight);
  }, 0);

  return weighted / totalWeight * 10;
}

export function rankWowMarketRoutes<T extends WowMarketRouteLike>(routes: T[], lens: WowRankingLens): Array<{ route: T; score: number }> {
  return routes
    .map((route) => ({ route, score: scoreWowMarketRoute(route, lens) }))
    .sort((a, b) => b.score - a.score || a.route.id.localeCompare(b.route.id));
}
