import { describe, expect, it } from "vitest";
import { getGoalPlannerPath, goalPlannerList } from "../src/data/goal-planners";
import { insights } from "../src/data/insights";
import { calculateRunway } from "../src/lib/runway";

describe("goal runway calculation", () => {
  it("treats a target as funded only after the protected reserve", () => {
    const result = calculateRunway({ current: 1200, target: 1000, reserve: 200, rate: 0, horizon: 0 });
    expect(result.state).toBe("funded");
    expect(result.gap).toBe(0);
    expect(result.progress).toBe(1);
  });

  it("returns pace, projection and positive slack for an on-track case", () => {
    const result = calculateRunway({ current: 250, target: 1000, reserve: 250, rate: 250, horizon: 5 });
    expect(result.state).toBe("on-track");
    expect(result.gap).toBe(1000);
    expect(result.periods).toBe(4);
    expect(result.requiredRate).toBe(200);
    expect(result.projected).toBe(1500);
    expect(result.slack).toBe(250);
  });

  it("separates a narrow miss from a plan that needs rebuilding", () => {
    expect(calculateRunway({ current: 0, target: 1000, reserve: 0, rate: 220, horizon: 4 }).state).toBe("close");
    expect(calculateRunway({ current: 0, target: 1000, reserve: 0, rate: 100, horizon: 4 }).state).toBe("off-track");
  });

  it("handles a zero pace without hiding the shortfall", () => {
    const result = calculateRunway({ current: 100, target: 1000, reserve: 100, rate: 0, horizon: 4 });
    expect(result.state).toBe("off-track");
    expect(result.periods).toBe(Number.POSITIVE_INFINITY);
    expect(result.projected).toBe(100);
    expect(result.slack).toBe(-1000);
  });
});

describe("v1.10 game-native goal planners", () => {
  it("ships one localized standalone planner per economy", () => {
    expect(goalPlannerList).toHaveLength(5);

    goalPlannerList.forEach((planner) => {
      expect(planner.fields.length).toBeGreaterThanOrEqual(5);
      expect(planner.title.ru.length).toBeGreaterThan(20);
      expect(planner.title.en.length).toBeGreaterThan(20);
      expect(planner.steps).toHaveLength(3);
      expect(getGoalPlannerPath(planner.hub, "ru")).toMatch(/^\/(?:gta-online|dota-2|wow|total-war|crusader-kings-3)\/goal-planner\/$/u);
      expect(getGoalPlannerPath(planner.hub, "en")).toMatch(/^\/en\/(?:gta-online|dota-2|wow|total-war|crusader-kings-3)\/goal-planner\/$/u);
      expect(insights.some((insight) => insight.slug === planner.guideSlug && insight.toolPath.ru === getGoalPlannerPath(planner.hub, "ru"))).toBe(true);
    });
  });

  it("keeps match timing distinct from campaign and market horizons", () => {
    const dota = goalPlannerList.find((planner) => planner.hub === "dota")!;
    const wow = goalPlannerList.find((planner) => planner.hub === "wow")!;
    const totalWar = goalPlannerList.find((planner) => planner.hub === "total-war")!;
    const ck3 = goalPlannerList.find((planner) => planner.hub === "ck3")!;

    expect(dota.fields.map((field) => field.role)).toEqual(["current", "target", "reserve", "rate", "clock", "deadline"]);
    expect(wow.periodShort.ru).toBe("ч");
    expect(totalWar.periodShort.ru).toContain("ход");
    expect(ck3.periodShort.ru).toContain("мес");
  });
});
