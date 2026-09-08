import { describe, expect, it } from "vitest";
import { homeDecisionExamples, type HomeExampleGame } from "../src/data/home-decision-examples";
import { getScenarioTool } from "../src/data/scenario-tools";
import { goalPlanners } from "../src/data/goal-planners";
import { totalWarHub, crusaderKingsHub } from "../src/data/strategy-hubs";
import { calculateHomeDecisionExample, homeExampleDefault } from "../src/lib/home-decision-examples";
import { calculateReserveMetrics } from "../src/lib/strategy-economy";

const targetSources = import.meta.glob([
  "../src/components/WowCalculators.astro", "../src/components/WowBatchPlanner.astro"
], { eager: true, import: "default", query: "?raw" }) as Record<string, string>;

function result(game: HomeExampleGame, value: number | string) {
  const result = calculateHomeDecisionExample(game, value, "en");
  if (!result.valid) throw new Error("Expected a valid example");
  return result;
}

describe("consequential homepage examples", () => {
  it("shows profit without pretending unsold WoW stock is spendable gold", () => {
    const current = result("wow", 70);
    expect(current.metrics[0].value).toBeCloseTo(3340.5);
    expect(current.metrics[1].value).toBeCloseTo(-1609.5);
    expect(current.state).toBe("caution");
    expect(result("wow", 77).metrics[1].value).toBeLessThan(0);
    expect(result("wow", 78).metrics[1].value).toBeGreaterThan(0);
    expect(result("wow", 100).metrics[1].value).toBe(4875);
    expect(result("wow", 0).metrics[1].value).toBe(-16740);
  });
  it("keeps a GTA reserve in both the shortfall and the affordable case", () => {
    expect(result("gta", 4).metrics.map((metric) => metric.value)).toEqual([3850000, -400000]);
    expect(result("gta", 5).metrics.map((metric) => metric.value)).toEqual([4500000, 250000]);
  });
  it("changes the army decision when the campaign crosses the reserve boundary", () => {
    expect(result("total-war", 8).metrics.map((metric) => metric.value)).toEqual([1900, -1100]);
    expect(result("total-war", 6).state).toBe("positive");
    expect(result("total-war", 7).state).toBe("caution");
    expect(result("ck3", 38).metrics.map((metric) => metric.value)).toEqual([174, -76]);
    expect(result("ck3", 34).state).toBe("positive");
    expect(result("ck3", 35).state).toBe("caution");
  });
  it("the displayed CK3 whole-gold spending cap preserves the reserve; the next gold does not", () => {
    const example = result("ck3", 38);
    const displayedCap = Number(example.consequence.match(/within ([\d,]+) gold/)?.[1]?.replaceAll(",", ""));
    expect(Number.isFinite(displayedCap)).toBe(true);
    const input = example.values;
    const atTotalSpend = (total: number) => calculateReserveMetrics({
      treasury: input.treasury!, incomePerPeriod: input.incomePerPeriod!,
      currentOutflow: input.currentOutflow!, newOutflow: total - input.currentOutflow!,
      oneOffCost: input.oneOffCost!, horizonPeriods: input.horizonPeriods!, reserve: input.reserve!
    });
    expect(atTotalSpend(displayedCap).buffer).toBeGreaterThanOrEqual(0);
    expect(atTotalSpend(displayedCap + 1).buffer).toBeLessThan(0);
  });
  it("Civ changes the leading option with the deadline without subtracting production from science", () => {
    expect(result("civ7", 10).metrics.map((metric) => metric.value)).toEqual([35, 24]);
    expect(result("civ7", 14).metrics.map((metric) => metric.value)).toEqual([55, 56]);
    expect(result("civ7", 20).metrics.map((metric) => metric.value)).toEqual([85, 104]);
    expect(result("civ7", 3).metrics.map((metric) => metric.value)).toEqual([0, 0]);
    expect(result("civ7", 20).consequence).toContain("120 more production");
  });
  it.each(Object.keys(homeDecisionExamples) as HomeExampleGame[])("%s rejects unusable input without emitting a result or handoff", (game) => {
    const config = homeDecisionExamples[game];
    for (const raw of ["", " ", "invalid", "Infinity", Infinity, NaN, config.min - 1, config.max + 1]) {
      expect(calculateHomeDecisionExample(game, raw, "ru")).toEqual({ valid: false });
    }
    if (config.step !== "any") expect(calculateHomeDecisionExample(game, 1.5, "ru")).toEqual({ valid: false });
  });
});

describe("exact full-model handoff", () => {
  it.each(Object.keys(homeDecisionExamples) as HomeExampleGame[])("%s includes every case input and the registered panel in both languages", (game) => {
    const config = homeDecisionExamples[game];
    const tool = getScenarioTool(config.toolKey)!;
    for (const lang of ["ru", "en"] as const) {
      const calculated = calculateHomeDecisionExample(game, homeExampleDefault(game) + 1, lang);
      if (!calculated.valid) throw new Error("Invalid default");
      const url = new URL(calculated.href, "https://themoneymeta.com");
      expect(url.pathname).toBe(`${lang === "en" ? "/en" : ""}${tool.path}`);
      expect(url.hash).toBe(`#${tool.anchor}`);
      expect(url.searchParams.size).toBe(config.fields.length + Object.keys(config.fixedParameters ?? {}).length);
      Object.entries(config.fixedParameters ?? {}).forEach(([key, value]) => {
        expect(url.searchParams.get(`${tool.key}.${key}`)).toBe(value);
      });
      config.fields.forEach((field) => {
        expect(url.searchParams.get(`${tool.key}.${field.key}`)).toBe(String(calculated.values[field.key]));
      });
      expect(Number(url.searchParams.get(`${tool.key}.${config.inputKey}`))).toBe(homeExampleDefault(game) + 1);
    }
  });
  it("field names stay aligned with the actual target controls, not just the example config", () => {
    const configured = (game: HomeExampleGame) => homeDecisionExamples[game].fields.map((field) => field.key).sort();
    expect(configured("gta")).toEqual(goalPlanners.gta.fields.map((field) => field.role).sort());
    expect(configured("total-war")).toEqual(totalWarHub.models.find((model) => model.id === "war-reserve")!.inputs.map((field) => field.key).sort());
    expect(configured("ck3")).toEqual(crusaderKingsHub.models.find((model) => model.id === "war-chest")!.inputs.map((field) => field.key).sort());
    const controls = (path: string, pattern: RegExp) => [...(targetSources[path] ?? "").matchAll(pattern)].map((match) => match[1]!).sort();
    expect(configured("wow")).toEqual(controls("../src/components/WowCalculators.astro", /<input[^>]*data-role="(craft-[^"]+)"/g));
    const wowExtras = Object.keys(homeDecisionExamples.wow.fixedParameters ?? {}).sort();
    expect(wowExtras).toEqual(controls("../src/components/WowBatchPlanner.astro", /<(?:input|select)[^>]*data-role="(craft-[^"]+)"/g));
  });
});
