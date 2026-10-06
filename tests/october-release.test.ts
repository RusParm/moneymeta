import { describe, expect, it } from "vitest";
import { weeklyMeta } from "../src/data/gta-businesses";
import { calculateGtaWeeklyPlan } from "../src/lib/gta-weekly";
import { getDotaDraftProfileReview } from "../src/data/dota-draft-profiles";

describe("October release boundaries", () => {
  it("keeps the weekly bounty bonus distinct from the month-long reward", () => {
    const input = { route: weeklyMeta.opportunities[0]!, validThrough: weeklyMeta.validThrough,
      hoursAvailable: 1, routineHourly: 300000, basePayoutPerRun: 20000, minutesPerRun: 20,
      switchMinutes: 10, confidencePercent: 100, minimumLiftPercent: 15, ownsRequiredAsset: true,
      asOf: new Date("2026-10-06T12:00:00Z") };
    expect(calculateGtaWeeklyPlan(input).expectedRouteCash).toBe(80000);
    expect(calculateGtaWeeklyPlan({ ...input, rewardEligible: true }).expectedRouteCash).toBe(180000);
    expect(calculateGtaWeeklyPlan({ ...input, hoursAvailable: 3, rewardEligible: true }).fixedReward).toBe(100000);
    expect(calculateGtaWeeklyPlan({ ...input, hoursAvailable: 0.5, rewardEligible: true }).fixedReward).toBe(0);
    expect(calculateGtaWeeklyPlan({ ...input, rewardEligible: true, ownsRequiredAsset: false }).status).toBe("ineligible");
    expect(calculateGtaWeeklyPlan({ ...input, rewardEligible: true, asOf: new Date("2026-10-08T00:00:00Z") }).status).toBe("expired");
  });
  it("accepts reviewed October matches without rewriting September provenance or future coverage", () => {
    const at = (date: string) => Date.parse(date) / 1000;
    expect(getDotaDraftProfileReview(60, at("2026-09-18T12:00:00Z"))?.checkedAt).toBe("2026-09-18");
    expect(getDotaDraftProfileReview(60, at("2026-10-06T12:00:00Z"))?.checkedAt).toBe("2026-10-06");
    expect(getDotaDraftProfileReview(60, at("2026-10-07T00:00:00Z"))).toBeUndefined();
    expect(getDotaDraftProfileReview(61, at("2026-10-06T12:00:00Z"))).toBeUndefined();
  });
});
