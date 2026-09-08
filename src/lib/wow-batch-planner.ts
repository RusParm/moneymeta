import { calculateCraftingCashFlow, type CraftingInput } from "./wow-economy";

export interface WowBatchInput extends CraftingInput {
  walletGold: number;
  reserveGold: number;
  salesMode: "percent" | "observed";
  observedSoldUnits: number;
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
    && (x.materialCostPerCraft + x.depositPerListing) * x.crafts <= 1e12
    && x.salePricePerUnit * x.outputUnits * x.crafts <= 1e12;
}

/** A completed trial constrains absolute unit sales for this comparable cycle.
 * Enlarging the new batch never multiplies observed demand.
 */
export function effectiveWowCraftInput(input: WowBatchInput, crafts = input.crafts): CraftingInput {
  const units = crafts * input.outputUnits;
  return { ...input, crafts, sellThroughPercent: input.salesMode === "observed"
    ? units > 0 ? Math.min(units, input.observedSoldUnits) / units * 100 : 0
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
  return {
    budgetGold, affordableCrafts, affordableLimitReached, feasibleCrafts, reserveAlreadyShort, requested, feasible,
    requestedCashAfterCraft: input.walletGold - requested.upfrontGold,
    feasibleCashAfterCraft: input.walletGold - feasible.upfrontGold,
    requestedEndCash: input.walletGold + requested.cashChange,
    feasibleEndCash: input.walletGold + feasible.cashChange,
    fits: !reserveAlreadyShort && feasibleCrafts === input.crafts
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

/** A fresh wallet input is required: an isolated batch result is not the player's
 * current balance after unrelated income and spending.
 */
export function nextWowBatchAssumptions(input: WowBatchInput, actual: WowBatchActual, currentWalletGold: number) {
  const result = calculateWowBatchActual(input, actual);
  if (!result || !amount(currentWalletGold)) return null;
  return { walletGold: currentWalletGold, salesMode: "observed" as const, observedSoldUnits: actual.soldUnits };
}
