import { describe, expect, it } from "vitest";
import { calculateGtaWeeklyPlan, getGtaWeeklyRunNoun, type GtaWeeklyRouteFacts } from "../src/lib/gta-weekly";

const route: GtaWeeklyRouteFacts = { id: "race", multiplier: 3 };
const current = new Date("2026-09-01T12:00:00Z");
const base = {
  route,
  validThrough: "2026-09-02",
  hoursAvailable: 3,
  routineHourly: 300_000,
  basePayoutPerRun: 50_000,
  minutesPerRun: 15,
  switchMinutes: 10,
  confidencePercent: 80,
  minimumLiftPercent: 15,
  ownsRequiredAsset: true,
  asOf: current
};

describe("GTA weekly plan", () => {
  it("uses the correct Russian run noun", () => {
    expect([1, 2, 5, 11, 21, 22, 25].map((count) => getGtaWeeklyRunNoun(count, "ru"))).toEqual([
      "заход",
      "захода",
      "заходов",
      "заходов",
      "заход",
      "захода",
      "заходов"
    ]);
  });

  it("uses singular and plural English run nouns", () => {
    expect(getGtaWeeklyRunNoun(1, "en")).toBe("run");
    expect(getGtaWeeklyRunNoun(2, "en")).toBe("runs");
  });

  it("fails closed after the verified window", () => {
    expect(calculateGtaWeeklyPlan({ ...base, asOf: new Date("2026-09-03T00:00:00Z") }).status).toBe("expired");
  });

  it("asks for observed player inputs instead of inventing a result", () => {
    const result = calculateGtaWeeklyPlan({ ...base, basePayoutPerRun: 0 });
    expect(result.status).toBe("incomplete");
    expect(result.expectedRouteCash).toBe(0);
  });

  it("blocks an asset-gated route when the player does not own it", () => {
    const result = calculateGtaWeeklyPlan({
      ...base,
      route: { id: "contract", multiplier: 2, requiredAsset: "auto-shop" },
      ownsRequiredAsset: false
    });
    expect(result.status).toBe("ineligible");
  });

  it("reports no fit when the session cannot hold one run", () => {
    const result = calculateGtaWeeklyPlan({ ...base, hoursAvailable: 0.25, minutesPerRun: 20, switchMinutes: 5 });
    expect(result.status).toBe("no-fit");
    expect(result.usableMinutes).toBe(10);
  });

  it("recommends switching only after the player's lift threshold", () => {
    const result = calculateGtaWeeklyPlan(base);
    expect(result.runs).toBe(11);
    expect(result.rawRouteCash).toBe(1_650_000);
    expect(result.expectedRouteCash).toBe(1_320_000);
    expect(result.routineAlternative).toBe(900_000);
    expect(result.targetRouteCash).toBeCloseTo(1_035_000, 4);
    expect(result.status).toBe("switch");
  });

  it("keeps a positive but sub-threshold route in the close state", () => {
    const result = calculateGtaWeeklyPlan({ ...base, basePayoutPerRun: 36_000 });
    expect(result.expectedRouteCash).toBeGreaterThan(result.routineAlternative);
    expect(result.expectedRouteCash).toBeLessThan(result.targetRouteCash);
    expect(result.status).toBe("close");
  });

  it("keeps the normal route when expected weekly cash is lower", () => {
    expect(calculateGtaWeeklyPlan({ ...base, basePayoutPerRun: 25_000 }).status).toBe("stay");
  });

  it("applies the Drift challenge reward only at three completed runs", () => {
    const drift = { id: "drift", multiplier: 2, fixedReward: 100_000, requiredRunsForReward: 3 };
    const twoRuns = calculateGtaWeeklyPlan({ ...base, route: drift, hoursAvailable: 0.7, minutesPerRun: 15, switchMinutes: 10 });
    const threeRuns = calculateGtaWeeklyPlan({ ...base, route: drift, hoursAvailable: 1, minutesPerRun: 15, switchMinutes: 10 });
    expect(twoRuns.runs).toBe(2);
    expect(twoRuns.fixedReward).toBe(0);
    expect(threeRuns.runs).toBe(3);
    expect(threeRuns.fixedReward).toBe(100_000);
  });

  it("solves the observed base payout required to beat the target", () => {
    const result = calculateGtaWeeklyPlan(base);
    expect(result.requiredBasePayoutPerRun).toBeCloseTo(39_204.545, 2);
  });
});
