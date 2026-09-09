import { calculateCraftingCashFlow, type CraftingInput } from "./wow-economy";

export interface WowBatchInput extends CraftingInput {
  walletGold: number;
  reserveGold: number;
  salesMode: "percent" | "observed";
  observedSoldUnits: number;
  /** Legacy records omit this field. Only the absolute-sales mode uses it. */
  existingStockUnits?: number;
}

const amount = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1e12;
const count = (value: unknown, min = 0): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= 1e6;

export function validWowBatchInput(value: unknown): value is WowBatchInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const x = value as WowBatchInput;
  return [x.materialCostPerCraft, x.salePricePerUnit, x.depositPerListing, x.walletGold, x.reserveGold].every(amount)
    && count(x.outputUnits, 1) && count(x.crafts, 1) && x.outputUnits * x.crafts <= 1e6
    && amount(x.auctionHouseCutPercent) && x.auctionHouseCutPercent <= 100
    && amount(x.sellThroughPercent) && x.sellThroughPercent <= 100
    && (x.salesMode === "percent" || x.salesMode === "observed") && count(x.observedSoldUnits)
    && (x.existingStockUnits === undefined || count(x.existingStockUnits))
    && (x.materialCostPerCraft + x.depositPerListing) * x.crafts <= 1e12
    && x.salePricePerUnit * x.outputUnits * x.crafts <= 1e12;
}

/** Reserve the entered sales count for existing stock first. This is an explicit
 * planning convention, not a prediction of which listing the market buys first.
 * Old stock has no assumed cost basis, proceeds or deposit expense in this model.
 */
export function wowBatchSalesAllocation(input: WowBatchInput) {
  if (input.salesMode !== "observed") return null;
  const existingStockUnits = input.existingStockUnits ?? 0;
  const existingStockSales = Math.min(existingStockUnits, input.observedSoldUnits);
  const newSalesCap = Math.max(0, input.observedSoldUnits - existingStockUnits);
  return { totalSalesCap: input.observedSoldUnits, existingStockUnits, existingStockSales, newSalesCap,
    maxNewCraftsWithoutRemainder: Math.floor(newSalesCap / input.outputUnits) };
}

/** Enlarging a batch never multiplies the conditional sales count. */
export function effectiveWowCraftInput(input: WowBatchInput, crafts = input.crafts): CraftingInput {
  const units = crafts * input.outputUnits;
  const allocation = wowBatchSalesAllocation(input);
  return { ...input, crafts, sellThroughPercent: input.salesMode === "observed"
    ? units > 0 ? Math.min(units, allocation!.newSalesCap) / units * 100 : 0
    : input.sellThroughPercent };
}

export function calculateWowBatchPlan(input: WowBatchInput) {
  if (!validWowBatchInput(input)) return null;
  const unitOutlay = input.materialCostPerCraft + input.depositPerListing;
  const budgetGold = Math.max(0, input.walletGold - input.reserveGold);
  const supportedCrafts = Math.floor(1e6 / input.outputUnits);
  const rawAffordable = budgetGold / unitOutlay;
  const affordableLimitReached = unitOutlay > 0 && rawAffordable >= supportedCrafts;
  // Floor without a positive epsilon: the displayed batch must never overspend.
  let affordableCrafts = unitOutlay === 0 ? null : Math.min(supportedCrafts, Math.floor(rawAffordable));
  if (affordableCrafts !== null && !affordableLimitReached) {
    if ((affordableCrafts + 1) * unitOutlay <= budgetGold) affordableCrafts += 1;
    if (affordableCrafts * unitOutlay > budgetGold) affordableCrafts -= 1;
  }
  const reserveAlreadyShort = input.walletGold < input.reserveGold;
  const feasibleCrafts = reserveAlreadyShort ? 0 : Math.min(input.crafts, affordableCrafts ?? input.crafts);
  const requested = calculateCraftingCashFlow(effectiveWowCraftInput(input));
  const feasible = calculateCraftingCashFlow(effectiveWowCraftInput(input, feasibleCrafts));
  const salesAllocation = wowBatchSalesAllocation(input);
  const salesFitCrafts = salesAllocation ? Math.min(feasibleCrafts, salesAllocation.maxNewCraftsWithoutRemainder) : null;
  return {
    budgetGold, affordableCrafts, affordableLimitReached, feasibleCrafts, reserveAlreadyShort, requested, feasible, salesAllocation, salesFitCrafts,
    requestedCashAfterCraft: input.walletGold - requested.upfrontGold,
    feasibleCashAfterCraft: input.walletGold - feasible.upfrontGold,
    requestedEndCash: input.walletGold + requested.cashChange,
    feasibleEndCash: input.walletGold + feasible.cashChange,
    fits: !reserveAlreadyShort && feasibleCrafts === input.crafts
  };
}

/** The count-mode stress reduces the TOTAL scenario cap before allocating stock. */
export function calculateWowBatchStressCases(input: WowBatchInput) {
  return {
    lowerPrice: calculateCraftingCashFlow(effectiveWowCraftInput({ ...input, salePricePerUnit: input.salePricePerUnit * 0.9 })),
    fewerSales: calculateCraftingCashFlow(effectiveWowCraftInput(input.salesMode === "observed"
      ? { ...input, observedSoldUnits: Math.floor(input.observedSoldUnits * 0.8) }
      : { ...input, sellThroughPercent: Math.max(0, input.sellThroughPercent - 20) }))
  };
}

export interface WowBatchActual {
  soldUnits: number;
  netSaleProceeds: number;
  lostDeposits: number;
}

export function calculateWowBatchActual(input: WowBatchInput, actual: WowBatchActual) {
  const plan = calculateWowBatchPlan(input);
  if (!plan || !actual || !count(actual.soldUnits) || actual.soldUnits > plan.requested.units
    || !amount(actual.netSaleProceeds) || !amount(actual.lostDeposits)
    || actual.lostDeposits > plan.requested.depositOutlay
    || (actual.soldUnits === 0 && actual.netSaleProceeds !== 0)) return null;
  const inventoryUnits = plan.requested.units - actual.soldUnits;
  const inventoryCost = inventoryUnits / input.outputUnits * input.materialCostPerCraft;
  const cashChange = actual.netSaleProceeds - plan.requested.materialOutlay - actual.lostDeposits;
  const profit = cashChange + inventoryCost;
  const endCash = input.walletGold + cashChange;
  return { inventoryUnits, inventoryCost, cashChange, profit, endCash,
    cashDifference: cashChange - plan.requested.cashChange,
    soldDifference: actual.soldUnits - plan.requested.soldUnits };
}

/** Fresh wallet and stock inputs are required: one batch does not establish the
 * player's current balance or inventory. Its sales are only a conditional cap.
 */
export function nextWowBatchAssumptions(input: WowBatchInput, actual: WowBatchActual, currentWalletGold: number, currentExistingStockUnits: number) {
  const result = calculateWowBatchActual(input, actual);
  if (!result || !amount(currentWalletGold) || !count(currentExistingStockUnits)) return null;
  return { walletGold: currentWalletGold, existingStockUnits: currentExistingStockUnits,
    salesMode: "observed" as const, observedSoldUnits: actual.soldUnits };
}
