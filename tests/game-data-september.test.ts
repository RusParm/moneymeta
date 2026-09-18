import { describe, expect, it } from "vitest";
import { dotaItems, dotaItemsSnapshot } from "../src/data/dota-items";
import { calculateItemPlan, calculateGoldEfficiency } from "../src/lib/dota-items";
import { weeklyMeta } from "../src/data/gta-businesses";
import { calculateGtaWeeklyPlan } from "../src/lib/gta-weekly";
import { scenarioContexts } from "../src/data/scenario-context";
import { createDotaItemQueries } from "../scripts/dota-items/queries.mjs";
import { dotaItemsConfig } from "../scripts/dota-items/config.mjs";

describe("September live data versus historical observations", () => {
  it("uses current component costs once without rewriting the archived cohort", () => {
    const rows = calculateItemPlan(dotaItems, { role: "core", currentMinute: 0, goldPerMinute: 500,
      startingGold: 0, itemKeys: ["dragon_lance", "hurricane_pike"] });
    expect(rows.map((r) => r.incrementalCost)).toEqual([2000, 2550]);
    expect(rows[1]!.projectedMinute).toBe(9.1);
    expect(dotaItemsSnapshot.items.find((i) => i.key === "dragon_lance")!.cost).toBe(1900);
    expect(dotaItemsSnapshot.patch.label).toBe("7.41e");
    expect(dotaItems.find((i) => i.key === "dragon_lance")!.timings).toEqual(dotaItemsSnapshot.items.find((i) => i.key === "dragon_lance")!.timings);
    expect(scenarioContexts("en")["dota-item-plan"]).toContain("7.41f");
    expect(scenarioContexts("en")["dota-item-plan"]).toContain("OpenDota 7.41e");
  });

  it("revalues reduced lifesteal and fixes changed ability text", () => {
    const old = dotaItemsSnapshot.items.find((i) => i.key === "mask_of_madness")!;
    const live = dotaItems.find((i) => i.key === "mask_of_madness")!;
    expect(calculateGoldEfficiency(old).pricedValue - calculateGoldEfficiency(live).pricedValue).toBeCloseTo(100);
    expect(dotaItems.find((i) => i.key === "manta")!.abilities[0]!.description).toContain("25%");
    expect(dotaItems.find((i) => i.key === "heart")!.cost).toBe(5300);
    expect(dotaItems.find((i) => i.key === "hydras_breath")!.cost).toBe(5900);
  });

  it("keeps later matches out of both archived cohort queries", () => {
    const queries = createDotaItemQueries(dotaItemsConfig);
    for (const sql of Object.values(queries)) expect(sql).toContain("m.start_time < extract(epoch from timestamptz '2026-09-15T00:00:00.000Z')");
  });
});

describe("Gunrunning reward eligibility", () => {
  const input = { route: weeklyMeta.opportunities[0]!, validThrough: weeklyMeta.validThrough,
    hoursAvailable: 1, routineHourly: 300000, basePayoutPerRun: 20000, minutesPerRun: 15,
    switchMinutes: 10, confidencePercent: 100, minimumLiftPercent: 15, ownsRequiredAsset: true,
    asOf: new Date("2026-09-18T12:00:00Z") };

  it("requires explicit eligibility and counts the million only once", () => {
    expect(calculateGtaWeeklyPlan(input).expectedRouteCash).toBe(120000);
    expect(calculateGtaWeeklyPlan({ ...input, rewardEligible: false }).fixedReward).toBe(0);
    expect(calculateGtaWeeklyPlan({ ...input, rewardEligible: true }).expectedRouteCash).toBe(1120000);
    expect(calculateGtaWeeklyPlan({ ...input, hoursAvailable: 3, rewardEligible: true }).fixedReward).toBe(1000000);
  });

  it("excludes the reward below three runs, without access, or after expiry", () => {
    expect(calculateGtaWeeklyPlan({ ...input, hoursAvailable: 0.7, rewardEligible: true }).fixedReward).toBe(0);
    expect(calculateGtaWeeklyPlan({ ...input, ownsRequiredAsset: false, rewardEligible: true }).status).toBe("ineligible");
    expect(calculateGtaWeeklyPlan({ ...input, rewardEligible: true, asOf: new Date("2026-09-24T00:00:00Z") }).status).toBe("expired");
  });
});
