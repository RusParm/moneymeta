import { describe, expect, it } from "vitest";
import { craftingBaseline } from "../src/data/wow-economy";
import { calculateWowBatchActual, calculateWowBatchPlan, calculateWowBatchStressCases, nextWowBatchAssumptions, type WowBatchInput } from "../src/lib/wow-batch-planner";
import { addWowBatchForecast, closeWowBatchForecast, readWowBatchJournal, removeWowBatchRecord, wowBatchRecordToken, WOW_BATCH_STORE_KEY, type WowBatchRecord } from "../src/lib/wow-batch-journal";
import { wowBatchPlannerCopy } from "../src/data/wow-batch-planner-copy";

const input: WowBatchInput = { ...craftingBaseline, walletGold: 25_000, reserveGold: 5_000, salesMode: "percent", observedSoldUnits: 70 };
const now = "2026-09-08T12:00:00.000Z";
const later = "2026-09-09T12:00:00.000Z";
const record = (n = 1): WowBatchRecord => ({ id: `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`, name: "Trial batch", createdAt: now, forecast: { ...input }, actual: null });
const actual = { soldUnits: 60, netSaleProceeds: 12_600, lostDeposits: 96, recordedAt: later };
const memory = () => {
  const values = new Map<string, string>();
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
};

describe("WoW affordable batch with a protected cash reserve", () => {
  it("keeps the original percentage-based example numerically unchanged", () => {
    const plan = calculateWowBatchPlan(input)!;
    expect(plan.fits).toBe(true);
    expect(plan.requested.cashChange).toBeCloseTo(-1609.5);
    expect(plan.requested.profit).toBeCloseTo(3340.5);
    expect(plan.affordableCrafts).toBe(23);
  });
  it("requires all materials and deposits up front, even for a profitable sale", () => {
    const plan = calculateWowBatchPlan({ ...input, walletGold: 10_000, crafts: 40, sellThroughPercent: 100 })!;
    expect(plan.affordableCrafts).toBe(5);
    expect(plan.feasibleCrafts).toBe(5);
    expect(plan.requested.profit).toBeGreaterThan(0);
    expect(plan.fits).toBe(false);
    expect(plan.feasibleCashAfterCraft).toBe(5815);
    expect(10_000 - 6 * 837).toBeLessThan(input.reserveGold);
  });
  it("fits the exact reserve boundary and rejects one copper less", () => {
    const plan = calculateWowBatchPlan({ ...input, walletGold: 21_740 })!;
    expect(plan.feasibleCrafts).toBe(20);
    expect(plan.feasibleCashAfterCraft).toBe(5000);
    expect(calculateWowBatchPlan({ ...input, walletGold: 21_739.9999 })!.feasibleCrafts).toBe(19);
  });
  it("does not create demand when requested or affordable batch size grows", () => {
    for (const crafts of [20, 40, 100]) {
      const plan = calculateWowBatchPlan({ ...input, crafts, salesMode: "observed", walletGold: 100_000 })!;
      expect(plan.requested.soldUnits).toBeCloseTo(70);
      expect(plan.feasible.soldUnits).toBeCloseTo(70);
    }
    const small = calculateWowBatchPlan({ ...input, crafts: 5, salesMode: "observed" })!;
    expect(small.requested.soldUnits).toBe(25);
    expect(small.requested.inventoryCost).toBe(0);
  });
  it("shows the larger inventory and lower cash for the same observed sales", () => {
    const small = calculateWowBatchPlan({ ...input, salesMode: "observed" })!;
    const big = calculateWowBatchPlan({ ...input, crafts: 40, salesMode: "observed", walletGold: 50_000 })!;
    expect(big.requested.saleProceeds).toBeCloseTo(small.requested.saleProceeds);
    expect(big.requested.inventoryCost - small.requested.inventoryCost).toBeCloseTo(16_500);
    expect(big.requested.cashChange).toBeLessThan(small.requested.cashChange);
  });
  it("accepts zero observed sales and preserves the reserve with no recovery", () => {
    const plan = calculateWowBatchPlan({ ...input, salesMode: "observed", observedSoldUnits: 0 })!;
    expect(plan.requested.soldUnits).toBe(0);
    expect(plan.requested.cashChange).toBe(-16_740);
    expect(plan.requestedEndCash).toBeGreaterThanOrEqual(input.reserveGold);
  });
  it("distinguishes no spare cash, an already short reserve, and free materials", () => {
    expect(calculateWowBatchPlan({ ...input, walletGold: 5000 })!.feasibleCrafts).toBe(0);
    const short = calculateWowBatchPlan({ ...input, walletGold: 4000 })!;
    expect(short.reserveAlreadyShort).toBe(true);
    expect(short.feasibleCashAfterCraft).toBe(4000);
    const free = calculateWowBatchPlan({ ...input, materialCostPerCraft: 0, depositPerListing: 0, walletGold: 5000 })!;
    expect(free.affordableCrafts).toBeNull();
    expect(free.fits).toBe(true);
  });
  it("rejects invalid, fractional and computationally unsafe inputs", () => {
    for (const patch of [{ walletGold: NaN }, { reserveGold: -1 }, { crafts: 0 }, { crafts: 1.5 }, { outputUnits: Infinity }, { outputUnits: 1e6, crafts: 2 }, { observedSoldUnits: -1 }, { observedSoldUnits: .5 }, { salePricePerUnit: 1e12 }]) {
      expect(calculateWowBatchPlan({ ...input, ...patch })).toBeNull();
    }
  });
  it("labels the supported count limit instead of producing an infinite craft maximum", () => {
    const plan = calculateWowBatchPlan({ ...input, materialCostPerCraft: Number.MIN_VALUE, depositPerListing: 0 })!;
    expect(Number.isFinite(plan.affordableCrafts)).toBe(true);
    expect(plan.affordableCrafts).toBe(200_000);
    expect(plan.affordableLimitReached).toBe(true);
    expect(plan.fits).toBe(true);
  });
  it("preserves legacy and percentage calculations with neutral stock", () => {
    expect(calculateWowBatchPlan({ ...input, existingStockUnits: 0 })).toEqual(calculateWowBatchPlan(input));
    expect(calculateWowBatchPlan({ ...input, existingStockUnits: 100 })).toEqual(calculateWowBatchPlan(input));
    const counted = { ...input, salesMode: "observed" as const };
    expect(calculateWowBatchPlan({ ...counted, existingStockUnits: 0 })).toEqual(calculateWowBatchPlan(counted));
  });
  it("allocates a shared sales count to stock before new crafts without charging for old stock", () => {
    const base = calculateWowBatchPlan({ ...input, salesMode: "observed" })!;
    const plan = calculateWowBatchPlan({ ...input, salesMode: "observed", existingStockUnits: 34 })!;
    expect(plan.salesAllocation).toEqual({ totalSalesCap: 70, existingStockUnits: 34, existingStockSales: 34, newSalesCap: 36, maxNewCraftsWithoutRemainder: 7 });
    expect(plan.salesFitCrafts).toBe(7);
    expect(plan.requested.soldUnits).toBeCloseTo(36);
    expect(plan.requested.inventoryCost).toBeCloseTo(64 * 165);
    expect(plan.requested.saleProceeds).toBeCloseTo(36 * 225 * .95);
    expect(plan.requested.upfrontGold).toBe(base.requested.upfrontGold);
    expect(plan.requestedCashAfterCraft).toBe(base.requestedCashAfterCraft);
    const resized = calculateWowBatchPlan({ ...input, salesMode: "observed", existingStockUnits: 34, crafts: plan.salesFitCrafts! })!;
    expect(resized.requested.units).toBe(35);
    expect(resized.requested.soldUnits).toBe(35);
    expect(resized.requested.inventoryCost).toBe(0);
  });
  it("leaves no new sales when old stock meets or exceeds the conditional count", () => {
    for (const existingStockUnits of [70, 100, 1e6]) {
      const plan = calculateWowBatchPlan({ ...input, salesMode: "observed", existingStockUnits })!;
      expect(plan.salesAllocation!.existingStockSales).toBe(70);
      expect(plan.salesAllocation!.newSalesCap).toBe(0);
      expect(plan.salesFitCrafts).toBe(0);
      expect(plan.requested.soldUnits).toBe(0);
      expect(plan.requested.saleProceeds).toBe(0);
      expect(plan.requested.cashChange).toBe(-16_740);
      expect(plan.requested.inventoryCost).toBe(16_500);
    }
  });
  it("rounds the stock-aware batch down to whole crafts and still respects available cash", () => {
    expect(calculateWowBatchPlan({ ...input, salesMode: "observed", existingStockUnits: 66 })!.salesFitCrafts).toBe(0);
    const poor = calculateWowBatchPlan({ ...input, salesMode: "observed", existingStockUnits: 34, walletGold: 8000 })!;
    expect(poor.salesFitCrafts).toBe(3);
    const resized = calculateWowBatchPlan({ ...input, salesMode: "observed", existingStockUnits: 34, walletGold: 8000, crafts: 3 })!;
    expect(resized.requested.soldUnits).toBe(15);
    expect(resized.requestedCashAfterCraft).toBeGreaterThanOrEqual(input.reserveGold);
  });
  it("reduces the total count before subtracting stock in the sales stress", () => {
    const cases = calculateWowBatchStressCases({ ...input, salesMode: "observed", existingStockUnits: 34 });
    expect(cases.fewerSales.soldUnits).toBeCloseTo(22);
    expect(cases.lowerPrice.soldUnits).toBeCloseTo(36);
    expect(calculateWowBatchStressCases({ ...input, salesMode: "observed", existingStockUnits: 60 }).fewerSales.soldUnits).toBe(0);
    expect(calculateWowBatchStressCases(input).fewerSales.soldUnits).toBeCloseTo(50);
  });
  it("rejects unsafe existing-stock counts without accepting null as legacy zero", () => {
    for (const existingStockUnits of [-1, .5, NaN, Infinity, 1_000_001, null]) {
      expect(calculateWowBatchPlan({ ...input, existingStockUnits } as WowBatchInput)).toBeNull();
    }
  });
});

describe("WoW actual outcome and deliberate next batch", () => {
  it("uses actual net proceeds and actual deposit losses exactly once", () => {
    const result = calculateWowBatchActual(input, actual)!;
    expect(result.cashChange).toBe(-3996);
    expect(result.inventoryUnits).toBe(40);
    expect(result.inventoryCost).toBe(6600);
    expect(result.profit).toBe(2604);
    expect(result.cashDifference).toBeCloseTo(-2386.5);
  });
  it("rejects impossible sales, deposits and positive proceeds without sales", () => {
    for (const patch of [{ soldUnits: 101 }, { soldUnits: -1 }, { soldUnits: .5 }, { netSaleProceeds: NaN }, { netSaleProceeds: -1 }, { lostDeposits: 241 }, { soldUnits: 0 }]) {
      expect(calculateWowBatchActual(input, { ...actual, ...patch })).toBeNull();
    }
    expect(calculateWowBatchActual(input, { soldUnits: 0, netSaleProceeds: 0, lostDeposits: 240 })!.profit).toBe(-240);
  });
  it("requires a fresh current wallet and seeds an absolute cap, never stock as cash", () => {
    const next = nextWowBatchAssumptions(input, actual, 12_345, 40)!;
    expect(next).toEqual({ walletGold: 12_345, existingStockUnits: 40, salesMode: "observed", observedSoldUnits: 60 });
    const nextPlan = calculateWowBatchPlan({ ...input, ...next, crafts: 100 })!;
    expect(nextPlan.requested.soldUnits).toBeCloseTo(20);
    expect(nextPlan.feasibleCrafts).toBe(8);
    expect(nextWowBatchAssumptions(input, actual, NaN, 0)).toBeNull();
    expect(nextWowBatchAssumptions(input, actual, -1, 0)).toBeNull();
    expect(nextWowBatchAssumptions(input, actual, 0, 0)?.walletGold).toBe(0);
    for (const stock of [-1, NaN, .5, undefined]) expect(nextWowBatchAssumptions(input, actual, 0, stock as number)).toBeNull();
  });
  it("keeps mixed-stock actuals scoped to the locked new batch", () => {
    const mixed = { ...input, salesMode: "observed" as const, existingStockUnits: 34 };
    const result = calculateWowBatchActual(mixed, actual)!;
    expect(result.cashChange).toBe(-3996);
    expect(result.inventoryUnits).toBe(40);
    expect(result.inventoryCost).toBe(6600);
    expect(calculateWowBatchActual(mixed, { ...actual, soldUnits: 120 })).toBeNull();
    expect(nextWowBatchAssumptions(mixed, actual, 12_345, 74)!.existingStockUnits).toBe(74);
  });
});

describe("WoW immutable local batch history", () => {
  it("preserves the locked forecast when the current editor changes and closes once", () => {
    const store = memory();
    const saved = record();
    expect(addWowBatchForecast(store, saved).ok).toBe(true);
    const token = wowBatchRecordToken(saved);
    saved.forecast.crafts = 40;
    expect(closeWowBatchForecast(store, saved.id, token, actual).ok).toBe(true);
    const loaded = readWowBatchJournal(store);
    if (!loaded.ok) throw new Error("expected stored record");
    expect(loaded.records[0]!.forecast.crafts).toBe(20);
    expect(loaded.records[0]!.actual).toEqual(actual);
    expect(closeWowBatchForecast(store, saved.id, token, { ...actual, soldUnits: 50 })).toEqual({ ok: false, error: "stale" });
  });
  it("does not resurrect a deleted record from a stale actual form", () => {
    const store = memory(); const saved = record(); const token = wowBatchRecordToken(saved);
    addWowBatchForecast(store, saved);
    expect(removeWowBatchRecord(store, saved.id, token).ok).toBe(true);
    expect(closeWowBatchForecast(store, saved.id, token, actual)).toEqual({ ok: false, error: "stale" });
    expect(readWowBatchJournal(store)).toEqual({ ok: true, records: [] });
  });
  it("rejects a stale deletion after another tab has completed the batch", () => {
    const store = memory(); const saved = record(); const token = wowBatchRecordToken(saved);
    addWowBatchForecast(store, saved); closeWowBatchForecast(store, saved.id, token, actual);
    expect(removeWowBatchRecord(store, saved.id, token)).toEqual({ ok: false, error: "stale" });
  });
  it("reads the latest store for every addition and never silently evicts history", () => {
    const store = memory();
    for (let n = 1; n <= 8; n++) expect(addWowBatchForecast(store, record(n)).ok).toBe(true);
    const before = store.getItem(WOW_BATCH_STORE_KEY);
    expect(addWowBatchForecast(store, record(9))).toEqual({ ok: false, error: "limit" });
    expect(store.getItem(WOW_BATCH_STORE_KEY)).toBe(before);
  });
  it("preserves malformed, future-schema, duplicate and oversized stores", () => {
    for (const raw of ["{bad", JSON.stringify({ version: 2, records: [] }), JSON.stringify({ version: 1, records: [record(), record()] }), JSON.stringify({ version: 1, records: [{ ...record(), forecast: { ...input, crafts: -1 } }] }), " ".repeat(100_001)]) {
      const store = memory(); store.setItem(WOW_BATCH_STORE_KEY, raw);
      expect(addWowBatchForecast(store, record(2))).toEqual({ ok: false, error: "corrupt" });
      expect(store.getItem(WOW_BATCH_STORE_KEY)).toBe(raw);
    }
  });
  it("reports unavailable reads and failed writes without claiming a save", () => {
    expect(readWowBatchJournal({ getItem: () => { throw new Error("denied"); }, setItem: () => {} })).toEqual({ ok: false, error: "unavailable" });
    expect(addWowBatchForecast({ getItem: () => null, setItem: () => { throw new Error("quota"); } }, record())).toEqual({ ok: false, error: "unavailable" });
  });
  it("cannot lock an unaffordable forecast or pre-date its outcome", () => {
    const store = memory();
    expect(addWowBatchForecast(store, { ...record(), forecast: { ...input, walletGold: 0 } })).toEqual({ ok: false, error: "invalid" });
    const saved = record(); addWowBatchForecast(store, saved);
    expect(closeWowBatchForecast(store, saved.id, wowBatchRecordToken(saved), { ...actual, recordedAt: "2026-09-07T12:00:00.000Z" })).toEqual({ ok: false, error: "invalid" });
  });
  it("keeps full RU and EN copy parity", () => {
    expect(Object.keys(wowBatchPlannerCopy.ru).sort()).toEqual(Object.keys(wowBatchPlannerCopy.en).sort());
  });
  it("reads historical stock-free records unchanged and locks the new stock assumption", () => {
    const store = memory();
    const legacy = record();
    const mixed = { ...record(2), forecast: { ...input, salesMode: "observed" as const, existingStockUnits: 34 } };
    expect(addWowBatchForecast(store, legacy).ok).toBe(true);
    expect(addWowBatchForecast(store, mixed).ok).toBe(true);
    mixed.forecast.existingStockUnits = 100;
    const loaded = readWowBatchJournal(store);
    if (!loaded.ok) throw new Error("expected stored records");
    expect(loaded.records[1]).toEqual(legacy);
    expect(loaded.records[0]!.forecast.existingStockUnits).toBe(34);
    expect(calculateWowBatchPlan(loaded.records[0]!.forecast)!.requested.soldUnits).toBeCloseTo(36);
  });
});
